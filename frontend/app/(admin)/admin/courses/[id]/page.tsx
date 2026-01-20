'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    BookOpen,
    Users,
    Star,
    Clock,
    DollarSign,
    Play,
    Edit,
    MoreHorizontal,
    Plus,
    ChevronDown,
    ChevronRight,
    Trash2,
    GripVertical,
    FileText,
    Video,
    MessageSquare,
    TrendingUp,
    X,
    Upload,
    Link as LinkIcon,
    HelpCircle,
    Image,
    Headphones,
    Code,
    Check
} from 'lucide-react';
import EnrollStudentModal from '@/app/components/admin/EnrollStudentModal';

// Lesson content types
const lessonTypes = [
    { id: 'video', name: 'Video', icon: Video, color: 'purple', description: 'Video lesson with streaming' },
    { id: 'pdf', name: 'PDF Document', icon: FileText, color: 'red', description: 'Downloadable PDF file' },
    { id: 'quiz', name: 'Quiz', icon: HelpCircle, color: 'blue', description: 'Interactive quiz or test' },
    { id: 'audio', name: 'Audio', icon: Headphones, color: 'emerald', description: 'Audio lesson or podcast' },
    { id: 'image', name: 'Image Gallery', icon: Image, color: 'amber', description: 'Image slides or gallery' },
    { id: 'code', name: 'Code Exercise', icon: Code, color: 'cyan', description: 'Interactive coding exercise' },
    { id: 'text', name: 'Text Article', icon: FileText, color: 'gray', description: 'Rich text content' },
    { id: 'link', name: 'External Link', icon: LinkIcon, color: 'indigo', description: 'Link to external resource' },
];

// Mock course data
const mockCourse = {
    id: '1',
    title: 'Advanced Mathematics',
    description: 'Complete course covering algebra, calculus, and geometry for secondary level students.',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800',
    teacher: { id: '1', name: 'Ahmed Hassan', avatar: 'https://i.pravatar.cc/150?img=11' },
    subject: 'Mathematics',
    subjectIcon: '/ASSITS/calc.png',
    level: 'Secondary',
    studentsCount: 125,
    lessonsCount: 45,
    duration: '24h 30m',
    rating: 4.9,
    reviewsCount: 89,
    price: 199,
    status: 'published',
    createdAt: '2024-01-15',
    completionRate: 72,
    revenue: 24875,
};

// Mock enrolled students
const enrolledStudents = [
    { id: '1', name: 'Omar Khaled', avatar: 'https://i.pravatar.cc/150?img=12', progress: 85, joinedAt: '2024-01-20' },
    { id: '2', name: 'Fatma Nour', avatar: 'https://i.pravatar.cc/150?img=9', progress: 62, joinedAt: '2024-02-05' },
    { id: '3', name: 'Youssef Ibrahim', avatar: 'https://i.pravatar.cc/150?img=15', progress: 45, joinedAt: '2024-02-15' },
    { id: '4', name: 'Laila Hassan', avatar: 'https://i.pravatar.cc/150?img=20', progress: 100, joinedAt: '2024-01-18' },
];

// Mock reviews
const courseReviews = [
    { id: '1', student: 'Omar Khaled', avatar: 'https://i.pravatar.cc/150?img=12', rating: 5, comment: 'Excellent course! Very well structured.', date: '2024-12-20' },
    { id: '2', student: 'Fatma Nour', avatar: 'https://i.pravatar.cc/150?img=9', rating: 5, comment: 'Ahmed is an amazing teacher.', date: '2024-12-18' },
    { id: '3', student: 'Youssef Ibrahim', avatar: 'https://i.pravatar.cc/150?img=15', rating: 4, comment: 'Great content, would recommend!', date: '2024-12-15' },
];

const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'curriculum', label: 'Curriculum', icon: Play },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
];

const statusColors = {
    published: 'bg-emerald-100 text-emerald-700',
    draft: 'bg-amber-100 text-amber-700',
    archived: 'bg-gray-100 text-gray-600',
};

interface Lesson {
    id: string;
    title: string;
    type: string;
    duration: string;
    isPreview: boolean;
}

interface Chapter {
    id: string;
    title: string;
    lessons: Lesson[];
}

