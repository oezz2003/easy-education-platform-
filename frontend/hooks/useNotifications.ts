'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Notification, NotificationType, NotificationPriority } from '@/types/database';

interface NotificationsState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
}

export function useNotifications(userId?: string) {
    const [state, setState] = useState<NotificationsState>({
        notifications: [],
        unreadCount: 0,
        isLoading: true,
        error: null,
    });

    const supabase = getSupabaseClient();

    // Fetch notifications
    const fetchNotifications = useCallback(async () => {
        if (!userId) {
            setState(prev => ({ ...prev, isLoading: false }));
            return;
        }

        setState(prev => ({ ...prev, isLoading: true }));

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .eq('is_archived', false)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            setState({ notifications: [], unreadCount: 0, isLoading: false, error: error.message });
        } else {
            const unread = data?.filter((n: Notification) => !n.is_read).length || 0;
            setState({
                notifications: data || [],
                unreadCount: unread,
                isLoading: false,
                error: null,
            });
        }
    }, [supabase, userId]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Subscribe to real-time notifications
    useEffect(() => {
        if (!userId) return;

        const channel = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`,
                },
                (payload: { new: Notification }) => {
                    setState(prev => ({
                        ...prev,
                        notifications: [payload.new, ...prev.notifications],
                        unreadCount: prev.unreadCount + 1,
                    }));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, userId]);

    // Mark as read
    const markAsRead = async (notificationId: string) => {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId);

        if (error) {
            return { success: false, error: error.message };
        }

        setState(prev => ({
            ...prev,
            notifications: prev.notifications.map(n =>
                n.id === notificationId ? { ...n, is_read: true } : n
            ),
            unreadCount: Math.max(0, prev.unreadCount - 1),
        }));
        return { success: true };
    };

    // Mark all as read
    const markAllAsRead = async () => {
        if (!userId) return { success: false, error: 'No user' };

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) {
            return { success: false, error: error.message };
        }

        setState(prev => ({
            ...prev,
            notifications: prev.notifications.map(n => ({ ...n, is_read: true })),
            unreadCount: 0,
        }));
        return { success: true };
    };

    // Archive notification
    const archiveNotification = async (notificationId: string) => {
        const { error } = await supabase
            .from('notifications')
            .update({ is_archived: true })
            .eq('id', notificationId);

        if (error) {
            return { success: false, error: error.message };
        }

        const notification = state.notifications.find(n => n.id === notificationId);
        setState(prev => ({
            ...prev,
            notifications: prev.notifications.filter(n => n.id !== notificationId),
            unreadCount: notification && !notification.is_read ? prev.unreadCount - 1 : prev.unreadCount,
        }));
        return { success: true };
    };

    // Delete notification
    const deleteNotification = async (notificationId: string) => {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', notificationId);

        if (error) {
            return { success: false, error: error.message };
        }

        const notification = state.notifications.find(n => n.id === notificationId);
        setState(prev => ({
            ...prev,
            notifications: prev.notifications.filter(n => n.id !== notificationId),
            unreadCount: notification && !notification.is_read ? prev.unreadCount - 1 : prev.unreadCount,
        }));
        return { success: true };
    };

    // Create notification (admin only)
    const createNotification = async (
        targetUserId: string,
        title: string,
        message: string,
        type: NotificationType,
        options?: {
            relatedId?: string;
            relatedType?: string;
            actionUrl?: string;
            priority?: NotificationPriority;
        }
    ) => {
        const { data, error } = await supabase
            .from('notifications')
            .insert({
                user_id: targetUserId,
                title,
                message,
                type,
                related_id: options?.relatedId,
                related_type: options?.relatedType,
                action_url: options?.actionUrl,
                priority: options?.priority || 'normal',
            })
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true, data };
    };

    // Get notifications by type
    const getByType = (type: NotificationType) => {
        return state.notifications.filter(n => n.type === type);
    };

    // Get high priority notifications
    const getUrgent = () => {
        return state.notifications.filter(n => n.priority === 'high' || n.priority === 'urgent');
    };

    return {
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        isLoading: state.isLoading,
        error: state.error,
        refetch: fetchNotifications,
        markAsRead,
        markAllAsRead,
        archiveNotification,
        deleteNotification,
        createNotification,
        getByType,
        getUrgent,
    };
}
