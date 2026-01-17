'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, ChevronDown, Menu, Video } from 'lucide-react';
import SearchBar from '../shared/SearchBar';
import { UserAvatar } from '../shared/UserAvatar';

interface TeacherHeaderProps {
    onMenuClick: () => void;
}

export default function TeacherHeader({ onMenuClick }: TeacherHeaderProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Mock notifications
    const notifications = [
        { id: 1, message: 'New student enrolled in Math 101', time: '5 min ago', unread: true },
        { id: 2, message: 'Live session starts in 30 minutes', time: '25 min ago', unread: true },
        { id: 3, message: 'Assignment submitted by Ahmed', time: '1 hour ago', unread: false },
    ];

    const unreadCount = notifications.filter((n) => n.unread).length;

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="flex items-center justify-between px-4 lg:px-6 py-4">
                {/* Left Section */}
                <div className="flex items-center gap-4 flex-1">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* Search Bar */}
                    <div className="hidden sm:block flex-1 max-w-md">
                        <SearchBar variant="teacher" />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* Quick Action - Start Session */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        <Video className="w-4 h-4" />
                        <span className="text-sm">Start Session</span>
                    </motion.button>

                    {/* Notifications */}
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-3 rounded-xl hover:bg-gray-100 transition-colors"
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
                                <div className="p-4 border-b border-gray-100">
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${notif.unread ? 'bg-blue-50/50' : ''
                                                }`}
                                        >
                                            <p className="text-sm text-gray-900">{notif.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 text-center border-t border-gray-100">
                                    <button className="text-sm text-blue-500 font-medium hover:text-blue-600">
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
                            className="flex items-center gap-3 p-2 pr-3 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <UserAvatar
                                src={null}
                                name="Ahmed Hassan"
                                className="w-9 h-9 rounded-xl"
                            />
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-gray-900">Ahmed Hassan</p>
                                <p className="text-xs text-gray-500">Mathematics Teacher</p>
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
                                <div className="p-4 border-b border-gray-100">
                                    <p className="font-semibold text-gray-900">Ahmed Hassan</p>
                                    <p className="text-sm text-gray-500">ahmed@example.com</p>
                                </div>
                                <div className="p-2">
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                        My Profile
                                    </button>
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                        Settings
                                    </button>
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                        Help & Support
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
