'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    BookOpen,
    Plus,
    Search,
    Filter,
    Users,
    GraduationCap,
    Calendar,
    Clock,
    ChevronRight,
    X,
    Edit,
    Trash2,
    Eye,
    Video,
    Star,
    MoreVertical,
    Copy,
    UserPlus
} from 'lucide-react';

// Types
interface Teacher {
    id: string;
    name: string;
    avatar: string;
    subject: string;
}

interface Student {
    id: string;
    name: string;
    avatar: string;
    email: string;
}

interface Batch {
    id: string;
    name: string;
    teacherId: string;
    teacherName: string;
    teacherAvatar: string;
    startDate: Date;
    endDate: Date;
    schedule: string;
    maxStudents: number;
    enrolledStudents: string[];
    sessionsCount: number;
    completedSessions: number;
    status: 'upcoming' | 'active' | 'completed';
}

interface Course {
    id: string;
    name: string;
    description: string;
    subject: string;
    level: string;
    thumbnail: string;
    price: number;
    duration: string;
    batches: Batch[];
}

// Mock data
const teachers: Teacher[] = [
    { id: '1', name: 'Ahmed Hassan', avatar: 'https://i.pravatar.cc/150?img=11', subject: 'Mathematics' },
    { id: '2', name: 'Sara Ali', avatar: 'https://i.pravatar.cc/150?img=5', subject: 'Physics' },
    { id: '3', name: 'Mohamed Farid', avatar: 'https://i.pravatar.cc/150?img=12', subject: 'English' },
    { id: '4', name: 'Fatma Nour', avatar: 'https://i.pravatar.cc/150?img=9', subject: 'Chemistry' },
];

const allStudents: Student[] = [
    { id: 's1', name: 'Omar Khaled', avatar: 'https://i.pravatar.cc/150?img=1', email: 'omar@edu.com' },
    { id: 's2', name: 'Fatma Ahmed', avatar: 'https://i.pravatar.cc/150?img=2', email: 'fatma@edu.com' },
    { id: 's3', name: 'Youssef Ibrahim', avatar: 'https://i.pravatar.cc/150?img=3', email: 'youssef@edu.com' },
    { id: 's4', name: 'Sara Mohamed', avatar: 'https://i.pravatar.cc/150?img=4', email: 'sara@edu.com' },
    { id: 's5', name: 'Ali Hassan', avatar: 'https://i.pravatar.cc/150?img=5', email: 'ali@edu.com' },
    { id: 's6', name: 'Laila Nour', avatar: 'https://i.pravatar.cc/150?img=6', email: 'laila@edu.com' },
    { id: 's7', name: 'Mohamed Salem', avatar: 'https://i.pravatar.cc/150?img=7', email: 'msalem@edu.com' },
    { id: 's8', name: 'Nadia Karim', avatar: 'https://i.pravatar.cc/150?img=8', email: 'nadia@edu.com' },
    { id: 's9', name: 'Khaled Farid', avatar: 'https://i.pravatar.cc/150?img=9', email: 'khaled@edu.com' },
    { id: 's10', name: 'Mona Ali', avatar: 'https://i.pravatar.cc/150?img=10', email: 'mona@edu.com' },
];

