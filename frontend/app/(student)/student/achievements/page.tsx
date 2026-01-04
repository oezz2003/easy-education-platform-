'use client';

import { motion } from 'framer-motion';
import {
    Trophy,
    Star,
    Zap,
    Flame,
    Target,
    BookOpen,
    Clock,
    Award,
    Lock,
    TrendingUp
} from 'lucide-react';

// Level data
const levelData = {
    current: 12,
    xp: 2450,
    xpToNext: 3000,
    title: 'Rising Scholar',
};

// Unlocked badges
const unlockedBadges = [
    { id: 1, name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', color: 'emerald', xp: 25, date: '2024-01-15' },
    { id: 2, name: 'Quick Learner', description: 'Complete 10 lessons in a day', icon: '⚡', color: 'amber', xp: 100, date: '2024-01-20' },
    { id: 3, name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', color: 'orange', xp: 75, date: '2024-02-01' },
    { id: 4, name: 'Math Whiz', description: 'Score 100% on a math quiz', icon: '🧮', color: 'purple', xp: 150, date: '2024-02-10' },
    { id: 5, name: 'Bookworm', description: 'Complete an entire course', icon: '📚', color: 'blue', xp: 200, date: '2024-02-15' },
    { id: 6, name: 'Early Bird', description: 'Start learning before 7 AM', icon: '🌅', color: 'pink', xp: 50, date: '2024-02-20' },
];

// Locked badges
const lockedBadges = [
    { id: 7, name: 'Master Scholar', description: 'Complete 5 courses', icon: '🎓', color: 'gray', xp: 500, progress: 1, total: 5 },
    { id: 8, name: 'Month Champion', description: '30-day learning streak', icon: '👑', color: 'gray', xp: 300, progress: 7, total: 30 },
    { id: 9, name: 'Perfectionist', description: 'Get 5 perfect quiz scores', icon: '💎', color: 'gray', xp: 250, progress: 2, total: 5 },
    { id: 10, name: 'Social Learner', description: 'Attend 10 live sessions', icon: '🎥', color: 'gray', xp: 200, progress: 3, total: 10 },
];

// Leaderboard
const leaderboard = [
    { rank: 1, name: 'Sara Hassan', xp: 5420, avatar: 'https://i.pravatar.cc/150?img=5', level: 18 },
    { rank: 2, name: 'Ahmed Mohamed', xp: 4890, avatar: 'https://i.pravatar.cc/150?img=12', level: 16 },
    { rank: 3, name: 'Omar Ahmed', xp: 2450, avatar: 'https://i.pravatar.cc/150?img=33', level: 12, isUser: true },
    { rank: 4, name: 'Fatma Ali', xp: 2100, avatar: 'https://i.pravatar.cc/150?img=9', level: 11 },
    { rank: 5, name: 'Khaled Ibrahim', xp: 1850, avatar: 'https://i.pravatar.cc/150?img=3', level: 10 },
];

const colorClasses: Record<string, string> = {
    emerald: 'from-emerald-400 to-green-500',
    amber: 'from-amber-400 to-yellow-500',
    orange: 'from-orange-400 to-red-500',
    purple: 'from-purple-400 to-pink-500',
    blue: 'from-blue-400 to-cyan-500',
    pink: 'from-pink-400 to-rose-500',
    gray: 'from-gray-300 to-gray-400',
};

export default function AchievementsPage() {
    const xpProgress = (levelData.xp / levelData.xpToNext) * 100;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <img
                        src="/ASSITS/cup.png"
                        alt="Achievements"
                        loading="lazy"
                        className="w-14 h-14 object-contain"
                    />
                </motion.div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Achievements
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Track your progress and unlock rewards
                    </p>
                </div>
            </motion.div>

            {/* Level Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative bg-gradient-to-r from-emerald-500 to-green-500 rounded-[2rem] p-6 shadow-xl overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />

                <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">{levelData.current}</span>
                        </div>
                        <div className="text-white">
                            <p className="text-emerald-100 text-sm">Current Level</p>
                            <h2 className="text-2xl font-bold">{levelData.title}</h2>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center justify-between text-white mb-2">
                            <span className="flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                {levelData.xp.toLocaleString()} XP
                            </span>
                            <span>{levelData.xpToNext.toLocaleString()} XP to Level {levelData.current + 1}</span>
                        </div>
                        <div className="w-full h-4 bg-white/30 rounded-full">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${xpProgress}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className="h-full bg-white rounded-full"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-white">
                        <div className="text-center">
                            <div className="flex items-center gap-1">
                                <Flame className="w-5 h-5 text-orange-300" />
                                <span className="text-2xl font-bold">7</span>
                            </div>
                            <p className="text-xs text-emerald-100">Day Streak</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-1">
                                <Trophy className="w-5 h-5 text-amber-300" />
                                <span className="text-2xl font-bold">{unlockedBadges.length}</span>
                            </div>
                            <p className="text-xs text-emerald-100">Badges</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Badges Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Unlocked Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[2rem] p-6 shadow-lg border-b-4 border-amber-400"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-amber-500" />
                            Unlocked Badges ({unlockedBadges.length})
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {unlockedBadges.map((badge, index) => (
                                <motion.div
                                    key={badge.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="relative p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 text-center"
                                >
                                    <div className={`w-14 h-14 rounded-2xl mx-auto mb-2 flex items-center justify-center bg-gradient-to-br ${colorClasses[badge.color]}`}>
                                        <span className="text-2xl">{badge.icon}</span>
                                    </div>
                                    <p className="font-semibold text-gray-900 text-sm">{badge.name}</p>
                                    <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
                                    <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                                        +{badge.xp} XP
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Locked Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-[2rem] p-6 shadow-lg border-b-4 border-gray-300"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-gray-400" />
                            Locked Badges ({lockedBadges.length})
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {lockedBadges.map((badge, index) => (
                                <motion.div
                                    key={badge.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="relative p-4 rounded-2xl bg-gray-50 text-center opacity-60"
                                >
                                    <div className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center bg-gray-200">
                                        <Lock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <p className="font-semibold text-gray-600 text-sm">{badge.name}</p>
                                    <p className="text-xs text-gray-400 mb-2">{badge.progress}/{badge.total}</p>
                                    <div className="w-full h-1 bg-gray-200 rounded-full">
                                        <div
                                            className="h-full bg-gray-400 rounded-full"
                                            style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Leaderboard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-[2rem] p-6 shadow-lg border-b-4 border-purple-400"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                        Leaderboard
                    </h3>
                    <div className="space-y-3">
                        {leaderboard.map((user, index) => (
                            <motion.div
                                key={user.rank}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className={`flex items-center gap-3 p-3 rounded-xl ${user.isUser ? 'bg-emerald-50 ring-2 ring-emerald-500' : 'bg-gray-50'
                                    }`}
                            >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${user.rank === 1 ? 'bg-amber-400 text-white' :
                                    user.rank === 2 ? 'bg-gray-300 text-gray-700' :
                                        user.rank === 3 ? 'bg-amber-600 text-white' :
                                            'bg-gray-200 text-gray-600'
                                    }`}>
                                    {user.rank}
                                </span>
                                <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 text-sm">
                                        {user.name} {user.isUser && <span className="text-emerald-500">(You)</span>}
                                    </p>
                                    <p className="text-xs text-gray-500">Level {user.level}</p>
                                </div>
                                <span className="text-sm font-bold text-purple-600">{user.xp.toLocaleString()} XP</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
