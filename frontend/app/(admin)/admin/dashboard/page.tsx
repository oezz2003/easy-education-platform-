'use client';

import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen, Video, TrendingUp, DollarSign, Clock, Star, Loader2 } from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useAuth } from '@/hooks/useAuth';

export default function AdminDashboard() {
    const { stats, isLoading, error, refetch } = useAdminStats();
    const { profile } = useAuth();

    // Dynamic stats cards based on real data
    const statsCards = [
        {
            label: 'Total Students',
            value: stats?.totalStudents?.toLocaleString() || '0',
            change: '+12%',
            changeType: 'positive',
            icon: Users,
            icon3D: '/login-signup assits/student.png',
            color: 'emerald',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-400',
        },
        {
            label: 'Total Teachers',
            value: stats?.totalTeachers?.toString() || '0',
            change: '+3',
            changeType: 'positive',
            icon: GraduationCap,
            icon3D: '/login-signup assits/teacher.png',
            color: 'blue',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-400',
        },
        {
            label: 'Active Courses',
            value: stats?.totalCourses?.toString() || '0',
            change: '+8%',
            changeType: 'positive',
            icon: BookOpen,
            icon3D: '/ASSITS/folders.png',
            color: 'purple',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-400',
        },
        {
            label: 'Live Sessions Today',
            value: stats?.todaySessions?.toString() || '0',
            change: 'Today',
            changeType: 'neutral',
            icon: Video,
            icon3D: '/ASSITS/play.png',
            color: 'red',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-400',
        },
    ];

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary-500)]" />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-xl hover:bg-[var(--color-primary-600)]"
                >
                    Try Again
                </button>
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
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
                </h1>
                <p className="text-gray-600">
                    Here's what's happening with Easy Education today.
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {statsCards.map((stat, index) => (
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
                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="lg:col-span-2 bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-b-4 border-[var(--color-primary-400)]"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[var(--color-primary-500)]" />
                        Platform Overview
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100">
                                <Users className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">Total Students</p>
                                <p className="text-xs text-gray-500">Registered on platform</p>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{stats?.totalStudents || 0}</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100">
                                <GraduationCap className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">Active Teachers</p>
                                <p className="text-xs text-gray-500">Available for sessions</p>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{stats?.totalTeachers || 0}</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-100">
                                <BookOpen className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">Active Batches</p>
                                <p className="text-xs text-gray-500">Currently running</p>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{stats?.activeBatches || 0}</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100">
                                <DollarSign className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">Pending Invoices</p>
                                <p className="text-xs text-gray-500">Awaiting payment</p>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{stats?.pendingInvoices || 0}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-b-4 border-amber-400"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        Quick Stats
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <DollarSign className="w-5 h-5 text-amber-600" />
                                <span className="text-sm text-gray-700">Revenue</span>
                            </div>
                            <span className="font-bold text-gray-900">
                                ${stats?.totalRevenue?.toLocaleString() || '0'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                                <span className="text-sm text-gray-700">Courses</span>
                            </div>
                            <span className="font-bold text-emerald-600">{stats?.totalCourses || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Video className="w-5 h-5 text-blue-600" />
                                <span className="text-sm text-gray-700">Today's Sessions</span>
                            </div>
                            <span className="font-bold text-gray-900">{stats?.todaySessions || 0}</span>
                        </div>
                    </div>

                    {/* Motivational Card */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-6 p-4 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] rounded-2xl text-white"
                    >
                        <motion.img
                            src="/ASSITS/cup.png"
                            alt=""
                            loading="lazy"
                            animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="w-12 h-12 mb-3"
                        />
                        <h4 className="font-bold mb-1">Keep it up! 🎉</h4>
                        <p className="text-sm text-white/80">
                            You're doing great! The platform is growing!
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

