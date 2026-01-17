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
    Users,
    Loader2
} from 'lucide-react';
import AddStudentModal from '../../../components/admin/AddStudentModal';
import { UserAvatar } from '@/app/components/shared/UserAvatar';
import { useStudents } from '@/hooks/useStudents';

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

const levelColors: Record<string, string> = {
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

    // Use real data from hook
    const { students: rawStudents, isLoading, error, refetch, deleteStudent, createStudent } = useStudents(
        selectedLevel !== 'all' || searchQuery
            ? {
                level: selectedLevel !== 'all' ? selectedLevel as 'primary' | 'preparatory' | 'secondary' : undefined,
                search: searchQuery || undefined,
            }
            : undefined
    );

    // Handler for adding new student
    const handleAddStudent = async (data: { name: string; email: string; phone: string; level: string; parentPhone: string }) => {
        const result = await createStudent({
            name: data.name,
            email: data.email,
            phone: data.phone,
            level: data.level as 'primary' | 'preparatory' | 'secondary',
            parentPhone: data.parentPhone,
        });
        return result;
    };

    // Transform data to match UI structure
    const studentsData = rawStudents.map(s => ({
        id: s.id,
        name: s.profile?.full_name || 'Unknown',
        email: s.profile?.email || '',
        phone: s.profile?.phone || '',
        avatar: s.profile?.avatar_url,
        level: s.level ? s.level.charAt(0).toUpperCase() + s.level.slice(1) : 'Unknown',
        levelId: s.level || 'primary',
        enrolledCourses: 0, // Would need separate query
        enrollmentDate: s.profile?.created_at || '',
        status: 'active',
        parentName: '',
        parentPhone: s.parent_phone || '',
    }));

    // Filter students (handled by hook)
    const filteredStudents = studentsData;

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

    // Delete single student
    const handleDeleteStudent = async (id: string) => {
        if (confirm('Are you sure you want to delete this student?')) {
            const result = await deleteStudent(id);
            if (!result.success) {
                alert(result.error || 'Failed to delete student');
            }
        }
    };

    // Bulk delete students
    const handleBulkDelete = async () => {
        if (confirm(`Are you sure you want to delete ${selectedStudents.length} students?`)) {
            for (const id of selectedStudents) {
                await deleteStudent(id);
            }
            setSelectedStudents([]);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={refetch}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"
                >
                    Try Again
                </button>
            </div>
        );
    }

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
                            <button
                                onClick={handleBulkDelete}
                                className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                            >
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
                                                <UserAvatar
                                                    src={student.avatar}
                                                    name={student.name}
                                                    className="w-10 h-10 rounded-full"
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
                                                onClick={() => handleDeleteStudent(student.id)}
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
            <AddStudentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddStudent} />
        </div>
    );
}
