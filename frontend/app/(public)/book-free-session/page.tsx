'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Calendar,
    Clock,
    ChevronLeft,
    ChevronRight,
    Video,
    User,
    Phone,
    Check,
    GraduationCap,
    BookOpen,
    Star,
    Users,
    Award,
    ArrowRight,
    ArrowLeft,
    Sparkles
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
    bio: string;
    availability: AvailabilitySlot[];
}

interface AvailabilitySlot {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    available: boolean;
}

interface Course {
    id: string;
    name: string;
    level: string;
    description: string;
    teacherIds: string[];
}

// Mock data
const levels = [
    { id: 'primary', name: 'Primary', nameAr: 'ابتدائي', icon: '📚', color: 'emerald' },
    { id: 'preparatory', name: 'Preparatory', nameAr: 'إعدادي', icon: '📖', color: 'blue' },
    { id: 'secondary', name: 'Secondary', nameAr: 'ثانوي', icon: '🎓', color: 'purple' },
    { id: 'university', name: 'University', nameAr: 'جامعي', icon: '🏛️', color: 'amber' },
];

const courses: Course[] = [
    { id: '1', name: 'Mathematics', level: 'primary', description: 'Basic math concepts', teacherIds: ['1'] },
    { id: '2', name: 'English', level: 'primary', description: 'English basics', teacherIds: ['3'] },
    { id: '3', name: 'Advanced Mathematics', level: 'preparatory', description: 'Algebra & Geometry', teacherIds: ['1'] },
    { id: '4', name: 'Science', level: 'preparatory', description: 'General science concepts', teacherIds: ['2', '4'] },
    { id: '5', name: 'Physics', level: 'secondary', description: 'Physics fundamentals', teacherIds: ['2'] },
    { id: '6', name: 'Chemistry', level: 'secondary', description: 'Chemistry concepts', teacherIds: ['4'] },
    { id: '7', name: 'Calculus', level: 'university', description: 'Advanced calculus', teacherIds: ['1'] },
    { id: '8', name: 'Quantum Physics', level: 'university', description: 'Advanced physics', teacherIds: ['2'] },
];

const teachers: Teacher[] = [
    {
        id: '1', name: 'Ahmed Hassan', avatar: 'https://i.pravatar.cc/150?img=11', subject: 'Mathematics',
        rating: 4.9, reviews: 156, students: 890, experience: '8 years',
        bio: 'Passionate about making math fun and accessible for all students.',
        availability: [
            { id: '1', date: new Date(2026, 0, 7), startTime: '09:00', endTime: '10:00', available: true },
            { id: '2', date: new Date(2026, 0, 7), startTime: '10:00', endTime: '11:00', available: true },
            { id: '3', date: new Date(2026, 0, 7), startTime: '14:00', endTime: '15:00', available: false },
            { id: '4', date: new Date(2026, 0, 8), startTime: '09:00', endTime: '10:00', available: true },
            { id: '5', date: new Date(2026, 0, 8), startTime: '11:00', endTime: '12:00', available: true },
            { id: '6', date: new Date(2026, 0, 9), startTime: '15:00', endTime: '16:00', available: true },
            { id: '7', date: new Date(2026, 0, 10), startTime: '10:00', endTime: '11:00', available: true },
        ],
    },
    {
        id: '2', name: 'Sara Ali', avatar: 'https://i.pravatar.cc/150?img=5', subject: 'Physics',
        rating: 4.8, reviews: 98, students: 756, experience: '6 years',
        bio: 'Making physics concepts clear through real-world examples.',
        availability: [
            { id: '1', date: new Date(2026, 0, 7), startTime: '11:00', endTime: '12:00', available: true },
            { id: '2', date: new Date(2026, 0, 7), startTime: '15:00', endTime: '16:00', available: true },
            { id: '3', date: new Date(2026, 0, 8), startTime: '10:00', endTime: '11:00', available: true },
            { id: '4', date: new Date(2026, 0, 9), startTime: '14:00', endTime: '15:00', available: true },
        ],
    },
    {
        id: '3', name: 'Mohamed Farid', avatar: 'https://i.pravatar.cc/150?img=12', subject: 'English',
        rating: 4.7, reviews: 134, students: 623, experience: '10 years',
        bio: 'Native-level English tutor specializing in grammar and conversation.',
        availability: [
            { id: '1', date: new Date(2026, 0, 7), startTime: '08:00', endTime: '09:00', available: true },
            { id: '2', date: new Date(2026, 0, 8), startTime: '14:00', endTime: '15:00', available: true },
            { id: '3', date: new Date(2026, 0, 9), startTime: '09:00', endTime: '10:00', available: true },
        ],
    },
    {
        id: '4', name: 'Fatma Nour', avatar: 'https://i.pravatar.cc/150?img=9', subject: 'Chemistry',
        rating: 4.6, reviews: 87, students: 534, experience: '5 years',
        bio: 'Chemistry made simple! Lab experiments explained with clarity.',
        availability: [
            { id: '1', date: new Date(2026, 0, 7), startTime: '13:00', endTime: '14:00', available: true },
            { id: '2', date: new Date(2026, 0, 8), startTime: '16:00', endTime: '17:00', available: true },
            { id: '3', date: new Date(2026, 0, 10), startTime: '11:00', endTime: '12:00', available: true },
        ],
    },
];

