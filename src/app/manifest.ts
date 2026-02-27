import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pickly — Чесні розіграші в Instagram',
    short_name: 'Pickly',
    description:
      'Обери переможця чесно — за хвилину, без сумнівів. Автоматично завантажуємо коментарі, обираємо випадкового переможця й показуємо результат.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    lang: 'uk',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
