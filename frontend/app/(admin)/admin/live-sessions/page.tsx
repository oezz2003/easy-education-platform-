'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Calendar,
    Plus,
    ChevronLeft,
    ChevronRight,
    Video,
    Clock,
    Users,
    X,
    GraduationCap,
    BookOpen,
    Link as LinkIcon,
    Copy,
    Check,
    Filter,
    Grid3X3,
    List,
    Play,
    Trash2,
    ExternalLink,
    Search,
    UserPlus,
    Mail
} from 'lucide-react';

// Types
interface Student {
    id: string;
    name: string;
    avatar: string;
    email: string;
    enrolled: boolean;
}

interface Teacher {
    id: string;
    name: string;
    avatar: string;
    subject: string;
    color: string;
    availability: { day: number; slots: string[] }[];
}

interface Course {
    id: string;
    name: string;
    subject: string;
    teacherId: string;
    batchId: string;
    batchName: string;
    students: string[];
}

interface Session {
    id: string;
    title: string;
    description: string;
    teacherId: string;
    teacherName: string;
    teacherAvatar: string;
    courseId: string;
    courseName: string;
    batchName: string;
    subject: string;
    date: Date;
    startTime: string;
    endTime: string;
    duration: number;
    maxAttendees: number;
    invitedStudents: string[];
    status: 'scheduled' | 'live' | 'completed' | 'cancelled';
    meetLink: string;
    color: string;
    recurring: boolean;
    recurringDays: number[];
}

// Mock data
const teachers: Teacher[] = [
    { id: '1', name: 'Ahmed Hassan', avatar: 'https://i.pravatar.cc/150?img=11', subject: 'Mathematics', color: '#10b981', availability: [{ day: 1, slots: ['09:00', '10:00', '14:00', '15:00'] }, { day: 3, slots: ['09:00', '11:00'] }, { day: 5, slots: ['10:00', '14:00'] }] },
    { id: '2', name: 'Sara Ali', avatar: 'https://i.pravatar.cc/150?img=5', subject: 'Physics', color: '#3b82f6', availability: [{ day: 1, slots: ['11:00', '15:00'] }, { day: 2, slots: ['09:00', '10:00'] }, { day: 4, slots: ['14:00', '16:00'] }] },
    { id: '3', name: 'Mohamed Farid', avatar: 'https://i.pravatar.cc/150?img=12', subject: 'English', color: '#8b5cf6', availability: [{ day: 2, slots: ['08:00', '09:00'] }, { day: 3, slots: ['14:00', '15:00'] }, { day: 5, slots: ['11:00'] }] },
    { id: '4', name: 'Fatma Nour', avatar: 'https://i.pravatar.cc/150?img=9', subject: 'Chemistry', color: '#f59e0b', availability: [{ day: 1, slots: ['13:00'] }, { day: 4, slots: ['09:00', '10:00', '11:00'] }] },
];

const courses: Course[] = [
    { id: '1', name: 'Advanced Mathematics', subject: 'Mathematics', teacherId: '1', batchId: 'B1', batchName: 'Batch 2026-A', students: ['s1', 's2', 's3', 's4', 's5'] },
    { id: '2', name: 'Physics Fundamentals', subject: 'Physics', teacherId: '2', batchId: 'B2', batchName: 'Batch 2026-B', students: ['s2', 's3', 's6', 's7'] },
    { id: '3', name: 'English Grammar', subject: 'English', teacherId: '3', batchId: 'B3', batchName: 'Batch 2026-A', students: ['s1', 's4', 's5', 's8'] },
    { id: '4', name: 'Chemistry Lab', subject: 'Chemistry', teacherId: '4', batchId: 'B4', batchName: 'Batch 2026-C', students: ['s3', 's6', 's9', 's10'] },
    { id: '5', name: 'Algebra Basics', subject: 'Mathematics', teacherId: '1', batchId: 'B5', batchName: 'Batch 2026-B', students: ['s7', 's8', 's9'] },
];

