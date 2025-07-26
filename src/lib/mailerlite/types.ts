/**
 * MailerLite API types based on official documentation
 */

export interface MailerLiteSubscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed' | 'unconfirmed' | 'bounced' | 'junk';
  source: string;
  sent: number;
  opens_count: number;
  clicks_count: number;
  open_rate: number;
  click_rate: number;
  ip_address: string | null;
  subscribed_at: string;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
  fields: Record<string, string | null>;
  groups: string[];
  opted_in_at: string | null;
  optin_ip: string | null;
}

export interface MailerLiteSubscriberResponse {
  data: MailerLiteSubscriber;
}

export interface MailerLiteErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface MailerLiteGroup {
  id: string;
  name: string;
  active_count: number;
  created_at: string;
}

export interface CreateSubscriberRequest {
  email: string;
  fields?: Record<string, string>;
  groups?: string[];
  status?: 'active' | 'unsubscribed' | 'unconfirmed' | 'bounced' | 'junk';
  subscribed_at?: string;
  ip_address?: string;
  opted_in_at?: string;
  optin_ip?: string;
  unsubscribed_at?: string;
}
