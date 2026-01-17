'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    Filter,
    Users,
    Eye,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    BookOpen,
    Clock,
    Loader2
} from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
import { useCourses } from '@/hooks/useCourses';
import { UserAvatar } from '@/app/components/shared/UserAvatar';

const performanceColors = {
    excellent: 'bg-emerald-100 text-emerald-700',
    good: 'bg-blue-100 text-blue-700',
    needs_attention: 'bg-amber-100 text-amber-700',
};

const performanceLabels = {
    excellent: 'Excellent',
    good: 'Good',
    needs_attention: 'Needs Attention',
};

export default function MyStudentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Fetch real data
    const { students: rawStudents, isLoading, error, refetch } = useStudents({
        search: searchQuery || undefined,
    });
    const { courses: rawCourses } = useCourses();

    // Transform courses for filter dropdown
    const courses = [
        { id: 'all', name: 'All Courses' },
        ...rawCourses.map(c => ({ id: c.id, name: c.name }))
    ];

    // Transform students data
    const myStudents = rawStudents.map(s => ({
        id: s.id,
        name: s.profile?.full_name || 'Unknown',
        email: s.profile?.email || '',
        avatar: s.profile?.avatar_url,
        enrolledCourses: [] as string[], // Would need enrollments query
        overallProgress: 0, // Would need progress calculation
        lastActive: 'Recently',
        joinedAt: s.created_at?.split('T')[0] || '',
        performance: s.xp_points > 1000 ? 'excellent' : s.xp_points > 500 ? 'good' : 'needs_attention',
    }));

    // Filter students (search handled by hook)
    const filteredStudents = myStudents;

    // Stats
    const stats = {
        total: myStudents.length,
        activeToday: myStudents.filter(s => s.lastActive.includes('hour') || s.lastActive === 'Recently').length,
        excellent: myStudents.filter(s => s.performance === 'excellent').length,
        needsAttention: myStudents.filter(s => s.performance === 'needs_attention').length,
    };

    // Pagination
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const paginatedStudents = filteredStudents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={refetch}
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
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
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <img
                            src="/login-signup assits/student.png"
                            alt="Students"
                            loading="lazy"
                            className="w-14 h-14 object-contain"
                        />
                    </motion.div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            My Students
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {stats.total} students enrolled in your courses
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {[
                    { label: 'Total Students', value: stats.total, icon: Users, color: 'blue' },
                    { label: 'Active Today', value: stats.activeToday, icon: Clock, color: 'emerald' },
                    { label: 'Top Performers', value: stats.excellent, icon: TrendingUp, color: 'purple' },
                    { label: 'Need Attention', value: stats.needsAttention, icon: BookOpen, color: 'amber' },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Filters Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
            >
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Course Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                        >
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Students Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedStudents.map((student, index) => (
                    <motion.div
                        key={student.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <UserAvatar
                                    src={student.avatar}
                                    name={student.name}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                                    <p className="text-sm text-gray-500">{student.email}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${performanceColors[student.performance as keyof typeof performanceColors]}`}>
                                {performanceLabels[student.performance as keyof typeof performanceLabels]}
                            </span>
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Overall Progress</span>
                                <span className="font-semibold text-gray-900">{student.overallProgress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${student.overallProgress}%` }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className={`h-full rounded-full ${student.overallProgress >= 80 ? 'bg-emerald-500' :
                                        student.overallProgress >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Enrolled Courses */}
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Enrolled in:</p>
                            <div className="flex flex-wrap gap-1">
                                {student.enrolledCourses.map((course, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                        {course}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400">Last active: {student.lastActive}</p>
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                </motion.button>
                                <Link href={`/teacher/students/${student.id}`}>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-100"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg font-medium ${currentPage === page ? 'bg-blue-500 text-white' : 'border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Empty State */}
            {filteredStudents.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedCourse('all'); }}
                        className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
}