const initialCourses: Course[] = [
    {
        id: '1',
        name: 'Advanced Mathematics',
        description: 'Master algebra, calculus, and geometry with comprehensive lessons and practice problems.',
        subject: 'Mathematics',
        level: 'Advanced',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
        price: 199,
        duration: '12 weeks',
        batches: [
            { id: 'b1', name: 'Batch 2026-A', teacherId: '1', teacherName: 'Ahmed Hassan', teacherAvatar: 'https://i.pravatar.cc/150?img=11', startDate: new Date(2026, 0, 1), endDate: new Date(2026, 2, 31), schedule: 'Mon, Wed, Fri @ 9:00 AM', maxStudents: 30, enrolledStudents: ['s1', 's2', 's3', 's4', 's5'], sessionsCount: 36, completedSessions: 8, status: 'active' },
            { id: 'b2', name: 'Batch 2026-B', teacherId: '1', teacherName: 'Ahmed Hassan', teacherAvatar: 'https://i.pravatar.cc/150?img=11', startDate: new Date(2026, 1, 1), endDate: new Date(2026, 3, 30), schedule: 'Tue, Thu @ 2:00 PM', maxStudents: 25, enrolledStudents: ['s6', 's7', 's8'], sessionsCount: 24, completedSessions: 0, status: 'upcoming' },
        ],
    },
    {
        id: '2',
        name: 'Physics Fundamentals',
        description: 'Explore the laws of physics from mechanics to electromagnetism with hands-on experiments.',
        subject: 'Physics',
        level: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400',
        price: 179,
        duration: '10 weeks',
        batches: [
            { id: 'b3', name: 'Batch 2026-A', teacherId: '2', teacherName: 'Sara Ali', teacherAvatar: 'https://i.pravatar.cc/150?img=5', startDate: new Date(2026, 0, 5), endDate: new Date(2026, 2, 15), schedule: 'Mon, Wed @ 11:00 AM', maxStudents: 20, enrolledStudents: ['s2', 's3', 's6', 's7'], sessionsCount: 20, completedSessions: 6, status: 'active' },
        ],
    },
    {
        id: '3',
        name: 'English Grammar Mastery',
        description: 'Perfect your English grammar skills with comprehensive lessons and writing practice.',
        subject: 'English',
        level: 'Beginner',
        thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
        price: 149,
        duration: '8 weeks',
        batches: [
            { id: 'b4', name: 'Batch 2026-A', teacherId: '3', teacherName: 'Mohamed Farid', teacherAvatar: 'https://i.pravatar.cc/150?img=12', startDate: new Date(2026, 0, 10), endDate: new Date(2026, 2, 5), schedule: 'Tue, Thu @ 10:00 AM', maxStudents: 25, enrolledStudents: ['s1', 's4', 's5', 's8'], sessionsCount: 16, completedSessions: 4, status: 'active' },
        ],
    },
    {
        id: '4',
        name: 'Chemistry Lab',
        description: 'Learn chemistry through virtual lab experiments and real-world applications.',
        subject: 'Chemistry',
        level: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
        price: 169,
        duration: '10 weeks',
        batches: [
            { id: 'b5', name: 'Batch 2026-A', teacherId: '4', teacherName: 'Fatma Nour', teacherAvatar: 'https://i.pravatar.cc/150?img=9', startDate: new Date(2025, 10, 1), endDate: new Date(2026, 0, 10), schedule: 'Wed, Fri @ 3:00 PM', maxStudents: 15, enrolledStudents: ['s3', 's6', 's9', 's10'], sessionsCount: 20, completedSessions: 20, status: 'completed' },
        ],
    },
];

