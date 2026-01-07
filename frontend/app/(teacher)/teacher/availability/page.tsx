'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    Plus,
    Trash2,
    Check,
    X,
    ChevronLeft,
    ChevronRight,
    Save,
    Copy,
    Settings,
    Users,
    Video,
    DollarSign,
    AlertCircle
} from 'lucide-react';

// Types
interface TimeSlot {
    id: string;
    day: number; // 0-6 (Sunday-Saturday)
    startTime: string;
    endTime: string;
    type: 'available' | 'booked' | 'blocked';
    recurring: boolean;
}

interface BlockedDate {
    id: string;
    date: Date;
    reason: string;
}

interface SessionType {
    id: string;
    name: string;
    duration: number;
    price: number;
    maxStudents: number;
    color: string;
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeOptions = Array.from({ length: 28 }, (_, i) => {
    const hour = Math.floor(i / 2) + 7;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

// Initial data
const initialSlots: TimeSlot[] = [
    { id: '1', day: 1, startTime: '09:00', endTime: '12:00', type: 'available', recurring: true },
    { id: '2', day: 1, startTime: '14:00', endTime: '17:00', type: 'available', recurring: true },
    { id: '3', day: 3, startTime: '10:00', endTime: '13:00', type: 'available', recurring: true },
    { id: '4', day: 3, startTime: '15:00', endTime: '18:00', type: 'available', recurring: true },
    { id: '5', day: 5, startTime: '09:00', endTime: '11:00', type: 'available', recurring: true },
];

const initialSessionTypes: SessionType[] = [
    { id: '1', name: '1-on-1 Tutoring', duration: 60, price: 50, maxStudents: 1, color: '#10b981' },
    { id: '2', name: 'Group Session', duration: 90, price: 30, maxStudents: 10, color: '#3b82f6' },
    { id: '3', name: 'Quick Consultation', duration: 30, price: 25, maxStudents: 1, color: '#8b5cf6' },
];

export default function TeacherAvailabilityPage() {
    const [slots, setSlots] = useState<TimeSlot[]>(initialSlots);
    const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
    const [sessionTypes, setSessionTypes] = useState<SessionType[]>(initialSessionTypes);
    const [currentWeek, setCurrentWeek] = useState(new Date(2026, 0, 5)); // Start of week
    const [activeTab, setActiveTab] = useState<'weekly' | 'blocked' | 'types'>('weekly');
    const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // New slot form
    const [newSlot, setNewSlot] = useState({
        day: 1,
        startTime: '09:00',
        endTime: '10:00',
        recurring: true,
    });

    // New blocked date form
    const [newBlockedDate, setNewBlockedDate] = useState({
        date: '',
        reason: '',
    });

    // Get week days
    const getWeekDays = () => {
        const start = new Date(currentWeek);
        start.setDate(start.getDate() - start.getDay());
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            return day;
        });
    };

    const weekDays = getWeekDays();

    const navigateWeek = (direction: number) => {
        const newDate = new Date(currentWeek);
        newDate.setDate(currentWeek.getDate() + direction * 7);
        setCurrentWeek(newDate);
    };

    const addSlot = () => {
        const slot: TimeSlot = {
            id: Date.now().toString(),
            day: newSlot.day,
            startTime: newSlot.startTime,
            endTime: newSlot.endTime,
            type: 'available',
            recurring: newSlot.recurring,
        };
        setSlots([...slots, slot]);
        setIsAddSlotOpen(false);
        setNewSlot({ day: 1, startTime: '09:00', endTime: '10:00', recurring: true });
    };

    const removeSlot = (id: string) => {
        setSlots(slots.filter(s => s.id !== id));
    };

    const addBlockedDate = () => {
        if (!newBlockedDate.date) return;
        const blocked: BlockedDate = {
            id: Date.now().toString(),
            date: new Date(newBlockedDate.date),
            reason: newBlockedDate.reason,
        };
        setBlockedDates([...blockedDates, blocked]);
        setNewBlockedDate({ date: '', reason: '' });
    };

    const removeBlockedDate = (id: string) => {
        setBlockedDates(blockedDates.filter(b => b.id !== id));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const getSlotsForDay = (dayIndex: number) => {
        return slots.filter(s => s.day === dayIndex);
    };

    // Calculate total available hours
    const totalHours = slots.reduce((acc, slot) => {
        const start = parseInt(slot.startTime.split(':')[0]) + parseInt(slot.startTime.split(':')[1]) / 60;
        const end = parseInt(slot.endTime.split(':')[0]) + parseInt(slot.endTime.split(':')[1]) / 60;
        return acc + (end - start);
    }, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Availability</h1>
                        <p className="text-gray-500 text-sm">Set your available time slots for bookings</p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium shadow-lg disabled:opacity-50"
                >
                    {saved ? (
                        <>
                            <Check className="w-5 h-5" />
                            Saved!
                        </>
                    ) : isSaving ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Changes
                        </>
                    )}
                </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {[
                    { label: 'Weekly Hours', value: `${totalHours.toFixed(1)}h`, color: 'blue', icon: Clock },
                    { label: 'Available Slots', value: slots.length, color: 'emerald', icon: Calendar },
                    { label: 'Session Types', value: sessionTypes.length, color: 'purple', icon: Video },
                    { label: 'Blocked Dates', value: blockedDates.length, color: 'red', icon: AlertCircle },
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

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex bg-gray-100 rounded-xl p-1 w-fit"
            >
                {[
                    { id: 'weekly', label: 'Weekly Schedule', icon: Calendar },
                    { id: 'blocked', label: 'Blocked Dates', icon: X },
                    { id: 'types', label: 'Session Types', icon: Settings },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === tab.id ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </motion.div>

            {/* Content */}
            {activeTab === 'weekly' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                    {/* Week Navigation */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigateWeek(-1)} className="p-2 rounded-xl hover:bg-gray-100">
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h3 className="font-semibold text-gray-900">
                                {weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                            <button onClick={() => navigateWeek(1)} className="p-2 rounded-xl hover:bg-gray-100">
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsAddSlotOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Slot
                        </motion.button>
                    </div>

                    {/* Week Grid */}
                    <div className="grid grid-cols-7 divide-x divide-gray-100">
                        {daysOfWeek.map((day, idx) => (
                            <div key={day} className="min-h-[300px]">
                                <div className={`p-3 text-center border-b border-gray-100 ${idx === 0 || idx === 6 ? 'bg-gray-50' : ''}`}>
                                    <p className="text-xs text-gray-500">{day.substring(0, 3)}</p>
                                    <p className="font-bold text-gray-900">{weekDays[idx].getDate()}</p>
                                </div>
                                <div className="p-2 space-y-2">
                                    {getSlotsForDay(idx).map((slot) => (
                                        <motion.div
                                            key={slot.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="relative group"
                                        >
                                            <div className={`p-2 rounded-lg text-xs ${slot.type === 'available' ? 'bg-emerald-100 text-emerald-700' :
                                                    slot.type === 'booked' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                <p className="font-medium">{slot.startTime}</p>
                                                <p className="opacity-70">{slot.endTime}</p>
                                                {slot.recurring && (
                                                    <span className="text-[10px] opacity-60">Weekly</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => removeSlot(slot.id)}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </motion.div>
                                    ))}
                                    {getSlotsForDay(idx).length === 0 && (
                                        <p className="text-xs text-gray-400 text-center py-4">No slots</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {activeTab === 'blocked' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                    <h3 className="font-bold text-gray-900 mb-4">Block Specific Dates</h3>
                    <p className="text-sm text-gray-500 mb-6">Block dates when you're unavailable (vacations, holidays, etc.)</p>

                    {/* Add blocked date form */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                            <input
                                type="date"
                                value={newBlockedDate.date}
                                onChange={(e) => setNewBlockedDate({ ...newBlockedDate, date: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reason (optional)</label>
                            <input
                                type="text"
                                value={newBlockedDate.reason}
                                onChange={(e) => setNewBlockedDate({ ...newBlockedDate, reason: e.target.value })}
                                placeholder="e.g. Vacation, Holiday"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-end">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={addBlockedDate}
                                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium"
                            >
                                Block Date
                            </motion.button>
                        </div>
                    </div>

                    {/* Blocked dates list */}
                    <div className="space-y-2">
                        {blockedDates.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No blocked dates</p>
                        ) : (
                            blockedDates.map((blocked) => (
                                <div key={blocked.id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                            <X className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {blocked.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            {blocked.reason && <p className="text-sm text-gray-500">{blocked.reason}</p>}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeBlockedDate(blocked.id)}
                                        className="p-2 rounded-lg hover:bg-red-100 text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            )}

            {activeTab === 'types' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                    <h3 className="font-bold text-gray-900 mb-4">Session Types & Pricing</h3>
                    <p className="text-sm text-gray-500 mb-6">Define the types of sessions you offer</p>

                    <div className="grid md:grid-cols-3 gap-4">
                        {sessionTypes.map((type) => (
                            <motion.div
                                key={type.id}
                                whileHover={{ scale: 1.02 }}
                                className="p-4 rounded-2xl border-2 border-gray-100 hover:border-gray-200 transition-all"
                                style={{ borderLeftColor: type.color, borderLeftWidth: 4 }}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h4 className="font-semibold text-gray-900">{type.name}</h4>
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: type.color }} />
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>{type.duration} minutes</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Users className="w-4 h-4" />
                                        <span>Max {type.maxStudents} student{type.maxStudents > 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                                        <DollarSign className="w-4 h-4" />
                                        <span>${type.price}/session</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Add new type card */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            className="p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 min-h-[150px]"
                        >
                            <Plus className="w-8 h-8 mb-2" />
                            <span className="font-medium">Add Session Type</span>
                        </motion.button>
                    </div>
                </motion.div>
            )}

            {/* Add Slot Modal */}
            <AnimatePresence>
                {isAddSlotOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddSlotOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto">
                                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900">Add Available Slot</h2>
                                    <button onClick={() => setIsAddSlotOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                                        <select
                                            value={newSlot.day}
                                            onChange={(e) => setNewSlot({ ...newSlot, day: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                                        >
                                            {daysOfWeek.map((day, idx) => (
                                                <option key={idx} value={idx}>{day}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                            <select
                                                value={newSlot.startTime}
                                                onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                                            >
                                                {timeOptions.map((time) => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                            <select
                                                value={newSlot.endTime}
                                                onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                                            >
                                                {timeOptions.map((time) => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-200 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newSlot.recurring}
                                            onChange={(e) => setNewSlot({ ...newSlot, recurring: e.target.checked })}
                                            className="w-5 h-5 rounded text-blue-500 focus:ring-blue-400"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">Repeat Weekly</p>
                                            <p className="text-sm text-gray-500">This slot will repeat every week</p>
                                        </div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                                    <button
                                        onClick={() => setIsAddSlotOpen(false)}
                                        className="px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={addSlot}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium shadow-lg"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add Slot
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
