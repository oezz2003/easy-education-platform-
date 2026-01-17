// =============================================
// EASY EDUCATION - DATABASE TYPES
// =============================================

// Base types
export type UserRole = 'admin' | 'teacher' | 'student';
export type UserStatus = 'active' | 'inactive' | 'suspended';
export type Level = 'primary' | 'preparatory' | 'secondary' | 'university';
export type CourseStatus = 'active' | 'archived' | 'draft';
export type BatchStatus = 'upcoming' | 'active' | 'completed';
export type EnrollmentStatus = 'active' | 'completed' | 'dropped';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type SessionStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'left_early';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type InvoiceStatus = 'pending' | 'paid' | 'cancelled';
export type InvoiceItemType = 'session' | 'course_revenue' | 'custom';

// =============================================
// DATABASE TABLES
// =============================================

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    phone: string | null;
    role: UserRole;
    avatar_url: string | null;
    status: UserStatus;
    created_at: string;
    updated_at: string | null;
}

export interface TeacherProfile {
    id: string;
    user_id: string;
    bio: string | null;
    subject: string | null;
    experience_years: number;
    rating: number;
    total_reviews: number;
    total_students: number;
    hourly_rate: number | null;
    created_at: string;
}

export interface StudentProfile {
    id: string;
    user_id: string;
    level: Level | null;
    parent_phone: string | null;
    xp_points: number;
    streak_days: number;
    created_at: string;
}

export interface Course {
    id: string;
    name: string;
    description: string | null;
    subject: string | null;
    level: Level | null;
    thumbnail_url: string | null;
    price: number;
    duration_weeks: number | null;
    status: CourseStatus;
    created_at: string;
}

export interface Batch {
    id: string;
    course_id: string;
    teacher_id: string;
    name: string;
    start_date: string;
    end_date: string;
    schedule: string | null;
    max_students: number;
    status: BatchStatus;
    sessions_count: number;
    completed_sessions: number;
    created_at: string;
}

export interface BatchEnrollment {
    id: string;
    batch_id: string;
    student_id: string;
    enrolled_at: string;
    status: EnrollmentStatus;
    payment_status: PaymentStatus;
}

export interface TeacherAvailability {
    id: string;
    teacher_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_recurring: boolean;
}

export interface BlockedDate {
    id: string;
    teacher_id: string;
    blocked_date: string;
    reason: string | null;
}

export interface SessionType {
    id: string;
    teacher_id: string;
    name: string;
    description: string | null;
    duration_minutes: number;
    price: number;
    max_students: number;
    is_active: boolean;
}

export interface LiveSession {
    id: string;
    title: string;
    description: string | null;
    teacher_id: string;
    batch_id: string | null;
    course_id: string | null;
    session_date: string;
    start_time: string;
    end_time: string;
    duration_minutes: number | null;
    max_attendees: number;
    meet_link: string | null;
    status: SessionStatus;
    is_recurring: boolean;
    recurring_days: number[] | null;
    created_at: string;
}

export interface Attendance {
    id: string;
    session_id: string;
    student_id: string;
    joined_at: string | null;
    left_at: string | null;
    duration_minutes: number;
    status: AttendanceStatus;
    participation_score: number;
}

export interface SessionBooking {
    id: string;
    teacher_id: string;
    course_id: string | null;
    student_name: string;
    student_phone: string;
    student_email: string | null;
    level: string | null;
    booking_date: string;
    booking_time: string;
    status: BookingStatus;
    created_at: string;
}

export interface Invoice {
    id: string;
    invoice_number: string;
    teacher_id: string;
    period_start: string;
    period_end: string;
    subtotal: number;
    custom_amount: number;
    total_amount: number;
    notes: string | null;
    status: InvoiceStatus;
    paid_at: string | null;
    created_at: string;
}

export interface InvoiceItem {
    id: string;
    invoice_id: string;
    item_type: InvoiceItemType | null;
    description: string | null;
    quantity: number;
    unit_price: number | null;
    total_price: number | null;
    session_id: string | null;
    course_id: string | null;
}

// =============================================
// JOINED/EXTENDED TYPES
// =============================================

export interface TeacherWithProfile extends TeacherProfile {
    profile: Profile;
}

