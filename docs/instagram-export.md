# Instagram Comments Export

Sources: `src/lib/actions/instagramExport.ts`, `src/lib/instagramExport/types.ts`, `src/lib/redis/repositories/instagramExport.ts`.

Purpose: Export Instagram post comments into a Redis-backed job with progress tracking.

## Flow Overview

1. `startExportAction(mediaId)` creates a new `ExportRecord` and Redis keys.
2. `resumeExportAction(exportId, budgetMs)` fetches comments in pages, normalizes them, and appends to Redis.
3. When paging ends or the hard cap is reached, the export moves to `csv_pending` and then `done` (MVP behavior).
4. `getExportAction` reads status and live list length; `fetchExportCommentsAction` pages through stored comments.

## Data Model

`ExportRecord` includes:
- `status`: `pending` | `running` | `csv_pending` | `done` | `failed`.
- `owner`, `post`, `igPaging`, `counters`, `list`, `file`, `error`.
- `list.key` points to a Redis list holding normalized comments.

`NormalizedComment` fields:
- `commentId`, `userId`, `username`, `timestamp`, `likeCount`, `parentCommentId`, `text`.

## Limits And Dedupe

- Hard cap: 5,000 appended comments (`HARD_CAP`).
- Dedupe by comment ID prevents the same comment being stored twice across paginated fetches.

## Redis Storage

- Record: `igexp:{exportId}` (7d TTL).
- Comments list: `igexp:{exportId}:comments` (3d TTL).
- Dedupe set: `igexp:{exportId}:dedupe:comments` (3d TTL).
- Indexes: `igexp:index:media:{mediaId}` and `igexp:index:user:{instagramId}` (14d TTL).

## Pagination

- Comments are fetched with `facebookClient.getPostComments` using `paging.cursors.after`.
- Stored comments can be read in slices via `fetchExportCommentsAction(exportId, offset, limit)`.
