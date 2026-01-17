'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { TeacherProfile, TeacherWithProfile, Profile } from '@/types/database';

interface TeachersState {
    teachers: TeacherWithProfile[];
    isLoading: boolean;
    error: string | null;
}

interface TeachersFilter {
    subject?: string;
    search?: string;
}

interface CreateTeacherInput {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    bio?: string;
}

export function useTeachers(filter?: TeachersFilter) {
    const [state, setState] = useState<TeachersState>({
        teachers: [],
        isLoading: true,
        error: null,
    });

    const supabase = getSupabaseClient();

    // Fetch teachers
    const fetchTeachers = useCallback(async () => {
        const controller = new AbortController();
        const signal = controller.signal;

        try {
            setState(prev => ({ ...prev, isLoading: true }));

            let query = supabase
                .from('teacher_profiles')
                .select(`
                    *,
                    profile:profiles!inner(*)
                `)
                .eq('profile.role', 'teacher')
                .order('rating', { ascending: false });

            // Apply filters
            if (filter?.subject) {
                query = query.eq('subject', filter.subject);
            }
            if (filter?.search) {
                query = query.or(`profile.full_name.ilike.%${filter.search}%,subject.ilike.%${filter.search}%`);
            }

            const { data, error } = await query.abortSignal(signal);

            if (!signal.aborted) {
                if (error) {
                    setState({ teachers: [], isLoading: false, error: error.message });
                } else {
                    setState({ teachers: data || [], isLoading: false, error: null });
                }
            }
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                setState(prev => ({ ...prev, isLoading: false, error: err.message }));
            }
        }

        return () => controller.abort();
    }, [supabase, filter?.subject, filter?.search]);

    useEffect(() => {
        const abort = fetchTeachers();
        return () => {
            abort.then(cancel => cancel && cancel());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Get single teacher with details
    const getTeacher = useCallback(async (id: string) => {
        const { data, error } = await supabase
            .from('teacher_profiles')
            .select(`
                *,
                profile:profiles (*),
                availability:teacher_availability (*),
                session_types (*),
                batches (
                    *,
                    course:courses (*)
                )
            `)
            .eq('id', id)
            .single();

        if (error) {
            return { data: null, error: error.message };
        }
        return { data, error: null };
    }, [supabase]);

    // Get teacher by user ID
    const getTeacherByUserId = useCallback(async (userId: string) => {
        const { data, error } = await supabase
            .from('teacher_profiles')
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

    // Update teacher profile
    const updateTeacher = useCallback(async (teacherId: string, userId: string, updates: { profile?: Partial<Profile>, teacher?: Partial<TeacherProfile> }) => {
        try {
            const response = await fetch(`/api/admin/users/${teacherId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            const result = await response.json();

            if (!response.ok) {
                return { success: false, error: result.error || 'Failed to update teacher' };
            }

            await fetchTeachers();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'An unexpected error occurred' };
        }
    }, [fetchTeachers]);

    // Get teacher earnings
    const getTeacherEarnings = useCallback(async (teacherId: string) => {
        const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('teacher_id', teacherId);

        if (error) {
            return { data: null, error: error.message };
        }

        const totalEarnings = data.reduce((sum: number, inv: { status: string; total_amount: number }) =>
            inv.status === 'paid' ? sum + inv.total_amount : sum, 0);
        const pendingAmount = data.reduce((sum: number, inv: { status: string; total_amount: number }) =>
            inv.status === 'pending' ? sum + inv.total_amount : sum, 0);

        return {
            data: {
                totalEarnings,
                pendingAmount,
                invoiceCount: data.length,
            },
            error: null,
        };
    }, [supabase]);

    // Delete teacher profile
    const deleteTeacher = useCallback(async (id: string) => {
        const { error } = await supabase
            .from('teacher_profiles')
            .delete()
            .eq('id', id);

        if (error) {
            return { success: false, error: error.message };
        }

        setState(prev => ({
            ...prev,
            teachers: prev.teachers.filter(t => t.id !== id),
        }));
        return { success: true };
    }, [supabase]);

    // Create teacher (admin creates auth user and teacher profile via API)
    const createTeacher = useCallback(async (input: CreateTeacherInput) => {
        const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';

        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: input.email,
                    password: tempPassword,
                    role: 'teacher',
                    fullName: input.name,
                    phone: input.phone,
                    metadata: {
                        subject: input.subject,
                        bio: input.bio,
                    },
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                return { success: false, error: result.error || 'Failed to create teacher' };
            }

            await fetchTeachers();
            return { success: true, data: result.user };
        } catch (err: any) {
            return { success: false, error: err.message || 'An unexpected error occurred' };
        }
    }, [fetchTeachers]);

    return {
        teachers: state.teachers,
        isLoading: state.isLoading,
        error: state.error,
        refetch: fetchTeachers,
        getTeacher,
        getTeacherByUserId,
        updateTeacher,
        getTeacherEarnings,
        deleteTeacher,
        createTeacher,
    };
}
