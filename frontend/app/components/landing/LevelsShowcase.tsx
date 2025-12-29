'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const stages = [
    {
        id: 'primary',
        title: 'Primary',
        subtitle: 'The Foundation',
        description: 'Foundation courses for grades 1-6.',
        grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
        icon: '/ASSITS/art.png',
        color: 'from-emerald-400 to-green-500',
        borderColor: 'border-emerald-300',
        bgColor: 'bg-emerald-50',
        pillColor: 'bg-emerald-100 text-emerald-700',
        asset: '/ASSITS/TREE.png',
        assetPosition: 'left',
    },
    {
        id: 'preparatory',
        title: 'Preparatory',
        subtitle: 'The Intermediate',
        description: 'Intermediate courses for grades 7-9.',
        grades: ['Grade 7', 'Grade 8', 'Grade 9'],
        icon: '/ASSITS/global.png',
        color: 'from-blue-400 to-indigo-500',
        borderColor: 'border-blue-300',
        bgColor: 'bg-blue-50',
        pillColor: 'bg-blue-100 text-blue-700',
        asset: '/ASSITS/CLOUD.png',
        assetPosition: 'bottom',
    },
    {
        id: 'secondary',
        title: 'Secondary',
        subtitle: 'The Advanced',
        description: 'Advanced courses for grades 10-12.',
        grades: ['Grade 10', 'Grade 11', 'Grade 12'],
        icon: '/ASSITS/text bubble.png',
        color: 'from-amber-400 to-yellow-500',
        borderColor: 'border-amber-300',
        bgColor: 'bg-amber-50',
        pillColor: 'bg-amber-100 text-amber-700',
        asset: '/ASSITS/TREE.png',
        assetPosition: 'right',
    },
];

export default function LevelsShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    // Parallax for clouds
    const cloudY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
    const cloud2Y = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

    return (
        <section ref={containerRef} className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-[var(--color-primary-50)] to-white">

            {/* Parallax Background Clouds */}
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                style={{ y: cloudY }}
                className="absolute -left-20 top-20 w-[300px] opacity-40 pointer-events-none"
            />
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                style={{ y: cloud2Y }}
                className="absolute -right-20 top-40 w-[250px] opacity-30 pointer-events-none scale-x-[-1]"
            />
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                style={{ y: cloudY }}
                className="absolute left-1/4 bottom-20 w-[200px] opacity-20 pointer-events-none"
            />

            <div className="container relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 relative">
                    {/* Decorative Cloud next to title */}
                    <motion.img
                        src="/ASSITS/CLOUD.png"
                        alt=""
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -right-4 top-0 w-[100px] opacity-60 pointer-events-none hidden lg:block"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)] text-sm font-medium mb-4">
                            Educational Levels
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Choose Your <span className="text-gradient-brand">Learning Path</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            From primary education to secondary, find the perfect courses tailored to your grade level.
                        </p>
                    </motion.div>
                </div>

                {/* Stage Cards - Floating Islands */}
                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {stages.map((stage, index) => (
                        <motion.div
                            key={stage.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="relative"
                        >
                            {/* The Floating Island Card */}
                            <motion.div
                                whileHover={{ y: -10, scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 ${stage.borderColor} overflow-hidden group cursor-pointer`}
                            >
                                {/* Background Gradient Glow */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${stage.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                                {/* Cloud beneath card (bottom shadow illusion) */}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gray-200/50 rounded-full blur-xl" />

                                {/* 3D Icon with Hover Animation */}
                                <motion.div
                                    whileHover={{ rotate: 10, scale: 1.15 }}
                                    transition={{ type: 'spring', stiffness: 400 }}
                                    className="w-24 h-24 mb-6 relative"
                                >
                                    <motion.img
                                        src={stage.icon}
                                        alt={stage.title}
                                        className="w-full h-full object-contain drop-shadow-xl"
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                </motion.div>

                                {/* Title & Subtitle */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stage.title}</h3>
                                <p className="text-sm text-gray-500 mb-3">{stage.subtitle}</p>

                                {/* Description */}
                                <p className="text-gray-600 mb-6">{stage.description}</p>

                                {/* Grade Pills */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {stage.grades.slice(0, 3).map((grade) => (
                                        <span
                                            key={grade}
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${stage.pillColor}`}
                                        >
                                            {grade}
                                        </span>
                                    ))}
                                    {stage.grades.length > 3 && (
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${stage.pillColor}`}>
                                            +{stage.grades.length - 3} more
                                        </span>
                                    )}
                                </div>

                                {/* CTA Button */}
                                <Link href={`/levels?level=${stage.id}`}>
                                    <motion.button
                                        whileHover={{ x: 5 }}
                                        className={`flex items-center gap-2 font-semibold bg-gradient-to-r ${stage.color} bg-clip-text text-transparent group-hover:gap-4 transition-all`}
                                    >
                                        Explore {stage.title}
                                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                                    </motion.button>
                                </Link>
                            </motion.div>

                            {/* 3D Asset Decoration */}
                            {stage.assetPosition === 'left' && (
                                <motion.img
                                    src={stage.asset}
                                    alt=""
                                    animate={{ rotate: [0, 2, 0, -2, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute -left-8 -bottom-4 w-[100px] pointer-events-none hidden lg:block"
                                />
                            )}
                            {stage.assetPosition === 'right' && (
                                <motion.img
                                    src={stage.asset}
                                    alt=""
                                    animate={{ rotate: [0, -2, 0, 2, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute -right-8 -bottom-4 w-[100px] pointer-events-none hidden lg:block"
                                />
                            )}
                            {stage.assetPosition === 'bottom' && (
                                <motion.img
                                    src={stage.asset}
                                    alt=""
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute left-1/2 -translate-x-1/2 -bottom-12 w-[150px] opacity-60 pointer-events-none hidden lg:block"
                                />
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Decorative Elements */}
                <div className="flex justify-center mt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="text-center"
                    >
                        <p className="text-gray-500 mb-4">Can't find your level?</p>
                        <Link href="/levels">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-full border-2 border-[var(--color-primary-500)] text-[var(--color-primary-500)] font-semibold hover:bg-[var(--color-primary-500)] hover:text-white transition-all"
                            >
                                View All Levels
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
