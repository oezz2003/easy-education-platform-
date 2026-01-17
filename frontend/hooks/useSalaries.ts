'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type {
    SalaryWithDetails,
    SalaryStatus
} from '@/types/database';

interface SalariesState {
    salaries: SalaryWithDetails[];
    isLoading: boolean;
    error: string | null;
}

interface SalariesFilter {
    month?: number;
    year?: number;
    teacherId?: string;
    status?: SalaryStatus;
}

export function useSalaries(filter?: SalariesFilter) {
    const [state, setState] = useState<SalariesState>({
        salaries: [],
        isLoading: true,
        error: null,
    });

    const supabase = getSupabaseClient();

    // Fetch salaries
    const fetchSalaries = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));

        let query = supabase
            .from('teacher_salaries')
            .select(`
                *,
                teacher:teacher_profiles (
                    *,
                    profile:profiles (*)
                ),
                items:salary_items (*)
            `)
            .order('created_at', { ascending: false });

        // Apply filters
        if (filter?.month !== undefined) {
            query = query.eq('month', filter.month);
        }
        if (filter?.year) {
            query = query.eq('year', filter.year);
        }
        if (filter?.teacherId) {
            query = query.eq('teacher_id', filter.teacherId);
        }
        if (filter?.status) {
            query = query.eq('status', filter.status);
        }

        const { data, error } = await query;

        if (error) {
            setState({ salaries: [], isLoading: false, error: error.message });
        } else {
            setState({ salaries: data || [], isLoading: false, error: null });
        }
    }, [supabase, filter?.month, filter?.year, filter?.teacherId, filter?.status]);

    useEffect(() => {
        fetchSalaries();
    }, [fetchSalaries]);

    // Generate salary for a teacher
    const generateSalary = async (teacherId: string, month: number, year: number) => {
        try {
            const response = await fetch('/api/admin/finance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'generate_salary', teacherId, month, year }),
            });

            const result = await response.json();

            if (!response.ok) {
                return { success: false, error: result.error || 'Failed to generate salary' };
            }

            await fetchSalaries();
            return { success: true, data: result.data };
        } catch (err: any) {
            return { success: false, error: err.message || 'An unexpected error occurred' };
        }
    };

    // Generate salaries for all teachers
    const generateAllSalaries = async (month: number, year: number) => {
        const { data: teachers } = await supabase
            .from('teacher_profiles')
            .select('id');

        if (!teachers || teachers.length === 0) {
            return { success: false, error: 'No teachers found' };
        }

        const results = await Promise.all(
            teachers.map((t: { id: string }) => generateSalary(t.id, month, year))
        );

        const errors = results.filter((r: { success: boolean }) => !r.success);
        if (errors.length > 0) {
            return { success: false, error: `${errors.length} salaries failed to generate` };
        }

        return { success: true, count: results.length };
    };

    // Mark salary as paid
    const paySalary = async (id: string, paymentMethod?: string, paymentReference?: string) => {
        try {
            const response = await fetch('/api/admin/finance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'pay_salary', id, paymentMethod, paymentReference }),
            });

            const result = await response.json();

            if (!response.ok) {
                return { success: false, error: result.error || 'Failed to pay salary' };
            }

            setState(prev => ({
                ...prev,
                salaries: prev.salaries.map(s =>
                    s.id === id ? { ...s, ...result.data } : s
                ),
            }));
            return { success: true, data: result.data };
        } catch (err: any) {
            return { success: false, error: err.message || 'An unexpected error occurred' };
        }
    };

    // Pay multiple salaries
    const payMultiple = async (ids: string[], paymentMethod?: string) => {
        const results = await Promise.all(
            ids.map(id => paySalary(id, paymentMethod))
        );

        const errors = results.filter(r => !r.success);
        if (errors.length > 0) {
            return { success: false, error: `${errors.length} payments failed` };
        }

        return { success: true, count: results.length };
    };

    // Add bonus to salary
    const addBonus = async (id: string, amount: number, description: string) => {
        try {
            const response = await fetch('/api/admin/finance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'add_bonus', id, amount, description }),
            });

            const result = await response.json();

            if (!response.ok) {
                return { success: false, error: result.error || 'Failed to add bonus' };
            }

            await fetchSalaries();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'An unexpected error occurred' };
        }
    };

    // Add deduction to salary
    const addDeduction = async (id: string, amount: number, description: string) => {
        try {
            const response = await fetch('/api/admin/finance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'add_deduction', id, amount, description }),
            });

            const result = await response.json();

            if (!response.ok) {
                return { success: false, error: result.error || 'Failed to add deduction' };
            }

            await fetchSalaries();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'An unexpected error occurred' };
        }
    };

    // Get salary stats
    const getStats = () => {
        const paid = state.salaries.filter(s => s.status === 'paid');
        const pending = state.salaries.filter(s => s.status === 'pending');

        return {
            totalPaid: paid.reduce((sum, s) => sum + s.total_amount, 0),
            totalPending: pending.reduce((sum, s) => sum + s.total_amount, 0),
            paidCount: paid.length,
            pendingCount: pending.length,
            totalSessions: state.salaries.reduce((sum, s) => sum + s.sessions_count, 0),
        };
    };

    return {
        salaries: state.salaries,
        isLoading: state.isLoading,
        error: state.error,
        refetch: fetchSalaries,
        generateSalary,
        generateAllSalaries,
        paySalary,
        payMultiple,
        addBonus,
        addDeduction,
        getStats,
    };
}
