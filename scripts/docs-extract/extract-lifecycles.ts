import { walkFiles, readFile } from './utils/fs.js';
import { titleCase } from './utils/labels.js';
import { writeJson } from './utils/output.js';
import type { Lifecycle, LifecycleState, LifecycleTransition } from './types.js';

/**
 * Hardcoded transition definitions for known entities.
 * These capture the real business rules that can't be inferred from labels alone.
 */
const KNOWN_TRANSITIONS: Record<string, LifecycleTransition[]> = {
  listing: [
    { from: 'draft', to: 'active', label: 'Publish' },
    { from: 'active', to: 'sold', label: 'Mark as sold' },
    { from: 'active', to: 'archived', label: 'Deactivate' },
    { from: 'draft', to: 'deleted', label: 'Delete draft' },
    { from: 'active', to: 'reserved', label: 'Reserve' },
    { from: 'reserved', to: 'sold', label: 'Complete sale' },
  ],
};

/**
 * Parse a STATUS_LABELS constant from file content.
 * Looks for patterns like:
 *   export const SOMETHING_STATUS_LABELS: Record<SomeType, string> = { key: 'Label', ... }
 */
function parseStatusLabels(
  content: string
): { name: string; states: LifecycleState[] }[] {
  const results: { name: string; states: LifecycleState[] }[] = [];

  // Match exported const with _STATUS_LABELS in name and Record<..., string> type
  const constRegex =
    /export\s+const\s+(\w+_STATUS_LABELS)\s*:\s*Record<[^,]+,\s*string>\s*=\s*\{([^}]+)\}/g;

  let match: RegExpExecArray | null;
  while ((match = constRegex.exec(content)) !== null) {
    const constName = match[1];
    const body = match[2];

    // Extract key-value pairs, handling both 'value' and "value" quotes
    const entryRegex = /(\w+)\s*:\s*['"]([^'"]+)['"]/g;
    const states: LifecycleState[] = [];
    let entry: RegExpExecArray | null;
    while ((entry = entryRegex.exec(body)) !== null) {
      states.push({ id: entry[1], label: entry[2] });
    }

    if (states.length > 0) {
      results.push({ name: constName, states });
    }
  }

  return results;
}

/**
 * Derive the entity slug from a constant name like LISTING_STATUS_LABELS -> listing.
 */
function deriveEntitySlug(constName: string): string {
  return constName
    .replace(/_STATUS_LABELS$/, '')
    .toLowerCase();
}

/**
 * Build linear transitions for entities without hardcoded transitions.
 * Each state transitions to the next state in order.
 */
function inferLinearTransitions(states: LifecycleState[]): LifecycleTransition[] {
  const transitions: LifecycleTransition[] = [];
  for (let i = 0; i < states.length - 1; i++) {
    transitions.push({
      from: states[i].id,
      to: states[i + 1].id,
      label: `${states[i].label} to ${states[i + 1].label}`,
    });
  }
  return transitions;
}

/**
 * Extract lifecycles from all constants files under src/features/{feature}/constants/.
 */
export function extractLifecycles(): Lifecycle[] {
  const files = walkFiles('src/features', /\.ts$/);
  const constantsFiles = files.filter((f) => /\/constants\//.test(f));

  const lifecycles: Lifecycle[] = [];

  for (const filePath of constantsFiles) {
    const content = readFile(filePath);
    const parsed = parseStatusLabels(content);

    for (const { name, states } of parsed) {
      const slug = deriveEntitySlug(name);
      const transitions =
        KNOWN_TRANSITIONS[slug] ?? inferLinearTransitions(states);

      lifecycles.push({
        slug,
        name: `${titleCase(slug)} Lifecycle`,
        description: `Status lifecycle for ${titleCase(slug).toLowerCase()} entities`,
        states,
        transitions,
      });
    }
  }

  return lifecycles;
}

// CLI entrypoint
const lifecycles = extractLifecycles();
console.log(`Found ${lifecycles.length} lifecycle(s)`);
for (const lc of lifecycles) {
  console.log(`  - ${lc.name}: ${lc.states.length} states, ${lc.transitions.length} transitions`);
}
writeJson('lifecycles.json', { lifecycles });
