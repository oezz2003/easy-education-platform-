'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    Filter,
    Plus,
    LayoutGrid,
    List,
    ChevronLeft,
    ChevronRight,
    Download,
    Trash2,
    Eye,
    Edit,
    BookOpen,
    Users,
    Star,
    Clock,
    DollarSign,
    Play,
    MoreHorizontal
} from 'lucide-react';
import AddCourseModal from '../../../components/admin/AddCourseModal';

// Mock courses data
const mockCourses = [
    {
        id: '1',
        title: 'Advanced Mathematics',
        description: 'Complete course covering algebra, calculus, and geometry',
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
        teacher: { id: '1', name: 'Ahmed Hassan', avatar: 'https://i.pravatar.cc/150?img=11' },
        subject: 'Mathematics',
        subjectIcon: '/ASSITS/calc.png',
        level: 'Secondary',
        studentsCount: 125,
        lessonsCount: 45,
        duration: '24h 30m',
        rating: 4.9,
        reviewsCount: 89,
        price: 199,
        status: 'published',
        createdAt: '2024-01-15',
    },
    {
        id: '2',
        title: 'Physics Fundamentals',
        description: 'Master the basics of physics with practical experiments',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
        teacher: { id: '2', name: 'Sara Ali', avatar: 'https://i.pravatar.cc/150?img=5' },
        subject: 'Physics',
        subjectIcon: '/ASSITS/chemstry.png',
        level: 'Preparatory',
        studentsCount: 98,
        lessonsCount: 32,
        duration: '18h 15m',
        rating: 4.8,
        reviewsCount: 56,
        price: 149,
        status: 'published',
        createdAt: '2024-02-20',
    },
    {
        id: '3',
        title: 'English Grammar Mastery',
        description: 'Comprehensive grammar course for all levels',
        thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400',
        teacher: { id: '3', name: 'Mohamed Farid', avatar: 'https://i.pravatar.cc/150?img=12' },
        subject: 'English',
        subjectIcon: '/ASSITS/text bubble.png',
        level: 'Primary',
        studentsCount: 210,
        lessonsCount: 28,
        duration: '14h 45m',
        rating: 4.7,
        reviewsCount: 124,
        price: 99,
        status: 'published',
        createdAt: '2024-03-10',
    },
    {
        id: '4',
        title: 'Chemistry Experiments',
        description: 'Hands-on chemistry with lab demonstrations',
        thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
        teacher: { id: '4', name: 'Fatma Nour', avatar: 'https://i.pravatar.cc/150?img=9' },
        subject: 'Chemistry',
        subjectIcon: '/ASSITS/chemstry.png',
        level: 'Secondary',
        studentsCount: 67,
        lessonsCount: 24,
        duration: '12h 00m',
        rating: 4.6,
        reviewsCount: 38,
        price: 129,
        status: 'draft',
        createdAt: '2024-04-05',
    },
    {
        id: '5',
        title: 'World Geography',
        description: 'Explore countries, cultures, and landscapes',
        thumbnail: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400',
        teacher: { id: '5', name: 'Khaled Ibrahim', avatar: 'https://i.pravatar.cc/150?img=15' },
        subject: 'Geography',
        subjectIcon: '/ASSITS/global.png',
        level: 'Preparatory',
        studentsCount: 45,
        lessonsCount: 20,
        duration: '10h 30m',
        rating: 4.5,
        reviewsCount: 22,
        price: 79,
        status: 'archived',
        createdAt: '2024-05-12',
    },
];

const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'primary', name: 'Primary' },
    { id: 'preparatory', name: 'Preparatory' },
    { id: 'secondary', name: 'Secondary' },
];

const statuses = [
    { id: 'all', name: 'All Status' },
    { id: 'published', name: 'Published' },
    { id: 'draft', name: 'Draft' },
    { id: 'archived', name: 'Archived' },
];

const statusColors = {
    published: 'bg-emerald-100 text-emerald-700',
    draft: 'bg-amber-100 text-amber-700',
    archived: 'bg-gray-100 text-gray-600',
};

