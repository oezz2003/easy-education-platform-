'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { levels, subjects } from '@/lib/mock-data';

// Map levels to 3D icons
const levelIcons: { [key: string]: string } = {
    'primary': '/ASSITS/art.png',
    'preparatory': '/ASSITS/global.png',
    'secondary': '/ASSITS/gradution.png',
};

// Map subjects to 3D icons
const subjectIcons: { [key: string]: string } = {
    'math': '/ASSITS/calc.png',
    'science': '/ASSITS/chemstry.png',
    'arabic': '/ASSITS/text bubble.png',
    'english': '/ASSITS/text bubble.png',
    'physics': '/ASSITS/chemstry.png',
    'chemistry': '/ASSITS/chemstry.png',
    'biology': '/ASSITS/chemstry.png',
    'history': '/ASSITS/global.png',
    'geography': '/ASSITS/global.png',
    'art': '/ASSITS/art.png',
};

const levelColors: { [key: string]: { bg: string; border: string; pill: string } } = {
    'primary': { bg: 'bg-emerald-50', border: 'border-emerald-300', pill: 'bg-emerald-100 text-emerald-700' },
    'preparatory': { bg: 'bg-blue-50', border: 'border-blue-300', pill: 'bg-blue-100 text-blue-700' },
    'secondary': { bg: 'bg-amber-50', border: 'border-amber-300', pill: 'bg-amber-100 text-amber-700' },
};

export default function LevelsPage() {
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

    const filteredSubjects = selectedLevel
        ? subjects.filter((s) => s.levelId === selectedLevel || s.levelId === 'all')
        : subjects;

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

            <div className="container relative z-10">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)] text-sm font-medium mb-4">
                        Educational Levels
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900">
                        Explore <span className="text-gradient-brand">Learning Paths</span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Choose your educational level and discover courses tailored to your grade.
                    </p>
                </motion.div>

                {/* Levels Grid - Floating Island Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="grid md:grid-cols-3 gap-8 mb-16"
                >
                    {levels.map((level, index) => {
                        const colors = levelColors[level.id] || levelColors['primary'];
                        const icon = levelIcons[level.id] || '/ASSITS/art.png';

                        return (
                            <motion.button
                                key={level.id}
                                onClick={() => setSelectedLevel(selectedLevel === level.id ? null : level.id)}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.5 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className={`relative p-8 rounded-3xl border-2 transition-all duration-300 text-left ${selectedLevel === level.id
                                        ? `${colors.border} ${colors.bg} shadow-2xl ring-4 ring-[var(--color-accent-500)]`
                                        : `border-gray-200 bg-white hover:${colors.border} hover:shadow-xl`
                                    }`}
                            >
                                {/* Cloud shadow beneath */}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-gray-200/50 rounded-full blur-xl" />

                                {/* Selected Indicator */}
                                {selectedLevel === level.id && (
                                    <motion.div
                                        layoutId="selectedIndicator"
                                        className="absolute top-4 right-4 w-4 h-4 rounded-full bg-[var(--color-accent-500)]"
                                    />
                                )}

                                {/* 3D Icon */}
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                    className="w-20 h-20 mb-6"
                                >
                                    <img
                                        src={icon}
                                        alt={level.name}
                                        className="w-full h-full object-contain drop-shadow-xl"
                                    />
                                </motion.div>

                                {/* Content */}
                                <h2 className="text-2xl font-bold mb-1 text-gray-900">
                                    {level.name}
                                </h2>
                                <p className="text-sm text-gray-500 mb-3">
                                    {level.nameAr}
                                </p>
                                <p className="text-gray-600 mb-5">
                                    {level.description}
                                </p>

                                {/* Grades Pills */}
                                <div className="flex flex-wrap gap-2">
                                    {level.grades.map((grade) => (
                                        <span
                                            key={grade}
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${colors.pill}`}
                                        >
                                            {grade}
                                        </span>
                                    ))}
                                </div>
                            </motion.button>
                        );
                    })}
                </motion.div>

                {/* Subjects Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-2 h-8 rounded-full bg-[var(--color-primary-500)]" />
                        <h2 className="text-2xl font-bold text-gray-900">
                            {selectedLevel
                                ? `Subjects for ${levels.find((l) => l.id === selectedLevel)?.name}`
                                : 'All Subjects'}
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {filteredSubjects.map((subject, index) => {
                            const icon = subjectIcons[subject.id] || '/ASSITS/global.png';

                            return (
                                <motion.div
                                    key={subject.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * index, duration: 0.3 }}
                                >
                                    <Link href={`/teachers?subject=${subject.id}`}>
                                        <motion.div
                                            whileHover={{ y: -8, scale: 1.02 }}
                                            className="group p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-[var(--color-primary-300)] hover:shadow-xl transition-all duration-300"
                                        >
                                            {/* 3D Icon */}
                                            <motion.div
                                                animate={{ y: [0, -3, 0] }}
                                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                                className="w-14 h-14 mb-4"
                                            >
                                                <img
                                                    src={icon}
                                                    alt={subject.name}
                                                    className="w-full h-full object-contain drop-shadow-lg"
                                                />
                                            </motion.div>

                                            <h3 className="font-bold text-gray-900 group-hover:text-[var(--color-primary-500)] transition-colors mb-1">
                                                {subject.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-3">
                                                {subject.nameAr}
                                            </p>

                                            <div className="flex items-center gap-2 text-[var(--color-primary-500)] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                <BookOpen className="w-4 h-4" />
                                                <span>View Courses</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-center mt-16"
                >
                    <Link href="/teachers">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-full bg-[var(--color-primary-500)] text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 mx-auto"
                        >
                            Browse All Teachers
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
