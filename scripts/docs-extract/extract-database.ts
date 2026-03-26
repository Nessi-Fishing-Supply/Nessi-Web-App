/**
 * Extract database schema from Supabase-generated types and migrations.
 *
 * Reads `src/types/database.ts` to parse table definitions (Row blocks),
 * then walks `supabase/migrations/*.sql` to detect RLS policies and triggers.
 * Outputs entities (tables with fields/badges) and an ERD (nodes + edges).
 */

import { readFile, walkFiles } from './utils/fs.js';
import { titleCase } from './utils/labels.js';
import { writeJson } from './utils/output.js';
import type { Entity, EntityField, ErdNode, ErdEdge } from './types.js';

// ---------------------------------------------------------------------------
// Table name aliases: migrations may reference old names (profiles -> members,
// products -> listings, product_images -> listing_photos)
// ---------------------------------------------------------------------------
const TABLE_ALIASES: Record<string, string> = {
  profiles: 'members',
  products: 'listings',
  product_images: 'listing_photos',
};

// ---------------------------------------------------------------------------
// Parse database.ts
// ---------------------------------------------------------------------------

interface ParsedRelationship {
  columns: string[];
  referencedRelation: string;
}

interface ParsedTable {
  name: string;
  fields: EntityField[];
  relationships: ParsedRelationship[];
}

