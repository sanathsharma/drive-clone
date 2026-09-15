# Drive Clone

A Google-Drive-style app where users organize **Files** within a tree of **Folders**.

## Language

**File**:
A user-owned unit of content whose bytes live in object storage under a storage key; a File's own id doubles as (or determines) that key, so there is no separate stored-object concept to track.
_Avoid_: Asset — not a distinct entity in this domain. A File's storage identity is its own id, not a second id on a second table.
