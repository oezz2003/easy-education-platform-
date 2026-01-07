'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    GraduationCap,
    BookOpen,
    Video,
    DollarSign,
    Clock,
    Calendar,
    Download,
    Filter,
    RefreshCw,
    Activity,
    Eye,
    UserPlus,
    FileText,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronDown
} from 'lucide-react';

// KPI Data
const kpiData = [
    {
        id: 'total-students',
        title: 'Total Students',
        value: '2,547',
        change: '+12.5%',
        trend: 'up',
        icon: Users,
        color: 'emerald',
        description: 'vs last month',
    },
    {
        id: 'total-teachers',
        title: 'Total Teachers',
        value: '48',
        change: '+4.2%',
        trend: 'up',
        icon: GraduationCap,
        color: 'blue',
        description: 'vs last month',
    },
    {
        id: 'active-courses',
        title: 'Active Courses',
        value: '156',
        change: '+8.3%',
        trend: 'up',
        icon: BookOpen,
        color: 'purple',
        description: 'vs last month',
    },
    {
        id: 'live-sessions',
        title: 'Live Sessions',
        value: '342',
        change: '+15.7%',
        trend: 'up',
        icon: Video,
        color: 'red',
        description: 'this month',
    },
    {
        id: 'revenue',
        title: 'Total Revenue',
        value: '$124,850',
        change: '+22.4%',
        trend: 'up',
        icon: DollarSign,
        color: 'amber',
        description: 'vs last month',
    },
    {
        id: 'avg-completion',
        title: 'Avg. Completion',
        value: '67.8%',
        change: '-2.1%',
        trend: 'down',
        icon: CheckCircle,
        color: 'cyan',
        description: 'course completion rate',
    },
];

// Chart Data for visualization
const monthlyData = [
    { month: 'Jan', students: 1850, revenue: 45000, sessions: 120 },
    { month: 'Feb', students: 1920, revenue: 52000, sessions: 135 },
    { month: 'Mar', students: 2100, revenue: 58000, sessions: 148 },
    { month: 'Apr', students: 2250, revenue: 72000, sessions: 165 },
    { month: 'May', students: 2380, revenue: 89000, sessions: 198 },
    { month: 'Jun', students: 2547, revenue: 124850, sessions: 342 },
];

// Activity Log Data
const activityLog = [
    { id: 1, type: 'user_registered', user: 'Omar Khaled', action: 'New student registered', time: '2 min ago', icon: UserPlus, color: 'emerald' },
    { id: 2, type: 'course_completed', user: 'Fatma Nour', action: 'Completed "Advanced Mathematics"', time: '15 min ago', icon: CheckCircle, color: 'green' },
    { id: 3, type: 'session_started', user: 'Ahmed Hassan', action: 'Started live session "Algebra Class"', time: '32 min ago', icon: Video, color: 'red' },
    { id: 4, type: 'payment_received', user: 'Youssef Ibrahim', action: 'Payment received for "Physics Bundle"', time: '1 hour ago', icon: DollarSign, color: 'amber' },
    { id: 5, type: 'course_created', user: 'Sara Ali', action: 'Created new course "Chemistry Lab"', time: '2 hours ago', icon: BookOpen, color: 'purple' },
    { id: 6, type: 'user_registered', user: 'Laila Hassan', action: 'New student registered', time: '3 hours ago', icon: UserPlus, color: 'emerald' },
    { id: 7, type: 'assignment_submitted', user: 'Ali Mohamed', action: 'Submitted assignment in "Math 101"', time: '4 hours ago', icon: FileText, color: 'blue' },
    { id: 8, type: 'session_ended', user: 'Mohamed Farid', action: 'Ended live session with 45 attendees', time: '5 hours ago', icon: Video, color: 'gray' },
    { id: 9, type: 'course_updated', user: 'Admin', action: 'Updated course "English Grammar"', time: '6 hours ago', icon: BookOpen, color: 'purple' },
    { id: 10, type: 'report_generated', user: 'System', action: 'Weekly report generated', time: '8 hours ago', icon: BarChart3, color: 'cyan' },
];

// Top Courses
const topCourses = [
    { id: 1, title: 'Advanced Mathematics', students: 456, revenue: 22800, rating: 4.9 },
    { id: 2, title: 'Physics Fundamentals', students: 389, revenue: 19450, rating: 4.8 },
    { id: 3, title: 'English Grammar', students: 342, revenue: 17100, rating: 4.7 },
    { id: 4, title: 'Chemistry Lab', students: 287, revenue: 14350, rating: 4.6 },
    { id: 5, title: 'Arabic Literature', students: 234, revenue: 11700, rating: 4.5 },
];

