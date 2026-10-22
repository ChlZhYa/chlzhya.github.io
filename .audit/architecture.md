# Architecture choice

Base A was selected after reading both proposals. The independent cross-judge also chose A. A single collection of entries with kind `log` or `essay` keeps save, search, and rendering validation shared, while the two indexes have distinct layouts. B's separate collections, essay publication statuses, and one-log-per-day restriction add rules the user did not request.

Grafts from B are route focus and document titles, and honest recovery after failed storage writes. The canonical browser snapshot contains user-authored entries only. Seed examples remain separate immutable demo content, visibly labeled, never represented as the user's records and never included in user-only backup. No delete/import UI is needed for this first version, so no tombstone semantics are required.

Data shape is Entry { id, kind, title, date, category, tags, body, updatedAt }. Snapshot is { version: 1, entries: Entry[] }. Routes represent journal, essays, reader with id, and about. Editor is a native modal dialog with a kind selector. Only validated snapshots cross the storage boundary. User strings render as text. No account, backend, deployment, or cross-device persistence is claimed.

Module boundaries are seed data, local storage, page rendering and events, styles, and the static development server. Hash navigation is sufficient for a static preview. The chosen structure is buildless vanilla JavaScript because the site is a small journal, not a complex app shell.

Principles shaping decisions are Experience First for separate reading rhythms, Model the Domain for the entry registry, Separate Before Serializing Shared State for isolated implementation checkout, Build the Lever for rerunnable verification, Prove It Works for browser checks, and Sequence Work into Verifiable Units for concept, implementation, and verification gates.
