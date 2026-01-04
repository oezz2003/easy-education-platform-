'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    Filter,
    Plus,
    Mail,
    Phone,
    ChevronLeft,
    ChevronRight,
    Download,
    Trash2,
    Eye,
    Edit,
    GraduationCap,
    Users,
    BookOpen,
    Star
} from 'lucide-react';
import AddTeacherModal from '../../../components/admin/AddTeacherModal';

// Mock teachers data
const mockTeachers = [
    {
        id: '1',
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@email.com',
        phone: '+20 123 456 7890',
        avatar: 'https://i.pravatar.cc/150?img=11',
        subject: 'Mathematics',
        subjectIcon: '/ASSITS/calc.png',
        level: 'All Levels',
        coursesCount: 8,
        studentsCount: 450,
        rating: 4.9,
        joinDate: '2023-06-15',
        status: 'active',
        bio: 'Senior Mathematics instructor with 10+ years of experience.',
    },
    {
        id: '2',
        name: 'Sara Ali',
        email: 'sara.ali@email.com',
        phone: '+20 100 200 3000',
        avatar: 'https://i.pravatar.cc/150?img=5',
        subject: 'Physics',
        subjectIcon: '/ASSITS/chemstry.png',
        level: 'Secondary',
        coursesCount: 5,
        studentsCount: 280,
        rating: 4.8,
        joinDate: '2023-09-20',
        status: 'active',
        bio: 'Physics specialist focusing on practical experiments.',
    },
    {
        id: '3',
        name: 'Mohamed Farid',
        email: 'mohamed.f@email.com',
        phone: '+20 150 250 3500',
        avatar: 'https://i.pravatar.cc/150?img=12',
        subject: 'English',
        subjectIcon: '/ASSITS/text bubble.png',
        level: 'Primary',
        coursesCount: 6,
        studentsCount: 520,
        rating: 4.7,
        joinDate: '2023-04-10',
        status: 'active',
        bio: 'English language expert with IELTS certification.',
    },
    {
        id: '4',
        name: 'Fatma Nour',
        email: 'fatma.n@email.com',
        phone: '+20 180 280 3800',
        avatar: 'https://i.pravatar.cc/150?img=9',
        subject: 'Chemistry',
        subjectIcon: '/ASSITS/chemstry.png',
        level: 'Preparatory',
        coursesCount: 4,
        studentsCount: 180,
        rating: 4.9,
        joinDate: '2024-01-05',
        status: 'inactive',
        bio: 'Chemistry teacher with lab management experience.',
    },
    {
        id: '5',
        name: 'Khaled Ibrahim',
        email: 'khaled.i@email.com',
        phone: '+20 190 290 3900',
        avatar: 'https://i.pravatar.cc/150?img=15',
        subject: 'Geography',
        subjectIcon: '/ASSITS/global.png',
        level: 'Preparatory',
        coursesCount: 3,
        studentsCount: 150,
        rating: 4.6,
        joinDate: '2024-02-15',
        status: 'active',
        bio: 'Geography and earth sciences enthusiast.',
    },
];

const subjects = [
    { id: 'all', name: 'All Subjects' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'english', name: 'English' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'geography', name: 'Geography' },
];

const statusColors = {
    active: 'bg-blue-100 text-blue-700',
    inactive: 'bg-gray-100 text-gray-600',
};

export default function TeachersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter teachers
    const filteredTeachers = mockTeachers.filter((teacher) => {
        const matchesSearch =
            teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = selectedSubject === 'all' || teacher.subject.toLowerCase() === selectedSubject;
        return matchesSearch && matchesSubject;
    });

    // Pagination
    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
    const paginatedTeachers = filteredTeachers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleSelectAll = () => {
        if (selectedTeachers.length === paginatedTeachers.length) {
            setSelectedTeachers([]);
        } else {
            setSelectedTeachers(paginatedTeachers.map((t) => t.id));
        }
    };

    const toggleSelectTeacher = (id: string) => {
        setSelectedTeachers((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
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
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <img
                            src="/login-signup assits/teacher.png"
                            alt="Teachers"
                            loading="lazy"
                            className="w-14 h-14 object-contain"
                        />
                    </motion.div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Teachers Management
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {filteredTeachers.length} teachers total
                        </p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Teacher
                </motion.button>
            </motion.div>

            {/* Filters Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
            >
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search teachers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Subject Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                        >
                            {subjects.map((subject) => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Bulk Actions */}
                    {selectedTeachers.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2"
                        >
                            <span className="text-sm text-gray-500">
                                {selectedTeachers.length} selected
                            </span>
                            <button className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
                                <Download className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Teachers Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedTeachers.length === paginatedTeachers.length && paginatedTeachers.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                                    />
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Teacher
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">
                                    Subject
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden lg:table-cell">
                                    Students
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden lg:table-cell">
                                    Courses
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">
                                    Rating
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedTeachers.map((teacher, index) => (
                                <motion.tr
                                    key={teacher.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedTeachers.includes(teacher.id)}
                                            onChange={() => toggleSelectTeacher(teacher.id)}
                                            className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/admin/teachers/${teacher.id}`}>
                                            <div className="flex items-center gap-3 group">
                                                <img
                                                    src={teacher.avatar}
                                                    alt={teacher.name}
                                                    loading="lazy"
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-900 group-hover:text-blue-500 transition-colors">
                                                        {teacher.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {teacher.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={teacher.subjectIcon}
                                                alt=""
                                                loading="lazy"
                                                className="w-6 h-6 object-contain"
                                            />
                                            <span className="text-gray-900">{teacher.subject}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-900">{teacher.studentsCount}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-900">{teacher.coursesCount}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            <span className="font-medium text-gray-900">{teacher.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[teacher.status as keyof typeof statusColors]
                                                }`}
                                        >
                                            {teacher.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/teachers/${teacher.id}`}>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </motion.button>
                                            </Link>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-100 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                            {Math.min(currentPage * itemsPerPage, filteredTeachers.length)} of{' '}
                            {filteredTeachers.length} teachers
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page
                                        ? 'bg-blue-500 text-white'
                                        : 'border border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredTeachers.length === 0 && (
                    <div className="text-center py-16">
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No teachers found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedSubject('all');
                            }}
                            className="text-blue-500 hover:text-blue-600 font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Add Teacher Modal */}
            <AddTeacherModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </div>
    );
}
