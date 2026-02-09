# Diagnostic Scan Prompt

## Purpose

This file contains a reusable diagnostic prompt for conducting comprehensive system scans of the Jabo codebase. It should be used whenever:
- New features are added to the navigation structure
- Major refactoring occurs
- Build errors are encountered
- Regressions are suspected
- As part of regular maintenance (e.g., weekly or bi-weekly)
- After merging large PRs that touch core architecture

The diagnostic scan identifies TypeScript errors, broken navigation flows, missing imports, incorrect file structures, invalid route configurations, runtime issues, and regressions that would cause the app to fail in Expo Go.

---

## When to Run This Diagnostic

**Mandatory Triggers**:
- Any changes to `app/_layout.tsx` (root layout)
- Any changes to route group `_layout.tsx` files
- Adding or removing route groups
- Adding or removing screen files
- Changes to navigation anchors or entry points
- After merging navigation-related PRs

**Recommended Schedule**:
- Before every release (beta, production)
- Before and after major refactoring
- Weekly on main branch (if high development velocity)
- Whenever developers encounter "screen not found" errors

**Optional**:
- After routine feature development
- Quarterly as preventive maintenance

---

## Diagnostic Prompt

Run this diagnostic when you need to scan the entire codebase for issues:

---

### Full System Diagnostic Scan Prompt

**Task**: Run a full diagnostic scan of the entire codebase to identify any errors, regressions, broken navigation flows, missing imports, incorrect file structures, invalid route configurations, or runtime issues that would cause the app to fail in Expo Go.

**Diagnostic Requirements**:
- Analyze all navigation entry points, including app/_layout.tsx, route groups, and index files
- Validate that all route groups have proper _layout.tsx files
- Check for missing or incorrect imports, unused components, or circular dependencies
- Verify that all screens referenced in navigation exist and are correctly named
- Identify any TypeScript errors, JSX errors, or runtime-breaking patterns
- Confirm that the initial route and anchor configuration match the intended architecture
- Detect any regressions introduced by recent merges
- Document all findings in a file named DIAGNOSTIC_REPORT.md inside the diagnosed branch

**Rules**:
- Do not apply any fixes yet
- Present all issues clearly, grouped by severity (Critical, High, Medium, Low)
- For each issue, include:
  • File path
  • Description of the problem
  • Why it breaks the app
  • Suggested fix (but do not implement it)
- If no issues are found, explicitly state that the system passed all checks

**Knowledge Base Update**:
- If new issues or patterns are discovered, append a new entry to docs/agent-knowledge-base.md under the "Issue Log" and update the "Global Guardrails" section with any new rules that should prevent recurrence

**After Completing the Diagnostic Scan**:
- Commit DIAGNOSTIC_REPORT.md and any updates to agent-knowledge-base.md
- Push the branch
- Open a PR into main summarizing the diagnostic findings
- Notify the team when the PR is ready for review

---

## Key Areas to Check

### 1. Navigation Entry Points

- [ ] Root layout anchor (`app/_layout.tsx`) points to correct entry screen
- [ ] Anchor value matches an actual route group or screen
- [ ] Entry screen is the intended JaBo welcome screen (`select-role/index`)

### 2. Route Group Structure

- [ ] Every route group has a `_layout.tsx` file
- [ ] Every `_layout.tsx` defines a Stack with screens registered
- [ ] No empty or stub `_layout.tsx` files exist
- [ ] No duplicate route definitions

### 3. Index Files

- [ ] Every route group has an `index.tsx` file (or is explicitly omitted)
- [ ] No `index.tsx` file is empty (0 bytes)
- [ ] All index files export a default component or redirect

### 4. Navigation Registration

- [ ] Root Stack registers all route groups
- [ ] All route groups are accessible from root layout
- [ ] No circular navigation paths exist

### 5. File Existence

- [ ] All files referenced in navigation exist
- [ ] No broken imports or missing components
- [ ] All assets referenced exist in `assets/` directory

### 6. TypeScript Validation

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] All navigation paths use correct syntax
- [ ] No type mismatches in props or navigation parameters

### 7. File Structure Consistency

- [ ] No orphaned files that contradict other implementations
- [ ] No duplicate screens for the same logical screen
- [ ] Naming conventions followed consistently

### 8. Recent Changes

- [ ] No regressions from recent merges
- [ ] Navigation still works after latest PRs
- [ ] Anchors unchanged unless explicitly modified

---

## Diagnostic Output Template

```markdown
# Diagnostic Report: [Date]

**Overall Assessment**: [EXCELLENT/GOOD/MEDIOCRE/POOR]

## Issues Found: [COUNT]

### Critical Issues: [N]
### High Priority Issues: [N]
### Medium Priority Issues: [N]
### Low Priority Issues: [N]

## Issues by Severity

### CRITICAL ISSUES
[List with file, description, impact, suggested fix]

### HIGH PRIORITY ISSUES
[List with file, description, impact, suggested fix]

### MEDIUM PRIORITY ISSUES
[List with file, description, impact, suggested fix]

### LOW PRIORITY ISSUES
[List with file, description, impact, suggested fix]

## Verification Results

- [ ] TypeScript compilation passes
- [ ] Navigation structure validated
- [ ] All route groups have proper configs
- [ ] All index files have content
- [ ] No duplicate files
- [ ] Architecture matches documentation

## Recommendations

[Suggested fixes and preventive measures]
```

---

## Integration with Agent Knowledge Base

The diagnostic prompt is designed to work with `docs/agent-knowledge-base.md`:

1. **Before running**: Read the knowledge base for known issues and guardrails
2. **During scan**: Check findings against existing guardrails in Rule sections
3. **After scan**: Update knowledge base with:
   - New Issue entries (following Issue #1, Issue #2 format)
   - New Guardrail rules if patterns emerge
   - Updated prevention strategies

---

## Updating This Prompt

Over time, as the diagnostic process evolves, this file should be updated with:

- New checks discovered to be important
- Removal of checks that become obsolete
- Updates to the checklist based on new guardrails
- Refinements to the output template
- New integration insights

**Maintenance Schedule**: Review this prompt whenever a major architectural change occurs or after discovering a new class of issues.

When updating, preserve this file's structure and add a dated entry to the section below.

---

## Diagnostic Prompt History

| Date | Change | Reason |
|------|--------|--------|
| Feb 9, 2026 | Initial creation | Formalized diagnostic process from Issue #2 investigation |
| TBD | [Future updates] | [Reason] |

---

## Related Documentation

- `DIAGNOSTIC_REPORT.md` - Latest diagnostic report output
- `docs/agent-knowledge-base.md` - Archived issues and guardrails
- `docs/architecture.md` - Architecture reference for validation
