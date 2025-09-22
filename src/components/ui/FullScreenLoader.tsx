'use client';

interface FullScreenLoaderProps {
  show: boolean;
  title?: string;
  subtitle?: string;
}

export default function FullScreenLoader({ show, title, subtitle }: FullScreenLoaderProps) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-xl shadow-xl px-6 py-6 w-full max-w-sm mx-4 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
        {title && <div className="text-base font-medium text-gray-900">{title}</div>}
        {subtitle && <div className="mt-1 text-sm text-gray-600">{subtitle}</div>}
      </div>
    </div>
  );
}
