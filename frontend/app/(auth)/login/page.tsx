'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Sparkles, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

type UserRole = 'student' | 'teacher' | 'admin';

// Role configurations
const roleConfigs = {
    student: {
        icon: '/login-signup assits/student.png',
        label: 'Student',
        labelAr: 'طالب',
        greeting: 'أهلاً بك يا بطل.. جاهز تكمل دروسك؟',
        greetingEn: 'Hey Champ! Ready to continue?',
        bgGradient: 'from-emerald-50 via-green-50 to-white',
        cardBorder: 'border-emerald-200',
        inputBorder: 'border-emerald-200 focus:ring-emerald-400',
        buttonBg: 'bg-emerald-500 hover:bg-emerald-600',
        accentColor: 'text-emerald-500',
        glowColor: 'shadow-[0_0_40px_rgba(16,185,129,0.4)]',
        bgAsset: '/ASSITS/CLOUD.png',
        decorAsset: '/ASSITS/TREE.png',
    },
    teacher: {
        icon: '/login-signup assits/teacher.png',
        label: 'Teacher',
        labelAr: 'مدرس',
        greeting: 'مرحباً بك يا أستاذ.. تلاميذك بانتظارك!',
        greetingEn: 'Welcome back, Teacher!',
        bgGradient: 'from-sky-50 via-blue-50 to-white',
        cardBorder: 'border-blue-200',
        inputBorder: 'border-blue-200 focus:ring-blue-400',
        buttonBg: 'bg-blue-500 hover:bg-blue-600',
        accentColor: 'text-blue-500',
        glowColor: 'shadow-[0_0_40px_rgba(59,130,246,0.4)]',
        bgAsset: '/ASSITS/global.png',
        decorAsset: '/ASSITS/folders.png',
    },
    admin: {
        icon: '/login-signup assits/manger.png',
        label: 'Admin',
        labelAr: 'مدير',
        greeting: 'لوحة التحكم بانتظارك.. القائد وصل!',
        greetingEn: 'Welcome, Commander!',
        bgGradient: 'from-amber-50 via-yellow-50 to-slate-50',
        cardBorder: 'border-amber-300',
        inputBorder: 'border-amber-200 focus:ring-amber-400',
        buttonBg: 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600',
        accentColor: 'text-amber-500',
        glowColor: 'shadow-[0_0_40px_rgba(245,158,11,0.5)]',
        bgAsset: '/ASSITS/lock.png',
        decorAsset: '/ASSITS/cup.png',
    },
};

