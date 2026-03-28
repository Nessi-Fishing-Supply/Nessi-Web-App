import { readdirSync } from 'fs';
import { readFile, root } from './utils/fs.js';
import { writeJson } from './utils/output.js';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ArchNode {
  id: string;
  label: string;
  sublabel?: string;
  icon?: string;
  url?: string;
  tooltip?: string;
}

interface ArchLayer {
  id: string;
  label: string;
  color?: string;
  nodes: ArchNode[];
}

interface ArchConnection {
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'dashed';
}

interface ArchDiagram {
  slug: string;
  category: 'stack' | 'flow' | 'pipeline';
  title: string;
  description: string;
  layers: ArchLayer[];
  connections: ArchConnection[];
}

/* ------------------------------------------------------------------ */
/*  Extraction                                                         */
/* ------------------------------------------------------------------ */

export function extractArchitecture(): ArchDiagram[] {
  const dir = root('docs/architecture');
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.json') && f !== 'schema.json')
    .sort();

  const diagrams: ArchDiagram[] = [];

  for (const file of files) {
    const raw = readFile(`docs/architecture/${file}`);
    const data: ArchDiagram = JSON.parse(raw);

    // Validate required fields
    if (!data.slug || !data.category || !data.title || !data.layers || !data.connections) {
      console.warn(`  ⚠ Skipping ${file}: missing required fields`);
      continue;
    }

    diagrams.push(data);
  }

  return diagrams;
}

// CLI entrypoint
const diagrams = extractArchitecture();
console.log(`Found ${diagrams.length} architecture diagram(s)`);
for (const d of diagrams) {
  const nodeCount = d.layers.reduce((s, l) => s + l.nodes.length, 0);
  console.log(
    `  - ${d.title} [${d.category}]: ${d.layers.length} layers, ${nodeCount} nodes, ${d.connections.length} connections`,
  );
}
writeJson('architecture.json', { diagrams });
