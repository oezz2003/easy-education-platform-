'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Video,
    Calendar,
    Clock,
    Users,
    Play,
    ExternalLink,
    Copy,
    Check,
    Radio,
    UserCheck,
    UserX,
    MessageSquare,
    Download,
    Share2,
    Edit,
    Trash2
} from 'lucide-react';

// Mock session data
const mockSession = {
    id: '1',
    title: 'Advanced Algebra Live Class',
    description: 'In this session, we will cover advanced algebra topics including quadratic equations and factoring methods.',
    course: { id: '1', title: 'Advanced Mathematics', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800' },
    teacher: { id: '1', name: 'Ahmed Hassan', avatar: 'https://i.pravatar.cc/150?img=11', subject: 'Mathematics' },
    scheduledAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    duration: 90,
    meetLink: 'https://meet.google.com/abc-defg-hij',
    status: 'live',
    attendees: [
        { id: '1', name: 'Omar Khaled', avatar: 'https://i.pravatar.cc/150?img=12', status: 'joined', joinedAt: '10:05 AM' },
        { id: '2', name: 'Fatma Nour', avatar: 'https://i.pravatar.cc/150?img=9', status: 'joined', joinedAt: '10:02 AM' },
        { id: '3', name: 'Youssef Ibrahim', avatar: 'https://i.pravatar.cc/150?img=15', status: 'joined', joinedAt: '10:08 AM' },
        { id: '4', name: 'Laila Hassan', avatar: 'https://i.pravatar.cc/150?img=20', status: 'absent' },
        { id: '5', name: 'Ali Mohamed', avatar: 'https://i.pravatar.cc/150?img=33', status: 'joined', joinedAt: '10:15 AM' },
    ],
    maxAttendees: 100,
    recordingUrl: null,
};

const statusConfig = {
    live: { label: 'Live Now', color: 'red', bg: 'bg-red-500', pulse: true },
    upcoming: { label: 'Upcoming', color: 'blue', bg: 'bg-blue-500', pulse: false },
    completed: { label: 'Completed', color: 'emerald', bg: 'bg-emerald-500', pulse: false },
};

export default function SessionDetailsPage() {
    const params = useParams();
    const [copied, setCopied] = useState(false);

    const session = mockSession;
    const status = statusConfig[session.status as keyof typeof statusConfig];
    const joinedAttendees = session.attendees.filter(a => a.status === 'joined');
    const absentAttendees = session.attendees.filter(a => a.status === 'absent');

    const copyLink = () => {
        navigator.clipboard.writeText(session.meetLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Link href="/admin/live-sessions" className="inline-flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Live Sessions</span>
                </Link>
            </motion.div>

            {/* Session Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
            >
                <div className="relative h-56 md:h-72 overflow-hidden">
                    <img src={session.course.thumbnail} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                        <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white ${status.bg}`}>
                            {status.pulse && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                            {session.status === 'live' && <Radio className="w-4 h-4" />}
                            {status.label}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button className="p-2 rounded-xl bg-white/20 backdrop-blur text-white hover:bg-white/30">
                            <Edit className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-xl bg-white/20 backdrop-blur text-white hover:bg-white/30">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-white/80 text-sm mb-1">{session.course.title}</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{session.title}</h1>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <img src={session.teacher.avatar} alt="" className="w-8 h-8 rounded-full ring-2 ring-white" />
                                <span className="text-white/90">{session.teacher.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(session.scheduledAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(session.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • {session.duration}m</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Join Section */}
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Meet Link */}
                        <div className="flex-1 flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                                <Video className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 font-medium">Google Meet Link</p>
                                <p className="text-sm text-gray-900 font-mono truncate">{session.meetLink}</p>
                            </div>
                            <button
                                onClick={copyLink}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-400" />}
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {session.status === 'live' && (
                                <a
                                    href={session.meetLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Play className="w-5 h-5" />
                                    Join Now
                                </a>
                            )}
                            {session.status === 'upcoming' && (
                                <a
                                    href={session.meetLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    Open Link
                                </a>
                            )}
                            <button className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                                <Share2 className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 divide-x divide-gray-100">
                    {[
                        { label: 'Registered', value: session.attendees.length, icon: Users },
                        { label: 'Attended', value: joinedAttendees.length, icon: UserCheck },
                        { label: 'Duration', value: `${session.duration}m`, icon: Clock },
                    ].map((stat) => (
                        <div key={stat.label} className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                                <stat.icon className="w-4 h-4" />
                                <span className="font-bold text-xl text-gray-900">{stat.value}</span>
                            </div>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-lg font-bold text-gray-900 mb-3">About This Session</h2>
                        <p className="text-gray-600 leading-relaxed">{session.description}</p>
                    </motion.div>

                    {/* Attendees */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Attendees</h2>
                            <span className="text-sm text-gray-500">{joinedAttendees.length}/{session.attendees.length} joined</span>
                        </div>

                        {/* Joined */}
                        <div className="mb-4">
                            <p className="text-sm font-medium text-emerald-600 mb-3 flex items-center gap-2">
                                <UserCheck className="w-4 h-4" />
                                Joined ({joinedAttendees.length})
                            </p>
                            <div className="space-y-2">
                                {joinedAttendees.map((attendee) => (
                                    <div key={attendee.id} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50">
                                        <img src={attendee.avatar} alt="" className="w-8 h-8 rounded-full" />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{attendee.name}</p>
                                            <p className="text-xs text-gray-500">Joined at {attendee.joinedAt}</p>
                                        </div>
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Absent */}
                        {absentAttendees.length > 0 && (
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                    <UserX className="w-4 h-4" />
                                    Absent ({absentAttendees.length})
                                </p>
                                <div className="space-y-2">
                                    {absentAttendees.map((attendee) => (
                                        <div key={attendee.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                            <img src={attendee.avatar} alt="" className="w-8 h-8 rounded-full opacity-60" />
                                            <p className="font-medium text-gray-500">{attendee.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Teacher Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Host</h2>
                        <div className="flex items-center gap-4">
                            <img src={session.teacher.avatar} alt="" className="w-14 h-14 rounded-2xl" />
                            <div>
                                <p className="font-bold text-gray-900">{session.teacher.name}</p>
                                <p className="text-sm text-gray-500">{session.teacher.subject} Teacher</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Recording */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Recording</h2>
                        {session.recordingUrl ? (
                            <a
                                href={session.recordingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                                    <Play className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">Watch Recording</p>
                                    <p className="text-xs text-gray-500">Available on Google Drive</p>
                                </div>
                                <Download className="w-5 h-5 text-purple-500" />
                            </a>
                        ) : (
                            <div className="text-center py-6">
                                <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">
                                    {session.status === 'live' ? 'Recording will be available after the session ends' : 'No recording available'}
                                </p>
                            </div>
                        )}
                    </motion.div>

                    {/* Session Notes */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Session Notes
                        </h2>
                        <textarea
                            placeholder="Add notes about this session..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none text-sm"
                        />
                        <button className="mt-3 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors">
                            Save Notes
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
