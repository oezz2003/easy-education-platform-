'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Users,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    Video,
    Search,
    Filter,
    Download,
    ChevronDown,
    Eye,
    UserCheck,
    UserX,
    BarChart3,
    TrendingUp,
    AlertCircle
} from 'lucide-react';

// Types
interface Attendee {
    id: string;
    name: string;
    avatar: string;
    email: string;
    joinedAt: string | null;
    leftAt: string | null;
    duration: number; // minutes attended
    status: 'present' | 'absent' | 'late' | 'left-early';
    participation: number; // 0-100
}

interface Session {
    id: string;
    title: string;
    teacherName: string;
    teacherAvatar: string;
    courseName: string;
    date: Date;
    startTime: string;
    endTime: string;
    duration: number;
    status: 'scheduled' | 'live' | 'completed';
    totalEnrolled: number;
    attendees: Attendee[];
}

// Mock data
const sessionsData: Session[] = [
    {
        id: '1',
        title: 'Algebra Fundamentals - Live',
        teacherName: 'Ahmed Hassan',
        teacherAvatar: 'https://i.pravatar.cc/150?img=11',
        courseName: 'Advanced Mathematics',
        date: new Date(2026, 0, 7),
        startTime: '09:00',
        endTime: '10:30',
        duration: 90,
        status: 'live',
        totalEnrolled: 30,
        attendees: [
            { id: '1', name: 'Omar Khaled', avatar: 'https://i.pravatar.cc/150?img=1', email: 'omar@edu.com', joinedAt: '09:00', leftAt: null, duration: 45, status: 'present', participation: 85 },
            { id: '2', name: 'Fatma Ahmed', avatar: 'https://i.pravatar.cc/150?img=2', email: 'fatma@edu.com', joinedAt: '09:05', leftAt: null, duration: 40, status: 'late', participation: 70 },
            { id: '3', name: 'Youssef Ibrahim', avatar: 'https://i.pravatar.cc/150?img=3', email: 'youssef@edu.com', joinedAt: '09:00', leftAt: null, duration: 45, status: 'present', participation: 92 },
            { id: '4', name: 'Sara Mohamed', avatar: 'https://i.pravatar.cc/150?img=4', email: 'sara@edu.com', joinedAt: '09:02', leftAt: '09:30', duration: 28, status: 'left-early', participation: 45 },
            { id: '5', name: 'Ali Hassan', avatar: 'https://i.pravatar.cc/150?img=5', email: 'ali@edu.com', joinedAt: null, leftAt: null, duration: 0, status: 'absent', participation: 0 },
            { id: '6', name: 'Laila Nour', avatar: 'https://i.pravatar.cc/150?img=6', email: 'laila@edu.com', joinedAt: '09:00', leftAt: null, duration: 45, status: 'present', participation: 88 },
        ],
    },
    {
        id: '2',
        title: 'Physics Lab Practice',
        teacherName: 'Sara Ali',
        teacherAvatar: 'https://i.pravatar.cc/150?img=5',
        courseName: 'Physics Fundamentals',
        date: new Date(2026, 0, 6),
        startTime: '14:00',
        endTime: '15:30',
        duration: 90,
        status: 'completed',
        totalEnrolled: 25,
        attendees: [
            { id: '1', name: 'Mohamed Farid', avatar: 'https://i.pravatar.cc/150?img=7', email: 'mohamed@edu.com', joinedAt: '14:00', leftAt: '15:30', duration: 90, status: 'present', participation: 95 },
            { id: '2', name: 'Nadia Karim', avatar: 'https://i.pravatar.cc/150?img=8', email: 'nadia@edu.com', joinedAt: '14:00', leftAt: '15:30', duration: 90, status: 'present', participation: 88 },
            { id: '3', name: 'Khaled Salem', avatar: 'https://i.pravatar.cc/150?img=9', email: 'khaled@edu.com', joinedAt: '14:15', leftAt: '15:30', duration: 75, status: 'late', participation: 72 },
        ],
    },
];

const statusConfig = {
    present: { label: 'Present', color: 'emerald', icon: CheckCircle },
    absent: { label: 'Absent', color: 'red', icon: XCircle },
    late: { label: 'Late', color: 'amber', icon: Clock },
    'left-early': { label: 'Left Early', color: 'orange', icon: AlertCircle },
};

