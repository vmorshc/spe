import { Suspense } from 'react';
import InstagramHeader from '@/components/instagram/InstagramHeader';
import PostsGrid from '@/components/instagram/PostsGrid';
import ProfileHeader from '@/components/instagram/ProfileHeader';
import { getInstagramPosts, getInstagramProfile } from '@/lib/actions/instagram';

export default async function InstagramPostsPage() {
  // User is authenticated (handled by layout), fetch Instagram data
  try {
    // Fetch initial data in parallel
    const [profile, postsData] = await Promise.all([getInstagramProfile(), getInstagramPosts()]);

    if (!profile) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Не вдалося завантажити Instagram профіль
            </h1>
            <p className="text-gray-600">Спробуйте оновити сторінку</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <InstagramHeader />

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-4xl">
              <Suspense fallback={<ProfileHeaderSkeleton />}>
                <ProfileHeader profile={profile} />
              </Suspense>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <div className="border-b border-gray-200 mb-8">
                <nav className="flex justify-center space-x-16">
                  <button
                    type="button"
                    className="py-3 px-1 border-b-2 border-gray-900 text-sm font-medium text-gray-900 tracking-wide"
                  >
                    ПУБЛІКАЦІЇ
                  </button>
                  <button
                    type="button"
                    className="py-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-400 hover:text-gray-600 cursor-not-allowed tracking-wide"
                    disabled
                  >
                    REELS
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Незабаром
                    </span>
                  </button>
                </nav>
              </div>

              <Suspense fallback={<PostsGridSkeleton />}>
                <PostsGrid
                  initialPosts={postsData.posts}
                  initialNextCursor={postsData.nextCursor}
                  initialHasMore={postsData.hasMore}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading Instagram data:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Помилка завантаження</h1>
          <p className="text-gray-600">Сталася помилка при завантаженні ваших Instagram даних</p>
        </div>
      </div>
    );
  }
}

function ProfileHeaderSkeleton() {
  return (
    <div className="p-6">
      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="flex space-x-8">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostsGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-1">
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={`skeleton-post-${i}-${Date.now()}`}
          className="aspect-square bg-gray-200 animate-pulse"
        ></div>
      ))}
    </div>
  );
}

export const metadata = {
  title: 'Instagram Posts | SPE',
  description: 'Select posts for your Instagram giveaway',
};
