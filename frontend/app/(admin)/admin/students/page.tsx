'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Mail,
    Phone,
    ChevronLeft,
    ChevronRight,
    Download,
    Trash2,
    Eye,
    Edit,
    GraduationCap,
    Users
} from 'lucide-react';
import AddStudentModal from '../../../components/admin/AddStudentModal';

// Mock students data
const mockStudents = [
    {
        id: '1',
        name: 'Ahmed Mohamed',
        email: 'ahmed.m@email.com',
        phone: '+20 123 456 7890',
        avatar: 'https://i.pravatar.cc/150?img=11',
        level: 'Primary',
        levelId: 'primary',
        enrolledCourses: 5,
        enrollmentDate: '2024-01-15',
        status: 'active',
        parentName: 'Mohamed Hassan',
        parentPhone: '+20 111 222 3333',
    },
    {
        id: '2',
        name: 'Sara Ali',
        email: 'sara.ali@email.com',
        phone: '+20 100 200 3000',
        avatar: 'https://i.pravatar.cc/150?img=5',
        level: 'Preparatory',
        levelId: 'preparatory',
        enrolledCourses: 3,
        enrollmentDate: '2024-02-20',
        status: 'active',
        parentName: 'Ali Ibrahim',
        parentPhone: '+20 111 333 4444',
    },
    {
        id: '3',
        name: 'Omar Khaled',
        email: 'omar.k@email.com',
        phone: '+20 150 250 3500',
        avatar: 'https://i.pravatar.cc/150?img=12',
        level: 'Secondary',
        levelId: 'secondary',
        enrolledCourses: 7,
        enrollmentDate: '2024-03-10',
        status: 'active',
        parentName: 'Khaled Ahmed',
        parentPhone: '+20 155 266 3777',
    },
    {
        id: '4',
        name: 'Fatma Nour',
        email: 'fatma.n@email.com',
        phone: '+20 180 280 3800',
        avatar: 'https://i.pravatar.cc/150?img=9',
        level: 'Primary',
        levelId: 'primary',
        enrolledCourses: 4,
        enrollmentDate: '2024-01-25',
        status: 'inactive',
        parentName: 'Nour Salah',
        parentPhone: '+20 166 277 3888',
    },
    {
        id: '5',
        name: 'Youssef Ibrahim',
        email: 'youssef.i@email.com',
        phone: '+20 190 290 3900',
        avatar: 'https://i.pravatar.cc/150?img=15',
        level: 'Preparatory',
        levelId: 'preparatory',
        enrolledCourses: 6,
        enrollmentDate: '2024-04-05',
        status: 'active',
        parentName: 'Ibrahim Mahmoud',
        parentPhone: '+20 177 288 3999',
    },
    {
        id: '6',
        name: 'Laila Hassan',
        email: 'laila.h@email.com',
        phone: '+20 195 295 3950',
        avatar: 'https://i.pravatar.cc/150?img=20',
        level: 'Secondary',
        levelId: 'secondary',
        enrolledCourses: 8,
        enrollmentDate: '2024-05-12',
        status: 'active',
        parentName: 'Hassan Farid',
        parentPhone: '+20 188 299 3111',
    },
];

const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'primary', name: 'Primary' },
    { id: 'preparatory', name: 'Preparatory' },
    { id: 'secondary', name: 'Secondary' },
];

const statusColors = {
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-gray-100 text-gray-600',
};

const levelColors = {
    primary: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    preparatory: 'bg-blue-50 text-blue-600 border-blue-200',
    secondary: 'bg-purple-50 text-purple-600 border-purple-200',
};

export default function StudentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter students
    const filteredStudents = mockStudents.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = selectedLevel === 'all' || student.levelId === selectedLevel;
        return matchesSearch && matchesLevel;
    });

    // Pagination
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const paginatedStudents = filteredStudents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleSelectAll = () => {
        if (selectedStudents.length === paginatedStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(paginatedStudents.map((s) => s.id));
        }
    };

    const toggleSelectStudent = (id: string) => {
        setSelectedStudents((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
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
                            src="/login-signup assits/student.png"
                            alt="Students"
                            loading="lazy"
                            className="w-14 h-14 object-contain"
                        />
                    </motion.div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Students Management
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {filteredStudents.length} students total
                        </p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Student
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
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Level Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white"
                        >
                            {levels.map((level) => (
                                <option key={level.id} value={level.id}>
                                    {level.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Bulk Actions */}
                    {selectedStudents.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2"
                        >
                            <span className="text-sm text-gray-500">
                                {selectedStudents.length} selected
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

            {/* Students Table */}
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
                                        checked={selectedStudents.length === paginatedStudents.length && paginatedStudents.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-400"
                                    />
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Student
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">
                                    Contact
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Level
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden lg:table-cell">
                                    Courses
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden lg:table-cell">
                                    Enrolled
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
                            {paginatedStudents.map((student, index) => (
                                <motion.tr
                                    key={student.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.includes(student.id)}
                                            onChange={() => toggleSelectStudent(student.id)}
                                            className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-400"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/admin/students/${student.id}`}>
                                            <div className="flex items-center gap-3 group">
                                                <img
                                                    src={student.avatar}
                                                    alt={student.name}
                                                    loading="lazy"
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-900 group-hover:text-emerald-500 transition-colors">
                                                        {student.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 md:hidden">
                                                        {student.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-4 h-4" />
                                                {student.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Phone className="w-4 h-4" />
                                                {student.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${levelColors[student.levelId as keyof typeof levelColors]
                                                }`}
                                        >
                                            {student.level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-900">{student.enrolledCourses}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                        <span className="text-sm text-gray-600">
                                            {new Date(student.enrollmentDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[student.status as keyof typeof statusColors]
                                                }`}
                                        >
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/students/${student.id}`}>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-2 rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-100 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </motion.button>
                                            </Link>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
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
                            {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of{' '}
                            {filteredStudents.length} students
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
                                        ? 'bg-emerald-500 text-white'
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
                {filteredStudents.length === 0 && (
                    <div className="text-center py-16">
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedLevel('all');
                            }}
                            className="text-emerald-500 hover:text-emerald-600 font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Add Student Modal */}
            <AddStudentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </div>
    );
}
