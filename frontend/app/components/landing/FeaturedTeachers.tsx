'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { teachers } from '@/lib/mock-data';
import Button from '@/app/components/ui/Button';

// Map teachers to their 3D subject assets
const teacherAssets: { [key: string]: string } = {
    'Mathematics': '/ASSITS/calc.png',
    'Physics': '/ASSITS/chemstry.png',
    'Chemistry': '/ASSITS/chemstry.png',
    'Biology': '/ASSITS/chemstry.png',
    'Arabic': '/ASSITS/text bubble.png',
    'English': '/ASSITS/text bubble.png',
    'Geography': '/ASSITS/global.png',
    'History': '/ASSITS/global.png',
    'Art': '/ASSITS/art.png',
};

export default function FeaturedTeachers() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Horizontal translation - starts at 0 and moves left
    const translateX = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

    // Parallax for background elements
    const cloudY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
    const treeY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);

    return (
        <div ref={containerRef} className="relative h-[200vh]">
            {/* Sticky Container */}
            <div className="sticky top-0 h-screen overflow-hidden bg-gradient-to-b from-[var(--color-primary-50)] via-white to-[var(--color-primary-50)]">

                {/* Background Depth Elements */}
                <motion.img
                    src="/ASSITS/CLOUD.png"
                    alt=""
                    style={{ y: cloudY }}
                    className="absolute left-[10%] top-10 w-[200px] opacity-20 pointer-events-none"
                />
                <motion.img
                    src="/ASSITS/CLOUD.png"
                    alt=""
                    style={{ y: cloudY }}
                    className="absolute right-[5%] top-20 w-[250px] opacity-15 pointer-events-none scale-x-[-1]"
                />
                <motion.img
                    src="/ASSITS/TREE.png"
                    alt=""
                    style={{ y: treeY }}
                    className="absolute left-0 bottom-0 w-[120px] opacity-30 pointer-events-none"
                />
                <motion.img
                    src="/ASSITS/TREE.png"
                    alt=""
                    style={{ y: treeY }}
                    className="absolute right-0 bottom-0 w-[100px] opacity-25 pointer-events-none scale-x-[-1]"
                />

                {/* Main Content */}
                <div className="h-full flex flex-col justify-center">

                    {/* Section Header */}
                    <div className="container relative z-10 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <span className="inline-block px-4 py-2 rounded-full bg-[var(--color-accent-500)]/10 text-[var(--color-accent-600)] text-sm font-medium mb-4">
                                Expert Educators
                            </span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                                Meet Our <span className="text-gradient-brand">Featured Teachers</span>
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                                Learn from certified professionals with years of experience in their subjects.
                            </p>
                        </motion.div>
                    </div>

                    {/* Horizontal Floating Teachers Track */}
                    <div className="relative flex-1 overflow-hidden">
                        <motion.div
                            style={{ x: translateX }}
                            className="absolute inset-y-0 flex items-center gap-12 pl-[5vw]"
                        >
                            {teachers.map((teacher, index) => {
                                const subjectAsset = teacherAssets[teacher.subjects[0]] || '/ASSITS/global.png';
                                const isEven = index % 2 === 0;

                                return (
                                    <div
                                        key={teacher.id}
                                        className="relative flex-shrink-0"
                                    >
                                        <Link href={`/teachers/${teacher.id}`}>
                                            <div className="group relative flex items-end gap-4">

                                                {/* 3D Subject Asset - Floating beside teacher */}
                                                <motion.div
                                                    animate={{
                                                        y: [0, -10, 0],
                                                        rotate: isEven ? [0, 5, 0] : [0, -5, 0]
                                                    }}
                                                    transition={{
                                                        duration: 3 + index * 0.5,
                                                        repeat: Infinity,
                                                        ease: 'easeInOut'
                                                    }}
                                                    className={`absolute ${isEven ? '-left-12 top-4' : '-right-12 top-4'} w-16 h-16 z-20`}
                                                >
                                                    <img
                                                        src={subjectAsset}
                                                        alt={teacher.subjects[0]}
                                                        className="w-full h-full object-contain drop-shadow-2xl"
                                                    />
                                                </motion.div>

                                                {/* Background Cloud for Depth */}
                                                <motion.img
                                                    src="/ASSITS/CLOUD.png"
                                                    alt=""
                                                    animate={{ x: [0, 5, 0] }}
                                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                                    className="absolute -z-10 -bottom-6 left-1/2 -translate-x-1/2 w-[180px] opacity-40"
                                                />

                                                {/* Teacher Card */}
                                                <motion.div
                                                    whileHover={{ y: -10, scale: 1.02 }}
                                                    transition={{ type: 'spring', stiffness: 300 }}
                                                    className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 w-[260px]"
                                                >
                                                    {/* Teacher Image - Cutout Style */}
                                                    <div className="relative h-64 overflow-hidden bg-gradient-to-b from-[var(--color-primary-100)] to-white">
                                                        <motion.img
                                                            src={teacher.avatar}
                                                            alt={teacher.name}
                                                            className="w-full h-full object-cover object-top"
                                                            whileHover={{ scale: 1.05 }}
                                                            transition={{ duration: 0.5 }}
                                                        />

                                                        {/* Gradient Fade at bottom */}
                                                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />

                                                        {/* Rating Badge */}
                                                        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
                                                            <Star className="w-4 h-4 text-[var(--color-accent-500)] fill-[var(--color-accent-500)]" />
                                                            <span className="font-bold text-gray-900">{teacher.rating}</span>
                                                        </div>
                                                    </div>

                                                    {/* Teacher Info */}
                                                    <div className="p-5 -mt-2 relative z-10">
                                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{teacher.name}</h3>

                                                        {/* Subjects */}
                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                            {teacher.subjects.map((subject) => (
                                                                <span
                                                                    key={subject}
                                                                    className="px-2 py-0.5 rounded-full bg-[var(--color-primary-500)]/10 text-[var(--color-primary-600)] text-xs font-medium"
                                                                >
                                                                    {subject}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        {/* Stats */}
                                                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                                            <span>{teacher.studentsCount.toLocaleString()} students</span>
                                                            <span>•</span>
                                                            <span>{teacher.coursesCount} courses</span>
                                                        </div>

                                                        {/* View Profile */}
                                                        <motion.div
                                                            whileHover={{ x: 5 }}
                                                            className="flex items-center gap-2 text-[var(--color-primary-500)] font-semibold text-sm"
                                                        >
                                                            <span>View Profile</span>
                                                            <ArrowRight className="w-4 h-4" />
                                                        </motion.div>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}

                            {/* View All Card at the end */}
                            <div className="flex-shrink-0 flex items-center justify-center w-[260px] h-[360px]">
                                <Link href="/teachers">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-8 rounded-3xl border-2 border-dashed border-[var(--color-primary-300)] bg-[var(--color-primary-50)] text-center cursor-pointer hover:border-[var(--color-primary-500)] transition-colors"
                                    >
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-primary-500)]/10 flex items-center justify-center">
                                            <ArrowRight className="w-8 h-8 text-[var(--color-primary-500)]" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-2">View All Teachers</h3>
                                        <p className="text-sm text-gray-500">Explore our full team of educators</p>
                                    </motion.div>
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Scroll Progress Indicator */}
                    <div className="container relative z-10 py-6">
                        <div className="flex justify-center">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">Scroll to explore</span>
                                <div className="w-24 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                                    <motion.div
                                        style={{ scaleX: scrollYProgress }}
                                        className="h-full bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-accent-500)] origin-left"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
