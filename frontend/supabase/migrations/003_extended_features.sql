-- =============================================
-- EASY EDUCATION - EXTENDED FEATURES SCHEMA
-- =============================================
-- Run this after 002_finance_schema.sql

-- =============================================
-- 1. ACHIEVEMENTS (Gamification)
-- =============================================
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100),
    description TEXT,
    description_ar TEXT,
    icon_url VARCHAR(500),
    badge_color VARCHAR(20) DEFAULT '#10B981',
    xp_reward INT DEFAULT 0,
    category VARCHAR(50) CHECK (category IN ('streak', 'course', 'session', 'social', 'special')),
    requirement_type VARCHAR(50), -- e.g., 'streak_days', 'sessions_attended', 'courses_completed'
    requirement_value INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default achievements
INSERT INTO achievements (name, name_ar, description, xp_reward, category, requirement_type, requirement_value, badge_color) VALUES
    ('First Steps', 'الخطوات الأولى', 'Complete your first session', 50, 'session', 'sessions_attended', 1, '#10B981'),
    ('Dedicated Learner', 'متعلم مخلص', 'Attend 10 sessions', 150, 'session', 'sessions_attended', 10, '#3B82F6'),
    ('Session Master', 'أستاذ الجلسات', 'Attend 50 sessions', 500, 'session', 'sessions_attended', 50, '#8B5CF6'),
    ('Week Warrior', 'محارب الأسبوع', 'Maintain a 7-day streak', 100, 'streak', 'streak_days', 7, '#F59E0B'),
    ('Month Champion', 'بطل الشهر', 'Maintain a 30-day streak', 400, 'streak', 'streak_days', 30, '#EF4444'),
    ('Course Complete', 'إتمام الكورس', 'Complete your first course', 200, 'course', 'courses_completed', 1, '#06B6D4'),
    ('Scholar', 'باحث', 'Complete 5 courses', 750, 'course', 'courses_completed', 5, '#EC4899'),
    ('Perfect Attendance', 'حضور مثالي', 'Attend all sessions in a batch', 300, 'special', 'perfect_attendance', 1, '#FFD700');

-- =============================================
-- 2. STUDENT ACHIEVEMENTS (Earned)
-- =============================================
CREATE TABLE student_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    progress INT DEFAULT 0, -- For tracking progress toward achievement
    is_claimed BOOLEAN DEFAULT false, -- XP claimed
    UNIQUE(student_id, achievement_id)
);

-- =============================================
-- 3. TEACHER REVIEWS
-- =============================================
CREATE TABLE teacher_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false, -- Admin approval required
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update teacher rating trigger
CREATE OR REPLACE FUNCTION update_teacher_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE teacher_profiles
    SET rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM teacher_reviews
        WHERE teacher_id = NEW.teacher_id AND is_published = true
    ),
    total_reviews = (
        SELECT COUNT(*)
        FROM teacher_reviews
        WHERE teacher_id = NEW.teacher_id AND is_published = true
    )
    WHERE id = NEW.teacher_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_review
    AFTER INSERT OR UPDATE ON teacher_reviews
    FOR EACH ROW
    WHEN (NEW.is_published = true)
    EXECUTE FUNCTION update_teacher_rating();

-- =============================================
-- 4. NOTIFICATIONS
-- =============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    title_ar VARCHAR(200),
    message TEXT NOT NULL,
    message_ar TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'session_reminder', 'session_cancelled', 'session_rescheduled',
        'payment_due', 'payment_received', 'payment_overdue',
        'achievement_earned', 'xp_earned', 'streak_milestone',
        'course_enrolled', 'course_completed', 'batch_started',
        'new_review', 'salary_paid', 'announcement',
        'system', 'custom'
    )),
    related_id UUID, -- ID of related entity (session, course, etc.)
    related_type VARCHAR(50), -- Type of related entity
    action_url VARCHAR(500), -- Where to navigate on click
    is_read BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. NOTIFICATION PREFERENCES
-- =============================================
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    email_enabled BOOLEAN DEFAULT true,
    push_enabled BOOLEAN DEFAULT true,
    sms_enabled BOOLEAN DEFAULT false,
    UNIQUE(user_id, notification_type)
);

