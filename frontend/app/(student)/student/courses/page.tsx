'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    Filter,
    BookOpen,
    Play,
    Clock,
    Star,
    ChevronRight,
    CheckCircle,
    Circle,
    Loader2
} from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';

const statusFilters = [
    { id: 'all', label: 'All Courses' },
    { id: 'active', label: 'In Progress' },
    { id: 'archived', label: 'Completed' },
    { id: 'draft', label: 'Not Started' },
];

const statusColors = {
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    not_started: 'bg-gray-100 text-gray-600',
    active: 'bg-blue-100 text-blue-700',
    archived: 'bg-emerald-100 text-emerald-700',
    draft: 'bg-gray-100 text-gray-600',
};

const statusLabels = {
    in_progress: 'In Progress',
    completed: 'Completed',
    not_started: 'Not Started',
    active: 'In Progress',
    archived: 'Completed',
    draft: 'Not Started',
};

export default function MyCoursesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Fetch real data
    const { courses: rawCourses, isLoading, error, refetch } = useCourses({
        status: selectedStatus !== 'all' ? selectedStatus as 'active' | 'archived' | 'draft' : undefined,
        search: searchQuery || undefined,
    });

    // Transform courses data
    const enrolledCourses = rawCourses.map(c => ({
        id: c.id,
        title: c.name,
        description: c.description || '',
        thumbnail: c.thumbnail_url || 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
        teacher: 'Teacher', // Would need batch/teacher join
        progress: c.status === 'archived' ? 100 : c.status === 'active' ? 50 : 0,
        lessonsCompleted: 0,
        totalLessons: 0,
        duration: `${c.duration_weeks || 0} weeks`,
        rating: 4.5,
        status: c.status === 'active' ? 'in_progress' : c.status === 'archived' ? 'completed' : 'not_started',
        lastAccessed: 'Recently',
    }));

    // Filter courses (handled by hook)
    const filteredCourses = enrolledCourses.filter((course) => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.teacher.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    // Stats
    const stats = {
        total: enrolledCourses.length,
        inProgress: enrolledCourses.filter(c => c.status === 'in_progress').length,
        completed: enrolledCourses.filter(c => c.status === 'completed').length,
        totalHours: `${enrolledCourses.length * 20}h`, // Placeholder
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={refetch}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"
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
                            src="/ASSITS/folders.png"
                            alt="Courses"
                            loading="lazy"
                            className="w-14 h-14 object-contain"
                        />
                    </motion.div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            My Courses
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {stats.total} courses • {stats.totalHours} total learning
                        </p>
                    </div>
                </div>

                <Link href="/courses">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl font-semibold shadow-lg"
                    >
                        <BookOpen className="w-5 h-5" />
                        Browse Courses
                    </motion.button>
                </Link>
            </motion.div>

            {/* Stats Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-4"
            >
                {[
                    { label: 'In Progress', value: stats.inProgress, color: 'blue', icon: Circle },
                    { label: 'Completed', value: stats.completed, color: 'emerald', icon: CheckCircle },
                    { label: 'Total Hours', value: stats.totalHours, color: 'purple', icon: Clock },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (index + 1) }}
                        className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center"
                    >
                        <stat.icon className={`w-6 h-6 text-${stat.color}-500 mx-auto mb-2`} />
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Filters Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
            >
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Status Filter Tabs */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 overflow-x-auto">
                        {statusFilters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setSelectedStatus(filter.id)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${selectedStatus === filter.id
                                    ? 'bg-white shadow text-emerald-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Courses Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course, index) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group"
                    >
                        {/* Thumbnail */}
                        <div className="relative h-40 overflow-hidden">
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute top-3 left-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[course.status as keyof typeof statusColors]}`}>
                                    {statusLabels[course.status as keyof typeof statusLabels]}
                                </span>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                                <h3 className="font-bold text-white truncate">{course.title}</h3>
                                <p className="text-sm text-white/80">{course.teacher}</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            {/* Progress */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">
                                        {course.lessonsCompleted}/{course.totalLessons} lessons
                                    </span>
                                    <span className="font-bold text-emerald-600">{course.progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${course.progress}%` }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                        className={`h-full rounded-full ${course.status === 'completed' ? 'bg-emerald-500' :
                                            course.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {course.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    {course.rating}
                                </span>
                            </div>

                            {/* Action Button */}
                            <Link href={`/student/courses/${course.id}`}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-colors ${course.status === 'completed'
                                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                        : course.status === 'in_progress'
                                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {course.status === 'completed' ? (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            Review Course
                                        </>
                                    ) : course.status === 'in_progress' ? (
                                        <>
                                            <Play className="w-4 h-4" />
                                            Continue Learning
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4" />
                                            Start Course
                                        </>
                                    )}
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedStatus('all'); }}
                        className="text-emerald-500 hover:text-emerald-600 font-medium"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
}
