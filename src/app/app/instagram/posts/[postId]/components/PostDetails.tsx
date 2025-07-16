'use client';

import { format, formatDistanceToNow, isAfter, subDays } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Calendar, ExternalLink, Heart, MessageCircle, Play } from 'lucide-react';
import Image from 'next/image';
import type { InstagramMedia } from '@/lib/facebook/types';

interface PostDetailsProps {
  post: InstagramMedia;
}

export default function PostDetailsComponent({ post }: PostDetailsProps) {
  const isVideo = post.media_type === 'VIDEO' || post.media_type === 'REEL';
  const isCarousel = post.media_type === 'CAROUSEL_ALBUM';
  const imageUrl = isVideo && post.thumbnail_url ? post.thumbnail_url : post.media_url;

  const postDate = new Date(post.timestamp);
  const threeDaysAgo = subDays(new Date(), 3);

  const formattedDate = isAfter(postDate, threeDaysAgo)
    ? formatDistanceToNow(postDate, { addSuffix: true, locale: uk })
    : format(postDate, 'dd MMM yyyy, HH:mm', { locale: uk });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
      {/* Post Image */}
      <div className="relative flex-shrink-0">
        <div className="relative w-full md:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.caption || 'Instagram post'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 192px"
          />

          {/* Media type indicators */}
          {isVideo && (
            <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
              <Play className="w-4 h-4 text-white" fill="white" />
            </div>
          )}

          {isCarousel && (
            <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full ml-1"></div>
              </div>
            </div>
          )}
        </div>

        {/* External Link Button */}
        <a
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-2 shadow-sm hover:shadow-md transition-shadow"
          title="Відкрити в Instagram"
        >
          <ExternalLink className="w-4 h-4 text-gray-600" />
        </a>
      </div>

      {/* Post Details */}
      <div className="mt-6 space-y-4 flex-1 flex flex-col">
        {/* Stats */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="font-semibold text-gray-900">{post.like_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-gray-900">
              {post.comments_count.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Media Type */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Тип:</span>
          <span className="text-sm font-medium text-gray-900">
            {post.media_type === 'IMAGE' && 'Зображення'}
            {post.media_type === 'VIDEO' && 'Відео'}
            {post.media_type === 'REEL' && 'Reels'}
            {post.media_type === 'CAROUSEL_ALBUM' && 'Карусель'}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{formattedDate}</span>
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="flex-1 min-h-0">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Опис:</h3>
            <div className="overflow-auto max-h-40">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.caption}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
