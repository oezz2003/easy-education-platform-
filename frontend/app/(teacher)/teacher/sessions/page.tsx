'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    Plus,
    Video,
    Calendar,
    Clock,
    Users,
    Play,
    Eye,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { useSessions } from '@/hooks/useSessions';

const statusColors = {
    scheduled: 'bg-blue-100 text-blue-700',
    upcoming: 'bg-blue-100 text-blue-700',
    live: 'bg-red-100 text-red-700',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-600',
};

export default function LiveSessionsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch real data from hook
    const { sessions: rawSessions, isLoading, error, refetch } = useSessions({
        status: filter !== 'all' ? filter : undefined,
    });

    // Transform sessions data (hook returns joined data but typed as LiveSession)
    const mySessions = rawSessions.map(s => {
        const session = s as any; // Runtime data includes joined course
        return {
            id: s.id,
            title: s.title || 'Untitled Session',
            course: session.course?.name || 'General',
            date: s.session_date || '',
            time: s.start_time || '',
            duration: s.duration_minutes ? `${s.duration_minutes}m` : '1h',
            attendees: session.attendance?.length || 0,
            maxAttendees: s.max_attendees || 50,
            status: s.status === 'scheduled' ? 'upcoming' : s.status,
            recurring: s.is_recurring || false,
        };
    });

    // Filter sessions (search client-side, status from hook)
    const filteredSessions = mySessions.filter((session) => {
        const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.course.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    // Stats
    const stats = {
        total: mySessions.length,
        upcoming: mySessions.filter(s => s.status === 'upcoming' || s.status === 'scheduled').length,
        completed: mySessions.filter(s => s.status === 'completed').length,
        totalAttendees: mySessions.reduce((acc, s) => acc + s.attendees, 0),
    };

    // Pagination
    const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
    const paginatedSessions = filteredSessions.slice(
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
                            src="/ASSITS/play.png"
                            alt="Sessions"
                            loading="lazy"
                            className="w-14 h-14 object-contain"
                        />
                    </motion.div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Live Sessions
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Manage your live classes and sessions
                        </p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Schedule Session
                </motion.button>
            </motion.div>

            {/* Stats Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {[
                    { label: 'Total Sessions', value: stats.total, icon: Video, color: 'purple' },
                    { label: 'Upcoming', value: stats.upcoming, icon: Calendar, color: 'blue' },
                    { label: 'Completed', value: stats.completed, icon: Clock, color: 'emerald' },
                    { label: 'Total Attendees', value: stats.totalAttendees, icon: Users, color: 'amber' },
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
                            placeholder="Search sessions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                        {['all', 'upcoming', 'completed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as typeof filter)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors capitalize ${filter === f
                                    ? 'bg-white shadow text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Sessions List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden"
            >
                <div className="divide-y divide-gray-100">
                    {paginatedSessions.map((session, index) => (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * index }}
                            className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                {/* Session Icon */}
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${session.status === 'upcoming' ? 'bg-blue-100' :
                                    session.status === 'live' ? 'bg-red-100' : 'bg-gray-100'
                                    }`}>
                                    <Video className={`w-6 h-6 ${session.status === 'upcoming' ? 'text-blue-600' :
                                        session.status === 'live' ? 'text-red-600' : 'text-gray-500'
                                        }`} />
                                </div>

                                {/* Session Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{session.title}</h3>
                                            <p className="text-sm text-gray-500">{session.course}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[session.status as keyof typeof statusColors]}`}>
                                            {session.status}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {session.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {session.time} • {session.duration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {session.attendees}/{session.maxAttendees}
                                        </span>
                                        {session.recurring && (
                                            <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs">
                                                Recurring
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {session.status === 'upcoming' && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium flex items-center gap-2"
                                        >
                                            <Play className="w-4 h-4" />
                                            Start
                                        </motion.button>
                                    )}
                                    <Link href={`/teacher/sessions/${session.id}`}>
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
                                        className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                            {Math.min(currentPage * itemsPerPage, filteredSessions.length)} of{' '}
                            {filteredSessions.length} sessions
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredSessions.length === 0 && (
                    <div className="text-center py-16">
                        <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                        <button
                            onClick={() => { setSearchQuery(''); setFilter('all'); }}
                            className="text-blue-500 hover:text-blue-600 font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
