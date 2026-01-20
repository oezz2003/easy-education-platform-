'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    GraduationCap,
    BookOpen,
    Clock,
    Star,
    TrendingUp,
    Edit,
    Trash2,
    MoreHorizontal,
    Users,
    Play,
    FileText,
    Award,
    Loader2,
    Plus,
    Lock,
    Eye,
    EyeOff,
    Copy,
    Check
} from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
import EnrollStudentModal from '@/app/components/admin/EnrollStudentModal';

const levelColors = {
    primary: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    preparatory: 'bg-blue-50 text-blue-600 border-blue-200',
    secondary: 'bg-purple-50 text-purple-600 border-purple-200',
    university: 'bg-indigo-50 text-indigo-600 border-indigo-200',
};

export default function StudentProfilePage() {
    const params = useParams();
    const studentId = params.id as string;
    const { getStudent, getStudentCredentials } = useStudents();

    const [student, setStudent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [credentials, setCredentials] = useState<{ email: string, tempPassword: string | null } | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);
    const [copiedPassword, setCopiedPassword] = useState(false);

    const handleFetchCredentials = async () => {
        if (credentials) {
            setShowPassword(!showPassword);
            return;
        }

        setIsLoadingCredentials(true);
        const { data, error } = await getStudentCredentials(student.user_id);
        if (data) {
            setCredentials(data);
            setShowPassword(true);
        }
        setIsLoadingCredentials(false);
    };

    const copyPassword = () => {
        if (credentials?.tempPassword) {
            navigator.clipboard.writeText(credentials.tempPassword);
            setCopiedPassword(true);
            setTimeout(() => setCopiedPassword(false), 2000);
        }
    };

    useEffect(() => {
        const fetchStudentData = async () => {
            if (!studentId) return;

            setIsLoading(true);
            const { data, error } = await getStudent(studentId);

            if (error) {
                setError(error);
            } else {
                setStudent(data);
            }
            setIsLoading(false);
        };

        fetchStudentData();
    }, [studentId, getStudent]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Student not found</h2>
                    <p className="text-gray-500 mb-6">{error || "The student you're looking for doesn't exist."}</p>
                    <Link
                        href="/admin/students"
                        className="text-emerald-500 hover:text-emerald-600 font-medium"
                    >
                        ← Back to Students
                    </Link>
                </div>
            </div>
        );
    }

    // Calculate stats from real data
    const enrolledCoursesCount = student.enrollments?.length || 0;
    // These are placeholders until we have real stats tables
    const completedLessons = 0;
    const totalLessons = 0;
    const averageGrade = 0;
    const attendanceRate = 0;
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Link
                    href="/admin/students"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-500 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Students</span>
                </Link>
            </motion.div>

            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-32" />
                <div className="px-6 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16">
                        {/* Avatar */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="relative"
                        >
                            <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                                {student.profile?.avatar_url ? (
                                    <img
                                        src={student.profile.avatar_url}
                                        alt={student.profile.full_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Users className="w-12 h-12 text-gray-400" />
                                )}
                            </div>
                            <span
                                className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${student.profile?.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
                                    }`}
                            />
                        </motion.div>

                        {/* Info */}
                        <div className="flex-1 pt-4 md:pt-0">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {student.profile?.full_name || 'Unnamed Student'}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                        {student.level && (
                                            <span
                                                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${levelColors[student.level as keyof typeof levelColors] || 'bg-gray-50 text-gray-600 border-gray-200'
                                                    }`}
                                            >
                                                {student.level.charAt(0).toUpperCase() + student.level.slice(1)}
                                            </span>
                                        )}
                                        <span className="text-sm text-gray-500">
                                            Joined{' '}
                                            {new Date(student.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsEnrollModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium shadow-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Enroll in Course
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium shadow-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Profile
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="font-medium text-gray-900 truncate" title={student.profile?.email}>
                                    {student.profile?.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Phone className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="font-medium text-gray-900">{student.profile?.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Parent Phone</p>
                                <p className="font-medium text-gray-900">{student.parent_phone || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-amber-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">Initial Password</p>
                                <div className="flex items-center gap-2">
                                    {showPassword && credentials?.tempPassword ? (
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                                                {credentials.tempPassword}
                                            </span>
                                            <button onClick={copyPassword} className="p-1 hover:bg-gray-100 rounded">
                                                {copiedPassword ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="font-medium text-gray-400">••••••••</span>
                                    )}
                                    <button
                                        onClick={handleFetchCredentials}
                                        disabled={isLoadingCredentials}
                                        className="text-emerald-500 hover:text-emerald-600 text-sm font-medium ml-2"
                                    >
                                        {isLoadingCredentials ? <Loader2 className="w-3 h-3 animate-spin" /> : showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Enrolled Courses',
                        value: enrolledCoursesCount,
                        icon: BookOpen,
                        color: 'emerald',
                    },
                    {
                        label: 'XP Points',
                        value: student.xp_points || 0,
                        icon: Star,
                        color: 'amber',
                    },
                    {
                        label: 'Streak Days',
                        value: student.streak_days || 0,
                        icon: TrendingUp,
                        color: 'purple',
                    },
                    {
                        label: 'Attendance',
                        value: `${attendanceRate}%`,
                        icon: Calendar,
                        color: 'blue',
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
                {/* Enrolled Courses */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Enrolled Courses</h2>
                        <span className="text-sm text-gray-500">{enrolledCoursesCount} courses</span>
                    </div>

                    <div className="space-y-4">
                        {student.enrollments && student.enrollments.length > 0 ? (
                            student.enrollments.map((enrollment: any, index: number) => (
                                <motion.div
                                    key={enrollment.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors"
                                >
                                    <div className="w-20 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {enrollment.batch?.course?.thumbnail_url ? (
                                            <img
                                                src={enrollment.batch.course.thumbnail_url}
                                                alt={enrollment.batch.course.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <BookOpen className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {enrollment.batch?.course?.name || 'Unknown Course'}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Batch: {enrollment.batch?.name} • {enrollment.batch?.teacher?.profile?.full_name || 'No Teacher'}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${enrollment.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {enrollment.status}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No enrolled courses yet.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Activity Timeline (Placeholder for now) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                    <div className="text-center py-8 text-gray-500">
                        <p>No recent activity recorded.</p>
                    </div>
                </motion.div>
            </div>

            {/* Enroll Student Modal */}
            <EnrollStudentModal
                isOpen={isEnrollModalOpen}
                onClose={() => setIsEnrollModalOpen(false)}
                studentId={studentId}
                studentName={student.profile?.full_name}
                onSuccess={() => {
                    // Refresh student data to show new enrollment
                    getStudent(studentId).then(({ data }) => {
                        if (data) setStudent(data);
                    });
                }}
            />
        </div>
    );
}
