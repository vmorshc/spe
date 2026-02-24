import { Suspense } from 'react';
import GiveawayWizardClient from '@/components/giveaway/GiveawayWizardClient';
import { getPostDetailsAction } from '@/lib/actions/instagram';
import { listExportsByMediaAction } from '@/lib/actions/instagramExport';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ postId: string }>;
}

export default async function GiveawayWizardPage({ params }: PageProps) {
  const { postId } = await params;
  const postDetails = await getPostDetailsAction(postId);
  const existingExports = await listExportsByMediaAction(postId, 0, 10);

  return (
    <div className="h-full">
      <Suspense fallback={<WizardSkeleton />}>
        <GiveawayWizardClient
          postId={postId}
          postDetails={postDetails}
          existingExports={existingExports}
        />
      </Suspense>
    </div>
  );
}

function WizardSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-8">
        <div className="h-12 bg-muted rounded-lg w-3/4 mx-auto" />
        <div className="h-64 bg-muted rounded-lg" />
      </div>
    </div>
  );
}