function parseTables(source: string): ParsedTable[] {
  const tables: ParsedTable[] = [];

  // Find the Tables block
  const tablesMatch = source.match(/Tables:\s*\{/);
  if (!tablesMatch || tablesMatch.index === undefined) return tables;

  // Walk through each table definition
  const tablePattern = /^      (\w+):\s*\{$/gm;
  let match: RegExpExecArray | null;

  while ((match = tablePattern.exec(source)) !== null) {
    const tableName = match[1];
    const tableStart = match.index;

    // Find the Row block for this table
    const afterTable = source.slice(tableStart);
    const rowMatch = afterTable.match(/Row:\s*\{/);
    if (!rowMatch || rowMatch.index === undefined) continue;

    const rowStart = tableStart + rowMatch.index + rowMatch[0].length;

    // Find the closing brace of Row (matching nesting)
    let depth = 1;
    let pos = rowStart;
    while (depth > 0 && pos < source.length) {
      if (source[pos] === '{') depth++;
      if (source[pos] === '}') depth--;
      pos++;
    }

    const rowBody = source.slice(rowStart, pos - 1);
    const fields = parseRowFields(rowBody);

    // Find the Relationships block
    const relationships = parseRelationships(afterTable);

    tables.push({ name: tableName, fields, relationships });
  }

  return tables;
}

function parseRowFields(body: string): EntityField[] {
  const fields: EntityField[] = [];
  const lines = body.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;

    // Match: field_name: type
    const fieldMatch = trimmed.match(/^(\w+):\s*(.+?)$/);
    if (!fieldMatch) continue;

    const name = fieldMatch[1];
    let rawType = fieldMatch[2];

    // Clean up trailing semicolons, commas
    rawType = rawType.replace(/[;,]\s*$/, '').trim();

    // Determine nullable
    const nullable = rawType.includes('| null');

    // Clean up type for display
    let type = rawType
      .replace(/\s*\|\s*null/g, '')
      .trim();

    // Simplify Database["public"]["Enums"]["..."] or Database['public']['Enums']['...']
    type = type.replace(
      /Database\[['"]public['"]\]\[['"]Enums['"]\]\[['"](\w+)['"]\]/g,
      'enum:$1',
    );

    fields.push({ name, type, nullable });
  }

  return fields;
}

function parseRelationships(tableBlock: string): ParsedRelationship[] {
  const relationships: ParsedRelationship[] = [];

  // Find Relationships array
  const relMatch = tableBlock.match(/Relationships:\s*\[/);
  if (!relMatch || relMatch.index === undefined) return relationships;

  const relStart = relMatch.index + relMatch[0].length;

  // Find closing bracket
  let depth = 1;
  let pos = relStart;
  while (depth > 0 && pos < tableBlock.length) {
    if (tableBlock[pos] === '[') depth++;
    if (tableBlock[pos] === ']') depth--;
    pos++;
  }

  const relBody = tableBlock.slice(relStart, pos - 1);

  // Extract each relationship object - handle both orderings of columns/referencedRelation
  const objPattern =
    /\{[^}]*referencedRelation:\s*['"](\w+)['"][^}]*columns:\s*\[([^\]]*)\][^}]*\}|\{[^}]*columns:\s*\[([^\]]*)\][^}]*referencedRelation:\s*['"](\w+)['"][^}]*\}/g;
  let relObjMatch: RegExpExecArray | null;

  while ((relObjMatch = objPattern.exec(relBody)) !== null) {
    const referencedRelation = relObjMatch[1] || relObjMatch[4];
    const columnsStr = relObjMatch[2] || relObjMatch[3];
    const columns = columnsStr
      .split(',')
      .map((c) => c.trim().replace(/['"]/g, ''))
      .filter(Boolean);

    if (referencedRelation && columns.length > 0) {
      relationships.push({ columns, referencedRelation });
    }
  }

  return relationships;
}

// ---------------------------------------------------------------------------
// Scan migrations for RLS and triggers
// ---------------------------------------------------------------------------

function scanMigrations(tableNames: string[]): {
  rls: Set<string>;
  triggers: Set<string>;
} {
  const rls = new Set<string>();
  const triggers = new Set<string>();

  const migrationFiles = walkFiles('supabase/migrations', /\.sql$/);

  for (const filePath of migrationFiles) {
    const content = readFile(filePath);
    const lines = content.split('\n');

    // Detect RLS: ALTER TABLE ... ENABLE ROW LEVEL SECURITY
    for (const line of lines) {
      if (/ENABLE\s+ROW\s+LEVEL\s+SECURITY/i.test(line)) {
        const tableMatch = line.match(
          /ALTER\s+TABLE\s+(?:public\.)?(\w+)\s+ENABLE/i,
        );
        if (tableMatch) {
          const rawName = tableMatch[1];
          const resolved = TABLE_ALIASES[rawName] || rawName;
          if (tableNames.includes(resolved)) {
            rls.add(resolved);
          }
        }
      }
    }

    // Detect triggers: CREATE TRIGGER ... ON tablename
    const triggerBlocks = content.matchAll(
      /CREATE\s+TRIGGER[\s\S]*?\bON\s+(?:public\.)?(\w+)/gi,
    );
    for (const tm of triggerBlocks) {
      const rawName = tm[1];
      const resolved = TABLE_ALIASES[rawName] || rawName;
      if (tableNames.includes(resolved)) {
        triggers.add(resolved);
      }
    }
  }

  return { rls, triggers };
}

// ---------------------------------------------------------------------------
// Build entities
// ---------------------------------------------------------------------------

function buildEntities(
  tables: ParsedTable[],
  rls: Set<string>,
  triggers: Set<string>,
): Entity[] {
  return tables.map((table) => {
    const badges: string[] = [];
    if (rls.has(table.name)) badges.push('RLS');
    if (triggers.has(table.name)) badges.push('Triggers');

    return {
      name: table.name,
      label: titleCase(table.name),
      fields: table.fields,
      badges,
    };
  });
}

// ---------------------------------------------------------------------------
// Build ERD
// ---------------------------------------------------------------------------

const GRID_X_SPACING = 280;
const GRID_Y_SPACING = 160;
const GRID_COLUMNS = 3;

function buildErd(tables: ParsedTable[]): {
  nodes: ErdNode[];
  edges: ErdEdge[];
} {
  const tableNames = tables.map((t) => t.name);

  // Nodes: 3-column grid layout
  const nodes: ErdNode[] = tables.map((table, i) => ({
    id: table.name,
    label: titleCase(table.name),
    x: (i % GRID_COLUMNS) * GRID_X_SPACING,
    y: Math.floor(i / GRID_COLUMNS) * GRID_Y_SPACING,
  }));

  // Edges: use explicit Relationships from the type definitions
  const edges: ErdEdge[] = [];
  const edgeKeys = new Set<string>();

  for (const table of tables) {
    for (const rel of table.relationships) {
      if (tableNames.includes(rel.referencedRelation)) {
        const column = rel.columns[0];
        const key = `${table.name}->${rel.referencedRelation}:${column}`;
        if (!edgeKeys.has(key)) {
          edgeKeys.add(key);
          edges.push({
            from: table.name,
            to: rel.referencedRelation,
            label: column,
          });
        }
      }
    }
  }

  // Fallback: detect _id columns for tables without explicit relationships
  for (const table of tables) {
    if (table.relationships.length > 0) continue;

    for (const field of table.fields) {
      if (!field.name.endsWith('_id')) continue;

      const stem = field.name.replace(/_id$/, '');

      // Try matching table names: plural forms
      const candidates = [
        stem,
        stem + 's',
        stem + 'es',
        stem.replace(/y$/, 'ies'),
      ];

      for (const candidate of candidates) {
        if (tableNames.includes(candidate)) {
          const key = `${table.name}->${candidate}:${field.name}`;
          if (!edgeKeys.has(key)) {
            edgeKeys.add(key);
            edges.push({
              from: table.name,
              to: candidate,
              label: field.name,
            });
          }
          break;
        }
      }
    }
  }

  return { nodes, edges };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function extractDatabase(): {
  entities: Entity[];
  erd: { nodes: ErdNode[]; edges: ErdEdge[] };
} {
  const source = readFile('src/types/database.ts');
  const tables = parseTables(source);
  const tableNames = tables.map((t) => t.name);
  const { rls, triggers } = scanMigrations(tableNames);
  const entities = buildEntities(tables, rls, triggers);
  const erd = buildErd(tables);

  return { entities, erd };
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('extract-database.ts') ||
    process.argv[1].endsWith('extract-database.js'));

if (isMain) {
  console.log('Extracting database schema...');
  const { entities, erd } = extractDatabase();

  writeJson('data-model.json', entities);
  writeJson('entity-relationships.json', erd);

  console.log(`\n  Tables: ${entities.length}`);
  console.log(
    `  With RLS: ${entities.filter((e) => e.badges.includes('RLS')).length}`,
  );
  console.log(
    `  With Triggers: ${entities.filter((e) => e.badges.includes('Triggers')).length}`,
  );
  console.log(`  ERD nodes: ${erd.nodes.length}`);
  console.log(`  ERD edges: ${erd.edges.length}`);
}
