'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ArrowLeft,
    Users,
    Star,
    Clock,
    Play,
    Plus,
    Edit,
    Trash2,
    Video,
    FileText,
    BarChart3,
    GripVertical,
    Eye,
    DollarSign
} from 'lucide-react';
import { UserAvatar } from '@/app/components/shared/UserAvatar';

// Mock course data
const courseData = {
    id: '1',
    title: 'Advanced Algebra',
    description: 'Complete algebra course from basics to advanced topics. Learn equations, functions, graphs, and problem-solving techniques.',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800',
    level: 'Secondary',
    subject: 'Mathematics',
    studentsCount: 125,
    lessonsCount: 45,
    duration: '24h 30m',
    rating: 4.9,
    reviewsCount: 89,
    price: 199,
    earnings: 24875,
    status: 'published',
    createdAt: '2024-01-15',
};

// Mock lessons
const lessons = [
    { id: 1, title: 'Introduction to Algebra', duration: '15:30', views: 125, status: 'published', order: 1 },
    { id: 2, title: 'Basic Equations', duration: '22:45', views: 118, status: 'published', order: 2 },
    { id: 3, title: 'Variables and Constants', duration: '18:20', views: 112, status: 'published', order: 3 },
    { id: 4, title: 'Linear Functions', duration: '25:10', views: 98, status: 'published', order: 4 },
    { id: 5, title: 'Graphing Equations', duration: '30:00', views: 87, status: 'published', order: 5 },
    { id: 6, title: 'Quadratic Equations', duration: '28:45', views: 76, status: 'draft', order: 6 },
];

// Mock enrolled students
const enrolledStudents = [
    { id: 1, name: 'Omar Ahmed', avatar: null, progress: 85, lastActive: '2 hours ago' },
    { id: 2, name: 'Sara Hassan', avatar: null, progress: 72, lastActive: '1 day ago' },
    { id: 3, name: 'Khaled Mohamed', avatar: null, progress: 95, lastActive: '5 hours ago' },
    { id: 4, name: 'Fatma Ali', avatar: null, progress: 45, lastActive: '3 days ago' },
];

export default function CourseDetailPage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState<'lessons' | 'students' | 'analytics'>('lessons');

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <Link href="/teacher/courses">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-xl bg-white shadow-lg border border-gray-100 hover:bg-gray-50"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </motion.button>
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{courseData.title}</h1>
                    <p className="text-gray-500 text-sm">{courseData.level} • {courseData.subject}</p>
                </div>
            </motion.div>

            {/* Course Overview Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden"
            >
                <div className="md:flex">
                    {/* Thumbnail */}
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                        <img
                            src={courseData.thumbnail}
                            alt={courseData.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                    </div>

                    {/* Info */}
                    <div className="p-6 md:w-2/3">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                                {courseData.status}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                ${courseData.price}
                            </span>
                        </div>

                        <p className="text-gray-600 mb-6">{courseData.description}</p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    <span className="text-xl font-bold text-gray-900">{courseData.studentsCount}</span>
                                </div>
                                <p className="text-xs text-gray-500">Students</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Play className="w-4 h-4 text-purple-500" />
                                    <span className="text-xl font-bold text-gray-900">{courseData.lessonsCount}</span>
                                </div>
                                <p className="text-xs text-gray-500">Lessons</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                                    <span className="text-xl font-bold text-gray-900">{courseData.rating}</span>
                                </div>
                                <p className="text-xs text-gray-500">{courseData.reviewsCount} reviews</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <DollarSign className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xl font-bold text-gray-900">${courseData.earnings.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-gray-500">Total Earned</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 mt-6">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-medium"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Course
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl font-medium"
                            >
                                <Video className="w-4 h-4" />
                                Start Live Session
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-2 bg-white rounded-2xl p-2 shadow-lg border border-gray-100"
            >
                {[
                    { id: 'lessons', label: 'Lessons', icon: Play },
                    { id: 'students', label: 'Students', icon: Users },
                    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${activeTab === tab.id
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </motion.div>

            {/* Tab Content */}
            {activeTab === 'lessons' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Course Lessons</h2>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Add Lesson
                        </motion.button>
                    </div>

                    <div className="space-y-3">
                        {lessons.map((lesson, index) => (
                            <motion.div
                                key={lesson.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                            >
                                <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                                    {lesson.order}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{lesson.title}</p>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {lesson.duration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3.5 h-3.5" />
                                            {lesson.views} views
                                        </span>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${lesson.status === 'published'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {lesson.status}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 rounded-lg hover:bg-white transition-colors">
                                        <Edit className="w-4 h-4 text-gray-500" />
                                    </button>
                                    <button className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {activeTab === 'students' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100"
                >
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Enrolled Students</h2>

                    <div className="space-y-3">
                        {enrolledStudents.map((student, index) => (
                            <motion.div
                                key={student.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                            >
                                <UserAvatar
                                    src={student.avatar}
                                    name={student.name}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{student.name}</p>
                                    <p className="text-sm text-gray-500">Last active: {student.lastActive}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{student.progress}%</p>
                                    <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${student.progress}%` }}
                                        />
                                    </div>
                                </div>
                                <Link href={`/teacher/students/${student.id}`}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </motion.button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {activeTab === 'analytics' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100"
                >
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Course Analytics</h2>
                    <div className="text-center py-12 text-gray-500">
                        <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p>Analytics dashboard coming soon...</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
