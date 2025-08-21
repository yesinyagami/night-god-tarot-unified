# 🔐 GitHub Secrets Setup Guide
## Night God Tarot - API Keys & Environment Variables

Your `.env` file contains sensitive API keys that need to be configured as GitHub Secrets for proper deployment and security.

## 🚨 Current Status
- ❌ API keys are in local `.env` file only
- ❌ GitHub Secrets not configured
- ❌ Deployment will fail without proper secrets

## 📋 Step-by-Step GitHub Secrets Setup

### 1. Navigate to Your Repository Settings
Go to: `https://github.com/yesinyagami/night-god-tarot-unified/settings/secrets/actions`

### 2. Add These Required Secrets

Click **"New repository secret"** for each of the following:

#### 🤖 AI API Configuration
```
Name: MONICA_API_KEY
Value: sk-vj0VTDNuoEXtCZ9iwGEOWf96NBGGyvnIWmiVGAp6uBGGNh8r-6T8oWSOk9xhLsgvOyA1sOEPbyEUjKUBkngHC_gpFV4O
```

```
Name: VITE_MONICA_API_KEY  
Value: sk-vj0VTDNuoEXtCZ9iwGEOWf96NBGGyvnIWmiVGAp6uBGGNh8r-6T8oWSOk9xhLsgvOyA1sOEPbyEUjKUBkngHC_gpFV4O
```

```
Name: MONICA_BASE_URL
Value: https://openapi.monica.im
```

#### 🌤️ Weather & External APIs
```
Name: OPENWEATHER_API_KEY
Value: sk-PwwTmUrPusJ2oreBGKNiAtoIUkpiPK8pA0Oc3x8SJnHKvxfJNIT0ABPrllHCNUMYhz_n9_pyoE1-a9Bc4dtd_RcPuGx8
```

```
Name: VITE_OPENWEATHER_API_KEY
Value: sk-PwwTmUrPusJ2oreBGKNiAtoIUkpiPK8pA0Oc3x8SJnHKvxfJNIT0ABPrllHCNUMYhz_n9_pyoE1-a9Bc4dtd_RcPuGx8
```

```
Name: NEWS_API_KEY
Value: sk-PwwTmUrPusJ2oreBGKNiAtoIUkpiPK8pA0Oc3x8SJnHKvxfJNIT0ABPrllHCNUMYhz_n9_pyoE1-a9Bc4dtd_RcPuGx8
```

#### 🔐 Security Secrets
```
Name: JWT_SECRET
Value: NightGodTarotSecure2024JWTTokenSigningKey32CharMin4Ultimate
```

```
Name: ENCRYPTION_KEY
Value: NightGodTarotSecure2024KeyManager4DivineEncryptionUltimate
```

```
Name: APP_SECRET
Value: NightGodTarotAppSecret2024DivineSecureUltimateKey4Production
```

#### 💳 Payment Configuration
```
Name: BUYMEACOFFEE_WEBHOOK_SECRET
Value: nightgod-buymeacoffee-webhook-secure-2024
```

```
Name: IPASS_API_KEY
Value: nightgod-ipass-api-secure-2024
```

```
Name: IPASS_API_SECRET
Value: NightGod2024iPassSecretKeyForPaymentProcessing
```

#### 🗄️ Database Secrets
```
Name: DB_PASSWORD
Value: NightGod2024SecureDBPass4UltimateTarotSystem
```

```
Name: REDIS_PASSWORD
Value: NightGod2024SecureRedisPass4CachingSystem
```

#### 🔗 Webhook Security
```
Name: WEBHOOK_SECRET
Value: NightGod2024WebhookSecretKeyForSystemIntegrations
```

### 3. Verify Secrets Are Added
After adding all secrets, you should see them listed in your repository secrets page.

## 🚀 GitHub Actions Deployment Setup

### 4. Create Deployment Workflow
The workflow will automatically use these secrets for deployment.

### 5. Test Connection
Once secrets are added, your GitHub Actions can access:
- Monica AI API
- Weather services
- Payment processing
- Secure authentication

## ⚠️ Security Best Practices

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Rotate secrets periodically** - Update both local and GitHub secrets
3. **Use different secrets for production** - Generate new ones for live deployment
4. **Monitor secret usage** - Check GitHub Actions logs for any issues

## 🔍 Testing Secrets

After setup, test by:
1. Triggering a GitHub Action
2. Checking deployment logs
3. Verifying API connectivity in production

## 📞 Need Help?

If you encounter issues:
1. Check GitHub Actions logs
2. Verify secret names match exactly
3. Ensure no trailing spaces in secret values
4. Test API keys individually

---
*🌟 Generated with Claude Code - Secure by Design*