'use client';

import { WizardProvider } from '@/lib/contexts/WizardContext';
import type { InstagramMedia } from '@/lib/facebook/types';
import type { ExportListItem } from '@/lib/instagramExport/types';
import WizardBottomNav from './WizardBottomNav';
import WizardShell from './WizardShell';
import WizardTracker from './WizardTracker';

interface GiveawayWizardClientProps {
  postId: string;
  postDetails: InstagramMedia;
  existingExports: ExportListItem[];
}

export default function GiveawayWizardClient({
  postId,
  postDetails,
  existingExports,
}: GiveawayWizardClientProps) {
  return (
    <WizardProvider postId={postId} postDetails={postDetails} existingExports={existingExports}>
      <WizardTracker />
      <WizardShell />
      <WizardBottomNav />
    </WizardProvider>
  );
}
