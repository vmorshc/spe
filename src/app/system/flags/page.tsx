import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import FeatureFlagsClient from '@/components/system/FeatureFlagsClient';
import { getFeatureFlags } from '@/lib/featureFlags';
import { FEATURE_FLAG_DEFINITIONS } from '@/lib/featureFlags/constants';

export default async function SystemFlagsPage() {
  const currentFlags = await getFeatureFlags();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Системні прапорці функцій</h1>
              <p className="text-gray-600">
                Керуйте прапорцями функцій для цієї сесії. Зміни зберігаються автоматично та
                набувають чинності миттєво.
              </p>
            </div>

            <FeatureFlagsClient
              initialFlags={currentFlags}
              flagDefinitions={FEATURE_FLAG_DEFINITIONS}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
