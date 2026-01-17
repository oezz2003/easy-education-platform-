import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
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
        console.log('Admin create user request:', body);
        const { email, password, role, fullName, metadata, phone } = body;

        if (!email || !password || !role || !fullName) {
            console.log('Missing required fields');
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 3. Create user using admin client
        const supabaseAdmin = createAdminClient();

        console.log('Creating user in Supabase Auth...');
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                role,
                full_name: fullName,
                phone: phone || null,
            },
        });

        if (authError) {
            console.error('Supabase Auth create error:', authError);
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        if (!authData.user) {
            console.error('No user returned from create');
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
        }

        console.log('User created:', authData.user.id);

        // 3.5 Update base profile with phone number (since trigger might miss it)
        if (phone) {
            console.log('Updating profile phone number...');
            await supabaseAdmin
                .from('profiles')
                .update({ phone })
                .eq('id', authData.user.id);
        }

        // 4. Create role-specific profile
        if (role === 'teacher') {
            console.log('Creating/Updating teacher profile...');
            const { error: profileError } = await supabaseAdmin
                .from('teacher_profiles')
                .upsert({
                    user_id: authData.user.id,
                    subject: metadata?.subject,
                    bio: metadata?.bio || null,
                }, { onConflict: 'user_id' });

            if (profileError) {
                console.error('Teacher profile create error:', profileError);
                // Rollback user creation if profile fails
                await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
                return NextResponse.json({ error: profileError.message }, { status: 400 });
            }
        }

        return NextResponse.json({ success: true, user: authData.user });

    } catch (error: any) {
        console.error('Create user error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
