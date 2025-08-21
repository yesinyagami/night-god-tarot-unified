# 🌐 Custom Domain Setup Guide

## Step 1: Buy Domain
1. Go to **Namecheap.com** or **Cloudflare.com**
2. Search for: `nightgodtarot.com` or `nightgod-tarot.com`
3. Purchase for $12/year

## Step 2: Configure DNS
Add these DNS records:
```
Type: CNAME
Name: www
Value: yesinyagami.github.io

Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

## Step 3: Update GitHub Pages
1. Go to GitHub → Settings → Pages
2. Add custom domain: `nightgodtarot.com`
3. Enable "Enforce HTTPS"

## Step 4: Update Code
```bash
# Add CNAME file
echo "nightgodtarot.com" > public/CNAME

# Update vite.config.js
base: process.env.NODE_ENV === 'production' ? '/' : '/',
```

**Result:** Professional URL instead of github.io subdomain