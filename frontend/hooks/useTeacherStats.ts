'use client';

import { useState, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';

interface TeacherStats {
    sessions: {
        count: number;
        total: number;
        items: any[];
    };
    courses: {
        count: number;
        total: number;
        items: any[];
    };
}

export function useTeacherStats() {
    const [stats, setStats] = useState<TeacherStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = getSupabaseClient();

    const fetchStats = useCallback(async (teacherId: string, month: number, year: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
            const endDate = new Date(year, month, 0).toISOString().split('T')[0];

            // 1. Fetch Sessions
            const { data: sessions, error: sessionsError } = await supabase
                .from('live_sessions')
                .select('id, title, session_date, duration_minutes, teacher_id')
                .eq('teacher_id', teacherId)
                .eq('status', 'completed')
                .gte('session_date', startDate)
                .lte('session_date', endDate);

            if (sessionsError) throw sessionsError;

            // Note: Course revenue calculation skipped for now.
            // Courses are linked to teachers via batches, not directly.
            const courses: any[] = [];

            // 3. Fetch Teacher Rate
            const { data: teacher, error: teacherError } = await supabase
                .from('teacher_profiles')
                .select('hourly_rate')
                .eq('id', teacherId)
                .single();

            if (teacherError) throw teacherError;

            const hourlyRate = teacher?.hourly_rate || 100;

            // Calculate Totals
            const sessionItems = sessions?.map((s: any) => ({
                id: s.id,
                title: s.title,
                date: s.session_date,
                amount: hourlyRate
            })) || [];

            const courseItems = courses?.map((c: any) => ({
                id: c.id,
                title: c.title,
                amount: (c.price || 0) * 0.1 // Mock 10% revenue share
            })) || [];

            setStats({
                sessions: {
                    count: sessionItems.length,
                    total: sessionItems.reduce((sum: number, item: any) => sum + item.amount, 0),
                    items: sessionItems
                },
                courses: {
                    count: courseItems.length,
                    total: courseItems.reduce((sum: number, item: any) => sum + item.amount, 0),
                    items: courseItems
                }
            });

        } catch (err: any) {
            console.error('Error fetching teacher stats:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    return {
        stats,
        isLoading,
        error,
        fetchStats
    };
}
