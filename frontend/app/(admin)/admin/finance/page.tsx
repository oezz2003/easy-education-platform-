'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign,
    CreditCard,
    Users,
    TrendingUp,
    Download,
    Plus,
    Search,
    Filter,
    Calendar,
    ChevronDown,
    Check,
    X,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    Receipt,
    FileText,
    Eye,
    MoreVertical,
    RefreshCw,
    Building,
    User,
    Loader2
} from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { useSalaries } from '@/hooks/useSalaries';
import { useTeachers } from '@/hooks/useTeachers';
import { useStudents } from '@/hooks/useStudents';
import { useCourses } from '@/hooks/useCourses';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function FinancePage() {
    const [activeTab, setActiveTab] = useState<'transactions' | 'salaries'>('transactions');
    const [selectedMonth, setSelectedMonth] = useState(0); // January
    const [selectedYear, setSelectedYear] = useState(2026);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSalaryModal, setShowSalaryModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    // Hooks for real data
    const { transactions: rawTransactions, isLoading: transactionsLoading, error: transactionsError, getStats, refetch: refetchTransactions } = useTransactions({
        status: statusFilter !== 'all' ? statusFilter as any : undefined,
        search: searchQuery || undefined,
    });
    const { salaries: rawSalaries, isLoading: salariesLoading, refetch: refetchSalaries, generateSalary } = useSalaries();
    const { teachers: rawTeachers } = useTeachers();
    const { students } = useStudents();
    const { courses } = useCourses();
    const { createTransaction } = useTransactions();

    // Transform transactions to match UI
    const transactions = rawTransactions.map(t => ({
        id: t.id,
        student: (t as any).student?.profile?.full_name || 'Unknown',
        studentAvatar: (t as any).student?.profile?.avatar_url || `https://i.pravatar.cc/150?u=${t.student_id}`,
        course: (t as any).course?.name || 'Unknown Course',
        amount: t.amount,
        type: t.type,
        status: t.status,
        method: (t as any).payment_method || 'Cash',
        date: new Date(t.created_at).toISOString().split('T')[0],
        receipt: t.receipt_number,
    }));

    // Transform salaries data
    const salariesData = rawSalaries.map(s => {
        const teacher = rawTeachers.find(t => t.id === s.teacher_id);
        return {
            id: s.id,
            teacher: teacher?.profile?.full_name || 'Unknown',
            teacherAvatar: teacher?.profile?.avatar_url || `https://i.pravatar.cc/150?u=${s.teacher_id}`,
            subject: teacher?.subject || 'General',
            sessions: s.sessions_count || 0,
            sessionEarnings: s.session_earnings || 0,
            bonus: s.bonus || 0,
            deductions: s.deductions || 0,
            total: s.total_amount || 0,
            status: s.status,
            paidAt: s.paid_at,
        };
    });

    // Loading state
    if (transactionsLoading || salariesLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    // Error state
    if (transactionsError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="text-red-500 mb-4">{transactionsError}</p>
                <button
                    onClick={refetchTransactions}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Stats from hook
    const stats = getStats();
    const totalRevenue = stats.totalRevenue;
    const pendingPayments = stats.pendingAmount;
    const totalSalariesPaid = salariesData.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.total, 0);
    const pendingSalaries = salariesData.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.total, 0);

    // Filter transactions
    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.course.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Filter salaries
    const filteredSalaries = salariesData.filter(s => {
        const matchesSearch = s.teacher.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const toggleSelectItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (activeTab === 'salaries') {
            const pending = filteredSalaries.filter(s => s.status === 'pending');
            if (selectedItems.length === pending.length) {
                setSelectedItems([]);
            } else {
                setSelectedItems(pending.map(s => s.id));
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Finance Management</h1>
                    <p className="text-gray-500">Manage transactions, payments, and teacher salaries</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                    <button
                        onClick={() => activeTab === 'transactions' ? setShowPaymentModal(true) : setShowSalaryModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg"
                    >
                        <Plus className="w-4 h-4" />
                        {activeTab === 'transactions' ? 'Record Payment' : 'Generate Salaries'}
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-emerald-600" />
                        </div>
                        <span className="flex items-center text-sm text-emerald-600">
                            <ArrowUpRight className="w-4 h-4" /> +12%
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">EGP {totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                        <span className="text-sm text-amber-600 font-medium">
                            {transactions.filter(t => t.status === 'pending').length} pending
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">EGP {pendingPayments.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Pending Payments</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="flex items-center text-sm text-blue-600">
                            <Check className="w-4 h-4" /> Paid
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">EGP {totalSalariesPaid.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Salaries Paid</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-red-600" />
                        </div>
                        <span className="text-sm text-red-600 font-medium">
                            {salariesData.filter(s => s.status === 'pending').length} pending
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">EGP {pendingSalaries.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Pending Salaries</p>
                </motion.div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Tab Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 pt-4">
                    <div className="flex gap-1">
                        <button
                            onClick={() => { setActiveTab('transactions'); setSelectedItems([]); setStatusFilter('all'); }}
                            className={`px-4 py-3 text-sm font-medium rounded-t-xl transition-colors ${activeTab === 'transactions'
                                ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Receipt className="w-4 h-4" />
                                Transactions
                            </div>
                        </button>
                        <button
                            onClick={() => { setActiveTab('salaries'); setSelectedItems([]); setStatusFilter('all'); }}
                            className={`px-4 py-3 text-sm font-medium rounded-t-xl transition-colors ${activeTab === 'salaries'
                                ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Teacher Salaries
                            </div>
                        </button>
                    </div>

                    {/* Month/Year Selector for Salaries */}
                    {activeTab === 'salaries' && (
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400"
                            >
                                {months.map((month, idx) => (
                                    <option key={month} value={idx}>{month}</option>
                                ))}
                            </select>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400"
                            >
                                <option value={2026}>2026</option>
                                <option value={2025}>2025</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={activeTab === 'transactions' ? 'Search student or course...' : 'Search teacher...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent w-64"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            {activeTab === 'transactions' && <option value="refunded">Refunded</option>}
                            {activeTab === 'salaries' && <option value="paid">Paid</option>}
                        </select>
                    </div>

                    {/* Bulk Actions */}
                    {activeTab === 'salaries' && selectedItems.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            <span className="text-sm text-gray-600">{selectedItems.length} selected</span>
                            <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600">
                                Pay Selected
                            </button>
                            <button
                                onClick={() => setSelectedItems([])}
                                className="p-2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {/* Transactions Tab */}
                        {activeTab === 'transactions' && (
                            <motion.div
                                key="transactions"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-sm text-gray-500">
                                            <th className="pb-4 font-medium">Student</th>
                                            <th className="pb-4 font-medium">Course</th>
                                            <th className="pb-4 font-medium">Amount</th>
                                            <th className="pb-4 font-medium">Type</th>
                                            <th className="pb-4 font-medium">Method</th>
                                            <th className="pb-4 font-medium">Status</th>
                                            <th className="pb-4 font-medium">Date</th>
                                            <th className="pb-4 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredTransactions.map((transaction) => (
                                            <tr key={transaction.id} className="group hover:bg-gray-50">
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={transaction.studentAvatar} alt="" className="w-10 h-10 rounded-xl" />
                                                        <span className="font-medium text-gray-900">{transaction.student}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-gray-600">{transaction.course}</td>
                                                <td className="py-4">
                                                    <span className={`font-semibold ${transaction.type === 'refund' ? 'text-red-600' : 'text-gray-900'}`}>
                                                        {transaction.type === 'refund' ? '-' : ''}EGP {transaction.amount.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${transaction.type === 'payment' ? 'bg-emerald-100 text-emerald-700' :
                                                        transaction.type === 'refund' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {transaction.type === 'payment' ? <ArrowDownRight className="w-3 h-3 mr-1" /> : <ArrowUpRight className="w-3 h-3 mr-1" />}
                                                        {transaction.type}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-gray-600">{transaction.method}</td>
                                                <td className="py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${transaction.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                        transaction.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {transaction.status === 'completed' && <Check className="w-3 h-3 mr-1" />}
                                                        {transaction.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-gray-600">{transaction.date}</td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {transaction.status === 'pending' && (
                                                            <button className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200">
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        {transaction.receipt && (
                                                            <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                                                                <FileText className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}

                        {/* Salaries Tab */}
                        {activeTab === 'salaries' && (
                            <motion.div
                                key="salaries"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-sm text-gray-500">
                                            <th className="pb-4 font-medium">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.length === filteredSalaries.filter(s => s.status === 'pending').length && selectedItems.length > 0}
                                                    onChange={toggleSelectAll}
                                                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                            </th>
                                            <th className="pb-4 font-medium">Teacher</th>
                                            <th className="pb-4 font-medium">Sessions</th>
                                            <th className="pb-4 font-medium">Earnings</th>
                                            <th className="pb-4 font-medium">Bonus</th>
                                            <th className="pb-4 font-medium">Deductions</th>
                                            <th className="pb-4 font-medium">Total</th>
                                            <th className="pb-4 font-medium">Status</th>
                                            <th className="pb-4 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredSalaries.map((salary) => (
                                            <tr key={salary.id} className="group hover:bg-gray-50">
                                                <td className="py-4">
                                                    {salary.status === 'pending' && (
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedItems.includes(salary.id)}
                                                            onChange={() => toggleSelectItem(salary.id)}
                                                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                        />
                                                    )}
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={salary.teacherAvatar} alt="" className="w-10 h-10 rounded-xl" />
                                                        <div>
                                                            <p className="font-medium text-gray-900">{salary.teacher}</p>
                                                            <p className="text-sm text-gray-500">{salary.subject}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                                                        {salary.sessions} sessions
                                                    </span>
                                                </td>
                                                <td className="py-4 font-medium text-gray-900">EGP {salary.sessionEarnings.toLocaleString()}</td>
                                                <td className="py-4">
                                                    {salary.bonus > 0 ? (
                                                        <span className="text-emerald-600 font-medium">+EGP {salary.bonus}</span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="py-4">
                                                    {salary.deductions > 0 ? (
                                                        <span className="text-red-600 font-medium">-EGP {salary.deductions}</span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="py-4">
                                                    <span className="font-bold text-gray-900">EGP {salary.total.toLocaleString()}</span>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${salary.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {salary.status === 'paid' ? <Check className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                                                        {salary.status}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {salary.status === 'pending' && (
                                                            <button className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600">
                                                                Pay Now
                                                            </button>
                                                        )}
                                                        <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Record Payment Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowPaymentModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900">Record Payment</h2>
                                <p className="text-gray-500 text-sm">Add a new student payment transaction</p>
                            </div>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const studentId = formData.get('studentId') as string;
                                const courseId = formData.get('courseId') as string;
                                const amount = Number(formData.get('amount'));
                                const method = formData.get('method') as string;
                                const reference = formData.get('reference') as string;
                                const notes = formData.get('notes') as string;

                                if (!studentId || !courseId || !amount) return;

                                const { success, error } = await createTransaction({
                                    student_id: studentId,
                                    course_id: courseId,
                                    amount,
                                    type: 'payment',
                                    payment_method: method,
                                    reference_number: reference,
                                    notes,
                                    status: 'completed', // Direct payments are usually completed
                                    paid_at: new Date().toISOString()
                                });

                                if (success) {
                                    setShowPaymentModal(false);
                                } else {
                                    alert('Failed to record payment: ' + error);
                                }
                            }}>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                                        <select name="studentId" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400">
                                            <option value="">Select a student...</option>
                                            {students.map(student => (
                                                <option key={student.id} value={student.id}>
                                                    {student.profile.full_name} ({student.profile.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                                        <select name="courseId" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400">
                                            <option value="">Select a course...</option>
                                            {courses.map(course => (
                                                <option key={course.id} value={course.id}>
                                                    {course.name} ({course.level})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (EGP)</label>
                                            <input
                                                name="amount"
                                                type="number"
                                                required
                                                min="0"
                                                placeholder="0.00"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                            <select name="method" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400">
                                                <option value="Cash">Cash</option>
                                                <option value="Card">Card</option>
                                                <option value="Bank Transfer">Bank Transfer</option>
                                                <option value="Mobile Wallet">Mobile Wallet</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number (Optional)</label>
                                        <input
                                            name="reference"
                                            type="text"
                                            placeholder="e.g., Transaction ID"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                                        <textarea
                                            name="notes"
                                            rows={2}
                                            placeholder="Add any notes..."
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400"
                                        />
                                    </div>
                                </div>
                                <div className="p-6 bg-gray-50 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowPaymentModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-medium">
                                        Record Payment
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Generate Salaries Modal */}
            <AnimatePresence>
                {showSalaryModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowSalaryModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900">Generate Salaries</h2>
                                <p className="text-gray-500 text-sm">Auto-calculate salaries for {months[selectedMonth]} {selectedYear}</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="bg-blue-50 p-4 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <RefreshCw className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="font-medium text-blue-900">Calculation Method</p>
                                            <p className="text-sm text-blue-700">Sessions × Hourly Rate + Bonuses - Deductions</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Teachers</label>
                                    <div className="border border-gray-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2">
                                        {rawTeachers.map((teacher) => (
                                            <label key={teacher.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="w-4 h-4 rounded text-emerald-600"
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedItems(prev => [...prev, teacher.id]);
                                                        } else {
                                                            setSelectedItems(prev => prev.filter(id => id !== teacher.id));
                                                        }
                                                    }}
                                                />
                                                <img src={teacher.profile?.avatar_url || `https://i.pravatar.cc/150?u=${teacher.id}`} alt="" className="w-8 h-8 rounded-lg" />
                                                <span className="font-medium text-gray-900">{teacher.profile?.full_name || 'Unknown Teacher'}</span>
                                                <span className="text-sm text-gray-500">({teacher.subject})</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-gray-50 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setShowSalaryModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        const teachersToGenerate = selectedItems.length > 0
                                            ? selectedItems
                                            : rawTeachers.map(t => t.id);

                                        for (const teacherId of teachersToGenerate) {
                                            await generateSalary(teacherId, selectedMonth + 1, selectedYear);
                                        }
                                        setShowSalaryModal(false);
                                        setSelectedItems([]);
                                    }}
                                    className="px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-medium"
                                >
                                    Generate Salaries
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
