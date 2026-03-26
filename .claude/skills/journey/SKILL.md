---
name: journey
description: Audit, enhance, or generate journey JSON files — keeps docs/journeys/ in sync with the codebase as the source of truth for all user-facing flows
user-invocable: true
argument-hint: '"audit [file]" | "enhance [file]" | "generate [slug]" | "sync"'
metadata:
  filePattern:
    - "docs/journeys/*.json"
    - "docs/journeys/CLAUDE.md"
---

# Journey Management

You manage the journey JSON files in `docs/journeys/` — Nessi's source of truth for all user-facing flows.

## Commands

Parse the argument to determine the mode:

### `/journey audit [target]`

Audit journey files for accuracy against the codebase.

- **`/journey audit`** — Audit ALL journey files
- **`/journey audit seller-listings`** — Audit a specific journey file
- **`/journey audit --changed`** — Audit only journeys affected by uncommitted changes

**Process:**
1. Determine scope (all, specific file, or changed files via `git diff --name-only`)
2. Launch **journey-sync** agent in **audit** mode with the target files
3. Present findings to user: accurate, stale, missing, new journeys needed
4. Ask if user wants to fix any issues found

### `/journey enhance [target]`

Find improvement opportunities in journey flows.

- **`/journey enhance buyer-cart`** — Enhance a specific journey
- **`/journey enhance --all`** — Scan all journeys for improvements

**Process:**
1. Launch **journey-sync** agent in **enhance** mode
2. Present opportunities: missing error handling, missing touchpoints, missing edge cases, aspirational features
3. Ask which enhancements to apply
4. Agent adds `"status": "planned"` steps with descriptive notes

### `/journey generate [slug]`

Create a new journey file from existing code.

- **`/journey generate buyer-wishlist`** — Generate journey for a new feature
- **`/journey generate --from-issue #123`** — Generate from a GitHub issue

**Process:**
1. If `--from-issue`, fetch issue via `gh issue view`
2. Launch **journey-sync** agent in **generate** mode
3. Agent traces the flow through source code, captures all layers and touchpoints
4. Write new journey file to `docs/journeys/{slug}.json`
5. Present the generated journey for review

### `/journey sync`

Auto-detect and sync all journeys affected by recent code changes. This is what the conductor calls.

**Process:**
1. Get changed files: `git diff --name-only HEAD~1` (or from conductor state)
2. Map changed files to affected journey files using the mapping table
3. For each affected journey:
   a. Launch **journey-sync** agent in **audit** mode first — identify what's stale
   b. Then launch in **generate/update** mode — apply the fixes
4. Report what was updated

## Conductor Integration

When invoked by the conductor (Step 6, before PR creation):

1. Read the conductor track's `state.json` to get the issue number
2. Get all files changed in this branch: `git diff --name-only main...HEAD`
3. Map to affected journey files
4. If no journeys affected → report "No journey changes needed" and exit
5. If journeys affected:
   a. Run audit to identify stale/missing content
   b. Run generate/update to fix issues
   c. Commit updated journey files
   d. Report which files were updated (for PR body)

## Validation

After any write operation, validate the output:
1. Parse the JSON to ensure it's valid
2. Check required fields: `slug`, `title`, `persona`, `description`, `flows`
3. Check all step IDs are unique within their flow
4. Check all `goTo` references in branches point to valid step IDs or `"END"`
5. Check persona is one of the valid enum values

## Rules

- Journey files live in `docs/journeys/` — never write them elsewhere
- Always read `docs/journeys/CLAUDE.md` for conventions before making changes
- Never modify existing `"built"` steps' core content during enhance — only add planned steps
- During audit/sync, DO update built steps if the code has changed
- Always include `codeRef` when a specific source file is identifiable
- Always include `errorCases` for server-layer steps that can fail
- Use descriptive labels — "User clicks Add to Cart" not "addToCart()"
- Reference related journeys in notes — "See guest-cart.json for full flow"
