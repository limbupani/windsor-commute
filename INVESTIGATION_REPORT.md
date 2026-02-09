# Investigation Report: Welcome Screen Regression

**Date**: February 9, 2026  
**Branch**: fix/welcome-screen-regression  
**Investigator**: Copilot  
**Issue**: App shows old Expo template welcome screen instead of JaBo welcome screen

---

## Executive Summary

The welcome screen regression is caused by **incorrect root navigation configuration** in `app/_layout.tsx`. The app is anchored to the `(tabs)` group, which displays the old Expo template welcome screen, instead of anchoring to `select-role`, which contains the JaBo-branded welcome screen.

---

## Root Cause Analysis

### Primary Issue: Wrong Anchor in Root Layout

**File**: `app/_layout.tsx`  
**Severity**: Critical  
**Current State**:
```typescript
export const unstable_settings = {
  anchor: '(tabs)',  // ❌ WRONG - Anchors to tabs, not select-role
};

export default function RootLayout() {
  return (
    <ThemeProvider value={...}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
```

**Problem**: 
- The `anchor: '(tabs)'` configuration sets `(tabs)` as the initial route when the app loads
- This causes the app to display `app/(tabs)/index.tsx` first
- The `(tabs)/index.tsx` screen shows "Welcome to Windsor Commuter App!" - the old Expo template welcome screen
- Users never see the JaBo-branded `select-role` screen

### Secondary Issue: Missing Stack Screen Registrations

**File**: `app/_layout.tsx`

**Missing Routes**: The Stack is missing registrations for:
- `select-role` - Should be the entry point (contains JaBo welcome screen)
- `(rider)` - Rider user route group
- `(host)` - Driver/host user route group

These groups exist in the file system but are not registered in the Stack.Screen definitions, causing navigation errors when users try to navigate to them.

---

## Navigation Flow Analysis

### Expected Flow (According to Architecture Docs)
```
App Starts
    ↓
app/_layout.tsx (Root Layout)
    ↓
app/index.tsx (Redirects to /select-role)
    ↓
app/select-role/index.tsx (JaBo Welcome Screen) ✅ CORRECT
    ↓
User selects role
    ↓
Navigate to /(rider)/login or /(host)/login
```

### Current Broken Flow
```
App Starts
    ↓
app/_layout.tsx (Root Layout)
    ↓
anchor: '(tabs)' FORCES initial route to (tabs)
    ↓
app/(tabs)/index.tsx (Old Expo Welcome) ❌ WRONG
    ↓
User sees old template, not JaBo branding
```

---

## Evidence and Verification

### 1. JaBo Welcome Screen Exists and is Correct

**File**: `app/select-role/index.tsx` ✅

```typescript
export default function SelectRoleScreen() {
  // ... component code ...
  return (
    <View style={styles.container}>
      {/* Logo Section with JaBo branding */}
      <View style={styles.logoContainer}>
        <Text style={[styles.logoPart, { color: MINT_GREEN }]}>Ja</Text>
        <Text style={[styles.logoPart, { color: CHARCOAL }]}>Bo</Text>
      </View>
      
      {/* Tagline */}
      <Text style={styles.tagline}>Lets find. Lets go. JaBo!</Text>
      
      {/* Role Selection Buttons */}
      <TouchableOpacity style={styles.button} onPress={() => chooseRole('rider')}>
        <Text style={styles.buttonText}>I am a Rider</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => chooseRole('host')}>
        <Text style={styles.buttonText}>I am a Driver</Text>
      </TouchableOpacity>
    </View>
  );
}
```

**Status**: ✅ File exists, correct branding, proper navigation logic

### 2. Old Welcome Screen is Being Shown

**File**: `app/(tabs)/index.tsx`

Contains the Expo template welcome screen with:
- Parallax scroll view with React logo
- "Welcome to Windsor Commuter App!" title
- "Shouvik's first mobile app" subtitle
- Generic Expo template content

**This is what users currently see instead of JaBo branding.**

### 3. Root Index Correctly Routes to Select-Role

**File**: `app/index.tsx`

```typescript
import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/select-role" />;  // ✅ Correct redirect
}
```

**Status**: ✅ Correctly configured, but ignored because of `anchor: '(tabs)'`

### 4. Architecture Documentation

**File**: `docs/architecture.md`

Explicitly states:
> `/select-role/index.tsx` - Role selection screen **(ENTRY POINT)**

