'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Users, GraduationCap, BookOpen, Video, TrendingUp, DollarSign, Clock, Star } from 'lucide-react';

// Stat cards data
const stats = [
    {
        label: 'Total Students',
        value: '1,234',
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
        value: '48',
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
        value: '156',
        change: '+8%',
        changeType: 'positive',
        icon: BookOpen,
        icon3D: '/ASSITS/folders.png',
        color: 'purple',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-400',
    },
    {
        label: 'Live Sessions',
        value: '12',
        change: 'Today',
        changeType: 'neutral',
        icon: Video,
        icon3D: '/ASSITS/play.png',
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-400',
    },
];

// Recent activity data
const recentActivity = [
    { type: 'student', action: 'New student registered', name: 'Ahmed Hassan', time: '2 min ago' },
    { type: 'course', action: 'Course completed', name: 'Math 101', time: '15 min ago' },
    { type: 'teacher', action: 'Teacher added', name: 'Dr. Sara Ali', time: '1 hour ago' },
    { type: 'session', action: 'Live session started', name: 'Physics Class', time: '2 hours ago' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, Boss! 👋
                </h1>
                <p className="text-gray-600">
                    Here's what's happening with Easy Education today.
                </p>
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
                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="lg:col-span-2 bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-b-4 border-[var(--color-primary-400)]"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[var(--color-primary-500)]" />
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.type === 'student' ? 'bg-emerald-100' :
                                    activity.type === 'teacher' ? 'bg-blue-100' :
                                        activity.type === 'course' ? 'bg-purple-100' :
                                            'bg-red-100'
                                    }`}>
                                    {activity.type === 'student' && <Users className="w-5 h-5 text-emerald-600" />}
                                    {activity.type === 'teacher' && <GraduationCap className="w-5 h-5 text-blue-600" />}
                                    {activity.type === 'course' && <BookOpen className="w-5 h-5 text-purple-600" />}
                                    {activity.type === 'session' && <Video className="w-5 h-5 text-red-600" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-xs text-gray-500">{activity.name}</p>
                                </div>
                                <span className="text-xs text-gray-400">{activity.time}</span>
                            </motion.div>
                        ))}
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
                            <span className="font-bold text-gray-900">$12,450</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                                <span className="text-sm text-gray-700">Growth</span>
                            </div>
                            <span className="font-bold text-emerald-600">+24%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <span className="text-sm text-gray-700">Avg. Session</span>
                            </div>
                            <span className="font-bold text-gray-900">45 min</span>
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
                            You're doing great, Boss. The platform is growing!
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
