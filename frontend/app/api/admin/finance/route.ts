import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, ...data } = body;

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

        if (action === 'create_transaction') {
            const receiptNumber = `REC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString().slice(2, 6)}`;

            const { data: transaction, error } = await supabaseAdmin
                .from('transactions')
                .insert({
                    receipt_number: receiptNumber,
                    status: 'pending',
                    ...data,
                })
                .select()
                .single();

            if (error) throw error;
            return NextResponse.json({ data: transaction });
        }

        if (action === 'complete_transaction') {
            const { id } = data;
            const { data: transaction, error } = await supabaseAdmin
                .from('transactions')
                .update({
                    status: 'completed',
                    paid_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return NextResponse.json({ data: transaction });
        }

        if (action === 'refund_transaction') {
            const { id, amount } = data;

            // Get original transaction
            const { data: original, error: fetchError } = await supabaseAdmin
                .from('transactions')
                .select('*')
                .eq('id', id)
                .single();

            if (fetchError || !original) throw new Error('Transaction not found');

            // Create refund transaction
            const { data: refund, error: refundError } = await supabaseAdmin
                .from('transactions')
                .insert({
                    student_id: original.student_id,
                    batch_id: original.batch_id,
                    course_id: original.course_id,
                    amount: amount || original.amount,
                    type: 'refund',
                    status: 'completed',
                    notes: `Refund for transaction ${original.receipt_number}`,
                    paid_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (refundError) throw refundError;

            // Update original transaction status
            await supabaseAdmin
                .from('transactions')
                .update({ status: 'refunded' })
                .eq('id', id);

            return NextResponse.json({ data: refund });
        }

        // Salary Operations
        if (action === 'generate_salary') {
            const { teacherId, month, year } = data;

            // Calculate session earnings
            const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
            const endDate = new Date(year, month, 0).toISOString().split('T')[0];

            const { data: sessions, error: sessionsError } = await supabaseAdmin
                .from('live_sessions')
                .select('id, teacher_id')
                .eq('teacher_id', teacherId)
                .eq('status', 'completed')
                .gte('session_date', startDate)
                .lte('session_date', endDate);

            if (sessionsError) throw sessionsError;

            // Note: Course revenue calculation is skipped for now.
            // Courses are linked to teachers via batches, not directly.
            // This would require a more complex join through batch_enrollments.
            const courses: any[] = [];

            // Get teacher hourly rate
            const { data: teacher } = await supabaseAdmin
                .from('teacher_profiles')
                .select('hourly_rate')
                .eq('id', teacherId)
                .single();

            const hourlyRate = teacher?.hourly_rate || 100;
            const sessionCount = sessions?.length || 0;
            const sessionEarnings = sessionCount * hourlyRate;

            // Simple course revenue calculation (e.g., 10% of course price for each active course - placeholder)
            // This should ideally be based on enrollments/transactions
            const courseRevenue = courses?.reduce((acc, course) => acc + (course.price * 0.1), 0) || 0;

            // Create/Update salary record
            const { data: salary, error: salaryError } = await supabaseAdmin
                .from('teacher_salaries')
                .upsert({
                    teacher_id: teacherId,
                    month,
                    year,
                    sessions_count: sessionCount,
                    session_earnings: sessionEarnings,
                    total_amount: sessionEarnings + courseRevenue,
                    status: 'pending',
                }, {
                    onConflict: 'teacher_id,month,year'
                })
                .select()
                .single();

            if (salaryError) throw salaryError;

            // Create salary items
            // First delete existing items to avoid duplicates if regenerating
            await supabaseAdmin
                .from('salary_items')
                .delete()
                .eq('salary_id', salary.id);

            const items = [];

            if (sessions && sessions.length > 0) {
                items.push(...sessions.map((session: { id: string }) => ({
                    salary_id: salary.id,
                    description: 'Session payment',
                    type: 'session',
                    amount: hourlyRate,
                    session_id: session.id,
                })));
            }

            if (courses && courses.length > 0) {
                items.push({
                    salary_id: salary.id,
                    description: 'Course Revenue Share',
                    type: 'course_revenue', // Ensure this type exists in DB enum or use 'bonus'
                    amount: courseRevenue,
                });
            }

            if (items.length > 0) {
                const { error: itemsError } = await supabaseAdmin
                    .from('salary_items')
                    .insert(items);

                if (itemsError) throw itemsError;
            }

            return NextResponse.json({ data: salary });
        }

        if (action === 'create_salary') {
            const { teacher_id, month, year, session_earnings, sessions_count, total_amount, items, notes } = data;

            // Create/Update salary record
            const { data: salary, error: salaryError } = await supabaseAdmin
                .from('teacher_salaries')
                .upsert({
                    teacher_id,
                    month,
                    year,
                    sessions_count,
                    session_earnings,
                    total_amount,
                    notes,
                    status: 'pending',
                }, {
                    onConflict: 'teacher_id,month,year'
                })
                .select()
                .single();

            if (salaryError) throw salaryError;

            // Create salary items
            if (items && items.length > 0) {
                // Delete existing items first
                await supabaseAdmin
                    .from('salary_items')
                    .delete()
                    .eq('salary_id', salary.id);

                const salaryItems = items.map((item: any) => ({
                    salary_id: salary.id,
                    ...item
                }));

                const { error: itemsError } = await supabaseAdmin
                    .from('salary_items')
                    .insert(salaryItems);

                if (itemsError) throw itemsError;
            }

            return NextResponse.json({ data: salary });
        }

        if (action === 'pay_salary') {
            const { id, paymentMethod, paymentReference } = data;
            const { data: salary, error } = await supabaseAdmin
                .from('teacher_salaries')
                .update({
                    status: 'paid',
                    paid_at: new Date().toISOString(),
                    payment_method: paymentMethod,
                    payment_reference: paymentReference,
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return NextResponse.json({ data: salary });
        }

        if (action === 'add_bonus' || action === 'add_deduction') {
            const { id, amount, description } = data;
            const type = action === 'add_bonus' ? 'bonus' : 'deduction';
            const signedAmount = action === 'add_bonus' ? amount : -amount;

            // Add item
            const { error: itemError } = await supabaseAdmin
                .from('salary_items')
                .insert({
                    salary_id: id,
                    description,
                    type,
                    amount: signedAmount,
                });

            if (itemError) throw itemError;

            // Update total
            // We need to fetch current salary to update totals correctly
            const { data: currentSalary, error: fetchError } = await supabaseAdmin
                .from('teacher_salaries')
                .select('*')
                .eq('id', id)
                .single();

            if (fetchError) throw fetchError;

            const newTotal = (currentSalary.total_amount || 0) + signedAmount;
            const newBonus = type === 'bonus' ? (currentSalary.bonus || 0) + amount : (currentSalary.bonus || 0);
            const newDeductions = type === 'deduction' ? (currentSalary.deductions || 0) + amount : (currentSalary.deductions || 0);

            const { data: updatedSalary, error: updateError } = await supabaseAdmin
                .from('teacher_salaries')
                .update({
                    total_amount: newTotal,
                    bonus: newBonus,
                    deductions: newDeductions
                })
                .eq('id', id)
                .select()
                .single();

            if (updateError) throw updateError;
            if (updateError) throw updateError;
            return NextResponse.json({ data: updatedSalary });
        }

        if (action === 'create_invoice') {
            const { teacher_id, period_start, period_end, subtotal, custom_amount, total_amount, notes, items } = data;
            const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString().slice(2, 6)}`;

            // Create Invoice
            const { data: invoice, error: invoiceError } = await supabaseAdmin
                .from('invoices')
                .insert({
                    invoice_number: invoiceNumber,
                    teacher_id,
                    period_start,
                    period_end,
                    subtotal,
                    custom_amount,
                    total_amount,
                    notes,
                    status: 'pending',
                })
                .select()
                .single();

            if (invoiceError) throw invoiceError;

            // Create Invoice Items
            if (items && items.length > 0) {
                const invoiceItems = items.map((item: any) => ({
                    invoice_id: invoice.id,
                    ...item
                }));

                const { error: itemsError } = await supabaseAdmin
                    .from('invoice_items')
                    .insert(invoiceItems);

                if (itemsError) throw itemsError;
            }

            return NextResponse.json({ data: invoice });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        console.error('Finance API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
