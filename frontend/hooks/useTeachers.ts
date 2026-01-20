import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { TeacherProfile, TeacherWithProfile, Profile } from '@/types/database';

interface TeachersFilter {
    subject?: string;
    search?: string;
    page?: number;
    limit?: number;
}

interface CreateTeacherInput {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    bio?: string;
}

export function useTeachers(filter: TeachersFilter = {}) {
    const supabase = getSupabaseClient();
    const queryClient = useQueryClient();
    const page = filter.page || 1;
    const limit = filter.limit || 10;

    // Fetch teachers with pagination
    const fetchTeachers = async () => {
        let query = supabase
            .from('teacher_profiles')
            .select(`
                *,
                profile:profiles!inner(*)
            `, { count: 'exact' });

        // Apply filters
        if (filter.subject) {
            query = query.eq('subject', filter.subject);
        }
        if (filter.search) {
            query = query.or(`profile.full_name.ilike.%${filter.search}%,subject.ilike.%${filter.search}%`);
        }

        // Apply pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await query
            .order('rating', { ascending: false })
            .range(from, to);

        if (error) throw error;

        return {
            teachers: data as TeacherWithProfile[],
            totalCount: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
        };
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['teachers', filter],
        queryFn: fetchTeachers,
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
    });

    // Get single teacher
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

        if (error) return { data: null, error: error.message };
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

        if (error) return { data: null, error: error.message };
        return { data, error: null };
    }, [supabase]);

    // Create teacher mutation
    const createMutation = useMutation({
        mutationFn: async (input: CreateTeacherInput) => {
            const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            if (!response.ok) throw new Error(result.error || 'Failed to create teacher');
            return result.user;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
        },
    });

    // Update teacher mutation
    const updateMutation = useMutation({
        mutationFn: async ({ teacherId, updates }: { teacherId: string, updates: { profile?: Partial<Profile>, teacher?: Partial<TeacherProfile> } }) => {
            const response = await fetch(`/api/admin/users/${teacherId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to update teacher');
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
        },
    });

    // Delete teacher mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('teacher_profiles').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
        },
    });

    // Get teacher earnings
    const getTeacherEarnings = useCallback(async (teacherId: string) => {
        const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('teacher_id', teacherId);

        if (error) return { data: null, error: error.message };

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

    // Get teacher credentials (admin only)
    const getTeacherCredentials = useCallback(async (userId: string) => {
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
        teachers: data?.teachers || [],
        totalCount: data?.totalCount || 0,
        totalPages: data?.totalPages || 0,
        isLoading,
        error: error ? (error as Error).message : null,
        refetch: () => queryClient.invalidateQueries({ queryKey: ['teachers'] }),
        getTeacher,
        getTeacherByUserId,
        createTeacher: createMutation.mutateAsync,
        updateTeacher: (teacherId: string, userId: string, updates: any) => updateMutation.mutateAsync({ teacherId, updates }),
        deleteTeacher: deleteMutation.mutateAsync,
        getTeacherEarnings,
        getTeacherCredentials,
    };
}
