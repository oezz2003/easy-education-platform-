'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Video,
    Calendar,
    Clock,
    Users,
    Plus,
    ChevronLeft,
    ChevronRight,
    Play,
    ExternalLink,
    MoreHorizontal,
    Eye,
    Trash2,
    Radio,
    CalendarDays,
    Timer,
    UserCheck
} from 'lucide-react';
import CreateSessionModal from '../../../components/admin/CreateSessionModal';

// Mock sessions data
const mockSessions = [
    {
        id: '1',
        title: 'Advanced Algebra Live Class',
        course: { id: '1', title: 'Advanced Mathematics', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400' },
        teacher: { id: '1', name: 'Ahmed Hassan', avatar: 'https://i.pravatar.cc/150?img=11' },
        scheduledAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // Started 30 mins ago
        duration: 90,
        meetLink: 'https://meet.google.com/abc-defg-hij',
        status: 'live',
        attendees: 45,
        maxAttendees: 100,
    },
    {
        id: '2',
        title: 'Physics Problem Solving',
        course: { id: '2', title: 'Physics Fundamentals', thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400' },
        teacher: { id: '2', name: 'Sara Ali', avatar: 'https://i.pravatar.cc/150?img=5' },
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // In 2 hours
        duration: 60,
        meetLink: 'https://meet.google.com/xyz-uvwx-yzl',
        status: 'upcoming',
        attendees: 32,
        maxAttendees: 50,
    },
    {
        id: '3',
        title: 'English Grammar Workshop',
        course: { id: '3', title: 'English Grammar Mastery', thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400' },
        teacher: { id: '3', name: 'Mohamed Farid', avatar: 'https://i.pravatar.cc/150?img=12' },
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        duration: 45,
        meetLink: 'https://meet.google.com/qrs-tuvw-xyz',
        status: 'upcoming',
        attendees: 28,
        maxAttendees: 60,
    },
    {
        id: '4',
        title: 'Chemistry Lab Demo',
        course: { id: '4', title: 'Chemistry Experiments', thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400' },
        teacher: { id: '4', name: 'Fatma Nour', avatar: 'https://i.pravatar.cc/150?img=9' },
        scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        duration: 60,
        meetLink: 'https://meet.google.com/lmn-opqr-stu',
        status: 'completed',
        attendees: 42,
        maxAttendees: 50,
        recordingUrl: 'https://drive.google.com/recording-link',
    },
];

// Generate week days
const getWeekDays = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        return day;
    });
};

const statusConfig = {
    live: { label: 'Live Now', color: 'red', bg: 'bg-red-500', pulse: true },
    upcoming: { label: 'Upcoming', color: 'blue', bg: 'bg-blue-500', pulse: false },
    completed: { label: 'Completed', color: 'emerald', bg: 'bg-emerald-500', pulse: false },
};

export default function LiveSessionsPage() {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');

    const weekDays = getWeekDays(currentWeek);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentWeek(newDate);
    };

    const filteredSessions = mockSessions.filter(session =>
        filter === 'all' || session.status === filter
    );

    // Stats
    const stats = {
        today: mockSessions.filter(s => {
            const sessionDate = new Date(s.scheduledAt).toDateString();
            return sessionDate === new Date().toDateString();
        }).length,
        thisWeek: mockSessions.filter(s => {
            const sessionDate = new Date(s.scheduledAt);
            return weekDays.some(d => d.toDateString() === sessionDate.toDateString());
        }).length,
        totalHours: mockSessions.reduce((acc, s) => acc + s.duration, 0) / 60,
        avgAttendance: Math.round(
            mockSessions.reduce((acc, s) => acc + (s.attendees / s.maxAttendees) * 100, 0) / mockSessions.length
        ),
    };

    const getTimeUntil = (date: string) => {
        const diff = new Date(date).getTime() - Date.now();
        if (diff < 0) return null;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    };

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
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="relative"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                            <Video className="w-7 h-7 text-white" />
                        </div>
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
                    </motion.div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Live Sessions</h1>
                        <p className="text-gray-500 text-sm">Manage Google Meet classes</p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Schedule Session
                </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {[
                    { label: "Today's Sessions", value: stats.today, icon: CalendarDays, color: 'purple' },
                    { label: 'This Week', value: stats.thisWeek, icon: Calendar, color: 'blue' },
                    { label: 'Total Hours', value: `${stats.totalHours.toFixed(1)}h`, icon: Timer, color: 'emerald' },
                    { label: 'Avg Attendance', value: `${stats.avgAttendance}%`, icon: UserCheck, color: 'amber' },
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

            {/* Week Calendar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Week Schedule</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigateWeek('prev')}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="text-sm font-medium text-gray-600 min-w-[140px] text-center">
                            {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <button
                            onClick={() => navigateWeek('next')}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day, index) => {
                        const isToday = day.toDateString() === new Date().toDateString();
                        const daySessions = mockSessions.filter(s =>
                            new Date(s.scheduledAt).toDateString() === day.toDateString()
                        );

                        return (
                            <div key={index} className={`rounded-xl p-3 min-h-[120px] transition-colors ${isToday ? 'bg-purple-50 border-2 border-purple-200' : 'bg-gray-50'}`}>
                                <div className="text-center mb-2">
                                    <p className={`text-xs font-medium ${isToday ? 'text-purple-600' : 'text-gray-500'}`}>{dayNames[index]}</p>
                                    <p className={`text-lg font-bold ${isToday ? 'text-purple-600' : 'text-gray-900'}`}>{day.getDate()}</p>
                                </div>
                                <div className="space-y-1">
                                    {daySessions.slice(0, 2).map((session) => (
                                        <div
                                            key={session.id}
                                            className={`text-xs p-1.5 rounded-lg ${statusConfig[session.status as keyof typeof statusConfig].bg} text-white truncate cursor-pointer hover:opacity-90`}
                                            title={session.title}
                                        >
                                            {new Date(session.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    ))}
                                    {daySessions.length > 2 && (
                                        <p className="text-xs text-gray-500 text-center">+{daySessions.length - 2} more</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {[
                    { id: 'all', label: 'All Sessions' },
                    { id: 'live', label: 'Live Now', dot: 'red' },
                    { id: 'upcoming', label: 'Upcoming' },
                    { id: 'completed', label: 'Completed' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id as typeof filter)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${filter === tab.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {tab.dot && filter !== tab.id && (
                            <span className={`w-2 h-2 rounded-full bg-${tab.dot}-500 animate-pulse`} />
                        )}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Sessions List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredSessions.map((session, index) => {
                        const status = statusConfig[session.status as keyof typeof statusConfig];
                        const timeUntil = getTimeUntil(session.scheduledAt);

                        return (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: 0.05 * index }}
                                className={`bg-white rounded-2xl shadow-lg border overflow-hidden group ${session.status === 'live' ? 'border-red-200 ring-2 ring-red-100' : 'border-gray-100'
                                    }`}
                            >
                                {/* Thumbnail */}
                                <div className="relative h-36 overflow-hidden">
                                    <img src={session.course.thumbnail} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                    {/* Status Badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white ${status.bg}`}>
                                            {status.pulse && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                                            {session.status === 'live' && <Radio className="w-3 h-3" />}
                                            {status.label}
                                        </span>
                                    </div>

                                    {/* Time Until */}
                                    {timeUntil && (
                                        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/50 backdrop-blur text-white text-xs font-medium">
                                            Starts in {timeUntil}
                                        </div>
                                    )}

                                    {/* Course Title */}
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <p className="text-sm text-white/80">{session.course.title}</p>
                                        <h3 className="font-bold text-white truncate">{session.title}</h3>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    {/* Teacher & Time */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <img src={session.teacher.avatar} alt="" className="w-8 h-8 rounded-full" />
                                            <span className="text-sm font-medium text-gray-700">{session.teacher.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Clock className="w-4 h-4" />
                                            <span>{session.duration}m</span>
                                        </div>
                                    </div>

                                    {/* Date & Attendees */}
                                    <div className="flex items-center justify-between mb-4 text-sm">
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(session.scheduledAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <Users className="w-4 h-4" />
                                            <span>{session.attendees}/{session.maxAttendees}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        {session.status === 'live' ? (
                                            <a
                                                href={session.meetLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transition-all"
                                            >
                                                <Play className="w-4 h-4" />
                                                Join Now
                                            </a>
                                        ) : session.status === 'upcoming' ? (
                                            <a
                                                href={session.meetLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Open Meet Link
                                            </a>
                                        ) : (
                                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all">
                                                <Play className="w-4 h-4" />
                                                View Recording
                                            </button>
                                        )}
                                        <Link href={`/admin/live-sessions/${session.id}`}>
                                            <button className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                                                <Eye className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Google Meet Branding */}
                                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 9V15M12 15L15 12M12 15L9 12" stroke="#00AC47" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#00AC47" strokeWidth="2" />
                                    </svg>
                                    <span className="text-xs text-gray-500">Powered by Google Meet</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredSessions.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
                    <p className="text-gray-500 mb-6">Schedule your first live session to get started</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-red-500 hover:text-red-600 font-medium"
                    >
                        + Schedule a Session
                    </button>
                </div>
            )}

            {/* Create Session Modal */}
            <CreateSessionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
