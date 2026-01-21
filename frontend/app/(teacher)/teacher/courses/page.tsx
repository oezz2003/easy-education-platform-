'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    Filter,
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
    Calendar,
    Loader2
} from 'lucide-react';
import { useBatches } from '@/hooks/useBatches';
import { useAuth } from '@/hooks/useAuth';
import { useTeachers } from '@/hooks/useTeachers';

const statusColors = {
    active: 'bg-emerald-100 text-emerald-700',
    upcoming: 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-600',
};

export default function MyBatchesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Get current teacher ID
    const { profile } = useAuth();
    const { teachers } = useTeachers();
    const currentTeacher = teachers.find((t: any) => t.profile?.id === profile?.id);
    const teacherId = currentTeacher?.id;

    // Fetch batches for this teacher
    const { batches: rawBatches, isLoading, error, refetch } = useBatches({
        teacherId,
        status: selectedStatus !== 'all' ? selectedStatus as any : undefined,
        search: searchQuery || undefined,
    });

    // Filter batches by search (client-side for name matching)
    const filteredBatches = rawBatches.filter(batch => {
        if (!searchQuery) return true;
        const search = searchQuery.toLowerCase();
        return batch.name?.toLowerCase().includes(search) ||
            (batch as any).course?.name?.toLowerCase().includes(search);
    });

    // Stats
    const stats = {
        total: rawBatches.length,
        active: rawBatches.filter((b) => b.status === 'active').length,
        upcoming: rawBatches.filter((b) => b.status === 'upcoming').length,
        completed: rawBatches.filter((b) => b.status === 'completed').length,
    };

    // Pagination
    const totalPages = Math.ceil(filteredBatches.length / itemsPerPage);
    const paginatedBatches = filteredBatches.slice(
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
                            alt="Batches"
                            loading="lazy"
                            className="w-14 h-14 object-contain"
                        />
                    </motion.div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            My Batches
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {stats.total} batches • {stats.active} active
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
                    { label: 'Total Batches', value: stats.total, icon: BookOpen, color: 'blue' },
                    { label: 'Active', value: stats.active, icon: Play, color: 'emerald' },
                    { label: 'Upcoming', value: stats.upcoming, icon: Calendar, color: 'amber' },
                    { label: 'Completed', value: stats.completed, icon: Clock, color: 'gray' },
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
                            placeholder="Search batches..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                        {['all', 'active', 'upcoming', 'completed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setSelectedStatus(status as typeof selectedStatus)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors capitalize ${selectedStatus === status
                                    ? 'bg-white shadow text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

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

            {/* Batches Grid/Table */}
            <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {paginatedBatches.map((batch, index) => {
                            const course = (batch as any).course;
                            return (
                                <motion.div
                                    key={batch.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative h-32 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-white/30">
                                                {batch.name?.charAt(0) || 'B'}
                                            </span>
                                        </div>
                                        <div className="absolute top-3 left-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[batch.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-600'}`}>
                                                {batch.status}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <h3 className="font-bold text-white truncate">{batch.name}</h3>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <p className="text-sm text-gray-500 mb-3">
                                            {course?.name || 'No course linked'}
                                        </p>

                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                                            <div className="bg-gray-50 rounded-lg p-2">
                                                <div className="flex items-center justify-center gap-1 text-gray-600">
                                                    <Users className="w-3 h-3" />
                                                    <span className="text-sm font-semibold">{batch.max_students}</span>
                                                </div>
                                                <p className="text-xs text-gray-400">Max</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-2">
                                                <div className="flex items-center justify-center gap-1 text-gray-600">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="text-sm font-semibold">{batch.sessions_count || 0}</span>
                                                </div>
                                                <p className="text-xs text-gray-400">Sessions</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-2">
                                                <div className="flex items-center justify-center gap-1 text-emerald-600">
                                                    <Play className="w-3 h-3" />
                                                    <span className="text-sm font-semibold">{batch.completed_sessions || 0}</span>
                                                </div>
                                                <p className="text-xs text-gray-400">Done</p>
                                            </div>
                                        </div>

                                        {/* Dates */}
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                                {new Date(batch.start_date).toLocaleDateString()} - {new Date(batch.end_date).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                                            <Link href={`/teacher/courses/${batch.id}`}>
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
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
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
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Batch</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Course</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Sessions</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Schedule</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedBatches.map((batch, index) => {
                                        const course = (batch as any).course;
                                        return (
                                            <motion.tr
                                                key={batch.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.05 * index }}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                            {batch.name?.charAt(0) || 'B'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{batch.name}</p>
                                                            <p className="text-xs text-gray-500">{batch.schedule}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell text-gray-600">{course?.name || '-'}</td>
                                                <td className="px-6 py-4 text-gray-900 font-medium">
                                                    {batch.completed_sessions || 0}/{batch.sessions_count || 0}
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell text-gray-500 text-sm">
                                                    {new Date(batch.start_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[batch.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-600'}`}>
                                                        {batch.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/teacher/courses/${batch.id}`}>
                                                            <button className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
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
            {filteredBatches.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No batches found</h3>
                    <p className="text-gray-500 mb-6">You don't have any batches assigned yet.</p>
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedStatus('all'); }}
                        className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
}
