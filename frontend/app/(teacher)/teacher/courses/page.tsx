'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    Filter,
    Plus,
    LayoutGrid,
    List,
    ChevronLeft,
    ChevronRight,
    Eye,
    Edit,
    BookOpen,
    Users,
    Star,
    Clock,
    Play,
    MoreHorizontal,
    Trash2,
    Video,
    Loader2
} from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';

const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'primary', name: 'Primary' },
    { id: 'preparatory', name: 'Preparatory' },
    { id: 'secondary', name: 'Secondary' },
];

const statuses = [
    { id: 'all', name: 'All Status' },
    { id: 'published', name: 'Published' },
    { id: 'draft', name: 'Draft' },
];

const statusColors = {
    published: 'bg-emerald-100 text-emerald-700',
    draft: 'bg-amber-100 text-amber-700',
    active: 'bg-emerald-100 text-emerald-700',
};

export default function MyCoursesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Use real data from hook
    const { courses: rawCourses, isLoading, error, refetch } = useCourses({
        level: selectedLevel !== 'all' ? selectedLevel : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        search: searchQuery || undefined,
    });

    // Transform data to match UI
    const myCourses = rawCourses.map(c => ({
        id: c.id,
        title: c.name,
        description: c.description || '',
        thumbnail: c.thumbnail_url || 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
        level: c.level ? c.level.charAt(0).toUpperCase() + c.level.slice(1) : 'Unknown',
        studentsCount: 0, // Would need batch enrollment count
        lessonsCount: 0, // Would need lessons count
        duration: `${c.duration_weeks || 0} weeks`,
        rating: 0,
        reviewsCount: 0,
        price: c.price || 0,
        status: c.status || 'draft',
        progress: 100,
    }));

    // Filter courses (search handled by hook)
    const filteredCourses = myCourses;

    // Stats
    const stats = {
        total: myCourses.length,
        published: myCourses.filter((c) => c.status === 'active').length,
        drafts: myCourses.filter((c) => c.status === 'draft').length,
        totalStudents: myCourses.reduce((acc, c) => acc + c.studentsCount, 0),
    };

    // Pagination
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const paginatedCourses = filteredCourses.slice(
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
                            {stats.total} courses • {stats.totalStudents} total students
                        </p>
                    </div>
                </div>

                <Link href="/teacher/courses/new">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Create Course
                    </motion.button>
                </Link>
            </motion.div>

            {/* Stats Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {[
                    { label: 'Total Courses', value: stats.total, icon: BookOpen, color: 'blue' },
                    { label: 'Published', value: stats.published, icon: Play, color: 'emerald' },
                    { label: 'Drafts', value: stats.drafts, icon: Edit, color: 'amber' },
                    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'purple' },
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
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Level Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                        >
                            {levels.map((level) => (
                                <option key={level.id} value={level.id}>
                                    {level.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                    >
                        {statuses.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.name}
                            </option>
                        ))}
                    </select>

                    {/* View Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow text-blue-500' : 'text-gray-500'
                                }`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow text-blue-500' : 'text-gray-500'
                                }`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Courses Grid/Table */}
            <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {paginatedCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * index }}
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-40 overflow-hidden">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[course.status as keyof typeof statusColors]}`}>
                                            {course.status}
                                        </span>
                                    </div>
                                    {course.status === 'draft' && (
                                        <div className="absolute top-3 right-3">
                                            <span className="px-2 py-1 bg-white/90 rounded-full text-xs font-medium text-gray-700">
                                                {course.progress}% complete
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <h3 className="font-bold text-white truncate">{course.title}</h3>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.description}</p>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <div className="flex items-center justify-center gap-1 text-gray-600">
                                                <Users className="w-3 h-3" />
                                                <span className="text-sm font-semibold">{course.studentsCount}</span>
                                            </div>
                                            <p className="text-xs text-gray-400">Students</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <div className="flex items-center justify-center gap-1 text-gray-600">
                                                <Play className="w-3 h-3" />
                                                <span className="text-sm font-semibold">{course.lessonsCount}</span>
                                            </div>
                                            <p className="text-xs text-gray-400">Lessons</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <div className="flex items-center justify-center gap-1 text-amber-500">
                                                <Star className="w-3 h-3 fill-amber-400" />
                                                <span className="text-sm font-semibold">{course.rating || '-'}</span>
                                            </div>
                                            <p className="text-xs text-gray-400">Rating</p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <span className="text-sm text-gray-500">{course.level}</span>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/teacher/courses/${course.id}`}>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </motion.button>
                                            </Link>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-100"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </motion.button>
                                            {course.status === 'active' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-2 rounded-lg bg-purple-50 text-purple-500 hover:bg-purple-100"
                                                >
                                                    <Video className="w-4 h-4" />
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Course</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Level</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Students</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Rating</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedCourses.map((course, index) => (
                                        <motion.tr
                                            key={course.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * index }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={course.thumbnail} alt="" loading="lazy" className="w-12 h-8 rounded-lg object-cover" />
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{course.title}</p>
                                                        <p className="text-xs text-gray-500">{course.lessonsCount} lessons • {course.duration}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell text-gray-600">{course.level}</td>
                                            <td className="px-6 py-4 text-gray-900 font-medium">{course.studentsCount}</td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                    <span>{course.rating || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[course.status as keyof typeof statusColors]}`}>
                                                    {course.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/teacher/courses/${course.id}`}>
                                                        <button className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </Link>
                                                    <button className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
            {filteredCourses.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedLevel('all'); setSelectedStatus('all'); }}
                        className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
}
