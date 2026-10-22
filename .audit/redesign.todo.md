# Flow redesign

- [x] 1. `how` over the affected subsystem.
- [x] 2. `architect` for parallel design exploration.
- [x] 3. Write the throughput checkpoint as four todo items.
  - [x] **Blocking first steps.** Confirm existing route, persistence, authoring, and calendar behavior. Lock the user's cool-white and blue-violet preference before visual changes.
  - [x] **Independent workstreams.** Explore two layout directions separately. One implementation owner handles cohesive UI source changes.
  - [x] **Shared mutable state.** Implementation uses an isolated worktree. Existing browser data and storage version are preserved.
  - [x] **Smallest safe decomposition.** A single owner changes layout, copy, motion, and calendar together; independent review and browser verification follow.
- [x] 4. Delegate code-writing to a subagent using your configured feature model.
- [x] 5. Verify on the matching surface.
- [x] 6. Rebase into small, ordered commits. Stack follow-ups.
- [x] 7. If the design is contested, `interrogate` before shipping.
- [x] 8. Run **Opening a PR**.
  skip: No remote was provided. Deliver and verify the local redesign.

## Visual decision

- [x] Generate and compare two complete layout concepts.
- [x] Choose a base, document tradeoffs, lock colors and components.

The user selected B after correcting an accidental A choice. A's owner was interrupted and confirmed stopped; partial work is checkpointed separately. A fresh owner implements B in its own worktree.
- [x] Replace blog timeline/sidebar anatomy with a new composition.
- [x] Rename the product section and all related visible text to Flow.
- [x] Broaden sample short content to ideas, questions, observations, and aha moments.
- [x] Modernize calendar and preserve record-derived activity.
- [x] Verify responsive layout, primary interactions, and old data compatibility.
