-- =============================================
-- FIX AUTH TRIGGER
-- =============================================
-- Run this in Supabase SQL Editor to fix "Database error creating new user"

-- 1. Drop existing trigger to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Update the function with better error handling and search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    v_role VARCHAR;
BEGIN
    -- Set search path to ensure we use public tables
    -- (Good practice for SECURITY DEFINER functions)
    
    -- Determine role (default to student if missing)
    v_role := COALESCE(new.raw_user_meta_data->>'role', 'student');

    -- Ensure role is valid (fallback to student)
    IF v_role NOT IN ('admin', 'teacher', 'student') THEN
        v_role := 'student';
    END IF;

    -- Create base profile
    -- Use ON CONFLICT DO NOTHING in case profile was manually created
    INSERT INTO public.profiles (id, email, role, full_name)
    VALUES (
        new.id, 
        new.email, 
        v_role,
        new.raw_user_meta_data->>'full_name'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        full_name = EXCLUDED.full_name;

    -- Create sub-profile based on role
    IF v_role = 'student' THEN
        INSERT INTO public.student_profiles (user_id) 
        VALUES (new.id)
        ON CONFLICT (user_id) DO NOTHING;
    ELSIF v_role = 'teacher' THEN
        INSERT INTO public.teacher_profiles (user_id) 
        VALUES (new.id)
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Re-create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Verify it works
-- You can run this to check if the function exists
SELECT 'Auth trigger fixed successfully' as status;
