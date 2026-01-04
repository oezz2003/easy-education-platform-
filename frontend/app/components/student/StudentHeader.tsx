'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Bell, ChevronDown, Menu, Play, Flame, Zap } from 'lucide-react';

interface StudentHeaderProps {
    onMenuClick: () => void;
}

export default function StudentHeader({ onMenuClick }: StudentHeaderProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Mock data
    const xpPoints = 2450;
    const streak = 7;
    const lastCourse = {
        title: 'Advanced Algebra',
        lesson: 'Quadratic Equations',
        progress: 65,
    };

    // Mock notifications
    const notifications = [
        { id: 1, message: 'New lesson available in Math course', time: '5 min ago', unread: true },
        { id: 2, message: 'You earned a new badge! 🏆', time: '1 hour ago', unread: true },
        { id: 3, message: 'Live session starts tomorrow', time: '3 hours ago', unread: false },
    ];

    const unreadCount = notifications.filter((n) => n.unread).length;

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-emerald-100/50">
            <div className="flex items-center justify-between px-4 lg:px-6 py-4">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-xl hover:bg-emerald-50 transition-colors"
                    >
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* Search Bar */}
                    <div className="hidden sm:block relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses, lessons..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64 lg:w-80 pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* XP Display */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full"
                    >
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-bold text-amber-700">{xpPoints.toLocaleString()} XP</span>
                    </motion.div>

                    {/* Streak Display */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-100 to-red-100 rounded-full"
                    >
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-bold text-orange-700">{streak} day streak</span>
                    </motion.div>

                    {/* Continue Learning Button */}
                    <Link href={`/student/courses/1`}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            <Play className="w-4 h-4" />
                            <span className="text-sm">Continue</span>
                        </motion.button>
                    </Link>

                    {/* Notifications */}
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-3 rounded-xl hover:bg-emerald-50 transition-colors"
                        >
                            <Bell className="w-5 h-5 text-gray-600" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </motion.button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                            >
                                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50">
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${notif.unread ? 'bg-emerald-50/50' : ''
                                                }`}
                                        >
                                            <p className="text-sm text-gray-900">{notif.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 text-center border-t border-gray-100">
                                    <button className="text-sm text-emerald-500 font-medium hover:text-emerald-600">
                                        View all notifications
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Profile Menu */}
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 p-2 pr-3 rounded-xl hover:bg-emerald-50 transition-colors"
                        >
                            <img
                                src="https://i.pravatar.cc/150?img=33"
                                alt="Student"
                                className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-200"
                            />
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-gray-900">Omar Ahmed</p>
                                <p className="text-xs text-emerald-500">Level 12</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
                        </motion.button>

                        {/* Profile Dropdown */}
                        {showProfileMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                            >
                                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50">
                                    <p className="font-semibold text-gray-900">Omar Ahmed</p>
                                    <p className="text-sm text-gray-500">omar@example.com</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex-1 h-2 bg-emerald-200 rounded-full">
                                            <div className="h-full w-3/4 bg-emerald-500 rounded-full" />
                                        </div>
                                        <span className="text-xs text-emerald-600">75%</span>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <Link href="/student/profile">
                                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                            My Profile
                                        </button>
                                    </Link>
                                    <Link href="/student/achievements">
                                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                            Achievements
                                        </button>
                                    </Link>
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                        Settings
                                    </button>
                                </div>
                                <div className="p-2 border-t border-gray-100">
                                    <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg">
                                        Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
