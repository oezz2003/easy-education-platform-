'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    BookOpen,
    Play,
    Clock,
    Trophy,
    Flame,
    Zap,
    Calendar,
    TrendingUp,
    ChevronRight,
    Star,
    Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useStudents } from '@/hooks/useStudents';
import { useSessions } from '@/hooks/useSessions';
import { useState, useEffect } from 'react';

export default function StudentDashboard() {
    const { profile, isLoading: authLoading } = useAuth();
    const { students, getStudent } = useStudents();
    const { sessions } = useSessions();
    const [enrolledBatchIds, setEnrolledBatchIds] = useState<string[]>([]);

    // Get current student's data
    const currentStudent = students.find(s => s.profile?.id === profile?.id);
    const xpPoints = currentStudent?.xp_points || 0;
    const streak = currentStudent?.streak_days || 0;

    // Fetch enrolled batches
    useEffect(() => {
        const fetchEnrollments = async () => {
            if (currentStudent?.id) {
                const { data } = await getStudent(currentStudent.id);
                if (data?.enrollments) {
                    const activeBatches = data.enrollments
                        .filter((e: any) => e.status === 'active')
                        .map((e: any) => e.batch_id);
                    setEnrolledBatchIds(activeBatches);
                }
            }
        };
        fetchEnrollments();
    }, [currentStudent, getStudent]);

    // Get today's sessions for enrolled batches
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(s => {
        const isToday = s.session_date === today;
        const isEnrolled = enrolledBatchIds.includes((s as any).batch_id);
        const isInvited = (s as any).invited_students?.includes(currentStudent?.id);
        return isToday && (isEnrolled || isInvited);
    });

    // Stats data - mix of real and placeholder
    const stats = [
        {
            label: 'Enrolled Courses',
            value: '6',
            change: '+2 this month',
            icon: BookOpen,
            icon3D: '/ASSITS/folders.png',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-400',
        },
        {
            label: 'Lessons Done',
            value: '45',
            change: '+12 this week',
            icon: Play,
            icon3D: '/ASSITS/play.png',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-400',
        },
        {
            label: 'Hours Learned',
            value: '32h',
            change: '8h this week',
            icon: Clock,
            icon3D: '/ASSITS/global.png',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-400',
        },
        {
            label: 'Achievements',
            value: '12',
            change: '3 new badges',
            icon: Trophy,
            icon3D: '/ASSITS/cup.png',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-400',
        },
    ];

    // Continue learning data - placeholder
    const continueLesson = {
        courseId: '1',
        courseTitle: 'Advanced Algebra',
        lessonTitle: 'Quadratic Equations',
        progress: 65,
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
        duration: '25 min remaining',
    };

    // Today's schedule from real sessions or placeholder
    const todaySchedule = todaySessions.length > 0
        ? todaySessions.slice(0, 3).map(s => ({
            id: s.id,
            title: s.title || 'Session',
            time: s.start_time || '',
            type: 'live' as const,
            teacher: 'Teacher'
        }))
        : [
            { id: '1', title: 'Algebra Live Session', time: '2:00 PM', type: 'live' as const, teacher: 'Ahmed Hassan' },
            { id: '2', title: 'Calculus Homework Due', time: '6:00 PM', type: 'assignment' as const, course: 'Calculus Mastery' },
            { id: '3', title: 'Geometry Quiz', time: '8:00 PM', type: 'quiz' as const, course: 'Geometry Basics' },
        ];

    // Recent activity placeholder
    const recentActivity = [
        { action: 'Completed "Linear Functions" lesson', time: '2 hours ago', xp: 50 },
        { action: 'Earned "Quick Learner" badge 🏆', time: '5 hours ago', xp: 100 },
        { action: 'Started "Advanced Algebra" course', time: '1 day ago', xp: 25 },
        { action: 'Achieved streak! 🔥', time: '1 day ago', xp: 75 },
    ];

    // In progress courses placeholder
    const inProgressCourses = [
        { id: '1', title: 'Advanced Algebra', progress: 65, lessons: 24, thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400' },
        { id: '2', title: 'Calculus Mastery', progress: 40, lessons: 32, thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400' },
        { id: '3', title: 'Geometry Basics', progress: 80, lessons: 18, thumbnail: 'https://images.unsplash.com/photo-1582394219616-5f46b8e7a4a2?w=400' },
    ];

    // Get user display name
    const displayName = profile?.full_name?.split(' ')[0] || 'Champion';

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }
    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <motion.img
                        src="/login-signup assits/student.png"
                        alt="Student"
                        loading="lazy"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-16 h-16 object-contain"
                    />
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            أهلاً يا بطل! 👋
                        </h1>
                        <p className="text-gray-600">
                            Ready to learn something new today?
                        </p>
                    </div>
                </div>

                {/* Streak & XP Quick View */}
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl"
                    >
                        <Flame className="w-5 h-5 text-orange-500" />
                        <span className="font-bold text-orange-700">7 day streak!</span>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl"
                    >
                        <Zap className="w-5 h-5 text-amber-500" />
                        <span className="font-bold text-amber-700">2,450 XP</span>
                    </motion.div>
                </div>
            </motion.div>

            {/* Continue Learning Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative bg-gradient-to-r from-emerald-500 to-green-500 rounded-[2rem] p-6 shadow-xl overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />

                <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                    <img
                        src={continueLesson.thumbnail}
                        alt={continueLesson.courseTitle}
                        className="w-full md:w-48 h-32 rounded-2xl object-cover shadow-lg"
                    />
                    <div className="flex-1 text-white">
                        <p className="text-emerald-100 text-sm mb-1">Continue where you left off</p>
                        <h2 className="text-xl font-bold mb-2">{continueLesson.courseTitle}</h2>
                        <p className="text-emerald-100 mb-3">📚 {continueLesson.lessonTitle}</p>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 max-w-xs">
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span>{continueLesson.progress}% complete</span>
                                    <span>{continueLesson.duration}</span>
                                </div>
                                <div className="w-full h-2 bg-white/30 rounded-full">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${continueLesson.progress}%` }}
                                        transition={{ duration: 0.8 }}
                                        className="h-full bg-white rounded-full"
                                    />
                                </div>
                            </div>
                            <Link href={`/student/courses/${continueLesson.courseId}`}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-xl font-bold shadow-lg"
                                >
                                    <Play className="w-5 h-5" />
                                    Continue
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className={`relative bg-white rounded-[2rem] p-5 shadow-lg border-b-4 ${stat.borderColor} overflow-hidden`}
                    >
                        <motion.img
                            src={stat.icon3D}
                            alt=""
                            loading="lazy"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-3 right-3 w-12 h-12 object-contain opacity-80"
                        />
                        <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-xs text-emerald-600 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {stat.change}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* In Progress Courses */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-white rounded-[2rem] p-6 shadow-lg border-b-4 border-purple-400"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-purple-500" />
                            My Courses
                        </h3>
                        <Link href="/student/courses" className="text-sm text-purple-500 hover:text-purple-600 font-medium flex items-center gap-1">
                            View all <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {inProgressCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                            >
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-16 h-12 rounded-xl object-cover"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{course.title}</p>
                                    <p className="text-xs text-gray-500">{course.lessons} lessons</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-emerald-600">{course.progress}%</p>
                                    <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full"
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                </div>
                                <Link href={`/student/courses/${course.id}`}>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 rounded-xl bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                                    >
                                        <Play className="w-4 h-4" />
                                    </motion.button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Today's Schedule */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-[2rem] p-6 shadow-lg border-b-4 border-blue-400"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        Today's Schedule
                    </h3>
                    <div className="space-y-3">
                        {todaySchedule.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'live' ? 'bg-red-100' :
                                    item.type === 'assignment' ? 'bg-amber-100' : 'bg-purple-100'
                                    }`}>
                                    {item.type === 'live' && <Play className="w-4 h-4 text-red-500" />}
                                    {item.type === 'assignment' && <Clock className="w-4 h-4 text-amber-500" />}
                                    {item.type === 'quiz' && <Star className="w-4 h-4 text-purple-500" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                                    <p className="text-xs text-gray-500">{item.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-[2rem] p-6 shadow-lg border-b-4 border-amber-400"
            >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Recent Activity
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recentActivity.map((activity, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl"
                        >
                            <p className="text-sm text-gray-700 mb-2">{activity.action}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{activity.time}</span>
                                <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                                    +{activity.xp} XP
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