// Top Teachers
const topTeachers = [
    { id: 1, name: 'Ahmed Hassan', avatar: 'https://i.pravatar.cc/150?img=11', students: 890, rating: 4.9, courses: 8 },
    { id: 2, name: 'Sara Ali', avatar: 'https://i.pravatar.cc/150?img=5', students: 756, rating: 4.8, courses: 6 },
    { id: 3, name: 'Mohamed Farid', avatar: 'https://i.pravatar.cc/150?img=12', students: 623, rating: 4.7, courses: 5 },
    { id: 4, name: 'Fatma Nour', avatar: 'https://i.pravatar.cc/150?img=9', students: 534, rating: 4.6, courses: 4 },
];

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState('this-month');
    const [activityFilter, setActivityFilter] = useState('all');

    const maxStudents = Math.max(...monthlyData.map(d => d.students));

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                        <BarChart3 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                        <p className="text-gray-500 text-sm">Platform performance overview</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Date Range Selector */}
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    >
                        <option value="today">Today</option>
                        <option value="this-week">This Week</option>
                        <option value="this-month">This Month</option>
                        <option value="this-year">This Year</option>
                    </select>

                    {/* Refresh Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <RefreshCw className="w-5 h-5 text-gray-600" />
                    </motion.button>

                    {/* Export Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl font-medium shadow-lg"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </motion.button>
                </div>
            </motion.div>

            {/* KPI Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            >
                {kpiData.map((kpi, index) => (
                    <motion.div
                        key={kpi.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl bg-${kpi.color}-100 flex items-center justify-center`}>
                                <kpi.icon className={`w-5 h-5 text-${kpi.color}-500`} />
                            </div>
                            <span className={`flex items-center gap-1 text-xs font-medium ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                                {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {kpi.change}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{kpi.title}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Students Growth Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-gray-900">Student Growth</h3>
                            <p className="text-sm text-gray-500">Monthly enrollment trend</p>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm font-medium">
                            <TrendingUp className="w-4 h-4" />
                            +37.7%
                        </div>
                    </div>

                    {/* Simple Bar Chart */}
                    <div className="flex items-end justify-between gap-2 h-48">
                        {monthlyData.map((data, index) => (
                            <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(data.students / maxStudents) * 100}%` }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                    className="w-full bg-gradient-to-t from-emerald-500 to-green-400 rounded-t-lg min-h-[20px]"
                                />
                                <span className="text-xs text-gray-500">{data.month}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-gray-900">Revenue Overview</h3>
                            <p className="text-sm text-gray-500">Monthly revenue trend</p>
                        </div>
                        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm font-medium">
                            <DollarSign className="w-4 h-4" />
                            $124.8K
                        </div>
                    </div>

                    {/* Simple Line Chart Representation */}
                    <div className="relative h-48">
                        <svg className="w-full h-full" viewBox="0 0 300 150">
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Area */}
                            <motion.path
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.3 }}
                                d="M0,120 L50,100 L100,85 L150,60 L200,30 L250,0 L250,150 L0,150 Z"
                                fill="url(#revenueGradient)"
                            />
                            {/* Line */}
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1, delay: 0.3 }}
                                d="M0,120 L50,100 L100,85 L150,60 L200,30 L250,0"
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                            {/* Data Points */}
                            {[
                                { x: 0, y: 120 },
                                { x: 50, y: 100 },
                                { x: 100, y: 85 },
                                { x: 150, y: 60 },
                                { x: 200, y: 30 },
                                { x: 250, y: 0 },
                            ].map((point, i) => (
                                <motion.circle
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    cx={point.x}
                                    cy={point.y}
                                    r="5"
                                    fill="#f59e0b"
                                />
                            ))}
                        </svg>
                        {/* Labels */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
                            {monthlyData.map(d => <span key={d.month}>{d.month}</span>)}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Top Courses */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Top Courses</h3>
                        <button className="text-sm text-purple-500 hover:text-purple-600">View All</button>
                    </div>
                    <div className="space-y-3">
                        {topCourses.map((course, index) => (
                            <div key={course.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-amber-100 text-amber-600' :
                                        index === 1 ? 'bg-gray-100 text-gray-600' :
                                            index === 2 ? 'bg-orange-100 text-orange-600' :
                                                'bg-gray-50 text-gray-500'
                                    }`}>
                                    {index + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate text-sm">{course.title}</p>
                                    <p className="text-xs text-gray-500">{course.students} students</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900 text-sm">${course.revenue.toLocaleString()}</p>
                                    <p className="text-xs text-amber-500">⭐ {course.rating}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Teachers */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Top Teachers</h3>
                        <button className="text-sm text-purple-500 hover:text-purple-600">View All</button>
                    </div>
                    <div className="space-y-3">
                        {topTeachers.map((teacher, index) => (
                            <div key={teacher.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="relative">
                                    <img src={teacher.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                                    {index < 3 && (
                                        <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${index === 0 ? 'bg-amber-400 text-white' :
                                                index === 1 ? 'bg-gray-300 text-gray-700' :
                                                    'bg-orange-400 text-white'
                                            }`}>
                                            {index + 1}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate text-sm">{teacher.name}</p>
                                    <p className="text-xs text-gray-500">{teacher.courses} courses • {teacher.students} students</p>
                                </div>
                                <div className="text-xs text-amber-500 font-medium">⭐ {teacher.rating}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Activity Log */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 lg:row-span-1"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Activity Log</h3>
                        <select
                            value={activityFilter}
                            onChange={(e) => setActivityFilter(e.target.value)}
                            className="text-xs px-2 py-1 rounded-lg border border-gray-200 bg-white"
                        >
                            <option value="all">All</option>
                            <option value="users">Users</option>
                            <option value="courses">Courses</option>
                            <option value="payments">Payments</option>
                        </select>
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {activityLog.map((activity) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <div className={`w-8 h-8 rounded-lg bg-${activity.color}-100 flex items-center justify-center flex-shrink-0`}>
                                    <activity.icon className={`w-4 h-4 text-${activity.color}-500`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900">{activity.action}</p>
                                    <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6 shadow-xl text-white"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Platform Performance</h3>
                        <p className="text-purple-100 text-sm">Overall platform health and engagement metrics</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold">98.5%</p>
                            <p className="text-purple-200 text-sm">Uptime</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold">4.8</p>
                            <p className="text-purple-200 text-sm">Avg Rating</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold">12.5k</p>
                            <p className="text-purple-200 text-sm">Daily Active</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold">2.3m</p>
                            <p className="text-purple-200 text-sm">Total Views</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
