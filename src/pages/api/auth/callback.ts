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

  // Route new users (no pet yet) to onboarding
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: pet } = await supabase
      .from('pets')
      .select('id')
      .eq('user_id', user.id)
      .single();
    if (!pet) {
      return redirect('/onboarding');
    }
  }

  return redirect('/dashboard');
};