-- =============================================
-- 6. ACTIVITY LOG (Audit Trail)
-- =============================================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 7. ANNOUNCEMENTS (Platform-wide)
-- =============================================
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    title_ar VARCHAR(200),
    content TEXT NOT NULL,
    content_ar TEXT,
    target_role VARCHAR(20) CHECK (target_role IN ('all', 'admin', 'teacher', 'student')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_student_achievements_student ON student_achievements(student_id);
CREATE INDEX idx_student_achievements_achievement ON student_achievements(achievement_id);
CREATE INDEX idx_teacher_reviews_teacher ON teacher_reviews(teacher_id);
CREATE INDEX idx_teacher_reviews_student ON teacher_reviews(student_id);
CREATE INDEX idx_teacher_reviews_published ON teacher_reviews(is_published);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_announcements_active ON announcements(is_active);
CREATE INDEX idx_announcements_role ON announcements(target_role);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Achievements (public read)
CREATE POLICY "Achievements are public" ON achievements FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage achievements" ON achievements FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Student achievements
CREATE POLICY "Students view own achievements" ON student_achievements FOR SELECT
    USING (student_id IN (SELECT id FROM student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "System manages achievements" ON student_achievements FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Teacher reviews
CREATE POLICY "Public reviews are viewable" ON teacher_reviews FOR SELECT
    USING (is_published = true);
CREATE POLICY "Students can create reviews" ON teacher_reviews FOR INSERT
    WITH CHECK (student_id IN (SELECT id FROM student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Students can edit own reviews" ON teacher_reviews FOR UPDATE
    USING (student_id IN (SELECT id FROM student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Admins manage reviews" ON teacher_reviews FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Notifications
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT
    USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE
    USING (user_id = auth.uid());
CREATE POLICY "System creates notifications" ON notifications FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Notification preferences
CREATE POLICY "Users manage own preferences" ON notification_preferences FOR ALL
    USING (user_id = auth.uid());

-- Activity logs (admin only)
CREATE POLICY "Admins view activity logs" ON activity_logs FOR SELECT
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Announcements
CREATE POLICY "Users view relevant announcements" ON announcements FOR SELECT
    USING (
        is_active = true 
        AND (starts_at IS NULL OR starts_at <= NOW())
        AND (expires_at IS NULL OR expires_at > NOW())
        AND (
            target_role = 'all' 
            OR target_role = (SELECT role FROM profiles WHERE id = auth.uid())
        )
    );
CREATE POLICY "Admins manage announcements" ON announcements FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Check and award achievements
CREATE OR REPLACE FUNCTION check_student_achievements(p_student_id UUID)
RETURNS void AS $$
DECLARE
    v_achievement RECORD;
    v_current_value INT;
    v_student student_profiles%ROWTYPE;
BEGIN
    SELECT * INTO v_student FROM student_profiles WHERE id = p_student_id;
    
    FOR v_achievement IN SELECT * FROM achievements WHERE is_active = true LOOP
        -- Calculate current value based on requirement type
        CASE v_achievement.requirement_type
            WHEN 'streak_days' THEN
                v_current_value := v_student.streak_days;
            WHEN 'sessions_attended' THEN
                SELECT COUNT(*) INTO v_current_value
                FROM attendance
                WHERE student_id = p_student_id AND status IN ('present', 'late');
            WHEN 'courses_completed' THEN
                SELECT COUNT(DISTINCT be.batch_id) INTO v_current_value
                FROM batch_enrollments be
                JOIN batches b ON be.batch_id = b.id
                WHERE be.student_id = p_student_id AND be.status = 'completed';
            ELSE
                v_current_value := 0;
        END CASE;
        
        -- Award if requirement met and not already earned
        IF v_current_value >= v_achievement.requirement_value THEN
            INSERT INTO student_achievements (student_id, achievement_id, progress)
            VALUES (p_student_id, v_achievement.id, v_current_value)
            ON CONFLICT (student_id, achievement_id) 
            DO UPDATE SET progress = v_current_value;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create notification helper
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_title VARCHAR(200),
    p_message TEXT,
    p_type VARCHAR(50),
    p_related_id UUID DEFAULT NULL,
    p_related_type VARCHAR(50) DEFAULT NULL,
    p_action_url VARCHAR(500) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, title, message, type, related_id, related_type, action_url)
    VALUES (p_user_id, p_title, p_message, p_type, p_related_id, p_related_type, p_action_url)
    RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update trigger for reviews
CREATE TRIGGER update_reviews_timestamp
    BEFORE UPDATE ON teacher_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
