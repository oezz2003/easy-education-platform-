'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, Clock, Users, BookOpen, Search, Filter, Play, ArrowRight } from 'lucide-react';
import { subjects, levels } from '@/lib/mock-data';

// Mock courses data
const courses = [
    {
        id: '1',
        title: 'Advanced Mathematics',
        subject: 'Mathematics',
        subjectIcon: '/ASSITS/calc.png',
        level: 'primary',
        levelName: 'Primary',
        duration: '15 hours',
        lessonsCount: 45,
        price: 299,
        originalPrice: 499,
        rating: 4.9,
        studentsCount: 1250,
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800',
        teacher: { name: 'Ahmed Hassan', avatar: 'https://i.pravatar.cc/150?img=11' },
    },
    {
        id: '2',
        title: 'Physics Fundamentals',
        subject: 'Physics',
        subjectIcon: '/ASSITS/chemstry.png',
        level: 'preparatory',
        levelName: 'Preparatory',
        duration: '20 hours',
        lessonsCount: 60,
        price: 349,
        originalPrice: 599,
        rating: 4.8,
        studentsCount: 980,
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
        teacher: { name: 'Sara Ali', avatar: 'https://i.pravatar.cc/150?img=5' },
    },
    {
        id: '3',
        title: 'English Grammar Mastery',
        subject: 'English',
        subjectIcon: '/ASSITS/text bubble.png',
        level: 'primary',
        levelName: 'Primary',
        duration: '12 hours',
        lessonsCount: 35,
        price: 199,
        originalPrice: 399,
        rating: 4.7,
        studentsCount: 2100,
        thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
        teacher: { name: 'Mohamed Farid', avatar: 'https://i.pravatar.cc/150?img=12' },
    },
    {
        id: '4',
        title: 'Chemistry for Beginners',
        subject: 'Chemistry',
        subjectIcon: '/ASSITS/chemstry.png',
        level: 'secondary',
        levelName: 'Secondary',
        duration: '18 hours',
        lessonsCount: 50,
        price: 399,
        originalPrice: 699,
        rating: 4.9,
        studentsCount: 750,
        thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
        teacher: { name: 'Fatma Nour', avatar: 'https://i.pravatar.cc/150?img=9' },
    },
    {
        id: '5',
        title: 'Geography Exploration',
        subject: 'Geography',
        subjectIcon: '/ASSITS/global.png',
        level: 'preparatory',
        levelName: 'Preparatory',
        duration: '10 hours',
        lessonsCount: 30,
        price: 179,
        originalPrice: 349,
        rating: 4.6,
        studentsCount: 620,
        thumbnail: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800',
        teacher: { name: 'Khaled Ibrahim', avatar: 'https://i.pravatar.cc/150?img=15' },
    },
    {
        id: '6',
        title: 'Creative Art Workshop',
        subject: 'Art',
        subjectIcon: '/ASSITS/art.png',
        level: 'primary',
        levelName: 'Primary',
        duration: '8 hours',
        lessonsCount: 25,
        price: 149,
        originalPrice: 299,
        rating: 4.8,
        studentsCount: 890,
        thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
        teacher: { name: 'Laila Hassan', avatar: 'https://i.pravatar.cc/150?img=20' },
    },
];

