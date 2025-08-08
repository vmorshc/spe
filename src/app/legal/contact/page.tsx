import type { Metadata } from 'next';

// Force static rendering
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Контакти — Pickly',
  description:
    'Офіційні контакти сервісу розіграшів Pickly: техпідтримка, питання щодо оплати та співпраці.',
  openGraph: {
    title: 'Контакти — Pickly',
    description:
      'Офіційні контакти сервісу розіграшів Pickly: техпідтримка, питання щодо оплати та співпраці.',
    url: 'https://pickly.com.ua/legal/contact',
    type: 'website',
    locale: 'uk_UA',
    siteName: 'Pickly',
  },
  twitter: {
    card: 'summary',
    title: 'Контакти — Pickly',
    description:
      'Офіційні контакти сервісу розіграшів Pickly: техпідтримка, питання щодо оплати та співпраці.',
  },
  alternates: {
    canonical: 'https://pickly.com.ua/legal/contact',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return (
    <article className="contact">
      <h1>
        <strong>Контакти</strong>
      </h1>
      <p>
        Зв’яжіться з нами з будь-яких питань щодо сервісу розіграшів Pickly: технічна підтримка,
        питання щодо оплати, співпраця.
      </p>
      <address>
        <p>Офіційна назва: ФОП Морщ Віктор Олександрович</p>
        <p>
          Електронна пошта: <a href="mailto:support@pickly.com.ua">support@pickly.com.ua</a>
        </p>
        <p>
          Телефон: <a href="tel:+380636605116">+38 (063) 660-51-16</a>
        </p>
      </address>
      <p>
        З питань зловживань або безпеки:{' '}
        <a href="mailto:contact@pickly.com.ua">contact@pickly.com.ua</a>
      </p>
    </article>
  );
}
