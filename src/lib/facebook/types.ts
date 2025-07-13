/**
 * Facebook API response types
 */

export interface FacebookTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export interface FacebookInstagramAccount {
  id: string;
  username: string;
  profile_picture_url: string;
  followers_count?: number;
  media_count?: number;
}

export interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  instagram_business_account?: {
    id: string;
  };
}

export interface FacebookPagesResponse {
  data: FacebookPage[];
  paging?: {
    next: string;
    previous: string;
  };
}

export interface FacebookErrorResponse {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
}

export interface FacebookInstagramAccountDetails {
  id: string;
  username: string;
  profile_picture_url: string;
  followers_count: number;
  media_count: number;
}

export interface InstagramAccountWithPageInfo {
  instagramId: string;
  username: string;
  profilePicture: string;
  followersCount: number;
  mediaCount: number;
  pageId: string;
  pageName: string;
  pageAccessToken: string;
}
