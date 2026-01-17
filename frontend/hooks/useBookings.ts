'use client';

import { useState, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { SessionBooking, CreateBookingInput, BookingStatus } from '@/types/database';

interface BookingsState {
    bookings: SessionBooking[];
    isLoading: boolean;
    error: string | null;
}

export function useBookings() {
    const [state, setState] = useState<BookingsState>({
        bookings: [],
        isLoading: false,
        error: null,
    });

    const supabase = getSupabaseClient();

    // Fetch bookings (admin/teacher)
    const fetchBookings = useCallback(async (teacherId?: string) => {
        setState(prev => ({ ...prev, isLoading: true }));

        let query = supabase
            .from('session_bookings')
            .select(`
                *,
                teacher:teacher_profiles (
                    *,
                    profile:profiles (*)
                ),
                course:courses (*)
            `)
            .order('booking_date', { ascending: true });

        if (teacherId) {
            query = query.eq('teacher_id', teacherId);
        }

        const { data, error } = await query;

        if (error) {
            setState({ bookings: [], isLoading: false, error: error.message });
        } else {
            setState({ bookings: data || [], isLoading: false, error: null });
        }
    }, [supabase]);

    // Create booking (public)
    const createBooking = async (input: CreateBookingInput) => {
        const { data, error } = await supabase
            .from('session_bookings')
            .insert(input)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data };
    };

    // Update booking status
    const updateBookingStatus = async (id: string, status: BookingStatus) => {
        const { data, error } = await supabase
            .from('session_bookings')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        setState(prev => ({
            ...prev,
            bookings: prev.bookings.map(b => b.id === id ? data : b),
        }));
        return { success: true, data };
    };

    // Cancel booking
    const cancelBooking = async (id: string) => {
        return updateBookingStatus(id, 'cancelled');
    };

    // Get available slots for a teacher
    const getAvailableSlots = async (teacherId: string, date: string) => {
        // Get teacher availability for the day
        const dayOfWeek = new Date(date).getDay();

        const { data: availability, error: availError } = await supabase
            .from('teacher_availability')
            .select('*')
            .eq('teacher_id', teacherId)
            .eq('day_of_week', dayOfWeek);

        if (availError) {
            return { slots: [], error: availError.message };
        }

        // Check for blocked dates
        const { data: blocked } = await supabase
            .from('blocked_dates')
            .select('*')
            .eq('teacher_id', teacherId)
            .eq('blocked_date', date);

        if (blocked && blocked.length > 0) {
            return { slots: [], error: null }; // Date is blocked
        }

        // Get existing bookings for the date
        const { data: existingBookings } = await supabase
            .from('session_bookings')
            .select('booking_time')
            .eq('teacher_id', teacherId)
            .eq('booking_date', date)
            .neq('status', 'cancelled');

        const bookedTimes = existingBookings?.map((b: { booking_time: string }) => b.booking_time) || [];

        // Generate available slots
        const slots = availability?.flatMap((slot: { start_time: string; end_time: string }) => {
            const times: string[] = [];
            let current = slot.start_time;

            while (current < slot.end_time) {
                if (!bookedTimes.includes(current)) {
                    times.push(current);
                }
                // Add 1 hour
                const [hours, mins] = current.split(':').map(Number);
                const nextHour = hours + 1;
                current = `${String(nextHour).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
            }

            return times;
        }) || [];

        return { slots, error: null };
    };

    return {
        bookings: state.bookings,
        isLoading: state.isLoading,
        error: state.error,
        fetchBookings,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        getAvailableSlots,
    };
}
