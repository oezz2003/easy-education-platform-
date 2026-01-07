'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    Calendar,
    Clock,
    Star,
    Filter,
    ChevronLeft,
    ChevronRight,
    Video,
    Users,
    BookOpen,
    X,
    Check,
    DollarSign,
    MapPin,
    Award,
    Heart,
    MessageCircle
} from 'lucide-react';

// Types
interface Teacher {
    id: string;
    name: string;
    avatar: string;
    subject: string;
    rating: number;
    reviews: number;
    students: number;
    experience: string;
    hourlyRate: number;
    bio: string;
    languages: string[];
    availability: AvailabilitySlot[];
    sessionTypes: SessionType[];
}

interface AvailabilitySlot {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    available: boolean;
}

interface SessionType {
    id: string;
    name: string;
    duration: number;
    price: number;
    maxStudents: number;
}

// Mock teachers data
const teachersData: Teacher[] = [
    {
        id: '1',
        name: 'Ahmed Hassan',
        avatar: 'https://i.pravatar.cc/150?img=11',
        subject: 'Mathematics',
        rating: 4.9,
        reviews: 156,
        students: 890,
        experience: '8 years',
        hourlyRate: 50,
        bio: 'Passionate about making math fun and accessible. Specialized in algebra, calculus, and geometry.',
        languages: ['Arabic', 'English'],
        availability: [
            { id: '1', date: new Date(2026, 0, 7), startTime: '09:00', endTime: '10:00', available: true },
            { id: '2', date: new Date(2026, 0, 7), startTime: '10:00', endTime: '11:00', available: true },
            { id: '3', date: new Date(2026, 0, 7), startTime: '14:00', endTime: '15:00', available: false },
            { id: '4', date: new Date(2026, 0, 8), startTime: '09:00', endTime: '10:00', available: true },
            { id: '5', date: new Date(2026, 0, 8), startTime: '11:00', endTime: '12:00', available: true },
            { id: '6', date: new Date(2026, 0, 9), startTime: '15:00', endTime: '16:00', available: true },
        ],
        sessionTypes: [
            { id: '1', name: '1-on-1 Tutoring', duration: 60, price: 50, maxStudents: 1 },
            { id: '2', name: 'Group Session', duration: 90, price: 30, maxStudents: 5 },
        ],
    },
    {
        id: '2',
        name: 'Sara Ali',
        avatar: 'https://i.pravatar.cc/150?img=5',
        subject: 'Physics',
        rating: 4.8,
        reviews: 98,
        students: 756,
        experience: '6 years',
        hourlyRate: 45,
        bio: 'Making physics concepts clear and understandable through real-world examples.',
        languages: ['Arabic', 'English', 'French'],
        availability: [
            { id: '1', date: new Date(2026, 0, 7), startTime: '11:00', endTime: '12:00', available: true },
            { id: '2', date: new Date(2026, 0, 7), startTime: '15:00', endTime: '16:00', available: true },
            { id: '3', date: new Date(2026, 0, 8), startTime: '10:00', endTime: '11:00', available: true },
        ],
        sessionTypes: [
            { id: '1', name: '1-on-1 Tutoring', duration: 60, price: 45, maxStudents: 1 },
            { id: '2', name: 'Quick Help', duration: 30, price: 25, maxStudents: 1 },
        ],
    },
    {
        id: '3',
        name: 'Mohamed Farid',
        avatar: 'https://i.pravatar.cc/150?img=12',
        subject: 'English',
        rating: 4.7,
        reviews: 134,
        students: 623,
        experience: '10 years',
        hourlyRate: 40,
        bio: 'Native-level English tutor specializing in grammar, writing, and conversation skills.',
        languages: ['Arabic', 'English'],
        availability: [
            { id: '1', date: new Date(2026, 0, 7), startTime: '08:00', endTime: '09:00', available: true },
            { id: '2', date: new Date(2026, 0, 8), startTime: '14:00', endTime: '15:00', available: true },
            { id: '3', date: new Date(2026, 0, 9), startTime: '09:00', endTime: '10:00', available: true },
        ],
        sessionTypes: [
            { id: '1', name: 'Conversation Practice', duration: 45, price: 35, maxStudents: 1 },
            { id: '2', name: 'Grammar Workshop', duration: 60, price: 40, maxStudents: 3 },
        ],
    },
    {
        id: '4',
        name: 'Fatma Nour',
        avatar: 'https://i.pravatar.cc/150?img=9',
        subject: 'Chemistry',
        rating: 4.6,
        reviews: 87,
        students: 534,
        experience: '5 years',
        hourlyRate: 42,
        bio: 'Chemistry made simple! Lab experiments and theory explained with clarity.',
        languages: ['Arabic', 'English'],
        availability: [
            { id: '1', date: new Date(2026, 0, 7), startTime: '13:00', endTime: '14:00', available: true },
            { id: '2', date: new Date(2026, 0, 8), startTime: '16:00', endTime: '17:00', available: true },
        ],
        sessionTypes: [
            { id: '1', name: 'Theory Session', duration: 60, price: 42, maxStudents: 1 },
            { id: '2', name: 'Lab Prep', duration: 90, price: 55, maxStudents: 2 },
        ],
    },
];

