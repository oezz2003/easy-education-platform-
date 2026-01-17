import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { invited_students, ...sessionData } = body;

        // Initialize Supabase Admin Client
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // 1. Create the session
        const { data: session, error: sessionError } = await supabaseAdmin
            .from('live_sessions')
            .insert(sessionData)
            .select()
            .single();

        if (sessionError) {
            console.error('Error creating session:', sessionError);
            return NextResponse.json({ error: sessionError.message }, { status: 400 });
        }

        // 2. Add invited students to attendance
        if (invited_students && invited_students.length > 0) {
            const attendanceRecords = invited_students.map((studentId: string) => ({
                session_id: session.id,
                student_id: studentId,
                status: 'absent',
                duration_minutes: 0,
                participation_score: 0
            }));

            const { error: attendanceError } = await supabaseAdmin
                .from('attendance')
                .insert(attendanceRecords);

            if (attendanceError) {
                console.error('Error adding invited students:', attendanceError);
                // We return the session but warn about attendance
                return NextResponse.json({
                    data: session,
                    warning: 'Session created but failed to invite students: ' + attendanceError.message
                });
            }
        }

        return NextResponse.json({ data: session });

    } catch (error: any) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