export default function CoursesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

    const filteredCourses = courses.filter((course) => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = !selectedSubject || course.subject.toLowerCase() === selectedSubject.toLowerCase();
        const matchesLevel = !selectedLevel || course.level === selectedLevel;
        return matchesSearch && matchesSubject && matchesLevel;
    });

    return (
        <div className="min-h-screen pt-24 pb-16 relative overflow-hidden bg-gradient-to-b from-[var(--color-primary-50)] via-white to-white">
            {/* Background Decorations */}
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 top-20 w-[250px] opacity-30 pointer-events-none"
            />
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-0 top-40 w-[200px] opacity-20 pointer-events-none scale-x-[-1]"
            />
            <motion.img
                src="/ASSITS/TREE.png"
                alt=""
                className="absolute left-[3%] bottom-0 w-[100px] opacity-40 pointer-events-none"
            />
            <motion.img
                src="/ASSITS/TREE.png"
                alt=""
                className="absolute right-[5%] bottom-0 w-[80px] opacity-30 pointer-events-none scale-x-[-1]"
            />

            {/* Floating 3D Icons */}
            <motion.img
                src="/ASSITS/play.png"
                alt=""
                animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[15%] right-[10%] w-16 opacity-60 pointer-events-none hidden lg:block"
            />

            <div className="container relative z-10">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)] text-sm font-medium mb-4">
                        Browse Courses
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900">
                        Explore Our <span className="text-gradient-brand">Courses</span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Discover a wide variety of courses designed to help you excel in your studies.
                    </p>
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-12"
                >
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto mb-8">
                        <div className="absolute inset-0 rounded-full bg-white/50 backdrop-blur-sm shadow-xl" />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="relative w-full pl-14 pr-6 py-4 rounded-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] z-10"
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                        {/* Level Filters */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Filter className="w-4 h-4" />
                                <span className="text-sm font-medium">Level:</span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedLevel(null)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedLevel
                                    ? 'bg-[var(--color-primary-500)] text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                All
                            </motion.button>
                            {levels.map((level) => (
                                <motion.button
                                    key={level.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedLevel(selectedLevel === level.id ? null : level.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedLevel === level.id
                                        ? 'bg-[var(--color-primary-500)] text-white shadow-lg'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {level.name}
                                </motion.button>
                            ))}
                        </div>

                        {/* Subject Filters */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 text-gray-600">
                                <BookOpen className="w-4 h-4" />
                                <span className="text-sm font-medium">Subject:</span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedSubject(null)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedSubject
                                    ? 'bg-[var(--color-accent-500)] text-[var(--color-primary-700)] shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                All
                            </motion.button>
                            {subjects.slice(0, 6).map((subject) => (
                                <motion.button
                                    key={subject.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedSubject(selectedSubject === subject.name ? null : subject.name)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${selectedSubject === subject.name
                                        ? 'bg-[var(--color-accent-500)] text-[var(--color-primary-700)] shadow-lg'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    <span>{subject.icon}</span>
                                    {subject.name}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Courses Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.5 }}
                        >
                            <Link href={`/courses/${course.id}`}>
                                <motion.div
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border-2 border-gray-100 hover:border-[var(--color-primary-200)]"
                                >
                                    {/* 3D Subject Icon - Floating */}
                                    <motion.div
                                        animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                        className="absolute top-4 left-4 w-12 h-12 z-20"
                                    >
                                        <img
                                            src={course.subjectIcon}
                                            alt={course.subject}
                                            className="w-full h-full object-contain drop-shadow-xl"
                                        />
                                    </motion.div>

                                    {/* Cloud Shadow */}
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-gray-200/50 rounded-full blur-xl" />

                                    {/* Thumbnail */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                        {/* Play Button */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl"
                                            >
                                                <Play className="w-6 h-6 text-[var(--color-primary-500)] ml-1" />
                                            </motion.div>
                                        </div>

                                        {/* Price Badge */}
                                        <div className="absolute bottom-4 left-4">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-white">${course.price}</span>
                                                <span className="text-sm text-white/70 line-through">${course.originalPrice}</span>
                                            </div>
                                        </div>

                                        {/* Rating Badge */}
                                        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
                                            <Star className="w-4 h-4 text-[var(--color-accent-500)] fill-[var(--color-accent-500)]" />
                                            <span className="text-sm font-bold text-gray-900">{course.rating}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Level Badge */}
                                        <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-primary-500)]/10 text-[var(--color-primary-600)] text-xs font-medium mb-3">
                                            {course.levelName}
                                        </span>

                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--color-primary-500)] transition-colors">
                                            {course.title}
                                        </h3>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="w-4 h-4" />
                                                <span>{course.lessonsCount} lessons</span>
                                            </div>
                                        </div>

                                        {/* Teacher */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={course.teacher.avatar}
                                                    alt={course.teacher.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <span className="text-sm text-gray-600">{course.teacher.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Users className="w-4 h-4" />
                                                <span>{course.studentsCount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* No Results */}
                {filteredCourses.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <motion.img
                            src="/ASSITS/folders.png"
                            alt=""
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-24 h-24 mx-auto mb-4 opacity-50"
                        />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No courses found
                        </h3>
                        <p className="text-gray-600">
                            Try adjusting your search or filters.
                        </p>
                    </motion.div>
                )}

                {/* Load More */}
                {filteredCourses.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-center mt-12"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-full border-2 border-[var(--color-primary-500)] text-[var(--color-primary-500)] font-bold hover:bg-[var(--color-primary-500)] hover:text-white transition-all flex items-center gap-2 mx-auto"
                        >
                            Load More Courses
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
