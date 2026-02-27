import type { Metadata } from 'next';

// Force static rendering
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Контакти',
  description:
    'Офіційні контакти сервісу розіграшів Pickly: техпідтримка, питання щодо оплати та співпраці.',
  openGraph: {
    title: 'Контакти',
    description:
      'Офіційні контакти сервісу розіграшів Pickly: техпідтримка, питання щодо оплати та співпраці.',
    url: '/legal/contact',
    type: 'website',
    locale: 'uk_UA',
    siteName: 'Pickly',
  },
  twitter: {
    card: 'summary',
    title: 'Контакти',
    description:
      'Офіційні контакти сервісу розіграшів Pickly: техпідтримка, питання щодо оплати та співпраці.',
  },
  alternates: {
    canonical: '/legal/contact',
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
        <p>Офіційна назва: ФІЗИЧНА ОСОБА - ПІДПРИЄМЕЦЬ Морщ Віктор Олександрович</p>
        <p>Official name: MORSHCH VIKTOR</p>
        <p>
          Електронна пошта: <a href="mailto:support@pickly.com.ua">support@pickly.com.ua</a>
        </p>
      </address>
      <p>
        З питань зловживань або безпеки:{' '}
        <a href="mailto:contact@pickly.com.ua">contact@pickly.com.ua</a>
      </p>
    </article>
  );
}
