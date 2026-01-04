'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentSidebar from '../components/student/StudentSidebar';
import StudentHeader from '../components/student/StudentHeader';

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
                <StudentSidebar
                    isCollapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
            </div>

            {/* Sidebar - Mobile Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed left-0 top-0 z-50 lg:hidden"
                        >
                            <StudentSidebar
                                isCollapsed={false}
                                onToggle={() => setMobileMenuOpen(false)}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <motion.main
                initial={false}
                animate={{
                    marginLeft: sidebarCollapsed ? 80 : 280,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="min-h-screen transition-all hidden lg:block"
            >
                <StudentHeader onMenuClick={() => setMobileMenuOpen(true)} />

                {/* Content Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="px-6 pb-8"
                >
                    {children}
                </motion.div>
            </motion.main>

            {/* Mobile Content */}
            <main className="min-h-screen lg:hidden">
                <StudentHeader onMenuClick={() => setMobileMenuOpen(true)} />

                {/* Content Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="px-4 pb-8"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