const students: Student[] = [
    { id: 's1', name: 'Omar Khaled', avatar: 'https://i.pravatar.cc/150?img=1', email: 'omar@edu.com', enrolled: false },
    { id: 's2', name: 'Fatma Ahmed', avatar: 'https://i.pravatar.cc/150?img=2', email: 'fatma@edu.com', enrolled: false },
    { id: 's3', name: 'Youssef Ibrahim', avatar: 'https://i.pravatar.cc/150?img=3', email: 'youssef@edu.com', enrolled: false },
    { id: 's4', name: 'Sara Mohamed', avatar: 'https://i.pravatar.cc/150?img=4', email: 'sara@edu.com', enrolled: false },
    { id: 's5', name: 'Ali Hassan', avatar: 'https://i.pravatar.cc/150?img=5', email: 'ali@edu.com', enrolled: false },
    { id: 's6', name: 'Laila Nour', avatar: 'https://i.pravatar.cc/150?img=6', email: 'laila@edu.com', enrolled: false },
    { id: 's7', name: 'Mohamed Salem', avatar: 'https://i.pravatar.cc/150?img=7', email: 'msalem@edu.com', enrolled: false },
    { id: 's8', name: 'Nadia Karim', avatar: 'https://i.pravatar.cc/150?img=8', email: 'nadia@edu.com', enrolled: false },
    { id: 's9', name: 'Khaled Farid', avatar: 'https://i.pravatar.cc/150?img=9', email: 'khaled@edu.com', enrolled: false },
    { id: 's10', name: 'Mona Ali', avatar: 'https://i.pravatar.cc/150?img=10', email: 'mona@edu.com', enrolled: false },
];

