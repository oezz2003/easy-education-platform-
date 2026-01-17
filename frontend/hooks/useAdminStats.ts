'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { AdminStats } from '@/types/database';

export function useAdminStats() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = getSupabaseClient();

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Fetch all counts in parallel
            const [
                studentsResult,
                teachersResult,
                coursesResult,
                batchesResult,
                sessionsResult,
                invoicesResult,
            ] = await Promise.all([
                supabase.from('student_profiles').select('id', { count: 'exact', head: true }),
                supabase.from('teacher_profiles').select('id', { count: 'exact', head: true }),
                supabase.from('courses').select('id', { count: 'exact', head: true }).eq('status', 'active'),
                supabase.from('batches').select('id', { count: 'exact', head: true }).eq('status', 'active'),
                supabase.from('live_sessions').select('id', { count: 'exact', head: true })
                    .eq('session_date', new Date().toISOString().split('T')[0]),
                supabase.from('invoices').select('id, total_amount', { count: 'exact' }).eq('status', 'pending'),
            ]);

            // Calculate total revenue
            const { data: paidInvoices } = await supabase
                .from('invoices')
                .select('total_amount')
                .eq('status', 'paid');

            const totalRevenue = paidInvoices?.reduce((sum: number, inv: { total_amount: number | null }) => sum + (inv.total_amount || 0), 0) || 0;

            setStats({
                totalStudents: studentsResult.count || 0,
                totalTeachers: teachersResult.count || 0,
                totalCourses: coursesResult.count || 0,
                activeBatches: batchesResult.count || 0,
                todaySessions: sessionsResult.count || 0,
                pendingInvoices: invoicesResult.count || 0,
                totalRevenue,
            });
        } catch (err) {
            setError('Failed to fetch admin stats');
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // Get monthly enrollment data for charts
    const getMonthlyEnrollments = async (year: number = new Date().getFullYear()) => {
        const { data, error } = await supabase
            .from('batch_enrollments')
            .select('enrolled_at')
            .gte('enrolled_at', `${year}-01-01`)
            .lte('enrolled_at', `${year}-12-31`);

        if (error) {
            return { data: null, error: error.message };
        }

        // Group by month
        const monthly = Array(12).fill(0);
        data?.forEach((enrollment: { enrolled_at: string }) => {
            const month = new Date(enrollment.enrolled_at).getMonth();
            monthly[month]++;
        });

        return { data: monthly, error: null };
    };

    // Get revenue by month
    const getMonthlyRevenue = async (year: number = new Date().getFullYear()) => {
        const { data, error } = await supabase
            .from('invoices')
            .select('total_amount, paid_at')
            .eq('status', 'paid')
            .gte('paid_at', `${year}-01-01`)
            .lte('paid_at', `${year}-12-31`);

        if (error) {
            return { data: null, error: error.message };
        }

        // Group by month
        const monthly = Array(12).fill(0);
        data?.forEach((invoice: { total_amount: number | null; paid_at: string | null }) => {
            if (invoice.paid_at) {
                const month = new Date(invoice.paid_at).getMonth();
                monthly[month] += invoice.total_amount || 0;
            }
        });

        return { data: monthly, error: null };
    };

    return {
        stats,
        isLoading,
        error,
        refetch: fetchStats,
        getMonthlyEnrollments,
        getMonthlyRevenue,
    };
}
