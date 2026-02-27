'use client';

import { motion } from 'framer-motion';
import { Instagram, Link, Trophy } from 'lucide-react';
import Section from '../ui/Section';

const steps = [
  {
    icon: Instagram,
    title: 'Увійдіть через Instagram',
    description: 'Авторизуйтесь бізнес-або creator-акаунтом у два кліки.',
    color: 'from-pink-500 to-purple-600',
  },
  {
    icon: Link,
    title: 'Обирайте пост',
    description: 'Виберіть пост із списку підвантажених публікацій',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Trophy,
    title: 'Отримайте переможця',
    description: 'Натисніть «Обрати» й одразу побачите чесний результат.',
    color: 'from-green-500 to-emerald-600',
  },
];

export default function HowItWorks() {
  return (
    <Section id="how-it-works" background="gray">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          Як це працює
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Три простих кроки до чесного розіграшу
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              {/* Step Number */}
              <div className="absolute -top-4 left-6">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
              </div>

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 mt-2`}
              >
                <step.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>

            {/* Connector line (except for last item) */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full absolute -right-1 -top-0.75"></div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
