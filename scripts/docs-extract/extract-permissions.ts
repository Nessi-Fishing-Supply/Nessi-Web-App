import { readFile } from './utils/fs.js';
import { titleCase } from './utils/labels.js';
import { writeJson } from './utils/output.js';
import type { Role } from './types.js';

// ---------------------------------------------------------------------------
// 1. Extract ShopPermissionFeature union members
// ---------------------------------------------------------------------------

function extractFeatures(): string[] {
  const source = readFile('src/features/shops/types/permissions.ts');
  const matches = source.match(/'(\w+)'/g);
  if (!matches) throw new Error('No permission features found');

  // Only grab members inside the ShopPermissionFeature type (the first union).
  // The file defines ShopPermissionFeature first, then ShopPermissionLevel.
  // We split at ShopPermissionLevel to isolate the feature block.
  const featureBlock = source.split('ShopPermissionLevel')[0];
  const featureMatches = featureBlock.match(/'(\w+)'/g);
  if (!featureMatches) throw new Error('No permission features found');

  return featureMatches.map((m) => m.replace(/'/g, ''));
}

// ---------------------------------------------------------------------------
// 2. Extract role slugs from SYSTEM_ROLE_SLUGS
// ---------------------------------------------------------------------------

function extractRoleSlugs(): string[] {
  const source = readFile('src/features/shops/constants/roles.ts');
  const block = source.split('SYSTEM_ROLE_SLUGS')[1]?.split('} as const')[0];
  if (!block) throw new Error('SYSTEM_ROLE_SLUGS not found');

  const matches = block.match(/'(\w+)'/g);
  if (!matches) throw new Error('No role slugs found');

  // Values are the second occurrence in each `key: 'value'` pair — but since
  // key and value are identical in this file, just deduplicate.
  const slugs = [...new Set(matches.map((m) => m.replace(/'/g, '')))];
  return slugs;
}

// ---------------------------------------------------------------------------
// 3. Permission matrices
// ---------------------------------------------------------------------------

type PermissionLevel = 'full' | 'view' | 'none';

const ROLE_META: Record<
  string,
  { description: string; color: string; permissions: Record<string, PermissionLevel> }
> = {
  owner: {
    description: 'Full access to all shop features and settings',
    color: '#e27739',
    permissions: {
      listings: 'full',
      pricing: 'full',
      orders: 'full',
      messaging: 'full',
      shop_settings: 'full',
      members: 'full',
    },
  },
  manager: {
    description: 'Operational access to listings, pricing, orders, and messaging',
    color: '#b86e0a',
    permissions: {
      listings: 'full',
      pricing: 'full',
      orders: 'full',
      messaging: 'full',
      shop_settings: 'view',
      members: 'none',
    },
  },
  contributor: {
    description: 'Can create and edit listings only',
    color: '#78756f',
    permissions: {
      listings: 'full',
      pricing: 'none',
      orders: 'none',
      messaging: 'none',
      shop_settings: 'none',
      members: 'none',
    },
  },
};

// ---------------------------------------------------------------------------
// 4. Build output
// ---------------------------------------------------------------------------

export function buildPermissions(): { features: string[]; roles: Role[] } {
  const features = extractFeatures();
  const slugs = extractRoleSlugs();

  const roles: Role[] = slugs.map((slug) => {
    const meta = ROLE_META[slug];
    if (!meta) throw new Error(`No metadata defined for role "${slug}"`);

    return {
      slug,
      name: titleCase(slug),
      description: meta.description,
      color: meta.color,
      permissions: meta.permissions,
    };
  });

  return { features, roles };
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

const data = buildPermissions();

console.log(`Extracted ${data.features.length} features, ${data.roles.length} roles`);
writeJson('permissions.json', data);