const generateMeetLink = () => `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;

// Initial sessions
const initialSessions: Session[] = [
    {
        id: '1',
        title: 'Algebra Fundamentals',
        description: 'Introduction to algebraic expressions and equations',
        teacherId: '1',
        teacherName: 'Ahmed Hassan',
        teacherAvatar: 'https://i.pravatar.cc/150?img=11',
        courseId: '1',
        courseName: 'Advanced Mathematics',
        batchName: 'Batch 2026-A',
        subject: 'Mathematics',
        date: new Date(2026, 0, 7),
        startTime: '09:00',
        endTime: '10:30',
        duration: 90,
        maxAttendees: 30,
        invitedStudents: ['s1', 's2', 's3', 's4', 's5'],
        status: 'live',
        meetLink: generateMeetLink(),
        color: '#10b981',
        recurring: true,
        recurringDays: [1, 3, 5],
    },
    {
        id: '2',
        title: 'Physics Lab Practice',
        description: 'Hands-on physics experiments and demonstrations',
        teacherId: '2',
        teacherName: 'Sara Ali',
        teacherAvatar: 'https://i.pravatar.cc/150?img=5',
        courseId: '2',
        courseName: 'Physics Fundamentals',
        batchName: 'Batch 2026-B',
        subject: 'Physics',
        date: new Date(2026, 0, 7),
        startTime: '11:00',
        endTime: '12:30',
        duration: 90,
        maxAttendees: 25,
        invitedStudents: ['s2', 's3', 's6', 's7'],
        status: 'scheduled',
        meetLink: generateMeetLink(),
        color: '#3b82f6',
        recurring: false,
        recurringDays: [],
    },
];

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

export default function LiveSessionsPage() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 7));
    const [sessions, setSessions] = useState<Session[]>(initialSessions);
    const [filterTeacher, setFilterTeacher] = useState<string>('all');
    const [filterCourse, setFilterCourse] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [draggedSession, setDraggedSession] = useState<Session | null>(null);
    const [copiedLink, setCopiedLink] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [studentSearch, setStudentSearch] = useState('');

    // New session form
    const [newSession, setNewSession] = useState({
        title: '',
        description: '',
        teacherId: '',
        courseId: '',
        date: '',
        startTime: '09:00',
        duration: 60,
        maxAttendees: 30,
        invitedStudents: [] as string[],
        recurring: false,
        recurringDays: [] as number[],
    });

    const weekDays = getWeekDays(currentDate);

    const navigateWeek = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + direction * 7);
        setCurrentDate(newDate);
    };

    const getSessionsForSlot = (day: Date, time: string) => {
        return sessions.filter(s => {
            if (!isSameDay(s.date, day)) return false;
            const sessionStart = parseInt(s.startTime.split(':')[0]);
            const slotStart = parseInt(time.split(':')[0]);
            return sessionStart === slotStart;
        });
    };

    const handleDragStart = (session: Session) => setDraggedSession(session);
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const handleDrop = (day: Date, time: string) => {
        if (!draggedSession) return;
        const updatedSessions = sessions.map(s => {
            if (s.id === draggedSession.id) {
                return { ...s, date: day, startTime: time, endTime: `${parseInt(time.split(':')[0]) + Math.ceil(s.duration / 60)}:00` };
            }
            return s;
        });
        setSessions(updatedSessions);
        setDraggedSession(null);
    };

    const openSessionModal = (session: Session) => {
        setSelectedSession(session);
        setIsCreating(false);
        setIsModalOpen(true);
    };

    const openCreateModal = (day?: Date, time?: string) => {
        setSelectedSession(null);
        setIsCreating(true);
        setModalStep(1);
        setNewSession({
            title: '',
            description: '',
            teacherId: '',
            courseId: '',
            date: day ? day.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            startTime: time || '09:00',
            duration: 60,
            maxAttendees: 30,
            invitedStudents: [],
            recurring: false,
            recurringDays: [],
        });
        setIsModalOpen(true);
    };

    // Get teacher's available slots for selected date
    const getTeacherAvailability = () => {
        if (!newSession.teacherId || !newSession.date) return [];
        const teacher = teachers.find(t => t.id === newSession.teacherId);
        if (!teacher) return [];
        const dayOfWeek = new Date(newSession.date).getDay();
        const dayAvail = teacher.availability.find(a => a.day === dayOfWeek);
        return dayAvail?.slots || [];
    };

    // Get courses for selected teacher
    const getTeacherCourses = () => {
        if (!newSession.teacherId) return [];
        return courses.filter(c => c.teacherId === newSession.teacherId);
    };

    // Get students for selected course
    const getCourseStudents = () => {
        if (!newSession.courseId) return [];
        const course = courses.find(c => c.id === newSession.courseId);
        if (!course) return [];
        return students.filter(s => course.students.includes(s.id));
    };

    const toggleStudent = (studentId: string) => {
        if (newSession.invitedStudents.includes(studentId)) {
            setNewSession({ ...newSession, invitedStudents: newSession.invitedStudents.filter(id => id !== studentId) });
        } else {
            setNewSession({ ...newSession, invitedStudents: [...newSession.invitedStudents, studentId] });
        }
    };

    const selectAllStudents = () => {
        const courseStudents = getCourseStudents();
        setNewSession({ ...newSession, invitedStudents: courseStudents.map(s => s.id) });
    };

    const handleCreateSession = () => {
        const teacher = teachers.find(t => t.id === newSession.teacherId);
        const course = courses.find(c => c.id === newSession.courseId);
        if (!teacher || !course || !newSession.title) return;

        const session: Session = {
            id: Date.now().toString(),
            title: newSession.title,
            description: newSession.description,
            teacherId: teacher.id,
            teacherName: teacher.name,
            teacherAvatar: teacher.avatar,
            courseId: course.id,
            courseName: course.name,
            batchName: course.batchName,
            subject: teacher.subject,
            date: new Date(newSession.date),
            startTime: newSession.startTime,
            endTime: `${parseInt(newSession.startTime.split(':')[0]) + Math.ceil(newSession.duration / 60)}:00`,
            duration: newSession.duration,
            maxAttendees: newSession.maxAttendees,
            invitedStudents: newSession.invitedStudents,
            status: 'scheduled',
            meetLink: generateMeetLink(),
            color: teacher.color,
            recurring: newSession.recurring,
            recurringDays: newSession.recurringDays,
        };

        setSessions([...sessions, session]);
        setIsModalOpen(false);
    };

    const deleteSession = (id: string) => {
        setSessions(sessions.filter(s => s.id !== id));
        setIsModalOpen(false);
    };

    const copyMeetLink = (link: string) => {
        navigator.clipboard.writeText(link);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const filteredSessions = sessions.filter(s => {
        const matchesTeacher = filterTeacher === 'all' || s.teacherId === filterTeacher;
        const matchesCourse = filterCourse === 'all' || s.courseId === filterCourse;
        return matchesTeacher && matchesCourse;
    });

    const availableSlots = getTeacherAvailability();
    const teacherCourses = getTeacherCourses();
    const courseStudents = getCourseStudents().filter(s =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(studentSearch.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <Video className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Live Sessions</h1>
                        <p className="text-gray-500 text-sm">Manage and schedule live classes</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <select value={filterTeacher} onChange={(e) => setFilterTeacher(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm">
                        <option value="all">All Teachers</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm">
                        <option value="all">All Courses</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.batchName})</option>)}
                    </select>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => openCreateModal()}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium shadow-lg">
                        <Plus className="w-5 h-5" /> New Session
                    </motion.button>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Live Now', value: sessions.filter(s => s.status === 'live').length, color: 'red', icon: Play },
                    { label: 'Today', value: sessions.filter(s => isSameDay(s.date, new Date(2026, 0, 7))).length, color: 'blue', icon: Calendar },
                    { label: 'This Week', value: sessions.length, color: 'purple', icon: Clock },
                    { label: 'Total Students', value: sessions.reduce((acc, s) => acc + s.invitedStudents.length, 0), color: 'emerald', icon: Users },
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

            {/* Calendar Navigation */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigateWeek(-1)} className="p-2 rounded-xl hover:bg-gray-100"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
                    <h2 className="text-lg font-semibold text-gray-900">{weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => navigateWeek(1)} className="p-2 rounded-xl hover:bg-gray-100"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
                </div>
                <button onClick={() => setCurrentDate(new Date(2026, 0, 7))} className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl">Today</button>
            </motion.div>

            {/* Calendar Grid */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-8 border-b border-gray-100">
                    <div className="p-4 text-center text-sm font-medium text-gray-500 bg-gray-50">Time</div>
                    {weekDays.map((day, idx) => (
                        <div key={idx} className={`p-4 text-center border-l border-gray-100 ${isSameDay(day, new Date(2026, 0, 7)) ? 'bg-red-50' : ''}`}>
                            <p className="text-xs text-gray-500">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                            <p className={`text-lg font-bold ${isSameDay(day, new Date(2026, 0, 7)) ? 'text-red-500' : 'text-gray-900'}`}>{day.getDate()}</p>
                        </div>
                    ))}
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                    {timeSlots.map((time) => (
                        <div key={time} className="grid grid-cols-8 border-b border-gray-50">
                            <div className="p-3 text-center text-sm text-gray-500 bg-gray-50 border-r border-gray-100">{time}</div>
                            {weekDays.map((day, dayIdx) => {
                                const slotSessions = getSessionsForSlot(day, time).filter(s =>
                                    (filterTeacher === 'all' || s.teacherId === filterTeacher) &&
                                    (filterCourse === 'all' || s.courseId === filterCourse)
                                );
                                return (
                                    <div key={dayIdx} className="p-1 border-l border-gray-50 min-h-[70px] hover:bg-gray-50 cursor-pointer"
                                        onDragOver={handleDragOver} onDrop={() => handleDrop(day, time)}
                                        onClick={() => slotSessions.length === 0 && openCreateModal(day, time)}>
                                        {slotSessions.map((session) => (
                                            <motion.div key={session.id} draggable onDragStart={() => handleDragStart(session)}
                                                onClick={(e) => { e.stopPropagation(); openSessionModal(session); }}
                                                whileHover={{ scale: 1.02 }}
                                                className="rounded-lg p-2 text-white text-xs cursor-grab active:cursor-grabbing mb-1"
                                                style={{ backgroundColor: session.color }}>
                                                <div className="flex items-center gap-1 mb-1">
                                                    {session.status === 'live' && <span className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                                                    <span className="font-medium truncate">{session.title}</span>
                                                </div>
                                                <p className="opacity-80 truncate text-[10px]">{session.courseName} • {session.batchName}</p>
                                                <p className="opacity-70 text-[10px]">{session.invitedStudents.length} students</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto">
                                {isCreating ? (
                                    <>
                                        {/* Header with Steps */}
                                        <div className="p-6 border-b border-gray-100">
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-xl font-bold text-gray-900">Create Session</h2>
                                                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {[1, 2, 3].map((step) => (
                                                    <div key={step} className="flex items-center gap-2 flex-1">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${modalStep >= step ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{step}</div>
                                                        <span className={`text-sm ${modalStep >= step ? 'text-gray-900' : 'text-gray-400'}`}>
                                                            {step === 1 ? 'Details' : step === 2 ? 'Schedule' : 'Students'}
                                                        </span>
                                                        {step < 3 && <div className={`flex-1 h-0.5 ${modalStep > step ? 'bg-red-500' : 'bg-gray-200'}`} />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Step Content */}
                                        <div className="p-6">
                                            {modalStep === 1 && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Session Title *</label>
                                                        <input type="text" value={newSession.title} onChange={(e) => setNewSession({ ...newSession, title: e.target.value })} placeholder="e.g. Algebra Fundamentals" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                                        <textarea value={newSession.description} onChange={(e) => setNewSession({ ...newSession, description: e.target.value })} placeholder="What will be covered in this session..." rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 resize-none" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign Teacher *</label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {teachers.map((teacher) => (
                                                                <button key={teacher.id} onClick={() => setNewSession({ ...newSession, teacherId: teacher.id, courseId: '' })}
                                                                    className={`p-3 rounded-xl border-2 text-left transition-all ${newSession.teacherId === teacher.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                                                    <div className="flex items-center gap-3">
                                                                        <img src={teacher.avatar} alt="" className="w-10 h-10 rounded-xl" />
                                                                        <div>
                                                                            <p className="font-medium text-gray-900 text-sm">{teacher.name}</p>
                                                                            <p className="text-xs text-gray-500">{teacher.subject}</p>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {newSession.teacherId && teacherCourses.length > 0 && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Course & Batch *</label>
                                                            <div className="space-y-2">
                                                                {teacherCourses.map((course) => (
                                                                    <button key={course.id} onClick={() => setNewSession({ ...newSession, courseId: course.id, invitedStudents: [] })}
                                                                        className={`w-full p-3 rounded-xl border-2 text-left transition-all ${newSession.courseId === course.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                                                        <div className="flex items-center justify-between">
                                                                            <div>
                                                                                <p className="font-medium text-gray-900">{course.name}</p>
                                                                                <p className="text-xs text-gray-500">{course.batchName} • {course.students.length} students</p>
                                                                            </div>
                                                                            <BookOpen className={`w-5 h-5 ${newSession.courseId === course.id ? 'text-red-500' : 'text-gray-400'}`} />
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {modalStep === 2 && (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                                                            <input type="date" value={newSession.date} onChange={(e) => setNewSession({ ...newSession, date: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                                            <select value={newSession.duration} onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white">
                                                                <option value="30">30 min</option>
                                                                <option value="45">45 min</option>
                                                                <option value="60">60 min</option>
                                                                <option value="90">90 min</option>
                                                                <option value="120">2 hours</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    {availableSlots.length > 0 ? (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Teacher Available Slots</label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {availableSlots.map((slot) => (
                                                                    <button key={slot} onClick={() => setNewSession({ ...newSession, startTime: slot })}
                                                                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${newSession.startTime === slot ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{slot}</button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="p-4 bg-amber-50 rounded-xl text-amber-700 text-sm">
                                                            <p>No availability set for this day. You can still schedule manually:</p>
                                                            <input type="time" value={newSession.startTime} onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })} className="mt-2 px-4 py-2 rounded-xl border border-amber-200" />
                                                        </div>
                                                    )}
                                                    <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-red-200 cursor-pointer">
                                                        <input type="checkbox" checked={newSession.recurring} onChange={(e) => setNewSession({ ...newSession, recurring: e.target.checked })} className="w-5 h-5 rounded text-red-500" />
                                                        <div>
                                                            <p className="font-medium text-gray-900">Recurring Session</p>
                                                            <p className="text-sm text-gray-500">Repeat this session weekly</p>
                                                        </div>
                                                    </label>
                                                    {newSession.recurring && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {daysOfWeek.map((day, idx) => (
                                                                <button key={day} onClick={() => {
                                                                    const days = newSession.recurringDays.includes(idx)
                                                                        ? newSession.recurringDays.filter(d => d !== idx)
                                                                        : [...newSession.recurringDays, idx];
                                                                    setNewSession({ ...newSession, recurringDays: days });
                                                                }}
                                                                    className={`w-10 h-10 rounded-xl font-medium text-sm ${newSession.recurringDays.includes(idx) ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}>{day}</button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {modalStep === 3 && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm text-gray-600">{newSession.invitedStudents.length} students selected</p>
                                                        <button onClick={selectAllStudents} className="text-sm text-red-500 hover:text-red-600 font-medium">Select All</button>
                                                    </div>
                                                    <div className="relative">
                                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <input type="text" placeholder="Search students..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200" />
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto space-y-2">
                                                        {courseStudents.map((student) => (
                                                            <label key={student.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${newSession.invitedStudents.includes(student.id) ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                                                <input type="checkbox" checked={newSession.invitedStudents.includes(student.id)} onChange={() => toggleStudent(student.id)} className="w-5 h-5 rounded text-red-500" />
                                                                <img src={student.avatar} alt="" className="w-10 h-10 rounded-xl" />
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-gray-900">{student.name}</p>
                                                                    <p className="text-xs text-gray-500">{student.email}</p>
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between p-6 border-t border-gray-100">
                                            <button onClick={() => setModalStep(Math.max(1, modalStep - 1))} disabled={modalStep === 1} className="px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium disabled:opacity-50">Back</button>
                                            {modalStep < 3 ? (
                                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setModalStep(modalStep + 1)}
                                                    disabled={(modalStep === 1 && (!newSession.title || !newSession.teacherId || !newSession.courseId)) || (modalStep === 2 && !newSession.date)}
                                                    className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium shadow-lg disabled:opacity-50">Next</motion.button>
                                            ) : (
                                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCreateSession}
                                                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium shadow-lg">
                                                    <Video className="w-5 h-5" /> Create Session
                                                </motion.button>
                                            )}
                                        </div>
                                    </>
                                ) : selectedSession && (
                                    /* Session Details View */
                                    <>
                                        <div className="relative">
                                            <div className="h-24 rounded-t-3xl" style={{ backgroundColor: selectedSession.color }} />
                                            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white"><X className="w-5 h-5" /></button>
                                            <div className="absolute -bottom-6 left-6">
                                                <img src={selectedSession.teacherAvatar} alt="" className="w-16 h-16 rounded-xl border-4 border-white shadow-lg" />
                                            </div>
                                        </div>
                                        <div className="pt-10 px-6 pb-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-900">{selectedSession.title}</h2>
                                                    <p className="text-gray-500">{selectedSession.teacherName} • {selectedSession.courseName}</p>
                                                    <p className="text-sm text-gray-400">{selectedSession.batchName}</p>
                                                </div>
                                                {selectedSession.status === 'live' && (
                                                    <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Live Now
                                                    </span>
                                                )}
                                            </div>
                                            {selectedSession.description && <p className="text-sm text-gray-600 mb-4">{selectedSession.description}</p>}
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="p-3 bg-gray-50 rounded-xl">
                                                    <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                                                    <p className="font-medium text-gray-900">{selectedSession.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                                    <p className="text-sm text-gray-600">{selectedSession.startTime} - {selectedSession.endTime}</p>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-xl">
                                                    <p className="text-xs text-gray-500 mb-1">Students Invited</p>
                                                    <p className="font-medium text-gray-900">{selectedSession.invitedStudents.length}</p>
                                                    <p className="text-sm text-gray-600">Max: {selectedSession.maxAttendees}</p>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-xl mb-4">
                                                <p className="text-xs text-gray-500 mb-2">Google Meet Link</p>
                                                <div className="flex items-center gap-2">
                                                    <input type="text" value={selectedSession.meetLink} readOnly className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-600" />
                                                    <button onClick={() => copyMeetLink(selectedSession.meetLink)} className="p-2 rounded-lg hover:bg-gray-200">
                                                        {copiedLink ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-500" />}
                                                    </button>
                                                    <a href={selectedSession.meetLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-gray-200">
                                                        <ExternalLink className="w-5 h-5 text-gray-500" />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <motion.button whileTap={{ scale: 0.98 }} onClick={() => deleteSession(selectedSession.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl font-medium">
                                                    <Trash2 className="w-4 h-4" /> Delete
                                                </motion.button>
                                                <Link href={`/admin/live-sessions/${selectedSession.id}`} className="flex-1">
                                                    <motion.button whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium">
                                                        <Users className="w-4 h-4" /> Attendance
                                                    </motion.button>
                                                </Link>
                                                <motion.a href={selectedSession.meetLink} target="_blank" rel="noopener noreferrer" whileTap={{ scale: 0.98 }}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium shadow-lg">
                                                    <Video className="w-4 h-4" /> Join
                                                </motion.a>
                                            </div>
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
