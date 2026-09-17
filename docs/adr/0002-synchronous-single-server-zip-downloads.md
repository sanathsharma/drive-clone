# Synchronous, single-server zip downloads

Folder and multi-select downloads stream a zip built by the Next.js server itself: it fetches each
file's bytes from object storage (`objects.getObject`) one at a time and re-emits them, compressed,
as the HTTP response body. This deliberately reintroduces the double-bandwidth cost ADR-0001 avoided
for ordinary file transfers - S3 to server, then server to client - scoped only to the zip path, since
combining multiple objects into one archive has no server-side primitive in our object storage; something
has to read every source object and re-emit it combined. The download is capped at 500 files / 2GB,
checked upfront before any bytes are fetched, rather than started and left to fail partway through or
split across multiple output files.

We chose this over building dedicated zip infrastructure because no such infrastructure exists yet, and
this app currently runs as a single long-running Node server rather than a fleet fronted by an internal
storage network - the setup that makes a service like Google Drive's near-free to run this way internally.

## Considered options

- **Async job that dumps a finished zip to object storage, client downloads it via a presigned URL once ready.**
  Rejected: real infrastructure this feature doesn't justify on its own - a job queue/worker, a status-polling
  endpoint, and cleanup of temporary zip objects. It also doesn't remove the server-bandwidth cost, just moves
  the S3-to-server leg earlier and adds a second S3 write+read on top of it.
- **Dedicated zip-serving process decoupled from the main app server.** Rejected: no separate infrastructure
  exists to run it on today; premature at current scale and usage.
- **Split into multiple zip parts once past a size/count threshold, matching Google Drive's own behavior.**
  Rejected for now: a multi-file download response is a more complex client/server contract for a first
  version of this feature. A hard cap with a clear upfront error is simpler and sufficient until real usage
  shows the cap gets hit often enough to matter.

## Consequences

- Every zip download occupies the app server's own inbound (from storage) and outbound (to the client)
  bandwidth for its full duration - unlike single-file downloads, which redirect straight to a presigned
  storage URL and never touch the server's bandwidth (ADR-0001). Several large, concurrent zip downloads
  can meaningfully compete for the server's bandwidth and CPU (zip compression).
- A folder or selection whose total exceeds 500 files or 2GB is rejected outright with an error, not split
  into multiple downloads; the user has to download it in smaller batches.
- Revisit this if zip downloads become frequent or large enough to strain the server, or if the caps prove
  too restrictive in practice - the async-job-to-storage or split-into-parts options above are the natural
  next steps, not a rewrite of what's here.
