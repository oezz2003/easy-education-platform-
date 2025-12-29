'use client';

import { motion } from 'framer-motion';

const features = [
    {
        id: 'teachers',
        title: 'Expert Teachers',
        description: 'Learn from certified educators with years of experience in their subjects.',
        icon: '/ASSITS/gradution.png',
        color: 'bg-[var(--color-primary-500)]/5',
        borderColor: 'border-[var(--color-primary-200)]',
        size: 'large', // Takes 2 columns
    },
    {
        id: 'video',
        title: 'HD Video Lessons',
        description: 'Crystal clear video lessons you can watch anytime, anywhere on any device.',
        icon: '/ASSITS/play.png',
        color: 'bg-amber-50',
        borderColor: 'border-amber-200',
        size: 'medium',
        glowOnScroll: true,
    },
    {
        id: 'resources',
        title: 'PDF Resources',
        description: 'Download comprehensive summaries and study materials for offline review.',
        icon: '/ASSITS/folders.png',
        color: 'bg-blue-50',
        borderColor: 'border-blue-200',
        size: 'medium',
        floatEffect: true,
    },
    {
        id: 'progress',
        title: 'Progress Tracking',
        description: 'Visual progress bars and achievements to keep you motivated.',
        icon: '/ASSITS/cup.png',
        color: 'bg-purple-50',
        borderColor: 'border-purple-200',
        size: 'medium',
    },
    {
        id: 'pace',
        title: 'Learn at Your Pace',
        description: 'Resume exactly where you left off with automatic progress saving.',
        icon: '/ASSITS/watch.png',
        color: 'bg-orange-50',
        borderColor: 'border-orange-200',
        size: 'medium',
    },
    {
        id: 'secure',
        title: 'Secure Platform',
        description: 'Your data and learning progress are protected with enterprise-grade security.',
        icon: '/ASSITS/lock.png',
        color: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        size: 'large', // Takes 2 columns
    },
];

export default function Features() {
    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-[var(--color-primary-50)] to-white">
            {/* Background Decorations */}
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 top-20 w-[200px] opacity-20 pointer-events-none"
            />
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-0 bottom-20 w-[250px] opacity-15 pointer-events-none scale-x-[-1]"
            />

            <div className="container relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)] text-sm font-medium mb-4">
                        Why Choose Us
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Everything You Need to <span className="text-gradient-brand">Succeed</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Our platform provides all the tools and resources for an exceptional learning experience.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`
                ${feature.size === 'large' ? 'lg:col-span-2' : 'lg:col-span-1'}
                ${index === 0 ? 'md:row-span-1' : ''}
              `}
                        >
                            <motion.div
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className={`
                  relative h-full p-6 md:p-8 rounded-3xl border-2 ${feature.borderColor} ${feature.color}
                  shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden group cursor-pointer
                `}
                            >
                                {/* Decorative Corner Gradient */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* 3D Icon */}
                                <motion.div
                                    className="relative mb-6"
                                    animate={feature.floatEffect ? { y: [0, -8, 0] } : {}}
                                    transition={feature.floatEffect ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
                                >
                                    <motion.div
                                        whileInView={feature.glowOnScroll ? {
                                            boxShadow: ['0 0 0px rgba(245,179,1,0)', '0 0 30px rgba(245,179,1,0.5)', '0 0 0px rgba(245,179,1,0)']
                                        } : {}}
                                        transition={feature.glowOnScroll ? { duration: 2, repeat: Infinity } : {}}
                                        className="inline-block rounded-2xl"
                                    >
                                        <img
                                            src={feature.icon}
                                            alt={feature.title}
                                            className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-xl"
                                        />
                                    </motion.div>
                                </motion.div>

                                {/* Content */}
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Bottom Border Accent on Hover */}
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    whileHover={{ scaleX: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-accent-500)] origin-left"
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {[
                        { value: '50+', label: 'Expert Teachers' },
                        { value: '200+', label: 'Video Lessons' },
                        { value: '10K+', label: 'Happy Students' },
                        { value: '4.9', label: 'Average Rating' },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            whileHover={{ scale: 1.05 }}
                            className="text-center p-6 rounded-2xl bg-white shadow-lg border border-gray-100"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary-500)] mb-2">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
