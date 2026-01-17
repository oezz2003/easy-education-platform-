'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { TeacherReview, TeacherReviewWithStudent, CreateReviewInput } from '@/types/database';

interface ReviewsState {
    reviews: TeacherReviewWithStudent[];
    isLoading: boolean;
    error: string | null;
}

interface ReviewsFilter {
    teacherId?: string;
    studentId?: string;
    courseId?: string;
    isPublished?: boolean;
    rating?: number;
}

export function useReviews(filter?: ReviewsFilter) {
    const [state, setState] = useState<ReviewsState>({
        reviews: [],
        isLoading: true,
        error: null,
    });

    const supabase = getSupabaseClient();

    // Fetch reviews
    const fetchReviews = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));

        let query = supabase
            .from('teacher_reviews')
            .select(`
                *,
                student:student_profiles (
                    *,
                    profile:profiles (*)
                ),
                course:courses (*)
            `)
            .order('created_at', { ascending: false });

        // Apply filters
        if (filter?.teacherId) {
            query = query.eq('teacher_id', filter.teacherId);
        }
        if (filter?.studentId) {
            query = query.eq('student_id', filter.studentId);
        }
        if (filter?.courseId) {
            query = query.eq('course_id', filter.courseId);
        }
        if (filter?.isPublished !== undefined) {
            query = query.eq('is_published', filter.isPublished);
        }
        if (filter?.rating) {
            query = query.eq('rating', filter.rating);
        }

        const { data, error } = await query;

        if (error) {
            setState({ reviews: [], isLoading: false, error: error.message });
        } else {
            setState({ reviews: data || [], isLoading: false, error: null });
        }
    }, [supabase, filter?.teacherId, filter?.studentId, filter?.courseId, filter?.isPublished, filter?.rating]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    // Get public reviews for a teacher
    const getTeacherReviews = async (teacherId: string) => {
        const { data, error } = await supabase
            .from('teacher_reviews')
            .select(`
                *,
                student:student_profiles (
                    *,
                    profile:profiles (*)
                ),
                course:courses (name)
            `)
            .eq('teacher_id', teacherId)
            .eq('is_published', true)
            .order('created_at', { ascending: false });

        if (error) {
            return { data: null, error: error.message };
        }
        return { data, error: null };
    };

    // Create a review
    const createReview = async (input: CreateReviewInput, studentId: string) => {
        const { data, error } = await supabase
            .from('teacher_reviews')
            .insert({
                ...input,
                student_id: studentId,
                is_approved: false,
                is_published: false,
            })
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        await fetchReviews();
        return { success: true, data };
    };

    // Update a review
    const updateReview = async (reviewId: string, updates: Partial<TeacherReview>) => {
        const { data, error } = await supabase
            .from('teacher_reviews')
            .update(updates)
            .eq('id', reviewId)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        await fetchReviews();
        return { success: true, data };
    };

    // Delete a review
    const deleteReview = async (reviewId: string) => {
        const { error } = await supabase
            .from('teacher_reviews')
            .delete()
            .eq('id', reviewId);

        if (error) {
            return { success: false, error: error.message };
        }

        await fetchReviews();
        return { success: true };
    };

    // Approve review (admin only)
    const approveReview = async (reviewId: string) => {
        const { error } = await supabase
            .from('teacher_reviews')
            .update({ is_approved: true, is_published: true })
            .eq('id', reviewId);

        if (error) {
            return { success: false, error: error.message };
        }

        await fetchReviews();
        return { success: true };
    };

    // Reject review (admin only)
    const rejectReview = async (reviewId: string) => {
        const { error } = await supabase
            .from('teacher_reviews')
            .update({ is_approved: false, is_published: false })
            .eq('id', reviewId);

        if (error) {
            return { success: false, error: error.message };
        }

        await fetchReviews();
        return { success: true };
    };

    // Get average rating for teacher
    const getAverageRating = (teacherId: string) => {
        const teacherReviews = state.reviews.filter(
            (r: TeacherReviewWithStudent) => r.teacher_id === teacherId && r.is_published
        );
        if (teacherReviews.length === 0) return { average: 0, count: 0 };

        const sum = teacherReviews.reduce((acc: number, r: TeacherReviewWithStudent) => acc + r.rating, 0);
        return {
            average: Math.round((sum / teacherReviews.length) * 10) / 10,
            count: teacherReviews.length,
        };
    };

    // Get rating distribution
    const getRatingDistribution = (teacherId: string) => {
        const teacherReviews = state.reviews.filter(
            (r: TeacherReviewWithStudent) => r.teacher_id === teacherId && r.is_published
        );

        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        teacherReviews.forEach((r: TeacherReviewWithStudent) => {
            if (r.rating >= 1 && r.rating <= 5) {
                distribution[r.rating as keyof typeof distribution]++;
            }
        });

        return distribution;
    };

    // Check if student can review teacher
    const canReview = async (studentId: string, teacherId: string) => {
        // Check if student has completed a course with this teacher
        const { data: enrollments } = await supabase
            .from('batch_enrollments')
            .select(`
                batch:batches!inner (teacher_id)
            `)
            .eq('student_id', studentId)
            .eq('status', 'completed')
            .eq('batch.teacher_id', teacherId);

        if (!enrollments || enrollments.length === 0) {
            return { canReview: false, reason: 'Must complete a course first' };
        }

        // Check if already reviewed
        const { data: existingReview } = await supabase
            .from('teacher_reviews')
            .select('id')
            .eq('student_id', studentId)
            .eq('teacher_id', teacherId)
            .single();

        if (existingReview) {
            return { canReview: false, reason: 'Already reviewed this teacher' };
        }

        return { canReview: true };
    };

    return {
        reviews: state.reviews,
        isLoading: state.isLoading,
        error: state.error,
        refetch: fetchReviews,
        getTeacherReviews,
        createReview,
        updateReview,
        deleteReview,
        approveReview,
        rejectReview,
        getAverageRating,
        getRatingDistribution,
        canReview,
    };
}
