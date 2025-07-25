'use client';

import { motion } from 'framer-motion';
import { DollarSign, FileText, Globe, Monitor, Shield } from 'lucide-react';
import Section from '../ui/Section';

const trustReasons = [
  {
    icon: Shield,
    title: 'Crypto-safe RNG',
    description: 'Випадковий вибір здійснюється прозоро та перевірено (crypto-safe RNG).',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Globe,
    title: 'Офіційний API',
    description: 'Працюємо лише з офіційним Instagram Graph API.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Shield,
    title: 'Конфіденційність',
    description:
      'Не збираємо й не продаємо особисті дані; коментарі зберігаються максимум 24 години.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: FileText,
    title: 'Сертифікат прозорості',
    description: 'Плануємо публічний сертифікат прозорості, щоб кожен міг перевірити результат.',
    color: 'bg-orange-100 text-orange-600',
  },
];

const benefits = [
  {
    icon: Monitor,
    title: 'Просто',
    description: 'Вставте URL, натисніть кнопку, отримайте результат.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Globe,
    title: 'Українська локалізація',
    description: 'Усе інтерфейсом і підтримкою рідною мовою.',
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    icon: DollarSign,
    title: 'Низька ціна',
    description: 'Сплачуєте лише за проведений розіграш, без підписок.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Monitor,
    title: 'Нічого не встановлюйте',
    description: 'Сервіс працює повністю онлайн.',
    color: 'bg-purple-100 text-purple-600',
  },
];

export default function Benefits() {
  return (
    <>
      {/* Why Trust Us Section */}
      <Section id="trust" background="white">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Чому нам довіряють
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Наші принципи прозорості та безпеки
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trustReasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div
                className={`w-12 h-12 rounded-lg ${reason.color} flex items-center justify-center mb-4`}
              >
                <reason.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{reason.title}</h3>
              <p className="text-gray-600 leading-relaxed">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Benefits Section */}
      <Section id="benefits" background="gray">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Переваги
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Чому вибирають Pickly
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div
                className={`w-12 h-12 rounded-lg ${benefit.color} flex items-center justify-center mx-auto mb-4`}
              >
                <benefit.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  );
}
