import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session if exists
    const { data: { user } } = await supabase.auth.getUser();

    // Protect routes
    const protectedRoutes = ['/admin', '/teacher', '/student'];
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute && !user) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Role-based access control
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile) {
            const role = profile.role;
            const pathname = request.nextUrl.pathname;

            // Check role-specific routes
            if (pathname.startsWith('/admin') && role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url));
            }
            if (pathname.startsWith('/teacher') && role !== 'teacher' && role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url));
            }
            if (pathname.startsWith('/student') && role !== 'student' && role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url));
            }
        }
    }

    return supabaseResponse;
}
