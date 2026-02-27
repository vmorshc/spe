'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import UserProfile from '@/components/auth/UserProfile';

export default function GiveawayHeader() {
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Site name */}
          <div className="">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <span className="text-lg font-bold text-gray-900">pickly.com.ua</span>
            </button>
          </div>

          {/* Center: Lying character logo */}
          <div className="max-h-auto">
            <Image
              src="/images/pickly_character/pickly_lying.png"
              alt="Pickly"
              width={352}
              height={150}
              className="max-h-20 w-auto"
              priority
            />
          </div>

          {/* Right: User profile */}
          <div className="">
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
}
