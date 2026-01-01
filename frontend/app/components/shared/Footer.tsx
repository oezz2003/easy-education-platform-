'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const footerLinks = {
    platform: [
        { label: 'Home', href: '/' },
        { label: 'Levels', href: '/levels' },
        { label: 'Teachers', href: '/teachers' },
        { label: 'About Us', href: '/about' },
    ],
    support: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
    ],
};

const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-500' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-500' },
    { icon: Youtube, href: '#', label: 'Youtube', color: 'hover:bg-red-500' },
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-[var(--color-primary-600)]">
            {/* 3D Decorative Elements */}
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                loading="lazy"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 top-0 w-[200px] opacity-20 pointer-events-none"
            />
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                loading="lazy"
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-0 top-10 w-[180px] opacity-15 pointer-events-none scale-x-[-1]"
            />
            <motion.img
                src="/ASSITS/TREE.png"
                alt=""
                loading="lazy"
                className="absolute left-[5%] bottom-0 w-[80px] opacity-30 pointer-events-none"
            />
            <motion.img
                src="/ASSITS/TREE.png"
                alt=""
                loading="lazy"
                className="absolute right-[8%] bottom-0 w-[60px] opacity-25 pointer-events-none scale-x-[-1]"
            />

            <div className="container relative z-10 py-16">
                {/* Top Section - Newsletter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-white/20"
                >
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Stay Updated!</h3>
                            <p className="text-white/70">Get the latest courses and learning tips in your inbox.</p>
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:border-[var(--color-accent-500)]"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 rounded-full bg-[var(--color-accent-500)] text-[var(--color-primary-700)] font-bold flex items-center gap-2"
                            >
                                Subscribe
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-block mb-4">
                            <img
                                src="/main logo.png"
                                alt="Easy Education Logo"
                                loading="lazy"
                                className="h-14 w-auto brightness-0 invert"
                            />
                        </Link>
                        <p className="text-white/70 mb-6 leading-relaxed">
                            A joyful learning experience connecting students with specialized teachers through engaging digital education.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    whileHover={{ scale: 1.1, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white transition-colors ${social.color}`}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-500)]" />
                            Platform
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.platform.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/70 hover:text-[var(--color-accent-400)] transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[var(--color-accent-400)] transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-500)]" />
                            Support
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/70 hover:text-[var(--color-accent-400)] transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-[var(--color-accent-400)] transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-500)]" />
                            Contact
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <a href="mailto:support@easyedu.com" className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-accent-500)] transition-colors">
                                        <Mail className="w-5 h-5 text-[var(--color-accent-400)] group-hover:text-[var(--color-primary-700)]" />
                                    </div>
                                    <span className="text-white/70 group-hover:text-white transition-colors">support@easyedu.com</span>
                                </a>
                            </li>
                            <li>
                                <a href="tel:+201234567890" className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-accent-500)] transition-colors">
                                        <Phone className="w-5 h-5 text-[var(--color-accent-400)] group-hover:text-[var(--color-primary-700)]" />
                                    </div>
                                    <span className="text-white/70 group-hover:text-white transition-colors">+20 123 456 7890</span>
                                </a>
                            </li>
                            <li>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-[var(--color-accent-400)]" />
                                    </div>
                                    <span className="text-white/70">Cairo, Egypt</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/50 text-sm">
                        © {new Date().getFullYear()} Easy Education. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-white/50 text-sm">
                        <span>Made with</span>
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-red-400"
                        >
                            ❤️
                        </motion.span>
                        <span>for joyful learning</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
