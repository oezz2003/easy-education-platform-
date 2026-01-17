'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, FileText, DollarSign, Clock, Users, Tag, Upload, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { UserAvatar } from '../shared/UserAvatar';

interface AddCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const levels = [
    { id: 'primary', name: 'Primary', icon: '/ASSITS/TREE.png' },
    { id: 'preparatory', name: 'Preparatory', icon: '/ASSITS/global.png' },
    { id: 'secondary', name: 'Secondary', icon: '/ASSITS/gradution.png' },
];

const subjects = [
    { id: 'mathematics', name: 'Mathematics', icon: '/ASSITS/calc.png' },
    { id: 'physics', name: 'Physics', icon: '/ASSITS/chemstry.png' },
    { id: 'english', name: 'English', icon: '/ASSITS/text bubble.png' },
    { id: 'chemistry', name: 'Chemistry', icon: '/ASSITS/chemstry.png' },
    { id: 'geography', name: 'Geography', icon: '/ASSITS/global.png' },
];

const teachers = [
    { id: '1', name: 'Ahmed Hassan', avatar: null, subject: 'Mathematics' },
    { id: '2', name: 'Sara Ali', avatar: null, subject: 'Physics' },
    { id: '3', name: 'Mohamed Farid', avatar: null, subject: 'English' },
];

export default function AddCourseModal({ isOpen, onClose }: AddCourseModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        level: '',
        subject: '',
        teacherId: '',
        price: '',
        duration: '',
        maxStudents: '',
        isFree: false,
        hasCertificate: true,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);

        setTimeout(() => {
            setIsSuccess(false);
            setStep(1);
            setFormData({
                title: '',
                description: '',
                level: '',
                subject: '',
                teacherId: '',
                price: '',
                duration: '',
                maxStudents: '',
                isFree: false,
                hasCertificate: true,
            });
            onClose();
        }, 1500);
    };

    const canProceedStep1 = formData.title && formData.description;
    const canProceedStep2 = formData.level && formData.subject;
    const canProceedStep3 = formData.teacherId;
    const canSubmit = formData.price || formData.isFree;

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Basic Information
                        </h3>

                        {/* Thumbnail Upload */}
                        <div className="flex justify-center">
                            <div className="relative w-full max-w-xs">
                                <div className="aspect-video rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors">
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">Upload Thumbnail</span>
                                    <span className="text-xs text-gray-400">1280 x 720 recommended</span>
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="relative">
                            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="title"
                                placeholder="Course Title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            />
                        </div>

                        {/* Description */}
                        <div className="relative">
                            <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            <textarea
                                name="description"
                                placeholder="Course Description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                            />
                        </div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Classification
                        </h3>

                        {/* Level */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                            <div className="grid grid-cols-3 gap-3">
                                {levels.map((level) => (
                                    <motion.button
                                        key={level.id}
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setFormData((prev) => ({ ...prev, level: level.id }))}
                                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.level === level.id
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <img src={level.icon} alt="" className="w-8 h-8 object-contain" />
                                        <span className={`text-xs font-medium ${formData.level === level.id ? 'text-purple-600' : 'text-gray-600'}`}>
                                            {level.name}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <div className="grid grid-cols-3 gap-3">
                                {subjects.map((subject) => (
                                    <motion.button
                                        key={subject.id}
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setFormData((prev) => ({ ...prev, subject: subject.id }))}
                                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.subject === subject.id
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <img src={subject.icon} alt="" className="w-6 h-6 object-contain" />
                                        <span className={`text-xs font-medium ${formData.subject === subject.id ? 'text-purple-600' : 'text-gray-600'}`}>
                                            {subject.name}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Assign Teacher
                        </h3>

                        <div className="space-y-3">
                            {teachers.map((teacher) => (
                                <motion.button
                                    key={teacher.id}
                                    type="button"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => setFormData((prev) => ({ ...prev, teacherId: teacher.id }))}
                                    className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${formData.teacherId === teacher.id
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <UserAvatar
                                        src={teacher.avatar}
                                        name={teacher.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900">{teacher.name}</p>
                                        <p className="text-sm text-gray-500">{teacher.subject}</p>
                                    </div>
                                    {formData.teacherId === teacher.id && (
                                        <Check className="ml-auto w-5 h-5 text-purple-500" />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Pricing & Settings
                        </h3>

                        {/* Free Toggle */}
                        <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-purple-300 transition-colors">
                            <input
                                type="checkbox"
                                name="isFree"
                                checked={formData.isFree}
                                onChange={handleChange}
                                className="w-5 h-5 rounded text-purple-500 focus:ring-purple-400"
                            />
                            <div>
                                <p className="font-medium text-gray-900">Free Course</p>
                                <p className="text-sm text-gray-500">Make this course available for free</p>
                            </div>
                        </label>

                        {/* Price */}
                        {!formData.isFree && (
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                />
                            </div>
                        )}

                        {/* Duration */}
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="duration"
                                placeholder="Duration (e.g., 24 hours)"
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            />
                        </div>

                        {/* Max Students */}
                        <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="number"
                                name="maxStudents"
                                placeholder="Max Students (optional)"
                                value={formData.maxStudents}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            />
                        </div>

                        {/* Certificate */}
                        <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-purple-300 transition-colors">
                            <input
                                type="checkbox"
                                name="hasCertificate"
                                checked={formData.hasCertificate}
                                onChange={handleChange}
                                className="w-5 h-5 rounded text-purple-500 focus:ring-purple-400"
                            />
                            <div>
                                <p className="font-medium text-gray-900">Issue Certificate</p>
                                <p className="text-sm text-gray-500">Students receive a certificate on completion</p>
                            </div>
                        </label>
                    </motion.div>
                );
        }
    };

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
                                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                                        <img src="/ASSITS/folders.png" alt="" className="w-10 h-10 object-contain" />
                                    </motion.div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Add New Course</h2>
                                        <p className="text-sm text-gray-500">Step {step} of 4</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Progress */}
                            <div className="px-6 pt-4">
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4].map((s) => (
                                        <div
                                            key={s}
                                            className={`flex-1 h-2 rounded-full transition-colors ${s <= step ? 'bg-purple-500' : 'bg-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Success State */}
                            {isSuccess ? (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-12 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4"
                                    >
                                        <Check className="w-10 h-10 text-purple-500" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Course Created!</h3>
                                    <p className="text-gray-500">Your course has been added as a draft.</p>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Content */}
                                    <div className="p-6">
                                        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between p-6 border-t border-gray-100">
                                        <button
                                            onClick={() => setStep((s) => Math.max(1, s - 1))}
                                            disabled={step === 1}
                                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Back
                                        </button>

                                        {step < 4 ? (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setStep((s) => s + 1)}
                                                disabled={
                                                    (step === 1 && !canProceedStep1) ||
                                                    (step === 2 && !canProceedStep2) ||
                                                    (step === 3 && !canProceedStep3)
                                                }
                                                className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                                <ChevronRight className="w-4 h-4" />
                                            </motion.button>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleSubmit}
                                                disabled={!canSubmit || isSubmitting}
                                                className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                        />
                                                        Creating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <BookOpen className="w-4 h-4" />
                                                        Create Course
                                                    </>
                                                )}
                                            </motion.button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
