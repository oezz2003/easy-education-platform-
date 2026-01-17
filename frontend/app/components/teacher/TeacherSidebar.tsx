'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Video,
    FileText,
    MessageCircle,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

// Navigation items for teacher
const navItems = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        labelAr: 'لوحة التحكم',
        href: '/teacher/dashboard',
        icon: LayoutDashboard,
        icon3D: '/login-signup assits/teacher.png',
        color: 'blue',
    },
    {
        id: 'courses',
        label: 'My Courses',
        labelAr: 'كورساتي',
        href: '/teacher/courses',
        icon: BookOpen,
        icon3D: '/ASSITS/folders.png',
        color: 'purple',
    },
    {
        id: 'students',
        label: 'My Students',
        labelAr: 'طلابي',
        href: '/teacher/students',
        icon: Users,
        icon3D: '/login-signup assits/student.png',
        color: 'emerald',
    },
    {
        id: 'sessions',
        label: 'Live Sessions',
        labelAr: 'الحصص المباشرة',
        href: '/teacher/sessions',
        icon: Video,
        icon3D: '/ASSITS/play.png',
        color: 'red',
    },
    {
        id: 'availability',
        label: 'My Availability',
        labelAr: 'مواعيدي',
        href: '/teacher/availability',
        icon: Video,
        icon3D: null,
        color: 'cyan',
    },
];

// Motivational quotes for teachers
const quotes = [
    "Inspiring minds, one lesson at a time! 📚",
    "Your students are lucky to have you!",
    "Teaching is the greatest act of optimism. 💙",
    "Making a difference every day!",
];

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export default function TeacherSidebar({ isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useAuth();
    const [quoteIndex] = useState(Math.floor(Math.random() * quotes.length));

    const handleLogout = async () => {
        await signOut();
        router.push('/login');
    };

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-screen z-40 bg-white/70 backdrop-blur-md rounded-r-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border-r border-white/50 flex flex-col"
        >
            {/* Logo */}
            <div className="p-6 flex items-center justify-center">
                <Link href="/teacher/dashboard">
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
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="font-bold text-lg text-gray-900"
                            >
                                Teacher Portal
                            </motion.span>
                        )}
                    </motion.div>
                </Link>
            </div>

            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors z-50"
            >
                {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                ) : (
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
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
                                className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3 rounded-2xl transition-all cursor-pointer ${isActive
                                    ? `bg-blue-500/10 ${isCollapsed ? 'shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'shadow-[0_0_20px_rgba(59,130,246,0.2)]'}`
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
                                        <Icon className={`w-6 h-6 ${isActive ? 'text-blue-500' : 'text-gray-500'}`} />
                                    )}
                                    {/* Active indicator when collapsed - positioned under icon */}
                                    {isActive && isCollapsed && (
                                        <motion.div
                                            layoutId="teacherActiveIndicator"
                                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500"
                                        />
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
                                        <p className={`font-semibold text-sm ${isActive ? 'text-blue-600' : 'text-gray-700'
                                            }`}>
                                            {item.label}
                                        </p>
                                        <p className="text-xs text-gray-400">{item.labelAr}</p>
                                    </motion.div>
                                )}

                                {/* Active Indicator - only when expanded */}
                                {isActive && !isCollapsed && (
                                    <motion.div
                                        layoutId="teacherActiveIndicatorExpanded"
                                        className="absolute right-2 w-2 h-2 rounded-full bg-blue-500"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-100">
                {/* Settings */}
                <Link href="/teacher/settings">
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
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-red-50 transition-all cursor-pointer text-left"
                >
                    <LogOut className="w-5 h-5 text-red-500" />
                    {!isCollapsed && (
                        <span className="text-sm text-red-500">Logout</span>
                    )}
                </motion.button>

                {/* Motivational Quote */}
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl"
                    >
                        <p className="text-xs text-gray-600 text-center italic">
                            "{quotes[quoteIndex]}"
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.aside>
    );
}
