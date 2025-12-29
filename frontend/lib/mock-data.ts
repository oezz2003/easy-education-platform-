import { Level, Subject, Teacher, Course, Feature } from './types';

// ================================
// Educational Levels
// ================================
export const levels: Level[] = [
    {
        id: 'primary',
        name: 'Primary',
        nameAr: 'المرحلة الابتدائية',
        description: 'Foundation courses for grades 1-6, building essential skills in core subjects.',
        icon: '🎨',
        color: '#10B981',
        grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
    },
    {
        id: 'preparatory',
        name: 'Preparatory',
        nameAr: 'المرحلة الإعدادية',
        description: 'Intermediate courses for grades 7-9, advancing knowledge and critical thinking.',
        icon: '📚',
        color: '#3B82F6',
        grades: ['Grade 7', 'Grade 8', 'Grade 9'],
    },
    {
        id: 'secondary',
        name: 'Secondary',
        nameAr: 'المرحلة الثانوية',
        description: 'Advanced courses for grades 10-12, preparing students for university success.',
        icon: '🎓',
        color: '#8B5CF6',
        grades: ['Grade 10', 'Grade 11', 'Grade 12'],
    },
];

// ================================
// Subjects
// ================================
export const subjects: Subject[] = [
    { id: 'math', name: 'Mathematics', nameAr: 'الرياضيات', icon: '📐', levelId: 'all' },
    { id: 'science', name: 'Science', nameAr: 'العلوم', icon: '🔬', levelId: 'all' },
    { id: 'english', name: 'English', nameAr: 'اللغة الإنجليزية', icon: '📖', levelId: 'all' },
    { id: 'arabic', name: 'Arabic', nameAr: 'اللغة العربية', icon: '✍️', levelId: 'all' },
    { id: 'physics', name: 'Physics', nameAr: 'الفيزياء', icon: '⚛️', levelId: 'secondary' },
    { id: 'chemistry', name: 'Chemistry', nameAr: 'الكيمياء', icon: '🧪', levelId: 'secondary' },
    { id: 'biology', name: 'Biology', nameAr: 'الأحياء', icon: '🧬', levelId: 'secondary' },
    { id: 'history', name: 'History', nameAr: 'التاريخ', icon: '🏛️', levelId: 'all' },
];

// ================================
// Featured Teachers
// ================================
export const teachers: Teacher[] = [
    {
        id: 'teacher-1',
        name: 'Dr. Ahmed Hassan',
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face',
        bio: 'Ph.D. in Mathematics with 15+ years of teaching experience. Passionate about making complex concepts simple and engaging for students.',
        subjects: ['Mathematics', 'Physics'],
        levelIds: ['secondary', 'preparatory'],
        rating: 4.9,
        studentsCount: 2500,
        coursesCount: 12,
        yearsExperience: 15,
        introVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
        id: 'teacher-2',
        name: 'Ms. Sarah Mohamed',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
        bio: 'English language specialist with Cambridge certification. Focused on building confidence and fluency in students.',
        subjects: ['English'],
        levelIds: ['primary', 'preparatory', 'secondary'],
        rating: 4.8,
        studentsCount: 1800,
        coursesCount: 8,
        yearsExperience: 10,
    },
    {
        id: 'teacher-3',
        name: 'Prof. Omar Khaled',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        bio: 'Science educator with a mission to inspire curiosity. Specializes in hands-on experiments and visual learning.',
        subjects: ['Science', 'Chemistry', 'Biology'],
        levelIds: ['preparatory', 'secondary'],
        rating: 4.7,
        studentsCount: 2100,
        coursesCount: 15,
        yearsExperience: 12,
    },
    {
        id: 'teacher-4',
        name: 'Mrs. Fatima Ali',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
        bio: 'Arabic language expert dedicated to preserving and teaching the beauty of the Arabic language to all ages.',
        subjects: ['Arabic'],
        levelIds: ['primary', 'preparatory'],
        rating: 4.9,
        studentsCount: 1500,
        coursesCount: 6,
        yearsExperience: 18,
    },
];

// ================================
// Sample Courses
// ================================
export const courses: Course[] = [
    {
        id: 'course-1',
        title: 'Advanced Mathematics - Grade 12',
        description: 'Complete curriculum covering calculus, algebra, and geometry for final year students.',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop',
        teacherId: 'teacher-1',
        subjectId: 'math',
        levelId: 'secondary',
        lessonsCount: 45,
        duration: '32 hours',
        price: 299,
        rating: 4.9,
        enrolledCount: 850,
    },
    {
        id: 'course-2',
        title: 'English Fluency Masterclass',
        description: 'Build confidence in speaking, writing, and comprehension with interactive lessons.',
        thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
        teacherId: 'teacher-2',
        subjectId: 'english',
        levelId: 'preparatory',
        lessonsCount: 30,
        duration: '24 hours',
        price: 199,
        rating: 4.8,
        enrolledCount: 620,
    },
    {
        id: 'course-3',
        title: 'Chemistry Fundamentals',
        description: 'Explore the fascinating world of chemistry with visual experiments and clear explanations.',
        thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop',
        teacherId: 'teacher-3',
        subjectId: 'chemistry',
        levelId: 'secondary',
        lessonsCount: 38,
        duration: '28 hours',
        price: 249,
        rating: 4.7,
        enrolledCount: 430,
    },
    {
        id: 'course-4',
        title: 'Arabic Literature & Grammar',
        description: 'Master Arabic grammar and appreciate classical literature with engaging lessons.',
        thumbnail: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&h=400&fit=crop',
        teacherId: 'teacher-4',
        subjectId: 'arabic',
        levelId: 'preparatory',
        lessonsCount: 25,
        duration: '20 hours',
        price: 179,
        rating: 4.9,
        enrolledCount: 380,
    },
];

// ================================
// Platform Features
// ================================
export const features: Feature[] = [
    {
        icon: 'GraduationCap',
        title: 'Expert Teachers',
        description: 'Learn from certified educators with years of experience in their subjects.',
    },
    {
        icon: 'Video',
        title: 'HD Video Lessons',
        description: 'Crystal clear video lessons you can watch anytime, anywhere on any device.',
    },
    {
        icon: 'FileText',
        title: 'PDF Resources',
        description: 'Download comprehensive summaries and study materials for offline review.',
    },
    {
        icon: 'BarChart3',
        title: 'Progress Tracking',
        description: 'Visual progress bars and achievements to keep you motivated.',
    },
    {
        icon: 'Clock',
        title: 'Learn at Your Pace',
        description: 'Resume exactly where you left off with automatic progress saving.',
    },
    {
        icon: 'Shield',
        title: 'Secure Platform',
        description: 'Your data and learning progress are protected with enterprise-grade security.',
    },
];