export interface StudentWithProfile extends StudentProfile {
    profile: Profile;
}

export interface BatchWithDetails extends Batch {
    course: Course;
    teacher: TeacherWithProfile;
    enrollments_count?: number;
}

export interface SessionWithDetails extends LiveSession {
    teacher: TeacherWithProfile;
    batch?: Batch;
    course?: Course;
    attendance?: Attendance[];
}

export interface AttendanceWithStudent extends Attendance {
    student: StudentWithProfile;
}

export interface InvoiceWithItems extends Invoice {
    items: InvoiceItem[];
    teacher: TeacherWithProfile;
}

// =============================================
// INPUT TYPES (for creating/updating)
// =============================================

export interface CreateCourseInput {
    name: string;
    description?: string;
    subject?: string;
    level?: Level;
    thumbnail_url?: string;
    price?: number;
    duration_weeks?: number;
    status?: 'active' | 'archived' | 'draft';
}

export interface CreateBatchInput {
    course_id: string;
    teacher_id: string;
    name: string;
    start_date: string;
    end_date: string;
    schedule?: string;
    max_students?: number;
}

export interface CreateSessionInput {
    title: string;
    description?: string;
    teacher_id: string;
    batch_id?: string;
    course_id?: string;
    session_date: string;
    start_time: string;
    end_time: string;
    duration_minutes?: number;
    max_attendees?: number;
    is_recurring?: boolean;
    recurring_days?: number[];
}

export interface CreateBookingInput {
    teacher_id: string;
    course_id?: string;
    student_name: string;
    student_phone: string;
    student_email?: string;
    level?: string;
    booking_date: string;
    booking_time: string;
}

export interface CreateInvoiceInput {
    teacher_id: string;
    period_start: string;
    period_end: string;
    subtotal?: number;
    custom_amount?: number;
    total_amount: number;
    notes?: string;
    items?: {
        item_type: InvoiceItemType;
        description: string;
        quantity: number;
        unit_price: number;
        total_price: number;
        session_id?: string;
        course_id?: string;
    }[];
}

// =============================================
// API RESPONSE TYPES
// =============================================

export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
}

export interface PaginatedResponse<T> {
    data: T[];
    count: number;
    page: number;
    limit: number;
}

export interface AdminStats {
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    activeBatches: number;
    todaySessions: number;
    pendingInvoices: number;
    totalRevenue: number;
}

// =============================================
// FINANCE TYPES
// =============================================

export type TransactionType = 'payment' | 'refund' | 'discount' | 'fee';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
export type SalaryStatus = 'pending' | 'paid' | 'on_hold' | 'cancelled';
export type SalaryItemType = 'session' | 'bonus' | 'deduction' | 'adjustment' | 'base';

export interface Transaction {
    id: string;
    student_id: string | null;
    batch_id: string | null;
    course_id: string | null;
    amount: number;
    type: TransactionType;
    payment_method: string | null;
    status: TransactionStatus;
    reference_number: string | null;
    receipt_number: string | null;
    notes: string | null;
    paid_at: string | null;
    created_by: string | null;
    created_at: string;
    updated_at: string | null;
}

export interface TeacherSalary {
    id: string;
    teacher_id: string;
    month: number;
    year: number;
    base_salary: number;
    session_earnings: number;
    sessions_count: number;
    bonus: number;
    deductions: number;
    total_amount: number;
    status: SalaryStatus;
    paid_at: string | null;
    payment_method: string | null;
    payment_reference: string | null;
    notes: string | null;
    created_by: string | null;
    created_at: string;
    updated_at: string | null;
}

export interface SalaryItem {
    id: string;
    salary_id: string;
    description: string | null;
    type: SalaryItemType;
    amount: number;
    session_id: string | null;
    created_at: string;
}

export interface ExpenseCategory {
    id: string;
    name: string;
    description: string | null;
    color: string | null;
    is_active: boolean;
    created_at: string;
}

export interface Expense {
    id: string;
    category_id: string | null;
    amount: number;
    description: string | null;
    expense_date: string;
    payment_method: string | null;
    receipt_url: string | null;
    created_by: string | null;
    created_at: string;
}

