'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ArrowLeft,
    Video,
    Calendar,
    Clock,
    Users,
    Play,
    Download,
    Share2,
    Settings,
    MessageCircle,
    Eye
} from 'lucide-react';
import { UserAvatar } from '@/app/components/shared/UserAvatar';

// Mock session data
const sessionData = {
    id: '1',
    title: 'Algebra Live Q&A',
    description: 'Weekly live session for answering student questions and solving problems together.',
    course: 'Advanced Algebra',
    date: '2024-03-15',
    time: '10:00 AM',
    duration: '1h 30m',
    attendees: 45,
    maxAttendees: 50,
    status: 'upcoming',
    recurring: true,
    meetingLink: 'https://zoom.us/j/123456789',
};

// Mock attendees
const attendees = [
    { id: 1, name: 'Omar Ahmed', avatar: null, status: 'attending' },
    { id: 2, name: 'Sara Hassan', avatar: null, status: 'attending' },
    { id: 3, name: 'Khaled Mohamed', avatar: null, status: 'maybe' },
    { id: 4, name: 'Fatma Ali', avatar: null, status: 'attending' },
    { id: 5, name: 'Ahmed Ibrahim', avatar: null, status: 'attending' },
];

// Mock past recordings (for completed sessions)
const recordings = [
    { id: 1, title: 'Session Recording - Part 1', duration: '45:30', size: '256 MB' },
    { id: 2, title: 'Session Recording - Part 2', duration: '42:15', size: '234 MB' },
];

export default function SessionDetailPage() {
    const params = useParams();

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <Link href="/teacher/sessions">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-xl bg-white shadow-lg border border-gray-100 hover:bg-gray-50"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </motion.button>
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{sessionData.title}</h1>
                    <p className="text-gray-500 text-sm">{sessionData.course}</p>
                </div>
            </motion.div>

            {/* Session Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100"
            >
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Section */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                                <Video className="w-7 h-7 text-blue-600" />
                            </div>
                            <div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                                    {sessionData.status}
                                </span>
                                {sessionData.recurring && (
                                    <span className="ml-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                        Weekly
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-600 mb-6">{sessionData.description}</p>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <Calendar className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                                <p className="font-semibold text-gray-900">{sessionData.date}</p>
                                <p className="text-xs text-gray-500">Date</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <Clock className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                                <p className="font-semibold text-gray-900">{sessionData.time}</p>
                                <p className="text-xs text-gray-500">Time</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <Clock className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                                <p className="font-semibold text-gray-900">{sessionData.duration}</p>
                                <p className="text-xs text-gray-500">Duration</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <Users className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                                <p className="font-semibold text-gray-900">{sessionData.attendees}/{sessionData.maxAttendees}</p>
                                <p className="text-xs text-gray-500">Attendees</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                            {sessionData.status === 'upcoming' && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg"
                                >
                                    <Play className="w-5 h-5" />
                                    Start Session Now
                                </motion.button>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
                            >
                                <Share2 className="w-4 h-4" />
                                Share Link
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </motion.button>
                        </div>
                    </div>

                    {/* Right Section - Meeting Link */}
                    <div className="lg:w-80">
                        <div className="bg-gradient-to-br from-blue-500 to-sky-500 rounded-2xl p-6 text-white">
                            <h3 className="font-semibold mb-2">Meeting Link</h3>
                            <p className="text-sm text-white/80 mb-4 break-all">{sessionData.meetingLink}</p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 bg-white text-blue-600 rounded-xl font-semibold"
                            >
                                Copy Link
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Attendees List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100"
            >
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Registered Attendees ({attendees.length})
                </h2>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {attendees.map((attendee, index) => (
                        <motion.div
                            key={attendee.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                        >
                            <UserAvatar
                                src={attendee.avatar}
                                name={attendee.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{attendee.name}</p>
                                <p className={`text-xs ${attendee.status === 'attending' ? 'text-emerald-500' : 'text-amber-500'
                                    }`}>
                                    {attendee.status === 'attending' ? '✓ Attending' : '? Maybe'}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Recordings (for completed sessions) */}
            {sessionData.status === 'completed' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100"
                >
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Video className="w-5 h-5 text-purple-500" />
                        Session Recordings
                    </h2>

                    <div className="space-y-3">
                        {recordings.map((recording) => (
                            <div
                                key={recording.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                        <Play className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{recording.title}</p>
                                        <p className="text-sm text-gray-500">{recording.duration} • {recording.size}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        className="p-2 rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-100"
                                    >
                                        <Download className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
