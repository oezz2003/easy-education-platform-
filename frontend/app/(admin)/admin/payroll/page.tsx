'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    DollarSign,
    Plus,
    Search,
    Filter,
    Download,
    Eye,
    FileText,
    Calendar,
    Clock,
    Video,
    BookOpen,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronDown,
    X,
    Printer,
    Send,
    User,
    Loader2
} from 'lucide-react';
import { useSalaries } from '@/hooks/useSalaries';
import { useTeachers } from '@/hooks/useTeachers';
import { useTeacherStats } from '@/hooks/useTeacherStats';
import { UserAvatar } from '@/app/components/shared/UserAvatar';

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
    paid: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Paid' },
    overdue: { bg: 'bg-red-100', text: 'text-red-700', label: 'Overdue' },
    on_hold: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'On Hold' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-500', label: 'Cancelled' },
};

export default function PayrollPage() {
    const [view, setView] = useState<'teachers' | 'history'>('teachers');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const [selectedSalary, setSelectedSalary] = useState<any>(null);

    // Salary Creation State
    const [salaryMode, setSalaryMode] = useState<'automatic' | 'manual'>('automatic');
    const [salaryData, setSalaryData] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        includeSessions: true,
        includeCourses: true,
        customAmount: '',
        baseSalary: '',
        notes: '',
    });

    // Hooks
    const { salaries, isLoading: salariesLoading, error: salariesError, paySalary, refetch: refetchSalaries } = useSalaries();
    const { teachers, isLoading: teachersLoading } = useTeachers();
    const { stats: teacherStats, isLoading: statsLoading, fetchStats } = useTeacherStats();

    // Fetch stats when modal opens or period changes
    useEffect(() => {
        if (isModalOpen && selectedTeacher) {
            fetchStats(selectedTeacher.id, salaryData.month, salaryData.year);
        }
    }, [isModalOpen, selectedTeacher, salaryData.month, salaryData.year, fetchStats]);

    // Transform teachers data
    const teachersList = teachers.map(t => {
        const teacherSalaries = salaries.filter(s => s.teacher_id === t.id);
        const pendingAmount = teacherSalaries.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.total_amount, 0);
        const paidAmount = teacherSalaries.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.total_amount, 0);

        return {
            id: t.id,
            name: t.profile?.full_name || 'Unknown',
            avatar: t.profile?.avatar_url,
            subject: t.subject || 'General',
            totalEarnings: pendingAmount + paidAmount,
            pendingAmount,
            paidAmount,
            sessions: teacherSalaries.reduce((sum, s) => sum + s.sessions_count, 0),
            lastPayment: teacherSalaries.find(s => s.paid_at)?.paid_at || null,
            status: pendingAmount > 0 ? 'pending' : 'paid',
        };
    }).filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate Totals for Modal
    const calculateTotal = () => {
        let total = 0;
        if (salaryMode === 'automatic' && teacherStats) {
            if (salaryData.includeSessions) total += teacherStats.sessions.total;
            if (salaryData.includeCourses) total += teacherStats.courses.total;
        } else if (salaryMode === 'manual' && salaryData.baseSalary) {
            total += parseFloat(salaryData.baseSalary);
        }
        if (salaryData.customAmount) total += parseFloat(salaryData.customAmount);
        return total;
    };

    const handleCreateSalary = async () => {
        if (!selectedTeacher) return;

        const total = calculateTotal();
        const items = [];

        if (salaryMode === 'automatic' && teacherStats) {
            if (salaryData.includeSessions) {
                items.push(...teacherStats.sessions.items.map((i: any) => ({
                    description: `Session: ${i.title}`,
                    type: 'session',
                    amount: i.amount,
                    session_id: i.id
                })));
            }
            if (salaryData.includeCourses) {
                items.push(...teacherStats.courses.items.map((i: any) => ({
                    description: `Course Revenue: ${i.title}`,
                    type: 'course_revenue',
                    amount: i.amount,
                })));
            }
        } else if (salaryMode === 'manual' && salaryData.baseSalary) {
            items.push({
                description: 'Base Salary (Manual Entry)',
                type: 'base',
                amount: parseFloat(salaryData.baseSalary),
            });
        }

        if (salaryData.customAmount) {
            items.push({
                description: salaryData.notes || 'Manual Adjustment',
                type: 'bonus',
                amount: parseFloat(salaryData.customAmount),
            });
        }

        try {
            const response = await fetch('/api/admin/finance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create_salary',
                    teacher_id: selectedTeacher.id,
                    month: salaryData.month,
                    year: salaryData.year,
                    session_earnings: salaryMode === 'automatic' ? (teacherStats?.sessions.total || 0) : 0,
                    sessions_count: salaryMode === 'automatic' ? (teacherStats?.sessions.count || 0) : 0,
                    base_salary: salaryMode === 'manual' ? parseFloat(salaryData.baseSalary) || 0 : 0,
                    total_amount: total,
                    items,
                    notes: salaryData.notes
                }),
            });

            if (!response.ok) throw new Error('Failed to create salary');

            setIsModalOpen(false);
            setSelectedTeacher(null);
            setSalaryMode('automatic');
            setSalaryData({
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                includeSessions: true,
                includeCourses: true,
                customAmount: '',
                baseSalary: '',
                notes: '',
            });
            refetchSalaries();
        } catch (err) {
            console.error(err);
            alert('Failed to create salary record');
        }
    };

    const handlePaySalary = async (id: string) => {
        if (confirm('Are you sure you want to mark this salary as PAID?')) {
            await paySalary(id, 'Bank Transfer', 'Manual');
        }
    };

    if (salariesLoading || teachersLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                        <DollarSign className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Teacher Payroll</h1>
                        <p className="text-gray-500 text-sm">Manage salaries and payments</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Pending', value: `$${teachersList.reduce((acc, t) => acc + t.pendingAmount, 0).toLocaleString()}`, color: 'amber', icon: AlertCircle },
                    { label: 'Total Paid', value: `$${teachersList.reduce((acc, t) => acc + t.paidAmount, 0).toLocaleString()}`, color: 'emerald', icon: CheckCircle },
                    { label: 'Teachers', value: teachersList.length, color: 'blue', icon: User },
                    { label: 'Pending Records', value: salaries.filter(s => s.status === 'pending').length, color: 'purple', icon: FileText },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                        onClick={() => setView('teachers')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${view === 'teachers' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
                    >
                        By Teacher
                    </button>
                    <button
                        onClick={() => setView('history')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${view === 'history' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
                    >
                        Payment History
                    </button>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 w-full sm:w-64"
                    />
                </div>
            </div>

            {/* Teachers View */}
            {view === 'teachers' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Teacher</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Pending</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Paid (Total)</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {teachersList.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar src={teacher.avatar} name={teacher.name} className="w-10 h-10 rounded-xl" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{teacher.name}</p>
                                                    <p className="text-xs text-gray-500">{teacher.subject}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className={`font-semibold ${teacher.pendingAmount > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                                                ${teacher.pendingAmount.toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">${teacher.paidAmount.toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[teacher.status as keyof typeof statusColors].bg} ${statusColors[teacher.status as keyof typeof statusColors].text}`}>
                                                {statusColors[teacher.status as keyof typeof statusColors].label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedTeacher(teacher);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Create Salary
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* History View */}
            {view === 'history' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Teacher</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Period</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Amount</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {salaries.map((salary) => (
                                    <tr key={salary.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(salary.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{salary.teacher?.profile?.full_name}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {salary.month}/{salary.year}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            ${salary.total_amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[salary.status].bg} ${statusColors[salary.status].text}`}>
                                                {statusColors[salary.status].label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {salary.status === 'pending' && (
                                                <button
                                                    onClick={() => handlePaySalary(salary.id)}
                                                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                                                >
                                                    Mark Paid
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Salary Modal */}
            <AnimatePresence>
                {isModalOpen && selectedTeacher && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto">
                                <div className="p-6 space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900">Create Salary Record</h2>

                                    {/* Period Selection */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                                            <select
                                                value={salaryData.month}
                                                onChange={(e) => setSalaryData({ ...salaryData, month: parseInt(e.target.value) })}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200"
                                            >
                                                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                                    <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                                            <select
                                                value={salaryData.year}
                                                onChange={(e) => setSalaryData({ ...salaryData, year: parseInt(e.target.value) })}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200"
                                            >
                                                <option value={2025}>2025</option>
                                                <option value={2026}>2026</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Mode Toggle */}
                                    <div className="flex bg-gray-100 rounded-xl p-1">
                                        <button
                                            onClick={() => setSalaryMode('automatic')}
                                            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${salaryMode === 'automatic' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
                                        >
                                            Automatic
                                        </button>
                                        <button
                                            onClick={() => setSalaryMode('manual')}
                                            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${salaryMode === 'manual' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
                                        >
                                            Manual
                                        </button>
                                    </div>

                                    {/* Automatic Calculation */}
                                    {salaryMode === 'automatic' && (
                                        <>
                                            {statsLoading ? (
                                                <div className="flex justify-center py-4"><Loader2 className="animate-spin text-emerald-500" /></div>
                                            ) : teacherStats ? (
                                                <div className="space-y-4">
                                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={salaryData.includeSessions}
                                                                    onChange={(e) => setSalaryData({ ...salaryData, includeSessions: e.target.checked })}
                                                                    className="rounded text-emerald-500 focus:ring-emerald-500"
                                                                />
                                                                <span className="font-medium text-gray-900">Live Sessions ({teacherStats.sessions.count})</span>
                                                            </div>
                                                            <span className="font-semibold text-gray-900">${teacherStats.sessions.total.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={salaryData.includeCourses}
                                                                    onChange={(e) => setSalaryData({ ...salaryData, includeCourses: e.target.checked })}
                                                                    className="rounded text-emerald-500 focus:ring-emerald-500"
                                                                />
                                                                <span className="font-medium text-gray-900">Course Revenue ({teacherStats.courses.count})</span>
                                                            </div>
                                                            <span className="font-semibold text-gray-900">${teacherStats.courses.total.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-center text-gray-500">No activity found for this period.</p>
                                            )}
                                        </>
                                    )}

                                    {/* Manual Mode - Base Salary */}
                                    {salaryMode === 'manual' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Base Salary Amount</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="number"
                                                    value={salaryData.baseSalary}
                                                    onChange={(e) => setSalaryData({ ...salaryData, baseSalary: e.target.value })}
                                                    placeholder="Enter fixed salary amount"
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Manual Entry */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Manual Adjustment / Bonus</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="number"
                                                value={salaryData.customAmount}
                                                onChange={(e) => setSalaryData({ ...salaryData, customAmount: e.target.value })}
                                                placeholder="0.00"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                        <textarea
                                            value={salaryData.notes}
                                            onChange={(e) => setSalaryData({ ...salaryData, notes: e.target.value })}
                                            placeholder="Add notes..."
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 resize-none"
                                        />
                                    </div>

                                    {/* Total */}
                                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                                        <p className="font-semibold text-emerald-700">Total Payable</p>
                                        <p className="text-2xl font-bold text-emerald-600">${calculateTotal().toLocaleString()}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleCreateSalary}
                                            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium shadow-lg"
                                        >
                                            Create Record
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
