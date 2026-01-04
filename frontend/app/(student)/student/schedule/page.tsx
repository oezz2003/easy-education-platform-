'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Play,
    Video,
    FileText,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Bell
} from 'lucide-react';

// Days of the week
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Mock schedule data
const scheduleItems = [
    { id: 1, title: 'Algebra Live Q&A', type: 'live', time: '10:00 AM', duration: '1h', course: 'Advanced Algebra', teacher: 'Ahmed Hassan', day: 3 },
    { id: 2, title: 'Calculus Homework', type: 'assignment', time: '6:00 PM', course: 'Calculus Mastery', day: 3 },
    { id: 3, title: 'Geometry Quiz', type: 'quiz', time: '8:00 PM', course: 'Geometry Basics', day: 3 },
    { id: 4, title: 'Study: Chapter 5', type: 'study', time: '4:00 PM', course: 'Advanced Algebra', day: 4 },
    { id: 5, title: 'Physics Lab Session', type: 'live', time: '2:00 PM', duration: '2h', course: 'Physics Fundamentals', teacher: 'Omar Ibrahim', day: 5 },
    { id: 6, title: 'Math Practice Test', type: 'quiz', time: '10:00 AM', course: 'Advanced Algebra', day: 6 },
];

// Upcoming deadlines
const upcomingDeadlines = [
    { id: 1, title: 'Chapter 5 Assignment', course: 'Advanced Algebra', dueDate: 'Tomorrow, 6:00 PM', priority: 'high' },
    { id: 2, title: 'Calculus Quiz', course: 'Calculus Mastery', dueDate: 'In 3 days', priority: 'medium' },
    { id: 3, title: 'Geometry Project', course: 'Geometry Basics', dueDate: 'Next week', priority: 'low' },
];

// Upcoming live sessions
const upcomingSessions = [
    { id: 1, title: 'Algebra Live Q&A', course: 'Advanced Algebra', teacher: 'Ahmed Hassan', time: 'Today, 10:00 AM', attending: true },
    { id: 2, title: 'Physics Lab Session', course: 'Physics Fundamentals', teacher: 'Omar Ibrahim', time: 'Friday, 2:00 PM', attending: false },
];

const typeColors = {
    live: 'bg-red-100 text-red-700 border-red-200',
    assignment: 'bg-amber-100 text-amber-700 border-amber-200',
    quiz: 'bg-purple-100 text-purple-700 border-purple-200',
    study: 'bg-blue-100 text-blue-700 border-blue-200',
};

const typeIcons = {
    live: Video,
    assignment: FileText,
    quiz: BookOpen,
    study: Clock,
};

export default function SchedulePage() {
    const [currentWeek, setCurrentWeek] = useState(0);

    // Get current date info
    const today = new Date();
    const currentDay = today.getDay();

    // Generate week dates
    const getWeekDates = (offset: number) => {
        const dates = [];
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - currentDay + (offset * 7));

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const weekDates = getWeekDates(currentWeek);

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
                            alt="Schedule"
                            loading="lazy"
                            className="w-14 h-14 object-contain"
                        />
                    </motion.div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            My Schedule
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Plan your learning journey
                        </p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-medium"
                >
                    <Bell className="w-4 h-4" />
                    Set Reminder
                </motion.button>
            </motion.div>

            {/* Week Navigation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
            >
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => setCurrentWeek(w => w - 1)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="font-semibold text-gray-900">
                        {weekDates[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button
                        onClick={() => setCurrentWeek(w => w + 1)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Week Days */}
                <div className="grid grid-cols-7 gap-2">
                    {weekDates.map((date, index) => {
                        const isToday = date.toDateString() === today.toDateString();
                        const hasEvents = scheduleItems.some(item => item.day === index);

                        return (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className={`p-3 rounded-xl text-center transition-colors ${isToday
                                    ? 'bg-emerald-500 text-white'
                                    : 'hover:bg-gray-100'
                                    }`}
                            >
                                <p className={`text-xs ${isToday ? 'text-emerald-100' : 'text-gray-500'}`}>
                                    {weekDays[index]}
                                </p>
                                <p className={`text-lg font-bold ${isToday ? 'text-white' : 'text-gray-900'}`}>
                                    {date.getDate()}
                                </p>
                                {hasEvents && (
                                    <div className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 ${isToday ? 'bg-white' : 'bg-emerald-500'
                                        }`} />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Today's Schedule */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-white rounded-[2rem] p-6 shadow-lg border-b-4 border-emerald-400"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-500" />
                        Today's Schedule
                    </h3>

                    <div className="space-y-3">
                        {scheduleItems.filter(item => item.day === currentDay).map((item, index) => {
                            const Icon = typeIcons[item.type as keyof typeof typeIcons];
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border ${typeColors[item.type as keyof typeof typeColors]}`}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{item.title}</p>
                                        <p className="text-sm text-gray-500">{item.course}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">{item.time}</p>
                                        {item.duration && (
                                            <p className="text-xs text-gray-500">{item.duration}</p>
                                        )}
                                    </div>
                                    {item.type === 'live' && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium"
                                        >
                                            Join
                                        </motion.button>
                                    )}
                                </motion.div>
                            );
                        })}

                        {scheduleItems.filter(item => item.day === currentDay).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>No events scheduled for today</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Upcoming Deadlines */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-[2rem] p-6 shadow-lg border-b-4 border-amber-400"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-500" />
                            Upcoming Deadlines
                        </h3>
                        <div className="space-y-3">
                            {upcomingDeadlines.map((deadline) => (
                                <div key={deadline.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className={`w-2 h-2 rounded-full ${deadline.priority === 'high' ? 'bg-red-500' :
                                        deadline.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                                        }`} />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm">{deadline.title}</p>
                                        <p className="text-xs text-gray-500">{deadline.dueDate}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Upcoming Live Sessions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-[2rem] p-6 shadow-lg border-b-4 border-red-400"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Video className="w-5 h-5 text-red-500" />
                            Live Sessions
                        </h3>
                        <div className="space-y-3">
                            {upcomingSessions.map((session) => (
                                <div key={session.id} className="p-3 bg-red-50 rounded-xl">
                                    <p className="font-medium text-gray-900 text-sm">{session.title}</p>
                                    <p className="text-xs text-gray-500 mb-2">{session.time}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">{session.teacher}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${session.attending ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {session.attending ? 'Attending' : 'Not confirmed'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
