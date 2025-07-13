'use client';

import { Image, Instagram, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Section from '@/components/ui/Section';
import { getTempProfileData, selectInstagramProfile } from '@/lib/actions/auth';
import { useAuth } from '@/lib/contexts/AuthContext';

interface ProfileData {
  instagramId: string;
  username: string;
  profilePicture: string;
  followersCount: number;
  mediaCount: number;
  pageId: string;
  pageName: string;
  pageAccessToken: string;
}

function SelectProfileContent() {
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshAuth } = useAuth();

  useEffect(() => {
    const tempId = searchParams.get('tempId');
    if (!tempId) {
      setError('Відсутній ідентифікатор сесії');
      setLoading(false);
      return;
    }

    getTempProfileData(tempId)
      .then((data: any) => {
        if (!data) {
          setError('Дані сесії не знайдено або застарілі');
          return;
        }
        setProfiles(data.profiles);
      })
      .catch((err: any) => {
        console.error('Failed to load profiles:', err);
        setError('Не вдалося завантажити профілі');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  const handleSelectProfile = async (pageId: string) => {
    setSelecting(pageId);
    try {
      const tempId = searchParams.get('tempId');
      if (!tempId) {
        throw new Error('Відсутній ідентифікатор сесії');
      }
      await selectInstagramProfile(tempId, pageId);
      // Refresh auth state so Header shows correct state
      await refreshAuth();
      router.push('/');
    } catch (err) {
      console.error('Profile selection failed:', err);
      setError('Не вдалося вибрати профіль');
    } finally {
      setSelecting(null);
    }
  };

  if (loading) {
    return (
      <Section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Завантаження профілів...</p>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Instagram className="w-16 h-16 mx-auto mb-2" />
            <h2 className="text-xl font-semibold">Помилка</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/')}>Повернутися на головну</Button>
        </div>
      </Section>
    );
  }

  if (profiles.length === 0) {
    return (
      <Section className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-orange-500 mb-4">
            <Instagram className="w-16 h-16 mx-auto mb-2" />
            <h2 className="text-xl font-semibold">Немає бізнес-акаунтів Instagram</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Щоб використовувати Sure Pick Engine, вам потрібен бізнес-акаунт Instagram, підключений
            до сторінки Facebook.
          </p>
          <div className="text-sm text-gray-500 mb-6">
            <p className="mb-2">Для налаштування:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Створіть або перетворіть акаунт Instagram на бізнес-акаунт</li>
              <li>Підключіть його до сторінки Facebook</li>
              <li>Переконайтеся, що у вас є права адміністратора</li>
            </ol>
          </div>
          <Button onClick={() => router.push('/')}>Повернутися на головну</Button>
        </div>
      </Section>
    );
  }

  return (
    <Section className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Оберіть Instagram профіль</h1>
          <p className="text-gray-600">
            Виберіть акаунт Instagram, який хочете використовувати з Sure Pick Engine
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile.instagramId}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={profile.profilePicture}
                    alt={profile.username}
                    className="w-12 h-12 rounded-full mr-4"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/48/48';
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">@{profile.username}</h3>
                    <p className="text-sm text-gray-600">{profile.pageName}</p>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{profile.followersCount.toLocaleString()} підписників</span>
                  </div>
                  <div className="flex items-center">
                    <Image className="w-4 h-4 mr-1" />
                    <span>{profile.mediaCount.toLocaleString()} постів</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleSelectProfile(profile.pageId)}
                  disabled={selecting === profile.pageId}
                  className="w-full"
                >
                  {selecting === profile.pageId ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Вибираю...
                    </div>
                  ) : (
                    'Вибрати цей профіль'
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => router.push('/')}>
            Скасувати
          </Button>
        </div>
      </div>
    </Section>
  );
}

function SelectProfileLoading() {
  return (
    <Section className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Завантаження профілів...</p>
      </div>
    </Section>
  );
}

export default function SelectProfilePage() {
  return (
    <Suspense fallback={<SelectProfileLoading />}>
      <SelectProfileContent />
    </Suspense>
  );
}