**Status**: ✅ Documentation is correct; implementation contradicts it

### 5. Commit History Shows This Was Never Fixed

**Commits Analyzed**:
- Initial commit (8a3b9cc): Uses `anchor: '(tabs)'` ❌
- PR #1 (01c078e): No changes to root layout, keeps `anchor: '(tabs)'` ❌
- PR #2 (cc1e82b, current main): No changes to root layout, keeps `anchor: '(tabs)'` ❌

**Analysis**: This issue was present from the initial commit and persists through all subsequent merges.

---

## Supporting Issues Found

### Issue A: Empty Host Layout File
**File**: `app/(host)/_layout.tsx`  
**Severity**: Critical  
**Status**: ✅ Recently fixed! (by PR #2 merge)

This file was empty and should have contained Stack configuration. The recent merge of PR #2 ("feat: remove header from driver login screen") added the proper configuration:
```typescript
import { Stack } from 'expo-router';

export default function HostLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
}
```

### Issue B: Empty Rider Layout File
**File**: `app/(rider)/_layout.tsx`  
**Severity**: Critical  
**Status**: ❌ Still empty (0 bytes)

This file is completely empty and needs Stack configuration for the rider route group.

---

## Impact Assessment

### What's Broken
1. ❌ Users see old Expo template instead of JaBo branding on app launch
2. ❌ The JaBo welcome screen at `/select-role` is completely bypassed
3. ❌ Navigation to `/(rider)` and `/(host)` groups will fail due to missing Stack.Screen registration
4. ❌ Users cannot properly select their role (Rider vs Driver) on app startup

### What's Working
1. ✅ The JaBo welcome screen file exists and has correct branding
2. ✅ The root `index.tsx` has correct redirect logic
3. ✅ Host layout was recently fixed (PR #2)
4. ✅ Architecture documentation is accurate

---

## Required Fixes (Not Applied Yet)

### Fix 1: Correct Root Layout Anchor and Add Missing Registrations

**File**: `app/_layout.tsx`

Change from:
```typescript
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
```

To:
```typescript
export const unstable_settings = {
  anchor: 'select-role',  // ✅ CORRECT - Anchor to select-role for JaBo welcome
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="select-role/index" options={{ headerShown: false, title: 'Select Role' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(rider)" options={{ headerShown: false }} />
        <Stack.Screen name="(host)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
```

### Fix 2: Add Missing Rider Layout Configuration

**File**: `app/(rider)/_layout.tsx`

Currently: Empty (0 bytes)

Should contain:
```typescript
import { Stack } from 'expo-router';

export default function RiderLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
```

---

## Testing Plan (For Next Phase)

Once fixes are applied, verify:

1. **App Launch**
   - Open app in Expo Go
   - Expected: See JaBo welcome screen with "Ja Bo" logo and "Lets find. Lets go. JaBo!" tagline
   - Verify: No Expo template or old welcome screen

2. **Role Selection**
   - Tap "I am a Rider" button
   - Expected: Navigate to rider login screen
   - Verify: AsyncStorage saves 'userRole' as 'rider'

3. **Driver Flow**
   - Start fresh, tap "I am a Driver" button
   - Expected: Navigate to driver/host login screen
   - Verify: AsyncStorage saves 'userRole' as 'host'

4. **Navigation Stack**
   - After role selection, verify user can navigate back (if configured)
   - Verify no "missing screen" errors in console

---

## Conclusion

The welcome screen regression is caused by a single critical configuration error in `app/_layout.tsx`:
- **Wrong anchor** pointing to `(tabs)` instead of `select-role`
- **Missing Stack.Screen registrations** for `select-role`, `(rider)`, and `(host)`

The JaBo welcome screen exists and is correct; it's just not being shown due to navigation misconfiguration. These are straightforward fixes that will restore the proper app flow and user experience.

---

## Files Referenced

1. `app/_layout.tsx` - Root layout with incorrect anchor
2. `app/index.tsx` - Root index with correct redirect (ignored)
3. `app/select-role/index.tsx` - JaBo welcome screen (correct, not shown)
4. `app/(tabs)/index.tsx` - Old Expo welcome (shown incorrectly)
5. `app/(host)/_layout.tsx` - Recently fixed host layout
6. `app/(rider)/_layout.tsx` - Still empty, needs fix
7. `docs/architecture.md` - Documentation (correct)
8. `CODE_REVIEW_REPORT.md` - Earlier code review (identifies layout issues)
