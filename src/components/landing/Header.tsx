'use client';

import { motion } from 'framer-motion';
import { Instagram, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { sharedConfig } from '@/config';
import Button from '../ui/Button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-sm sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SP</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{sharedConfig.SITE_NAME}</span>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              type="button"
              onClick={() =>
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Як це працює
            </button>
            <button
              type="button"
              onClick={() =>
                document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Переваги
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="primary"
              className="flex items-center space-x-2"
              onClick={() => console.log('Instagram login')}
            >
              <Instagram className="w-4 h-4" />
              <span>Увійти через Instagram</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            <nav className="flex flex-col space-y-4">
              <button
                type="button"
                className="text-gray-700 hover:text-blue-600 transition-colors py-2 text-left"
                onClick={() => {
                  setIsMenuOpen(false);
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Як це працює
              </button>
              <button
                type="button"
                className="text-gray-700 hover:text-blue-600 transition-colors py-2 text-left"
                onClick={() => {
                  setIsMenuOpen(false);
                  document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Переваги
              </button>
              <button
                type="button"
                className="text-gray-700 hover:text-blue-600 transition-colors py-2 text-left"
                onClick={() => {
                  setIsMenuOpen(false);
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                FAQ
              </button>
              <Button
                variant="primary"
                className="flex items-center justify-center space-x-2 w-full"
                onClick={() => console.log('Instagram login')}
              >
                <Instagram className="w-4 h-4" />
                <span>Увійти через Instagram</span>
              </Button>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
