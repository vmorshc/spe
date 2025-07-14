import { serverConfig } from '@/config/server';
import { FACEBOOK_GRAPH_API_BASE_URL } from './constants';
import type {
  FacebookErrorResponse,
  FacebookInstagramAccountDetails,
  FacebookPagesResponse,
  FacebookTokenResponse,
  InstagramAccountWithPageInfo,
  InstagramMediaResponse,
} from './types';

/**
 * Facebook API client for OAuth and Instagram Business API
 */
export class FacebookClient {
  private readonly baseURL = FACEBOOK_GRAPH_API_BASE_URL;
  private readonly clientId = serverConfig.FACEBOOK_APP_ID;
  private readonly clientSecret = serverConfig.FACEBOOK_APP_SECRET;
  private readonly redirectUri = serverConfig.FACEBOOK_REDIRECT_URI;

  /**
   * Exchange authorization code for short-lived access token
   */
  async exchangeCodeForToken(code: string): Promise<FacebookTokenResponse> {
    const url = `${this.baseURL}/oauth/access_token`;
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      code,
      grant_type: 'authorization_code',
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const errorData = (await response.json()) as FacebookErrorResponse;
      throw new Error(`Token exchange failed: ${errorData.error.message}`);
    }

    const tokenData = (await response.json()) as FacebookTokenResponse;
    console.log('Token exchange successful:', {
      tokenType: tokenData.token_type,
      expiresIn: tokenData.expires_in,
      accessTokenLength: tokenData.access_token.length,
    });

    return tokenData;
  }

  /**
   * Exchange short-lived token for long-lived token (60 days)
   */
  async getLongLivedToken(accessToken: string): Promise<FacebookTokenResponse> {
    const url = `${this.baseURL}/oauth/access_token`;
    const params = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      fb_exchange_token: accessToken,
    });

    const response = await fetch(`${url}?${params}`);

    if (!response.ok) {
      const errorData = (await response.json()) as FacebookErrorResponse;
      throw new Error(`Long-lived token exchange failed: ${errorData.error.message}`);
    }

    const tokenData = (await response.json()) as FacebookTokenResponse;
    console.log('Long-lived token exchange successful:', {
      tokenType: tokenData.token_type,
      expiresIn: tokenData.expires_in,
      accessTokenLength: tokenData.access_token.length,
    });

    return tokenData;
  }

  /**
   * Get user's Facebook Pages with Instagram Business Accounts
   */
  async getInstagramAccounts(accessToken: string): Promise<InstagramAccountWithPageInfo[]> {
    // First get all pages with Instagram business accounts
    const url = `${this.baseURL}/me/accounts`;
    const params = new URLSearchParams({
      fields: 'id,name,instagram_business_account',
      access_token: accessToken,
    });

    const urlWithParams = `${url}?${params.toString()}`;
    const response = await fetch(urlWithParams);

    if (!response.ok) {
      const errorData = (await response.json()) as FacebookErrorResponse;
      throw new Error(`Pages fetch failed: ${errorData.error.message}`);
    }

    const pagesData = (await response.json()) as FacebookPagesResponse;

    // Filter pages that have Instagram accounts
    const pagesWithInstagram = pagesData.data.filter((page) => page.instagram_business_account?.id);

    if (pagesWithInstagram.length === 0) {
      console.warn('No Instagram business accounts found');
      return [];
    }

    // Fetch detailed Instagram account info for each page
    const instagramAccounts: InstagramAccountWithPageInfo[] = [];

    for (const page of pagesWithInstagram) {
      try {
        const instagramId = page.instagram_business_account?.id;
        if (!instagramId) {
          continue;
        }
        const instagramDetails = await this.getInstagramAccountDetails(instagramId, accessToken);

        instagramAccounts.push({
          instagramId,
          username: instagramDetails.username,
          profilePicture: instagramDetails.profile_picture_url,
          followersCount: instagramDetails.followers_count,
          mediaCount: instagramDetails.media_count,
          pageId: page.id,
          pageName: page.name,
          pageAccessToken: page.access_token,
        });
      } catch (error) {
        console.error(`Failed to fetch Instagram details for page ${page.id}:`, error);
        // Continue with other accounts
      }
    }

    console.log(`Found ${instagramAccounts.length} Instagram business accounts`);
    return instagramAccounts;
  }

  /**
   * Get detailed Instagram account information
   */
  async getInstagramAccountDetails(
    instagramId: string,
    accessToken: string
  ): Promise<FacebookInstagramAccountDetails> {
    const url = `${this.baseURL}/${instagramId}`;

    const fields = 'id,username,name,followers_count,media_count,biography,profile_picture_url';

    const params = new URLSearchParams({
      fields,
      access_token: accessToken,
    });

    const response = await fetch(`${url}?${params}`);

    if (!response.ok) {
      const errorData = (await response.json()) as FacebookErrorResponse;
      throw new Error(`Instagram account fetch failed: ${errorData.error.message}`);
    }

    return (await response.json()) as FacebookInstagramAccountDetails;
  }

  /**
   * Get Instagram posts with pagination support
   */
  async getInstagramPosts(
    instagramId: string,
    accessToken: string,
    after?: string
  ): Promise<InstagramMediaResponse> {
    const url = `${this.baseURL}/${instagramId}/media`;
    const params = new URLSearchParams({
      fields:
        'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,comments_count,like_count',
      access_token: accessToken,
      limit: '12', // Fetch 12 posts at a time for 3-column grid
    });

    // Add cursor for pagination
    if (after) {
      params.set('after', after);
    }

    const response = await fetch(`${url}?${params}`);

    if (!response.ok) {
      const errorData = (await response.json()) as FacebookErrorResponse;
      throw new Error(`Instagram posts fetch failed: ${errorData.error.message}`);
    }

    const postsData = (await response.json()) as InstagramMediaResponse;
    return postsData;
  }
}

// Export singleton instance
export const facebookClient = new FacebookClient();
