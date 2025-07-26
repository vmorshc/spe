import { serverConfig } from '@/config/server';
import { MAILERLITE_API_BASE_URL } from './constants';
import type {
  CreateSubscriberRequest,
  MailerLiteErrorResponse,
  MailerLiteSubscriberResponse,
} from './types';

/**
 * MailerLite API client for subscriber management
 */
export class MailerLiteClient {
  private readonly baseURL = MAILERLITE_API_BASE_URL;
  private readonly apiKey = serverConfig.MAILERLITE_API_KEY;
  private readonly defaultGroupId = serverConfig.MAILERLITE_GROUP_ID;

  /**
   * Get HTTP headers for MailerLite API requests
   */
  private get headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  /**
   * Create or update a subscriber and add them to the specified group
   */
  async createOrUpdateSubscriber(
    email: string,
    fields?: Record<string, string>,
    groupIds: string[] = [this.defaultGroupId]
  ): Promise<MailerLiteSubscriberResponse> {
    const url = `${this.baseURL}/subscribers`;

    const requestBody: CreateSubscriberRequest = {
      email,
      fields,
      groups: groupIds,
      status: 'active',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as MailerLiteErrorResponse;
      throw new Error(`MailerLite subscriber creation failed: ${errorData.message}`);
    }

    const subscriberData = (await response.json()) as MailerLiteSubscriberResponse;

    console.log('MailerLite subscriber operation successful:', {
      email,
      subscriberId: subscriberData.data.id,
      status: subscriberData.data.status,
      groupsCount: groupIds.length,
    });

    return subscriberData;
  }

  /**
   * Add an existing subscriber to a specific group
   */
  async addSubscriberToGroup(
    subscriberIdOrEmail: string,
    groupId: string = this.defaultGroupId
  ): Promise<void> {
    const url = `${this.baseURL}/subscribers/${subscriberIdOrEmail}/groups/${groupId}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
    });

    if (!response.ok) {
      const errorData = (await response.json()) as MailerLiteErrorResponse;
      throw new Error(`MailerLite group assignment failed: ${errorData.message}`);
    }

    console.log('MailerLite group assignment successful:', {
      subscriber: subscriberIdOrEmail,
      groupId,
    });
  }
}

// Export singleton instance
export const mailerLiteClient = new MailerLiteClient();
