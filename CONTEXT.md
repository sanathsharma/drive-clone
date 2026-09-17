# Drive Clone

A Google-Drive-style app where users organize **Files** within a tree of **Folders**.

## Language

**File**:
A user-owned unit of content whose bytes live in object storage under a storage key; a File's own id doubles as (or determines) that key, so there is no separate stored-object concept to track.
_Avoid_: Asset — not a distinct entity in this domain. A File's storage identity is its own id, not a second id on a second table.

**Folder**:
A user-owned container that groups Files and other Folders into a tree. A Folder holds no bytes of its own, only membership.
_Avoid_: Directory — the schema and UI both say Folder.

**Content**:
The Files and Folders that live directly inside a given Folder — its children, one level deep. This is what a folder's table listing shows.
_Avoid_: Items, entries — "Content" is the name already used by the `Content` type and the `services/content` module.

**Selection**:
The set of Content a user has checked via select mode in a Folder's listing, used as the target for a bulk action (e.g. delete, download).
_Avoid_: Multi-select, checked items — "Selection" matches the `selected` state and `deleteSelection` action already in code.
