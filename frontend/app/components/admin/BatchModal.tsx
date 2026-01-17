'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, Clock, User, Loader2 } from 'lucide-react';
import type { Batch, TeacherWithProfile } from '@/types/database';

interface BatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    batch?: Batch;
    courseId: string;
    teachers: TeacherWithProfile[];
    onSubmit: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export default function BatchModal({ isOpen, onClose, batch, courseId, teachers, onSubmit }: BatchModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        teacher_id: '',
        start_date: '',
        end_date: '',
        schedule: '',
        max_students: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (batch) {
            setFormData({
                name: batch.name,
                teacher_id: batch.teacher_id,
                start_date: batch.start_date.split('T')[0],
                end_date: batch.end_date.split('T')[0],
                schedule: batch.schedule || '',
                max_students: batch.max_students.toString(),
            });
        } else {
            setFormData({
                name: '',
                teacher_id: '',
                start_date: '',
                end_date: '',
                schedule: '',
                max_students: '',
            });
        }
    }, [batch, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                course_id: courseId,
                max_students: parseInt(formData.max_students),
            };

            const result = await onSubmit(data);

            if (!result.success) {
                setError(result.error || 'Failed to save batch');
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
                        <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {batch ? 'Edit Batch' : 'Create New Batch'}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {batch ? 'Update batch details' : 'Schedule a new batch for this course'}
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
                                <form id="batch-form" onSubmit={handleSubmit} className="space-y-4">
                                    {error && (
                                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">
                                            {error}
                                        </div>
                                    )}

                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Batch Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder="e.g. Batch A - Morning"
                                        />
                                    </div>

                                    {/* Teacher */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Assign Teacher
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="teacher_id"
                                                value={formData.teacher_id}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-white"
                                            >
                                                <option value="">Select a teacher</option>
                                                {teachers.map(t => (
                                                    <option key={t.id} value={t.id}>
                                                        {t.profile?.full_name || 'Unknown Teacher'} ({t.subject})
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                ▼
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Start Date */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                name="start_date"
                                                value={formData.start_date}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            />
                                        </div>

                                        {/* End Date */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                name="end_date"
                                                value={formData.end_date}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Schedule */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                Schedule
                                            </label>
                                            <input
                                                type="text"
                                                name="schedule"
                                                value={formData.schedule}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                placeholder="e.g. Mon, Wed 10:00 AM"
                                            />
                                        </div>

                                        {/* Max Students */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Max Students
                                            </label>
                                            <input
                                                type="number"
                                                name="max_students"
                                                value={formData.max_students}
                                                onChange={handleChange}
                                                required
                                                min="1"
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                placeholder="e.g. 20"
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
                                    form="batch-form"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Batch'
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
