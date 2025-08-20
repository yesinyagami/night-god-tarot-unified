#!/bin/bash
# 🌟 NIGHT GOD TAROT - CLOUD BACKUP SCRIPT
# Comprehensive backup of all essential components

echo "🔮 Starting Night God Tarot Cloud Backup..."

# Create backup directory with timestamp
BACKUP_DIR="night-god-tarot-backup-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📁 Created backup directory: $BACKUP_DIR"

# === CORE APPLICATION FILES ===
echo "📦 Backing up core application files..."

# Main components
cp -r src/components "$BACKUP_DIR/"
cp -r src/services "$BACKUP_DIR/"
cp -r src/stores "$BACKUP_DIR/"
cp -r src/data "$BACKUP_DIR/"
cp -r src/types "$BACKUP_DIR/"
cp -r src/views "$BACKUP_DIR/"
cp src/main.ts "$BACKUP_DIR/"
cp src/App.vue "$BACKUP_DIR/"

# === ASSETS & RESOURCES ===
echo "🎨 Backing up assets and resources..."
cp -r src/assets "$BACKUP_DIR/"

# === CONFIGURATION FILES ===
echo "⚙️ Backing up configuration files..."
cp package.json "$BACKUP_DIR/"
cp package-lock.json "$BACKUP_DIR/"
cp tsconfig.json "$BACKUP_DIR/"
cp vite.config.ts "$BACKUP_DIR/"
cp tailwind.config.js "$BACKUP_DIR/"
cp eslint.config.js "$BACKUP_DIR/"
cp index.html "$BACKUP_DIR/"

# === ENVIRONMENT & SECURITY ===
echo "🔐 Backing up environment configuration..."
# Note: .env file contains sensitive data - backup securely
cp .env "$BACKUP_DIR/.env.backup"

# === SERVER & DEPLOYMENT ===
echo "🚀 Backing up server and deployment files..."
cp -r server "$BACKUP_DIR/"
cp -r scripts "$BACKUP_DIR/"
cp -r .github "$BACKUP_DIR/"
cp docker-compose.yml "$BACKUP_DIR/" 2>/dev/null
cp Dockerfile "$BACKUP_DIR/" 2>/dev/null

# === PRODUCTION BUILD ===
echo "🏗️ Backing up production build..."
if [ -d "dist" ]; then
    cp -r dist "$BACKUP_DIR/"
fi

# === DOCUMENTATION ===
echo "📚 Backing up documentation..."
cp README.md "$BACKUP_DIR/" 2>/dev/null
cp CLAUDE.md "$BACKUP_DIR/" 2>/dev/null
cp CLOUD_BACKUP_MANIFEST.md "$BACKUP_DIR/"

# === CREATE ARCHIVE ===
echo "📦 Creating compressed archive..."
tar -czf "${BACKUP_DIR}.tar.gz" "$BACKUP_DIR"

# === BACKUP VERIFICATION ===
echo "✅ Backup verification..."
echo "Archive size: $(du -h ${BACKUP_DIR}.tar.gz | cut -f1)"
echo "Total files backed up: $(find $BACKUP_DIR -type f | wc -l)"

# === CLEANUP ===
rm -rf "$BACKUP_DIR"

echo "🌟 Backup completed successfully!"
echo "Archive: ${BACKUP_DIR}.tar.gz"
echo "Ready for cloud storage upload!"

# === RESTORATION SCRIPT ===
cat > "restore_${BACKUP_DIR}.sh" << 'EOF'
#!/bin/bash
# 🔮 NIGHT GOD TAROT - RESTORATION SCRIPT

echo "🌟 Starting Night God Tarot restoration..."

# Extract archive
ARCHIVE_NAME=$(basename "$0" .sh | sed 's/restore_//')
tar -xzf "${ARCHIVE_NAME}.tar.gz"

# Enter directory
cd "$ARCHIVE_NAME"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🏗️ Building application..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm run type-check

echo "✅ Restoration completed!"
echo "🚀 Run 'npm run dev' to start development server"
echo "🌐 Run 'npm run preview' to test production build"
EOF

chmod +x "restore_${BACKUP_DIR}.sh"

echo "📋 Restoration script created: restore_${BACKUP_DIR}.sh"
echo "🎊 Backup process complete - ready for cloud upload!"