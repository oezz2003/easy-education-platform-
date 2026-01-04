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
    Award
} from 'lucide-react';

// Mock teacher data
const mockTeachers = [
    {
        id: '1',
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@email.com',
        phone: '+20 123 456 7890',
        avatar: 'https://i.pravatar.cc/150?img=11',
        subject: 'Mathematics',
        subjectIcon: '/ASSITS/calc.png',
        level: 'All Levels',
        coursesCount: 8,
        studentsCount: 450,
        rating: 4.9,
        reviewsCount: 128,
        joinDate: '2023-06-15',
        status: 'active',
        bio: 'Senior Mathematics instructor with 10+ years of experience. Specializing in advanced calculus and algebra for preparation and secondary levels.',
        totalEarnings: 45000,
        lessonsCompleted: 520,
        hoursTeaching: 320,
    },
    {
        id: '2',
        name: 'Sara Ali',
        email: 'sara.ali@email.com',
        phone: '+20 100 200 3000',
        avatar: 'https://i.pravatar.cc/150?img=5',
        subject: 'Physics',
        subjectIcon: '/ASSITS/chemstry.png',
        level: 'Secondary',
        coursesCount: 5,
        studentsCount: 280,
        rating: 4.8,
        reviewsCount: 89,
        joinDate: '2023-09-20',
        status: 'active',
        bio: 'Physics specialist focusing on practical experiments and hands-on learning.',
        totalEarnings: 28000,
        lessonsCompleted: 340,
        hoursTeaching: 200,
    },
];

// Mock courses
const teacherCourses = [
    {
        id: '1',
        title: 'Advanced Mathematics',
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
        studentsCount: 125,
        lessonsCount: 45,
        rating: 4.9,
        revenue: 12500,
        status: 'published',
    },
    {
        id: '2',
        title: 'Algebra Fundamentals',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
        studentsCount: 98,
        lessonsCount: 32,
        rating: 4.8,
        revenue: 8200,
        status: 'published',
    },
    {
        id: '3',
        title: 'Calculus Mastery',
        thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400',
        studentsCount: 67,
        lessonsCount: 28,
        rating: 4.7,
        revenue: 5800,
        status: 'draft',
    },
];

// Mock reviews
const recentReviews = [
    {
        id: '1',
        studentName: 'Omar Khaled',
        studentAvatar: 'https://i.pravatar.cc/150?img=12',
        rating: 5,
        comment: 'Excellent teacher! Explains complex concepts in a simple way.',
        date: '2024-12-25',
        course: 'Advanced Mathematics',
    },
    {
        id: '2',
        studentName: 'Fatma Nour',
        studentAvatar: 'https://i.pravatar.cc/150?img=9',
        rating: 5,
        comment: 'Very patient and helpful. Highly recommended!',
        date: '2024-12-22',
        course: 'Algebra Fundamentals',
    },
    {
        id: '3',
        studentName: 'Youssef Ibrahim',
        studentAvatar: 'https://i.pravatar.cc/150?img=15',
        rating: 4,
        comment: 'Great course content and well-structured lessons.',
        date: '2024-12-20',
        course: 'Calculus Mastery',
    },
];

export default function TeacherProfilePage() {
    const params = useParams();
    const teacherId = params.id as string;

    const teacher = mockTeachers.find((t) => t.id === teacherId);

    if (!teacher) {
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
                    <p className="text-gray-500 mb-6">The teacher you're looking for doesn't exist.</p>
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
                                src={teacher.avatar}
                                alt={teacher.name}
                                loading="lazy"
                                className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl object-cover"
                            />
                            <span
                                className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${teacher.status === 'active' ? 'bg-blue-500' : 'bg-gray-400'
                                    }`}
                            />
                        </motion.div>

                        {/* Info */}
                        <div className="flex-1 pt-4 md:pt-0">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {teacher.name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={teacher.subjectIcon}
                                                alt=""
                                                loading="lazy"
                                                className="w-5 h-5 object-contain"
                                            />
                                            <span className="text-gray-600">{teacher.subject}</span>
                                        </div>
                                        <span className="text-gray-300">•</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            <span className="font-medium text-gray-900">{teacher.rating}</span>
                                            <span className="text-gray-500">({teacher.reviewsCount} reviews)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
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
                    <p className="text-gray-600 mt-4 max-w-3xl">{teacher.bio}</p>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="font-medium text-gray-900">{teacher.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <Phone className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="font-medium text-gray-900">{teacher.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Joined</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(teacher.joinDate).toLocaleDateString('en-US', {
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
                        value: teacher.studentsCount,
                        icon: Users,
                        color: 'blue',
                    },
                    {
                        label: 'Courses',
                        value: teacher.coursesCount,
                        icon: BookOpen,
                        color: 'emerald',
                    },
                    {
                        label: 'Hours Teaching',
                        value: teacher.hoursTeaching,
                        icon: Clock,
                        color: 'purple',
                    },
                    {
                        label: 'Total Earnings',
                        value: `$${teacher.totalEarnings.toLocaleString()}`,
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
                        <h2 className="text-xl font-bold text-gray-900">Courses</h2>
                        <span className="text-sm text-gray-500">{teacherCourses.length} courses</span>
                    </div>

                    <div className="space-y-4">
                        {teacherCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                            >
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    loading="lazy"
                                    className="w-24 h-18 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${course.status === 'published'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {course.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{course.studentsCount}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Play className="w-4 h-4" />
                                            <span>{course.lessonsCount} lessons</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            <span>{course.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">${course.revenue.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">Revenue</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Reviews */}
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
                            <span className="font-bold text-gray-900">{teacher.rating}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {recentReviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="p-4 rounded-xl bg-gray-50"
                            >
                                <div className="flex items-start gap-3">
                                    <img
                                        src={review.studentAvatar}
                                        alt={review.studentName}
                                        loading="lazy"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-gray-900">{review.studentName}</p>
                                            <div className="flex items-center gap-0.5">
                                                {Array.from({ length: review.rating }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="w-3 h-3 text-amber-400 fill-amber-400"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                                        <p className="text-xs text-gray-400 mt-2">{review.course}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-3 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors">
                        View All Reviews →
                    </button>
                </motion.div>
            </div>

            {/* Performance Chart Placeholder */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Performance Overview</h2>
                    <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm">
                        <option>Last 30 days</option>
                        <option>Last 3 months</option>
                        <option>Last year</option>
                    </select>
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                    <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Performance chart will be displayed here</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
