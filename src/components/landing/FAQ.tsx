'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import Section from '../ui/Section';

const faqData = [
  {
    question: 'Чи це офіційно дозволено Instagram?',
    answer: 'Так. Ми використовуємо офіційний Graph API, тому робимо все в межах правил платформи.',
  },
  {
    question: 'Чи можна вибрати переможця, якщо під постом тисячі коментарів?',
    answer: 'Так, сервіс обробляє до 5 000 коментарів за раз. Для більших розіграшів додамо черги.',
  },
  {
    question: 'Як оплачуються розіграші?',
    answer:
      'Оплата відбувається через plata by mono після підтвердження результату. Ви платите лише тоді, коли дійсно провели розіграш.',
  },
  {
    question: 'Чи зберігаються мої дані?',
    answer:
      'Ні, ми не збираємо й не продаємо особисті дані. Коментарі зберігаються максимум 24 години для проведення розіграшу, після чого автоматично видаляються.',
  },
  {
    question: 'Чи можу я перевірити справедливість результату?',
    answer:
      'Так, ми використовуємо crypto-safe RNG алгоритм. Також плануємо впровадити публічний сертифікат прозорості для додаткової перевірки.',
  },
  {
    question: 'Які типи акаунтів можуть використовувати сервіс?',
    answer:
      'Сервіс працює з бізнес-акаунтами та creator-акаунтами в Instagram. Особистий акаунт не дає доступу до необхідних API.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq" background="white">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          Часті питання
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Відповіді на найпоширеніші запитання про наш сервіс
        </motion.p>
      </div>

      <div className="max-w-3xl mx-auto">
        {faqData.map((faq, index) => (
          <motion.div
            key={faq.question}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="mb-4"
          >
            <button
              type="button"
              onClick={() => toggleFAQ(index)}
              className="w-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 text-left border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-gray-100 mt-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Contact Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-16 text-center"
      >
        <div className="bg-blue-50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Не знайшли відповідь на своє питання?
          </h3>
          <p className="text-gray-600 mb-6">Наша команда підтримки готова допомогти вам 24/7</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://t.me/pickly_support"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Telegram підтримка
            </a>
            <a
              href="mailto:hello@pickly.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              ✉️ Email підтримка
            </a>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
