'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Attendance, AttendanceWithStudent, AttendanceStatus } from '@/types/database';

interface AttendanceState {
    records: AttendanceWithStudent[];
    isLoading: boolean;
    error: string | null;
}

interface AttendanceFilter {
    sessionId?: string;
    studentId?: string;
    status?: AttendanceStatus;
    dateFrom?: string;
    dateTo?: string;
}

export function useAttendance(filter?: AttendanceFilter) {
    const [state, setState] = useState<AttendanceState>({
        records: [],
        isLoading: true,
        error: null,
    });

    const supabase = getSupabaseClient();

    // Fetch attendance records
    const fetchAttendance = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));

        let query = supabase
            .from('attendance')
            .select(`
                *,
                student:student_profiles (
                    *,
                    profile:profiles (*)
                ),
                session:live_sessions (*)
            `)
            .order('session_id', { ascending: false });

        // Apply filters
        if (filter?.sessionId) {
            query = query.eq('session_id', filter.sessionId);
        }
        if (filter?.studentId) {
            query = query.eq('student_id', filter.studentId);
        }
        if (filter?.status) {
            query = query.eq('status', filter.status);
        }

        const { data, error } = await query;

        if (error) {
            setState({ records: [], isLoading: false, error: error.message });
        } else {
            setState({ records: data || [], isLoading: false, error: null });
        }
    }, [supabase, filter?.sessionId, filter?.studentId, filter?.status]);

    useEffect(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    // Get attendance for a specific session
    const getSessionAttendance = async (sessionId: string) => {
        const { data, error } = await supabase
            .from('attendance')
            .select(`
                *,
                student:student_profiles (
                    *,
                    profile:profiles (*)
                )
            `)
            .eq('session_id', sessionId)
            .order('status');

        if (error) {
            return { data: null, error: error.message };
        }
        return { data, error: null };
    };

    // Get student's attendance history
    const getStudentAttendance = async (studentId: string) => {
        const { data, error } = await supabase
            .from('attendance')
            .select(`
                *,
                session:live_sessions (
                    *,
                    teacher:teacher_profiles (
                        *,
                        profile:profiles (*)
                    ),
                    course:courses (*)
                )
            `)
            .eq('student_id', studentId)
            .order('session_id', { ascending: false });

        if (error) {
            return { data: null, error: error.message };
        }
        return { data, error: null };
    };

    // Mark attendance (single student)
    const markAttendance = async (
        sessionId: string,
        studentId: string,
        status: AttendanceStatus,
        participationScore?: number
    ) => {
        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from('attendance')
            .upsert({
                session_id: sessionId,
                student_id: studentId,
                status,
                joined_at: status === 'present' || status === 'late' ? now : null,
                participation_score: participationScore || 0,
            }, {
                onConflict: 'session_id,student_id'
            })
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        await fetchAttendance();
        return { success: true, data };
    };

    // Bulk mark attendance
    const bulkMarkAttendance = async (
        sessionId: string,
        attendanceList: { studentId: string; status: AttendanceStatus }[]
    ) => {
        const now = new Date().toISOString();
        const records = attendanceList.map(({ studentId, status }) => ({
            session_id: sessionId,
            student_id: studentId,
            status,
            joined_at: status === 'present' || status === 'late' ? now : null,
        }));

        const { error } = await supabase
            .from('attendance')
            .upsert(records, {
                onConflict: 'session_id,student_id'
            });

        if (error) {
            return { success: false, error: error.message };
        }

        await fetchAttendance();
        return { success: true };
    };

    // Mark student left
    const markStudentLeft = async (sessionId: string, studentId: string) => {
        const { data: current } = await supabase
            .from('attendance')
            .select('joined_at')
            .eq('session_id', sessionId)
            .eq('student_id', studentId)
            .single();

        const leftAt = new Date();
        const joinedAt = current?.joined_at ? new Date(current.joined_at) : leftAt;
        const durationMinutes = Math.round((leftAt.getTime() - joinedAt.getTime()) / 60000);

        const { error } = await supabase
            .from('attendance')
            .update({
                left_at: leftAt.toISOString(),
                duration_minutes: durationMinutes,
                status: 'left_early'
            })
            .eq('session_id', sessionId)
            .eq('student_id', studentId);

        if (error) {
            return { success: false, error: error.message };
        }

        await fetchAttendance();
        return { success: true };
    };

    // Update participation score
    const updateParticipation = async (sessionId: string, studentId: string, score: number) => {
        const { error } = await supabase
            .from('attendance')
            .update({ participation_score: Math.min(100, Math.max(0, score)) })
            .eq('session_id', sessionId)
            .eq('student_id', studentId);

        if (error) {
            return { success: false, error: error.message };
        }

        await fetchAttendance();
        return { success: true };
    };

    // Get attendance stats for a session
    const getSessionStats = (sessionId: string) => {
        const sessionRecords = state.records.filter((r: AttendanceWithStudent) => r.session_id === sessionId);
        return {
            total: sessionRecords.length,
            present: sessionRecords.filter((r: AttendanceWithStudent) => r.status === 'present').length,
            absent: sessionRecords.filter((r: AttendanceWithStudent) => r.status === 'absent').length,
            late: sessionRecords.filter((r: AttendanceWithStudent) => r.status === 'late').length,
            leftEarly: sessionRecords.filter((r: AttendanceWithStudent) => r.status === 'left_early').length,
            avgParticipation: sessionRecords.length > 0
                ? Math.round(sessionRecords.reduce((sum: number, r: AttendanceWithStudent) => sum + r.participation_score, 0) / sessionRecords.length)
                : 0,
        };
    };

    return {
        records: state.records,
        isLoading: state.isLoading,
        error: state.error,
        refetch: fetchAttendance,
        getSessionAttendance,
        getStudentAttendance,
        markAttendance,
        bulkMarkAttendance,
        markStudentLeft,
        updateParticipation,
        getSessionStats,
    };
}
