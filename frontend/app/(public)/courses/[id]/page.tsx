'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    ChevronDown,
    ChevronRight,
    Play,
    Clock,
    Trophy,
    FileText,
    Eye,
    CheckCircle,
    ShieldCheck,
    Headphones,
    ArrowRight,
    Star,
    Users
} from 'lucide-react';

// Mock course data
const course = {
    id: '1',
    title: 'Advanced Mathematics',
    titleAr: 'الرياضيات المتقدمة',
    description: 'Master advanced mathematical concepts with our comprehensive course. From algebra to calculus, learn everything you need to excel.',
    level: 'primary',
    levelName: 'Primary',
    subject: 'Mathematics',
    subjectIcon: '/ASSITS/calc.png',
    duration: '15 hours',
    lessonsCount: 45,
    resourcesCount: 10,
    difficulty: 'Intermediate',
    price: 299,
    originalPrice: 499,
    rating: 4.9,
    studentsCount: 1250,
    teacher: {
        id: '1',
        name: 'Ahmed Hassan',
        avatar: 'https://i.pravatar.cc/150?img=11',
        title: 'Senior Math Instructor',
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    curriculum: [
        {
            id: '1',
            title: 'Introduction to Advanced Math',
            lessons: [
                { id: '1-1', title: 'Course Overview', duration: '5 min', isPreview: true },
                { id: '1-2', title: 'Setting Up Your Study Plan', duration: '10 min', isPreview: true },
                { id: '1-3', title: 'Understanding Mathematical Thinking', duration: '15 min', isPreview: false },
            ]
        },
        {
            id: '2',
            title: 'Algebra Fundamentals',
            lessons: [
                { id: '2-1', title: 'Variables and Expressions', duration: '20 min', isPreview: false },
                { id: '2-2', title: 'Linear Equations', duration: '25 min', isPreview: false },
                { id: '2-3', title: 'Quadratic Equations', duration: '30 min', isPreview: false },
                { id: '2-4', title: 'Practice Problems', duration: '15 min', isPreview: false },
            ]
        },
        {
            id: '3',
            title: 'Geometry Basics',
            lessons: [
                { id: '3-1', title: 'Points, Lines, and Planes', duration: '20 min', isPreview: true },
                { id: '3-2', title: 'Angles and Triangles', duration: '25 min', isPreview: false },
                { id: '3-3', title: 'Circles and Polygons', duration: '30 min', isPreview: false },
            ]
        },
        {
            id: '4',
            title: 'Introduction to Calculus',
            lessons: [
                { id: '4-1', title: 'Limits and Continuity', duration: '30 min', isPreview: false },
                { id: '4-2', title: 'Derivatives Basics', duration: '35 min', isPreview: false },
                { id: '4-3', title: 'Integration Introduction', duration: '40 min', isPreview: false },
            ]
        },
    ]
};

export default function CourseDetailsPage() {
    const [openModules, setOpenModules] = useState<string[]>([course.curriculum[0].id]);

    const toggleModule = (moduleId: string) => {
        setOpenModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const totalLessons = course.curriculum.reduce((acc, module) => acc + module.lessons.length, 0);

    return (
        <div className="min-h-screen pt-20 pb-16 relative overflow-hidden bg-gradient-to-b from-[var(--color-primary-100)] via-[var(--color-primary-50)] to-white">
            {/* Background Decorations */}
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                loading="lazy"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 top-20 w-[250px] opacity-30 pointer-events-none"
            />
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                loading="lazy"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-0 top-60 w-[200px] opacity-20 pointer-events-none scale-x-[-1]"
            />

            {/* Hero Section */}
            <div className="container relative z-10">
                <div className="pt-8 pb-12">
                    {/* Breadcrumbs */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-sm text-gray-600 mb-6"
                    >
                        <Link href="/" className="hover:text-[var(--color-primary-500)]">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/levels" className="hover:text-[var(--color-primary-500)]">{course.levelName}</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[var(--color-primary-500)] font-medium">{course.subject}</span>
                    </motion.div>

                    {/* Hero Content */}
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Left - Title & 3D Icon */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex-1"
                        >
                            <div className="flex items-start gap-6">
                                {/* 3D Subject Icon */}
                                <motion.div
                                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0"
                                >
                                    <img
                                        src={course.subjectIcon}
                                        alt={course.subject}
                                        loading="lazy"
                                        className="w-full h-full object-contain drop-shadow-2xl"
                                    />
                                </motion.div>

                                <div>
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                                        {course.title}
                                    </h1>
                                    <p className="text-lg text-gray-600 mb-4 max-w-2xl">
                                        {course.description}
                                    </p>

                                    {/* Teacher Info */}
                                    <Link href={`/teachers/${course.teacher.id}`}>
                                        <div className="inline-flex items-center gap-3 p-2 pr-4 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                                            <img
                                                src={course.teacher.avatar}
                                                alt={course.teacher.name}
                                                loading="lazy"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">{course.teacher.name}</p>
                                                <p className="text-xs text-gray-500">{course.teacher.title}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Quick Stats Bar - Glassmorphism */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 mb-12"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Duration */}
                        <div className="flex items-center gap-4">
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <img src="/ASSITS/watch.png" alt="Duration" loading="lazy" className="w-12 h-12 object-contain" />
                            </motion.div>
                            <div>
                                <p className="text-sm text-gray-500">Duration</p>
                                <p className="font-bold text-gray-900">{course.duration}</p>
                            </div>
                        </div>

                        {/* Difficulty */}
                        <div className="flex items-center gap-4">
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <img src="/ASSITS/cup.png" alt="Level" loading="lazy" className="w-12 h-12 object-contain" />
                            </motion.div>
                            <div>
                                <p className="text-sm text-gray-500">Difficulty</p>
                                <p className="font-bold text-gray-900">{course.difficulty}</p>
                            </div>
                        </div>

                        {/* Resources */}
                        <div className="flex items-center gap-4">
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <img src="/ASSITS/folders.png" alt="Resources" loading="lazy" className="w-12 h-12 object-contain" />
                            </motion.div>
                            <div>
                                <p className="text-sm text-gray-500">Resources</p>
                                <p className="font-bold text-gray-900">{course.resourcesCount} PDFs</p>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-500)] flex items-center justify-center">
                                <Star className="w-6 h-6 text-white fill-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Rating</p>
                                <p className="font-bold text-gray-900">{course.rating} ({course.studentsCount}+ students)</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left - Curriculum */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-2 h-8 rounded-full bg-[var(--color-primary-500)]" />
                                <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
                                <span className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-600">
                                    {totalLessons} lessons
                                </span>
                            </div>

                            {/* Accordion */}
                            <div className="space-y-4">
                                {course.curriculum.map((module, moduleIndex) => (
                                    <motion.div
                                        key={module.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * moduleIndex }}
                                        className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-lg"
                                    >
                                        {/* Module Header */}
                                        <button
                                            onClick={() => toggleModule(module.id)}
                                            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-500)]/10 flex items-center justify-center text-[var(--color-primary-500)] font-bold">
                                                    {moduleIndex + 1}
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="font-bold text-gray-900">{module.title}</h3>
                                                    <p className="text-sm text-gray-500">{module.lessons.length} lessons</p>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: openModules.includes(module.id) ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            </motion.div>
                                        </button>

                                        {/* Lessons List */}
                                        <AnimatePresence>
                                            {openModules.includes(module.id) && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="border-t border-gray-100"
                                                >
                                                    <div className="p-4 space-y-2">
                                                        {module.lessons.map((lesson, lessonIndex) => (
                                                            <div
                                                                key={lesson.id}
                                                                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                                        <Play className="w-4 h-4 text-gray-400" />
                                                                    </div>
                                                                    <span className="text-gray-700">{lesson.title}</span>
                                                                    {lesson.isPreview && (
                                                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-accent-500)]/10 text-[var(--color-accent-600)] text-xs font-medium">
                                                                            <Eye className="w-3 h-3" />
                                                                            Preview
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-sm text-gray-500">{lesson.duration}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right - Sticky Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
                            >
                                {/* Video Preview */}
                                <div className="relative aspect-video bg-gray-900 rounded-t-3xl overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl"
                                        >
                                            <Play className="w-8 h-8 text-[var(--color-primary-500)] ml-1" />
                                        </motion.button>
                                    </div>
                                    <img
                                        src="https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800"
                                        alt="Course preview"
                                        loading="lazy"
                                        className="w-full h-full object-cover opacity-50"
                                    />
                                </div>

                                {/* Price & CTA */}
                                <div className="p-6">
                                    {/* Price */}
                                    <div className="flex items-baseline gap-3 mb-4">
                                        <span className="text-4xl font-bold text-gray-900">${course.price}</span>
                                        <span className="text-xl text-gray-400 line-through">${course.originalPrice}</span>
                                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium">
                                            {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                                        </span>
                                    </div>

                                    {/* CTA Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 rounded-2xl bg-[var(--color-primary-500)] text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 mb-4"
                                    >
                                        Enroll Now
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.button>

                                    {/* Guarantees */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <motion.div
                                                animate={{ y: [0, -3, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                            >
                                                <img src="/ASSITS/lock.png" alt="Secure" loading="lazy" className="w-8 h-8 object-contain" />
                                            </motion.div>
                                            <span>30-day money-back guarantee</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-500)]/10 flex items-center justify-center">
                                                <Headphones className="w-4 h-4 text-[var(--color-primary-500)]" />
                                            </div>
                                            <span>24/7 technical support</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-500)]/10 flex items-center justify-center">
                                                <CheckCircle className="w-4 h-4 text-[var(--color-primary-500)]" />
                                            </div>
                                            <span>Lifetime access</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
