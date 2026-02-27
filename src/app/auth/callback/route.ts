import { type NextRequest, NextResponse } from 'next/server';
import {
  clearOAuthState,
  clearRedirectUrl,
  getOAuthState,
  getRedirectUrl,
} from '@/lib/auth/session';
import { validateState } from '@/lib/auth/utils';
import { facebookClient } from '@/lib/facebook/client';
import { userRepository } from '@/lib/redis/repositories/users';
/**
 * Handle Facebook OAuth callback
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    console.log('OAuth callback received:', {
      code: code ? `${code.substring(0, 10)}...` : null,
      state: state ? `${state.substring(0, 10)}...` : null,
      error,
      errorDescription,
      allParams: Object.fromEntries(searchParams.entries()),
    });

    // Handle OAuth error
    if (error) {
      console.error('OAuth error:', { error, errorDescription });
      return NextResponse.redirect(
        new URL(
          `/auth/error?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`,
          request.url
        )
      );
    }

    // Check if code is present
    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect(new URL('/auth/error?error=missing_code', request.url));
    }

    // Check if state is present
    if (!state) {
      console.error('No state parameter received');
      return NextResponse.redirect(new URL('/auth/error?error=missing_state', request.url));
    }

    // Validate state parameter
    const storedState = await getOAuthState();
    if (!storedState || !validateState(state, storedState)) {
      console.error('Invalid state parameter:', {
        received: state ? `${state.substring(0, 10)}...` : null,
        stored: storedState ? `${storedState.substring(0, 10)}...` : null,
      });
      return NextResponse.redirect(new URL('/auth/error?error=invalid_state', request.url));
    }

    // Clear the OAuth state from session
    await clearOAuthState();

    console.log('OAuth callback validation successful:', {
      codeLength: code.length,
      stateValidated: true,
    });

    try {
      // Exchange code for short-lived access token
      const tokenResponse = await facebookClient.exchangeCodeForToken(code);

      // Get long-lived token
      const longLivedTokenResponse = await facebookClient.getLongLivedToken(
        tokenResponse.access_token
      );

      // Fetch Instagram accounts
      const instagramAccounts = await facebookClient.getInstagramAccounts(
        longLivedTokenResponse.access_token
      );

      if (instagramAccounts.length === 0) {
        console.warn('No Instagram business accounts found for user');
        return NextResponse.redirect(
          new URL(
            '/auth/error?error=no_instagram_accounts&description=No Instagram business accounts found',
            request.url
          )
        );
      }

      // Store temporary profile data in Redis
      const tempId = await userRepository.storeTempProfileData({
        profiles: instagramAccounts,
        longLivedToken: longLivedTokenResponse.access_token,
        redirectUrl: await getRedirectUrl(),
      });

      await clearRedirectUrl();

      // Redirect to profile selection page
      return NextResponse.redirect(
        new URL(
          `/auth/select-profile?tempId=${tempId}&login_status=success&accounts_count=${instagramAccounts.length}`,
          request.url
        )
      );
    } catch (error) {
      console.error('Token exchange or profile fetch failed:', error);
      return NextResponse.redirect(
        new URL(
          '/auth/error?error=token_exchange_failed&description=Failed to exchange token or fetch profiles',
          request.url
        )
      );
    }
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/auth/error?error=callback_error', request.url));
  }
}

/**
 * Handle POST requests (not expected for OAuth callback)
 */
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
