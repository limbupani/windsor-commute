# Agent Knowledge Base

**Last Updated**: February 9, 2026  
**Purpose**: Permanent, cumulative record of known issues, fixes, architectural rules, and guardrails for the Jabo project.

---

## Overview

This file serves as the **agent's engineering memory and decision guardrail**. It documents:
- Known issues and their root causes
- Architectural rules and patterns
- Fixes that have been applied and their outcomes
- Prevention strategies for common regressions

**Important**: The agent MUST:
1. **Read this file before starting any task** - Check for relevant guardrails and known issues
2. **Update this file when discovering/fixing issues** - Append to Issue Log and refine guardrails
3. **Never delete past entries** - Only append new information
4. **Follow all Global Guardrails** - These are non-negotiable architectural rules
5. **Reference this file in PR descriptions** when applicable

---

## Global Guardrails

### Navigation and Routing

- **✓ Rule 1: Root Anchor Verification**
  - The app entry point is controlled by `app/_layout.tsx` → `anchor` setting
  - Current correct anchor: `'select-role'` (displays JaBo-branded welcome screen)
  - **BEFORE any navigation changes**: Verify the anchor is intentional and correct
  - **NEVER**: Anchor to `(tabs)` or any other route group as the primary entry point
  - **Why**: Incorrect anchor causes screens to be bypassed entirely, creating regressions

- **✓ Rule 2: Route Group Layout Files**
  - Every route group (designated by parentheses like `(host)`, `(rider)`, `(tabs)`) MUST have a `_layout.tsx` file
  - Each `_layout.tsx` MUST define a Stack with all child screens registered
  - **Pattern**: 
    ```typescript
    import { Stack } from 'expo-router';
    
    export default function GroupLayout() {
      return (
        <Stack>
          <Stack.Screen name="screen1" options={{ headerShown: false }} />
          <Stack.Screen name="screenN" options={{ headerShown: false }} />
        </Stack>
      );
    }
    ```
  - **NEVER**: Leave a `_layout.tsx` file empty (0 bytes)
  - **Why**: Empty layout files break navigation within that route group

- **✓ Rule 3: Root Stack Configuration**
  - The root `app/_layout.tsx` MUST register ALL route groups using Stack.Screen
  - Current required registrations (as of Feb 9, 2026):
    - `select-role/index` - JaBo welcome screen (ENTRY POINT)
    - `(tabs)` - Tabbed interface for future features
    - `(rider)` - Rider user flows
    - `(host)` - Driver/host user flows
    - `modal` - Modal overlays
  - **NEVER**: Register only a subset of route groups
  - **NEVER**: Forget to register any existing route group
  - **Why**: Unregistered route groups cause "screen not found" navigation errors

- **✓ Rule 4: Select Role as Primary Entry Point**
  - Unless explicitly changed by project requirements, `select-role` MUST remain the app's entry point
  - This is where users first encounter the JaBo branding and make their role selection
  - **Before changing**: Get explicit approval and document the rationale
  - **After changing**: Update this guardrail immediately
  - **Why**: Select-role is the user onboarding gateway; changing it breaks the entire flow

- **✓ Rule 5: Navigation Sanity Check**
  - Before submitting ANY PR that touches navigation:
    1. Verify all route files exist (use `find app -name "_layout.tsx" -o -name "index.tsx"`)
    2. Verify all referenced files in Stack.Screen registrations exist
    3. Check TypeScript compilation (npx tsc --noEmit)
    4. Confirm anchor points to the intended entry screen
    5. Trace the navigation flow from root to child routes
  - **Why**: Catching navigation issues early prevents user-facing regressions

- **✓ Rule 6: Header Configuration Consistency**
  - All screens should have consistent header handling
  - Current pattern: Most screens use `headerShown: false` for minimal UI
  - **BEFORE changing**: Understand the impact on screen appearance
  - **NEVER**: Leave header configuration inconsistent across similar flows
  - **Why**: Inconsistent headers create poor UX and visual artifacts

### File Structure and Naming

- **✓ Rule 7: Layout File Naming**
  - Route group layouts MUST be named `_layout.tsx` (with underscore prefix)
  - Screen files MUST be named appropriately (e.g., `login.tsx`, `home.tsx`, `index.tsx`)
  - **NEVER**: Use incorrect naming patterns
  - **Why**: Expo Router relies on convention; incorrect naming breaks routing

- **✓ Rule 8: Index Files in Route Groups**
  - Each route group directory SHOULD have an `index.tsx` file
  - If the index redirects to another screen, that's acceptable
  - **Example**: `app/(host)/index.tsx` → redirects to `/(host)/home`
  - **Why**: Index files provide a default entry point for the group

### Code Review and Verification

- **✓ Rule 9: PR Required Checks**
  - Every PR touching navigation MUST include:
    - Clear description of what changed and why
    - List of all modified files
    - Verification steps (what was checked)
    - Known side effects or impacts
    - References to this knowledge base (if applicable)
  - **NEVER**: Merge a navigation PR without verification details
  - **Why**: Documentation prevents future confusion and aids debugging

- **✓ Rule 10: Investigation Before Fixes**
  - If a regression is suspected, investigate BEFORE applying fixes
  - Document findings in INVESTIGATION_REPORT.md or similar
  - Include root cause analysis and evidence
  - **NEVER**: Apply fixes without understanding the problem
  - **Why**: Blind fixes can create new problems or miss the real issue