const subjects = ['All', 'Mathematics', 'Physics', 'English', 'Chemistry'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSubject, setFilterSubject] = useState('All');
    const [filterLevel, setFilterLevel] = useState('All');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'course' | 'batch' | 'enroll'>('course');
    const [studentSearch, setStudentSearch] = useState('');

    // Forms
    const [newBatch, setNewBatch] = useState({
        name: '',
        teacherId: '',
        startDate: '',
        endDate: '',
        schedule: '',
        maxStudents: 30,
    });

    const [enrollStudents, setEnrollStudents] = useState<string[]>([]);

    // Filter courses
    const filteredCourses = courses.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = filterSubject === 'All' || c.subject === filterSubject;
        const matchesLevel = filterLevel === 'All' || c.level === filterLevel;
        return matchesSearch && matchesSubject && matchesLevel;
    });

    // Open modals
    const openBatchModal = (course: Course) => {
        setSelectedCourse(course);
        setModalType('batch');
        setNewBatch({ name: '', teacherId: '', startDate: '', endDate: '', schedule: '', maxStudents: 30 });
        setIsModalOpen(true);
    };

    const openEnrollModal = (course: Course, batch: Batch) => {
        setSelectedCourse(course);
        setSelectedBatch(batch);
        setModalType('enroll');
        setEnrollStudents([...batch.enrolledStudents]);
        setIsModalOpen(true);
    };

    const openBatchDetails = (course: Course, batch: Batch) => {
        setSelectedCourse(course);
        setSelectedBatch(batch);
        setModalType('course');
        setIsModalOpen(true);
    };

    // Create batch
    const createBatch = () => {
        if (!selectedCourse || !newBatch.name || !newBatch.teacherId) return;
        const teacher = teachers.find(t => t.id === newBatch.teacherId);
        if (!teacher) return;

        const batch: Batch = {
            id: Date.now().toString(),
            name: newBatch.name,
            teacherId: teacher.id,
            teacherName: teacher.name,
            teacherAvatar: teacher.avatar,
            startDate: new Date(newBatch.startDate),
            endDate: new Date(newBatch.endDate),
            schedule: newBatch.schedule,
            maxStudents: newBatch.maxStudents,
            enrolledStudents: [],
            sessionsCount: 0,
            completedSessions: 0,
            status: 'upcoming',
        };

        setCourses(courses.map(c =>
            c.id === selectedCourse.id ? { ...c, batches: [...c.batches, batch] } : c
        ));
        setIsModalOpen(false);
    };

    // Enroll students
    const toggleStudentEnrollment = (studentId: string) => {
        if (enrollStudents.includes(studentId)) {
            setEnrollStudents(enrollStudents.filter(id => id !== studentId));
        } else {
            setEnrollStudents([...enrollStudents, studentId]);
        }
    };

    const saveEnrollment = () => {
        if (!selectedCourse || !selectedBatch) return;
        setCourses(courses.map(c =>
            c.id === selectedCourse.id ? {
                ...c,
                batches: c.batches.map(b =>
                    b.id === selectedBatch.id ? { ...b, enrolledStudents: enrollStudents } : b
                )
            } : c
        ));
        setIsModalOpen(false);
    };

    // Get total stats
    const totalBatches = courses.reduce((acc, c) => acc + c.batches.length, 0);
    const totalEnrolled = courses.reduce((acc, c) => acc + c.batches.reduce((a, b) => a + b.enrolledStudents.length, 0), 0);
    const activeBatches = courses.reduce((acc, c) => acc + c.batches.filter(b => b.status === 'active').length, 0);

    const filteredStudents = allStudents.filter(s =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(studentSearch.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'emerald';
            case 'upcoming': return 'blue';
            case 'completed': return 'gray';
            default: return 'gray';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Courses & Batches</h1>
                        <p className="text-gray-500 text-sm">Manage courses, create batches, and enroll students</p>
                    </div>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg">
                    <Plus className="w-5 h-5" /> New Course
                </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Courses', value: courses.length, color: 'purple', icon: BookOpen },
                    { label: 'Total Batches', value: totalBatches, color: 'blue', icon: Copy },
                    { label: 'Active Batches', value: activeBatches, color: 'emerald', icon: Video },
                    { label: 'Total Enrolled', value: totalEnrolled, color: 'amber', icon: Users },
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400" />
                </div>
                <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm">
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm">
                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
            </motion.div>

            {/* Courses Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {filteredCourses.map((course, idx) => (
                    <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        {/* Course Header */}
                        <div className="relative h-40">
                            <img src={course.thumbnail} alt={course.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-xl font-bold text-white">{course.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-white/20 text-white rounded text-xs">{course.subject}</span>
                                    <span className="px-2 py-0.5 bg-white/20 text-white rounded text-xs">{course.level}</span>
                                    <span className="px-2 py-0.5 bg-white/20 text-white rounded text-xs">{course.duration}</span>
                                </div>
                            </div>
                            <div className="absolute top-4 right-4 bg-white rounded-lg px-2 py-1">
                                <span className="font-bold text-purple-600">${course.price}</span>
                            </div>
                        </div>

                        {/* Course Info */}
                        <div className="p-4">
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">{course.description}</p>

                            {/* Batches Section */}
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-900">Batches ({course.batches.length})</h4>
                                <button onClick={() => openBatchModal(course)} className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium">
                                    <Plus className="w-4 h-4" /> Add Batch
                                </button>
                            </div>

                            {/* Batches List */}
                            <div className="space-y-2">
                                {course.batches.map((batch) => (
                                    <div key={batch.id} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img src={batch.teacherAvatar} alt="" className="w-8 h-8 rounded-lg" />
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">{batch.name}</p>
                                                    <p className="text-xs text-gray-500">{batch.teacherName} • {batch.schedule}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 bg-${getStatusColor(batch.status)}-100 text-${getStatusColor(batch.status)}-700 rounded-full text-xs font-medium capitalize`}>
                                                    {batch.status}
                                                </span>
                                                <span className="text-xs text-gray-500">{batch.enrolledStudents.length}/{batch.maxStudents}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button onClick={() => openBatchDetails(course, batch)} className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                                                <Eye className="w-3.5 h-3.5 inline mr-1" /> View
                                            </button>
                                            <button onClick={() => openEnrollModal(course, batch)} className="flex-1 px-3 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                                <UserPlus className="w-3.5 h-3.5 inline mr-1" /> Enroll
                                            </button>
                                            <Link href={`/admin/live-sessions?course=${course.id}&batch=${batch.id}`} className="flex-1">
                                                <button className="w-full px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Video className="w-3.5 h-3.5 inline mr-1" /> Sessions
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                {course.batches.length === 0 && (
                                    <p className="text-center text-gray-400 py-4 text-sm">No batches yet</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto">

                                {/* Create Batch Modal */}
                                {modalType === 'batch' && selectedCourse && (
                                    <>
                                        <div className="p-6 border-b border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-900">Create New Batch</h2>
                                                    <p className="text-sm text-gray-500">{selectedCourse.name}</p>
                                                </div>
                                                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Batch Name *</label>
                                                <input type="text" value={newBatch.name} onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })} placeholder="e.g. Batch 2026-C" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Teacher *</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {teachers.map((teacher) => (
                                                        <button key={teacher.id} onClick={() => setNewBatch({ ...newBatch, teacherId: teacher.id })}
                                                            className={`p-3 rounded-xl border-2 text-left transition-all ${newBatch.teacherId === teacher.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                                            <div className="flex items-center gap-2">
                                                                <img src={teacher.avatar} alt="" className="w-8 h-8 rounded-lg" />
                                                                <div>
                                                                    <p className="font-medium text-gray-900 text-sm">{teacher.name}</p>
                                                                    <p className="text-xs text-gray-500">{teacher.subject}</p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                                    <input type="date" value={newBatch.startDate} onChange={(e) => setNewBatch({ ...newBatch, startDate: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                                    <input type="date" value={newBatch.endDate} onChange={(e) => setNewBatch({ ...newBatch, endDate: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                                                <input type="text" value={newBatch.schedule} onChange={(e) => setNewBatch({ ...newBatch, schedule: e.target.value })} placeholder="e.g. Mon, Wed, Fri @ 10:00 AM" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Max Students</label>
                                                <input type="number" value={newBatch.maxStudents} onChange={(e) => setNewBatch({ ...newBatch, maxStudents: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium">Cancel</button>
                                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={createBatch} className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg">Create Batch</motion.button>
                                        </div>
                                    </>
                                )}

                                {/* Enroll Students Modal */}
                                {modalType === 'enroll' && selectedCourse && selectedBatch && (
                                    <>
                                        <div className="p-6 border-b border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-900">Enroll Students</h2>
                                                    <p className="text-sm text-gray-500">{selectedCourse.name} - {selectedBatch.name}</p>
                                                </div>
                                                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-600">{enrollStudents.length} / {selectedBatch.maxStudents} students</p>
                                                <button onClick={() => setEnrollStudents(allStudents.slice(0, selectedBatch.maxStudents).map(s => s.id))} className="text-sm text-purple-600 font-medium">Select All</button>
                                            </div>
                                            <div className="relative">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input type="text" placeholder="Search students..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200" />
                                            </div>
                                            <div className="max-h-60 overflow-y-auto space-y-2">
                                                {filteredStudents.map((student) => (
                                                    <label key={student.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${enrollStudents.includes(student.id) ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                                        <input type="checkbox" checked={enrollStudents.includes(student.id)} onChange={() => toggleStudentEnrollment(student.id)} disabled={!enrollStudents.includes(student.id) && enrollStudents.length >= selectedBatch.maxStudents} className="w-5 h-5 rounded text-purple-500" />
                                                        <img src={student.avatar} alt="" className="w-10 h-10 rounded-xl" />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">{student.name}</p>
                                                            <p className="text-xs text-gray-500">{student.email}</p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium">Cancel</button>
                                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveEnrollment} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg">
                                                <UserPlus className="w-5 h-5" /> Save Enrollment
                                            </motion.button>
                                        </div>
                                    </>
                                )}

                                {/* Batch Details Modal */}
                                {modalType === 'course' && selectedCourse && selectedBatch && (
                                    <>
                                        <div className="relative">
                                            <img src={selectedCourse.thumbnail} alt="" className="w-full h-32 object-cover rounded-t-3xl" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-3xl" />
                                            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white"><X className="w-5 h-5" /></button>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-900">{selectedBatch.name}</h2>
                                                    <p className="text-gray-500">{selectedCourse.name}</p>
                                                </div>
                                                <span className={`px-3 py-1 bg-${getStatusColor(selectedBatch.status)}-100 text-${getStatusColor(selectedBatch.status)}-700 rounded-full text-sm font-medium capitalize`}>
                                                    {selectedBatch.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                                                <img src={selectedBatch.teacherAvatar} alt="" className="w-12 h-12 rounded-xl" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">{selectedBatch.teacherName}</p>
                                                    <p className="text-sm text-gray-500">Instructor</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="p-3 bg-gray-50 rounded-xl">
                                                    <p className="text-xs text-gray-500">Schedule</p>
                                                    <p className="font-medium text-gray-900">{selectedBatch.schedule}</p>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-xl">
                                                    <p className="text-xs text-gray-500">Duration</p>
                                                    <p className="font-medium text-gray-900">{selectedBatch.startDate.toLocaleDateString()} - {selectedBatch.endDate.toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="p-3 bg-gray-50 rounded-xl">
                                                    <p className="text-xs text-gray-500">Sessions</p>
                                                    <p className="font-medium text-gray-900">{selectedBatch.completedSessions} / {selectedBatch.sessionsCount}</p>
                                                    <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(selectedBatch.completedSessions / selectedBatch.sessionsCount) * 100}%` }} />
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-xl">
                                                    <p className="text-xs text-gray-500">Enrollment</p>
                                                    <p className="font-medium text-gray-900">{selectedBatch.enrolledStudents.length} / {selectedBatch.maxStudents}</p>
                                                    <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(selectedBatch.enrolledStudents.length / selectedBatch.maxStudents) * 100}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 mb-2">Enrolled Students ({selectedBatch.enrolledStudents.length})</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedBatch.enrolledStudents.slice(0, 6).map((studentId) => {
                                                        const student = allStudents.find(s => s.id === studentId);
                                                        return student ? (
                                                            <img key={studentId} src={student.avatar} alt={student.name} title={student.name} className="w-10 h-10 rounded-xl border-2 border-white shadow" />
                                                        ) : null;
                                                    })}
                                                    {selectedBatch.enrolledStudents.length > 6 && (
                                                        <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                                                            +{selectedBatch.enrolledStudents.length - 6}
                                                        </div>
                                                    )}
                                                </div>
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
