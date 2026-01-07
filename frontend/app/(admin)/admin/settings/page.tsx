'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    CreditCard,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Camera,
    Save,
    Check,
    ChevronRight,
    Moon,
    Sun,
    Smartphone
} from 'lucide-react';

// Settings sections
const settingsSections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'platform', label: 'Platform', icon: Palette },
    { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Profile state
    const [profile, setProfile] = useState({
        name: 'Admin User',
        email: 'admin@easyedu.com',
        phone: '+20 123 456 7890',
        role: 'Super Admin',
        avatar: '/login-signup assits/manger.png',
    });

    // Notification settings
    const [notifications, setNotifications] = useState({
        emailNewStudent: true,
        emailNewEnrollment: true,
        emailPayment: true,
        emailWeeklyReport: false,
        pushNewStudent: true,
        pushLiveSession: true,
        pushMessages: true,
        smsAlerts: false,
    });

    // Platform settings
    const [platform, setPlatform] = useState({
        siteName: 'Easy Education',
        language: 'en',
        timezone: 'Africa/Cairo',
        theme: 'light',
        maintenanceMode: false,
        allowRegistration: true,
    });

    // Security settings
    const [security, setSecurity] = useState({
        twoFactor: false,
        sessionTimeout: '30',
        ipWhitelist: '',
    });

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Information</h3>

                            {/* Avatar */}
                            <div className="flex items-center gap-6 mb-6">
                                <div className="relative">
                                    <img src={profile.avatar} alt="" className="w-24 h-24 rounded-2xl object-contain bg-gray-100" />
                                    <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-lg hover:bg-purple-600 transition-colors">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{profile.name}</p>
                                    <p className="text-sm text-gray-500">{profile.role}</p>
                                    <button className="text-sm text-purple-500 hover:text-purple-600 mt-1">Change photo</button>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                    <input
                                        type="text"
                                        value={profile.role}
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Email Notifications</h3>
                            <div className="space-y-3">
                                {[
                                    { key: 'emailNewStudent', label: 'New student registration', desc: 'Get notified when a new student signs up' },
                                    { key: 'emailNewEnrollment', label: 'Course enrollments', desc: 'When a student enrolls in a course' },
                                    { key: 'emailPayment', label: 'Payment received', desc: 'Confirmation of successful payments' },
                                    { key: 'emailWeeklyReport', label: 'Weekly reports', desc: 'Weekly summary of platform activity' },
                                ].map((item) => (
                                    <label key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-purple-200 cursor-pointer transition-colors">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.label}</p>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notifications[item.key as keyof typeof notifications]}
                                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                            className="w-5 h-5 rounded text-purple-500 focus:ring-purple-400"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Push Notifications</h3>
                            <div className="space-y-3">
                                {[
                                    { key: 'pushNewStudent', label: 'New registrations', icon: User },
                                    { key: 'pushLiveSession', label: 'Live session alerts', icon: Bell },
                                    { key: 'pushMessages', label: 'Direct messages', icon: Mail },
                                ].map((item) => (
                                    <label key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-purple-200 cursor-pointer transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                                <item.icon className="w-5 h-5 text-purple-500" />
                                            </div>
                                            <span className="font-medium text-gray-900">{item.label}</span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notifications[item.key as keyof typeof notifications]}
                                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                            className="w-5 h-5 rounded text-purple-500 focus:ring-purple-400"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
                            <div className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                        />
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Two-Factor Authentication</h3>
                            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-purple-200 cursor-pointer transition-colors max-w-md">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Enable 2FA</p>
                                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={security.twoFactor}
                                    onChange={(e) => setSecurity({ ...security, twoFactor: e.target.checked })}
                                    className="w-5 h-5 rounded text-purple-500 focus:ring-purple-400"
                                />
                            </label>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Session Settings</h3>
                            <div className="max-w-md">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Auto logout after inactivity</label>
                                <select
                                    value={security.sessionTimeout}
                                    onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
                                >
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="120">2 hours</option>
                                    <option value="never">Never</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 'platform':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">General Settings</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                                    <input
                                        type="text"
                                        value={platform.siteName}
                                        onChange={(e) => setPlatform({ ...platform, siteName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                                    <select
                                        value={platform.language}
                                        onChange={(e) => setPlatform({ ...platform, language: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
                                    >
                                        <option value="en">English</option>
                                        <option value="ar">العربية</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                                    <select
                                        value={platform.timezone}
                                        onChange={(e) => setPlatform({ ...platform, timezone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
                                    >
                                        <option value="Africa/Cairo">Africa/Cairo (GMT+2)</option>
                                        <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                                        <option value="Europe/London">Europe/London (GMT+0)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                                    <div className="flex gap-2">
                                        {[
                                            { id: 'light', label: 'Light', icon: Sun },
                                            { id: 'dark', label: 'Dark', icon: Moon },
                                        ].map((theme) => (
                                            <button
                                                key={theme.id}
                                                onClick={() => setPlatform({ ...platform, theme: theme.id })}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${platform.theme === theme.id
                                                        ? 'border-purple-500 bg-purple-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <theme.icon className={`w-5 h-5 ${platform.theme === theme.id ? 'text-purple-500' : 'text-gray-500'}`} />
                                                <span className={`font-medium ${platform.theme === theme.id ? 'text-purple-600' : 'text-gray-600'}`}>{theme.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Access Control</h3>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-purple-200 cursor-pointer transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-900">Allow New Registrations</p>
                                        <p className="text-sm text-gray-500">Enable students and teachers to sign up</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={platform.allowRegistration}
                                        onChange={(e) => setPlatform({ ...platform, allowRegistration: e.target.checked })}
                                        className="w-5 h-5 rounded text-purple-500 focus:ring-purple-400"
                                    />
                                </label>
                                <label className="flex items-center justify-between p-4 rounded-xl border border-red-200 hover:border-red-300 cursor-pointer transition-colors bg-red-50/50">
                                    <div>
                                        <p className="font-medium text-red-700">Maintenance Mode</p>
                                        <p className="text-sm text-red-500">Temporarily disable access to the platform</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={platform.maintenanceMode}
                                        onChange={(e) => setPlatform({ ...platform, maintenanceMode: e.target.checked })}
                                        className="w-5 h-5 rounded text-red-500 focus:ring-red-400"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 'billing':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Current Plan</h3>
                            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-purple-200 text-sm">Current Plan</p>
                                        <p className="text-2xl font-bold">Enterprise</p>
                                    </div>
                                    <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">Active</div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-purple-200 text-sm">Next billing date</p>
                                        <p className="font-semibold">February 1, 2026</p>
                                    </div>
                                    <p className="text-3xl font-bold">$299<span className="text-lg font-normal text-purple-200">/mo</span></p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
                            <div className="p-4 rounded-xl border border-gray-200 flex items-center gap-4">
                                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">VISA</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                                    <p className="text-sm text-gray-500">Expires 12/27</p>
                                </div>
                                <button className="text-purple-500 hover:text-purple-600 text-sm font-medium">Update</button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Billing History</h3>
                            <div className="space-y-2">
                                {[
                                    { date: 'Jan 1, 2026', amount: '$299.00', status: 'Paid' },
                                    { date: 'Dec 1, 2025', amount: '$299.00', status: 'Paid' },
                                    { date: 'Nov 1, 2025', amount: '$299.00', status: 'Paid' },
                                ].map((invoice, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div>
                                            <p className="font-medium text-gray-900">{invoice.date}</p>
                                            <p className="text-sm text-gray-500">Invoice #{10045 - idx}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-gray-900">{invoice.amount}</span>
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">{invoice.status}</span>
                                            <button className="text-purple-500 hover:text-purple-600 text-sm">Download</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg">
                        <Settings className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
                        <p className="text-gray-500 text-sm">Manage your account and platform settings</p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl font-medium shadow-lg disabled:opacity-50"
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

            {/* Settings Layout */}
            <div className="grid lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1"
                >
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
                        {settingsSections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === section.id
                                        ? 'bg-purple-50 text-purple-600'
                                        : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                            >
                                <section.icon className={`w-5 h-5 ${activeSection === section.id ? 'text-purple-500' : 'text-gray-400'}`} />
                                <span className="font-medium">{section.label}</span>
                                <ChevronRight className={`w-4 h-4 ml-auto ${activeSection === section.id ? 'text-purple-500' : 'text-gray-300'}`} />
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="lg:col-span-3"
                >
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        {renderContent()}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
