#!/bin/bash

# Fix all resolveAvatarUrl calls to only pass one parameter (the avatar URL)
# This ensures avatars are only taken from the database, never generated

echo "Fixing resolveAvatarUrl calls to use single parameter..."

# Fix all TypeScript/React files
find frontend/src -name "*.tsx" -o -name "*.ts" | while read file; do
    # Skip the avatar.ts file itself
    if [[ "$file" == *"avatar.ts"* ]]; then
        continue
    fi
    
    # Replace resolveAvatarUrl calls with two parameters to use only one
    # This regex handles various formats
    sed -i '' -E 's/resolveAvatarUrl\(([^,]+),\s*[^)]+\)/resolveAvatarUrl(\1)/g' "$file"
done

echo "Done! All resolveAvatarUrl calls now use only the avatar URL from the database."
