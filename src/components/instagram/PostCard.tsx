import { Heart, MessageCircle, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { InstagramMedia } from '@/lib/facebook/types';

interface PostCardProps {
  post: InstagramMedia;
}

export default function PostCard({ post }: PostCardProps) {
  const isVideo = post.media_type === 'VIDEO' || post.media_type === 'REEL';
  const isCarousel = post.media_type === 'CAROUSEL_ALBUM';

  // Use thumbnail_url for videos, media_url for images
  const imageUrl = isVideo && post.thumbnail_url ? post.thumbnail_url : post.media_url;

  return (
    <Link
      href={`/app/instagram/posts/${post.id}`}
      className="group relative aspect-square block overflow-hidden bg-gray-100"
    >
      <div className="relative w-full h-full">
        <Image
          src={imageUrl}
          alt={post.caption || 'Instagram post'}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
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

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-300 flex items-center justify-center">
          <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-6">
            <div className="flex items-center">
              <Heart className="w-6 h-6 mr-2" fill="white" />
              <span className="font-semibold">{post.like_count ?? 0}</span>
            </div>

            <div className="flex items-center">
              <MessageCircle className="w-6 h-6 mr-2" fill="white" />
              <span className="font-semibold">{post.comments_count ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
