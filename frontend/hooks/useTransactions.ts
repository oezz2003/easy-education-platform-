'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type {
    TransactionWithDetails,
    CreateTransactionInput,
    TransactionStatus
} from '@/types/database';

interface TransactionsState {
    transactions: TransactionWithDetails[];
    isLoading: boolean;
    error: string | null;
}

interface TransactionsFilter {
    status?: TransactionStatus;
    type?: string;
    studentId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
}

export function useTransactions(filter?: TransactionsFilter) {
    const [state, setState] = useState<TransactionsState>({
        transactions: [],
        isLoading: true,
        error: null,
    });

    const supabase = getSupabaseClient();

    // Fetch transactions
    const fetchTransactions = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));

        let query = supabase
            .from('transactions')
            .select(`
                *,
                student:student_profiles (
                    *,
                    profile:profiles (*)
                ),
                course:courses (*),
                batch:batches (*)
            `)
            .order('created_at', { ascending: false });

        // Apply filters
        if (filter?.status) {
            query = query.eq('status', filter.status);
        }
        if (filter?.type) {
            query = query.eq('type', filter.type);
        }
        if (filter?.studentId) {
            query = query.eq('student_id', filter.studentId);
        }
        if (filter?.dateFrom) {
            query = query.gte('created_at', filter.dateFrom);
        }
        if (filter?.dateTo) {
            query = query.lte('created_at', filter.dateTo);
        }

        const { data, error } = await query;

        if (error) {
            setState({ transactions: [], isLoading: false, error: error.message });
        } else {
            setState({ transactions: data || [], isLoading: false, error: null });
        }
    }, [supabase, filter?.status, filter?.type, filter?.studentId, filter?.dateFrom, filter?.dateTo, filter?.search]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // Create transaction
    const createTransaction = async (input: CreateTransactionInput) => {
        try {
            const response = await fetch('/api/admin/finance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create_transaction', ...input }),
            });

            const result = await response.json();

            if (!response.ok) {
                return { success: false, error: result.error || 'Failed to create transaction' };
            }

            await fetchTransactions();
            return { success: true, data: result.data };
        } catch (err: any) {
            return { success: false, error: err.message || 'An unexpected error occurred' };
        }
    };

    // Mark transaction as completed
    const completeTransaction = async (id: string) => {
        try {
            const response = await fetch('/api/admin/finance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'complete_transaction', id }),
            });

            const result = await response.json();

            if (!response.ok) {
                return { success: false, error: result.error || 'Failed to complete transaction' };
            }

            setState(prev => ({
                ...prev,
                transactions: prev.transactions.map(t =>
                    t.id === id ? { ...t, ...result.data } : t
                ),
            }));
            return { success: true, data: result.data };
        } catch (err: any) {
            return { success: false, error: err.message || 'An unexpected error occurred' };
        }
    };

    // Refund transaction
    const refundTransaction = async (id: string, refundAmount?: number) => {
        try {
            const response = await fetch('/api/admin/finance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'refund_transaction', id, amount: refundAmount }),
            });

            const result = await response.json();

            if (!response.ok) {
                return { success: false, error: result.error || 'Failed to refund transaction' };
            }

            await fetchTransactions();
            return { success: true, data: result.data };
        } catch (err: any) {
            return { success: false, error: err.message || 'An unexpected error occurred' };
        }
    };

    // Get transaction stats
    const getStats = () => {
        const completed = state.transactions.filter(t => t.status === 'completed' && t.type === 'payment');
        const pending = state.transactions.filter(t => t.status === 'pending');
        const refunds = state.transactions.filter(t => t.type === 'refund');

        return {
            totalRevenue: completed.reduce((sum, t) => sum + t.amount, 0),
            pendingAmount: pending.reduce((sum, t) => sum + t.amount, 0),
            refundedAmount: refunds.reduce((sum, t) => sum + t.amount, 0),
            transactionCount: state.transactions.length,
            completedCount: completed.length,
            pendingCount: pending.length,
        };
    };

    return {
        transactions: state.transactions,
        isLoading: state.isLoading,
        error: state.error,
        refetch: fetchTransactions,
        createTransaction,
        completeTransaction,
        refundTransaction,
        getStats,
    };
}
