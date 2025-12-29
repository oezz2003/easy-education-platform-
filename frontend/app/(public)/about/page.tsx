'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Target, Heart, Users, Award, CheckCircle } from 'lucide-react';

const values = [
    {
        icon: Target,
        title: 'Our Mission',
        description: 'To make quality education accessible to every student, regardless of their location or background.',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        icon: Heart,
        title: 'Passion for Learning',
        description: 'We believe learning should be joyful, engaging, and tailored to each student\'s unique needs.',
        color: 'bg-pink-50 text-pink-600',
    },
    {
        icon: Users,
        title: 'Community First',
        description: 'Building a supportive community where students and teachers thrive together.',
        color: 'bg-purple-50 text-purple-600',
    },
    {
        icon: Award,
        title: 'Excellence',
        description: 'Committed to delivering the highest quality educational content and experiences.',
        color: 'bg-amber-50 text-amber-600',
    },
];

const stats = [
    { value: '10,000+', label: 'Happy Students' },
    { value: '50+', label: 'Expert Teachers' },
    { value: '500+', label: 'Video Lessons' },
    { value: '4.9', label: 'Average Rating' },
];

const team = [
    {
        name: 'Ahmed Hassan',
        role: 'Founder & CEO',
        avatar: 'https://i.pravatar.cc/300?img=11',
        bio: 'Passionate educator with 15+ years of experience in transforming education.',
    },
    {
        name: 'Sara Ali',
        role: 'Head of Education',
        avatar: 'https://i.pravatar.cc/300?img=5',
        bio: 'Former school principal dedicated to curriculum development and teacher training.',
    },
    {
        name: 'Mohamed Farid',
        role: 'Chief Technology Officer',
        avatar: 'https://i.pravatar.cc/300?img=12',
        bio: 'Tech enthusiast building innovative solutions for modern education.',
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
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
                className="absolute right-0 top-60 w-[200px] opacity-20 pointer-events-none scale-x-[-1]"
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

            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-[var(--color-primary-100)] via-[var(--color-primary-50)] to-white py-16">
                <div className="container relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-block px-4 py-2 rounded-full bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)] text-sm font-medium mb-4">
                                About Us
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                                Making Education <span className="text-gradient-brand">Joyful</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Easy Education was founded with a simple yet powerful vision: to transform the way students learn.
                                We connect passionate teachers with eager students, creating an environment where education becomes
                                an exciting journey rather than a tedious task.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/courses">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 rounded-full bg-[var(--color-primary-500)] text-white font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                                    >
                                        Explore Courses
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </Link>
                                <Link href="/teachers">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 rounded-full border-2 border-[var(--color-primary-500)] text-[var(--color-primary-500)] font-bold hover:bg-[var(--color-primary-500)] hover:text-white transition-all"
                                    >
                                        Meet Our Teachers
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Floating Avatar */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative flex justify-center"
                        >
                            <motion.div
                                animate={{ y: [0, -15, 0], rotate: [0, 2, 0, -2, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="relative"
                            >
                                <img
                                    src="/ASSITS/HERO AVATAR.png"
                                    alt="Easy Education"
                                    className="w-[300px] md:w-[400px] h-auto drop-shadow-2xl"
                                />
                                {/* Sparkles */}
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--color-accent-400)] shadow-[0_0_20px_var(--color-accent-400)]"
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-4xl md:text-5xl font-bold text-[var(--color-primary-500)] mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-600">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-16 bg-gradient-to-b from-white to-[var(--color-primary-50)]">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-[var(--color-accent-500)]/10 text-[var(--color-accent-600)] text-sm font-medium mb-4">
                            Our Values
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            What Drives <span className="text-gradient-brand">Us</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => {
                            const IconComponent = value.icon;
                            return (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -8 }}
                                    className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100 hover:border-[var(--color-primary-200)] transition-all"
                                >
                                    <div className={`w-14 h-14 rounded-2xl ${value.color} flex items-center justify-center mb-4`}>
                                        <IconComponent className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                                    <p className="text-gray-600 text-sm">{value.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)] text-sm font-medium mb-4">
                            Our Team
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Meet the <span className="text-gradient-brand">People</span> Behind Easy Education
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-gray-100 hover:border-[var(--color-primary-200)] transition-all"
                            >
                                <div className="relative h-64 bg-gradient-to-b from-[var(--color-primary-100)] to-white">
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                    <p className="text-[var(--color-primary-500)] font-medium mb-3">{member.role}</p>
                                    <p className="text-gray-600 text-sm">{member.bio}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 bg-gradient-to-b from-[var(--color-primary-50)] to-white">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="inline-block px-4 py-2 rounded-full bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)] text-sm font-medium mb-4">
                                Why Choose Us
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Education Made <span className="text-gradient-brand">Simple</span>
                            </h2>
                            <div className="space-y-4">
                                {[
                                    'Expert teachers with years of experience',
                                    'HD video lessons accessible anytime',
                                    'Comprehensive PDF study materials',
                                    'Track your progress with visual dashboards',
                                    'Learn at your own pace',
                                    '24/7 technical support',
                                ].map((item, index) => (
                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-[var(--color-primary-500)] flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-gray-700">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <motion.img
                                    src="/ASSITS/gradution.png"
                                    alt=""
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                    className="w-32 h-32 object-contain mx-auto"
                                />
                                <motion.img
                                    src="/ASSITS/play.png"
                                    alt=""
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                                    className="w-32 h-32 object-contain mx-auto"
                                />
                                <motion.img
                                    src="/ASSITS/folders.png"
                                    alt=""
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                    className="w-32 h-32 object-contain mx-auto"
                                />
                                <motion.img
                                    src="/ASSITS/cup.png"
                                    alt=""
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    className="w-32 h-32 object-contain mx-auto"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] rounded-3xl p-12 text-center"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Start Your Learning Journey?
                        </h2>
                        <p className="text-white/80 max-w-2xl mx-auto mb-8">
                            Join thousands of students who are already learning from our expert teachers.
                        </p>
                        <Link href="/courses">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-5 rounded-full bg-[var(--color-accent-500)] text-[var(--color-primary-700)] font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 mx-auto"
                            >
                                Get Started Now
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