export default function BookFreeSessionPage() {
    const [step, setStep] = useState(1);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
    const [currentWeek, setCurrentWeek] = useState(new Date(2026, 0, 5));
    const [contactInfo, setContactInfo] = useState({ name: '', phone: '', email: '' });
    const [isBooked, setIsBooked] = useState(false);

    // Get courses for selected level
    const levelCourses = selectedLevel ? courses.filter(c => c.level === selectedLevel) : [];

    // Get teachers for selected course
    const courseTeachers = selectedCourse ? teachers.filter(t => selectedCourse.teacherIds.includes(t.id)) : [];

    // Get week days
    const getWeekDays = () => {
        const start = new Date(currentWeek);
        start.setDate(start.getDate() - start.getDay());
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            return day;
        });
    };

    const weekDays = getWeekDays();
    const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();

    const getAvailableSlotsForDay = (date: Date) => {
        if (!selectedTeacher) return [];
        return selectedTeacher.availability.filter(slot => isSameDay(slot.date, date) && slot.available);
    };

    const navigateWeek = (direction: number) => {
        const newDate = new Date(currentWeek);
        newDate.setDate(currentWeek.getDate() + direction * 7);
        setCurrentWeek(newDate);
    };

    const handleBookSession = () => {
        if (!contactInfo.name || !contactInfo.phone) return;
        setIsBooked(true);
    };

    const goToStep = (newStep: number) => {
        if (newStep < step) {
            setStep(newStep);
        }
    };

    const nextStep = () => {
        if (step < 5) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <section className="py-20 bg-gradient-to-br from-[var(--color-primary-50)] via-white to-[var(--color-accent-50)]">
            <div className="container">
                {/* Title */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-100)] text-[var(--color-primary-700)] rounded-full text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        Book Your Free Trial Session
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Experience Learning Excellence</h1>
                    <p className="text-gray-600 max-w-lg mx-auto">Start your journey with a free 30-minute session with our expert teachers</p>
                </motion.div>

                {/* Progress Steps */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        {['Level', 'Course', 'Teacher', 'Time', 'Details'].map((label, idx) => (
                            <div key={label} className="flex items-center">
                                <button
                                    onClick={() => goToStep(idx + 1)}
                                    disabled={idx + 1 > step}
                                    className={`flex flex-col items-center ${idx + 1 <= step ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all border-b-4 ${step > idx + 1 ? 'bg-[var(--color-primary-500)] text-white border-[var(--color-primary-700)]' :
                                            step === idx + 1 ? 'bg-[var(--color-primary-500)] text-white ring-4 ring-[var(--color-primary-200)] border-[var(--color-primary-700)]' :
                                                'bg-gray-200 text-gray-500 border-gray-300'
                                        }`}>
                                        {step > idx + 1 ? <Check className="w-5 h-5" /> : idx + 1}
                                    </div>
                                    <span className={`text-xs mt-1 ${step >= idx + 1 ? 'text-[var(--color-primary-600)] font-medium' : 'text-gray-400'}`}>{label}</span>
                                </button>
                                {idx < 4 && <div className={`w-12 md:w-20 h-1 mx-2 rounded ${step > idx + 1 ? 'bg-[var(--color-primary-500)]' : 'bg-gray-200'}`} />}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Success State */}
                {isBooked ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-xl border-b-4 border-gray-200 p-8 text-center max-w-2xl mx-auto"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="w-24 h-24 bg-[var(--color-primary-100)] rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <Check className="w-12 h-12 text-[var(--color-primary-500)]" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Booked Successfully! 🎉</h2>
                        <p className="text-gray-600 mb-6">We'll send you a confirmation message with the meeting link.</p>
                        <div className="bg-gray-50 rounded-2xl p-4 max-w-sm mx-auto mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <img src={selectedTeacher?.avatar} alt="" className="w-12 h-12 rounded-xl" />
                                <div className="text-left">
                                    <p className="font-semibold text-gray-900">{selectedTeacher?.name}</p>
                                    <p className="text-sm text-gray-500">{selectedCourse?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-4 text-sm">
                                <span className="flex items-center gap-1 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    {selectedSlot?.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1 text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    {selectedSlot?.startTime}
                                </span>
                            </div>
                        </div>
                        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 gradient-brand text-white rounded-2xl font-bold border-b-4 border-[var(--color-primary-700)] hover:brightness-110 shadow-md transition-all">
                            Back to Home
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white rounded-3xl shadow-xl border-b-4 border-gray-200 overflow-hidden max-w-2xl mx-auto"
                    >
                        {/* Step 1: Select Level */}
                        {step === 1 && (
                            <div className="p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Select Your Level</h2>
                                <p className="text-gray-500 mb-6">Choose the educational level that matches your current stage</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {levels.map((level) => (
                                        <motion.button
                                            key={level.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => { setSelectedLevel(level.id); setSelectedCourse(null); setSelectedTeacher(null); nextStep(); }}
                                            className={`p-6 rounded-2xl border-2 border-b-4 text-left transition-all ${selectedLevel === level.id ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]' : 'border-gray-200 hover:border-[var(--color-accent-400)]'
                                                }`}
                                        >
                                            <span className="text-4xl mb-3 block">{level.icon}</span>
                                            <p className="font-bold text-gray-900">{level.name}</p>
                                            <p className="text-sm text-gray-500">{level.nameAr}</p>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Select Course */}
                        {step === 2 && (
                            <div className="p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Choose a Course</h2>
                                <p className="text-gray-500 mb-6">Select the subject you want to learn</p>
                                <div className="space-y-3">
                                    {levelCourses.map((course) => (
                                        <motion.button
                                            key={course.id}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => { setSelectedCourse(course); setSelectedTeacher(null); nextStep(); }}
                                            className={`w-full p-4 rounded-2xl border-2 border-b-4 text-left transition-all flex items-center justify-between ${selectedCourse?.id === course.id ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]' : 'border-gray-200 hover:border-[var(--color-accent-400)]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center border-b-2 border-[var(--color-primary-700)]">
                                                    <BookOpen className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{course.name}</p>
                                                    <p className="text-sm text-gray-500">{course.description}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </motion.button>
                                    ))}
                                </div>
                                <button onClick={prevStep} className="mt-6 flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium">
                                    <ArrowLeft className="w-4 h-4" /> Back to Level
                                </button>
                            </div>
                        )}

                        {/* Step 3: Select Teacher */}
                        {step === 3 && (
                            <div className="p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Your Teacher</h2>
                                <p className="text-gray-500 mb-6">Select a teacher for {selectedCourse?.name}</p>
                                <div className="space-y-4">
                                    {courseTeachers.map((teacher) => (
                                        <motion.button
                                            key={teacher.id}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => { setSelectedTeacher(teacher); setSelectedSlot(null); nextStep(); }}
                                            className={`w-full p-4 rounded-2xl border-2 border-b-4 text-left transition-all ${selectedTeacher?.id === teacher.id ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]' : 'border-gray-200 hover:border-[var(--color-accent-400)]'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <img src={teacher.avatar} alt="" className="w-16 h-16 rounded-xl object-cover border-b-2 border-gray-200" />
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="font-bold text-gray-900">{teacher.name}</p>
                                                            <p className="text-sm text-[var(--color-primary-600)]">{teacher.subject}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-[var(--color-accent-100)] px-2 py-1 rounded-lg">
                                                            <Star className="w-4 h-4 text-[var(--color-accent-500)] fill-[var(--color-accent-500)]" />
                                                            <span className="text-sm font-medium text-[var(--color-accent-700)]">{teacher.rating}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">{teacher.bio}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{teacher.students} students</span>
                                                        <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" />{teacher.experience}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                                <button onClick={prevStep} className="mt-6 flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium">
                                    <ArrowLeft className="w-4 h-4" /> Back to Courses
                                </button>
                            </div>
                        )}

                        {/* Step 4: Select Time */}
                        {step === 4 && selectedTeacher && (
                            <div className="p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Select a Time Slot</h2>
                                <p className="text-gray-500 mb-6">Choose an available time with {selectedTeacher.name}</p>

                                {/* Week Navigation */}
                                <div className="flex items-center justify-between mb-4">
                                    <button onClick={() => navigateWeek(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <h3 className="font-semibold text-gray-900">
                                        {weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </h3>
                                    <button onClick={() => navigateWeek(1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                                        <ChevronRight className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-2 mb-6">
                                    {weekDays.map((day, idx) => {
                                        const slots = getAvailableSlotsForDay(day);
                                        const isToday = isSameDay(day, new Date(2026, 0, 7));
                                        return (
                                            <div key={idx} className="text-center">
                                                <p className="text-xs text-gray-500 mb-1">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                                <p className={`text-lg font-bold mb-2 ${isToday ? 'text-[var(--color-primary-500)]' : 'text-gray-900'}`}>{day.getDate()}</p>
                                                <div className="space-y-1">
                                                    {slots.length > 0 ? (
                                                        slots.map((slot) => (
                                                            <button
                                                                key={slot.id}
                                                                onClick={() => setSelectedSlot(slot)}
                                                                className={`w-full py-1.5 px-1 rounded-lg text-xs font-medium transition-all ${selectedSlot?.id === slot.id
                                                                        ? 'bg-[var(--color-primary-500)] text-white'
                                                                        : 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)] hover:bg-[var(--color-primary-100)]'
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

                                {selectedSlot && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-[var(--color-primary-50)] rounded-xl mb-6">
                                        <p className="text-[var(--color-primary-700)] font-medium">
                                            Selected: {selectedSlot.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} at {selectedSlot.startTime}
                                        </p>
                                    </motion.div>
                                )}

                                <div className="flex items-center justify-between">
                                    <button onClick={prevStep} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium">
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={nextStep}
                                        disabled={!selectedSlot}
                                        className="flex items-center gap-2 px-6 py-3 gradient-brand disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl font-bold border-b-4 border-[var(--color-primary-700)] disabled:border-gray-400 shadow-md transition-all"
                                    >
                                        Continue <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Contact Details */}
                        {step === 5 && (
                            <div className="p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Your Contact Details</h2>
                                <p className="text-gray-500 mb-6">We'll send you the session link and reminders</p>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={contactInfo.name}
                                                onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                                                placeholder="Enter your name"
                                                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:ring-2 focus:ring-[var(--color-primary-400)] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={contactInfo.phone}
                                                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                                placeholder="Enter your phone number"
                                                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:ring-2 focus:ring-[var(--color-primary-400)] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                                        <input
                                            type="email"
                                            value={contactInfo.email}
                                            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:ring-2 focus:ring-[var(--color-primary-400)] focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Booking Summary */}
                                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                                    <p className="text-sm font-medium text-gray-500 mb-3">Booking Summary</p>
                                    <div className="flex items-center gap-3 mb-3">
                                        <img src={selectedTeacher?.avatar} alt="" className="w-12 h-12 rounded-xl" />
                                        <div>
                                            <p className="font-semibold text-gray-900">{selectedTeacher?.name}</p>
                                            <p className="text-sm text-gray-500">{selectedCourse?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{selectedSlot?.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{selectedSlot?.startTime}</span>
                                        <span className="flex items-center gap-1"><Video className="w-4 h-4" />30 min</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button onClick={prevStep} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium">
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleBookSession}
                                        disabled={!contactInfo.name || !contactInfo.phone}
                                        className="flex items-center gap-2 px-6 py-3 gradient-brand disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl font-bold border-b-4 border-[var(--color-primary-700)] disabled:border-gray-400 shadow-lg transition-all"
                                    >
                                        <Video className="w-5 h-5" /> Book Free Session
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
