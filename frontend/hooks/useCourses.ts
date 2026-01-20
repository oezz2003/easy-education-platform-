'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Course, CreateCourseInput } from '@/types/database';

interface CoursesState {
    courses: Course[];
    isLoading: boolean;
    error: string | null;
}

interface CoursesFilter {
    level?: string;
    subject?: string;
    status?: string;
    search?: string;
    teacherId?: string;
}

export function useCourses(filter?: CoursesFilter) {
    const [state, setState] = useState<CoursesState>({
        courses: [],
        isLoading: true,
        error: null,
    });

    const supabase = getSupabaseClient();

    // Fetch courses
    const fetchCourses = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));

        // If teacherId is provided, we need to get courses linked via batches
        if (filter?.teacherId) {
            // First get batch course_ids for this teacher
            const { data: batchData, error: batchError } = await supabase
                .from('batches')
                .select('course_id')
                .eq('teacher_id', filter.teacherId);

            if (batchError) {
                setState({ courses: [], isLoading: false, error: batchError.message });
                return;
            }

            const courseIds = Array.from(new Set((batchData || []).map((b: { course_id: string }) => b.course_id)));

            if (courseIds.length === 0) {
                setState({ courses: [], isLoading: false, error: null });
                return;
            }

            let query = supabase
                .from('courses')
                .select('*')
                .in('id', courseIds)
                .order('created_at', { ascending: false });

            // Apply other filters
            if (filter?.level) query = query.eq('level', filter.level);
            if (filter?.subject) query = query.eq('subject', filter.subject);
            if (filter?.status) query = query.eq('status', filter.status);
            if (filter?.search) query = query.ilike('name', `%${filter.search}%`);

            const { data, error } = await query;
            if (error) {
                setState({ courses: [], isLoading: false, error: error.message });
            } else {
                setState({ courses: data || [], isLoading: false, error: null });
            }
            return;
        }

        // Default: fetch all courses (for admin)
        let query = supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false });

        // Apply filters
        if (filter?.level) {
            query = query.eq('level', filter.level);
        }
        if (filter?.subject) {
            query = query.eq('subject', filter.subject);
        }
        if (filter?.status) {
            query = query.eq('status', filter.status);
        }
        if (filter?.search) {
            query = query.ilike('name', `%${filter.search}%`);
        }

        const { data, error } = await query;

        if (error) {
            setState({ courses: [], isLoading: false, error: error.message });
        } else {
            setState({ courses: data || [], isLoading: false, error: null });
        }
    }, [supabase, filter?.level, filter?.subject, filter?.status, filter?.search, filter?.teacherId]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    // Get single course
    const getCourse = async (id: string) => {
        const { data, error } = await supabase
            .from('courses')
            .select(`
                *,
                batches (
                    *,
                    teacher:teacher_profiles (
                        *,
                        profile:profiles (*)
                    )
                )
            `)
            .eq('id', id)
            .single();

        if (error) {
            return { data: null, error: error.message };
        }
        return { data, error: null };
    };

    // Create course
    // Create course
    const createCourse = async (input: CreateCourseInput) => {
        const payload = { ...input, status: input.status || 'active' };
        console.log('Creating course with payload:', payload);

        const { data, error } = await supabase
            .from('courses')
            .insert(payload)
            .select()
            .single();

        if (error) {
            console.error('Error creating course:', error);
            return { success: false, error: error.message };
        }

        if (!data) {
            console.error('Course created but no data returned (check RLS policies)');
            // We can still return success, but we can't update the local list immediately without data
            // Optionally trigger a refetch
            fetchCourses();
            return { success: true, data: null };
        }

        setState(prev => ({
            ...prev,
            courses: [data, ...prev.courses],
        }));
        return { success: true, data };
    };

    // Update course
    const updateCourse = async (id: string, updates: Partial<CreateCourseInput>) => {
        const { data, error } = await supabase
            .from('courses')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        setState(prev => ({
            ...prev,
            courses: prev.courses.map(c => c.id === id ? data : c),
        }));
        return { success: true, data };
    };

    // Delete course
    const deleteCourse = async (id: string) => {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', id);

        if (error) {
            return { success: false, error: error.message };
        }

        setState(prev => ({
            ...prev,
            courses: prev.courses.filter(c => c.id !== id),
        }));
        return { success: true };
    };

    return {
        courses: state.courses,
        isLoading: state.isLoading,
        error: state.error,
        refetch: fetchCourses,
        getCourse,
        createCourse,
        updateCourse,
        deleteCourse,
    };
}
