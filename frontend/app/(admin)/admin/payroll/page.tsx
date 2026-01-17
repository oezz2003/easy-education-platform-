'use client';

import { useState } from 'react';
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
import { useInvoices } from '@/hooks/useInvoices';
import { UserAvatar } from '@/app/components/shared/UserAvatar';

// Activity breakdown for invoice creation (kept for UI)
const activityBreakdown = {
    sessions: [
        { id: 1, title: 'Algebra Live Class', date: '2026-01-03', duration: 90, rate: 50, total: 75 },
        { id: 2, title: 'Geometry Workshop', date: '2026-01-05', duration: 60, rate: 50, total: 50 },
        { id: 3, title: 'Calculus Basics', date: '2026-01-06', duration: 120, rate: 50, total: 100 },
    ],
    courses: [
        { id: 1, title: 'Advanced Mathematics', students: 45, ratePerStudent: 20, total: 900 },
        { id: 2, title: 'Algebra Fundamentals', students: 32, ratePerStudent: 15, total: 480 },
    ],
};

const statusColors = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
    paid: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Paid' },
    overdue: { bg: 'bg-red-100', text: 'text-red-700', label: 'Overdue' },
};

export default function PayrollPage() {
    const [view, setView] = useState<'teachers' | 'invoices'>('teachers');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [invoiceData, setInvoiceData] = useState({
        period: 'January 2026',
        includeSessions: true,
        includeCourses: true,
        customAmount: '',
        notes: '',
    });

    // Hooks for real data
    const { salaries: rawSalaries, isLoading: salariesLoading, error: salariesError, paySalary, refetch: refetchSalaries } = useSalaries();
    const { teachers: rawTeachers, isLoading: teachersLoading } = useTeachers();
    const { invoices: rawInvoices, isLoading: invoicesLoading, createInvoice, refetch: refetchInvoices } = useInvoices();

    // Transform teachers data for payroll view
    const teachersData = rawTeachers.map(t => {
        const teacherSalaries = rawSalaries.filter(s => s.teacher_id === t.id);
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
            courses: 0,
            lastPayment: teacherSalaries.find(s => s.paid_at)?.paid_at || null,
            status: pendingAmount > 0 ? 'pending' : 'paid',
        };
    });

    // Transform invoices data
    const invoicesData = rawInvoices.map(inv => ({
        id: inv.id,
        invoiceNumber: inv.invoice_number,
        teacherId: inv.teacher_id,
        teacherName: inv.teacher?.profile?.full_name || 'Unknown',
        amount: inv.total_amount,
        period: `${new Date(inv.period_start).toLocaleDateString()} - ${new Date(inv.period_end).toLocaleDateString()}`,
        status: inv.status,
        createdAt: inv.created_at.split('T')[0],
        paidAt: inv.paid_at,
        itemsCount: inv.items?.length || 0,
    }));

    // Loading state
    if (salariesLoading || teachersLoading || invoicesLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    // Error state
    if (salariesError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="text-red-500 mb-4">{salariesError}</p>
                <button
                    onClick={refetchSalaries}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Stats
    const totalPending = teachersData.reduce((acc, t) => acc + t.pendingAmount, 0);
    const totalPaid = teachersData.reduce((acc, t) => acc + t.paidAmount, 0);
    const totalTeachers = teachersData.length;
    const pendingInvoices = invoicesData.filter(i => i.status === 'pending').length;

    const openInvoiceModal = (teacher: typeof teachersData[0]) => {
        setSelectedTeacher(teacher);
        setIsModalOpen(true);
    };

    const calculateInvoiceTotal = () => {
        let total = 0;
        if (invoiceData.includeSessions) {
            total += activityBreakdown.sessions.reduce((acc, s) => acc + s.total, 0);
        }
        if (invoiceData.includeCourses) {
            total += activityBreakdown.courses.reduce((acc, c) => acc + c.total, 0);
        }
        if (invoiceData.customAmount) {
            total += parseFloat(invoiceData.customAmount);
        }
        return total;
    };

    const handleCreateInvoice = async () => {
        if (!selectedTeacher) return;

        const total = calculateInvoiceTotal();
        const items = [];

        if (invoiceData.includeSessions) {
            items.push(...activityBreakdown.sessions.map(s => ({
                item_type: 'session',
                description: s.title,
                quantity: 1,
                unit_price: s.total,
                total_price: s.total,
            })));
        }

        if (invoiceData.includeCourses) {
            items.push(...activityBreakdown.courses.map(c => ({
                item_type: 'course_revenue',
                description: c.title,
                quantity: c.students,
                unit_price: c.ratePerStudent,
                total_price: c.total,
            })));
        }

        if (invoiceData.customAmount) {
            items.push({
                item_type: 'custom',
                description: invoiceData.notes || 'Custom Adjustment',
                quantity: 1,
                unit_price: parseFloat(invoiceData.customAmount),
                total_price: parseFloat(invoiceData.customAmount),
            });
        }

        // Determine period dates based on selection (simplified for now)
        const year = parseInt(invoiceData.period.split(' ')[1]);
        const monthStr = invoiceData.period.split(' ')[0];
        const monthIndex = new Date(`${monthStr} 1, 2000`).getMonth();
        const periodStart = new Date(year, monthIndex, 1).toISOString();
        const periodEnd = new Date(year, monthIndex + 1, 0).toISOString();

        const result = await createInvoice({
            teacher_id: selectedTeacher.id,
            period_start: periodStart,
            period_end: periodEnd,
            total_amount: total,
            subtotal: total, // Assuming no tax for now
            notes: invoiceData.notes,
            items: items as any,
        });

        if (result.success) {
            setIsModalOpen(false);
            setSelectedTeacher(null);
            refetchInvoices();
        } else {
            alert('Failed to create invoice: ' + result.error);
        }
    };

    const handlePaySalary = async (id: string) => {
        await paySalary(id);
        refetchSalaries();
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                        <DollarSign className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Teacher Payroll</h1>
                        <p className="text-gray-500 text-sm">Manage payments and invoices</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </motion.button>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {[
                    { label: 'Total Pending', value: `$${totalPending.toLocaleString()}`, color: 'amber', icon: AlertCircle },
                    { label: 'Total Paid', value: `$${totalPaid.toLocaleString()}`, color: 'emerald', icon: CheckCircle },
                    { label: 'Teachers', value: totalTeachers, color: 'blue', icon: User },
                    { label: 'Pending Invoices', value: pendingInvoices, color: 'purple', icon: FileText },
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
            </motion.div>

            {/* View Toggle & Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div className="flex bg-gray-100 rounded-xl p-1">
                    {[
                        { id: 'teachers', label: 'By Teacher' },
                        { id: 'invoices', label: 'All Invoices' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setView(tab.id as typeof view)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${view === tab.id ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search teachers or invoices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent w-full sm:w-64"
                    />
                </div>
            </motion.div>

            {/* Content */}
            {view === 'teachers' ? (
                /* Teachers View */
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Teacher</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Sessions</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Courses</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Total Earnings</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Pending</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {teachersData.map((teacher) => (
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
                                            <div className="flex items-center gap-1">
                                                <Video className="w-4 h-4 text-red-500" />
                                                <span className="text-sm text-gray-700">{teacher.sessions}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="w-4 h-4 text-purple-500" />
                                                <span className="text-sm text-gray-700">{teacher.courses}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">${teacher.totalEarnings.toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className={`font-semibold ${teacher.pendingAmount > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                                                ${teacher.pendingAmount.toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[teacher.status as keyof typeof statusColors].bg} ${statusColors[teacher.status as keyof typeof statusColors].text}`}>
                                                {statusColors[teacher.status as keyof typeof statusColors].label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => openInvoiceModal(teacher)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Invoice
                                                </motion.button>
                                                <Link href={`/admin/teachers/${teacher.id}`}>
                                                    <button className="p-2 rounded-lg hover:bg-gray-100">
                                                        <Eye className="w-4 h-4 text-gray-500" />
                                                    </button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            ) : (
                /* Invoices View */
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Invoice #</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Teacher</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Period</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Items</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Amount</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {invoicesData.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-mono font-medium text-gray-900">{invoice.invoiceNumber}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{invoice.teacherName}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600">{invoice.period}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-700">{invoice.itemsCount} items</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">${invoice.amount.toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status as keyof typeof statusColors].bg} ${statusColors[invoice.status as keyof typeof statusColors].text}`}>
                                                {statusColors[invoice.status as keyof typeof statusColors].label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setSelectedInvoice(invoice)} className="p-2 rounded-lg hover:bg-gray-100 text-emerald-600">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {invoice.status === 'pending' && (
                                                    <button onClick={() => handlePaySalary(invoice.id)} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium">
                                                        Mark Paid
                                                    </button>
                                                )}
                                                <button className="p-2 rounded-lg hover:bg-gray-100">
                                                    <Printer className="w-4 h-4 text-gray-500" />
                                                </button>
                                                <button className="p-2 rounded-lg hover:bg-gray-100">
                                                    <Send className="w-4 h-4 text-gray-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Create Invoice Modal */}
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
                            {/* Content */}
                            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto">
                                <div className="p-6 space-y-6">
                                    {/* Period */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Billing Period</label>
                                        <select
                                            value={invoiceData.period}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, period: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white"
                                        >
                                            <option>January 2026</option>
                                            <option>December 2025</option>
                                            <option>November 2025</option>
                                        </select>
                                    </div>

                                    {/* Live Sessions */}
                                    <div>
                                        <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-emerald-200 cursor-pointer mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                                                    <Video className="w-5 h-5 text-red-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">Live Sessions</p>
                                                    <p className="text-sm text-gray-500">{activityBreakdown.sessions.length} sessions this period</p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={invoiceData.includeSessions}
                                                onChange={(e) => setInvoiceData({ ...invoiceData, includeSessions: e.target.checked })}
                                                className="w-5 h-5 rounded text-emerald-500 focus:ring-emerald-400"
                                            />
                                        </label>
                                        {invoiceData.includeSessions && (
                                            <div className="ml-4 space-y-2">
                                                {activityBreakdown.sessions.map((session) => (
                                                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{session.title}</p>
                                                            <p className="text-xs text-gray-500">{session.date} • {session.duration}min</p>
                                                        </div>
                                                        <p className="font-semibold text-gray-900">${session.total}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Courses */}
                                    <div>
                                        <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-emerald-200 cursor-pointer mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                                    <BookOpen className="w-5 h-5 text-purple-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">Course Revenue Share</p>
                                                    <p className="text-sm text-gray-500">{activityBreakdown.courses.length} courses this period</p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={invoiceData.includeCourses}
                                                onChange={(e) => setInvoiceData({ ...invoiceData, includeCourses: e.target.checked })}
                                                className="w-5 h-5 rounded text-emerald-500 focus:ring-emerald-400"
                                            />
                                        </label>
                                        {invoiceData.includeCourses && (
                                            <div className="ml-4 space-y-2">
                                                {activityBreakdown.courses.map((course) => (
                                                    <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{course.title}</p>
                                                            <p className="text-xs text-gray-500">{course.students} students × ${course.ratePerStudent}</p>
                                                        </div>
                                                        <p className="font-semibold text-gray-900">${course.total}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Custom Amount */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Adjustment (Optional)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="number"
                                                value={invoiceData.customAmount}
                                                onChange={(e) => setInvoiceData({ ...invoiceData, customAmount: e.target.value })}
                                                placeholder="0.00"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                        <textarea
                                            value={invoiceData.notes}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                                            placeholder="Add any notes for this invoice..."
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-none"
                                        />
                                    </div>

                                    {/* Total */}
                                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                                        <p className="font-semibold text-emerald-700">Invoice Total</p>
                                        <p className="text-2xl font-bold text-emerald-600">${calculateInvoiceTotal().toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCreateInvoice}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl font-medium shadow-lg"
                                    >
                                        <FileText className="w-5 h-5" />
                                        Create Invoice
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Invoice Details Modal */}
            <AnimatePresence>
                {
                    selectedInvoice && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedInvoice(null)}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                            >
                                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto">
                                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Invoice Details</h2>
                                            <p className="text-sm text-gray-500">#{selectedInvoice.invoiceNumber}</p>
                                        </div>
                                        <button onClick={() => setSelectedInvoice(null)} className="p-2 rounded-xl hover:bg-gray-100">
                                            <X className="w-5 h-5 text-gray-500" />
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <p className="text-sm text-gray-500">Teacher</p>
                                                <p className="font-medium text-gray-900">{selectedInvoice.teacherName}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Period</p>
                                                <p className="font-medium text-gray-900">{selectedInvoice.period}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-3">Items</h3>
                                            <div className="space-y-2">
                                                {rawInvoices.find(i => i.id === selectedInvoice.id)?.items?.map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl text-sm">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{item.description}</p>
                                                            <p className="text-xs text-gray-500">{item.item_type} • x{item.quantity}</p>
                                                        </div>
                                                        <p className="font-medium text-gray-900">${item.total_price?.toLocaleString()}</p>
                                                    </div>
                                                ))}
                                                {(!rawInvoices.find(i => i.id === selectedInvoice.id)?.items?.length) && (
                                                    <p className="text-sm text-gray-500 italic">No items found.</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                                            <p className="font-semibold text-emerald-700">Total Amount</p>
                                            <p className="text-2xl font-bold text-emerald-600">${selectedInvoice.amount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="p-6 border-t border-gray-100 flex justify-end">
                                        <button onClick={() => setSelectedInvoice(null)} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )
                }
            </AnimatePresence >
        </div >
    );
}
