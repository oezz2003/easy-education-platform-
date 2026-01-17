-- =============================================
-- EASY EDUCATION PLATFORM - SUPABASE MIGRATIONS
-- =============================================
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. PROFILES (extends Supabase Auth)
-- =============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
    avatar_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO profiles (id, email, role, full_name)
    VALUES (
        new.id, 
        new.email, 
        COALESCE(new.raw_user_meta_data->>'role', 'student'),
        new.raw_user_meta_data->>'full_name'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- 2. TEACHER PROFILES
-- =============================================
CREATE TABLE teacher_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    bio TEXT,
    subject VARCHAR(100),
    experience_years INT DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    total_reviews INT DEFAULT 0,
    total_students INT DEFAULT 0,
    hourly_rate DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =============================================
-- 3. STUDENT PROFILES
-- =============================================
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    level VARCHAR(20) CHECK (level IN ('primary', 'preparatory', 'secondary', 'university')),
    parent_phone VARCHAR(20),
    xp_points INT DEFAULT 0,
    streak_days INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =============================================
-- 4. COURSES
-- =============================================
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    subject VARCHAR(100),
    level VARCHAR(20) CHECK (level IN ('primary', 'preparatory', 'secondary', 'university')),
    thumbnail_url VARCHAR(500),
    price DECIMAL(10,2) DEFAULT 0,
    duration_weeks INT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. BATCHES (Course Instances)
-- =============================================
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teacher_profiles(id),
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    schedule VARCHAR(200),
    max_students INT DEFAULT 30,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
    sessions_count INT DEFAULT 0,
    completed_sessions INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 6. BATCH ENROLLMENTS
-- =============================================
CREATE TABLE batch_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    UNIQUE(batch_id, student_id)
);

-- =============================================
-- 7. TEACHER AVAILABILITY
-- =============================================
CREATE TABLE teacher_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_recurring BOOLEAN DEFAULT true
);

-- =============================================
-- 8. BLOCKED DATES
-- =============================================
CREATE TABLE blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
    blocked_date DATE NOT NULL,
    reason VARCHAR(200)
);

-- =============================================
-- 9. SESSION TYPES
-- =============================================
CREATE TABLE session_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    max_students INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true
);

-- =============================================
-- 10. LIVE SESSIONS
-- =============================================
CREATE TABLE live_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    teacher_id UUID NOT NULL REFERENCES teacher_profiles(id),
    batch_id UUID REFERENCES batches(id),
    course_id UUID REFERENCES courses(id),
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT,
    max_attendees INT DEFAULT 30,
    meet_link VARCHAR(500),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
    is_recurring BOOLEAN DEFAULT false,
    recurring_days INT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 11. ATTENDANCE
-- =============================================
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ,
    left_at TIMESTAMPTZ,
    duration_minutes INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'absent' CHECK (status IN ('present', 'absent', 'late', 'left_early')),
    participation_score INT DEFAULT 0 CHECK (participation_score BETWEEN 0 AND 100),
    UNIQUE(session_id, student_id)
);

-- =============================================
-- 12. SESSION BOOKINGS (Public Free Sessions)
-- =============================================
CREATE TABLE session_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teacher_profiles(id),
    course_id UUID REFERENCES courses(id),
    student_name VARCHAR(100) NOT NULL,
    student_phone VARCHAR(20) NOT NULL,
    student_email VARCHAR(255),
    level VARCHAR(20),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 13. INVOICES
-- =============================================
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    teacher_id UUID NOT NULL REFERENCES teacher_profiles(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    subtotal DECIMAL(10,2) DEFAULT 0,
    custom_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 14. INVOICE ITEMS
-- =============================================
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    item_type VARCHAR(20) CHECK (item_type IN ('session', 'course_revenue', 'custom')),
    description VARCHAR(200),
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    session_id UUID REFERENCES live_sessions(id),
    course_id UUID REFERENCES courses(id)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_teacher_profiles_user ON teacher_profiles(user_id);
CREATE INDEX idx_student_profiles_user ON student_profiles(user_id);
CREATE INDEX idx_batches_course ON batches(course_id);
CREATE INDEX idx_batches_teacher ON batches(teacher_id);
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_enrollments_batch ON batch_enrollments(batch_id);
CREATE INDEX idx_enrollments_student ON batch_enrollments(student_id);
CREATE INDEX idx_sessions_date ON live_sessions(session_date);
CREATE INDEX idx_sessions_teacher ON live_sessions(teacher_id);
CREATE INDEX idx_sessions_batch ON live_sessions(batch_id);
CREATE INDEX idx_sessions_status ON live_sessions(status);
CREATE INDEX idx_attendance_session ON attendance(session_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_bookings_teacher ON session_bookings(teacher_id);
CREATE INDEX idx_bookings_date ON session_bookings(booking_date);
CREATE INDEX idx_invoices_teacher ON invoices(teacher_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Teacher profiles policies
CREATE POLICY "Teacher profiles are viewable" ON teacher_profiles FOR SELECT USING (true);
CREATE POLICY "Teachers can update own" ON teacher_profiles FOR UPDATE USING (user_id = auth.uid());

-- Student profiles policies
CREATE POLICY "Students viewable by staff" ON student_profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
    OR user_id = auth.uid()
);

-- Courses policies (public read)
CREATE POLICY "Courses are public" ON courses FOR SELECT USING (true);
CREATE POLICY "Admins manage courses" ON courses FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Batches policies
CREATE POLICY "Batches are viewable" ON batches FOR SELECT USING (true);
CREATE POLICY "Admins manage batches" ON batches FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Sessions policies
CREATE POLICY "Sessions are viewable" ON live_sessions FOR SELECT USING (true);
CREATE POLICY "Teachers manage own sessions" ON live_sessions FOR ALL USING (
    teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Admins manage all sessions" ON live_sessions FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Attendance policies
CREATE POLICY "View own attendance" ON attendance FOR SELECT USING (
    student_id IN (SELECT id FROM student_profiles WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- Bookings (public insert for free trials)
CREATE POLICY "Anyone can book" ON session_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff view bookings" ON session_bookings FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- Invoices policies
CREATE POLICY "Teachers view own invoices" ON invoices FOR SELECT USING (
    teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins manage invoices" ON invoices FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'INV-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_timestamp
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
