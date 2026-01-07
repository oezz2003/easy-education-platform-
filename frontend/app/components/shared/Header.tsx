'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/levels', label: 'Levels' },
    { href: '/courses', label: 'Courses' },
    { href: '/teachers', label: 'Teachers' },
    { href: '/book-free-session', label: 'Book Free Session' },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 py-4">
                <div className="container">
                    {/* Playful Blocks Container */}
                    <div className="flex items-center justify-between gap-4">

                        {/* Block 1: Logo */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link
                                href="/"
                                className="flex items-center gap-3 px-4 py-2 bg-white rounded-3xl border-b-4 border-gray-200 hover:border-[var(--color-primary-500)] shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <img
                                    src="/main logo.png"
                                    alt="Easy Education Logo"
                                    loading="lazy"
                                    className="h-12 w-auto"
                                />
                            </Link>
                        </motion.div>

                        {/* Block 2: Navigation Capsule (Desktop) */}
                        <motion.nav
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="hidden md:flex items-center gap-2 px-3 py-2 bg-white rounded-3xl border-b-4 border-gray-200 shadow-sm"
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative px-5 py-2.5 rounded-2xl font-semibold text-gray-700 hover:text-gray-900 transition-all duration-300 group"
                                >
                                    {/* Yellow Bubble Background on Hover */}
                                    <span className="absolute inset-0 rounded-2xl bg-[var(--color-accent-500)]/0 group-hover:bg-[var(--color-accent-500)]/20 transition-all duration-300 scale-90 group-hover:scale-100" />
                                    <span className="relative z-10">{link.label}</span>
                                </Link>
                            ))}
                        </motion.nav>

                        {/* Block 3: Auth Buttons (Desktop) */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="hidden md:flex items-center gap-3 px-4 py-2 bg-white rounded-3xl border-b-4 border-gray-200 shadow-sm"
                        >
                            <Link href="/login">
                                <button className="px-5 py-2.5 rounded-2xl font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300">
                                    Login
                                </button>
                            </Link>
                            <Link href="/signup">
                                <button className="px-5 py-2.5 rounded-2xl font-bold text-white gradient-brand border-b-4 border-[var(--color-primary-700)] hover:brightness-110 shadow-md hover:shadow-lg transition-all duration-300 active:translate-y-0.5 active:border-b-2">
                                    Sign Up
                                </button>
                            </Link>
                        </motion.div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-3 bg-white rounded-2xl border-b-4 border-gray-200 shadow-sm hover:shadow-md transition-all"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 md:hidden"
                    >
                        <div
                            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.nav
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="absolute top-24 left-4 right-4 bg-white rounded-3xl border-b-4 border-gray-200 shadow-xl p-6"
                        >
                            <div className="flex flex-col gap-2">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-5 py-4 rounded-2xl font-semibold text-gray-700 hover:text-gray-900 hover:bg-[var(--color-accent-500)]/20 transition-all duration-300"
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}

                                <div className="h-px bg-gray-200 my-3" />

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-col gap-3"
                                >
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <button className="w-full px-5 py-3 rounded-2xl font-semibold text-gray-700 border-2 border-gray-200 hover:border-[var(--color-primary-500)] transition-all duration-300">
                                            Login
                                        </button>
                                    </Link>
                                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                        <button className="w-full px-5 py-3 rounded-2xl font-bold text-white gradient-brand border-b-4 border-[var(--color-primary-700)] shadow-md active:translate-y-0.5 active:border-b-2 transition-all duration-300">
                                            Sign Up
                                        </button>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