export default function LoginPage() {
    const [role, setRole] = useState<UserRole>('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const config = roleConfigs[role];

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPassword = password.length >= 6;
    const canSubmit = isValidEmail && isValidPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        // Redirect based on role would happen here
    };

    return (
        <motion.div
            key={role}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`min-h-screen bg-gradient-to-br ${config.bgGradient} overflow-hidden relative flex items-center justify-center py-12 sm:py-16 px-4`}
        >
            {/* Background Decorations */}
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                loading="lazy"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 top-20 w-[150px] sm:w-[200px] md:w-[250px] opacity-30 pointer-events-none"
            />
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                loading="lazy"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-0 bottom-20 w-[120px] sm:w-[180px] md:w-[200px] opacity-20 pointer-events-none scale-x-[-1]"
            />
            <motion.img
                src="/ASSITS/TREE.png"
                alt=""
                loading="lazy"
                className="absolute left-[3%] bottom-0 w-[60px] sm:w-[80px] md:w-[100px] opacity-40 pointer-events-none hidden sm:block"
            />
            <motion.img
                src="/ASSITS/TREE.png"
                alt=""
                loading="lazy"
                className="absolute right-[5%] bottom-0 w-[50px] sm:w-[60px] md:w-[80px] opacity-30 pointer-events-none scale-x-[-1] hidden sm:block"
            />

            {/* Role-specific floating decoration */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={`decor-${role}`}
                    src={config.decorAsset}
                    alt=""
                    loading="lazy"
                    initial={{ scale: 0, rotate: -20, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 0.6, y: [0, -10, 0] }}
                    exit={{ scale: 0, rotate: 20, opacity: 0 }}
                    transition={{ duration: 0.5, y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
                    className="absolute top-[15%] right-[8%] w-16 sm:w-20 md:w-24 pointer-events-none hidden lg:block"
                />
            </AnimatePresence>

            <div className="container relative z-10">
                <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Side - Dynamic Role Avatar */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative flex justify-center order-2 lg:order-1"
                    >
                        {/* Glow Effect */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className={`absolute w-[200px] sm:w-[250px] md:w-[300px] h-[200px] sm:h-[250px] md:h-[300px] rounded-full bg-current opacity-20 blur-3xl ${config.accentColor}`}
                        />

                        {/* Floating Role Avatar */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`avatar-${role}`}
                                initial={{ scale: 0, rotate: -10, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1, y: [0, -15, 0] }}
                                exit={{ scale: 0, rotate: 10, opacity: 0 }}
                                transition={{
                                    duration: 0.5,
                                    y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }
                                }}
                                className="relative z-10"
                            >
                                <img
                                    src={config.icon}
                                    alt={config.label}
                                    loading="lazy"
                                    className="w-[140px] sm:w-[180px] md:w-[220px] h-auto drop-shadow-2xl"
                                />
                                {/* Sparkle */}
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--color-accent-400)] shadow-[0_0_20px_var(--color-accent-400)]`}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    {/* Right Side - Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="order-1 lg:order-2"
                    >
                        {/* Form Card */}
                        <motion.div
                            className={`bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border-2 ${config.cardBorder} relative transition-all duration-500 ${canSubmit ? config.glowColor : ''}`}
                        >
                            {/* Role Selector Tabs */}
                            <div className="mb-6">
                                <p className="text-center text-sm text-gray-500 mb-3">Choose your role</p>
                                <div className="flex justify-center gap-2 sm:gap-3">
                                    {(Object.keys(roleConfigs) as UserRole[]).map((r) => (
                                        <motion.button
                                            key={r}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setRole(r)}
                                            className={`relative p-2 sm:p-3 rounded-xl transition-all ${role === r
                                                ? `bg-white shadow-lg border-2 ${roleConfigs[r].cardBorder}`
                                                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                                }`}
                                        >
                                            <motion.img
                                                src={roleConfigs[r].icon}
                                                alt={roleConfigs[r].label}
                                                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                                                animate={role === r ? { scale: [1, 1.1, 1] } : {}}
                                                transition={{ duration: 0.3 }}
                                            />
                                            <span className="block text-[10px] sm:text-xs font-medium text-gray-600 mt-1">
                                                {roleConfigs[r].label}
                                            </span>
                                            {role === r && (
                                                <motion.div
                                                    layoutId="roleIndicator"
                                                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${roleConfigs[r].buttonBg}`}
                                                />
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Header - Dynamic based on role */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`header-${role}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-center mb-6"
                                >
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                        {config.greetingEn}
                                    </h1>
                                    <p className="text-gray-600 text-sm sm:text-base" dir="rtl">
                                        {config.greeting}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            <form onSubmit={handleSubmit}>
                                {/* Email Input */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email / البريد الإلكتروني
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className={`w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl border-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 text-base transition-all ${email && !isValidEmail
                                                ? 'border-red-300 focus:ring-red-400'
                                                : config.inputBorder
                                                }`}
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password / كلمة السر
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className={`w-full pl-12 pr-12 py-3 sm:py-4 rounded-xl border-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 text-base transition-all ${password && !isValidPassword
                                                ? 'border-red-300 focus:ring-red-400'
                                                : config.inputBorder
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember & Forgot */}
                                <div className="flex items-center justify-between mb-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className={`w-4 h-4 rounded ${config.accentColor}`}
                                        />
                                        <span className="text-sm text-gray-600">Remember me</span>
                                    </label>
                                    <Link href="/forgot-password" className={`text-sm ${config.accentColor} hover:underline font-medium`}>
                                        Forgot password?
                                    </Link>
                                </div>

                                {/* Submit Button - Color changes based on role */}
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: canSubmit ? 1.02 : 1 }}
                                    whileTap={{ scale: canSubmit ? 0.98 : 1 }}
                                    disabled={!canSubmit || isSubmitting}
                                    className={`w-full py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 transition-all active:scale-95 text-white shadow-lg ${canSubmit
                                        ? config.buttonBg
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Logging in...</span>
                                        </span>
                                    ) : (
                                        <>
                                            {role === 'student' && 'Start Learning'}
                                            {role === 'teacher' && 'Enter Classroom'}
                                            {role === 'admin' && 'Open Dashboard'}
                                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-4 text-sm text-gray-500">or</span>
                                </div>
                            </div>

                            {/* Sign Up Link - Only for students */}
                            {role === 'student' && (
                                <p className="text-center text-gray-600 text-sm">
                                    Don't have an account?{' '}
                                    <Link href="/signup" className={`${config.accentColor} font-semibold hover:underline`}>
                                        Sign up for free
                                    </Link>
                                </p>
                            )}

                            {role === 'teacher' && (
                                <p className="text-center text-gray-600 text-sm">
                                    Contact admin for teacher account access
                                </p>
                            )}

                            {role === 'admin' && (
                                <p className="text-center text-gray-600 text-sm flex items-center justify-center gap-1">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    <span>Admin access only</span>
                                </p>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