export default function CoursesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Filter courses
    const filteredCourses = mockCourses.filter((course) => {
        const matchesSearch =
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.teacher.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = selectedLevel === 'all' || course.level.toLowerCase() === selectedLevel;
        const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;
        return matchesSearch && matchesLevel && matchesStatus;
    });

    // Stats
    const stats = {
        total: mockCourses.length,
        published: mockCourses.filter((c) => c.status === 'published').length,
        drafts: mockCourses.filter((c) => c.status === 'draft').length,
        students: mockCourses.reduce((acc, c) => acc + c.studentsCount, 0),
    };

    // Pagination
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleSelectCourse = (id: string) => {
        setSelectedCourses((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
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
                            src="/ASSITS/folders.png"
                            alt="Courses"
                            loading="lazy"
                            className="w-14 h-14 object-contain"
                        />
                    </motion.div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Courses Management
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {filteredCourses.length} courses total
                        </p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Course
                </motion.button>
            </motion.div>

            {/* Stats Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {[
                    { label: 'Total Courses', value: stats.total, icon: BookOpen, color: 'purple' },
                    { label: 'Published', value: stats.published, icon: Play, color: 'emerald' },
                    { label: 'Drafts', value: stats.drafts, icon: Edit, color: 'amber' },
                    { label: 'Total Students', value: stats.students, icon: Users, color: 'blue' },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Filters Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
            >
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Level Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
                        >
                            {levels.map((level) => (
                                <option key={level.id} value={level.id}>
                                    {level.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
                    >
                        {statuses.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.name}
                            </option>
                        ))}
                    </select>

                    {/* View Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow text-purple-500' : 'text-gray-500'
                                }`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow text-purple-500' : 'text-gray-500'
                                }`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Bulk Actions */}
                    {selectedCourses.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2"
                        >
                            <span className="text-sm text-gray-500">{selectedCourses.length} selected</span>
                            <button className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100">
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100">
                                <Download className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Courses Grid/Table */}
            <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {paginatedCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * index }}
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-40 overflow-hidden">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[course.status as keyof typeof statusColors]}`}>
                                            {course.status}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedCourses.includes(course.id)}
                                            onChange={() => toggleSelectCourse(course.id)}
                                            className="w-5 h-5 rounded border-white text-purple-500"
                                        />
                                    </div>
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <h3 className="font-bold text-white truncate">{course.title}</h3>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    {/* Teacher */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <img
                                            src={course.teacher.avatar}
                                            alt={course.teacher.name}
                                            loading="lazy"
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span className="text-sm text-gray-600">{course.teacher.name}</span>
                                        <span className="ml-auto flex items-center gap-1">
                                            <img src={course.subjectIcon} alt="" className="w-4 h-4" />
                                            <span className="text-xs text-gray-500">{course.subject}</span>
                                        </span>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <div className="flex items-center justify-center gap-1 text-gray-600">
                                                <Users className="w-3 h-3" />
                                                <span className="text-sm font-semibold">{course.studentsCount}</span>
                                            </div>
                                            <p className="text-xs text-gray-400">Students</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <div className="flex items-center justify-center gap-1 text-gray-600">
                                                <Play className="w-3 h-3" />
                                                <span className="text-sm font-semibold">{course.lessonsCount}</span>
                                            </div>
                                            <p className="text-xs text-gray-400">Lessons</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <div className="flex items-center justify-center gap-1 text-amber-500">
                                                <Star className="w-3 h-3 fill-amber-400" />
                                                <span className="text-sm font-semibold">{course.rating}</span>
                                            </div>
                                            <p className="text-xs text-gray-400">Rating</p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="w-4 h-4 text-emerald-500" />
                                            <span className="font-bold text-gray-900">{course.price}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/courses/${course.id}`}>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-2 rounded-lg bg-purple-50 text-purple-500 hover:bg-purple-100"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </motion.button>
                                            </Link>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Course</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Teacher</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden lg:table-cell">Level</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Students</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Rating</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedCourses.map((course, index) => (
                                        <motion.tr
                                            key={course.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * index }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={course.thumbnail} alt="" loading="lazy" className="w-12 h-8 rounded-lg object-cover" />
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{course.title}</p>
                                                        <p className="text-xs text-gray-500">{course.lessonsCount} lessons • {course.duration}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <img src={course.teacher.avatar} alt="" className="w-6 h-6 rounded-full" />
                                                    <span className="text-gray-600">{course.teacher.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell text-gray-600">{course.level}</td>
                                            <td className="px-6 py-4 text-gray-900 font-medium">{course.studentsCount}</td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                    <span>{course.rating}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[course.status as keyof typeof statusColors]}`}>
                                                    {course.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/courses/${course.id}`}>
                                                        <button className="p-2 rounded-lg bg-purple-50 text-purple-500 hover:bg-purple-100">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </Link>
                                                    <button className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg font-medium ${currentPage === page ? 'bg-purple-500 text-white' : 'border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Empty State */}
            {filteredCourses.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedLevel('all'); setSelectedStatus('all'); }}
                        className="text-purple-500 hover:text-purple-600 font-medium"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            {/* Add Course Modal */}
            <AddCourseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </div>
    );
}
