'use client';

import { motion } from 'framer-motion';
import { Facebook, Instagram, Mail, MessageCircle } from 'lucide-react';
import { sharedConfig } from '@/config';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex items-center space-x-2 mb-4"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold">Pickly</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-300 mb-6 max-w-md"
            >
              Чесні розіграші в Instagram без зайвого клопоту. Обирайте переможця за хвилину з
              повною прозорістю.
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex space-x-4"
            >
              <a
                href={sharedConfig.INSTAGRAM_URL}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={sharedConfig.FACEBOOK_PAGE_URL}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </motion.div>
          </div>

          {/* Contact Information */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-lg font-semibold mb-4"
            >
              Контакти
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-3"
            >
              <a
                href="https://t.me/pickly_support"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>@pickly_support</span>
              </a>
              <a
                href={`mailto:${sharedConfig.SUPPORT_EMAIL}`}
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>{sharedConfig.SUPPORT_EMAIL}</span>
              </a>
            </motion.div>
          </div>

          {/* Legal Links */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-lg font-semibold mb-4"
            >
              Правова інформація
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-3"
            >
              <a
                href="/legal/privacy-policy"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Політика конфіденційності
              </a>
              <a
                href="/legal/terms"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Угода користувача
              </a>
              <a
                href="/legal/contact"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Контакти
              </a>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="border-t border-gray-800 pt-8 mt-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} MORSHCH VIKTOR</p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Зроблено з ❤️ в Україні</span>
              <span>•</span>
              <span>Версія 1.0</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
