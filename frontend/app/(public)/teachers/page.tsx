'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, Users, BookOpen, Search, Filter, ArrowRight } from 'lucide-react';
import { teachers, subjects, levels } from '@/lib/mock-data';

// Map subjects to 3D icons
const subjectIcons: { [key: string]: string } = {
    'Mathematics': '/ASSITS/calc.png',
    'Science': '/ASSITS/chemstry.png',
    'Arabic': '/ASSITS/text bubble.png',
    'English': '/ASSITS/text bubble.png',
    'Physics': '/ASSITS/chemstry.png',
    'Chemistry': '/ASSITS/chemstry.png',
    'Biology': '/ASSITS/chemstry.png',
    'History': '/ASSITS/global.png',
    'Geography': '/ASSITS/global.png',
    'Art': '/ASSITS/art.png',
};

export default function TeachersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

    const filteredTeachers = teachers.filter((teacher) => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesSubject = !selectedSubject || teacher.subjects.some((s) => s.toLowerCase().includes(selectedSubject.toLowerCase()));
        const matchesLevel = !selectedLevel || teacher.levelIds.includes(selectedLevel);
        return matchesSearch && matchesSubject && matchesLevel;
    });

    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 relative overflow-hidden bg-gradient-to-b from-[var(--color-primary-50)] via-white to-white">
            {/* Background Decorations - responsive */}
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                loading="lazy"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 top-20 w-[150px] sm:w-[200px] md:w-[250px] opacity-30 pointer-events-none"
            />
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                loading="lazy"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-0 top-40 w-[120px] sm:w-[160px] md:w-[200px] opacity-20 pointer-events-none scale-x-[-1]"
            />
            <motion.img
                src="/ASSITS/TREE.png"
                alt=""
                loading="lazy"
                className="absolute left-[3%] bottom-0 w-[60px] sm:w-[80px] md:w-[100px] opacity-40 pointer-events-none hidden sm:block"
            />
            <motion.img
                src="/ASSITS/TREE.png"
                alt=""
                loading="lazy"
                className="absolute right-[5%] bottom-0 w-[50px] sm:w-[60px] md:w-[80px] opacity-30 pointer-events-none scale-x-[-1] hidden sm:block"
            />

            {/* Floating 3D Icons */}
            <motion.img
                src="/ASSITS/gradution.png"
                alt=""
                loading="lazy"
                animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[15%] right-[10%] w-12 md:w-16 opacity-60 pointer-events-none hidden lg:block"
            />

            <div className="container relative z-10 px-4 sm:px-6">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8 sm:mb-12"
                >
                    <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[var(--color-accent-500)]/10 text-[var(--color-accent-600)] text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                        Expert Educators
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-gray-900">
                        Our <span className="text-gradient-brand">Expert Teachers</span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">
                        Find the perfect teacher for your learning journey.
                    </p>
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-8 sm:mb-12"
                >
                    {/* Search Bar - Glassmorphism Style */}
                    <div className="relative max-w-2xl mx-auto mb-6 sm:mb-8">
                        <div className="absolute inset-0 rounded-full bg-white/50 backdrop-blur-sm shadow-xl" />
                        <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 z-10" />
                        <input
                            type="text"
                            placeholder="Search by name or subject..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="relative w-full pl-11 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 rounded-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] z-10 text-sm sm:text-base"
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/50">
                        {/* Level Filters */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600 w-full sm:w-auto mb-2 sm:mb-0">
                                <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="text-xs sm:text-sm font-medium">Level:</span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedLevel(null)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${!selectedLevel
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
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${selectedLevel === level.id
                                        ? 'bg-[var(--color-primary-500)] text-white shadow-lg'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {level.name}
                                </motion.button>
                            ))}
                        </div>

                        {/* Subject Filters */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600 w-full sm:w-auto mb-2 sm:mb-0">
                                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="text-xs sm:text-sm font-medium">Subject:</span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedSubject(null)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${!selectedSubject
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
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 ${selectedSubject === subject.name
                                        ? 'bg-[var(--color-accent-500)] text-[var(--color-primary-700)] shadow-lg'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    <span className="text-sm sm:text-base">{subject.icon}</span>
                                    <span className="hidden sm:inline">{subject.name}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Teachers Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {filteredTeachers.map((teacher, index) => {
                        const subjectIcon = subjectIcons[teacher.subjects[0]] || '/ASSITS/global.png';

                        return (
                            <motion.div
                                key={teacher.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.5 }}
                            >
                                <Link href={`/teachers/${teacher.id}`}>
                                    <motion.div
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                        className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border-2 border-gray-100 hover:border-[var(--color-primary-200)]"
                                    >
                                        {/* 3D Subject Icon - Floating */}
                                        <motion.div
                                            animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                            className="absolute top-3 sm:top-4 left-3 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 z-20"
                                        >
                                            <img
                                                src={subjectIcon}
                                                alt={teacher.subjects[0]}
                                                loading="lazy"
                                                className="w-full h-full object-contain drop-shadow-xl"
                                            />
                                        </motion.div>

                                        {/* Cloud Shadow */}
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-gray-200/50 rounded-full blur-xl" />

                                        {/* Image */}
                                        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-b from-[var(--color-primary-100)] to-white">
                                            <img
                                                src={teacher.avatar}
                                                alt={teacher.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

                                            {/* Rating Badge */}
                                            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
                                                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--color-accent-500)] fill-[var(--color-accent-500)]" />
                                                <span className="text-xs sm:text-sm font-bold text-gray-900">
                                                    {teacher.rating}
                                                </span>
                                            </div>

                                            {/* Experience Badge */}
                                            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[var(--color-primary-500)] text-white text-xs sm:text-sm font-medium shadow-lg">
                                                {teacher.yearsExperience}+ years
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 sm:p-5 md:p-6">
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                                {teacher.name}
                                            </h3>

                                            {/* Subjects */}
                                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                                {teacher.subjects.map((subject) => (
                                                    <span
                                                        key={subject}
                                                        className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[var(--color-primary-500)]/10 text-[var(--color-primary-600)] text-xs sm:text-sm font-medium"
                                                    >
                                                        {subject}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span>{teacher.studentsCount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span>{teacher.coursesCount} courses</span>
                                                </div>
                                            </div>

                                            {/* View Profile */}
                                            <motion.div
                                                whileHover={{ x: 5 }}
                                                className="flex items-center gap-1.5 sm:gap-2 text-[var(--color-primary-500)] font-semibold text-sm sm:text-base"
                                            >
                                                <span>View Profile</span>
                                                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* No Results */}
                {filteredTeachers.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 sm:py-16"
                    >
                        <motion.img
                            src="/ASSITS/global.png"
                            alt=""
                            loading="lazy"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 opacity-50"
                        />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                            No teachers found
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Try adjusting your search or filters.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
