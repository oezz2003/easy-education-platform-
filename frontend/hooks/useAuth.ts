'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { Profile, UserRole } from '@/types/database';

interface AuthState {
    user: User | null;
    profile: Profile | null;
    isLoading: boolean;
    error: string | null;
}

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        user: null,
        profile: null,
        isLoading: true,
        error: null,
    });

    const supabase = getSupabaseClient();

    // Fetch user profile
    const fetchProfile = useCallback(async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
        return data as Profile;
    }, [supabase]);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const profile = await fetchProfile(user.id);
                    setState({
                        user,
                        profile,
                        isLoading: false,
                        error: null,
                    });
                } else {
                    setState({
                        user: null,
                        profile: null,
                        isLoading: false,
                        error: null,
                    });
                }
            } catch (error) {
                setState({
                    user: null,
                    profile: null,
                    isLoading: false,
                    error: 'Failed to initialize auth',
                });
            }
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: AuthChangeEvent, session: Session | null) => {
                if (session?.user) {
                    const profile = await fetchProfile(session.user.id);
                    setState({
                        user: session.user,
                        profile,
                        isLoading: false,
                        error: null,
                    });
                } else {
                    setState({
                        user: null,
                        profile: null,
                        isLoading: false,
                        error: null,
                    });
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, fetchProfile]);

    // Sign up
    const signUp = async (
        email: string,
        password: string,
        role: UserRole,
        fullName: string
    ) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    role,
                    full_name: fullName,
                },
            },
        });

        if (error) {
            setState(prev => ({ ...prev, isLoading: false, error: error.message }));
            return { success: false, error: error.message };
        }

        return { success: true, data };
    };

    // Sign in
    const signIn = async (email: string, password: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setState(prev => ({ ...prev, isLoading: false, error: error.message }));
            return { success: false, error: error.message };
        }

        return { success: true, data };
    };

    // Sign out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true };
    };

    // Update profile
    const updateProfile = async (updates: Partial<Profile>) => {
        if (!state.user) return { success: false, error: 'Not authenticated' };

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', state.user.id)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        setState(prev => ({ ...prev, profile: data }));
        return { success: true, data };
    };

    // Upload avatar
    const uploadAvatar = async (file: File) => {
        if (!state.user) return { success: false, error: 'Not authenticated' };

        const fileExt = file.name.split('.').pop();
        const fileName = `${state.user.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

        if (uploadError) {
            return { success: false, error: uploadError.message };
        }

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return { success: true, publicUrl };
    };

    return {
        user: state.user,
        profile: state.profile,
        isLoading: state.isLoading,
        error: state.error,
        isAuthenticated: !!state.user,
        role: state.profile?.role || null,
        signUp,
        signIn,
        signOut,
        updateProfile,
        uploadAvatar,
    };
}
