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
    Star,
    Loader2
} from 'lucide-react';
import AddTeacherModal from '../../../components/admin/AddTeacherModal';
import { useTeachers } from '@/hooks/useTeachers';
import { UserAvatar } from '@/app/components/shared/UserAvatar';

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

    // Use real data from hook
    const { teachers: rawTeachers, isLoading, error, refetch, deleteTeacher, createTeacher } = useTeachers({
        subject: selectedSubject !== 'all' ? selectedSubject : undefined,
        search: searchQuery || undefined,
    });

    // Handler for adding new teacher
    const handleAddTeacher = async (data: { name: string; email: string; phone: string; subject: string; bio: string }) => {
        const result = await createTeacher({
            name: data.name,
            email: data.email,
            phone: data.phone,
            subject: data.subject,
            bio: data.bio,
        });
        return result;
    };

    // Transform data to match UI structure
    const teachersData = rawTeachers.map(t => ({
        id: t.id,
        name: t.profile?.full_name || 'Unknown',
        email: t.profile?.email || '',
        phone: t.profile?.phone || '',
        avatar: t.profile?.avatar_url,
        subject: t.subject || 'General',
        subjectIcon: '/ASSITS/folders.png',
        level: 'All Levels',
        coursesCount: 0, // Would need separate query
        studentsCount: 0, // Would need separate query
        rating: t.rating || 0,
        joinDate: t.profile?.created_at || '',
        status: 'active',
        bio: t.bio || '',
    }));

    // Filter teachers (search is handled by hook, but we filter locally for subject if needed)
    const filteredTeachers = teachersData;

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

    // Delete single teacher
    const handleDeleteTeacher = async (id: string) => {
        if (confirm('Are you sure you want to delete this teacher?')) {
            const result = await deleteTeacher(id);
            if (!result.success) {
                alert(result.error || 'Failed to delete teacher');
            }
        }
    };

    // Bulk delete teachers
    const handleBulkDelete = async () => {
        if (confirm(`Are you sure you want to delete ${selectedTeachers.length} teachers?`)) {
            for (const id of selectedTeachers) {
                await deleteTeacher(id);
            }
            setSelectedTeachers([]);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
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
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
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
                                                <UserAvatar
                                                    src={teacher.avatar}
                                                    name={teacher.name}
                                                    className="w-10 h-10 rounded-full"
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
                                                onClick={() => handleDeleteTeacher(teacher.id)}
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
            <AddTeacherModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddTeacher} />
        </div>
    );
}
