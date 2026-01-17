'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Plus, Bell, ChevronDown, Menu } from 'lucide-react';
import SearchBar from '../shared/SearchBar';
import { useAuth } from '@/hooks/useAuth';

interface AdminHeaderProps {
    onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
    const router = useRouter();
    const { signOut } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const handleLogout = async () => {
        await signOut();
        router.push('/login');
    };

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-30 px-4 sm:px-6 py-4"
        >
            <div className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-white/50 px-4 sm:px-6 py-3 flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                    <Menu className="w-6 h-6 text-gray-600" />
                </button>

                {/* Search Bar */}
                <div className="hidden sm:block flex-1 max-w-xl">
                    <SearchBar variant="admin" />
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Add Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[var(--color-primary-500)] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                    >
                        <Plus className="w-5 h-5" />
                    </motion.button>

                    {/* Notifications */}
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-all relative"
                        >
                            <Bell className="w-5 h-5 text-gray-600" />
                            {/* Notification Badge */}
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                3
                            </span>
                        </motion.button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-0 top-14 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4"
                            >
                                <h4 className="font-semibold text-gray-900 mb-3">Notifications</h4>
                                <div className="space-y-3">
                                    <div className="flex gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <span className="text-emerald-600 text-sm">👤</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-700">New student registered</p>
                                            <p className="text-xs text-gray-400">2 min ago</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-blue-600 text-sm">📚</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-700">New course added</p>
                                            <p className="text-xs text-gray-400">1 hour ago</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Profile */}
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowProfile(!showProfile)}
                            className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all"
                        >
                            <img
                                src="/login-signup assits/manger.png"
                                alt="Admin"
                                loading="lazy"
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-contain"
                            />
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-semibold text-gray-900">Admin</p>
                                <p className="text-xs text-gray-500">Manager</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                        </motion.button>

                        {/* Profile Dropdown */}
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-0 top-14 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2"
                            >
                                <a href="/admin/profile" className="block px-4 py-2 rounded-xl hover:bg-gray-50 text-sm text-gray-700">
                                    My Profile
                                </a>
                                <a href="/admin/settings" className="block px-4 py-2 rounded-xl hover:bg-gray-50 text-sm text-gray-700">
                                    Settings
                                </a>
                                <hr className="my-2 border-gray-100" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 rounded-xl hover:bg-red-50 text-sm text-red-500"
                                >
                                    Logout
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
