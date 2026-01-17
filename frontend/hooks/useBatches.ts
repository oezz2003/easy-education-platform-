'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Batch, BatchWithDetails, BatchStatus } from '@/types/database';

interface BatchesState {
    batches: BatchWithDetails[];
    isLoading: boolean;
    error: string | null;
}

interface BatchesFilter {
    courseId?: string;
    teacherId?: string;
    status?: BatchStatus;
    search?: string;
}

interface CreateBatchInput {
    course_id: string;
    teacher_id: string;
    name: string;
    start_date: string;
    end_date: string;
    schedule?: string;
    max_students?: number;
}

export function useBatches(filter?: BatchesFilter) {
    const [state, setState] = useState<BatchesState>({
        batches: [],
        isLoading: true,
        error: null,
    });

    const supabase = getSupabaseClient();

    // Fetch batches
    const fetchBatches = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));

        let query = supabase
            .from('batches')
            .select(`
                *,
                course:courses (*),
                teacher:teacher_profiles (
                    *,
                    profile:profiles (*)
                )
            `)
            .order('start_date', { ascending: false });

        // Apply filters
        if (filter?.courseId) {
            query = query.eq('course_id', filter.courseId);
        }
        if (filter?.teacherId) {
            query = query.eq('teacher_id', filter.teacherId);
        }
        if (filter?.status) {
            query = query.eq('status', filter.status);
        }
        if (filter?.search) {
            query = query.ilike('name', `%${filter.search}%`);
        }

        const { data, error } = await query;

        if (error) {
            setState({ batches: [], isLoading: false, error: error.message });
        } else {
            setState({ batches: data || [], isLoading: false, error: null });
        }
    }, [supabase, filter?.courseId, filter?.teacherId, filter?.status, filter?.search]);

    useEffect(() => {
        fetchBatches();
    }, [fetchBatches]);

    // Get single batch with enrollments
    const getBatch = async (id: string) => {
        const { data, error } = await supabase
            .from('batches')
            .select(`
                *,
                course:courses (*),
                teacher:teacher_profiles (
                    *,
                    profile:profiles (*)
                ),
                enrollments:batch_enrollments (
                    *,
                    student:student_profiles (
                        *,
                        profile:profiles (*)
                    )
                ),
                sessions:live_sessions (*)
            `)
            .eq('id', id)
            .single();

        if (error) {
            return { data: null, error: error.message };
        }
        return { data, error: null };
    };

    // Create batch
    const createBatch = async (input: CreateBatchInput) => {
        const { data, error } = await supabase
            .from('batches')
            .insert(input)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        await fetchBatches();
        return { success: true, data };
    };

    // Update batch
    const updateBatch = async (id: string, updates: Partial<Batch>) => {
        const { data, error } = await supabase
            .from('batches')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        await fetchBatches();
        return { success: true, data };
    };

    // Delete batch
    const deleteBatch = async (id: string) => {
        const { error } = await supabase
            .from('batches')
            .delete()
            .eq('id', id);

        if (error) {
            return { success: false, error: error.message };
        }

        await fetchBatches();
        return { success: true };
    };

    // Enroll student
    const enrollStudent = async (batchId: string, studentId: string) => {
        const { data, error } = await supabase
            .from('batch_enrollments')
            .insert({
                batch_id: batchId,
                student_id: studentId,
                status: 'active',
                payment_status: 'pending',
            })
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true, data };
    };

    // Remove student from batch
    const unenrollStudent = async (batchId: string, studentId: string) => {
        const { error } = await supabase
            .from('batch_enrollments')
            .update({ status: 'dropped' })
            .eq('batch_id', batchId)
            .eq('student_id', studentId);

        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true };
    };

    // Update enrollment payment status
    const updatePaymentStatus = async (enrollmentId: string, status: 'pending' | 'paid' | 'refunded') => {
        const { error } = await supabase
            .from('batch_enrollments')
            .update({ payment_status: status })
            .eq('id', enrollmentId);

        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true };
    };

    // Get enrollment count for batch
    const getEnrollmentCount = async (batchId: string) => {
        const { count, error } = await supabase
            .from('batch_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('batch_id', batchId)
            .eq('status', 'active');

        if (error) {
            return { count: 0, error: error.message };
        }
        return { count: count || 0, error: null };
    };

    return {
        batches: state.batches,
        isLoading: state.isLoading,
        error: state.error,
        refetch: fetchBatches,
        getBatch,
        createBatch,
        updateBatch,
        deleteBatch,
        enrollStudent,
        unenrollStudent,
        updatePaymentStatus,
        getEnrollmentCount,
    };
}
