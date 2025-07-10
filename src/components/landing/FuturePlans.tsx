'use client';

import { motion } from 'framer-motion';
import { FileText, Filter, Globe, Package } from 'lucide-react';
import Section from '../ui/Section';

const futurePlans = [
  {
    icon: Filter,
    title: 'Розширені фільтри',
    description: 'Фільтри за @mention, ключовими словами та підпискою.',
    color: 'bg-blue-100 text-blue-600',
    timeline: 'Q1 2024',
  },
  {
    icon: FileText,
    title: 'PDF-сертифікат',
    description: 'PDF-сертифікат результату з хеш-підписом.',
    color: 'bg-green-100 text-green-600',
    timeline: 'Q2 2024',
  },
  {
    icon: Package,
    title: 'Пакетні тарифи',
    description: 'Пакетні тарифи для агенцій та частих розіграшів.',
    color: 'bg-purple-100 text-purple-600',
    timeline: 'Q2 2024',
  },
  {
    icon: Globe,
    title: 'Міжнародна підтримка',
    description: 'Інтерфейс англійською та польською; додаткові платіжні шлюзи.',
    color: 'bg-orange-100 text-orange-600',
    timeline: 'Q3 2024',
  },
];

export default function FuturePlans() {
  return (
    <Section id="future-plans" background="blue">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          Плани на майбутнє
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Ми постійно розвиваємося, щоб зробити розіграші ще зручнішими
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {futurePlans.map((plan, index) => (
          <motion.div
            key={plan.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden"
          >
            {/* Timeline Badge */}
            <div className="absolute top-4 right-4">
              <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                {plan.timeline}
              </span>
            </div>

            <div
              className={`w-12 h-12 rounded-lg ${plan.color} flex items-center justify-center mb-4`}
            >
              <plan.icon className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">{plan.title}</h3>

            <p className="text-gray-600 leading-relaxed">{plan.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-16 text-center"
      >
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Хочете першими дізнатися про нові функції?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Підписуйтесь на наші оновлення, щоб отримувати повідомлення про нові можливості та
            покращення сервісу.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Введіть вашу email адресу"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1"
            />
            <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Підписатися
            </button>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
