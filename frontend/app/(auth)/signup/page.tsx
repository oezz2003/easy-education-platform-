'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Eye, EyeOff, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase/client';

// Step data
const levels = [
    { id: 'primary', label: 'Primary', labelAr: 'ابتدائي', icon: '/login-signup assits/abc blocks.png' },
    { id: 'preparatory', label: 'Preparatory', labelAr: 'إعدادي', icon: '/login-signup assits/compass.png' },
    { id: 'secondary', label: 'Secondary', labelAr: 'ثانوي', icon: '/login-signup assits/graduation hat.png' },
];

// Country codes
const countryCodes = [
    { code: '+20', country: 'Egypt', flag: '🇪🇬' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+1', country: 'USA', flag: '🇺🇸' },
];

interface FormData {
    name: string;
    level: string;
    countryCode: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// Star rain effect component
function StarRain({ show }: { show: boolean }) {
    if (!show) return null;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: -50, x: Math.random() * 100 + '%', opacity: 1, scale: 0 }}
                    animate={{
                        y: '100vh',
                        opacity: [1, 1, 0],
                        scale: [0, 1, 0.5],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        delay: Math.random() * 0.5,
                        ease: 'easeOut'
                    }}
                    className="absolute"
                >
                    <Star className="w-4 h-4 sm:w-6 sm:h-6 text-[var(--color-accent-500)] fill-[var(--color-accent-500)]" />
                </motion.div>
            ))}
        </div>
    );
}

