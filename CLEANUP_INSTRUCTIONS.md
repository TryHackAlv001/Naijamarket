# Duplicate Route Cleanup Instructions

## Problem
Next.js App Router error: "You cannot have two parallel pages that resolve to the same path"
- `/(auth)/login` and `/login` both resolve to `/login`
- `/(auth)/register` and `/register` both resolve to `/register`

## Root Cause Analysis ✅

I've verified the following duplicates exist:

### Duplicates to Remove:

1. **`src/app/login/page.tsx`** - Re-exports from `(auth)/login`
   ```
   export { default } from "../(auth)/login/page";
   ```

2. **`src/app/register/page.tsx`** - Re-exports from `(auth)/register`
   ```
   export { default } from "../(auth)/register/page";
   ```

3. **`src/app/auth/`** - Duplicates the `(auth)` route group

4. **`src/app/main/`** - Should be merged into `(main)` route group

### Correct Files to Keep:

✅ `src/app/(auth)/layout.tsx`
✅ `src/app/(auth)/login/page.tsx`
✅ `src/app/(auth)/register/page.tsx`

## How to Delete (Choose One Method)

### Method 1: VS Code File Explorer (Easiest)
1. Open the VS Code File Explorer (Ctrl+Shift+E)
2. Navigate to `src/app/`
3. Right-click each folder and select "Delete":
   - `login/`
   - `register/`
   - `auth/`
   - `main/`
4. Confirm deletion for each

### Method 2: Integrated Terminal Commands
Open VS Code Terminal (Ctrl+`) and paste this single command:

```bash
cd /workspaces/Orderit/src/app && rm -rf login register auth && mv main/* "(main)/" 2>/dev/null && rm -rf main && echo "✅ Cleanup complete!"
```

Or individually:
```bash
cd /workspaces/Orderit/src/app
rm -rf login register auth
mv main/* "(main)/"
rm -rf main
ls -la  # Verify the result
```

### Method 3: Provided Shell Script
Execute the script I created:
```bash
bash /workspaces/Orderit/cleanup-duplicates.sh
```

## Verify Navigation Links ✅

I've confirmed the navigation links are correct and will work after cleanup:

**In `src/components/layout/Navbar.tsx`:**
- Line 311: `<Link href="/login"` ✅
- Line 314: `<Link href="/register"` ✅
- Line 380: `<Link href="/login"` ✅
- Line 383: `<Link href="/register"` ✅

**Why these still work:**
- Route groups `(auth)` don't affect the URL path
- `/login` requests are correctly routed to `/(auth)/login/page.tsx`
- `/register` requests are correctly routed to `/(auth)/register/page.tsx`

## Expected Final Folder Structure

After cleanup, your `src/app/` directory should be:

```
src/app/
├── (auth)/                    ✅ Keep (Login/Register route group)
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── (main)/                    ✅ Keep (main app routes - with merged content from main/)
│   ├── layout.tsx
│   ├── buyer/
│   ├── checkout/
│   ├── marketplace/
│   ├── messages/
│   ├── page.tsx
│   ├── product/
│   └── vendor/
├── api/                       ✅ Keep (API routes)
│   ├── messages/
│   ├── notifications/
│   ├── payments/
│   ├── reviews/
│   └── vendor/
├── buyer/                     ✅ Keep
├── checkout/                  ✅ Keep
├── forgot-password/           ✅ Keep
├── marketplace/               ✅ Keep
├── vendor/                    ✅ Keep
├── favicon.ico                ✅ Keep
├── globals.css                ✅ Keep
├── layout.tsx                 ✅ Keep
└── page.tsx                   ✅ Keep

❌ DELETE THESE:
├── login/                     ❌ DUPLICATE
├── register/                  ❌ DUPLICATE
├── auth/                      ❌ DUPLICATE (use (auth) group)
└── main/                      ❌ MERGE TO (main) group
```

## Verification Steps

After deletion, run these commands:

```bash
# 1. Verify the (auth) route group still has the pages
ls -la /workspaces/Orderit/src/app/\(auth\)/

# 2. Verify (main) route group exists
ls -la /workspaces/Orderit/src/app/\(main\)/

# 3. Build the Next.js app (should succeed with no errors)
npm run build

# 4. Start the dev server
npm run dev

# 5. Test the routes
# - Navigate to http://localhost:3000/login
# - Navigate to http://localhost:3000/register
# - Check browser console for any errors
```

## Next.js Route Group Documentation

**Important Note:** Route groups in parentheses like `(auth)` and `(main)` are for organization only. They:
- ✅ Don't appear in the URL path
- ✅ Allow logical grouping of routes
- ✅ Prevent duplicate route conflicts
- ❌ Don't affect how users access the routes

So even though login is in `(auth)/login/page.tsx`, users still access it at `/login`.

---

**Status:** Ready for cleanup ✅
**Action Required:** Choose one deletion method above and execute it
**Expected Result:** Build completes with zero errors
