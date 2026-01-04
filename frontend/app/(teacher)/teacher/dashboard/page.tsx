'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users, BookOpen, Video, DollarSign, TrendingUp, Clock, Calendar, Play, ChevronRight } from 'lucide-react';

// Stats data
const stats = [
    {
        label: 'Total Students',
        value: '450',
        change: '+28 this month',
        changeType: 'positive',
        icon: Users,
        icon3D: '/login-signup assits/student.png',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-400',
    },
    {
        label: 'Active Courses',
        value: '8',
        change: '2 drafts',
        changeType: 'neutral',
        icon: BookOpen,
        icon3D: '/ASSITS/folders.png',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-400',
    },
    {
        label: 'Sessions Today',
        value: '3',
        change: 'Next in 45 min',
        changeType: 'neutral',
        icon: Video,
        icon3D: '/ASSITS/play.png',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-400',
    },
    {
        label: 'This Month',
        value: '$2,450',
        change: '+18%',
        changeType: 'positive',
        icon: DollarSign,
        icon3D: '/ASSITS/cup.png',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-400',
    },
];

// Today's schedule
const todaySchedule = [
    { id: 1, title: 'Algebra Fundamentals', time: '10:00 AM', duration: '1h', students: 25, status: 'completed' },
    { id: 2, title: 'Calculus Review', time: '2:00 PM', duration: '1.5h', students: 18, status: 'upcoming' },
    { id: 3, title: 'Geometry Basics', time: '4:30 PM', duration: '1h', students: 32, status: 'upcoming' },
];

// Recent student activity
const recentActivity = [
    { type: 'enrollment', message: 'Omar Ahmed enrolled in Algebra 101', time: '10 min ago' },
    { type: 'submission', message: 'Sara completed assignment "Chapter 3 Quiz"', time: '25 min ago' },
    { type: 'message', message: 'New question from Khaled about quadratic equations', time: '1 hour ago' },
    { type: 'completion', message: 'Fatma completed "Trigonometry Course"', time: '2 hours ago' },
];

// Top performing courses
const topCourses = [
    { id: 1, title: 'Advanced Algebra', students: 125, rating: 4.9, earnings: '$2,340' },
    { id: 2, title: 'Calculus Mastery', students: 98, rating: 4.8, earnings: '$1,890' },
    { id: 3, title: 'Geometry Basics', students: 87, rating: 4.7, earnings: '$1,420' },
];

export default function TeacherDashboard() {
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
                            Welcome back, Teacher! 👋
                        </h1>
                        <p className="text-gray-600">
                            Here's what's happening with your classes today.
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-3">
                    <Link href="/teacher/courses/new">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                        >
                            <BookOpen className="w-4 h-4" />
                            New Course
                        </motion.button>
                    </Link>
                    <Link href="/teacher/sessions/new">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                        >
                            <Video className="w-4 h-4" />
                            Start Session
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

                    <div className="space-y-3">
                        {todaySchedule.map((session, index) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${session.status === 'completed'
                                    ? 'bg-gray-50 opacity-60'
                                    : 'bg-blue-50 hover:bg-blue-100'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${session.status === 'completed' ? 'bg-gray-200' : 'bg-blue-500'
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
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5" />
                                            {session.students} students
                                        </span>
                                    </div>
                                </div>
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
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-b-4 border-emerald-400"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-500" />
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="flex items-start gap-3"
                            >
                                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'enrollment' ? 'bg-emerald-500' :
                                    activity.type === 'submission' ? 'bg-blue-500' :
                                        activity.type === 'message' ? 'bg-amber-500' :
                                            'bg-purple-500'
                                    }`} />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700">{activity.message}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Top Performing Courses */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-b-4 border-purple-400"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                        Top Performing Courses
                    </h3>
                    <Link href="/teacher/courses" className="text-sm text-purple-500 hover:text-purple-600 font-medium flex items-center gap-1">
                        View all <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {topCourses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            whileHover={{ y: -3 }}
                            className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100"
                        >
                            <h4 className="font-semibold text-gray-900 mb-3">{course.title}</h4>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <p className="text-lg font-bold text-purple-600">{course.students}</p>
                                    <p className="text-xs text-gray-500">Students</p>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-amber-500">⭐ {course.rating}</p>
                                    <p className="text-xs text-gray-500">Rating</p>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-emerald-600">{course.earnings}</p>
                                    <p className="text-xs text-gray-500">Earned</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
