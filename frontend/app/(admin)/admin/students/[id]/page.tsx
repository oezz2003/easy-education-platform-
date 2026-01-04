'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    GraduationCap,
    BookOpen,
    Clock,
    Star,
    TrendingUp,
    Edit,
    Trash2,
    MoreHorizontal,
    Users,
    Play,
    FileText,
    Award
} from 'lucide-react';

// Mock student data
const mockStudents = [
    {
        id: '1',
        name: 'Ahmed Mohamed',
        email: 'ahmed.m@email.com',
        phone: '+20 123 456 7890',
        avatar: 'https://i.pravatar.cc/150?img=11',
        level: 'Primary',
        levelId: 'primary',
        enrolledCourses: 5,
        enrollmentDate: '2024-01-15',
        status: 'active',
        parentName: 'Mohamed Hassan',
        parentPhone: '+20 111 222 3333',
        completedLessons: 45,
        totalLessons: 120,
        averageGrade: 85,
        attendanceRate: 92,
    },
    {
        id: '2',
        name: 'Sara Ali',
        email: 'sara.ali@email.com',
        phone: '+20 100 200 3000',
        avatar: 'https://i.pravatar.cc/150?img=5',
        level: 'Preparatory',
        levelId: 'preparatory',
        enrolledCourses: 3,
        enrollmentDate: '2024-02-20',
        status: 'active',
        parentName: 'Ali Ibrahim',
        parentPhone: '+20 111 333 4444',
        completedLessons: 32,
        totalLessons: 90,
        averageGrade: 92,
        attendanceRate: 98,
    },
];

// Mock enrolled courses
const enrolledCourses = [
    {
        id: '1',
        title: 'Advanced Mathematics',
        teacher: 'Ahmed Hassan',
        progress: 75,
        grade: 88,
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
    },
    {
        id: '2',
        title: 'Physics Fundamentals',
        teacher: 'Sara Ali',
        progress: 60,
        grade: 82,
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
    },
    {
        id: '3',
        title: 'English Grammar',
        teacher: 'Mohamed Farid',
        progress: 90,
        grade: 95,
        thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400',
    },
];

// Mock activity timeline
const activityTimeline = [
    {
        id: '1',
        type: 'lesson',
        title: 'Completed "Algebra Basics"',
        course: 'Advanced Mathematics',
        date: '2024-12-28',
        icon: Play,
    },
    {
        id: '2',
        type: 'grade',
        title: 'Scored 92% on Quiz',
        course: 'Physics Fundamentals',
        date: '2024-12-27',
        icon: Award,
    },
    {
        id: '3',
        type: 'resource',
        title: 'Downloaded "Study Guide"',
        course: 'English Grammar',
        date: '2024-12-26',
        icon: FileText,
    },
    {
        id: '4',
        type: 'lesson',
        title: 'Completed "Verb Tenses"',
        course: 'English Grammar',
        date: '2024-12-25',
        icon: Play,
    },
];

const levelColors = {
    primary: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    preparatory: 'bg-blue-50 text-blue-600 border-blue-200',
    secondary: 'bg-purple-50 text-purple-600 border-purple-200',
};

export default function StudentProfilePage() {
    const params = useParams();
    const studentId = params.id as string;

    const student = mockStudents.find((s) => s.id === studentId);

    if (!student) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Student not found</h2>
                    <p className="text-gray-500 mb-6">The student you're looking for doesn't exist.</p>
                    <Link
                        href="/admin/students"
                        className="text-emerald-500 hover:text-emerald-600 font-medium"
                    >
                        ← Back to Students
                    </Link>
                </div>
            </div>
        );
    }

    const progressPercent = Math.round((student.completedLessons / student.totalLessons) * 100);

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Link
                    href="/admin/students"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-500 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Students</span>
                </Link>
            </motion.div>

            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-32" />
                <div className="px-6 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16">
                        {/* Avatar */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="relative"
                        >
                            <img
                                src={student.avatar}
                                alt={student.name}
                                loading="lazy"
                                className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl object-cover"
                            />
                            <span
                                className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${student.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
                                    }`}
                            />
                        </motion.div>

                        {/* Info */}
                        <div className="flex-1 pt-4 md:pt-0">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {student.name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                        <span
                                            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${levelColors[student.levelId as keyof typeof levelColors]
                                                }`}
                                        >
                                            {student.level}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Student since{' '}
                                            {new Date(student.enrollmentDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium shadow-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Profile
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <MoreHorizontal className="w-5 h-5 text-gray-500" />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="font-medium text-gray-900">{student.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Phone className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="font-medium text-gray-900">{student.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Parent</p>
                                <p className="font-medium text-gray-900">{student.parentName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Enrolled Courses',
                        value: student.enrolledCourses,
                        icon: BookOpen,
                        color: 'emerald',
                    },
                    {
                        label: 'Completed Lessons',
                        value: student.completedLessons,
                        icon: Play,
                        color: 'blue',
                    },
                    {
                        label: 'Average Grade',
                        value: `${student.averageGrade}%`,
                        icon: TrendingUp,
                        color: 'purple',
                    },
                    {
                        label: 'Attendance',
                        value: `${student.attendanceRate}%`,
                        icon: Calendar,
                        color: 'amber',
                    },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100"
                    >
                        <div
                            className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center mb-3`}
                        >
                            <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Enrolled Courses */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Enrolled Courses</h2>
                        <span className="text-sm text-gray-500">{enrolledCourses.length} courses</span>
                    </div>

                    <div className="space-y-4">
                        {enrolledCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors"
                            >
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    loading="lazy"
                                    className="w-20 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                                    <p className="text-sm text-gray-500">{course.teacher}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex-1">
                                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${course.progress}%` }}
                                                    transition={{ delay: 0.5, duration: 0.8 }}
                                                    className="h-full rounded-full bg-emerald-500"
                                                />
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">
                                            {course.progress}%
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        <span className="font-bold text-gray-900">{course.grade}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">Grade</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Activity Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>

                    <div className="space-y-4">
                        {activityTimeline.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="flex gap-3"
                            >
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                    <activity.icon className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {activity.title}
                                    </p>
                                    <p className="text-xs text-gray-500">{activity.course}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(activity.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-3 text-sm font-medium text-emerald-500 hover:text-emerald-600 transition-colors">
                        View All Activity →
                    </button>
                </motion.div>
            </div>

            {/* Overall Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Overall Progress</h2>
                <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24">
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                fill="none"
                                stroke="#f3f4f6"
                                strokeWidth="8"
                            />
                            <motion.circle
                                cx="48"
                                cy="48"
                                r="40"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="8"
                                strokeLinecap="round"
                                initial={{ strokeDasharray: '0 251' }}
                                animate={{
                                    strokeDasharray: `${(progressPercent / 100) * 251} 251`,
                                }}
                                transition={{ delay: 0.5, duration: 1 }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-gray-900">{progressPercent}%</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-gray-600 mb-2">
                            <span className="font-bold text-gray-900">{student.completedLessons}</span> of{' '}
                            <span className="font-bold text-gray-900">{student.totalLessons}</span> lessons
                            completed
                        </p>
                        <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
