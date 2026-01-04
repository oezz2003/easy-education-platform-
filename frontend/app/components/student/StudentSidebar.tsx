'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    BookOpen,
    Calendar,
    Trophy,
    User,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Sparkles
} from 'lucide-react';

// Navigation items for student
const navItems = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        labelAr: 'الرئيسية',
        href: '/student/dashboard',
        icon: Home,
        icon3D: '/login-signup assits/student.png',
        color: 'emerald',
    },
    {
        id: 'courses',
        label: 'My Courses',
        labelAr: 'كورساتي',
        href: '/student/courses',
        icon: BookOpen,
        icon3D: '/ASSITS/folders.png',
        color: 'purple',
    },
    {
        id: 'schedule',
        label: 'Schedule',
        labelAr: 'الجدول',
        href: '/student/schedule',
        icon: Calendar,
        icon3D: '/ASSITS/play.png',
        color: 'blue',
    },
    {
        id: 'achievements',
        label: 'Achievements',
        labelAr: 'الإنجازات',
        href: '/student/achievements',
        icon: Trophy,
        icon3D: '/ASSITS/cup.png',
        color: 'amber',
    },
    {
        id: 'profile',
        label: 'Profile',
        labelAr: 'حسابي',
        href: '/student/profile',
        icon: User,
        icon3D: null,
        color: 'gray',
    },
];

// Motivational quotes for students
const quotes = [
    "Keep learning, keep growing! 🌱",
    "You're doing amazing! ⭐",
    "Every lesson counts! 📚",
    "Champion in the making! 🏆",
];

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export default function StudentSidebar({ isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const [quoteIndex] = useState(Math.floor(Math.random() * quotes.length));

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-screen z-40 bg-white/80 backdrop-blur-md rounded-r-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border-r border-emerald-100/50 flex flex-col"
        >
            {/* Logo */}
            <div className="p-6 flex items-center justify-center">
                <Link href="/student/dashboard">
                    <motion.div
                        animate={{ scale: isCollapsed ? 0.8 : 1 }}
                        className="flex items-center gap-3"
                    >
                        <img
                            src="/main logo.png"
                            alt="Easy Education"
                            loading="lazy"
                            className={`${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'} object-contain transition-all`}
                        />
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <span className="font-bold text-lg text-gray-900 block">Easy Learn</span>
                                <span className="text-xs text-emerald-500">Student Portal</span>
                            </motion.div>
                        )}
                    </motion.div>
                </Link>
            </div>

            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white shadow-md border border-emerald-200 flex items-center justify-center hover:bg-emerald-50 transition-colors z-50"
            >
                {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-emerald-600" />
                ) : (
                    <ChevronLeft className="w-4 h-4 text-emerald-600" />
                )}
            </button>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    const Icon = item.icon;

                    return (
                        <Link key={item.id} href={item.href}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all cursor-pointer ${isActive
                                    ? 'bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                {/* 3D Icon or Lucide Icon */}
                                <div className={`relative w-10 h-10 flex items-center justify-center flex-shrink-0 ${isActive ? '' : 'opacity-70'
                                    }`}>
                                    {item.icon3D ? (
                                        <motion.img
                                            src={item.icon3D}
                                            alt={item.label}
                                            loading="lazy"
                                            animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                                            transition={{ duration: 0.3 }}
                                            className="w-8 h-8 object-contain"
                                        />
                                    ) : (
                                        <Icon className={`w-6 h-6 ${isActive ? 'text-emerald-500' : 'text-gray-500'}`} />
                                    )}
                                </div>

                                {/* Label */}
                                {!isCollapsed && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex-1"
                                    >
                                        <p className={`font-semibold text-sm ${isActive ? 'text-emerald-600' : 'text-gray-700'
                                            }`}>
                                            {item.label}
                                        </p>
                                        <p className="text-xs text-gray-400">{item.labelAr}</p>
                                    </motion.div>
                                )}

                                {/* Active Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="studentActiveIndicator"
                                        className="absolute right-2 w-2 h-2 rounded-full bg-emerald-500"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-emerald-100">
                {/* Settings */}
                <Link href="/student/settings">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer mb-2"
                    >
                        <Settings className="w-5 h-5 text-gray-500" />
                        {!isCollapsed && (
                            <span className="text-sm text-gray-600">Settings</span>
                        )}
                    </motion.div>
                </Link>

                {/* Logout */}
                <Link href="/login">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-red-50 transition-all cursor-pointer text-left"
                    >
                        <LogOut className="w-5 h-5 text-red-500" />
                        {!isCollapsed && (
                            <span className="text-sm text-red-500">Logout</span>
                        )}
                    </motion.button>
                </Link>

                {/* Motivational Quote */}
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl relative overflow-hidden"
                    >
                        <Sparkles className="absolute top-2 right-2 w-4 h-4 text-emerald-400" />
                        <p className="text-xs text-gray-600 text-center italic">
                            "{quotes[quoteIndex]}"
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.aside>
    );
}
