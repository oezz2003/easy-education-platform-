// ================================
// EASY EDUCATION - TypeScript Types
// ================================

export interface Level {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  icon: string;
  color: string;
  grades: string[];
}

export interface Subject {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  levelId: string;
}

export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  subjects: string[];
  levelIds: string[];
  rating: number;
  studentsCount: number;
  coursesCount: number;
  introVideoUrl?: string;
  yearsExperience: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  teacherId: string;
  subjectId: string;
  levelId: string;
  lessonsCount: number;
  duration: string;
  price: number;
  rating: number;
  enrolledCount: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  courseId: string;
  order: number;
  duration: string;
  videoUrl?: string;
  pdfUrl?: string;
  isPreview: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  gradeLevel?: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: 'pending' | 'active' | 'completed' | 'revoked';
  progress: number;
  enrolledAt: string;
  activatedAt?: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}
