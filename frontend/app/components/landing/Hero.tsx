'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/ASSITS/HERO BACKGOROUND.png')" }}
            />

            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-600)]/30 to-transparent" />

            {/* Floating Clouds - Left */}
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                className="absolute left-0 bottom-0 w-[400px] opacity-90 pointer-events-none"
                animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Floating Clouds - Right */}
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                className="absolute right-0 bottom-0 w-[350px] opacity-90 pointer-events-none scale-x-[-1]"
                animate={{ x: [0, -10, 0], y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Tree Decoration - Left */}
            <motion.img
                src="/ASSITS/TREE.png"
                alt=""
                className="absolute left-[5%] bottom-0 w-[150px] pointer-events-none"
                animate={{ rotate: [0, 2, 0, -2, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Tree Decoration - Right */}
            <motion.img
                src="/ASSITS/TREE.png"
                alt=""
                className="absolute right-[8%] bottom-0 w-[120px] pointer-events-none"
                animate={{ rotate: [0, -2, 0, 2, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Main Content */}
            <div className="container relative z-10 min-h-screen flex items-center">
                <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-32">

                    {/* Left Side - Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="text-center lg:text-left"
                    >
                        {/* Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
                        >
                            A Learning Journey...
                            <span className="block text-[var(--color-accent-400)]">
                                Made Easy!
                            </span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-lg md:text-xl text-white/90 mb-10 max-w-lg mx-auto lg:mx-0 drop-shadow-md"
                        >
                            Discover the joy of learning with ease and fun.
                        </motion.p>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            <Link href="/levels">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[var(--color-accent-500)] text-[var(--color-primary-700)] font-bold text-xl shadow-2xl hover:shadow-3xl transition-all border-4 border-[var(--color-accent-300)]"
                                >
                                    Start Your Adventure Now
                                    <ArrowRight className="w-6 h-6" />
                                </motion.button>
                            </Link>
                        </motion.div>

                        {/* Floating Sparkles/E marks */}
                        <div className="absolute left-[20%] top-[30%] pointer-events-none">
                            {[...Array(4)].map((_, i) => (
                                <motion.span
                                    key={i}
                                    className="absolute text-[var(--color-accent-400)] font-bold text-2xl"
                                    style={{
                                        left: `${i * 40}px`,
                                        top: `${i * 20}px`,
                                    }}
                                    animate={{
                                        y: [0, -10, 0],
                                        opacity: [0.4, 1, 0.4],
                                        scale: [0.8, 1, 0.8]
                                    }}
                                    transition={{
                                        duration: 2 + i * 0.5,
                                        repeat: Infinity,
                                        delay: i * 0.3
                                    }}
                                >
                                    e
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side - Floating Avatar */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                        className="relative flex justify-center items-center"
                    >
                        {/* Avatar Glow Effect */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute w-[400px] h-[400px] rounded-full bg-[var(--color-accent-500)]/20 blur-3xl"
                        />

                        {/* Floating Avatar */}
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 2, 0, -2, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                            className="relative z-10"
                        >
                            <img
                                src="/ASSITS/HERO AVATAR.png"
                                alt="Easy Education Mascot"
                                className="w-[350px] md:w-[450px] lg:w-[500px] h-auto drop-shadow-2xl"
                            />

                            {/* Sparkle Effect around Avatar */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-[var(--color-accent-400)] shadow-[0_0_20px_var(--color-accent-400)]"
                            />
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.3, 0.8, 0.3]
                                }}
                                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                                className="absolute top-1/4 -left-6 w-6 h-6 rounded-full bg-[var(--color-accent-300)] shadow-[0_0_15px_var(--color-accent-300)]"
                            />
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.4, 0.9, 0.4]
                                }}
                                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                className="absolute bottom-1/4 -right-8 w-5 h-5 rounded-full bg-white shadow-[0_0_15px_white]"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
