'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sharedConfig } from '@/config';
import { trackEvent } from '@/lib/analytics';
import { useAuth } from '@/lib/contexts/AuthContext';
import LoginButton from '../auth/LoginButton';
import UserProfile from '../auth/UserProfile';
import { Button } from '../ui/Button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Show header CTA when hero CTA scrolls out of view
  useEffect(() => {
    const heroCta = document.getElementById('hero-cta');
    if (!heroCta) return;

    const observer = new IntersectionObserver(([entry]) => setShowCta(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(heroCta);
    return () => observer.disconnect();
  }, []);

  const handleCtaClick = () => {
    trackEvent('landing_cta_click', {
      cta_type: 'start_giveaway',
      cta_location: 'header',
    });
    router.push('/app/instagram/posts');
  };

  const handleNavigation = (sectionId: string) => {
    if (pathname === '/') {
      // On home page, scroll to section
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // On other pages, navigate to home with hash
      router.push(`/#${sectionId}`);
    }
  };

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
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SP</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{sharedConfig.SITE_NAME}</span>
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <motion.nav layout className="hidden md:flex items-center gap-8">
            <motion.button
              layout
              type="button"
              onClick={() => handleNavigation('how-it-works')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Як це працює
            </motion.button>
            <motion.button
              layout
              type="button"
              onClick={() => handleNavigation('benefits')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Переваги
            </motion.button>
            <motion.button
              layout
              type="button"
              onClick={() => handleNavigation('faq')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              FAQ
            </motion.button>
            <AnimatePresence>
              {isAuthenticated && showCta && (
                <motion.div
                  layout
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <Button size="sm" variant="hero" className="rounded-lg" onClick={handleCtaClick}>
                    Почати розіграш
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {authLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            ) : isAuthenticated ? (
              <UserProfile />
            ) : (
              <LoginButton />
            )}
          </div>

          {/* Mobile CTA + menu button */}
          <div className="md:hidden flex items-center gap-3">
            <AnimatePresence>
              {isAuthenticated && showCta && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button size="sm" variant="hero" className="rounded-lg" onClick={handleCtaClick}>
                    Почати розіграш
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              type="button"
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
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
                  handleNavigation('how-it-works');
                }}
              >
                Як це працює
              </button>
              <button
                type="button"
                className="text-gray-700 hover:text-blue-600 transition-colors py-2 text-left"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleNavigation('benefits');
                }}
              >
                Переваги
              </button>
              <button
                type="button"
                className="text-gray-700 hover:text-blue-600 transition-colors py-2 text-left"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleNavigation('faq');
                }}
              >
                FAQ
              </button>
              {authLoading ? (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : isAuthenticated ? (
                <UserProfile className="w-full" />
              ) : (
                <LoginButton className="w-full justify-center" />
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
