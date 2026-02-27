import { sharedConfig } from '@/config/shared';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: sharedConfig.SITE_NAME,
    url: sharedConfig.SITE_URL,
    logo: `${sharedConfig.SITE_URL}/icon.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      email: sharedConfig.SUPPORT_EMAIL,
      contactType: 'customer support',
      availableLanguage: 'Ukrainian',
    },
    sameAs: [sharedConfig.INSTAGRAM_URL, sharedConfig.FACEBOOK_PAGE_URL],
  };
}

export function getSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: sharedConfig.SITE_NAME,
    url: sharedConfig.SITE_URL,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'UAH',
    },
    description: sharedConfig.SITE_DESCRIPTION,
    inLanguage: 'uk',
    featureList: [
      'Автоматичний імпорт коментарів з Instagram',
      'Криптографічно безпечний генератор випадкових чисел',
      'Прозорий вибір переможця',
      'Підтримка бізнес та creator акаунтів',
      'Офіційний Instagram Graph API',
    ],
  };
}

export function getFAQSchema() {
  const faqItems = [
    {
      question: 'Чи це офіційно дозволено Instagram?',
      answer:
        'Так. Ми використовуємо офіційний Graph API, тому робимо все в межах правил платформи.',
    },
    {
      question: 'Чи можна вибрати переможця, якщо під постом тисячи коментарів?',
      answer:
        'Так, сервіс обробляє до 5 000 коментарів за раз. Для більших розіграшів додамо черги.',
    },
    {
      question: 'Скільки коштує сервіс?',
      answer:
        'Pickly повністю безкоштовний. Ми не беремо жодних платежів за проведення розіграшів — ні підписок, ні разових оплат. Користуйтесь без обмежень!',
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

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: sharedConfig.SITE_NAME,
    url: sharedConfig.SITE_URL,
    inLanguage: 'uk',
    publisher: {
      '@type': 'Organization',
      name: sharedConfig.SITE_NAME,
      url: sharedConfig.SITE_URL,
    },
  };
}
