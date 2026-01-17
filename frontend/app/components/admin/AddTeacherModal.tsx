'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, BookOpen, Upload, Check, FileText, GraduationCap } from 'lucide-react';

interface AddTeacherModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: { name: string; email: string; phone: string; subject: string; bio: string }) => Promise<{ success: boolean; error?: string }>;
}

const subjects = [
    { id: 'mathematics', name: 'Mathematics', icon: '/ASSITS/calc.png' },
    { id: 'physics', name: 'Physics', icon: '/ASSITS/chemstry.png' },
    { id: 'english', name: 'English', icon: '/ASSITS/text bubble.png' },
    { id: 'chemistry', name: 'Chemistry', icon: '/ASSITS/chemstry.png' },
    { id: 'geography', name: 'Geography', icon: '/ASSITS/global.png' },
    { id: 'art', name: 'Art', icon: '/ASSITS/art.png' },
];

export default function AddTeacherModal({ isOpen, onClose, onSubmit }: AddTeacherModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        bio: '',
        experience: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            if (onSubmit) {
                // Use real Supabase callback
                const result = await onSubmit({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: formData.subject,
                    bio: formData.bio,
                });
                if (!result.success) {
                    setError(result.error || 'Failed to add teacher');
                    setIsSubmitting(false);
                    return;
                }
            } else {
                // Fallback mock
                await new Promise((resolve) => setTimeout(resolve, 1500));
            }

            setIsSubmitting(false);
            setIsSuccess(true);

            setTimeout(() => {
                setIsSuccess(false);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    bio: '',
                    experience: '',
                });
                onClose();
            }, 1500);
        } catch (err) {
            setError('An error occurred');
            setIsSubmitting(false);
        }
    };

    const isValid =
        formData.name &&
        formData.email &&
        formData.phone &&
        formData.subject;

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
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
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
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        <img
                                            src="/login-signup assits/teacher.png"
                                            alt=""
                                            className="w-10 h-10 object-contain"
                                        />
                                    </motion.div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Add New Teacher</h2>
                                        <p className="text-sm text-gray-500">Fill in the teacher details</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Success State */}
                            {isSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-12 text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4"
                                    >
                                        <Check className="w-10 h-10 text-blue-500" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Teacher Added Successfully!
                                    </h3>
                                    <p className="text-gray-500">The teacher has been added to the system.</p>
                                </motion.div>
                            ) : (
                                /* Form */
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {/* Teacher Info Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                            Personal Information
                                        </h3>

                                        {/* Avatar Upload */}
                                        <div className="flex justify-center">
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                                                    <Upload className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <span className="text-xs text-gray-500 mt-2 block text-center">
                                                    Upload Photo
                                                </span>
                                            </div>
                                        </div>

                                        {/* Name */}
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Full Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email Address"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Phone Number"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Professional Info */}
                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                            Professional Details
                                        </h3>

                                        {/* Subject Selection */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Teaching Subject
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {subjects.map((subject) => (
                                                    <motion.button
                                                        key={subject.id}
                                                        type="button"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() =>
                                                            setFormData((prev) => ({ ...prev, subject: subject.id }))
                                                        }
                                                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.subject === subject.id
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <img
                                                            src={subject.icon}
                                                            alt=""
                                                            className="w-8 h-8 object-contain"
                                                        />
                                                        <span
                                                            className={`text-xs font-medium ${formData.subject === subject.id
                                                                ? 'text-blue-600'
                                                                : 'text-gray-600'
                                                                }`}
                                                        >
                                                            {subject.name}
                                                        </span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Experience */}
                                        <div className="relative">
                                            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="experience"
                                                placeholder="Years of Experience"
                                                value={formData.experience}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        {/* Bio */}
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                            <textarea
                                                name="bio"
                                                placeholder="Short Bio (Optional)"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                rows={3}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <motion.button
                                        type="submit"
                                        disabled={!isValid || isSubmitting}
                                        whileHover={{ scale: isValid ? 1.02 : 1 }}
                                        whileTap={{ scale: isValid ? 0.98 : 1 }}
                                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${isValid
                                            ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                />
                                                Adding Teacher...
                                            </>
                                        ) : (
                                            <>
                                                <BookOpen className="w-5 h-5" />
                                                Add Teacher
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
