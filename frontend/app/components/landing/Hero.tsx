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

            {/* Floating Clouds - Left (hidden on small mobile) */}
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                loading="lazy"
                className="absolute left-0 bottom-0 w-[200px] sm:w-[300px] md:w-[400px] opacity-90 pointer-events-none"
                animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Floating Clouds - Right (hidden on small mobile) */}
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                loading="lazy"
                className="absolute right-0 bottom-0 w-[180px] sm:w-[250px] md:w-[350px] opacity-90 pointer-events-none scale-x-[-1]"
                animate={{ x: [0, -10, 0], y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Tree Decoration - Left (hidden on mobile) */}
            <motion.img
                src="/ASSITS/TREE.png"
                alt=""
                loading="lazy"
                className="absolute left-[5%] bottom-0 w-[80px] sm:w-[100px] md:w-[150px] pointer-events-none hidden sm:block"
                animate={{ rotate: [0, 2, 0, -2, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Tree Decoration - Right (hidden on mobile) */}
            <motion.img
                src="/ASSITS/TREE.png"
                alt=""
                loading="lazy"
                className="absolute right-[8%] bottom-0 w-[60px] sm:w-[80px] md:w-[120px] pointer-events-none hidden sm:block"
                animate={{ rotate: [0, -2, 0, 2, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Main Content */}
            <div className="container relative z-10 min-h-screen flex items-center">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full py-24 sm:py-28 md:py-32">

                    {/* Left Side - Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="text-center lg:text-left order-2 lg:order-1"
                    >
                        {/* Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg"
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
                            className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-lg mx-auto lg:mx-0 drop-shadow-md px-4 sm:px-0"
                        >
                            Discover the joy of learning with ease and fun.
                        </motion.p>

                        {/* CTA Button - Responsive sizing */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start px-4 sm:px-0"
                        >
                            <Link href="/levels" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full bg-[var(--color-accent-500)] text-[var(--color-primary-700)] font-bold text-base sm:text-lg md:text-xl shadow-2xl hover:shadow-3xl transition-all border-2 sm:border-4 border-[var(--color-accent-300)]"
                                >
                                    Start Your Adventure
                                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </motion.button>
                            </Link>
                            <Link href="/courses" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white font-bold text-base sm:text-lg hover:bg-white/20 transition-all"
                                >
                                    Browse Courses
                                </motion.button>
                            </Link>
                        </motion.div>

                        {/* Floating Sparkles/E marks - hidden on mobile */}
                        <div className="absolute left-[20%] top-[30%] pointer-events-none hidden lg:block">
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
                        className="relative flex justify-center items-center order-1 lg:order-2"
                    >
                        {/* Avatar Glow Effect */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute w-[250px] sm:w-[300px] md:w-[400px] h-[250px] sm:h-[300px] md:h-[400px] rounded-full bg-[var(--color-accent-500)]/20 blur-3xl"
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
                                loading="lazy"
                                className="w-[250px] sm:w-[300px] md:w-[400px] lg:w-[450px] xl:w-[500px] h-auto drop-shadow-2xl"
                            />

                            {/* Sparkle Effect around Avatar */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -top-4 -right-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[var(--color-accent-400)] shadow-[0_0_20px_var(--color-accent-400)]"
                            />
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.3, 0.8, 0.3]
                                }}
                                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                                className="absolute top-1/4 -left-6 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[var(--color-accent-300)] shadow-[0_0_15px_var(--color-accent-300)]"
                            />
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.4, 0.9, 0.4]
                                }}
                                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                className="absolute bottom-1/4 -right-8 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white shadow-[0_0_15px_white]"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
