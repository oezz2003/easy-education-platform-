'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Edit,
    Camera,
    BookOpen,
    Clock,
    Trophy,
    Flame,
    Award,
    Download
} from 'lucide-react';

// Mock profile data
const profileData = {
    name: 'Omar Ahmed',
    email: 'omar.ahmed@example.com',
    phone: '+20 100 123 4567',
    location: 'Cairo, Egypt',
    joinedDate: 'January 2024',
    avatar: 'https://i.pravatar.cc/150?img=33',
    level: 12,
    xp: 2450,
    streak: 7,
};

// Stats data
const stats = [
    { label: 'Courses Enrolled', value: 6, icon: BookOpen, color: 'purple' },
    { label: 'Hours Learned', value: 32, icon: Clock, color: 'blue' },
    { label: 'Certificates', value: 1, icon: Award, color: 'amber' },
    { label: 'Badges Earned', value: 12, icon: Trophy, color: 'emerald' },
];

// Enrolled courses summary
const enrolledCourses = [
    { id: 1, title: 'Advanced Algebra', progress: 65, status: 'in_progress' },
    { id: 2, title: 'Calculus Mastery', progress: 40, status: 'in_progress' },
    { id: 3, title: 'Geometry Basics', progress: 80, status: 'in_progress' },
    { id: 4, title: 'Physics Fundamentals', progress: 100, status: 'completed' },
];

// Certificates
const certificates = [
    { id: 1, title: 'Physics Fundamentals', issueDate: 'February 2024', instructor: 'Omar Ibrahim' },
];

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Profile</h1>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-medium"
                >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                </motion.button>
            </motion.div>

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden"
            >
                {/* Cover */}
                <div className="h-32 bg-gradient-to-r from-emerald-500 to-green-500 relative">
                    <div className="absolute inset-0 bg-[url('/ASSITS/CLOUD.png')] bg-contain bg-right-bottom bg-no-repeat opacity-20" />
                </div>

                {/* Profile Content */}
                <div className="px-6 pb-6">
                    {/* Avatar */}
                    <div className="relative -mt-16 mb-4">
                        <div className="relative inline-block">
                            <img
                                src={profileData.avatar}
                                alt={profileData.name}
                                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-600">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                                    Level {profileData.level}
                                </span>
                            </div>

                            <div className="space-y-2 text-gray-600">
                                <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {profileData.email}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {profileData.phone}
                                </p>
                                <p className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    {profileData.location}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    Joined {profileData.joinedDate}
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-4">
                            <div className="text-center px-4 py-3 bg-amber-50 rounded-2xl">
                                <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
                                    <Flame className="w-5 h-5" />
                                    <span className="text-2xl font-bold">{profileData.streak}</span>
                                </div>
                                <p className="text-xs text-amber-700">Day Streak</p>
                            </div>
                            <div className="text-center px-4 py-3 bg-purple-50 rounded-2xl">
                                <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                                    <Trophy className="w-5 h-5" />
                                    <span className="text-2xl font-bold">{profileData.xp.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-purple-700">Total XP</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + index * 0.1 }}
                        className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center"
                    >
                        <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center mx-auto mb-2`}>
                            <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Enrolled Courses */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-[2rem] p-6 shadow-lg border-b-4 border-purple-400"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-purple-500" />
                        My Courses
                    </h3>
                    <div className="space-y-3">
                        {enrolledCourses.map((course) => (
                            <div key={course.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{course.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[120px]">
                                            <div
                                                className={`h-full rounded-full ${course.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
                                                    }`}
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">{course.progress}%</span>
                                    </div>
                                </div>
                                {course.status === 'completed' && (
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                        Completed
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Certificates */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-[2rem] p-6 shadow-lg border-b-4 border-amber-400"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        Certificates
                    </h3>
                    <div className="space-y-3">
                        {certificates.map((cert) => (
                            <div key={cert.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-100">
                                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                    <Award className="w-6 h-6 text-amber-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{cert.title}</p>
                                    <p className="text-sm text-gray-500">Issued {cert.issueDate}</p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 rounded-xl bg-amber-100 text-amber-600 hover:bg-amber-200"
                                >
                                    <Download className="w-5 h-5" />
                                </motion.button>
                            </div>
                        ))}
                        {certificates.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>Complete a course to earn your first certificate!</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
