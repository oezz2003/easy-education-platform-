'use client';

import { useState, useCallback, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Invoice, InvoiceWithItems, CreateInvoiceInput } from '@/types/database';

export function useInvoices() {
    const [invoices, setInvoices] = useState<InvoiceWithItems[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = getSupabaseClient();

    const fetchInvoices = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch invoices with teacher details
            const { data, error } = await supabase
                .from('invoices')
                .select(`
                    *,
                    teacher:teacher_profiles(
                        *,
                        profile:profiles(*)
                    ),
                    items:invoice_items(*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setInvoices(data as InvoiceWithItems[]);
        } catch (err: any) {
            console.error('Error fetching invoices:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    const createInvoice = async (input: CreateInvoiceInput) => {
        try {
            const response = await fetch('/api/admin/finance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create_invoice', ...input }),
            });

            const result = await response.json();

            if (!response.ok) {
                return { success: false, error: result.error || 'Failed to create invoice' };
            }

            await fetchInvoices();
            return { success: true, data: result.data };
        } catch (err: any) {
            return { success: false, error: err.message || 'An unexpected error occurred' };
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    return {
        invoices,
        isLoading,
        error,
        refetch: fetchInvoices,
        createInvoice,
    };
}
