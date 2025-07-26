'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { incrementLandingVisits } from '@/lib/actions/counters';
import Button from '../ui/Button';
import Section from '../ui/Section';

interface HeroClientProps {
  initialVisitCount: number;
}

export default function HeroClient({ initialVisitCount }: HeroClientProps) {
  const [visitCount, setVisitCount] = useState<number>(initialVisitCount);
  const [isIncrementing, setIsIncrementing] = useState<boolean>(false);
  const router = useRouter();

  // Increment counter after component mounts
  useEffect(() => {
    const incrementVisit = async () => {
      try {
        setIsIncrementing(true);
        const newCount = await incrementLandingVisits();
        setVisitCount(newCount);
      } catch (error) {
        console.error('Failed to increment visit count:', error);
      } finally {
        setIsIncrementing(false);
      }
    };

    // Small delay to show the initial count first
    const timeoutId = setTimeout(incrementVisit, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleStartGiveaway = () => {
    router.push('/app/instagram/posts');
  };

  return (
    <Section className="pt-8 lg:pt-16" background="white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Обери переможця <span className="text-blue-600">чесно</span> — за хвилину, без сумнівів
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
          >
            Наш сервіс автоматично завантажує коментарі, обирає випадкового переможця й одразу
            показує результат. Ніяких екселів, скріншотів і підозрілих «рандомайзерів» — лише
            прозорий процес.
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mb-8 text-sm text-gray-600"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Офіційний Instagram API</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Безпечний алгоритм</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>За хвилину готово</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Button
              size="lg"
              variant="primary"
              className="text-lg px-8 py-4"
              onClick={handleStartGiveaway}
            >
              Почати розіграш
            </Button>
            {/* <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 flex items-center justify-center space-x-2"
              onClick={() => console.log('Watch demo')}
            >
              <Play className="w-5 h-5" />
              <span>Дивитись демо</span>
            </Button> */}
          </motion.div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Pickly</h3>
                  <p className="text-sm text-gray-500">Чесний розіграш</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Завантажено 1,247 коментарів</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Алгоритм обрано переможця</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Результат готовий</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg text-center">
                <p className="text-sm opacity-90">Переможець</p>
                <p className="font-bold text-lg">@username_winner</p>
                <p className="text-sm opacity-90">
                  {isIncrementing ? 'Оновлення...' : `Відвідування #${visitCount}`}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
