'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ArrowLeft,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    Maximize,
    CheckCircle,
    Circle,
    Clock,
    BookOpen,
    FileText,
    ChevronDown,
    ChevronUp,
    Award
} from 'lucide-react';

// Mock course data
const courseData = {
    id: '1',
    title: 'Advanced Algebra',
    currentLesson: {
        id: '2-1',
        title: 'Solving Equations with Variables',
        duration: '22:45',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    xpReward: 50,
};

// Mock curriculum
const curriculum = [
    {
        id: '1',
        title: 'Introduction to Algebra',
        completed: true,
        lessons: [
            { id: '1-1', title: 'Course Overview', duration: '5:30', completed: true, isPreview: true },
            { id: '1-2', title: 'What is Algebra?', duration: '12:20', completed: true, isPreview: false },
            { id: '1-3', title: 'Basic Concepts', duration: '15:45', completed: true, isPreview: false },
        ]
    },
    {
        id: '2',
        title: 'Equations & Variables',
        completed: false,
        lessons: [
            { id: '2-1', title: 'Solving Equations with Variables', duration: '22:45', completed: false, isPreview: false, current: true },
            { id: '2-2', title: 'Multi-Step Equations', duration: '18:30', completed: false, isPreview: false },
            { id: '2-3', title: 'Word Problems', duration: '25:00', completed: false, isPreview: false },
        ]
    },
    {
        id: '3',
        title: 'Functions & Graphs',
        completed: false,
        lessons: [
            { id: '3-1', title: 'Introduction to Functions', duration: '20:15', completed: false, isPreview: false },
            { id: '3-2', title: 'Graphing Linear Functions', duration: '28:30', completed: false, isPreview: false },
            { id: '3-3', title: 'Slope and Intercepts', duration: '22:00', completed: false, isPreview: false },
        ]
    },
];

export default function CoursePlayerPage() {
    const params = useParams();
    const [isPlaying, setIsPlaying] = useState(false);
    const [expandedModules, setExpandedModules] = useState<string[]>(['1', '2']);
    const [showNotes, setShowNotes] = useState(false);
    const [notes, setNotes] = useState('');

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const totalLessons = curriculum.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedLessons = curriculum.reduce((acc, m) => acc + m.lessons.filter(l => l.completed).length, 0);
    const progress = Math.round((completedLessons / totalLessons) * 100);

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <Link href="/student/courses">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-xl bg-white shadow-lg border border-gray-100 hover:bg-gray-50"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </motion.button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">{courseData.title}</h1>
                    <p className="text-gray-500 text-sm">{courseData.currentLesson.title}</p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-100 rounded-full">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-bold text-amber-700">+{courseData.xpReward} XP</span>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Video Player Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 space-y-4"
                >
                    {/* Video Container */}
                    <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
                        <iframe
                            src={courseData.currentLesson.videoUrl}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    {/* Video Controls */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-gray-900">{courseData.currentLesson.title}</h2>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {courseData.currentLesson.duration}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-gray-200 rounded-full mb-4">
                            <div className="w-1/3 h-full bg-emerald-500 rounded-full" />
                        </div>

                        {/* Control Buttons */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <SkipBack className="w-5 h-5 text-gray-600" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="p-3 rounded-full bg-emerald-500 text-white hover:bg-emerald-600"
                                >
                                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <SkipForward className="w-5 h-5 text-gray-600" />
                                </motion.button>
                            </div>

                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => setShowNotes(!showNotes)}
                                    className={`p-2 rounded-lg ${showNotes ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-gray-100 text-gray-600'}`}
                                >
                                    <FileText className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <Volume2 className="w-5 h-5 text-gray-600" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <Maximize className="w-5 h-5 text-gray-600" />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    {showNotes && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
                        >
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-emerald-500" />
                                Your Notes
                            </h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Take notes as you learn..."
                                className="w-full h-32 p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                            />
                        </motion.div>
                    )}

                    {/* Mark Complete Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                    >
                        <CheckCircle className="w-5 h-5" />
                        Mark as Complete & Continue
                    </motion.button>
                </motion.div>

                {/* Curriculum Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                    {/* Progress Header */}
                    <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-500">
                        <div className="flex items-center justify-between text-white mb-2">
                            <span className="font-semibold">Course Progress</span>
                            <span className="font-bold">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/30 rounded-full">
                            <div
                                className="h-full bg-white rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-emerald-100 text-sm mt-2">
                            {completedLessons} of {totalLessons} lessons completed
                        </p>
                    </div>

                    {/* Curriculum List */}
                    <div className="max-h-[500px] overflow-y-auto">
                        {curriculum.map((module) => (
                            <div key={module.id} className="border-b border-gray-100 last:border-0">
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                        {module.completed ? (
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-300" />
                                        )}
                                        <span className="font-medium text-gray-900 text-left">{module.title}</span>
                                    </div>
                                    {expandedModules.includes(module.id) ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>

                                {expandedModules.includes(module.id) && (
                                    <div className="pb-2">
                                        {module.lessons.map((lesson) => (
                                            <button
                                                key={lesson.id}
                                                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 ${lesson.current ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''
                                                    }`}
                                            >
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-100">
                                                    {lesson.completed ? (
                                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                    ) : lesson.current ? (
                                                        <Play className="w-4 h-4 text-emerald-500" />
                                                    ) : (
                                                        <Play className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className={`text-sm ${lesson.current ? 'font-semibold text-emerald-600' : lesson.completed ? 'text-gray-500' : 'text-gray-700'
                                                        }`}>
                                                        {lesson.title}
                                                    </p>
                                                    <p className="text-xs text-gray-400">{lesson.duration}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