export default function AttendancePage() {
    const [selectedSession, setSelectedSession] = useState<Session | null>(sessionsData[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showDetails, setShowDetails] = useState<string | null>(null);

    // Calculate stats
    const getSessionStats = (session: Session) => {
        const present = session.attendees.filter(a => a.status === 'present').length;
        const late = session.attendees.filter(a => a.status === 'late').length;
        const absent = session.attendees.filter(a => a.status === 'absent').length;
        const leftEarly = session.attendees.filter(a => a.status === 'left-early').length;
        const attendanceRate = Math.round(((present + late + leftEarly) / session.totalEnrolled) * 100);
        const avgParticipation = Math.round(session.attendees.reduce((acc, a) => acc + a.participation, 0) / session.attendees.length);
        return { present, late, absent, leftEarly, attendanceRate, avgParticipation };
    };

    const filteredAttendees = selectedSession?.attendees.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || a.status === filterStatus;
        return matchesSearch && matchesFilter;
    }) || [];

    const stats = selectedSession ? getSessionStats(selectedSession) : null;

    const markAttendance = (attendeeId: string, status: Attendee['status']) => {
        if (!selectedSession) return;
        const updatedAttendees = selectedSession.attendees.map(a =>
            a.id === attendeeId ? { ...a, status, joinedAt: status !== 'absent' ? (a.joinedAt || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })) : null } : a
        );
        setSelectedSession({ ...selectedSession, attendees: updatedAttendees });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <UserCheck className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Attendance Tracking</h1>
                        <p className="text-gray-500 text-sm">Monitor session attendance and participation</p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Export Report
                </motion.button>
            </motion.div>

            {/* Session Selector */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="flex gap-4 overflow-x-auto pb-2"
            >
                {sessionsData.map((session) => (
                    <motion.button
                        key={session.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedSession(session)}
                        className={`flex-shrink-0 p-4 rounded-2xl border-2 transition-all ${selectedSession?.id === session.id
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 bg-white hover:border-indigo-200'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <img src={session.teacherAvatar} alt="" className="w-10 h-10 rounded-xl" />
                            <div className="text-left">
                                <p className="font-semibold text-gray-900 text-sm">{session.title}</p>
                                <p className="text-xs text-gray-500">{session.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {session.startTime}</p>
                            </div>
                            {session.status === 'live' && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                    Live
                                </span>
                            )}
                        </div>
                    </motion.button>
                ))}
            </motion.div>

            {selectedSession && stats && (
                <>
                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 md:grid-cols-6 gap-4"
                    >
                        {[
                            { label: 'Present', value: stats.present, color: 'emerald', icon: CheckCircle },
                            { label: 'Late', value: stats.late, color: 'amber', icon: Clock },
                            { label: 'Left Early', value: stats.leftEarly, color: 'orange', icon: AlertCircle },
                            { label: 'Absent', value: stats.absent, color: 'red', icon: XCircle },
                            { label: 'Attendance Rate', value: `${stats.attendanceRate}%`, color: 'blue', icon: BarChart3 },
                            { label: 'Avg Participation', value: `${stats.avgParticipation}%`, color: 'purple', icon: TrendingUp },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                                        <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-xs text-gray-500">{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="present">Present</option>
                            <option value="late">Late</option>
                            <option value="left-early">Left Early</option>
                            <option value="absent">Absent</option>
                        </select>
                    </motion.div>

                    {/* Attendance Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900">{selectedSession.title}</h3>
                                <p className="text-sm text-gray-500">{selectedSession.courseName} • {selectedSession.teacherName}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Duration</p>
                                <p className="font-semibold text-gray-900">{selectedSession.startTime} - {selectedSession.endTime}</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Student</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Joined At</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Duration</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Participation</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredAttendees.map((attendee) => {
                                        const config = statusConfig[attendee.status];
                                        return (
                                            <tr key={attendee.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={attendee.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                                                        <div>
                                                            <p className="font-medium text-gray-900">{attendee.name}</p>
                                                            <p className="text-xs text-gray-500">{attendee.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-700">{attendee.joinedAt || '-'}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-700">{attendee.duration} min</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${attendee.participation >= 80 ? 'bg-emerald-500' :
                                                                        attendee.participation >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                                                    }`}
                                                                style={{ width: `${attendee.participation}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-gray-600">{attendee.participation}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-700`}>
                                                        <config.icon className="w-3.5 h-3.5" />
                                                        {config.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {selectedSession.status === 'live' && (
                                                            <>
                                                                <button
                                                                    onClick={() => markAttendance(attendee.id, 'present')}
                                                                    className="p-2 rounded-lg hover:bg-emerald-100 text-emerald-500"
                                                                    title="Mark Present"
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => markAttendance(attendee.id, 'absent')}
                                                                    className="p-2 rounded-lg hover:bg-red-100 text-red-500"
                                                                    title="Mark Absent"
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            onClick={() => setShowDetails(showDetails === attendee.id ? null : attendee.id)}
                                                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Attendance Progress Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                    >
                        <h3 className="font-bold text-gray-900 mb-4">Attendance Overview</h3>
                        <div className="h-8 bg-gray-100 rounded-full overflow-hidden flex">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(stats.present / selectedSession.totalEnrolled) * 100}%` }}
                                className="bg-emerald-500 h-full"
                                title={`Present: ${stats.present}`}
                            />
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(stats.late / selectedSession.totalEnrolled) * 100}%` }}
                                className="bg-amber-500 h-full"
                                title={`Late: ${stats.late}`}
                            />
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(stats.leftEarly / selectedSession.totalEnrolled) * 100}%` }}
                                className="bg-orange-500 h-full"
                                title={`Left Early: ${stats.leftEarly}`}
                            />
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(stats.absent / selectedSession.totalEnrolled) * 100}%` }}
                                className="bg-red-500 h-full"
                                title={`Absent: ${stats.absent}`}
                            />
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-4">
                            {[
                                { label: 'Present', count: stats.present, color: 'emerald' },
                                { label: 'Late', count: stats.late, color: 'amber' },
                                { label: 'Left Early', count: stats.leftEarly, color: 'orange' },
                                { label: 'Absent', count: stats.absent, color: 'red' },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                                    <span className="text-sm text-gray-600">{item.label} ({item.count})</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    );
}
