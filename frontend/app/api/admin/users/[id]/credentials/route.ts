import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        // 2. Get target user ID
        const { id: targetUserId } = await params;

        // 3. Fetch user data using admin client
        const supabaseAdmin = createAdminClient();
        const { data: targetUser, error: fetchError } = await supabaseAdmin.auth.admin.getUserById(targetUserId);

        if (fetchError || !targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 4. Extract temp password
        const tempPassword = targetUser.user.user_metadata?.temp_password || null;

        return NextResponse.json({
            email: targetUser.user.email,
            tempPassword
        });

    } catch (error: any) {
        console.error('Fetch credentials error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
