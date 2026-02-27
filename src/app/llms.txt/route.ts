import { sharedConfig } from '@/config/shared';

export function GET() {
  const content = `# Pickly

> ${sharedConfig.SITE_DESCRIPTION}

## Що таке Pickly?

Pickly — це українськомовний вебсервіс для проведення чесних та прозорих розіграшів в Instagram. Платформа автоматично завантажує коментарі з публікацій, дозволяє переглянути учасників та обрати переможця за допомогою криптографічно безпечного генератора випадкових чисел.

## Як це працює?

1. Авторизуйтесь через свій Instagram бізнес-акаунт або creator-акаунт
2. Оберіть публікацію, під якою проходить розіграш
3. Система автоматично імпортує всі коментарі (до 5 000 за раз)
4. Натисніть кнопку "Обрати переможця" — результат визначається миттєво
5. Поділіться результатом з підписниками

## Ключові переваги

- Безкоштовний сервіс без підписок та прихованих платежів
- Офіційний Instagram Graph API — повна відповідність правилам платформи
- Crypto-safe RNG — криптографічно стійкий алгоритм для чесного вибору
- Автоматичне видалення даних через 24 години
- Підтримка бізнес та creator акаунтів Instagram
- Інтерфейс повністю українською мовою

## Часті запитання

- Чи це дозволено Instagram? — Так, використовується офіційний Graph API
- Скільки коштує? — Повністю безкоштовно
- Чи зберігаються дані? — Ні, все видаляється автоматично через 24 години
- Які акаунти підтримуються? — Бізнес та creator акаунти Instagram

## Контакти

- Сайт: ${sharedConfig.SITE_URL}
- Email: ${sharedConfig.SUPPORT_EMAIL}
- Instagram: ${sharedConfig.INSTAGRAM_URL}
- Facebook: ${sharedConfig.FACEBOOK_PAGE_URL}

## Юридична інформація

- Політика конфіденційності: ${sharedConfig.SITE_URL}/legal/privacy-policy
- Угода користувача: ${sharedConfig.SITE_URL}/legal/terms
- Контакти: ${sharedConfig.SITE_URL}/legal/contact
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
