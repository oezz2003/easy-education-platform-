'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';

interface AvailabilitySlot {
    id: string;
    teacher_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_recurring: boolean;
}

interface BlockedDate {
    id: string;
    teacher_id: string;
    blocked_date: string;
    reason: string | null;
}

interface SessionType {
    id: string;
    teacher_id: string;
    name: string;
    description: string | null;
    duration_minutes: number;
    price: number;
    max_students: number;
    is_active: boolean;
}

interface AvailabilityState {
    slots: AvailabilitySlot[];
    blockedDates: BlockedDate[];
    sessionTypes: SessionType[];
    isLoading: boolean;
    error: string | null;
}

export function useTeacherAvailability(teacherId: string | undefined) {
    const [state, setState] = useState<AvailabilityState>({
        slots: [],
        blockedDates: [],
        sessionTypes: [],
        isLoading: true,
        error: null,
    });

    const supabase = getSupabaseClient();

    // Fetch all availability data
    const fetchAvailability = useCallback(async () => {
        if (!teacherId) {
            setState(prev => ({ ...prev, isLoading: false }));
            return;
        }

        setState(prev => ({ ...prev, isLoading: true }));

        // Fetch slots
        const { data: slotsData, error: slotsError } = await supabase
            .from('teacher_availability')
            .select('*')
            .eq('teacher_id', teacherId)
            .order('day_of_week', { ascending: true });

        // Fetch blocked dates
        const { data: blockedData, error: blockedError } = await supabase
            .from('blocked_dates')
            .select('*')
            .eq('teacher_id', teacherId)
            .order('blocked_date', { ascending: true });

        // Fetch session types
        const { data: typesData, error: typesError } = await supabase
            .from('session_types')
            .select('*')
            .eq('teacher_id', teacherId);

        const error = slotsError?.message || blockedError?.message || typesError?.message;

        setState({
            slots: slotsData || [],
            blockedDates: blockedData || [],
            sessionTypes: typesData || [],
            isLoading: false,
            error: error || null,
        });
    }, [supabase, teacherId]);

    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    // Add availability slot
    const addSlot = async (slot: Omit<AvailabilitySlot, 'id' | 'teacher_id'>) => {
        if (!teacherId) return { success: false, error: 'No teacher ID' };

        const { data, error } = await supabase
            .from('teacher_availability')
            .insert({ ...slot, teacher_id: teacherId })
            .select()
            .single();

        if (error) return { success: false, error: error.message };

        setState(prev => ({ ...prev, slots: [...prev.slots, data] }));
        return { success: true, data };
    };

    // Remove slot
    const removeSlot = async (slotId: string) => {
        const { error } = await supabase
            .from('teacher_availability')
            .delete()
            .eq('id', slotId);

        if (error) return { success: false, error: error.message };

        setState(prev => ({ ...prev, slots: prev.slots.filter(s => s.id !== slotId) }));
        return { success: true };
    };

    // Add blocked date
    const addBlockedDate = async (date: string, reason?: string) => {
        if (!teacherId) return { success: false, error: 'No teacher ID' };

        const { data, error } = await supabase
            .from('blocked_dates')
            .insert({ teacher_id: teacherId, blocked_date: date, reason: reason || null })
            .select()
            .single();

        if (error) return { success: false, error: error.message };

        setState(prev => ({ ...prev, blockedDates: [...prev.blockedDates, data] }));
        return { success: true, data };
    };

    // Remove blocked date
    const removeBlockedDate = async (id: string) => {
        const { error } = await supabase
            .from('blocked_dates')
            .delete()
            .eq('id', id);

        if (error) return { success: false, error: error.message };

        setState(prev => ({ ...prev, blockedDates: prev.blockedDates.filter(b => b.id !== id) }));
        return { success: true };
    };

    // Add session type
    const addSessionType = async (type: Omit<SessionType, 'id' | 'teacher_id'>) => {
        if (!teacherId) return { success: false, error: 'No teacher ID' };

        const { data, error } = await supabase
            .from('session_types')
            .insert({ ...type, teacher_id: teacherId })
            .select()
            .single();

        if (error) return { success: false, error: error.message };

        setState(prev => ({ ...prev, sessionTypes: [...prev.sessionTypes, data] }));
        return { success: true, data };
    };

    // Update session type
    const updateSessionType = async (id: string, updates: Partial<SessionType>) => {
        const { data, error } = await supabase
            .from('session_types')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) return { success: false, error: error.message };

        setState(prev => ({
            ...prev,
            sessionTypes: prev.sessionTypes.map(t => t.id === id ? data : t),
        }));
        return { success: true, data };
    };

    // Delete session type
    const deleteSessionType = async (id: string) => {
        const { error } = await supabase
            .from('session_types')
            .delete()
            .eq('id', id);

        if (error) return { success: false, error: error.message };

        setState(prev => ({ ...prev, sessionTypes: prev.sessionTypes.filter(t => t.id !== id) }));
        return { success: true };
    };

    return {
        slots: state.slots,
        blockedDates: state.blockedDates,
        sessionTypes: state.sessionTypes,
        isLoading: state.isLoading,
        error: state.error,
        refetch: fetchAvailability,
        addSlot,
        removeSlot,
        addBlockedDate,
        removeBlockedDate,
        addSessionType,
        updateSessionType,
        deleteSessionType,
    };
}
