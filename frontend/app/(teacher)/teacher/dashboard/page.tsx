'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users, BookOpen, Video, Clock, TrendingUp, Calendar, Play, ChevronRight, Loader2, GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSessions } from '@/hooks/useSessions';
import { useBatches } from '@/hooks/useBatches';
import { useTeachers } from '@/hooks/useTeachers';
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function TeacherDashboard() {
    const { profile } = useAuth();
    const { teachers } = useTeachers();
    const [enrollmentCount, setEnrollmentCount] = useState(0);

    // Find current teacher profile
    const currentTeacher = teachers.find(t => t.profile?.id === profile?.id);
    const teacherId = currentTeacher?.id;
    const teacherName = profile?.full_name?.split(' ')[0] || 'Teacher';

    // Use teacherId for scoped data fetching
    const { sessions, isLoading: sessionsLoading } = useSessions({ teacherId });
    const { batches, isLoading: batchesLoading } = useBatches({ teacherId });

    // Fetch actual enrollment count
    useEffect(() => {
        const fetchEnrollments = async () => {
            if (!teacherId || batches.length === 0) {
                setEnrollmentCount(0);
                return;
            }

            const supabase = getSupabaseClient();
            const batchIds = batches.map(b => b.id);

            const { count, error } = await supabase
                .from('batch_enrollments')
                .select('*', { count: 'exact', head: true })
                .in('batch_id', batchIds)
                .eq('status', 'active');

            if (!error && count !== null) {
                setEnrollmentCount(count);
            }
        };

        fetchEnrollments();
    }, [teacherId, batches]);

    const isLoading = sessionsLoading || batchesLoading;

    // Calculate stats from real data
    const activeBatches = batches.filter(b => b.status === 'active');
    const upcomingSessions = sessions.filter(s => {
        const sessionDate = new Date(s.session_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return sessionDate >= today && s.status === 'scheduled';
    });
    const todaySessions = sessions.filter(s => {
        const today = new Date().toISOString().split('T')[0];
        return s.session_date === today;
    });

    // Calculate completed sessions this week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const completedThisWeek = sessions.filter(s => {
        const sessionDate = new Date(s.session_date);
        return sessionDate >= startOfWeek && s.status === 'completed';
    }).length;

    const stats = [
        {
            label: 'My Students',
            value: enrollmentCount.toString(),
            change: 'enrolled in your batches',
            changeType: 'neutral',
            icon: GraduationCap,
            icon3D: '/login-signup assits/student.png',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-400',
        },
        {
            label: 'Active Batches',
            value: activeBatches.length.toString(),
            change: `${batches.length} total`,
            changeType: 'neutral',
            icon: BookOpen,
            icon3D: '/ASSITS/folders.png',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-400',
        },
        {
            label: 'Sessions Today',
            value: todaySessions.length.toString(),
            change: todaySessions.length > 0 ? 'Scheduled' : 'No sessions today',
            changeType: todaySessions.length > 0 ? 'positive' : 'neutral',
            icon: Video,
            icon3D: '/ASSITS/play.png',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-400',
        },
        {
            label: 'This Week',
            value: completedThisWeek.toString(),
            change: 'sessions completed',
            changeType: 'positive',
            icon: TrendingUp,
            icon3D: '/ASSITS/cup.png',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-400',
        },
    ];

    // Get upcoming sessions for today's schedule
    const todaySchedule = todaySessions.slice(0, 4).map(s => {
        const batch = batches.find(b => b.id === (s as any).batch_id);
        return {
            id: s.id,
            title: s.title || 'Session',
            batchName: (batch as any)?.name || 'General',
            time: s.start_time || '',
            duration: s.duration_minutes ? `${s.duration_minutes}m` : '1h',
            status: s.status === 'completed' ? 'completed' : s.status === 'live' ? 'live' : 'upcoming',
        };
    });

    // Get upcoming sessions (next 7 days)
    const upcomingSchedule = upcomingSessions.slice(0, 3).map(s => {
        const batch = batches.find(b => b.id === (s as any).batch_id);
        return {
            id: s.id,
            title: s.title || 'Session',
            batchName: (batch as any)?.name || 'General',
            date: s.session_date,
            time: s.start_time || '',
        };
    });

    // Get active batches for quick view
    const activeBatchesList = activeBatches.slice(0, 3).map(b => ({
        id: b.id,
        name: b.name,
        courseName: (b as any).course?.name || 'No course',
        progress: b.sessions_count ? Math.round(((b.completed_sessions || 0) / b.sessions_count) * 100) : 0,
        studentsMax: b.max_students,
    }));

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <motion.img
                        src="/login-signup assits/teacher.png"
                        alt="Teacher"
                        loading="lazy"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-16 h-16 object-contain"
                    />
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Welcome back, {teacherName}! 👋
                        </h1>
                        <p className="text-gray-600">
                            Here's what's happening with your classes today.
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-3">
                    <Link href="/teacher/sessions">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                        >
                            <Calendar className="w-4 h-4" />
                            View Schedule
                        </motion.button>
                    </Link>
                    <Link href="/teacher/courses">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                        >
                            <BookOpen className="w-4 h-4" />
                            My Batches
                        </motion.button>
                    </Link>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className={`relative bg-white rounded-[2rem] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-b-4 ${stat.borderColor} overflow-hidden`}
                    >
                        {/* 3D Icon */}
                        <motion.img
                            src={stat.icon3D}
                            alt=""
                            loading="lazy"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-4 right-4 w-12 h-12 sm:w-14 sm:h-14 object-contain opacity-80"
                        />

                        {/* Content */}
                        <div className="relative z-10">
                            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                            <div className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.changeType === 'positive'
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-gray-100 text-gray-600'
                                }`}>
                                {stat.changeType === 'positive' && <TrendingUp className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Today's Schedule */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="lg:col-span-2 bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-b-4 border-blue-400"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            Today's Schedule
                        </h3>
                        <Link href="/teacher/sessions" className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1">
                            View all <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {todaySchedule.length > 0 ? (
                        <div className="space-y-3">
                            {todaySchedule.map((session, index) => (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${session.status === 'completed'
                                        ? 'bg-gray-50 opacity-60'
                                        : session.status === 'live'
                                            ? 'bg-red-50'
                                            : 'bg-blue-50 hover:bg-blue-100'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${session.status === 'completed' ? 'bg-gray-200' :
                                        session.status === 'live' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
                                        }`}>
                                        <Play className={`w-5 h-5 ${session.status === 'completed' ? 'text-gray-500' : 'text-white'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{session.title}</p>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {session.time} • {session.duration}
                                            </span>
                                            <span className="px-2 py-0.5 bg-white rounded-full text-xs">
                                                {session.batchName}
                                            </span>
                                        </div>
                                    </div>
                                    {session.status === 'live' && (
                                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium animate-pulse">
                                            LIVE
                                        </span>
                                    )}
                                    {session.status === 'upcoming' && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
                                        >
                                            Start
                                        </motion.button>
                                    )}
                                    {session.status === 'completed' && (
                                        <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
                                            Completed
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No sessions scheduled for today</p>
                            <Link href="/teacher/sessions" className="text-blue-500 text-sm mt-2 block">
                                View upcoming sessions →
                            </Link>
                        </div>
                    )}
                </motion.div>

                {/* Active Batches */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-b-4 border-emerald-400"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-emerald-500" />
                            Active Batches
                        </h3>
                        <Link href="/teacher/courses" className="text-sm text-emerald-500 hover:text-emerald-600 font-medium flex items-center gap-1">
                            View all <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {activeBatchesList.length > 0 ? (
                        <div className="space-y-4">
                            {activeBatchesList.map((batch, index) => (
                                <motion.div
                                    key={batch.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-gray-900 text-sm">{batch.name}</h4>
                                        <span className="text-xs text-gray-500">{batch.progress}%</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">{batch.courseName}</p>
                                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${batch.progress}%` }}
                                            transition={{ duration: 1, delay: 0.8 }}
                                            className="h-full bg-emerald-500 rounded-full"
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No active batches</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Upcoming Sessions Preview */}
            {upcomingSchedule.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-b-4 border-purple-400"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-purple-500" />
                            Upcoming This Week
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {upcomingSchedule.map((session, index) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                whileHover={{ y: -3 }}
                                className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100"
                            >
                                <p className="font-semibold text-gray-900 mb-1">{session.title}</p>
                                <p className="text-xs text-gray-500 mb-2">{session.batchName}</p>
                                <div className="flex items-center gap-2 text-sm text-purple-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                    <span>•</span>
                                    <span>{session.time}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