const subjects = ['All', 'Mathematics', 'Physics', 'English', 'Chemistry', 'Biology', 'Arabic'];

export default function BookSessionPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 0, 7));
    const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
    const [selectedSessionType, setSelectedSessionType] = useState<SessionType | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);

    // Filter teachers
    const filteredTeachers = teachersData.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = selectedSubject === 'All' || t.subject === selectedSubject;
        return matchesSearch && matchesSubject;
    });

    // Get week days for calendar
    const getWeekDays = () => {
        const start = new Date(selectedDate);
        start.setDate(start.getDate() - start.getDay());
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            return day;
        });
    };

    const weekDays = getWeekDays();
    const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();

    const getAvailableSlotsForDay = (teacher: Teacher, date: Date) => {
        return teacher.availability.filter(slot => isSameDay(slot.date, date) && slot.available);
    };

    const navigateWeek = (direction: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + direction * 7);
        setSelectedDate(newDate);
    };

    const openTeacherCalendar = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setSelectedSlot(null);
        setSelectedSessionType(teacher.sessionTypes[0] || null);
    };

    const selectSlot = (slot: AvailabilitySlot) => {
        setSelectedSlot(slot);
    };

    const openBookingModal = () => {
        if (selectedSlot && selectedSessionType) {
            setIsBookingModalOpen(true);
        }
    };

    const confirmBooking = () => {
        setBookingConfirmed(true);
        setTimeout(() => {
            setIsBookingModalOpen(false);
            setBookingConfirmed(false);
            setSelectedTeacher(null);
            setSelectedSlot(null);
        }, 2000);
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
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                        <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Book a Session</h1>
                        <p className="text-gray-500 text-sm">Find a teacher and schedule your session</p>
                    </div>
                </div>
            </motion.div>

            {/* Search & Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search teachers or subjects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {subjects.map((subject) => (
                        <button
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            className={`px-4 py-2 rounded-xl whitespace-nowrap font-medium text-sm transition-all ${selectedSubject === subject
                                    ? 'bg-emerald-500 text-white shadow-lg'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-200'
                                }`}
                        >
                            {subject}
                        </button>
                    ))}
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Teachers List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`lg:col-span-${selectedTeacher ? '1' : '3'} space-y-4`}
                >
                    {filteredTeachers.map((teacher, idx) => (
                        <motion.div
                            key={teacher.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * idx }}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => openTeacherCalendar(teacher)}
                            className={`bg-white rounded-2xl p-4 shadow-lg border-2 cursor-pointer transition-all ${selectedTeacher?.id === teacher.id ? 'border-emerald-500' : 'border-transparent hover:border-emerald-200'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <img src={teacher.avatar} alt="" className="w-16 h-16 rounded-xl object-cover" />
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{teacher.name}</h3>
                                            <p className="text-sm text-emerald-600">{teacher.subject}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            <span className="text-sm font-medium text-amber-700">{teacher.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{teacher.bio}</p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5" />
                                            {teacher.students} students
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Award className="w-3.5 h-3.5" />
                                            {teacher.experience}
                                        </span>
                                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                            <DollarSign className="w-3.5 h-3.5" />
                                            From ${Math.min(...teacher.sessionTypes.map(s => s.price))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Teacher Calendar (when selected) */}
                {selectedTeacher && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                        {/* Teacher Header */}
                        <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={selectedTeacher.avatar} alt="" className="w-12 h-12 rounded-xl border-2 border-white/30" />
                                    <div>
                                        <h3 className="font-bold">{selectedTeacher.name}</h3>
                                        <p className="text-emerald-100 text-sm">{selectedTeacher.subject}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedTeacher(null)}
                                    className="p-2 rounded-xl hover:bg-white/20"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Session Type Selection */}
                        <div className="p-4 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-700 mb-2">Select Session Type</p>
                            <div className="flex gap-2">
                                {selectedTeacher.sessionTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedSessionType(type)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedSessionType?.id === type.id
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {type.name} ({type.duration}min) - ${type.price}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Calendar Navigation */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <button onClick={() => navigateWeek(-1)} className="p-2 rounded-xl hover:bg-gray-100">
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h4 className="font-semibold text-gray-900">
                                {weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h4>
                            <button onClick={() => navigateWeek(1)} className="p-2 rounded-xl hover:bg-gray-100">
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Week Calendar */}
                        <div className="p-4">
                            <div className="grid grid-cols-7 gap-2">
                                {weekDays.map((day, idx) => {
                                    const slots = getAvailableSlotsForDay(selectedTeacher, day);
                                    const isToday = isSameDay(day, new Date(2026, 0, 7));
                                    return (
                                        <div key={idx} className="text-center">
                                            <p className="text-xs text-gray-500 mb-1">
                                                {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                            </p>
                                            <p className={`text-lg font-bold mb-2 ${isToday ? 'text-emerald-500' : 'text-gray-900'}`}>
                                                {day.getDate()}
                                            </p>
                                            <div className="space-y-1">
                                                {slots.length > 0 ? (
                                                    slots.map((slot) => (
                                                        <button
                                                            key={slot.id}
                                                            onClick={() => selectSlot(slot)}
                                                            className={`w-full py-1.5 px-1 rounded-lg text-xs font-medium transition-all ${selectedSlot?.id === slot.id
                                                                    ? 'bg-emerald-500 text-white'
                                                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                                }`}
                                                        >
                                                            {slot.startTime}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-gray-300 py-2">-</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Selected Slot & Book Button */}
                        {selectedSlot && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-emerald-50 border-t border-emerald-100"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-emerald-600">Selected Time</p>
                                        <p className="font-bold text-emerald-700">
                                            {selectedSlot.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                            {' '} at {selectedSlot.startTime}
                                        </p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={openBookingModal}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-medium shadow-lg"
                                    >
                                        <Video className="w-5 h-5" />
                                        Book Session
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Booking Confirmation Modal */}
            <AnimatePresence>
                {isBookingModalOpen && selectedTeacher && selectedSlot && selectedSessionType && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !bookingConfirmed && setIsBookingModalOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden">
                                {bookingConfirmed ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-8 text-center"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', delay: 0.2 }}
                                            className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                        >
                                            <Check className="w-10 h-10 text-emerald-500" />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Session Booked!</h3>
                                        <p className="text-gray-500">You'll receive a confirmation email with the meeting link.</p>
                                    </motion.div>
                                ) : (
                                    <>
                                        <div className="p-6 border-b border-gray-100">
                                            <h3 className="text-xl font-bold text-gray-900">Confirm Booking</h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {/* Teacher Info */}
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                <img src={selectedTeacher.avatar} alt="" className="w-12 h-12 rounded-xl" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">{selectedTeacher.name}</p>
                                                    <p className="text-sm text-gray-500">{selectedTeacher.subject}</p>
                                                </div>
                                            </div>

                                            {/* Session Details */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Session Type</span>
                                                    <span className="font-medium text-gray-900">{selectedSessionType.name}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Date</span>
                                                    <span className="font-medium text-gray-900">
                                                        {selectedSlot.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Time</span>
                                                    <span className="font-medium text-gray-900">{selectedSlot.startTime}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Duration</span>
                                                    <span className="font-medium text-gray-900">{selectedSessionType.duration} minutes</span>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                                                <span className="font-semibold text-emerald-700">Total Price</span>
                                                <span className="text-2xl font-bold text-emerald-600">${selectedSessionType.price}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-6 border-t border-gray-100">
                                            <button
                                                onClick={() => setIsBookingModalOpen(false)}
                                                className="flex-1 px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={confirmBooking}
                                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-medium shadow-lg"
                                            >
                                                <Check className="w-5 h-5" />
                                                Confirm Booking
                                            </motion.button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