// Extended types
export interface TransactionWithDetails extends Transaction {
    student?: StudentWithProfile;
    course?: Course;
    batch?: Batch;
}

export interface SalaryWithDetails extends TeacherSalary {
    teacher: TeacherWithProfile;
    items?: SalaryItem[];
}

// Input types
export interface CreateTransactionInput {
    student_id?: string;
    batch_id?: string;
    course_id?: string;
    amount: number;
    type: TransactionType;
    payment_method?: string;
    reference_number?: string;
    notes?: string;
    status?: TransactionStatus;
    paid_at?: string;
}

export interface CreateSalaryInput {
    teacher_id: string;
    month: number;
    year: number;
    base_salary?: number;
    session_earnings?: number;
    sessions_count?: number;
    bonus?: number;
    deductions?: number;
    total_amount: number;
    notes?: string;
}

// Finance stats
export interface FinanceStats {
    totalRevenue: number;
    pendingPayments: number;
    completedPayments: number;
    totalSalariesPaid: number;
    pendingSalaries: number;
    monthlyRevenue: number[];
    monthlySalaries: number[];
}

// =============================================
// EXTENDED FEATURES TYPES
// =============================================

export type AchievementCategory = 'streak' | 'course' | 'session' | 'social' | 'special';
export type NotificationType =
    | 'session_reminder' | 'session_cancelled' | 'session_rescheduled'
    | 'payment_due' | 'payment_received' | 'payment_overdue'
    | 'achievement_earned' | 'xp_earned' | 'streak_milestone'
    | 'course_enrolled' | 'course_completed' | 'batch_started'
    | 'new_review' | 'salary_paid' | 'announcement'
    | 'system' | 'custom';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Achievement {
    id: string;
    name: string;
    name_ar: string | null;
    description: string | null;
    description_ar: string | null;
    icon_url: string | null;
    badge_color: string;
    xp_reward: number;
    category: AchievementCategory;
    requirement_type: string | null;
    requirement_value: number;
    is_active: boolean;
    created_at: string;
}

export interface StudentAchievement {
    id: string;
    student_id: string;
    achievement_id: string;
    earned_at: string;
    progress: number;
    is_claimed: boolean;
}

export interface StudentAchievementWithDetails extends StudentAchievement {
    achievement: Achievement;
}

export interface TeacherReview {
    id: string;
    teacher_id: string;
    student_id: string;
    course_id: string | null;
    batch_id: string | null;
    rating: number;
    comment: string | null;
    is_anonymous: boolean;
    is_approved: boolean;
    is_published: boolean;
    created_at: string;
    updated_at: string | null;
}

export interface TeacherReviewWithStudent extends TeacherReview {
    student?: StudentWithProfile;
    course?: Course;
}

export interface Notification {
    id: string;
    user_id: string;
    title: string;
    title_ar: string | null;
    message: string;
    message_ar: string | null;
    type: NotificationType;
    related_id: string | null;
    related_type: string | null;
    action_url: string | null;
    is_read: boolean;
    is_archived: boolean;
    priority: NotificationPriority;
    expires_at: string | null;
    created_at: string;
}

export interface NotificationPreference {
    id: string;
    user_id: string;
    notification_type: string;
    email_enabled: boolean;
    push_enabled: boolean;
    sms_enabled: boolean;
}

export interface Announcement {
    id: string;
    title: string;
    title_ar: string | null;
    content: string;
    content_ar: string | null;
    target_role: 'all' | 'admin' | 'teacher' | 'student';
    priority: NotificationPriority;
    starts_at: string | null;
    expires_at: string | null;
    is_active: boolean;
    created_by: string | null;
    created_at: string;
}

export interface ActivityLog {
    id: string;
    user_id: string | null;
    action: string;
    entity_type: string | null;
    entity_id: string | null;
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
}

// Input types for extended features
export interface CreateReviewInput {
    teacher_id: string;
    course_id?: string;
    batch_id?: string;
    rating: number;
    comment?: string;
    is_anonymous?: boolean;
}

export interface CreateNotificationInput {
    user_id: string;
    title: string;
    message: string;
    type: NotificationType;
    related_id?: string;
    related_type?: string;
    action_url?: string;
    priority?: NotificationPriority;
}
