import { Suspense } from 'react';
import ExportCommentsList from '@/components/instagram/ExportCommentsList';
import ExportsDropdown from '@/components/instagram/ExportsDropdown';
import PostDetailsComponent from '@/components/instagram/PostDetails';
import AppHeader from '@/components/ui/AppHeader';
import { getPostDetailsAction } from '@/lib/actions/instagram';
import { getExportAction } from '@/lib/actions/instagramExport';
import ActionBar from '../../components/ActionBar';
import ActionDrawer from '../../components/ActionDrawer';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ postId: string; exportId: string }>;
}

export default async function ExportPage({ params }: PageProps) {
  const { postId, exportId } = await params;
  const postDetails = await getPostDetailsAction(postId);
  const exportRecord = await getExportAction(exportId);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <AppHeader title="Деталі публікації" backUrl={`/app/instagram/posts/${postId}`} />

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
                <ExportCommentsList exportRecord={exportRecord} />
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
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between rounded-t-lg">
              <div className="text-sm text-gray-600">Коментарі (експорт)</div>
              <ExportsDropdown postId={postId} />
            </div>
            <ExportCommentsList exportRecord={exportRecord} />
          </div>
        </div>
      </div>

      {/* Action Components */}
      <div className="hidden md:block">
        <ActionBar postId={postId} mode="export" exportId={exportId} />
      </div>
      <div className="md:hidden">
        <ActionDrawer postId={postId} mode="export" exportId={exportId} />
      </div>
    </div>
  );
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