---

## Issue Log (Cumulative)

### Issue #1: Welcome Screen Regression (FIXED ✅)

**Date Discovered**: February 9, 2026  
**Severity**: Critical  
**Status**: FIXED and merged to main

**Summary**:
The app was displaying the old Expo template welcome screen ("Welcome to Windsor Commuter App!") instead of the JaBo-branded welcome screen with role selection.

**Root Cause**:
1. **Primary**: `app/_layout.tsx` had `anchor: '(tabs)'` instead of `anchor: 'select-role'`
   - This forced the app to load the tabs screen first, bypassing select-role entirely
   - The tabs screen contains the old Expo template, not JaBo branding

2. **Secondary**: Missing Stack.Screen registrations in root layout
   - `select-role`, `(rider)`, and `(host)` were not registered
   - This caused navigation errors when users tried to navigate to these routes

3. **Tertiary**: Empty `app/(rider)/_layout.tsx` file
   - No Stack configuration for rider route group
   - Similar to the earlier empty `app/(host)/_layout.tsx` issue

**Fix Applied**:
1. ✅ Changed root anchor from `'(tabs)'` to `'select-role'`
2. ✅ Added Stack.Screen registrations for all route groups in `app/_layout.tsx`:
   - `select-role/index` (ENTRY POINT)
   - `(tabs)`
   - `(rider)`
   - `(host)`
   - `modal`
3. ✅ Implemented missing `app/(rider)/_layout.tsx` with proper Stack configuration

**How to Prevent Recurrence**:
- **Global Guardrails Created**:
  - Rule 1: Root Anchor Verification
  - Rule 2: Route Group Layout Files
  - Rule 3: Root Stack Configuration
  - Rule 4: Select Role as Primary Entry Point
  - Rule 5: Navigation Sanity Check
- **Investigation Approach**: Created INVESTIGATION_REPORT.md documenting the analysis
- **Future**: Check this knowledge base before modifying navigation
- **Monitoring**: Use Navigation Sanity Check (Rule 5) on all navigation PRs

**Commits**:
- `66cf284` - fix: restore jabo welcome screen by correcting root navigation (#3)

**Related Files**:
- `INVESTIGATION_REPORT.md` - Full technical analysis
- `app/_layout.tsx` - Root layout (fixed)
- `app/(rider)/_layout.tsx` - Rider layout (implemented)

---

## Architectural Patterns

### Correct Navigation Structure

**Entry Point Flow** (as of Feb 9, 2026):
```
app/_layout.tsx (Root Stack)
  └─ anchor: 'select-role' ✅
       ├─ select-role/index  (JaBo Welcome + Role Selection)
       │   ├─ (rider)/login  (Rider Login)
       │   └─ (host)/login   (Driver Login)
       │
       ├─ (tabs)/_layout.tsx  (Tabbed Interface)
       ├─ (rider)/_layout.tsx  (Rider Flows)
       ├─ (host)/_layout.tsx   (Driver Flows)
       └─ modal (Modal Overlays)
```

**Key Properties**:
- All route groups have valid `_layout.tsx` with Stack configuration
- All groups are registered in root Stack
- Anchor points to select-role (user entry gateway)
- Headers are disabled for clean, full-screen design
- AsyncStorage tracks user role for persistent state

### Code Example Template

When creating new route groups, follow this template:

**Route Group Layout** (`app/(groupname)/_layout.tsx`):
```typescript
import { Stack } from 'expo-router';

export default function GroupNameLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="screen1" options={{ headerShown: false, title: 'Screen 1' }} />
      <Stack.Screen name="screeen2" options={{ headerShown: false, title: 'Screen 2' }} />
    </Stack>
  );
}
```

**Root Layout Registration**:
```typescript
<Stack.Screen name="(groupname)" options={{ headerShown: false }} />
```

---

## Future Issues and Updates

This section will be updated when new issues are discovered or fixed.

**Placeholder for Issue #2** (when discovered):
- Date: TBD
- Summary: TBD
- Root Cause: TBD
- Fix: TBD
- Prevention: TBD

---

## Appendix: Key Files and Locations

| File | Purpose | Status |
|------|---------|--------|
| `app/_layout.tsx` | Root layout, entry point config | ✅ Correct |
| `app/index.tsx` | App root, redirects to select-role | ✅ Correct |
| `app/select-role/index.tsx` | JaBo welcome screen, role selection | ✅ Correct |
| `app/(rider)/_layout.tsx` | Rider route group layout | ✅ Implemented |
| `app/(host)/_layout.tsx` | Driver route group layout | ✅ Implemented |
| `app/(tabs)/_layout.tsx` | Tabs route group layout | ✅ Configured |
| `docs/architecture.md` | Architecture documentation | ✅ Correct |
| `INVESTIGATION_REPORT.md` | Welcome regression investigation | ✅ Completed |
| `docs/agent-knowledge-base.md` | This file (agent memory) | ✅ Created |

---

## Document Change History

| Date | Change | Author |
|------|--------|--------|
| Feb 9, 2026 | Initial creation with welcome screen regression details | Copilot |
| TBD | Add Issue #2 details | TBD |
| TBD | Add Issue #3 details | TBD |

