/**
 * Night God Tarot - Advanced SEO Optimization Engine
 * World-class SEO implementation for maximum search visibility
 */

interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  key?: string;
}

interface StructuredData {
  "@context": string;
  "@type": string;
  [key: string]: any;
}

export class SEOOptimizer {
  private static instance: SEOOptimizer;
  private readonly baseUrl = 'https://night-god-tarot.pages.dev';
  private readonly siteName = 'Night God Tarot';
  private readonly defaultImage = '/assets/night-god-logo.jpg';

  static getInstance(): SEOOptimizer {
    if (!SEOOptimizer.instance) {
      SEOOptimizer.instance = new SEOOptimizer();
    }
    return SEOOptimizer.instance;
  }

  // Core SEO optimization for page
  optimizePage(options: {
    title: string;
    description: string;
    path: string;
    image?: string;
    keywords?: string[];
    type?: string;
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    locale?: string;
  }) {
    const {
      title,
      description,
      path,
      image = this.defaultImage,
      keywords = [],
      type = 'website',
      publishedTime,
      modifiedTime,
      author = 'Night God Tarot',
      locale = 'en_US'
    } = options;

    const fullUrl = `${this.baseUrl}${path}`;
    const fullImage = image.startsWith('http') ? image : `${this.baseUrl}${image}`;
    
    // Update document title
    document.title = `${title} | ${this.siteName}`;
    
    // Core meta tags
    this.setMetaTags([
      { name: 'description', content: description },
      { name: 'keywords', content: keywords.join(', ') },
      { name: 'author', content: author },
      { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      { name: 'googlebot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      
      // Open Graph tags
      { property: 'og:title', content: `${title} | ${this.siteName}` },
      { property: 'og:description', content: description },
      { property: 'og:image', content: fullImage },
      { property: 'og:url', content: fullUrl },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: this.siteName },
      { property: 'og:locale', content: locale },
      
      // Twitter Card tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: `${title} | ${this.siteName}` },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: fullImage },
      { name: 'twitter:url', content: fullUrl },
      { name: 'twitter:site', content: '@NightGodTarot' },
      { name: 'twitter:creator', content: '@NightGodTarot' },
      
      // Additional SEO tags
      { name: 'theme-color', content: '#000033' },
      { name: 'msapplication-TileColor', content: '#000033' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'format-detection', content: 'telephone=no' },
      
      // Geo tags for local SEO
      { name: 'geo.region', content: 'US' },
      { name: 'geo.placename', content: 'United States' },
      { name: 'ICBM', content: '40.7128, -74.0060' }, // NYC coordinates as example
      
      // Content tags
      { name: 'rating', content: 'general' },
      { name: 'revisit-after', content: '7 days' },
    ]);

    // Article-specific tags
    if (type === 'article' && publishedTime) {
      this.setMetaTags([
        { property: 'article:published_time', content: publishedTime },
        { property: 'article:modified_time', content: modifiedTime || publishedTime },
        { property: 'article:author', content: author },
        { property: 'article:section', content: 'Tarot' },
        { property: 'article:tag', content: keywords.join(',') }
      ]);
    }

    // Canonical URL
    this.setCanonicalUrl(fullUrl);
    
    // Structured data
    this.setStructuredData(this.generateStructuredData(options));
    
    // Preconnect to external APIs
    this.addPreconnectLinks([
      'https://api.anthropic.com',
      'https://api.openai.com',
      'https://generativelanguage.googleapis.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ]);
  }

  // Set multiple meta tags efficiently
  private setMetaTags(tags: MetaTag[]) {
    tags.forEach(tag => this.setMetaTag(tag));
  }

  // Set individual meta tag
  private setMetaTag(tag: MetaTag) {
    const selector = tag.name 
      ? `meta[name="${tag.name}"]`
      : `meta[property="${tag.property}"]`;
    
    let element = document.querySelector(selector) as HTMLMetaElement;
    
    if (!element) {
      element = document.createElement('meta');
      if (tag.name) element.setAttribute('name', tag.name);
      if (tag.property) element.setAttribute('property', tag.property);
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', tag.content);
  }

  // Set canonical URL
  private setCanonicalUrl(url: string) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    
    canonical.href = url;
  }

  // Generate comprehensive structured data
  private generateStructuredData(options: any): StructuredData[] {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": this.siteName,
      "description": "Advanced AI-powered tarot readings with multi-language support and personalized insights",
      "url": this.baseUrl,
      "applicationCategory": "Entertainment",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "author": {
        "@type": "Organization",
        "name": "Night God Tarot",
        "url": this.baseUrl
      },
      "publisher": {
        "@type": "Organization",
        "name": "Night God Tarot",
        "logo": {
          "@type": "ImageObject",
          "url": `${this.baseUrl}${this.defaultImage}`
        }
      },
      "potentialAction": {
        "@type": "UseAction",
        "target": `${this.baseUrl}/#reading`,
        "name": "Get Tarot Reading"
      }
    };

    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": this.siteName,
      "url": this.baseUrl,
      "logo": `${this.baseUrl}${this.defaultImage}`,
      "description": "Leading AI-powered tarot platform offering personalized readings in multiple languages",
      "foundingDate": "2024",
      "knowsAbout": [
        "Tarot Reading",
        "Divination",
        "Spiritual Guidance",
        "AI Technology",
        "Mysticism"
      ],
      "sameAs": [
        "https://twitter.com/NightGodTarot",
        "https://facebook.com/NightGodTarot",
        "https://instagram.com/NightGodTarot"
      ]
    };

    const websiteData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": this.siteName,
      "url": this.baseUrl,
      "description": "Advanced AI-powered tarot readings with multi-language support",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${this.baseUrl}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Free Tarot Reading",
            "url": `${this.baseUrl}/#reading`
          },
          {
            "@type": "ListItem", 
            "position": 2,
            "name": "Daily Horoscope",
            "url": `${this.baseUrl}/#horoscope`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Tarot Card Meanings",
            "url": `${this.baseUrl}/#meanings`
          }
        ]
      }
    };

    const serviceData = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "AI Tarot Reading",
      "description": "Personalized tarot readings powered by advanced AI technology",
      "provider": {
        "@type": "Organization",
        "name": this.siteName
      },
      "areaServed": "Worldwide",
      "availableLanguage": ["English", "中文", "日本語"],
      "serviceType": "Divination Service",
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", 
          "Friday", "Saturday", "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    };

    return [baseData, organizationData, websiteData, serviceData];
  }

  // Add structured data to page
  private setStructuredData(dataArray: StructuredData[]) {
    // Remove existing structured data
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Add new structured data
    dataArray.forEach((data, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = `structured-data-${index}`;
      script.textContent = JSON.stringify(data, null, 2);
      document.head.appendChild(script);
    });
  }

  // Add preconnect links for performance
  private addPreconnectLinks(urls: string[]) {
    urls.forEach(url => {
      if (!document.querySelector(`link[href="${url}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });
  }

  // Generate sitemap data
  generateSitemap(): string {
    const pages = [
      { url: '/', changefreq: 'daily', priority: '1.0' },
      { url: '/#reading', changefreq: 'hourly', priority: '0.9' },
      { url: '/#demo', changefreq: 'weekly', priority: '0.8' },
      { url: '/#about', changefreq: 'monthly', priority: '0.7' },
      { url: '/#contact', changefreq: 'monthly', priority: '0.6' }
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map(page => `
  <url>
    <loc>${this.baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${this.baseUrl}${page.url}"/>
    <xhtml:link rel="alternate" hreflang="zh" href="${this.baseUrl}/zh${page.url}"/>
    <xhtml:link rel="alternate" hreflang="ja" href="${this.baseUrl}/ja${page.url}"/>
  </url>`).join('')}
</urlset>`;

    return sitemap;
  }

  // Generate robots.txt
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

Disallow: /api/
Disallow: /_nuxt/
Disallow: /admin/
Disallow: /test/

Sitemap: ${this.baseUrl}/sitemap.xml

# Block AI crawlers that don't contribute to search
User-agent: CCBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: Claude-Web
Disallow: /`;
  }

  // Page-specific SEO optimizations
  optimizeHomePage() {
    this.optimizePage({
      title: 'Free AI Tarot Reading - Night God Tarot',
      description: 'Get personalized AI-powered tarot readings instantly. Advanced multi-language support, 94 tarot cards, and mystical insights. Start your spiritual journey today.',
      path: '/',
      keywords: [
        'free tarot reading', 'AI tarot', 'online tarot cards', 'tarot predictions',
        'spiritual guidance', 'divination', 'fortune telling', 'tarot card meanings',
        'psychic reading', 'astrology', 'mystical', 'oracle cards'
      ],
      type: 'website'
    });
  }

  optimizeReadingPage() {
    this.optimizePage({
      title: 'AI Tarot Reading - Personalized Spiritual Guidance',
      description: 'Experience advanced AI tarot readings with multi-model analysis. Get deep insights from 4+ AI systems working together for accurate predictions.',
      path: '/#reading',
      keywords: [
        'tarot reading', 'AI prediction', 'spiritual guidance', 'card reading',
        'future insights', 'personal guidance', 'tarot consultation'
      ],
      type: 'article'
    });
  }

  optimizeDemoPage() {
    this.optimizePage({
      title: 'Free Tarot Demo - Try Night God Tarot',
      description: 'Try our free tarot reading demo. Experience the power of AI-driven divination with our interactive card selection and instant interpretations.',
      path: '/#demo',
      keywords: [
        'free tarot demo', 'tarot trial', 'sample reading', 'test tarot',
        'practice reading', 'demo cards'
      ]
    });
  }

  // International SEO
  optimizeForLocale(locale: string) {
    const localeMap: Record<string, { lang: string; region: string; title: string }> = {
      'en': { lang: 'en', region: 'US', title: 'Free AI Tarot Reading - Night God Tarot' },
      'zh': { lang: 'zh', region: 'CN', title: '免费AI塔罗牌占卜 - 夜神塔罗' },
      'ja': { lang: 'ja', region: 'JP', title: '無料AIタロット占い - ナイトゴッドタロット' }
    };

    const config = localeMap[locale];
    if (config) {
      document.documentElement.lang = config.lang;
      
      this.setMetaTags([
        { property: 'og:locale', content: `${config.lang}_${config.region}` },
        { name: 'language', content: config.lang },
        { name: 'geo.region', content: config.region }
      ]);
    }
  }

  // Performance optimization for SEO
  optimizePerformance() {
    // Preload critical resources
    const criticalResources = [
      '/assets/tarot-cards-sprite.webp',
      '/assets/cosmic-bg.webp',
      '/fonts/mystical.woff2'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.includes('font') ? 'font' : 'image';
      if (resource.includes('font')) {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });

    // Add resource hints
    const hint = document.createElement('link');
    hint.rel = 'dns-prefetch';
    hint.href = '//fonts.googleapis.com';
    document.head.appendChild(hint);
  }

  // Social media optimization
  optimizeForSocial(platform: 'facebook' | 'twitter' | 'linkedin') {
    const platformOptimizations = {
      facebook: {
        'og:image:width': '1200',
        'og:image:height': '630',
        'fb:app_id': '1234567890' // Replace with actual app ID
      },
      twitter: {
        'twitter:card': 'summary_large_image',
        'twitter:image:alt': 'Night God Tarot - AI-powered tarot readings'
      },
      linkedin: {
        'og:type': 'website',
        'og:image:width': '1200',
        'og:image:height': '630'
      }
    };

    const config = platformOptimizations[platform];
    const tags = Object.entries(config).map(([key, value]) => {
      if (key.startsWith('og:')) {
        return { property: key, content: value };
      }
      return { name: key, content: value };
    });

    this.setMetaTags(tags);
  }

  // Monitor SEO health
  checkSEOHealth(): { issues: string[]; score: number } {
    const issues: string[] = [];
    let score = 100;

    // Check title
    if (!document.title || document.title.length < 30) {
      issues.push('Title too short');
      score -= 10;
    }
    if (document.title.length > 60) {
      issues.push('Title too long');
      score -= 5;
    }

    // Check meta description
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
    if (!description || description.length < 120) {
      issues.push('Meta description too short');
      score -= 10;
    }
    if (description && description.length > 160) {
      issues.push('Meta description too long');
      score -= 5;
    }

    // Check structured data
    if (!document.querySelector('script[type="application/ld+json"]')) {
      issues.push('Missing structured data');
      score -= 15;
    }

    // Check canonical URL
    if (!document.querySelector('link[rel="canonical"]')) {
      issues.push('Missing canonical URL');
      score -= 10;
    }

    return { issues, score: Math.max(0, score) };
  }
}

export const seoOptimizer = SEOOptimizer.getInstance();