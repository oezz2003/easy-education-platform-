'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, Users, BookOpen, Clock, Play, ArrowLeft, MessageCircle } from 'lucide-react';
import { teachers, courses } from '@/lib/mock-data';
import Button from '@/app/components/ui/Button';

export default function TeacherProfilePage() {
    const params = useParams();
    const teacherId = params.id as string;

    const teacher = teachers.find((t) => t.id === teacherId);
    const teacherCourses = courses.filter((c) => c.teacherId === teacherId);

    if (!teacher) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h1 className="text-2xl font-bold mb-4 text-gray-900">Teacher not found</h1>
                    <Link href="/teachers">
                        <Button>Back to Teachers</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="container">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <Link
                        href="/teachers"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-[var(--color-primary-500)] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Teachers</span>
                    </Link>
                </motion.div>

                {/* Hero Section */}
                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white rounded-[var(--radius-2xl)] overflow-hidden shadow-xl sticky top-24">
                            {/* Avatar */}
                            <div className="relative h-80">
                                <img
                                    src={teacher.avatar}
                                    alt={teacher.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                {/* Rating */}
                                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm">
                                    <Star className="w-5 h-5 text-[var(--color-accent-500)] fill-[var(--color-accent-500)]" />
                                    <span className="font-bold text-gray-900">{teacher.rating}</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-6">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {teacher.name}
                                </h1>

                                {/* Subjects */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {teacher.subjects.map((subject) => (
                                        <span
                                            key={subject}
                                            className="px-3 py-1 rounded-full bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)] text-sm font-medium"
                                        >
                                            {subject}
                                        </span>
                                    ))}
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-3 rounded-[var(--radius-lg)] bg-gray-50">
                                        <div className="text-2xl font-bold text-[var(--color-primary-500)]">
                                            {teacher.studentsCount.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-500">Students</div>
                                    </div>
                                    <div className="text-center p-3 rounded-[var(--radius-lg)] bg-gray-50">
                                        <div className="text-2xl font-bold text-[var(--color-primary-500)]">
                                            {teacher.coursesCount}
                                        </div>
                                        <div className="text-xs text-gray-500">Courses</div>
                                    </div>
                                    <div className="text-center p-3 rounded-[var(--radius-lg)] bg-gray-50">
                                        <div className="text-2xl font-bold text-[var(--color-primary-500)]">
                                            {teacher.yearsExperience}+
                                        </div>
                                        <div className="text-xs text-gray-500">Years</div>
                                    </div>
                                </div>

                                {/* CTA */}
                                <Button className="w-full" leftIcon={<MessageCircle className="w-5 h-5" />}>
                                    Contact for Enrollment
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        {/* About Section */}
                        <div className="bg-white rounded-[var(--radius-2xl)] p-8 shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                About
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {teacher.bio}
                            </p>
                        </div>

                        {/* Introduction Video */}
                        {teacher.introVideoUrl && (
                            <div className="bg-white rounded-[var(--radius-2xl)] p-8 shadow-lg">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    Introduction Video
                                </h2>
                                <div className="relative aspect-video rounded-[var(--radius-xl)] overflow-hidden bg-gray-100 group cursor-pointer">
                                    <img
                                        src={teacher.avatar}
                                        alt="Video thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                                        <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Play className="w-8 h-8 text-[var(--color-primary-500)] ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Courses Section */}
                        <div className="bg-white rounded-[var(--radius-2xl)] p-8 shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Courses by {teacher.name.split(' ')[0]}
                            </h2>

                            {teacherCourses.length > 0 ? (
                                <div className="space-y-4">
                                    {teacherCourses.map((course, index) => (
                                        <motion.div
                                            key={course.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * index, duration: 0.3 }}
                                            className="group flex gap-4 p-4 rounded-[var(--radius-xl)] border border-gray-100 hover:border-[var(--color-primary-500)] hover:shadow-md transition-all cursor-pointer"
                                        >
                                            {/* Thumbnail */}
                                            <div className="w-32 h-24 rounded-[var(--radius-lg)] overflow-hidden flex-shrink-0">
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-[var(--color-primary-500)] transition-colors mb-1 truncate">
                                                    {course.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                    {course.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <BookOpen className="w-4 h-4" />
                                                        {course.lessonsCount} lessons
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {course.duration}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        {course.enrolledCount}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right flex-shrink-0">
                                                <div className="text-2xl font-bold text-[var(--color-primary-500)]">
                                                    ${course.price}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Star className="w-3 h-3 text-[var(--color-accent-500)] fill-[var(--color-accent-500)]" />
                                                    {course.rating}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No courses available yet.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
