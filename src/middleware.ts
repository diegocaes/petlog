import { defineMiddleware } from 'astro:middleware';
import { createSupabaseClient } from './lib/supabase';

const PUBLIC_ROUTES = ['/login', '/api/auth/callback'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return next();
  }

  // Allow static assets and PWA files
  if (
    pathname.startsWith('/_') ||
    pathname.startsWith('/icons/') ||
    pathname === '/manifest.json' ||
    pathname === '/sw.js'
  ) {
    return next();
  }

  const supabase = createSupabaseClient(context.request, context.cookies);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return context.redirect('/login');
  }

  // Store user and supabase client in locals for downstream use
  context.locals.user = user;
  context.locals.supabase = supabase;

  return next();
});
