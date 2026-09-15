# Direct-to-S3 file uploads with no separate Asset entity

Files upload straight from the browser to Neon Object Storage via a presigned `PUT`, never through the Next.js server; downloads go through an authenticated route (`GET /api/files/:id`) that checks ownership and `302`-redirects to a short-lived presigned `GET`. A File's own id doubles as its storage key — there is no separate `Asset` entity — and no `files` row is written until upload completion is confirmed via `HeadObject` against the real object. We chose this to avoid doubling bandwidth through our own server for files up to 5GB, and to avoid a two-entity or pending-row model when nothing in this domain yet needs versioning, deduplication, or an "uploading" placeholder in the UI.

## Considered options

- **Proxy uploads/downloads through the Next.js server.** Rejected: doubles bandwidth cost for large files and runs into route handler/server action body-size limits.
- **Separate `Asset` entity referenced by `File.asset_id`.** Rejected: no current need for multiple versions or deduplicated blobs per file; adds a join with no payoff yet.
- **Pending `File` row with a `status` column, created at upload-initiate time.** Rejected: no UI need for a placeholder row yet, and it avoids a status state machine.

## Consequences

- An upload that's initiated but never completed (or completed but never confirmed) leaves an orphaned object in S3 with no matching `files` row. Cleanup is deliberately deferred, not solved here.
- Revisit the single-entity model if versioning or content deduplication becomes a real requirement.
