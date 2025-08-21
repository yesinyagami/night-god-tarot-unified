#!/bin/bash
# 🔐 GitHub Secrets Setup Commands
echo "🔐 Setting up GitHub repository secrets..."

gh secret set MONICA_API_KEY --body "sk-vj0VTDNuoEXtCZ9iwGEOWf96NBGGyvnIWmiVGAp6uBGGNh8r-6T8oWSOk9xhLsgvOyA1sOEPbyEUjKUBkngHC_gpFV4O"
gh secret set VITE_MONICA_API_KEY --body "sk-vj0VTDNuoEXtCZ9iwGEOWf96NBGGyvnIWmiVGAp6uBGGNh8r-6T8oWSOk9xhLsgvOyA1sOEPbyEUjKUBkngHC_gpFV4O"
gh secret set MONICA_BASE_URL --body "https://openapi.monica.im"
gh secret set OPENWEATHER_API_KEY --body "sk-PwwTmUrPusJ2oreBGKNiAtoIUkpiPK8pA0Oc3x8SJnHKvxfJNIT0ABPrllHCNUMYhz_n9_pyoE1-a9Bc4dtd_RcPuGx8"
gh secret set VITE_OPENWEATHER_API_KEY --body "sk-PwwTmUrPusJ2oreBGKNiAtoIUkpiPK8pA0Oc3x8SJnHKvxfJNIT0ABPrllHCNUMYhz_n9_pyoE1-a9Bc4dtd_RcPuGx8"
gh secret set NEWS_API_KEY --body "sk-PwwTmUrPusJ2oreBGKNiAtoIUkpiPK8pA0Oc3x8SJnHKvxfJNIT0ABPrllHCNUMYhz_n9_pyoE1-a9Bc4dtd_RcPuGx8"
gh secret set VITE_NEWS_API_KEY --body "sk-PwwTmUrPusJ2oreBGKNiAtoIUkpiPK8pA0Oc3x8SJnHKvxfJNIT0ABPrllHCNUMYhz_n9_pyoE1-a9Bc4dtd_RcPuGx8"
gh secret set JWT_SECRET --body "NightGodTarotSecure2024JWTTokenSigningKey32CharMin4Ultimate"
gh secret set ENCRYPTION_KEY --body "NightGodTarotSecure2024KeyManager4DivineEncryptionUltimate"
gh secret set APP_SECRET --body "NightGodTarotAppSecret2024DivineSecureUltimateKey4Production"
gh secret set BUYMEACOFFEE_WEBHOOK_SECRET --body "nightgod-buymeacoffee-webhook-secure-2024"
gh secret set IPASS_API_KEY --body "nightgod-ipass-api-secure-2024"
gh secret set IPASS_API_SECRET --body "NightGod2024iPassSecretKeyForPaymentProcessing"
gh secret set DB_PASSWORD --body "NightGod2024SecureDBPass4UltimateTarotSystem"
gh secret set REDIS_PASSWORD --body "NightGod2024SecureRedisPass4CachingSystem"
gh secret set WEBHOOK_SECRET --body "NightGod2024WebhookSecretKeyForSystemIntegrations"

echo "✅ GitHub secrets setup complete!"
gh secret list