'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Achievement, StudentAchievement, StudentAchievementWithDetails } from '@/types/database';

interface AchievementsState {
    achievements: Achievement[];
    studentAchievements: StudentAchievementWithDetails[];
    isLoading: boolean;
    error: string | null;
}

export function useAchievements(studentId?: string) {
    const [state, setState] = useState<AchievementsState>({
        achievements: [],
        studentAchievements: [],
        isLoading: true,
        error: null,
    });

    const supabase = getSupabaseClient();

    // Fetch all achievements
    const fetchAchievements = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));

        // Get all achievements
        const { data: allAchievements, error: achievementsError } = await supabase
            .from('achievements')
            .select('*')
            .eq('is_active', true)
            .order('category')
            .order('requirement_value');

        if (achievementsError) {
            setState(prev => ({ ...prev, isLoading: false, error: achievementsError.message }));
            return;
        }

        // Get student's earned achievements if studentId provided
        let earnedAchievements: StudentAchievementWithDetails[] = [];
        if (studentId) {
            const { data: studentData, error: studentError } = await supabase
                .from('student_achievements')
                .select(`
                    *,
                    achievement:achievements (*)
                `)
                .eq('student_id', studentId);

            if (!studentError && studentData) {
                earnedAchievements = studentData;
            }
        }

        setState({
            achievements: allAchievements || [],
            studentAchievements: earnedAchievements,
            isLoading: false,
            error: null,
        });
    }, [supabase, studentId]);

    useEffect(() => {
        fetchAchievements();
    }, [fetchAchievements]);

    // Check and award achievements for a student
    const checkAchievements = async (checkStudentId: string) => {
        // Call the database function
        const { error } = await supabase.rpc('check_student_achievements', {
            p_student_id: checkStudentId,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        await fetchAchievements();
        return { success: true };
    };

    // Claim XP for an achievement
    const claimXP = async (studentAchievementId: string) => {
        const achievement = state.studentAchievements.find(sa => sa.id === studentAchievementId);
        if (!achievement || achievement.is_claimed) {
            return { success: false, error: 'Already claimed or not found' };
        }

        // Update claimed status
        const { error: claimError } = await supabase
            .from('student_achievements')
            .update({ is_claimed: true })
            .eq('id', studentAchievementId);

        if (claimError) {
            return { success: false, error: claimError.message };
        }

        // Add XP to student
        const { error: xpError } = await supabase.rpc('add_student_xp', {
            p_student_id: achievement.student_id,
            p_xp_amount: achievement.achievement.xp_reward,
        });

        if (xpError) {
            // XP function might not exist, add manually
            const { data: student } = await supabase
                .from('student_profiles')
                .select('xp_points')
                .eq('id', achievement.student_id)
                .single();

            if (student) {
                await supabase
                    .from('student_profiles')
                    .update({ xp_points: student.xp_points + achievement.achievement.xp_reward })
                    .eq('id', achievement.student_id);
            }
        }

        await fetchAchievements();
        return { success: true, xpEarned: achievement.achievement.xp_reward };
    };

    // Get achievements by category
    const getByCategory = (category: string) => {
        return state.achievements.filter(a => a.category === category);
    };

    // Check if student has earned an achievement
    const hasEarned = (achievementId: string) => {
        return state.studentAchievements.some(sa => sa.achievement_id === achievementId);
    };

    // Get progress toward an achievement
    const getProgress = (achievementId: string) => {
        const studentAchievement = state.studentAchievements.find(
            sa => sa.achievement_id === achievementId
        );
        const achievement = state.achievements.find(a => a.id === achievementId);

        if (!achievement) return { progress: 0, total: 0, percentage: 0 };

        const progress = studentAchievement?.progress || 0;
        const total = achievement.requirement_value;
        const percentage = Math.min(100, Math.round((progress / total) * 100));

        return { progress, total, percentage };
    };

    // Get total XP earned from achievements
    const getTotalXP = () => {
        return state.studentAchievements
            .filter(sa => sa.is_claimed)
            .reduce((sum, sa) => sum + (sa.achievement?.xp_reward || 0), 0);
    };

    // Get unclaimed achievements
    const getUnclaimed = () => {
        return state.studentAchievements.filter(sa => !sa.is_claimed);
    };

    return {
        achievements: state.achievements,
        studentAchievements: state.studentAchievements,
        isLoading: state.isLoading,
        error: state.error,
        refetch: fetchAchievements,
        checkAchievements,
        claimXP,
        getByCategory,
        hasEarned,
        getProgress,
        getTotalXP,
        getUnclaimed,
    };
}
