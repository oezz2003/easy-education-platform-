'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    GraduationCap,
    BookOpen,
    Users,
    Star,
    TrendingUp,
    Edit,
    MoreHorizontal,
    Play,
    Clock,
    DollarSign,
    Loader2
} from 'lucide-react';
import { useTeachers } from '@/hooks/useTeachers';
import { useEffect, useState, useCallback } from 'react';
import EditTeacherModal from '@/app/components/admin/EditTeacherModal';

export default function TeacherProfilePage() {
    const params = useParams();
    const teacherId = params.id as string;
    const { getTeacher, updateTeacher } = useTeachers();
    const [teacher, setTeacher] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchTeacher = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await getTeacher(teacherId);
        if (error) {
            setError(error);
        } else {
            setTeacher(data);
        }
        setIsLoading(false);
    }, [teacherId, getTeacher]);

    useEffect(() => {
        if (teacherId) {
            fetchTeacher();
        }
    }, [teacherId, fetchTeacher]);

    const handleUpdateTeacher = async (teacherId: string, userId: string, updates: any) => {
        const result = await updateTeacher(teacherId, userId, updates);
        if (result.success) {
            // Refresh data
            const { data } = await getTeacher(teacherId);
            setTeacher(data);
        }
        return result;
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error || !teacher) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Teacher not found</h2>
                    <p className="text-gray-500 mb-6">{error || "The teacher you're looking for doesn't exist."}</p>
                    <Link
                        href="/admin/teachers"
                        className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                        ← Back to Teachers
                    </Link>
                </div>
            </div>
        );
    }

    // Calculate stats
    const coursesCount = new Set(teacher.batches?.map((b: any) => b.course_id)).size || 0;
    const studentsCount = teacher.total_students || 0;
    const totalEarnings = 0; // TODO: Calculate from invoices
    const hoursTeaching = 0; // TODO: Calculate from sessions

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Link
                    href="/admin/teachers"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Teachers</span>
                </Link>
            </motion.div>

            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-32" />
                <div className="px-6 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16">
                        {/* Avatar */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="relative"
                        >
                            <img
                                src={teacher.profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.profile?.full_name || 'Teacher')}`}
                                alt={teacher.profile?.full_name}
                                loading="lazy"
                                className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl object-cover bg-white"
                            />
                            <span
                                className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${teacher.profile?.status === 'active' ? 'bg-blue-500' : 'bg-gray-400'
                                    }`}
                            />
                        </motion.div>

                        {/* Info */}
                        <div className="flex-1 pt-4 md:pt-0">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {teacher.profile?.full_name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">{teacher.subject || 'No subject'}</span>
                                        </div>
                                        <span className="text-gray-300">•</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            <span className="font-medium text-gray-900">{teacher.rating || 0}</span>
                                            <span className="text-gray-500">({teacher.total_reviews || 0} reviews)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium shadow-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Profile
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <MoreHorizontal className="w-5 h-5 text-gray-500" />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <p className="text-gray-600 mt-4 max-w-3xl">{teacher.bio || 'No biography available.'}</p>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="font-medium text-gray-900">{teacher.profile?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <Phone className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="font-medium text-gray-900">{teacher.profile?.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Joined</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(teacher.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Total Students',
                        value: studentsCount,
                        icon: Users,
                        color: 'blue',
                    },
                    {
                        label: 'Courses',
                        value: coursesCount,
                        icon: BookOpen,
                        color: 'emerald',
                    },
                    {
                        label: 'Hours Teaching',
                        value: hoursTeaching,
                        icon: Clock,
                        color: 'purple',
                    },
                    {
                        label: 'Total Earnings',
                        value: `$${totalEarnings.toLocaleString()}`,
                        icon: DollarSign,
                        color: 'amber',
                    },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100"
                    >
                        <div
                            className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center mb-3`}
                        >
                            <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Courses */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Active Batches</h2>
                        <span className="text-sm text-gray-500">{teacher.batches?.length || 0} batches</span>
                    </div>

                    <div className="space-y-4">
                        {teacher.batches?.map((batch: any, index: number) => (
                            <motion.div
                                key={batch.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                            >
                                <div className="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-xl">
                                    {batch.course?.name?.charAt(0) || 'C'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-gray-900 truncate">{batch.name}</h3>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${batch.status === 'active'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {batch.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{batch.course?.name}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(batch.start_date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{batch.max_students} max</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {(!teacher.batches || teacher.batches.length === 0) && (
                            <p className="text-center text-gray-500 py-8">No active batches found.</p>
                        )}
                    </div>
                </motion.div>

                {/* Reviews Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Reviews</h2>
                        <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                            <span className="font-bold text-gray-900">{teacher.rating || 0}</span>
                        </div>
                    </div>

                    <div className="text-center py-8 text-gray-500">
                        No reviews yet.
                    </div>
                </motion.div>
            </div>

            {/* Edit Modal */}
            <EditTeacherModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                teacher={teacher}
                onSubmit={handleUpdateTeacher}
            />
        </div>
    );
}
