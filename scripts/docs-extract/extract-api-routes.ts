import { walkFiles, readFile } from './utils/fs.js';
import { endpointLabel, apiGroup, titleCase } from './utils/labels.js';
import { writeJson } from './utils/output.js';
import type { ApiEndpoint, ApiGroup } from './types.js';

/**
 * Convert a filesystem route path to an API path.
 * e.g. src/app/api/listings/[id]/route.ts → /api/listings/:id
 */
function toApiPath(filePath: string): string {
  return (
    '/' +
    filePath
      .replace(/^src\/app\//, '')
      .replace(/\/route\.ts$/, '')
      .replace(/\[([^\]]+)\]/g, ':$1')
  );
}

/**
 * Detect exported HTTP methods from file contents.
 */
function detectMethods(source: string): string[] {
  const methods: string[] = [];
  const fnPattern = /export\s+(?:async\s+)?function\s+(GET|POST|PATCH|PUT|DELETE)\b/g;
  const constPattern = /export\s+const\s+(GET|POST|PATCH|PUT|DELETE)\b/g;

  let match: RegExpExecArray | null;
  while ((match = fnPattern.exec(source)) !== null) {
    if (!methods.includes(match[1])) methods.push(match[1]);
  }
  while ((match = constPattern.exec(source)) !== null) {
    if (!methods.includes(match[1])) methods.push(match[1]);
  }

  return methods;
}

/**
 * Detect auth type from file contents.
 */
function detectAuth(source: string): 'user' | 'admin' | 'none' {
  if (source.includes('createAdminClient')) return 'admin';
  if (source.includes('createServerClient') || source.includes('createClient')) return 'user';
  return 'none';
}

/**
 * Detect permission requirements from requireShopPermission calls.
 */
function detectPermissions(
  source: string,
): { feature: string; level: string } | undefined {
  const match = source.match(
    /requireShopPermission\(\s*\w+\s*,\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/,
  );
  if (match) {
    return { feature: match[1], level: match[2] };
  }
  return undefined;
}

/**
 * Detect error status codes (400+) from file contents.
 */
function detectErrorCodes(source: string): number[] {
  const codes = new Set<number>();
  const pattern = /status:\s*(\d{3})/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source)) !== null) {
    const code = parseInt(match[1], 10);
    if (code >= 400) codes.add(code);
  }
  return Array.from(codes).sort();
}

/**
 * Extract all API route endpoints and group them.
 */
export function extractApiRoutes(): ApiGroup[] {
  const files = walkFiles('src/app/api', /^route\.ts$/);
  const grouped = new Map<string, ApiEndpoint[]>();

  for (const file of files) {
    // Skip test files
    if (file.includes('__tests__')) continue;

    const source = readFile(file);
    const path = toApiPath(file);
    const methods = detectMethods(source);
    const auth = detectAuth(source);
    const permissions = detectPermissions(source);
    const errorCodes = detectErrorCodes(source);
    const group = apiGroup(path);

    if (!grouped.has(group)) {
      grouped.set(group, []);
    }

    for (const method of methods) {
      const endpoint: ApiEndpoint = {
        method,
        path,
        label: endpointLabel(method, path),
        auth,
        errorCodes,
      };
      if (permissions) {
        endpoint.permissions = permissions;
      }
      grouped.get(group)!.push(endpoint);
    }
  }

  const groups: ApiGroup[] = Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, endpoints]) => ({
      name: titleCase(name),
      endpoints,
    }));

  return groups;
}

// CLI entrypoint
const groups = extractApiRoutes();
const totalEndpoints = groups.reduce((sum, g) => sum + g.endpoints.length, 0);
console.log(`Found ${totalEndpoints} endpoints in ${groups.length} groups`);
writeJson('api-contracts.json', groups);
