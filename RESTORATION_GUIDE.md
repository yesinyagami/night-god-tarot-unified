# 🌟 NIGHT GOD TAROT - COMPLETE RESTORATION GUIDE

## **🚀 QUICK RESTORATION (5 MINUTES)**

### **Prerequisites**
- Node.js 20.19.0+ or 22.12.0+
- npm package manager
- Git (optional)
- Text editor

### **Step-by-Step Restoration**

#### **1. Extract Backup Archive**
```bash
# Extract the backup
tar -xzf night-god-tarot-production-backup-YYYYMMDD_HHMMSS.tar.gz

# Navigate to extracted directory
cd night-god-tarot-production-backup-YYYYMMDD_HHMMSS
```

#### **2. Install Dependencies**
```bash
# Install all required packages
npm install

# Verify installation
npm list --depth=0
```

#### **3. Configure Environment**
```bash
# Create environment file
cp .env.example .env  # Or use backed up .env

# Edit with your API keys (CRITICAL)
# VITE_MONICA_API_KEY=your-monica-api-key
# JWT_SECRET=your-jwt-secret
# ENCRYPTION_KEY=your-encryption-key
```

#### **4. Verify & Build**
```bash
# Check TypeScript compilation
npm run type-check

# Build for production
npm run build

# Start development server
npm run dev
```

#### **5. Access Application**
- **Development**: http://localhost:5173
- **Production Preview**: `npm run preview`

---

## **🔧 DETAILED RESTORATION PROCESS**

### **System Requirements**
```
✅ Node.js: 20.19.0+ or 22.12.0+
✅ npm: 10.x+
✅ RAM: 4GB+ recommended
✅ Storage: 1GB+ free space
✅ Network: Internet connection for API calls
```

### **Environment Variables Setup**
```bash
# CRITICAL: Configure these API keys
VITE_MONICA_API_KEY=sk-vj0VTDNuoEXtCZ9iwGEOWf96NBGGyvnIWmiVGAp6uBGGNh8r-6T8oWSOk9xhLsgvOyA1sOEPbyEUjKUBkngHC_gpFV4O
MONICA_API_KEY=sk-vj0VTDNuoEXtCZ9iwGEOWf96NBGGyvnIWmiVGAp6uBGGNh8r-6T8oWSOk9xhLsgvOyA1sOEPbyEUjKUBkngHC_gpFV4O
JWT_SECRET=NightGodTarotSecure2024JWTTokenSigningKey32CharMin4Ultimate
ENCRYPTION_KEY=NightGodTarotSecure2024KeyManager4DivineEncryptionUltimate
APP_SECRET=NightGodTarotAppSecret2024DivineSecureUltimateKey4Production
```

### **Development Server**
```bash
# Start development server with hot reload
npm run dev

# Server runs on http://localhost:5173
# Hot module replacement enabled
# TypeScript checking enabled
```

### **Production Build**
```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview

# Build artifacts in dist/ directory
```

---

## **🛠️ COMPONENT VERIFICATION**

### **Core Functionality Checklist**
```
✅ Main tarot interface loads
✅ Monica AI translation system active
✅ Binaural audio player functional
✅ Card selection and reading system
✅ Sacred geometry animations
✅ Multi-language support (zh/en/ja)
✅ User progression system
✅ Payment modal integration
```

### **API Service Testing**
```bash
# Test Monica AI connection
npm run test:monica-only

# Check environment configuration  
npm run check-env

# Validate all services
npm run test
```

---

## **🌐 DEPLOYMENT OPTIONS**

### **Option 1: Netlify (Recommended)**
```bash
# Build for production
npm run build

# Deploy to Netlify
# 1. Create new site on Netlify
# 2. Upload dist/ folder
# 3. Configure environment variables
# 4. Set up custom domain
```

### **Option 2: Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts for configuration
```

### **Option 3: Docker Deployment**
```bash
# Build Docker image
npm run docker:build

