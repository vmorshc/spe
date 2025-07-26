'use client';

import { motion } from 'framer-motion';
import { FileText, Filter, Globe, Package } from 'lucide-react';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { type NewsletterSubscriptionResult, subscribeToUpdates } from '@/lib/actions/newsletter';
import { BOT_PREVENTION } from '@/lib/constants/botPrevention';
import Section from '../ui/Section';

const futurePlans = [
  {
    icon: Filter,
    title: 'Розширені фільтри',
    description: 'Фільтри за @mention, ключовими словами та підпискою.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: FileText,
    title: 'PDF-сертифікат',
    description: 'PDF-сертифікат результату з хеш-підписом.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Package,
    title: 'Пакетні тарифи',
    description: 'Пакетні тарифи для агенцій та частих розіграшів.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Globe,
    title: 'Міжнародна підтримка',
    description: 'Інтерфейс англійською та польською; додаткові платіжні шлюзи.',
    color: 'bg-orange-100 text-orange-600',
  },
];

type FormData = {
  email: string;
  [BOT_PREVENTION.HONEYPOT_FIELD_NAME]: string;
  formTimestamp: string;
};

export default function FuturePlans() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formTimestamp] = useState(() => Date.now().toString());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      [BOT_PREVENTION.HONEYPOT_FIELD_NAME]: '',
      formTimestamp,
    },
  });

  // Clear message after 5 seconds
  const clearMessage = useCallback(() => {
    const timeoutId = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(timeoutId);
  }, []);

  // Clear messages when form state changes
  useEffect(() => {
    if (message) {
      clearMessage();
    }
  }, [message, clearMessage]);

  const onSubmit: SubmitHandler<FormData> = useCallback(
    (data) => {
      startTransition(async () => {
        try {
          clearErrors();

          // Create FormData from the validated form data
          const formData = new FormData();
          formData.append('email', data.email);
          formData.append(
            BOT_PREVENTION.HONEYPOT_FIELD_NAME,
            data[BOT_PREVENTION.HONEYPOT_FIELD_NAME]
          );
          formData.append('formTimestamp', data.formTimestamp);

          const result: NewsletterSubscriptionResult = await subscribeToUpdates(formData);

          if (result.status === 'success') {
            setMessage({ type: 'success', text: result.message });
            reset(); // Reset form using react-hook-form
          } else {
            // Set error on the form using react-hook-form's error system
            if (result.status === 'validation-error') {
              setError('email', { type: 'server', message: result.message });
            } else {
              setMessage({ type: 'error', text: result.message });
            }
          }
        } catch (error) {
          console.error('Form submission error:', error);
          setMessage({
            type: 'error',
            text: 'Сталася помилка при підписці. Спробуйте ще раз пізніше.',
          });
        }
      });
    },
    [reset, setError, clearErrors]
  );

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
          <form
            onSubmit={handleSubmit(onSubmit)}
            data-newsletter-form
            className="max-w-md mx-auto"
            noValidate
          >
            {/* Enhanced honeypot field for spam protection */}
            <input
              {...register(BOT_PREVENTION.HONEYPOT_FIELD_NAME)}
              type="text"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {/* Timestamp for timing-based bot detection */}
            <input {...register('formTimestamp')} type="hidden" />

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                {...register('email', {
                  required: 'Будь ласка, введіть email адресу',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Будь ласка, введіть дійсну email адресу',
                  },
                })}
                type="email"
                placeholder="Введіть вашу email адресу"
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isPending || isSubmitting}
              />
              <button
                type="submit"
                disabled={isPending || isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isPending || isSubmitting ? 'Підписка...' : 'Підписатися'}
              </button>
            </div>

            {/* Validation errors */}
            {errors.email && (
              <div className="mt-2 text-sm text-red-600">{errors.email.message}</div>
            )}

            {/* Status message */}
            {message && (
              <div
                className={`mt-4 p-3 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </Section>
  );
}
