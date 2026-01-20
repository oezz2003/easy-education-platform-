'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    Video,
    X,
    User,
    Phone,
    Mail,
    MapPin,
    BookOpen,
    Loader2
} from 'lucide-react';
import { useSessions } from '@/hooks/useSessions';
import { useBookings } from '@/hooks/useBookings';
import { useCourses } from '@/hooks/useCourses';
import { useBatches } from '@/hooks/useBatches';

interface TeacherCalendarProps {
    teacherId: string;
}

// Helper functions
const getWeekDays = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        return day;
    });
};

const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();
const timeSlots = Array.from({ length: 12 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TeacherCalendar({ teacherId }: TeacherCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [itemType, setItemType] = useState<'session' | 'booking' | null>(null);

    // Hooks
    const { sessions: rawSessions, isLoading: sessionsLoading } = useSessions({ teacherId });
    const { bookings: rawBookings, fetchBookings, isLoading: bookingsLoading } = useBookings();
    const { courses } = useCourses();
    const { batches } = useBatches();

    useEffect(() => {
        if (teacherId) {
            fetchBookings(teacherId);
        }
    }, [teacherId, fetchBookings]);

    const navigateWeek = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + direction * 7);
        setCurrentDate(newDate);
    };

    const weekDays = getWeekDays(currentDate);

    // Transform data for display
    const sessions = rawSessions.map(s => {
        const batch = batches.find(b => b.id === s.batch_id);
        const course = courses.find(c => c.id === batch?.course_id);
        return {
            ...s,
            date: new Date(s.session_date),
            startTime: s.start_time,
            courseName: course?.name || 'Unknown Course',
            batchName: batch?.name || 'Unknown Batch',
            color: '#10b981', // Default color
        };
    });

    const bookings = rawBookings.map(b => {
        const course = courses.find(c => c.id === b.course_id);
        return {
            ...b,
            date: new Date(b.booking_date),
            time: b.booking_time,
            courseName: course?.name || 'General Inquiry',
        };
    });

    const getSessionsForSlot = (day: Date, time: string) => {
        return sessions.filter(s => {
            if (!isSameDay(s.date, day)) return false;
            const sessionStart = parseInt(s.startTime.split(':')[0]);
            const slotStart = parseInt(time.split(':')[0]);
            return sessionStart === slotStart;
        });
    };

    const getBookingsForSlot = (day: Date, time: string) => {
        return bookings.filter(b => {
            if (!isSameDay(b.date, day)) return false;
            const bookingStart = parseInt(b.time.split(':')[0]);
            const slotStart = parseInt(time.split(':')[0]);
            return bookingStart === slotStart;
        });
    };

    if (sessionsLoading || bookingsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigateWeek(-1)} className="p-2 rounded-xl hover:bg-gray-100">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900">
                        {weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={() => navigateWeek(1)} className="p-2 rounded-xl hover:bg-gray-100">
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-4 py-2 text-sm font-medium text-blue-500 hover:bg-blue-50 rounded-xl"
                >
                    Today
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-8 border-b border-gray-100">
                    <div className="p-4 text-center text-sm font-medium text-gray-500 bg-gray-50">Time</div>
                    {weekDays.map((day, idx) => (
                        <div key={idx} className={`p-4 text-center border-l border-gray-100 ${isSameDay(day, new Date()) ? 'bg-blue-50' : ''}`}>
                            <p className="text-xs text-gray-500">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                            <p className={`text-lg font-bold ${isSameDay(day, new Date()) ? 'text-blue-500' : 'text-gray-900'}`}>
                                {day.getDate()}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                    {timeSlots.map((time) => (
                        <div key={time} className="grid grid-cols-8 border-b border-gray-50">
                            <div className="p-3 text-center text-sm text-gray-500 bg-gray-50 border-r border-gray-100">
                                {time}
                            </div>
                            {weekDays.map((day, dayIdx) => {
                                const slotSessions = getSessionsForSlot(day, time);
                                const slotBookings = getBookingsForSlot(day, time);

                                return (
                                    <div key={dayIdx} className="p-1 border-l border-gray-50 min-h-[80px] hover:bg-gray-50">
                                        {/* Sessions */}
                                        {slotSessions.map((session) => (
                                            <motion.div
                                                key={session.id}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => { setSelectedItem(session); setItemType('session'); }}
                                                className="mb-1 p-2 rounded-lg bg-emerald-500 text-white text-xs cursor-pointer shadow-sm"
                                            >
                                                <div className="font-medium truncate">{session.title}</div>
                                                <div className="opacity-90 truncate text-[10px]">{session.courseName}</div>
                                            </motion.div>
                                        ))}

                                        {/* Bookings */}
                                        {slotBookings.map((booking) => (
                                            <motion.div
                                                key={booking.id}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => { setSelectedItem(booking); setItemType('booking'); }}
                                                className="mb-1 p-2 rounded-lg bg-blue-500 text-white text-xs cursor-pointer shadow-sm"
                                            >
                                                <div className="font-medium truncate">Trial: {booking.student_name}</div>
                                                <div className="opacity-90 truncate text-[10px]">{booking.status}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md pointer-events-auto overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {itemType === 'session' ? 'Session Details' : 'Booking Details'}
                                    </h3>
                                    <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    {itemType === 'session' ? (
                                        <>
                                            <div>
                                                <p className="text-sm text-gray-500">Title</p>
                                                <p className="font-medium text-gray-900">{selectedItem.title}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Date</p>
                                                    <p className="font-medium text-gray-900">{new Date(selectedItem.session_date).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Time</p>
                                                    <p className="font-medium text-gray-900">{selectedItem.start_time} - {selectedItem.end_time}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Course</p>
                                                <p className="font-medium text-gray-900">{selectedItem.courseName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Batch</p>
                                                <p className="font-medium text-gray-900">{selectedItem.batchName}</p>
                                            </div>
                                            {selectedItem.meet_link && (
                                                <div>
                                                    <p className="text-sm text-gray-500">Meeting Link</p>
                                                    <a href={selectedItem.meet_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                                                        {selectedItem.meet_link}
                                                    </a>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                                    {selectedItem.student_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{selectedItem.student_name}</p>
                                                    <p className="text-sm text-gray-500">{selectedItem.level || 'No Level'}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-gray-600">
                                                    <Phone className="w-4 h-4" />
                                                    <span>{selectedItem.student_phone}</span>
                                                </div>
                                                {selectedItem.student_email && (
                                                    <div className="flex items-center gap-3 text-gray-600">
                                                        <Mail className="w-4 h-4" />
                                                        <span>{selectedItem.student_email}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-3 text-gray-600">
                                                    <CalendarIcon className="w-4 h-4" />
                                                    <span>{new Date(selectedItem.booking_date).toLocaleDateString()} at {selectedItem.booking_time}</span>
                                                </div>
                                                <div className="pt-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedItem.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                            selectedItem.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                selectedItem.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
