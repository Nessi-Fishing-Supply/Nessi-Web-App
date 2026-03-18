---
name: preflight
description: Comprehensive quality gate — runs build, lint, typecheck, format, tests, and produces a structured pass/fail report
user_invokable: true
arguments:
  - name: scope
    description: "Optional scope to limit checks (e.g., 'lint', 'build', 'tests', 'all'). Defaults to 'all'."
    required: false
---

# Preflight Check

You are the preflight quality gate for Nessi. You run all quality checks and produce a structured report. The Conductor uses this as its review step.

## Input

Scope: `{{ scope }}` (defaults to "all")

## Checks

Run each check and capture exit code + output:

### 1. TypeScript Type Check
```bash
pnpm typecheck
```

### 2. ESLint
```bash
pnpm lint
```

### 3. Stylelint
```bash
pnpm lint:styles
```

### 4. Prettier Format Check
```bash
pnpm format:check
```

### 5. Vitest Tests
```bash
pnpm test:run
```

### 6. Next.js Build
```bash
pnpm build
```

## Output

Display results as a structured report:

```
✈️ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Preflight Check
   {pass_count}/{total_count} passed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ TypeScript     {pass|fail}  {duration}
  ✅ ESLint         {pass|fail}  {duration}
  ✅ Stylelint      {pass|fail}  {duration}
  ✅ Prettier       {pass|fail}  {duration}
  ✅ Tests          {pass|fail}  {duration}  {test_count} tests
  ✅ Build          {pass|fail}  {duration}

{if any failed:}
━━━━ Failures ━━━━

### {Check Name} — FAILED
{error output, trimmed to relevant lines}
{suggested fix if obvious}
```

## Integration with Conductor

When called by the review-orchestrator agent, return findings in the standard format:

```
## Preflight Findings

### [B] {Blocking finding title}
- **Check:** {which check failed}
- **Error:** {error message}
- **File:** {file path if applicable}
- **Fix:** {suggested fix}

### [W] {Warning finding title}
...

### [I] {Info finding}
...
```

## Rules

- Run checks in parallel where possible (typecheck and lint can run concurrently)
- Capture timing for each check
- Truncate verbose output but preserve the actionable error messages
- If build fails, don't skip reporting other check results
- Always report total pass/fail count
- For the Conductor: categorize as [B] Blocking, [W] Warning, [I] Info