// Step 1: Getting to Know You
function StepOne({
    data,
    onChange,
    onNext
}: {
    data: FormData;
    onChange: (updates: Partial<FormData>) => void;
    onNext: () => void;
}) {
    const selectedLevel = levels.find(l => l.id === data.level);
    const canProceed = data.name.trim().length >= 2 && data.level;

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-lg mx-auto"
        >
            {/* Pastel Green Block */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-100">
                {/* Question */}
                <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        أهلاً بك! 👋
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                        حابين نعرف بتنادينا منين؟
                    </p>
                </div>

                {/* Name Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name / اسمك
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => onChange({ name: e.target.value })}
                        placeholder="Enter your name..."
                        className="w-full px-4 py-3 sm:py-4 rounded-xl border-2 border-emerald-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-base sm:text-lg"
                    />
                </div>

                {/* Level Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Educational Level / المرحلة الدراسية
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {levels.map((level) => (
                            <motion.button
                                key={level.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onChange({ level: level.id })}
                                className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all ${data.level === level.id
                                    ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                                    : 'border-gray-200 bg-white hover:border-emerald-300'
                                    }`}
                            >
                                <div className="text-center">
                                    <span className="text-2xl sm:text-3xl block mb-1">
                                        {level.id === 'primary' ? '📚' : level.id === 'preparatory' ? '🧭' : '🎓'}
                                    </span>
                                    <span className="text-xs sm:text-sm font-medium text-gray-700 block">
                                        {level.label}
                                    </span>
                                    <span className="text-[10px] sm:text-xs text-gray-500">
                                        {level.labelAr}
                                    </span>
                                </div>
                                {data.level === level.id && (
                                    <motion.div
                                        layoutId="levelIndicator"
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                                    >
                                        <Check className="w-3 h-3 text-white" />
                                    </motion.div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Next Button */}
                <motion.button
                    whileHover={{ scale: canProceed ? 1.02 : 1 }}
                    whileTap={{ scale: canProceed ? 0.98 : 1 }}
                    onClick={canProceed ? onNext : undefined}
                    disabled={!canProceed}
                    className={`w-full py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${canProceed
                        ? 'bg-emerald-500 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Continue
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
            </div>

            {/* Dynamic 3D Asset based on level */}
            <div className="flex justify-center mt-6">
                <AnimatePresence mode="wait">
                    {selectedLevel && (
                        <motion.img
                            key={selectedLevel.id}
                            src={selectedLevel.icon}
                            alt={selectedLevel.label}
                            initial={{ scale: 0, rotate: -10, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: 10, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-xl"
                        />
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// Step 2: Contact
function StepTwo({
    data,
    onChange,
    onNext,
    onBack
}: {
    data: FormData;
    onChange: (updates: Partial<FormData>) => void;
    onNext: () => void;
    onBack: () => void;
}) {
    const canProceed = data.phone.length >= 8;

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-lg mx-auto"
        >
            {/* Pastel Blue Block */}
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-blue-100 relative">
                {/* Floating Text Bubble */}
                <motion.img
                    src="/ASSITS/text bubble.png"
                    alt=""
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-8 -right-4 w-16 h-16 sm:w-20 sm:h-20 object-contain pointer-events-none"
                />

                {/* Question */}
                <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        ممتاز يا {data.name}! 📱
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                        ممكن رقم موبايلك عشان نبعتلك أهم التحديثات؟
                    </p>
                </div>

                {/* Phone Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number / رقم الموبايل
                    </label>
                    <div className="flex gap-2">
                        {/* Country Code Selector */}
                        <select
                            value={data.countryCode}
                            onChange={(e) => onChange({ countryCode: e.target.value })}
                            className="px-3 py-3 sm:py-4 rounded-xl border-2 border-blue-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                        >
                            {countryCodes.map((c) => (
                                <option key={c.code} value={c.code}>
                                    {c.flag} {c.code}
                                </option>
                            ))}
                        </select>

                        {/* Phone Number */}
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => onChange({ phone: e.target.value.replace(/\D/g, '') })}
                            placeholder="1234567890"
                            className="flex-1 px-4 py-3 sm:py-4 rounded-xl border-2 border-blue-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-base sm:text-lg"
                        />
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2 sm:gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onBack}
                        className="px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all flex items-center gap-1 sm:gap-2 active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden xs:inline">Back</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: canProceed ? 1.02 : 1 }}
                        whileTap={{ scale: canProceed ? 0.98 : 1 }}
                        onClick={canProceed ? onNext : undefined}
                        disabled={!canProceed}
                        className={`flex-1 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${canProceed
                            ? 'bg-blue-500 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Continue
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

// Step 3: Magic Key
function StepThree({
    data,
    onChange,
    onSubmit,
    onBack,
    isSubmitting,
    error
}: {
    data: FormData;
    onChange: (updates: Partial<FormData>) => void;
    onSubmit: () => void;
    onBack: () => void;
    isSubmitting: boolean;
    error: string | null;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    const isValidPassword = data.password.length >= 6;
    const passwordsMatch = data.password === data.confirmPassword;
    const canProceed = isValidEmail && isValidPassword && passwordsMatch;

    // Glow effect when all valid
    const glowClass = canProceed ? 'shadow-[0_0_30px_rgba(234,179,8,0.5)]' : '';

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-lg mx-auto"
        >
            {/* Pastel Yellow/Gold Block */}
            <div className={`bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-100 relative transition-all duration-500 ${glowClass}`}>
                {/* Golden Lock */}
                <motion.div
                    className="absolute -top-10 -right-6 w-20 h-20 sm:w-24 sm:h-24"
                    animate={canProceed ? {
                        scale: [1, 1.1, 1],
                        rotate: [0, 10, -10, 0]
                    } : { y: [0, -5, 0] }}
                    transition={{ duration: canProceed ? 0.5 : 3, repeat: canProceed ? 0 : Infinity }}
                >
                    <img
                        src="/ASSITS/lock.png"
                        alt=""
                        className="w-full h-full object-contain drop-shadow-xl"
                    />
                    {canProceed && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <Sparkles className="w-8 h-8 text-amber-500" />
                        </motion.div>
                    )}
                </motion.div>

                {/* Question */}
                <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        آخر خطوة! 🔐
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                        إيميلك عشان تفتح بوابة دروسك!
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Email Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email / البريد الإلكتروني
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => onChange({ email: e.target.value })}
                        placeholder="your@email.com"
                        className={`w-full px-4 py-3 sm:py-4 rounded-xl border-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 text-base sm:text-lg transition-all ${data.email && !isValidEmail
                            ? 'border-red-300 focus:ring-red-400'
                            : 'border-amber-200 focus:ring-amber-400'
                            }`}
                    />
                </div>

                {/* Password Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password / كلمة السر
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => onChange({ password: e.target.value })}
                            placeholder="••••••••"
                            className={`w-full px-4 py-3 sm:py-4 pr-12 rounded-xl border-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 text-base sm:text-lg transition-all ${data.password && !isValidPassword
                                ? 'border-red-300 focus:ring-red-400'
                                : 'border-amber-200 focus:ring-amber-400'
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {data.password && !isValidPassword && (
                        <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password / تأكيد كلمة السر
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={data.confirmPassword}
                            onChange={(e) => onChange({ confirmPassword: e.target.value })}
                            placeholder="••••••••"
                            className={`w-full px-4 py-3 sm:py-4 pr-12 rounded-xl border-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 text-base sm:text-lg transition-all ${data.confirmPassword && !passwordsMatch
                                ? 'border-red-300 focus:ring-red-400'
                                : 'border-amber-200 focus:ring-amber-400'
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {data.confirmPassword && !passwordsMatch && (
                        <p className="text-red-500 text-xs mt-1">Passwords don't match</p>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2 sm:gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onBack}
                        className="px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all flex items-center gap-1 sm:gap-2 active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden xs:inline">Back</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: canProceed ? 1.02 : 1 }}
                        whileTap={{ scale: canProceed ? 0.98 : 1 }}
                        onClick={canProceed ? onSubmit : undefined}
                        disabled={!canProceed || isSubmitting}
                        className={`flex-1 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${canProceed
                            ? 'bg-amber-500 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span className="hidden sm:inline">Creating...</span>
                            </span>
                        ) : (
                            <>
                                <span className="hidden sm:inline">Create Account</span>
                                <span className="sm:hidden">Sign Up</span>
                                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

// Main Signup Page
export default function SignupPage() {
    const router = useRouter();
    const { signUp } = useAuth();
    const supabase = getSupabaseClient();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        level: '',
        countryCode: '+20',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showStars, setShowStars] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateForm = (updates: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const handleNext = () => {
        setShowStars(true);
        setTimeout(() => {
            setShowStars(false);
            setStep((prev) => prev + 1);
        }, 800);
    };

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setShowStars(true);
        setError(null);

        try {
            // 1. Create auth user with role and name in metadata
            const { success, error: signUpError, data } = await signUp(
                formData.email,
                formData.password,
                'student',
                formData.name
            );

            if (!success || signUpError) {
                setError(signUpError || 'Failed to create account');
                setIsSubmitting(false);
                setShowStars(false);
                return;
            }

            // 2. Update student_profiles with level and phone
            // The trigger already created the student_profile, we just need to update it
            if (data?.user) {
                const { error: updateError } = await supabase
                    .from('student_profiles')
                    .update({
                        level: formData.level,
                        parent_phone: `${formData.countryCode}${formData.phone}`,
                    })
                    .eq('user_id', data.user.id);

                if (updateError) {
                    console.warn('Could not update student profile:', updateError);
                    // Not a critical error, continue anyway
                }
            }

            setIsSubmitting(false);
            setIsComplete(true);
        } catch (err) {
            setError('An unexpected error occurred');
            setIsSubmitting(false);
            setShowStars(false);
        }
    };

    // Progress percentage
    const progress = ((step - 1) / 2) * 100;

    if (isComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mb-6"
                    >
                        <img
                            src="/ASSITS/cup.png"
                            alt="Success"
                            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto drop-shadow-2xl"
                        />
                    </motion.div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                        Welcome, {formData.name}! 🎉
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Your account has been created successfully!
                    </p>
                    <Link href="/levels">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-full bg-[var(--color-primary-500)] text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 mx-auto"
                        >
                            Start Learning
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 overflow-hidden relative pt-20 sm:pt-24 pb-12">
            {/* Star Rain Effect */}
            <StarRain show={showStars} />

            {/* Background Decorations */}
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                className="absolute left-0 bottom-0 w-[150px] sm:w-[200px] md:w-[300px] opacity-30 pointer-events-none"
            />
            <motion.img
                src="/ASSITS/CLOUD.png"
                alt=""
                className="absolute right-0 bottom-20 w-[120px] sm:w-[180px] md:w-[250px] opacity-20 pointer-events-none scale-x-[-1]"
            />
            <motion.img
                src="/ASSITS/TREE.png"
                alt=""
                className="absolute left-[5%] bottom-0 w-[60px] sm:w-[80px] md:w-[100px] opacity-40 pointer-events-none hidden sm:block"
            />
            <motion.img
                src="/ASSITS/TREE.png"
                alt=""
                className="absolute right-[5%] bottom-0 w-[50px] sm:w-[60px] md:w-[80px] opacity-30 pointer-events-none scale-x-[-1] hidden sm:block"
            />

            <div className="container relative z-10 px-4">
                {/* Progress Cloud */}
                <div className="max-w-lg mx-auto mb-8 relative">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2"
                        animate={{ left: `${Math.min(progress, 90)}%` }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.img
                            src="/ASSITS/CLOUD.png"
                            alt=""
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-12 h-8 sm:w-16 sm:h-10 object-contain -mt-4"
                        />
                    </motion.div>
                    <div className="flex justify-between mt-3 text-xs sm:text-sm text-gray-500">
                        <span>Step {step} of 3</span>
                        <span>{Math.round(progress)}% Complete</span>
                    </div>
                </div>

                {/* Steps */}
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <StepOne
                            key="step1"
                            data={formData}
                            onChange={updateForm}
                            onNext={handleNext}
                        />
                    )}
                    {step === 2 && (
                        <StepTwo
                            key="step2"
                            data={formData}
                            onChange={updateForm}
                            onNext={handleNext}
                            onBack={handleBack}
                        />
                    )}
                    {step === 3 && (
                        <StepThree
                            key="step3"
                            data={formData}
                            onChange={updateForm}
                            onSubmit={handleSubmit}
                            onBack={handleBack}
                            isSubmitting={isSubmitting}
                            error={error}
                        />
                    )}
                </AnimatePresence>

                {/* Login Link */}
                <div className="text-center mt-8">
                    <p className="text-gray-600 text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[var(--color-primary-500)] font-semibold hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
