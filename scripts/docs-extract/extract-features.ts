import { existsSync } from 'fs';
import { listDirs, readFile, walkFiles, root } from './utils/fs.js';
import { titleCase } from './utils/labels.js';
import { writeJson } from './utils/output.js';
import type { Feature } from './types.js';

/**
 * Extract the first paragraph after the first heading from a CLAUDE.md file.
 * Strips markdown formatting like ** and `.
 */
function extractDescription(markdown: string): string {
  const lines = markdown.split('\n');
  let pastFirstHeading = false;
  const paragraphLines: string[] = [];

  for (const line of lines) {
    if (!pastFirstHeading) {
      if (line.startsWith('#')) {
        pastFirstHeading = true;
      }
      continue;
    }

    const trimmed = line.trim();

    // Skip blank lines and sub-headings before the paragraph starts
    if (paragraphLines.length === 0 && (trimmed === '' || trimmed.startsWith('#'))) continue;

    // Stop at blank line after collecting paragraph text
    if (paragraphLines.length > 0 && trimmed === '') break;

    // Stop if we hit a heading after collecting text
    if (paragraphLines.length > 0 && trimmed.startsWith('#')) break;

    // Skip list items, tables, and other non-paragraph content
    if (trimmed.startsWith('- ') || trimmed.startsWith('| ')) break;

    paragraphLines.push(trimmed);
  }

  if (paragraphLines.length === 0) return '';

  return paragraphLines
    .join(' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

/**
 * Count files matching a pattern in a subdirectory of a feature.
 */
function countFiles(featureDir: string, subdir: string, pattern: RegExp): number {
  const fullPath = root('src', 'features', featureDir, subdir);
  if (!existsSync(fullPath)) return 0;
  return walkFiles(`src/features/${featureDir}/${subdir}`, pattern).length;
}

/**
 * Count API route files matching /api/{slug}/ pattern.
 */
function countApiRoutes(slug: string): number {
  const apiDir = root('src', 'app', 'api', slug);
  if (!existsSync(apiDir)) return 0;
  return walkFiles(`src/app/api/${slug}`, /^route\.ts$/).length;
}

/**
 * Extract all features from src/features/ directories.
 */
export function extractFeatures(): Feature[] {
  const dirs = listDirs('src/features');
  const features: Feature[] = [];

  for (const slug of dirs) {
    const name = titleCase(slug);

    // Read description from CLAUDE.md
    const claudePath = root('src', 'features', slug, 'CLAUDE.md');
    let description: string;
    if (existsSync(claudePath)) {
      const content = readFile('src', 'features', slug, 'CLAUDE.md');
      description = extractDescription(content) || `${name} feature`;
    } else {
      description = `${name} feature`;
    }

    const componentCount = countFiles(slug, 'components', /\.tsx$/);
    const hookCount = countFiles(slug, 'hooks', /\.ts$/);
    const serviceCount = countFiles(slug, 'services', /\.ts$/);
    const endpointCount = countApiRoutes(slug);

    features.push({
      slug,
      name,
      description,
      status: 'built',
      componentCount,
      endpointCount,
      hookCount,
      serviceCount,
    });
  }

  return features;
}

// CLI entrypoint
const isCli =
  import.meta.filename?.endsWith('extract-features.ts') ??
  process.argv[1]?.includes('extract-features');
if (isCli) {
  const features = extractFeatures();
  console.log(`Found ${features.length} features`);
  writeJson('features.json', { features });
}
