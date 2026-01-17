-- =============================================
-- EASY EDUCATION - FINANCE SCHEMA
-- =============================================
-- Run this after 001_initial_schema.sql

-- =============================================
-- 1. STUDENT TRANSACTIONS (Payments)
-- =============================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE SET NULL,
    batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('payment', 'refund', 'discount', 'fee')),
    payment_method VARCHAR(50), -- cash, card, bank_transfer, mobile_wallet
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
    reference_number VARCHAR(100),
    receipt_number VARCHAR(50),
    notes TEXT,
    paid_at TIMESTAMPTZ,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. TEACHER SALARIES (Monthly)
-- =============================================
CREATE TABLE teacher_salaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INT NOT NULL,
    base_salary DECIMAL(10,2) DEFAULT 0,
    session_earnings DECIMAL(10,2) DEFAULT 0,
    sessions_count INT DEFAULT 0,
    bonus DECIMAL(10,2) DEFAULT 0,
    deductions DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'on_hold', 'cancelled')),
    paid_at TIMESTAMPTZ,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(teacher_id, month, year)
);

-- =============================================
-- 3. SALARY ITEMS (Breakdown)
-- =============================================
CREATE TABLE salary_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salary_id UUID NOT NULL REFERENCES teacher_salaries(id) ON DELETE CASCADE,
    description VARCHAR(200),
    type VARCHAR(20) NOT NULL CHECK (type IN ('session', 'bonus', 'deduction', 'adjustment', 'base')),
    amount DECIMAL(10,2) NOT NULL,
    session_id UUID REFERENCES live_sessions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. EXPENSE CATEGORIES (For tracking)
-- =============================================
CREATE TABLE expense_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO expense_categories (name, description, color) VALUES
    ('Teacher Salaries', 'Monthly teacher payments', '#10B981'),
    ('Platform Fees', 'Platform and hosting costs', '#3B82F6'),
    ('Marketing', 'Advertising and promotions', '#8B5CF6'),
    ('Office Supplies', 'Administrative expenses', '#F59E0B'),
    ('Other', 'Miscellaneous expenses', '#6B7280');

-- =============================================
-- 5. EXPENSES (Platform expenses)
-- =============================================
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES expense_categories(id),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    expense_date DATE NOT NULL,
    payment_method VARCHAR(50),
    receipt_url VARCHAR(500),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_transactions_student ON transactions(student_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created ON transactions(created_at);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_salaries_teacher ON teacher_salaries(teacher_id);
CREATE INDEX idx_salaries_period ON teacher_salaries(year, month);
CREATE INDEX idx_salaries_status ON teacher_salaries(status);
CREATE INDEX idx_salary_items_salary ON salary_items(salary_id);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Transactions policies
CREATE POLICY "Admins manage transactions" ON transactions FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Students view own transactions" ON transactions FOR SELECT
    USING (student_id IN (SELECT id FROM student_profiles WHERE user_id = auth.uid()));

-- Salaries policies
CREATE POLICY "Admins manage salaries" ON teacher_salaries FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Teachers view own salary" ON teacher_salaries FOR SELECT
    USING (teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid()));

-- Salary items policies
CREATE POLICY "Admins manage salary items" ON salary_items FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Teachers view own salary items" ON salary_items FOR SELECT
    USING (salary_id IN (
        SELECT id FROM teacher_salaries 
        WHERE teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid())
    ));

-- Expense policies (admin only)
CREATE POLICY "Admins manage expenses" ON expenses FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins view categories" ON expense_categories FOR SELECT
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Generate receipt number
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'REC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Calculate teacher session earnings for a month
CREATE OR REPLACE FUNCTION calculate_teacher_earnings(
    p_teacher_id UUID,
    p_month INT,
    p_year INT
)
RETURNS TABLE(
    session_count INT,
    total_earnings DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INT as session_count,
        COALESCE(SUM(tp.hourly_rate), 0)::DECIMAL(10,2) as total_earnings
    FROM live_sessions ls
    JOIN teacher_profiles tp ON ls.teacher_id = tp.id
    WHERE ls.teacher_id = p_teacher_id
    AND ls.status = 'completed'
    AND EXTRACT(MONTH FROM ls.session_date) = p_month
    AND EXTRACT(YEAR FROM ls.session_date) = p_year;
END;
$$ LANGUAGE plpgsql;

-- Update timestamp trigger for transactions
CREATE TRIGGER update_transactions_timestamp
    BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_salaries_timestamp
    BEFORE UPDATE ON teacher_salaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