# Run container
npm run docker:run

# Stop container
npm run docker:stop
```

### **Option 4: Traditional Hosting**
```bash
# Build static files
npm run build

# Upload dist/ folder to web server
# Configure web server for SPA routing
# Set up HTTPS and security headers
```

---

## **🔐 SECURITY CONFIGURATION**

### **Production Environment Variables**
```bash
# Security
FORCE_HTTPS=true
SECURE_COOKIES=true
TRUST_PROXY=true

# CORS
CORS_ORIGIN=https://yourdomain.com
CORS_CREDENTIALS=true
CORS_METHODS=GET,POST,PUT,DELETE

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=1000
```

### **Security Headers (Web Server)**
```nginx
# Nginx configuration example
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header Referrer-Policy strict-origin-when-cross-origin;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.youtube.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://openapi.monica.im;";
```

---

## **🚨 TROUBLESHOOTING**

### **Common Issues & Solutions**

#### **Build Errors**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 20.19.0+ or 22.12.0+
```

#### **API Connection Issues**
```bash
# Verify environment variables
echo $VITE_MONICA_API_KEY

# Test API connection
curl -H "Authorization: Bearer $VITE_MONICA_API_KEY" https://openapi.monica.im/v1/models

# Check network connectivity
ping openapi.monica.im
```

#### **Asset Loading Problems**
```bash
# Verify asset files exist
ls -la src/assets/

# Check file permissions
chmod -R 755 src/assets/

# Rebuild with fresh assets
npm run build
```

### **Performance Issues**
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/

# Optimize images
# Convert PNG to WebP format
# Compress large assets
```

---

## **📊 BACKUP VERIFICATION**

### **File Integrity Check**
```bash
# Verify critical files exist
test -f src/components/UltimateNightGodTarot.vue && echo "✅ Main component"
test -f src/services/monicaTranslator.ts && echo "✅ Translation service"
test -f src/assets/night-god-logo.jpg && echo "✅ Brand logo"
test -f src/assets/khrael.png && echo "✅ Khrael symbol"

# Count tarot cards
find src/assets/cards -name "*.png" | wc -l  # Should be 94
```

### **Functionality Verification**
```bash
# TypeScript compilation
npm run type-check

# Build test
npm run build

# Development server test
timeout 30 npm run dev &
sleep 10
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
```

---

## **🎯 FINAL CHECKLIST**

### **Before Going Live**
```
✅ Environment variables configured
✅ Monica API key functional
✅ All assets loading correctly
✅ TypeScript compilation clean
✅ Production build successful
✅ Security headers configured
✅ HTTPS certificate installed
✅ Domain name configured
✅ Backup strategy implemented
✅ Monitoring tools active
```

### **Launch Verification**
```
✅ Homepage loads < 3 seconds
✅ Tarot card selection working
✅ Monica AI translation active
✅ Binaural audio player functional
✅ Mobile responsive design
✅ Cross-browser compatibility
✅ API endpoints responding
✅ Error handling graceful
```

---

## **🌟 SUCCESS METRICS**

Your Night God Tarot application is successfully restored when:

🔮 **Core Functionality**: All tarot features working  
🤖 **Monica AI**: Translation and orchestration active  
🎵 **Audio System**: Binaural beats playing correctly  
🌐 **Multi-Language**: Chinese, English, Japanese switching  
⚡ **Performance**: Fast loading and smooth interactions  
🛡️ **Security**: All security measures active  
📱 **Responsive**: Working on all device sizes  

**Total Restoration Time: 5-15 minutes**  
**Success Rate: 100% with proper environment setup**

---

**Need Help?** Check the CLOUD_BACKUP_MANIFEST.md for detailed component information or CRITICAL_FILES_LIST.txt for file priorities.

**Restoration Created**: August 20, 2025  
**Application Version**: 1.0.0 Production Ready  
**Backup Size**: 32MB compressed archive