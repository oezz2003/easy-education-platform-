'use client';

import { useState, useEffect } from 'react';
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
    UserPlus,
    Loader2,
    DollarSign
} from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useBatches } from '@/hooks/useBatches';
import { useTeachers } from '@/hooks/useTeachers';
import { useStudents } from '@/hooks/useStudents';
import CourseModal from '@/app/components/admin/CourseModal';
import BatchModal from '@/app/components/admin/BatchModal';

// Types
const subjects = ['All', 'Mathematics', 'Physics', 'English', 'Chemistry', 'Biology', 'History', 'Geography', 'Art', 'Computer Science'];
const levels = ['All', 'primary', 'preparatory', 'secondary', 'university'];

export default function CoursesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSubject, setFilterSubject] = useState('All');
    const [filterLevel, setFilterLevel] = useState('All');
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [selectedBatch, setSelectedBatch] = useState<any>(null);

    // Modal states
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<any>(null);
    const [editingBatch, setEditingBatch] = useState<any>(null);

    // Hooks for real data
    const {
        courses: rawCourses,
        isLoading: coursesLoading,
        createCourse,
        updateCourse,
        deleteCourse
    } = useCourses({
        subject: filterSubject !== 'All' ? filterSubject : undefined,
        search: searchQuery || undefined,
    });

    const {
        batches: rawBatches,
        isLoading: batchesLoading,
        createBatch,
        updateBatch,
        deleteBatch
    } = useBatches();

    const { teachers } = useTeachers();

    // Handlers for Course CRUD
    const handleCreateCourse = async (data: any) => {
        return await createCourse(data);
    };

    const handleUpdateCourse = async (data: any) => {
        if (!editingCourse) return { success: false, error: 'No course selected' };
        return await updateCourse(editingCourse.id, data);
    };

    const handleDeleteCourse = async (id: string) => {
        if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            await deleteCourse(id);
            if (selectedCourse?.id === id) setSelectedCourse(null);
        }
    };

    // Handlers for Batch CRUD
    const handleCreateBatch = async (data: any) => {
        return await createBatch(data);
    };

    const handleUpdateBatch = async (data: any) => {
        if (!editingBatch) return { success: false, error: 'No batch selected' };
        return await updateBatch(editingBatch.id, data);
    };

    const handleDeleteBatch = async (id: string) => {
        if (confirm('Are you sure you want to delete this batch?')) {
            await deleteBatch(id);
        }
    };

    const openEditCourse = (course: any) => {
        setEditingCourse(course);
        setIsCourseModalOpen(true);
    };

    const openCreateBatch = (course: any) => {
        setSelectedCourse(course);
        setEditingBatch(null);
        setIsBatchModalOpen(true);
    };

    const openEditBatch = (batch: any) => {
        setEditingBatch(batch);
        setIsBatchModalOpen(true);
    };

    if (coursesLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Courses & Batches</h1>
                    <p className="text-gray-500">Manage your course catalog and active batches</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setEditingCourse(null);
                        setIsCourseModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add New Course
                </motion.button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    >
                        {subjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                        ))}
                    </select>
                    <select
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    >
                        {levels.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Courses List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        All Courses
                    </h2>

                    <div className="grid gap-4">
                        {rawCourses.map((course) => (
                            <motion.div
                                key={course.id}
                                layoutId={course.id}
                                onClick={() => setSelectedCourse(course)}
                                className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer group ${selectedCourse?.id === course.id
                                    ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/20'
                                    : 'border-gray-100 hover:border-blue-200 hover:shadow-md'
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                                        {course.thumbnail_url ? (
                                            <img src={course.thumbnail_url} alt={course.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500">
                                                <BookOpen className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-gray-900 truncate">{course.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                                                        {course.subject}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-xs font-medium">
                                                        {course.level}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditCourse(course);
                                                    }}
                                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-500"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteCourse(course.id);
                                                    }}
                                                    className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{course.description}</p>
                                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                <span>${course.price}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{course.duration_weeks} weeks</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Course Details & Batches */}
                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {selectedCourse ? (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                {/* Active Batches */}
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="font-bold text-gray-900">Active Batches</h2>
                                        <button
                                            onClick={() => openCreateBatch(selectedCourse)}
                                            className="p-2 hover:bg-blue-50 rounded-xl text-blue-500 transition-colors"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {rawBatches
                                            .filter(b => b.course_id === selectedCourse.id)
                                            .map((batch) => (
                                                <div
                                                    key={batch.id}
                                                    className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-all group"
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{batch.name}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                    <Users className="w-3 h-3" />
                                                                    {batch.teacher?.profile?.full_name || 'No Teacher'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => openEditBatch(batch)}
                                                                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-500"
                                                            >
                                                                <Edit className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteBatch(batch.id)}
                                                                className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-3">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(batch.start_date).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Users className="w-3 h-3" />
                                                            {batch.max_students} max
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        {rawBatches.filter(b => b.course_id === selectedCourse.id).length === 0 && (
                                            <div className="text-center py-8 text-gray-500">
                                                <p>No batches found</p>
                                                <button
                                                    onClick={() => openCreateBatch(selectedCourse)}
                                                    className="text-blue-500 text-sm font-medium hover:underline mt-2"
                                                >
                                                    Create first batch
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center"
                            >
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Select a Course</h3>
                                <p className="text-gray-500 mt-1">
                                    Select a course to view details and manage batches
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Modals */}
            <CourseModal
                isOpen={isCourseModalOpen}
                onClose={() => setIsCourseModalOpen(false)}
                course={editingCourse}
                onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
            />

            <BatchModal
                isOpen={isBatchModalOpen}
                onClose={() => setIsBatchModalOpen(false)}
                batch={editingBatch}
                courseId={selectedCourse?.id}
                teachers={teachers}
                onSubmit={editingBatch ? handleUpdateBatch : handleCreateBatch}
            />
        </div>
    );
}
