'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    BookOpen,
    TrendingUp,
    Clock,
    MessageCircle,
    Star,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { UserAvatar } from '@/app/components/shared/UserAvatar';

// Mock student data
const studentData = {
    id: '1',
    name: 'Omar Ahmed',
    email: 'omar.ahmed@email.com',
    phone: '+20 100 123 4567',
    avatar: null,
    joinedAt: '2024-01-15',
    lastActive: '2 hours ago',
    overallProgress: 78,
    performance: 'excellent',
    totalCourses: 2,
    completedCourses: 0,
    totalAssignments: 15,
    completedAssignments: 12,
};

// Mock enrolled courses
const enrolledCourses = [
    {
        id: 1,
        title: 'Advanced Algebra',
        progress: 85,
        lessonsCompleted: 38,
        totalLessons: 45,
        lastAccessed: '2 hours ago',
        grade: 'A',
    },
    {
        id: 2,
        title: 'Calculus Mastery',
        progress: 65,
        lessonsCompleted: 25,
        totalLessons: 38,
        lastAccessed: '1 day ago',
        grade: 'B+',
    },
];

// Mock recent activity
const recentActivity = [
    { id: 1, action: 'Completed lesson "Quadratic Equations"', time: '2 hours ago', type: 'lesson' },
    { id: 2, action: 'Submitted assignment "Chapter 5 Quiz"', time: '1 day ago', type: 'assignment' },
    { id: 3, action: 'Watched lesson "Linear Functions"', time: '2 days ago', type: 'lesson' },
    { id: 4, action: 'Scored 92% on "Mid-term Test"', time: '1 week ago', type: 'test' },
];

// Mock assignments
const assignments = [
    { id: 1, title: 'Chapter 5 Quiz', course: 'Advanced Algebra', dueDate: '2024-03-15', status: 'submitted', score: 85 },
    { id: 2, title: 'Practice Problems Set 3', course: 'Calculus Mastery', dueDate: '2024-03-20', status: 'pending', score: null },
    { id: 3, title: 'Mid-term Test', course: 'Advanced Algebra', dueDate: '2024-03-10', status: 'graded', score: 92 },
];

export default function StudentDetailPage() {
    const params = useParams();

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <Link href="/teacher/students">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-xl bg-white shadow-lg border border-gray-100 hover:bg-gray-50"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </motion.button>
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Student Profile</h1>
            </motion.div>

            {/* Student Overview */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100"
                >
                    <div className="text-center mb-6">
                        <UserAvatar
                            src={studentData.avatar}
                            name={studentData.name}
                            className="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-blue-100"
                        />
                        <h2 className="text-xl font-bold text-gray-900">{studentData.name}</h2>
                        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mt-2">
                            {studentData.performance === 'excellent' ? '⭐ Top Performer' : 'Active Student'}
                        </span>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-600">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span className="text-sm">{studentData.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <span className="text-sm">{studentData.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <span className="text-sm">Joined {studentData.joinedAt}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span className="text-sm">Last active: {studentData.lastActive}</span>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Send Message
                    </motion.button>
                </motion.div>

                {/* Stats & Progress */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Overall Progress', value: `${studentData.overallProgress}%`, icon: TrendingUp, color: 'blue' },
                            { label: 'Courses', value: studentData.totalCourses, icon: BookOpen, color: 'purple' },
                            { label: 'Assignments', value: `${studentData.completedAssignments}/${studentData.totalAssignments}`, icon: CheckCircle, color: 'emerald' },
                            { label: 'Avg. Grade', value: 'A-', icon: Star, color: 'amber' },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center"
                            >
                                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center mx-auto mb-2`}>
                                    <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                                </div>
                                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Enrolled Courses */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-purple-500" />
                            Enrolled Courses
                        </h3>
                        <div className="space-y-4">
                            {enrolledCourses.map((course) => (
                                <div key={course.id} className="p-4 bg-gray-50 rounded-2xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-gray-900">{course.title}</h4>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                            Grade: {course.grade}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                        <span>{course.lessonsCompleted}/{course.totalLessons} lessons</span>
                                        <span>{course.progress}% complete</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${course.progress}%` }}
                                            transition={{ duration: 0.8 }}
                                            className="h-full bg-blue-500 rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Section */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="flex items-start gap-3"
                            >
                                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'lesson' ? 'bg-blue-500' :
                                    activity.type === 'assignment' ? 'bg-emerald-500' : 'bg-purple-500'
                                    }`} />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700">{activity.action}</p>
                                    <p className="text-xs text-gray-400">{activity.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Assignments */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        Assignments
                    </h3>
                    <div className="space-y-3">
                        {assignments.map((assignment) => (
                            <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-medium text-gray-900">{assignment.title}</p>
                                    <p className="text-xs text-gray-500">{assignment.course}</p>
                                </div>
                                <div className="text-right">
                                    {assignment.status === 'graded' && (
                                        <span className="text-emerald-600 font-bold">{assignment.score}%</span>
                                    )}
                                    {assignment.status === 'submitted' && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Submitted</span>
                                    )}
                                    {assignment.status === 'pending' && (
                                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">Pending</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
