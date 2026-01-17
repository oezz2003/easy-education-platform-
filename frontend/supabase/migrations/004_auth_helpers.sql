-- =============================================
-- EASY EDUCATION - AUTH HELPERS
-- =============================================
-- Run this after 003_extended_features.sql

-- 1. IMPROVED USER HANDLER
-- Automatically creates student/teacher profiles on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
    v_role VARCHAR;
BEGIN
    -- Determine role (default to student)
    v_role := COALESCE(new.raw_user_meta_data->>'role', 'student');

    -- Create base profile
    INSERT INTO profiles (id, email, role, full_name)
    VALUES (
        new.id, 
        new.email, 
        v_role,
        new.raw_user_meta_data->>'full_name'
    );

    -- Create sub-profile based on role
    IF v_role = 'student' THEN
        INSERT INTO student_profiles (user_id) VALUES (new.id);
    ELSIF v_role = 'teacher' THEN
        INSERT INTO teacher_profiles (user_id) VALUES (new.id);
    END IF;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. HELPER TO CREATE ADMIN
-- Usage: SELECT promote_to_admin('your.email@example.com');
CREATE OR REPLACE FUNCTION promote_to_admin(p_email TEXT)
RETURNS TEXT AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Get user ID
    SELECT id INTO v_user_id FROM profiles WHERE email = p_email;
    
    IF v_user_id IS NULL THEN
        RETURN 'User not found';
    END IF;

    -- Update role
    UPDATE profiles SET role = 'admin' WHERE id = v_user_id;
    
    -- Update metadata in auth.users (optional but good for sync)
    UPDATE auth.users 
    SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"admin"')
    WHERE id = v_user_id;

    RETURN 'User promoted to admin successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. HELPER TO CREATE TEACHER (if signed up as student)
CREATE OR REPLACE FUNCTION promote_to_teacher(p_email TEXT)
RETURNS TEXT AS $$
DECLARE
    v_user_id UUID;
BEGIN
    SELECT id INTO v_user_id FROM profiles WHERE email = p_email;
    
    IF v_user_id IS NULL THEN
        RETURN 'User not found';
    END IF;

    -- Update role
    UPDATE profiles SET role = 'teacher' WHERE id = v_user_id;
    
    -- Create teacher profile if not exists
    INSERT INTO teacher_profiles (user_id) 
    VALUES (v_user_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Update metadata
    UPDATE auth.users 
    SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"teacher"')
    WHERE id = v_user_id;

    RETURN 'User promoted to teacher successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
