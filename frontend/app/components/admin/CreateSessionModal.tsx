'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Calendar, Clock, Users, Link as LinkIcon, FileText, Check, Sparkles } from 'lucide-react';
import { UserAvatar } from '../shared/UserAvatar';

interface CreateSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const courses = [
    { id: '1', title: 'Advanced Mathematics', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400' },
    { id: '2', title: 'Physics Fundamentals', thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400' },
    { id: '3', title: 'English Grammar Mastery', thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400' },
    { id: '4', title: 'Chemistry Experiments', thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400' },
];

const teachers = [
    { id: '1', name: 'Ahmed Hassan', avatar: null, subject: 'Mathematics' },
    { id: '2', name: 'Sara Ali', avatar: null, subject: 'Physics' },
    { id: '3', name: 'Mohamed Farid', avatar: null, subject: 'English' },
    { id: '4', name: 'Fatma Nour', avatar: null, subject: 'Chemistry' },
];

export default function CreateSessionModal({ isOpen, onClose }: CreateSessionModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        courseId: '',
        teacherId: '',
        date: '',
        time: '',
        duration: '60',
        maxAttendees: '50',
        meetLink: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generateMeetLink = () => {
        // Simulated auto-generation
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        const segment = () => Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        const link = `https://meet.google.com/${segment()}-${segment()}-${segment()}`;
        setFormData({ ...formData, meetLink: link });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);

        setTimeout(() => {
            setIsSuccess(false);
            setFormData({
                title: '',
                courseId: '',
                teacherId: '',
                date: '',
                time: '',
                duration: '60',
                maxAttendees: '50',
                meetLink: '',
                description: '',
            });
            onClose();
        }, 1500);
    };

    const canSubmit = formData.title && formData.courseId && formData.teacherId && formData.date && formData.time && formData.meetLink;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                                        <Video className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Schedule Live Session</h2>
                                        <p className="text-sm text-gray-500">Create a new Google Meet class</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Success State */}
                            {isSuccess ? (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-12 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center mx-auto mb-4"
                                    >
                                        <Check className="w-10 h-10 text-red-500" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Session Scheduled!</h3>
                                    <p className="text-gray-500">Your live session has been created</p>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Form */}
                                    <div className="p-6 space-y-5">
                                        {/* Session Title */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Session Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder="e.g., Advanced Algebra Live Class"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                            />
                                        </div>

                                        {/* Course Selection */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {courses.map((course) => (
                                                    <motion.button
                                                        key={course.id}
                                                        type="button"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setFormData({ ...formData, courseId: course.id })}
                                                        className={`p-3 rounded-xl border-2 text-left transition-all ${formData.courseId === course.id
                                                            ? 'border-red-500 bg-red-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <p className="font-medium text-gray-900 text-sm">{course.title}</p>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Teacher Selection */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Assign Teacher</label>
                                            <select
                                                name="teacherId"
                                                value={formData.teacherId}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
                                            >
                                                <option value="">Select a teacher</option>
                                                {teachers.map((teacher) => (
                                                    <option key={teacher.id} value={teacher.id}>
                                                        {teacher.name} - {teacher.subject}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Date & Time */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        value={formData.date}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                                                <div className="relative">
                                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="time"
                                                        name="time"
                                                        value={formData.time}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Duration & Max Attendees */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min)</label>
                                                <select
                                                    name="duration"
                                                    value={formData.duration}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
                                                >
                                                    <option value="30">30 minutes</option>
                                                    <option value="45">45 minutes</option>
                                                    <option value="60">60 minutes</option>
                                                    <option value="90">90 minutes</option>
                                                    <option value="120">120 minutes</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees</label>
                                                <div className="relative">
                                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="number"
                                                        name="maxAttendees"
                                                        value={formData.maxAttendees}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Google Meet Link */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Google Meet Link</label>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="url"
                                                        name="meetLink"
                                                        value={formData.meetLink}
                                                        onChange={handleChange}
                                                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                                    />
                                                </div>
                                                <motion.button
                                                    type="button"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={generateMeetLink}
                                                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium flex items-center gap-2 transition-colors"
                                                >
                                                    <Sparkles className="w-4 h-4" />
                                                    Generate
                                                </motion.button>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Paste your Google Meet link or click Generate to create one
                                            </p>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={2}
                                                placeholder="What will be covered in this session?"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="p-6 border-t border-gray-100">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSubmit}
                                            disabled={!canSubmit || isSubmitting}
                                            className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                    />
                                                    Scheduling...
                                                </>
                                            ) : (
                                                <>
                                                    <Video className="w-5 h-5" />
                                                    Schedule Session
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )
            }
        </AnimatePresence >
    );
}
