'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Users, BookOpen, Check, Loader2, GraduationCap } from 'lucide-react';
import { useBatches } from '@/hooks/useBatches';
import { useStudents } from '@/hooks/useStudents';
import { UserAvatar } from '@/app/components/shared/UserAvatar';

interface EnrollStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    // Pre-fill one of these depending on context
    studentId?: string;
    studentName?: string;
    batchId?: string;
    batchName?: string;
    onSuccess?: () => void;
}

export default function EnrollStudentModal({
    isOpen,
    onClose,
    studentId,
    studentName,
    batchId,
    batchName,
    onSuccess,
}: EnrollStudentModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(studentId || null);
    const [selectedBatchId, setSelectedBatchId] = useState<string | null>(batchId || null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { batches, isLoading: batchesLoading } = useBatches({ status: 'active' });
    const { students, isLoading: studentsLoading } = useStudents();
    const { enrollStudent } = useBatches();

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedStudentId(studentId || null);
            setSelectedBatchId(batchId || null);
            setSearchQuery('');
            setError(null);
            setIsSuccess(false);
        }
    }, [isOpen, studentId, batchId]);

    // Determine mode: selecting student or selecting batch
    const isSelectingStudent = !!batchId;
    const isSelectingBatch = !!studentId;

    // Filter options based on search
    const filteredBatches = batches.filter(b =>
        b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.course?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredStudents = students.filter(s =>
        s.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = async () => {
        if (!selectedStudentId || !selectedBatchId) {
            setError('Please select both a student and a batch');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const result = await enrollStudent(selectedBatchId, selectedStudentId);

        if (!result.success) {
            setError(result.error || 'Failed to enroll student');
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(false);
        setIsSuccess(true);

        setTimeout(() => {
            setIsSuccess(false);
            onSuccess?.();
            onClose();
        }, 1500);
    };

    const canSubmit = selectedStudentId && selectedBatchId && !isSubmitting;

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
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden pointer-events-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                        className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"
                                    >
                                        <GraduationCap className="w-5 h-5 text-emerald-600" />
                                    </motion.div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Enroll Student</h2>
                                        <p className="text-sm text-gray-500">
                                            {isSelectingStudent ? `Add student to ${batchName || 'batch'}` :
                                                isSelectingBatch ? `Enroll ${studentName || 'student'} in a course` :
                                                    'Select student and batch'}
                                        </p>
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
                                        className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"
                                    >
                                        <Check className="w-10 h-10 text-emerald-500" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Student Enrolled Successfully!
                                    </h3>
                                    <p className="text-gray-500">The student has been added to the batch.</p>
                                </motion.div>
                            ) : (
                                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                                    {/* Error Message */}
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    {/* Search */}
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder={isSelectingStudent ? "Search students..." : "Search batches..."}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* Selection: Batch (when studentId is provided) */}
                                    {isSelectingBatch && (
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                Select Batch
                                            </h3>
                                            {batchesLoading ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                                                </div>
                                            ) : filteredBatches.length === 0 ? (
                                                <p className="text-center py-8 text-gray-500">No active batches found</p>
                                            ) : (
                                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                                    {filteredBatches.map((batch) => (
                                                        <motion.button
                                                            key={batch.id}
                                                            type="button"
                                                            whileHover={{ scale: 1.01 }}
                                                            whileTap={{ scale: 0.99 }}
                                                            onClick={() => setSelectedBatchId(batch.id)}
                                                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedBatchId === batch.id
                                                                    ? 'border-emerald-500 bg-emerald-50'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                                    <BookOpen className="w-5 h-5 text-purple-600" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-semibold text-gray-900 truncate">{batch.name}</p>
                                                                    <p className="text-sm text-gray-500 truncate">{batch.course?.name}</p>
                                                                </div>
                                                                {selectedBatchId === batch.id && (
                                                                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                                                )}
                                                            </div>
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Selection: Student (when batchId is provided) */}
                                    {isSelectingStudent && (
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Select Student
                                            </h3>
                                            {studentsLoading ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                                                </div>
                                            ) : filteredStudents.length === 0 ? (
                                                <p className="text-center py-8 text-gray-500">No students found</p>
                                            ) : (
                                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                                    {filteredStudents.map((student) => (
                                                        <motion.button
                                                            key={student.id}
                                                            type="button"
                                                            whileHover={{ scale: 1.01 }}
                                                            whileTap={{ scale: 0.99 }}
                                                            onClick={() => setSelectedStudentId(student.id)}
                                                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedStudentId === student.id
                                                                    ? 'border-emerald-500 bg-emerald-50'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <UserAvatar
                                                                    src={student.profile?.avatar_url}
                                                                    name={student.profile?.full_name || 'Student'}
                                                                    className="w-10 h-10 rounded-full"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-semibold text-gray-900 truncate">
                                                                        {student.profile?.full_name || 'Unknown'}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 truncate">
                                                                        {student.profile?.email}
                                                                    </p>
                                                                </div>
                                                                {selectedStudentId === student.id && (
                                                                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                                                )}
                                                            </div>
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <motion.button
                                        type="button"
                                        disabled={!canSubmit}
                                        whileHover={{ scale: canSubmit ? 1.02 : 1 }}
                                        whileTap={{ scale: canSubmit ? 0.98 : 1 }}
                                        onClick={handleSubmit}
                                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${canSubmit
                                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Enrolling...
                                            </>
                                        ) : (
                                            <>
                                                <GraduationCap className="w-5 h-5" />
                                                Enroll Student
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
