'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    X,
    Users,
    BookOpen,
    GraduationCap,
    Video,
    Clock,
    ArrowRight,
    Command
} from 'lucide-react';
import { UserAvatar } from './UserAvatar';

interface SearchResult {
    id: string;
    title: string;
    subtitle: string;
    type: 'student' | 'teacher' | 'course' | 'session';
    href: string;
    image?: string;
}

interface SearchBarProps {
    variant: 'admin' | 'teacher' | 'student';
    placeholder?: string;
}

// Mock search data
const mockData: SearchResult[] = [
    { id: '1', title: 'Omar Khaled', subtitle: 'Student • Secondary Level', type: 'student', href: '/admin/students/1', image: undefined },
    { id: '2', title: 'Fatma Nour', subtitle: 'Student • Preparatory Level', type: 'student', href: '/admin/students/2', image: undefined },
    { id: '3', title: 'Ahmed Hassan', subtitle: 'Teacher • Mathematics', type: 'teacher', href: '/admin/teachers/1', image: undefined },
    { id: '4', title: 'Sara Ali', subtitle: 'Teacher • Physics', type: 'teacher', href: '/admin/teachers/2', image: undefined },
    { id: '5', title: 'Advanced Mathematics', subtitle: 'Course • 45 lessons', type: 'course', href: '/admin/courses/1', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=100' },
    { id: '6', title: 'Physics Fundamentals', subtitle: 'Course • 32 lessons', type: 'course', href: '/admin/courses/2', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=100' },
    { id: '7', title: 'Algebra Live Session', subtitle: 'Session • Today 2:00 PM', type: 'session', href: '/admin/live-sessions/1' },
];

const typeIcons = {
    student: Users,
    teacher: GraduationCap,
    course: BookOpen,
    session: Video,
};

const typeColors = {
    student: 'emerald',
    teacher: 'blue',
    course: 'purple',
    session: 'red',
};

export default function SearchBar({ variant, placeholder }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [recentSearches] = useState(['Mathematics', 'Ahmed Hassan', 'Secondary students']);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Variant-specific colors
    const colors = {
        admin: { focus: 'focus:ring-emerald-400', accent: 'emerald' },
        teacher: { focus: 'focus:ring-blue-400', accent: 'blue' },
        student: { focus: 'focus:ring-emerald-400', accent: 'emerald' },
    };

    const currentColors = colors[variant];

    // Search function
    useEffect(() => {
        if (query.length > 0) {
            const filtered = mockData.filter(
                item =>
                    item.title.toLowerCase().includes(query.toLowerCase()) ||
                    item.subtitle.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard shortcut (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
                inputRef.current?.blur();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const defaultPlaceholder = {
        admin: 'Search students, teachers, courses...',
        teacher: 'Search students, courses...',
        student: 'Search courses, lessons...',
    };

    return (
        <div ref={containerRef} className="relative flex-1 max-w-xl">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder || defaultPlaceholder[variant]}
                    className={`w-full pl-12 pr-20 py-2.5 sm:py-3 rounded-full bg-gray-50 border-2 border-transparent text-gray-900 placeholder-gray-400 focus:outline-none ${currentColors.focus} focus:bg-white transition-all text-sm`}
                />
                {/* Keyboard shortcut hint */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-gray-400">
                    {query ? (
                        <button onClick={() => setQuery('')} className="p-1 hover:text-gray-600">
                            <X className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="flex items-center gap-0.5 text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                            <Command className="w-3 h-3" />
                            <span>K</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Search Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                        {query.length === 0 ? (
                            /* Recent Searches */
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Recent Searches</p>
                                    <button className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
                                </div>
                                <div className="space-y-1">
                                    {recentSearches.map((search, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setQuery(search)}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-left transition-colors"
                                        >
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">{search}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Quick Actions */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Quick Actions</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link href={variant === 'admin' ? '/admin/students' : `/${variant}/courses`}>
                                            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm text-gray-600 transition-colors w-full">
                                                <Users className="w-4 h-4" />
                                                {variant === 'admin' ? 'All Students' : 'My Courses'}
                                            </button>
                                        </Link>
                                        <Link href={variant === 'admin' ? '/admin/courses' : `/${variant}/sessions`}>
                                            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm text-gray-600 transition-colors w-full">
                                                <BookOpen className="w-4 h-4" />
                                                {variant === 'admin' ? 'All Courses' : 'Sessions'}
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : results.length > 0 ? (
                            /* Search Results */
                            <div className="max-h-80 overflow-y-auto">
                                <div className="p-2">
                                    {results.map((result) => {
                                        const Icon = typeIcons[result.type];
                                        const color = typeColors[result.type];
                                        return (
                                            <Link key={result.id} href={result.href} onClick={() => setIsOpen(false)}>
                                                <motion.div
                                                    whileHover={{ x: 4 }}
                                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                                                >
                                                    {result.image ? (
                                                        <UserAvatar
                                                            src={result.image}
                                                            name={result.title}
                                                            className="w-10 h-10 rounded-xl"
                                                        />
                                                    ) : (
                                                        <div className={`w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center`}>
                                                            <Icon className={`w-5 h-5 text-${color}-500`} />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 truncate">{result.title}</p>
                                                        <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                                </motion.div>
                                            </Link>
                                        );
                                    })}
                                </div>
                                <div className="p-3 border-t border-gray-100 bg-gray-50">
                                    <button className="w-full text-sm text-center text-gray-500 hover:text-gray-700">
                                        View all results for "{query}"
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* No Results */
                            <div className="p-8 text-center">
                                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No results found for "{query}"</p>
                                <p className="text-sm text-gray-400 mt-1">Try searching with different keywords</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
