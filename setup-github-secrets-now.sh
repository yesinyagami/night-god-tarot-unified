#!/bin/bash

# Night God Tarot - GitHub Secrets Setup
# Run this to configure GitHub secrets from your .env file

echo "🌙 Setting up GitHub Secrets for Night God Tarot..."
echo ""

# Read values from .env
source .env 2>/dev/null || echo "Warning: .env file not found"

echo "🔑 Setting up ONLY the secrets that are actually needed..."
echo ""

# Essential secrets only
echo "Setting JWT_SECRET..."
gh secret set JWT_SECRET --body="$JWT_SECRET"

echo "Setting MONICA_API_KEY..."
gh secret set MONICA_API_KEY --body="$MONICA_API_KEY"

echo "Setting VITE_MONICA_API_KEY..."
gh secret set VITE_MONICA_API_KEY --body="$VITE_MONICA_API_KEY"

echo ""
echo "✅ Essential secrets configured!"
echo ""
echo "🚀 Your GitHub Actions workflows should now work!"
echo "🌙 Night God Tarot deployment will be successful!"

# Trigger a deployment
echo ""
echo "🔄 Triggering deployment..."
git commit --allow-empty -m "Trigger deployment after secrets setup"
git push origin main