export default function CourseDetailsPage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [expandedChapters, setExpandedChapters] = useState<string[]>(['1']);

    // Modal states
    const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

    // Form states
    const [chapterTitle, setChapterTitle] = useState('');
    const [lessonData, setLessonData] = useState({
        title: '',
        type: '',
        duration: '',
        isPreview: false,
        url: '',
        file: null as File | null,
    });

    // Curriculum state
    const [curriculum, setCurriculum] = useState<Chapter[]>([
        {
            id: '1',
            title: 'Introduction to Algebra',
            lessons: [
                { id: '1-1', title: 'What is Algebra?', type: 'video', duration: '12:30', isPreview: true },
                { id: '1-2', title: 'Variables and Constants', type: 'video', duration: '15:45', isPreview: false },
                { id: '1-3', title: 'Practice Quiz', type: 'quiz', duration: '10 questions', isPreview: false },
            ],
        },
        {
            id: '2',
            title: 'Linear Equations',
            lessons: [
                { id: '2-1', title: 'Solving Linear Equations', type: 'video', duration: '18:20', isPreview: false },
                { id: '2-2', title: 'Word Problems', type: 'video', duration: '22:15', isPreview: false },
                { id: '2-3', title: 'Worksheet', type: 'pdf', duration: '5 pages', isPreview: false },
            ],
        },
        {
            id: '3',
            title: 'Quadratic Equations',
            lessons: [
                { id: '3-1', title: 'Introduction to Quadratics', type: 'video', duration: '14:50', isPreview: true },
                { id: '3-2', title: 'Factoring Methods', type: 'video', duration: '20:30', isPreview: false },
            ],
        },
    ]);

    const course = mockCourse;

    const toggleChapter = (chapterId: string) => {
        setExpandedChapters((prev) =>
            prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId]
        );
    };

    const getLessonIcon = (type: string) => {
        const lessonType = lessonTypes.find(t => t.id === type);
        return lessonType?.icon || Play;
    };

    const getLessonColor = (type: string) => {
        const lessonType = lessonTypes.find(t => t.id === type);
        return lessonType?.color || 'gray';
    };

    // Add Chapter
    const handleAddChapter = () => {
        if (!chapterTitle.trim()) return;

        const newChapter: Chapter = {
            id: `${Date.now()}`,
            title: chapterTitle,
            lessons: [],
        };
        setCurriculum([...curriculum, newChapter]);
        setChapterTitle('');
        setIsChapterModalOpen(false);
        setExpandedChapters([...expandedChapters, newChapter.id]);
    };

    // Open Add Lesson Modal
    const openLessonModal = (chapterId: string) => {
        setSelectedChapterId(chapterId);
        setLessonData({ title: '', type: '', duration: '', isPreview: false, url: '', file: null });
        setIsLessonModalOpen(true);
    };

    // Add Lesson
    const handleAddLesson = () => {
        if (!lessonData.title.trim() || !lessonData.type || !selectedChapterId) return;

        const newLesson: Lesson = {
            id: `${selectedChapterId}-${Date.now()}`,
            title: lessonData.title,
            type: lessonData.type,
            duration: lessonData.duration || 'N/A',
            isPreview: lessonData.isPreview,
        };

        setCurriculum(curriculum.map(chapter =>
            chapter.id === selectedChapterId
                ? { ...chapter, lessons: [...chapter.lessons, newLesson] }
                : chapter
        ));
        setLessonData({ title: '', type: '', duration: '', isPreview: false, url: '', file: null });
        setIsLessonModalOpen(false);
    };

    // Delete Lesson
    const handleDeleteLesson = (chapterId: string, lessonId: string) => {
        setCurriculum(curriculum.map(chapter =>
            chapter.id === chapterId
                ? { ...chapter, lessons: chapter.lessons.filter(l => l.id !== lessonId) }
                : chapter
        ));
    };

    // Delete Chapter
    const handleDeleteChapter = (chapterId: string) => {
        setCurriculum(curriculum.filter(c => c.id !== chapterId));
    };

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Link href="/admin/courses" className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-500 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Courses</span>
                </Link>
            </motion.div>

            {/* Course Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
            >
                <div className="relative h-48 md:h-64 overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} loading="lazy" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[course.status as keyof typeof statusColors]}`}>
                                        {course.status}
                                    </span>
                                    <span className="text-white/80 text-sm">{course.level}</span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{course.title}</h1>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <img src={course.teacher.avatar} alt="" className="w-8 h-8 rounded-full" />
                                        <span className="text-white/90">{course.teacher.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-white/90">
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        <span>{course.rating}</span>
                                        <span className="text-white/60">({course.reviewsCount})</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-xl bg-white/20 backdrop-blur text-white hover:bg-white/30">
                                    <Edit className="w-5 h-5" />
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-xl bg-white/20 backdrop-blur text-white hover:bg-white/30">
                                    <MoreHorizontal className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 border-b border-gray-100">
                    {[
                        { label: 'Students', value: course.studentsCount, icon: Users },
                        { label: 'Lessons', value: curriculum.reduce((acc, c) => acc + c.lessons.length, 0), icon: Play },
                        { label: 'Duration', value: course.duration, icon: Clock },
                        { label: 'Price', value: `$${course.price}`, icon: DollarSign },
                        { label: 'Revenue', value: `$${course.revenue.toLocaleString()}`, icon: TrendingUp },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                                <stat.icon className="w-4 h-4" />
                                <span className="font-bold text-lg text-gray-900">{stat.value}</span>
                            </div>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-2 bg-gray-50">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${activeTab === tab.id ? 'bg-white text-purple-600 shadow' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Course</h2>
                                <p className="text-gray-600 leading-relaxed">{course.description}</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Completion Rate</h2>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-4 rounded-full bg-gray-100 overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${course.completionRate}%` }} transition={{ delay: 0.3, duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />
                                    </div>
                                    <span className="font-bold text-gray-900">{course.completionRate}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Teacher</h2>
                            <div className="flex items-center gap-4">
                                <img src={course.teacher.avatar} alt="" className="w-16 h-16 rounded-2xl" />
                                <div>
                                    <p className="font-bold text-gray-900">{course.teacher.name}</p>
                                    <p className="text-sm text-gray-500">{course.subject} Instructor</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'curriculum' && (
                    <motion.div key="curriculum" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Course Curriculum</h2>
                                <p className="text-sm text-gray-500">{curriculum.length} chapters • {curriculum.reduce((acc, c) => acc + c.lessons.length, 0)} lessons</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsChapterModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Add Chapter
                            </motion.button>
                        </div>

                        <div className="space-y-4">
                            {curriculum.map((chapter, chapterIndex) => (
                                <div key={chapter.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                                        <button onClick={() => toggleChapter(chapter.id)} className="flex items-center gap-2">
                                            {expandedChapters.includes(chapter.id) ? (
                                                <ChevronDown className="w-5 h-5 text-gray-500" />
                                            ) : (
                                                <ChevronRight className="w-5 h-5 text-gray-500" />
                                            )}
                                        </button>
                                        <span className="font-semibold text-gray-900 flex-1">Chapter {chapterIndex + 1}: {chapter.title}</span>
                                        <span className="text-sm text-gray-500">{chapter.lessons.length} lessons</span>
                                        <button onClick={() => handleDeleteChapter(chapter.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {expandedChapters.includes(chapter.id) && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                                <div className="divide-y divide-gray-100">
                                                    {chapter.lessons.map((lesson) => {
                                                        const LessonIcon = getLessonIcon(lesson.type);
                                                        const color = getLessonColor(lesson.type);
                                                        return (
                                                            <div key={lesson.id} className="flex items-center gap-3 p-4 hover:bg-gray-50">
                                                                <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                                                                <div className={`w-8 h-8 rounded-lg bg-${color}-100 flex items-center justify-center`}>
                                                                    <LessonIcon className={`w-4 h-4 text-${color}-500`} />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-gray-900">{lesson.title}</p>
                                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                        <span className="capitalize">{lesson.type}</span>
                                                                        <span>•</span>
                                                                        <span>{lesson.duration}</span>
                                                                    </div>
                                                                </div>
                                                                {lesson.isPreview && (
                                                                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">Preview</span>
                                                                )}
                                                                <button onClick={() => handleDeleteLesson(chapter.id, lesson.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                    <button
                                                        onClick={() => openLessonModal(chapter.id)}
                                                        className="w-full p-3 text-purple-500 hover:bg-purple-50 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Add Lesson
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}

                            {curriculum.length === 0 && (
                                <div className="text-center py-12">
                                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No chapters yet. Add your first chapter to get started.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'students' && (
                    <motion.div key="students" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Enrolled Students</h2>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">{enrolledStudents.length} students</span>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsEnrollModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Student
                                </motion.button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {enrolledStudents.map((student) => (
                                <div key={student.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-purple-200 transition-colors">
                                    <img src={student.avatar} alt="" className="w-10 h-10 rounded-full" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{student.name}</p>
                                        <p className="text-xs text-gray-500">Joined {new Date(student.joinedAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24">
                                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                <div className="h-full rounded-full bg-purple-500" style={{ width: `${student.progress}%` }} />
                                            </div>
                                        </div>
                                        <span className={`font-medium ${student.progress === 100 ? 'text-emerald-500' : 'text-gray-600'}`}>{student.progress}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'reviews' && (
                    <motion.div key="reviews" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Student Reviews</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                    <span className="font-bold text-gray-900">{course.rating}</span>
                                    <span className="text-gray-500">({course.reviewsCount} reviews)</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {courseReviews.map((review) => (
                                <div key={review.id} className="p-4 rounded-xl bg-gray-50">
                                    <div className="flex items-start gap-4">
                                        <img src={review.avatar} alt="" className="w-10 h-10 rounded-full" />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-gray-900">{review.student}</p>
                                                <div className="flex items-center gap-0.5">
                                                    {Array.from({ length: review.rating }).map((_, i) => (
                                                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 mt-1">{review.comment}</p>
                                            <p className="text-xs text-gray-400 mt-2">{new Date(review.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Chapter Modal */}
            <AnimatePresence>
                {isChapterModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsChapterModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto">
                                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900">Add New Chapter</h2>
                                    <button onClick={() => setIsChapterModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Chapter Title</label>
                                        <input
                                            type="text"
                                            value={chapterTitle}
                                            onChange={(e) => setChapterTitle(e.target.value)}
                                            placeholder="e.g., Introduction to Calculus"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                        />
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleAddChapter}
                                        disabled={!chapterTitle.trim()}
                                        className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Add Chapter
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Add Lesson Modal */}
            <AnimatePresence>
                {isLessonModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLessonModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto">
                                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900">Add New Lesson</h2>
                                    <button onClick={() => setIsLessonModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    {/* Content Type Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Content Type</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {lessonTypes.map((type) => (
                                                <motion.button
                                                    key={type.id}
                                                    type="button"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setLessonData({ ...lessonData, type: type.id })}
                                                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${lessonData.type === type.id
                                                        ? 'border-purple-500 bg-purple-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <type.icon className={`w-5 h-5 ${lessonData.type === type.id ? 'text-purple-500' : 'text-gray-500'}`} />
                                                    <span className={`text-xs font-medium ${lessonData.type === type.id ? 'text-purple-600' : 'text-gray-600'}`}>
                                                        {type.name.split(' ')[0]}
                                                    </span>
                                                </motion.button>
                                            ))}
                                        </div>
                                        {lessonData.type && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                {lessonTypes.find(t => t.id === lessonData.type)?.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Lesson Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
                                        <input
                                            type="text"
                                            value={lessonData.title}
                                            onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                                            placeholder="e.g., Introduction to Variables"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Content Upload/URL based on type */}
                                    {lessonData.type && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {lessonData.type === 'link' ? 'External URL' : 'Upload Content'}
                                            </label>
                                            {lessonData.type === 'link' ? (
                                                <div className="relative">
                                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="url"
                                                        value={lessonData.url}
                                                        onChange={(e) => setLessonData({ ...lessonData, url: e.target.value })}
                                                        placeholder="https://example.com/resource"
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 cursor-pointer transition-colors">
                                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {lessonData.type === 'video' && 'MP4, WebM up to 500MB'}
                                                        {lessonData.type === 'pdf' && 'PDF up to 50MB'}
                                                        {lessonData.type === 'audio' && 'MP3, WAV up to 100MB'}
                                                        {lessonData.type === 'image' && 'JPG, PNG, GIF up to 20MB'}
                                                        {lessonData.type === 'quiz' && 'Quiz will be created after adding lesson'}
                                                        {lessonData.type === 'code' && 'Exercise will be configured after adding'}
                                                        {lessonData.type === 'text' && 'Rich text editor will open after adding'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Duration */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration / Size</label>
                                        <input
                                            type="text"
                                            value={lessonData.duration}
                                            onChange={(e) => setLessonData({ ...lessonData, duration: e.target.value })}
                                            placeholder={lessonData.type === 'quiz' ? 'e.g., 10 questions' : lessonData.type === 'pdf' ? 'e.g., 5 pages' : 'e.g., 15:30'}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Preview Toggle */}
                                    <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-purple-300 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={lessonData.isPreview}
                                            onChange={(e) => setLessonData({ ...lessonData, isPreview: e.target.checked })}
                                            className="w-5 h-5 rounded text-purple-500 focus:ring-purple-400"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">Free Preview</p>
                                            <p className="text-sm text-gray-500">Allow non-enrolled students to view this lesson</p>
                                        </div>
                                    </label>

                                    {/* Submit */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleAddLesson}
                                        disabled={!lessonData.title.trim() || !lessonData.type}
                                        className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Check className="w-5 h-5" />
                                        Add Lesson
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Enroll Student Modal */}
            <EnrollStudentModal
                isOpen={isEnrollModalOpen}
                onClose={() => setIsEnrollModalOpen(false)}
                batchId={course.id}
                batchName={course.title}
                onSuccess={() => {
                    // Refresh enrolled students (would need real data integration)
                    // For now, just close modal
                }}
            />
        </div>
    );
}
