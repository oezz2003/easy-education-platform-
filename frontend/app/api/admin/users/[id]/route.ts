import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: teacherId } = await params;

        // 1. Verify the requester is an admin
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Parse request body
        const body = await request.json();
        const { profile: profileUpdates, teacher: teacherUpdates } = body;

        console.log('Admin update teacher request:', { teacherId, profileUpdates, teacherUpdates });

        const supabaseAdmin = createAdminClient();

        // 3. Update teacher profile
        if (teacherUpdates) {
            const { error: teacherError } = await supabaseAdmin
                .from('teacher_profiles')
                .update(teacherUpdates)
                .eq('id', teacherId);

            if (teacherError) {
                console.error('Teacher profile update error:', teacherError);
                return NextResponse.json({ error: teacherError.message }, { status: 400 });
            }
        }

        // 4. Update base profile (need to get user_id from teacher_profile first if not provided, 
        // but we can assume the caller might pass it or we fetch it)
        // Actually, let's fetch the user_id from the teacher_profile to be safe
        if (profileUpdates) {
            const { data: teacherData, error: fetchError } = await supabaseAdmin
                .from('teacher_profiles')
                .select('user_id')
                .eq('id', teacherId)
                .single();

            if (fetchError || !teacherData) {
                return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
            }

            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .update(profileUpdates)
                .eq('id', teacherData.user_id);

            if (profileError) {
                console.error('Profile update error:', profileError);
                return NextResponse.json({ error: profileError.message }, { status: 400 });
            }
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Update teacher error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
