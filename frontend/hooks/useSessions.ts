'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { LiveSession, CreateSessionInput, SessionStatus } from '@/types/database';

interface SessionsState {
    sessions: LiveSession[];
    isLoading: boolean;
    error: string | null;
}

interface SessionsFilter {
    teacherId?: string;
    batchId?: string;
    status?: SessionStatus;
    date?: string;
    dateRange?: { start: string; end: string };
}

export function useSessions(filter?: SessionsFilter) {
    const [state, setState] = useState<SessionsState>({
        sessions: [],
        isLoading: true,
        error: null,
    });

    const supabase = getSupabaseClient();

    // Fetch sessions
    const fetchSessions = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));

        let query = supabase
            .from('live_sessions')
            .select(`
                *,
                teacher:teacher_profiles (
                    *,
                    profile:profiles (*)
                ),
                batch:batches (*),
                course:courses (*)
            `)
            .order('session_date', { ascending: true })
            .order('start_time', { ascending: true });

        // Apply filters
        if (filter?.teacherId) {
            query = query.eq('teacher_id', filter.teacherId);
        }
        if (filter?.batchId) {
            query = query.eq('batch_id', filter.batchId);
        }
        if (filter?.status) {
            query = query.eq('status', filter.status);
        }
        if (filter?.date) {
            query = query.eq('session_date', filter.date);
        }
        if (filter?.dateRange) {
            query = query
                .gte('session_date', filter.dateRange.start)
                .lte('session_date', filter.dateRange.end);
        }

        const { data, error } = await query;

        if (error) {
            setState({ sessions: [], isLoading: false, error: error.message });
        } else {
            setState({ sessions: data || [], isLoading: false, error: null });
        }
    }, [supabase, filter?.teacherId, filter?.batchId, filter?.status, filter?.date, filter?.dateRange?.start, filter?.dateRange?.end]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    // Get session with attendance
    const getSession = useCallback(async (id: string) => {
        const { data, error } = await supabase
            .from('live_sessions')
            .select(`
                *,
                teacher:teacher_profiles (
                    *,
                    profile:profiles (*)
                ),
                batch:batches (*),
                course:courses (*),
                attendance (
                    *,
                    student:student_profiles (
                        *,
                        profile:profiles (*)
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

    // Create session
    const createSession = useCallback(async (input: CreateSessionInput & { invited_students?: string[] }) => {
        try {
            const response = await fetch('/api/admin/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
            });

            const result = await response.json();

            if (!response.ok) {
                return { success: false, error: result.error || 'Failed to create session' };
            }

            await fetchSessions();
            return { success: true, data: result.data };
        } catch (err: any) {
            return { success: false, error: err.message || 'An unexpected error occurred' };
        }
    }, [fetchSessions]);

    // Update session
    const updateSession = useCallback(async (id: string, updates: Partial<CreateSessionInput> & { invited_students?: string[] }) => {
        const { invited_students, ...sessionUpdates } = updates;

        const { data, error } = await supabase
            .from('live_sessions')
            .update(sessionUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        // Update invited students if provided
        if (invited_students) {
            // First delete existing attendance for this session (or we could be smarter and diff them)
            // For simplicity, we'll keep existing records if they are in the new list, remove others, and add new ones
            // But deleting all and re-inserting loses history if they already attended.
            // So let's just add new ones for now. Removing students from invite list is tricky if they already have attendance data.
            // For now, let's just ADD new students.

            // Get existing attendance to filter out duplicates
            const { data: existingAttendance } = await supabase
                .from('attendance')
                .select('student_id')
                .eq('session_id', id);

            const existingStudentIds = existingAttendance?.map((a: { student_id: string }) => a.student_id) || [];
            const newStudentIds = invited_students.filter(sid => !existingStudentIds.includes(sid));

            if (newStudentIds.length > 0) {
                const attendanceRecords = newStudentIds.map(studentId => ({
                    session_id: id,
                    student_id: studentId,
                    status: 'absent',
                    duration_minutes: 0,
                    participation_score: 0
                }));

                await supabase.from('attendance').insert(attendanceRecords);
            }
        }

        setState(prev => ({
            ...prev,
            sessions: prev.sessions.map(s => s.id === id ? { ...s, ...data } : s),
        }));
        return { success: true, data };
    }, [supabase]);

    // Update session status
    const updateStatus = useCallback(async (id: string, status: SessionStatus) => {
        return updateSession(id, { status } as any);
    }, [updateSession]);

    // Delete session
    const deleteSession = useCallback(async (id: string) => {
        const { error } = await supabase
            .from('live_sessions')
            .delete()
            .eq('id', id);

        if (error) {
            return { success: false, error: error.message };
        }

        setState(prev => ({
            ...prev,
            sessions: prev.sessions.filter(s => s.id !== id),
        }));
        return { success: true };
    }, [supabase]);

    // Subscribe to real-time updates
    const subscribeToSession = useCallback((sessionId: string, callback: (session: LiveSession) => void) => {
        const channel = supabase
            .channel(`session-${sessionId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'live_sessions',
                    filter: `id=eq.${sessionId}`,
                },
                (payload: { new: LiveSession }) => {
                    callback(payload.new as LiveSession);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    return {
        sessions: state.sessions,
        isLoading: state.isLoading,
        error: state.error,
        refetch: fetchSessions,
        getSession,
        createSession,
        updateSession,
        updateStatus,
        deleteSession,
        subscribeToSession,
    };
}
