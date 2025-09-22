import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/actions/auth';
import { instagramExportRepository } from '@/lib/redis/repositories/instagramExport';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ exportId: string }> }
) {
  try {
    const { exportId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const rec = await instagramExportRepository.getExportRecord(exportId);
    if (!rec) {
      return new NextResponse('Not found', { status: 404 });
    }
    if (rec.owner.instagramId !== user.instagramId) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Build CSV in-memory in chunks
    const encoder = new TextEncoder();
    let csv = 'comment_id,username,timestamp,like_count,parent_comment_id,text\n';

    const total = await instagramExportRepository.getCommentsCount(exportId);
    const chunkSize = 1000;
    for (let offset = 0; offset < total; offset += chunkSize) {
      const { items } = await instagramExportRepository.getCommentsSlice(
        exportId,
        offset,
        chunkSize
      );
      for (const c of items) {
        const row = [
          c.commentId,
          c.username,
          c.timestamp,
          String(c.likeCount ?? 0),
          c.parentCommentId ?? '',
          (c.text || '').replaceAll('"', '""'),
        ];
        const cell = (v: string) => `"${v.replaceAll('\n', ' ').replaceAll('\r', ' ')}"`;
        csv += `${row.map(cell).join(',')}\n`;
      }
    }

    const body = encoder.encode(csv);
    const headers = new Headers();
    headers.set('Content-Type', 'text/csv; charset=utf-8');
    headers.set('Content-Disposition', `attachment; filename="export_${exportId}.csv"`);
    headers.set('Content-Length', String(body.byteLength));
    return new NextResponse(body, { status: 200, headers });
  } catch (error) {
    console.error('CSV export failed', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
