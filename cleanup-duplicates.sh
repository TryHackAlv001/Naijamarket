#!/bin/bash

# This script removes duplicate route folders that conflict with Next.js App Router route groups

echo "🧹 Cleaning up duplicate route folders..."
echo ""

cd /workspaces/Orderit/src/app

# Remove duplicate login folder (re-exports from (auth)/login)
if [ -d "login" ]; then
    rm -rf login
    echo "✅ Deleted: src/app/login/"
else
    echo "ℹ️  src/app/login/ not found (already deleted)"
fi

# Remove duplicate register folder (re-exports from (auth)/register)
if [ -d "register" ]; then
    rm -rf register
    echo "✅ Deleted: src/app/register/"
else
    echo "ℹ️  src/app/register/ not found (already deleted)"
fi

# Remove duplicate auth folder (conflicts with (auth) route group)
if [ -d "auth" ]; then
    rm -rf auth
    echo "✅ Deleted: src/app/auth/"
else
    echo "ℹ️  src/app/auth/ not found (already deleted)"
fi

# Move contents from main/ to (main)/ if both exist
if [ -d "main" ] && [ -d "(main)" ]; then
    echo ""
    echo "📦 Merging main/ into (main)/ route group..."
    
    # Copy all contents from main/ to (main)/
    cp -r main/* "(main)/" 2>/dev/null || true
    
    # Remove the old main/ folder
    rm -rf main
    echo "✅ Merged: src/app/main/ → src/app/(main)/"
fi

echo ""
echo "📁 Final directory structure of src/app/:"
ls -la

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm run build"
echo "2. Run: npm run dev"
echo "3. Verify no errors in the build output"
