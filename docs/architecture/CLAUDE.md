# Architecture Diagrams — Source of Truth

This directory contains structured JSON architecture diagrams that document the Nessi system architecture. These are the **single source of truth** for architecture visualization in the nessi-docs app.

## Purpose

Architecture files power the **nessi-docs** app where they're extracted, parsed, and rendered as interactive system diagrams for:

- **Tech stack visualization** — layered view of all technologies and their relationships
- **Data flow diagrams** — how data moves between browser, server, and database
- **Pipeline diagrams** — autonomous workflows like the conductor and agent systems
- **Onboarding** — new team members can see the entire system architecture at a glance

## Diagram Categories

| Category   | Description                                         | Examples                  |
| ---------- | --------------------------------------------------- | ------------------------- |
| `stack`    | Layered dependency graph showing technology layers  | Tech stack                |
| `flow`     | Directional data movement between system components | Data flow                 |
| `pipeline` | Sequential workflow with branching and loops        | Conductor, agent pipeline |

## Schema

All architecture files must conform to `schema.json` in this directory. Key structure:

- **`layers`** — Grouped containers of nodes (e.g., "Frontend", "Backend", "Infrastructure")
- **`nodes`** — Individual components within a layer (e.g., "Next.js 16", "PostgreSQL")
- **`connections`** — Directed edges between nodes with labels describing the relationship

### Node Fields

| Field      | Required | Description                                                      |
| ---------- | -------- | ---------------------------------------------------------------- |
| `id`       | Yes      | Unique identifier across the entire diagram                      |
| `label`    | Yes      | Display text for the node                                        |
| `sublabel` | No       | Secondary text (version, file path, model name)                  |
| `icon`     | No       | Icon identifier for visual enhancement                           |
| `url`      | No       | External link (docs, GitHub file)                                |
| `tooltip`  | No       | Rich description shown on hover — use for implementation details |

### Connection Fields

| Field   | Required | Description                                              |
| ------- | -------- | -------------------------------------------------------- |
| `from`  | Yes      | Source node ID                                           |
| `to`    | Yes      | Target node ID                                           |
| `label` | No       | Edge label (e.g., "fetch", "deploy", "RLS")              |
| `style` | No       | `solid` (default) or `dashed` for indirect relationships |

## File Naming

Files use `{topic}.json` naming matching the diagram slug (e.g., `tech-stack.json`, `data-flow.json`, `conductor-pipeline.json`).

## What Makes a Good Architecture Diagram

### Code-Accurate Nodes

Every node must reflect a real technology, service, or component in the codebase:

- **`tooltip`** — explain what the component does and how it's configured
- **`sublabel`** — include version, file path, or other identifying detail
- **`url`** — link to relevant docs or source code when helpful

### Accurate Connections

Connections represent real data flow, dependencies, or invocations:

- Label connections with the mechanism (e.g., "fetch", "useQuery", "deploy", "RLS policy check")
- Use `dashed` style for indirect or optional relationships
- Every connection should be verifiable by reading the source code

### Complete Coverage

Diagrams should capture the full picture within their scope:

- All major technologies in the stack
- All data paths between components
- All agents and skills in a pipeline
- All inputs and outputs of a workflow

## Extraction & Integration

This directory is an **extraction location** for the nessi-docs pipeline. Files are:

1. Read by the docs data extraction pipeline
2. Validated against `schema.json`
3. Rendered as interactive canvas visualizations in nessi-docs
4. Deep-linked from other views (journeys, features, data model)

**Do not add non-JSON files** to this directory other than this CLAUDE.md and schema.json.

## When to Update

Update architecture diagrams when:

- A new technology is added to or removed from the stack
- Data flow patterns change (new API layer, new storage, new auth pattern)
- The conductor pipeline gains new agents or skills
- Infrastructure changes (new CI steps, new deploy target, new monitoring)
- Agent models are changed (Sonnet → Opus, etc.)
