'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, FileText, DollarSign, Clock, Image as ImageIcon, Loader2, BarChart } from 'lucide-react';
import type { Course } from '@/types/database';

interface CourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    course?: Course;
    onSubmit: (data: any) => Promise<{ success: boolean; error?: string }>;
}

const subjects = ['Mathematics', 'Physics', 'English', 'Chemistry', 'Biology', 'History', 'Geography', 'Art', 'Computer Science'];
const levels = ['primary', 'preparatory', 'secondary', 'university'];

export default function CourseModal({ isOpen, onClose, course, onSubmit }: CourseModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        subject: '',
        level: '',
        price: '',
        duration_weeks: '',
        thumbnail_url: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (course) {
            setFormData({
                name: course.name,
                description: course.description || '',
                subject: course.subject || '',
                level: course.level || '',
                price: course.price.toString(),
                duration_weeks: course.duration_weeks?.toString() || '',
                thumbnail_url: course.thumbnail_url || '',
            });
        } else {
            setFormData({
                name: '',
                description: '',
                subject: '',
                level: '',
                price: '',
                duration_weeks: '',
                thumbnail_url: '',
            });
        }
    }, [course, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                duration_weeks: formData.duration_weeks ? parseInt(formData.duration_weeks) : null,
            };

            console.log('Submitting course data:', data);
            const result = await onSubmit(data);
            console.log('Submission result:', result);

            if (!result.success) {
                setError(result.error || 'Failed to save course');
                setIsSubmitting(false);
                return;
            }

            onClose();
        } catch (err) {
            setError('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
                    >
                        <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {course ? 'Edit Course' : 'Create New Course'}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {course ? 'Update course details' : 'Add a new course to the catalog'}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Form */}
                            <div className="p-6 overflow-y-auto">
                                <form id="course-form" onSubmit={handleSubmit} className="space-y-6">
                                    {error && (
                                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">
                                            {error}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Name */}
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                Course Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                placeholder="e.g. Advanced Mathematics"
                                            />
                                        </div>

                                        {/* Subject */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                Subject
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white"
                                                >
                                                    <option value="">Select Subject</option>
                                                    {subjects.map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    ▼
                                                </div>
                                            </div>
                                        </div>

                                        {/* Level */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <BarChart className="w-4 h-4" />
                                                Level
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="level"
                                                    value={formData.level}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white"
                                                >
                                                    <option value="">Select Level</option>
                                                    {levels.map(l => (
                                                        <option key={l} value={l}>{l}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    ▼
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <DollarSign className="w-4 h-4" />
                                                Price
                                            </label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        {/* Duration */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                Duration (Weeks)
                                            </label>
                                            <input
                                                type="number"
                                                name="duration_weeks"
                                                value={formData.duration_weeks}
                                                onChange={handleChange}
                                                min="1"
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                placeholder="e.g. 12"
                                            />
                                        </div>

                                        {/* Thumbnail URL */}
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4" />
                                                Thumbnail URL
                                            </label>
                                            <input
                                                type="url"
                                                name="thumbnail_url"
                                                value={formData.thumbnail_url}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={4}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                                placeholder="Enter course description..."
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="course-form"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Course'
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
