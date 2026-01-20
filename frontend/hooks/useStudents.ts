'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { StudentWithProfile, Level, EnrollmentStatus } from '@/types/database';

interface StudentsState {
    students: StudentWithProfile[];
    isLoading: boolean;
    error: string | null;
}

interface StudentsFilter {
    level?: Level;
    search?: string;
    batchId?: string;
    status?: 'active' | 'inactive';
    teacherId?: string;
}

interface CreateStudentInput {
    name: string;
    email: string;
    phone?: string;
    level: Level;
    parentPhone?: string;
}

export function useStudents(filter?: StudentsFilter) {
    const [state, setState] = useState<StudentsState>({
        students: [],
        isLoading: true,
        error: null,
    });

    const supabase = getSupabaseClient();

    // Fetch students
    const fetchStudents = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));

        // If teacherId is provided, get students enrolled in teacher's batches
        if (filter?.teacherId) {
            // First get batch IDs for this teacher
            const { data: batchData, error: batchError } = await supabase
                .from('batches')
                .select('id')
                .eq('teacher_id', filter.teacherId);

            if (batchError) {
                setState({ students: [], isLoading: false, error: batchError.message });
                return;
            }

            const batchIds = (batchData || []).map((b: { id: string }) => b.id);

            if (batchIds.length === 0) {
                setState({ students: [], isLoading: false, error: null });
                return;
            }

            // Get enrollments for these batches
            const { data: enrollmentData, error: enrollmentError } = await supabase
                .from('batch_enrollments')
                .select('student_id')
                .in('batch_id', batchIds)
                .eq('status', 'active');

            if (enrollmentError) {
                setState({ students: [], isLoading: false, error: enrollmentError.message });
                return;
            }

            const studentIds = Array.from(new Set((enrollmentData || []).map((e: { student_id: string }) => e.student_id)));

            if (studentIds.length === 0) {
                setState({ students: [], isLoading: false, error: null });
                return;
            }

            let query = supabase
                .from('student_profiles')
                .select(`
                    *,
                    profile:profiles!inner(*)
                `)
                .in('id', studentIds)
                .eq('profile.role', 'student')
                .order('created_at', { ascending: false });

            if (filter?.level) query = query.eq('level', filter.level);
            if (filter?.search) query = query.or(`profile.full_name.ilike.%${filter.search}%,profile.email.ilike.%${filter.search}%`);

            const { data, error } = await query;
            if (error) {
                setState({ students: [], isLoading: false, error: error.message });
            } else {
                setState({ students: data || [], isLoading: false, error: null });
            }
            return;
        }

        // Default: fetch all students (for admin)
        let query = supabase
            .from('student_profiles')
            .select(`
                *,
                profile:profiles!inner(*)
            `)
            .eq('profile.role', 'student')
            .order('created_at', { ascending: false });

        // Apply filters
        if (filter?.level) {
            query = query.eq('level', filter.level);
        }
        if (filter?.search) {
            query = query.or(`profile.full_name.ilike.%${filter.search}%,profile.email.ilike.%${filter.search}%`);
        }

        const { data, error } = await query;

        if (error) {
            setState({ students: [], isLoading: false, error: error.message });
        } else {
            setState({ students: data || [], isLoading: false, error: null });
        }
    }, [supabase, filter?.level, filter?.search, filter?.batchId, filter?.status, filter?.teacherId]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // Get single student with enrollments
    const getStudent = useCallback(async (id: string) => {
        const { data, error } = await supabase
            .from('student_profiles')
            .select(`
                *,
                profile:profiles (*),
                enrollments:batch_enrollments (
                    *,
                    batch:batches (
                        *,
                        course:courses (*),
                        teacher:teacher_profiles (
                            *,
                            profile:profiles (*)
                        )
                    )
                )
            `)
            .eq('id', id)
            .single();

        if (error) {
            return { data: null, error: error.message };
        }
        return { data, error: null };
    }, [supabase]);

    // Get student by user ID
    const getStudentByUserId = useCallback(async (userId: string) => {
        const { data, error } = await supabase
            .from('student_profiles')
            .select(`
                *,
                profile:profiles (*)
            `)
            .eq('user_id', userId)
            .single();

        if (error) {
            return { data: null, error: error.message };
        }
        return { data, error: null };
    }, [supabase]);

    // Update student profile
    const updateStudent = useCallback(async (id: string, updates: Partial<{ level: Level; parent_phone: string }>) => {
        const { data, error } = await supabase
            .from('student_profiles')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        await fetchStudents();
        return { success: true, data };
    }, [supabase, fetchStudents]);

    // Get students by batch
    const getStudentsByBatch = useCallback(async (batchId: string) => {
        const { data, error } = await supabase
            .from('batch_enrollments')
            .select(`
                *,
                student:student_profiles (
                    *,
                    profile:profiles (*)
                )
            `)
            .eq('batch_id', batchId)
            .eq('status', 'active');

        if (error) {
            return { data: null, error: error.message };
        }
        return { data: data?.map((e: { student: StudentWithProfile }) => e.student) || [], error: null };
    }, [supabase]);

    // Update XP points
    const addXP = useCallback(async (studentId: string, xpAmount: number) => {
        // Note: We can't easily access current state inside useCallback without adding it to dependency
        // But adding state to dependency will cause re-creation on every state change.
        // Better to fetch fresh data or rely on DB update.
        // Here we'll just update DB and refetch.

        // First get current XP to add to it, or just increment if DB supports it (Supabase doesn't have atomic increment easily via client)
        // So we fetch specific student first
        const { data: student, error: fetchError } = await supabase
            .from('student_profiles')
            .select('xp_points')
            .eq('id', studentId)
            .single();

        if (fetchError || !student) return { success: false, error: 'Student not found' };

        const { error } = await supabase
            .from('student_profiles')
            .update({ xp_points: (student.xp_points || 0) + xpAmount })
            .eq('id', studentId);

        if (error) {
            return { success: false, error: error.message };
        }

        await fetchStudents();
        return { success: true };
    }, [supabase, fetchStudents]);

    // Delete student profile
    const deleteStudent = useCallback(async (id: string) => {
        const { error } = await supabase
            .from('student_profiles')
            .delete()
            .eq('id', id);

        if (error) {
            return { success: false, error: error.message };
        }

        setState(prev => ({
            ...prev,
            students: prev.students.filter(s => s.id !== id),
        }));
        return { success: true };
    }, [supabase]);

    // Create student (admin creates profile, user sets password via invite)
    const createStudent = useCallback(async (input: CreateStudentInput) => {
        // First, create a profile entry (user_id will be set when student registers)
        // For now, we create the profile without auth user - student will claim it
        const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';

        // Sign up new user via Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: input.email,
            password: tempPassword,
            options: {
                data: {
                    role: 'student',
                    full_name: input.name,
                },
            },
        });

        if (authError) {
            return { success: false, error: authError.message };
        }

        if (!authData.user) {
            return { success: false, error: 'Failed to create user' };
        }

        // Create student profile linked to the new user
        const { error: profileError } = await supabase
            .from('student_profiles')
            .insert({
                user_id: authData.user.id,
                level: input.level,
                parent_phone: input.parentPhone || null,
            });

        if (profileError) {
            return { success: false, error: profileError.message };
        }

        await fetchStudents();
        return { success: true, data: authData.user };
    }, [supabase, fetchStudents]);

    // Get student credentials (admin only)
    const getStudentCredentials = useCallback(async (userId: string) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}/credentials`);
            const result = await response.json();

            if (!response.ok) {
                return { data: null, error: result.error };
            }

            return { data: result, error: null };
        } catch (error: any) {
            return { data: null, error: error.message };
        }
    }, []);

    return {
        students: state.students,
        isLoading: state.isLoading,
        error: state.error,
        refetch: fetchStudents,
        getStudent,
        getStudentByUserId,
        updateStudent,
        getStudentsByBatch,
        addXP,
        deleteStudent,
        createStudent,
        getStudentCredentials,
    };
}
