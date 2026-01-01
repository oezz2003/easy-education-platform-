'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CallToAction() {
    return (
        <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
            {/* Background with 3D Scene */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/ASSITS/HERO BACKGOROUND.png')" }}
            />

            {/* Overlay for better readability */}
            <div className="absolute inset-0 bg-[var(--color-primary-600)]/60" />

            {/* 3D Decorative Elements - responsive sizing */}
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                loading="lazy"
                animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 bottom-0 w-[150px] sm:w-[200px] md:w-[300px] opacity-70 pointer-events-none"
            />
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                loading="lazy"
                animate={{ x: [0, -10, 0], y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-0 bottom-0 w-[120px] sm:w-[180px] md:w-[250px] opacity-60 pointer-events-none scale-x-[-1]"
            />
            <motion.img
                src="/ASSITS/TREE.png"
                alt=""
                loading="lazy"
                animate={{ rotate: [0, 2, 0, -2, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-[5%] bottom-0 w-[60px] sm:w-[80px] md:w-[100px] opacity-80 pointer-events-none hidden sm:block"
            />
            <motion.img
                src="/ASSITS/TREE.png"
                alt=""
                loading="lazy"
                animate={{ rotate: [0, -2, 0, 2, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-[8%] bottom-0 w-[50px] sm:w-[60px] md:w-[80px] opacity-70 pointer-events-none hidden sm:block"
            />

            {/* Floating 3D Icons - hidden on mobile */}
            <motion.img
                src="/ASSITS/gradution.png"
                alt=""
                loading="lazy"
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[20%] left-[10%] w-12 sm:w-16 md:w-20 opacity-90 pointer-events-none hidden md:block"
            />
            <motion.img
                src="/ASSITS/play.png"
                alt=""
                loading="lazy"
                animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[30%] right-[12%] w-10 sm:w-14 md:w-18 opacity-80 pointer-events-none hidden md:block"
            />
            <motion.img
                src="/ASSITS/cup.png"
                alt=""
                loading="lazy"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-[30%] left-[15%] w-10 sm:w-12 md:w-16 opacity-70 pointer-events-none hidden lg:block"
            />

            <div className="container relative z-10 px-4 sm:px-6">
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Left Side - Floating Avatar */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative flex justify-center lg:justify-start order-2 lg:order-1"
                    >
                        {/* Glow Effect */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute w-[200px] sm:w-[250px] md:w-[300px] h-[200px] sm:h-[250px] md:h-[300px] rounded-full bg-[var(--color-accent-500)]/30 blur-3xl"
                        />

                        {/* Avatar with floating animation */}
                        <motion.div
                            animate={{ y: [0, -15, 0], rotate: [0, 2, 0, -2, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="relative z-10"
                        >
                            <img
                                src="/ASSITS/HERO AVATAR.png"
                                alt="Join Easy Education"
                                loading="lazy"
                                className="w-[200px] sm:w-[250px] md:w-[300px] lg:w-[350px] h-auto drop-shadow-2xl"
                            />

                            {/* Sparkle effects */}
                            <motion.div
                                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -top-2 -right-2 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[var(--color-accent-400)] shadow-[0_0_20px_var(--color-accent-400)]"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.9, 0.4] }}
                                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                                className="absolute top-1/4 -left-4 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white shadow-[0_0_15px_white]"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center lg:text-left order-1 lg:order-2"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-medium mb-4 sm:mb-6"
                        >
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--color-accent-400)]" />
                            <span>Start Your Journey Today</span>
                        </motion.div>

                        {/* Heading */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                            Ready to Transform Your
                            <span className="block text-[var(--color-accent-400)]">Learning Experience?</span>
                        </h2>

                        {/* Description */}
                        <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 max-w-xl leading-relaxed mx-auto lg:mx-0">
                            Join thousands of students who are already learning from the best teachers.
                            Get access to premium courses, track your progress, and achieve your academic goals.
                        </p>

                        {/* CTA Buttons - Responsive */}
                        <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 mb-6 sm:mb-8">
                            <Link href="/levels" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-[var(--color-accent-500)] text-[var(--color-primary-700)] font-bold text-sm sm:text-base md:text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 border-2 sm:border-4 border-[var(--color-accent-300)]"
                                >
                                    Get Started Free
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>
                            </Link>
                            <Link href="/teachers" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white font-bold text-sm sm:text-base md:text-lg hover:bg-white/20 transition-all"
                                >
                                    Browse Teachers
                                </motion.button>
                            </Link>
                        </div>

                        {/* Trust indicators - Responsive */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
                            {[
                                { icon: '✓', text: 'No credit card required' },
                                { icon: '✓', text: 'Free trial available' },
                                { icon: '✓', text: 'Cancel anytime' },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.text}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-xs sm:text-sm"
                                >
                                    <span className="text-[var(--color-accent-400)]">{item.icon}</span>
                                    <span>{item.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
