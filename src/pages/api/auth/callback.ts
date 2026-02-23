import type { APIRoute } from 'astro';
import { createSupabaseClient } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');

  const supabase = createSupabaseClient(request, cookies);

  if (tokenHash && type) {
    // Email confirmation flow (signup, recovery, etc.)
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as any });
    if (error) {
      return redirect('/login?error=auth_failed');
    }
  } else if (code) {
    // OAuth flow (Google, etc.)
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return redirect('/login?error=auth_failed');
    }
  } else {
    return redirect('/login?error=no_code');
  }

  // Route new users (no pet yet) to onboarding, set active_pet_id cookie for returning users
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: pets } = await supabase
      .from('pets')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (!pets?.length) {
      return redirect('/onboarding');
    }

    // Set the first pet as active if no cookie exists yet
    if (!cookies.get('active_pet_id')?.value) {
      cookies.set('active_pet_id', pets[0].id, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
        secure: import.meta.env.PROD,
      });
    }
  }

  return redirect('/dashboard');
};
