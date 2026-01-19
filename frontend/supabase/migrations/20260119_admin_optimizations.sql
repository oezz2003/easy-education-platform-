-- Function to get all admin stats in a single query
create or replace function get_admin_stats()
returns json
language plpgsql
security definer
as $$
declare
  total_students bigint;
  total_teachers bigint;
  total_courses bigint;
  active_batches bigint;
  today_sessions bigint;
  pending_invoices bigint;
  total_revenue numeric;
begin
  -- Get counts
  select count(*) into total_students from student_profiles;
  select count(*) into total_teachers from teacher_profiles;
  select count(*) into total_courses from courses where status = 'active';
  select count(*) into active_batches from batches where status = 'active';
  
  -- Get today's sessions
  select count(*) into today_sessions 
  from live_sessions 
  where session_date = current_date;
  
  -- Get pending invoices count
  select count(*) into pending_invoices 
  from invoices 
  where status = 'pending';
  
  -- Get total revenue (sum of paid invoices)
  select coalesce(sum(total_amount), 0) into total_revenue 
  from invoices 
  where status = 'paid';

  return json_build_object(
    'totalStudents', total_students,
    'totalTeachers', total_teachers,
    'totalCourses', total_courses,
    'activeBatches', active_batches,
    'todaySessions', today_sessions,
    'pendingInvoices', pending_invoices,
    'totalRevenue', total_revenue
  );
end;
$$;

-- Function to get monthly enrollments for a specific year
create or replace function get_monthly_enrollments(year_param int)
returns table (month int, count bigint)
language sql
security definer
as $$
  select 
    extract(month from enrolled_at)::int as month,
    count(*) as count
  from batch_enrollments
  where extract(year from enrolled_at) = year_param
  group by 1
  order by 1;
$$;

-- Function to get monthly revenue for a specific year
create or replace function get_monthly_revenue(year_param int)
returns table (month int, total numeric)
language sql
security definer
as $$
  select 
    extract(month from paid_at)::int as month,
    sum(total_amount) as total
  from invoices
  where status = 'paid' 
  and extract(year from paid_at) = year_param
  group by 1
  order by 1;
$$;
