# 🛡️ Cloudflare Security Configuration Guide

## 🤖 AI Bot Protection (robots.txt)
✅ **COMPLETED**: `robots.txt` created and deployed
- Blocks AI training bots (GPTBot, Claude-Web, ChatGPT, etc.)
- Allows search engines for SEO (Google, Bing, DuckDuckGo)
- Protects sensitive directories (/api/, /admin/, etc.)

## 🔥 Under Attack Mode Configuration

### When to Enable:
- Heavy DDoS attacks
- Unusual traffic spikes
- Suspicious bot activity
- Performance issues from attacks

### How to Enable:
1. **Login to Cloudflare Dashboard**
2. **Navigate to Security → Settings**
3. **Click "Under Attack Mode" toggle**
4. **Visitors will see JavaScript challenge**

### Settings:
```
Security Level: I'm Under Attack!
Challenge Passage: 5 seconds
Browser Integrity Check: ON
```

## 🚀 Development Mode Configuration

### When to Enable:
- Testing website changes
- Debugging cache issues
- Real-time development

### How to Enable:
1. **Cloudflare Dashboard → Caching → Configuration**
2. **Toggle "Development Mode" ON**
3. **Cache bypass active for 3 hours**

### Impact:
- Bypasses Cloudflare cache
- Shows origin server changes immediately
- Auto-disables after 3 hours

## 🔧 Recommended Security Settings

### Security Level:
```
Medium - Challenge bad visitors
```

### Bot Fight Mode:
```
ON - Block bad bots automatically
```

### Browser Integrity Check:
```
ON - Check browser headers
```

### Hotlink Protection:
```
ON - Prevent image theft
```

### Rate Limiting:
```
Enabled for /api/* endpoints
10 requests per minute per IP
```

## 📊 Page Rules for Protection

### Rule 1: API Protection
```
URL: yesinyagami.github.io/night-god-tarot-unified/api/*
Settings:
- Security Level: High
- Cache Level: Bypass
- Disable Apps
```

### Rule 2: Static Assets
```
URL: yesinyagami.github.io/night-god-tarot-unified/assets/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
- Browser Cache TTL: 1 month
```

## 🎯 Quick Actions Summary

### ✅ Completed:
- robots.txt deployed with AI bot blocking
- Sitemap.xml created for SEO
- Security configuration documented

### 🔧 Manual Setup Required:
1. **Enable Under Attack Mode** (when needed)
2. **Configure Development Mode** (when testing)
3. **Set up Page Rules** (for API protection)
4. **Configure Rate Limiting** (for abuse prevention)

## 🚨 Emergency Procedures

### If Under Heavy Attack:
1. Enable "Under Attack Mode" immediately
2. Check Firewall Events for attack patterns
3. Create custom firewall rules if needed
4. Monitor Analytics for impact

### If Site Not Loading:
1. Enable "Development Mode"
2. Purge all cache
3. Check origin server status
4. Verify DNS settings

Your Night God Tarot site is now protected from AI training bots while maintaining SEO visibility! 🌟