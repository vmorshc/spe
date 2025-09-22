'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { listExportsByMediaAction } from '@/lib/actions/instagramExport';

interface ExportsDropdownProps {
  postId: string;
}

interface ExportListItem {
  exportId: string;
  createdAt: string;
  status: 'pending' | 'running' | 'csv_pending' | 'done' | 'failed';
  counters: { appended: number };
}

export default function ExportsDropdown({ postId }: ExportsDropdownProps) {
  const router = useRouter();
  const [items, setItems] = useState<ExportListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await listExportsByMediaAction(postId, 0, 10);
        if (mounted) setItems(list as ExportListItem[]);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [postId]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'latest') {
      router.push(`/app/instagram/posts/${postId}`);
    } else if (value) {
      router.push(`/app/instagram/posts/${postId}/exports/${value}`);
    }
  };

  const selectId = `exports-select-${postId}`;

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor={selectId} className="text-sm text-gray-600">
        Експорти:
      </label>
      <div className="relative">
        <select
          id={selectId}
          className="appearance-none text-sm border border-gray-300 rounded pl-3 pr-8 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          onChange={handleChange}
          defaultValue="latest"
        >
          <option value="latest">Останні коментарі</option>
          {loading && <option>Завантаження…</option>}
          {!loading && items.length === 0 && <option disabled>Експорти відсутні</option>}
          {items.map((it) => {
            const dt = new Date(it.createdAt);
            const lbl = new Intl.DateTimeFormat('uk-UA', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            }).format(dt);
            return (
              <option
                key={it.exportId}
                value={it.exportId}
              >{`${lbl} · ${it.counters.appended.toLocaleString('uk-UA')}`}</option>
            );
          })}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className="h-4 w-4 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
