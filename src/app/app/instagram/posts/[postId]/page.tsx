import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import AppHeader from '@/components/ui/AppHeader';
import { getPostDetailsAction } from '@/lib/actions/instagram';
import ActionBar from './components/ActionBar';
import ActionDrawer from './components/ActionDrawer';
import CommentsList from './components/CommentsList';
import PostDetailsComponent from './components/PostDetails';

// Force dynamic rendering since this page uses cookies for authentication
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    postId: string;
  }>;
}

export default async function PostDetailPage({ params }: PageProps) {
  const { postId } = await params;

  try {
    // Fetch post details
    const postDetails = await getPostDetailsAction(postId);

    if (!postDetails) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <AppHeader title="Деталі публікації" backUrl="/app/instagram/posts" />

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
              <div className="lg:col-span-1 flex">
                <div className="w-full">
                  <Suspense fallback={<PostDetailsSkeleton />}>
                    <PostDetailsComponent post={postDetails} />
                  </Suspense>
                </div>
              </div>
              <div className="lg:col-span-2 flex">
                <div className="w-full">
                  <Suspense fallback={<CommentsListSkeleton />}>
                    <CommentsList post={postDetails} />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="space-y-6">
              <Suspense fallback={<PostDetailsSkeleton />}>
                <PostDetailsComponent post={postDetails} />
              </Suspense>
              <Suspense fallback={<CommentsListSkeleton />}>
                <CommentsList post={postDetails} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Action Components */}
        <div className="hidden md:block">
          <ActionBar postId={postId} />
        </div>
        <div className="md:hidden">
          <ActionDrawer postId={postId} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading post details:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Помилка завантаження</h1>
          <p className="text-gray-600 mb-4">Сталася помилка при завантаженні деталей публікації</p>
          <a
            href="/app/instagram/posts"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Повернутися до постів
          </a>
        </div>
      </div>
    );
  }
}

function PostDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-48 h-48 bg-gray-200 rounded-lg mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

function CommentsListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={`skeleton-comment-${i}-${Date.now()}`} className="animate-pulse">
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { postId } = await params;

  try {
    const postDetails = await getPostDetailsAction(postId);

    return {
      title: 'Деталі публікації',
      description: postDetails.caption || 'Деталі Instagram публікації',
      robots: { index: false, follow: false },
    };
  } catch (_error) {
    return {
      title: 'Деталі публікації',
      description: 'Деталі Instagram публікації',
      robots: { index: false, follow: false },
    };
  }
}
