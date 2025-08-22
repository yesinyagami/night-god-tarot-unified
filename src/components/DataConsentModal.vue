<template>
  <div 
    v-if="showModal" 
    class="consent-overlay cosmic-overlay"
  >
    <div class="consent-modal cosmic-modal">
      <!-- Cosmic Header -->
      <div class="consent-header cosmic-header">
        <div class="header-constellation">
          <div class="cosmic-symbols">
            <span class="symbol">🔒</span>
            <span class="symbol">📋</span>
            <span class="symbol">⚖️</span>
          </div>
          <h2 class="cosmic-title">{{ t('privacy-title') }}</h2>
          <div class="subtitle">{{ t('privacy-subtitle') }}</div>
        </div>
        
        <!-- Language Switcher -->
        <div class="language-switcher">
          <span class="language-label">{{ t('language') }}:</span>
          <button 
            v-for="lang in languages" 
            :key="lang.code"
            class="lang-btn" 
            :class="{ active: currentLang === lang.code }"
            @click="changeLanguage(lang.code)"
          >
            {{ lang.label }}
          </button>
        </div>
      </div>

      <!-- Legal Privacy Policy Content -->
      <div class="consent-content cosmic-content">
        <!-- Important Notice -->
        <div class="important-notice">
          <div class="notice-icon">📋</div>
          <div class="notice-content">
            <h3 class="notice-title">{{ t('important-notice') }}</h3>
            <p class="notice-text">{{ t('notice-description') }}</p>
          </div>
        </div>

        <!-- Consent Statement -->
        <div class="consent-section consent-intro">
          <h3 class="section-title">⚖️ {{ t('consent-statement') }}</h3>
          <div class="consent-explanation">
            <p class="section-content highlight-text">
              {{ t('consent-text-1') }}
            </p>
            <div class="choice-explanation">
              <div class="choice-option agree-option">
                <span class="choice-icon">✅</span>
                <div class="choice-details">
                  <strong>{{ t('i-agree') }}</strong>
                  <p>{{ t('agree-explanation') }}</p>
                </div>
              </div>
              <div class="choice-option disagree-option">
                <span class="choice-icon">❌</span>
                <div class="choice-details">
                  <strong>{{ t('i-disagree') }}</strong>
                  <p>{{ t('disagree-explanation') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- IP Data Collection -->
        <div class="consent-section">
          <h3 class="section-title">🌐 {{ t('ip-collection-title') }}</h3>
          <p class="section-content">{{ t('ip-collection-intro') }}</p>
          <ul class="legal-list">
            <li><strong>{{ t('functionality') }}:</strong> {{ t('functionality-desc') }}</li>
            <li><strong>{{ t('security') }}:</strong> {{ t('security-desc') }}</li>
            <li><strong>{{ t('analytics') }}:</strong> {{ t('analytics-desc') }}</li>
          </ul>
          <p class="section-content protection-notice">
            {{ t('ip-protection') }}
          </p>
        </div>

        <!-- Email Data Collection -->
        <div class="consent-section">
          <h3 class="section-title">📧 {{ t('email-collection-title') }}</h3>
          <p class="section-content">{{ t('email-collection-intro') }}</p>
          <ul class="legal-list">
            <li><strong>{{ t('account-management') }}:</strong> {{ t('account-management-desc') }}</li>
            <li><strong>{{ t('communication') }}:</strong> {{ t('communication-desc') }}</li>
            <li><strong>{{ t('marketing') }}:</strong> {{ t('marketing-desc') }}</li>
          </ul>
        </div>

        <!-- User Rights -->
        <div class="consent-section highlight">
          <h3 class="section-title">⚖️ {{ t('user-rights-title') }}</h3>
          <ul class="rights-list">
            <li>{{ t('right-unsubscribe') }}</li>
            <li>{{ t('right-access') }}</li>
            <li>{{ t('right-protection') }}</li>
          </ul>
        </div>

        <!-- Data Protection -->
        <div class="consent-section">
          <h3 class="section-title">🛡️ {{ t('data-protection-title') }}</h3>
          <p class="section-content">{{ t('data-protection-desc') }}</p>
        </div>

        <!-- Policy Updates -->
        <div class="consent-section">
          <h3 class="section-title">🔄 {{ t('policy-updates-title') }}</h3>
          <p class="section-content">{{ t('policy-updates-desc') }}</p>
        </div>

        <!-- CCPA/GDPR Specific Rights -->
        <div class="consent-section highlight">
          <h3 class="section-title">🔒 {{ t('ccpa-gdpr-rights-title') }}</h3>
          <div class="rights-grid">
            <div class="right-item">
              <strong>{{ t('do-not-sell-title') }}</strong>
              <p>{{ t('do-not-sell-desc') }}</p>
            </div>
            <div class="right-item">
              <strong>{{ t('data-portability-title') }}</strong>
              <p>{{ t('data-portability-desc') }}</p>
            </div>
            <div class="right-item">
              <strong>{{ t('data-retention-title') }}</strong>
              <p>{{ t('data-retention-desc') }}</p>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="consent-section">
          <h3 class="section-title">📞 {{ t('contact-title') }}</h3>
          <p class="section-content">{{ t('contact-desc') }}</p>
          <div class="contact-info">
            <p>📧 Contact: https://github.com/yesinyagami/night-god-tarot-unified/issues</p>
            <p>🌐 Contact: Available through website contact form</p>
            <p>⏰ Response Time: Within 72 hours</p>
            <p>📋 CCPA Request: <a href="#" @click="handleCCPARequest" class="ccpa-link">{{ t('do-not-sell-link') }}</a></p>
            <p>🔄 Data Export: <a href="#" @click="handleDataExport" class="gdpr-link">{{ t('data-export-link') }}</a></p>
          </div>
        </div>
      </div>

      <!-- Legal Decision Footer -->
      <div class="consent-footer cosmic-footer">
        <div class="footer-warning">
          <div class="warning-icon">⚠️</div>
          <div class="warning-content">
            <strong>{{ t('legal-notice') }}</strong>
            <p>{{ t('mandatory-decision') }}</p>
          </div>
        </div>
        
        <div class="button-constellation">
          <button 
            @click="handleDisagree" 
            class="consent-btn disagree-btn"
          >
            <span class="btn-icon">❌</span>
            <span class="btn-text">{{ t('i-disagree') }}</span>
            <span class="btn-subtext">{{ t('disagree-desc') }}</span>
          </button>
          
          <button 
            @click="handleAgree" 
            class="consent-btn agree-btn"
          >
            <span class="btn-icon">✅</span>
            <span class="btn-text">{{ t('i-agree') }}</span>
            <span class="btn-subtext">{{ t('agree-desc') }}</span>
          </button>
        </div>
        
        <div class="legal-footer">
          <p class="legal-text">{{ t('legal-footer') }}</p>
          <p class="effective-date">{{ t('effective-date') }}: 2024-08-20</p>
        </div>
      </div>
    </div>

    <!-- Cosmic Background Effects -->
    <div class="cosmic-background">
      <div class="floating-stars">
        <div class="star" v-for="n in 20" :key="n" :style="getRandomStarStyle()">✨</div>
      </div>
      <div class="mystical-particles">
        <div class="particle" v-for="n in 15" :key="n" :style="getRandomParticleStyle()">🌙</div>
      </div>
    </div>
  </div>

  <!-- Status Toast -->
  <div 
    v-if="statusMessage.show" 
    class="status-toast"
    :class="statusMessage.type"
  >
    <div class="toast-icon">
      {{ statusMessage.type === 'success' ? '✅' : '⚠️' }}
    </div>
    <div class="toast-content">
      <div class="toast-title">{{ statusMessage.title }}</div>
      <div class="toast-message">{{ statusMessage.message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// Type definitions
type LanguageCode = 'zh' | 'en' | 'ja'

// Reactive State
const showModal = ref(false)
const currentLang = ref<LanguageCode>('en')
const statusMessage = reactive({
  show: false,
  type: 'success' as 'success' | 'warning',
  title: '',
  message: ''
})

// Language Configuration
const languages = [
  { code: 'zh' as LanguageCode, label: '中文' },
  { code: 'en' as LanguageCode, label: 'English' },
  { code: 'ja' as LanguageCode, label: '日本語' }
]

// Comprehensive Legal Translations
const translations = reactive({
  zh: {
    'privacy-title': '隱私政策與資料收集同意書',
    'privacy-subtitle': '請仔細閱讀並做出選擇',
    'important-notice': '重要提醒',
    'notice-description': '根據個人資料保護相關法規，我們必須告知您網站如何收集與使用您的資料，並取得您的明確同意。',
    'consent-statement': '您的選擇權利',
    'consent-text-1': '我們重視您的隱私權。在使用本網站前，請了解我們如何處理您的個人資料，並做出您的選擇：',
    'agree-explanation': '同意我們的隱私政策，享受完整的塔羅占卜體驗，包括個人化服務和功能。',
    'disagree-explanation': '不同意資料收集，您將回到首頁，但部分功能可能受限。',
    'ip-collection-title': 'IP 資料收集與使用通知',
    'ip-collection-intro': '本網站在您瀏覽或使用我們的服務時可能會自動收集您的網際網路通訊協定（IP）位址。IP 位址是用於識別您的網路設備並確保與網站正常連接的技術資訊。我們收集 IP 位址的目的包括但不限於：',
    'functionality': '網站功能性',
    'functionality-desc': '確保網站正常運作並提供您要求的服務，例如塔羅牌占卜功能。',
    'security': '安全保護',
    'security-desc': '監控並防止未經授權的存取、詐欺或其他潛在的安全威脅。',
    'analytics': '統計分析',
    'analytics-desc': '收集匿名化的流量資料以分析網站使用情況並改善使用者體驗。',
    'ip-protection': '您的 IP 位址將以加密方式儲存，並僅在必要時由授權人員存取。除非您自願提供其他個人識別資訊（如電子郵件地址），否則我們不會將您的 IP 位址與其他個人識別資訊結合。除非法律要求或經您同意，否則我們不會向第三方揭露您的 IP 位址。',
    'email-collection-title': '電子郵件資料收集與使用通知',
    'email-collection-intro': '如果您選擇註冊帳戶、訂閱電子報、提交詢問或參與本網站的其他互動功能，我們可能會收集您的電子郵件地址。收集電子郵件地址的目的包括但不限於：',
    'account-management': '帳戶管理',
    'account-management-desc': '用於註冊、登入或密碼重設，以確保您能順利使用網站的個人化服務。',
    'communication': '通訊與通知',
    'communication-desc': '向您發送與塔羅牌占卜相關的資訊、更新或回覆您的詢問。',
    'marketing': '行銷推廣',
    'marketing-desc': '如果您同意接收行銷資訊，我們可能會向您發送推廣內容或特殊優惠。',
    'user-rights-title': '您的權利與選擇',
    'right-unsubscribe': '您可以隨時點擊電子郵件中的「取消訂閱」連結來停止接收行銷電子郵件。',
    'right-access': '您有權存取、修改或刪除我們收集的關於您的電子郵件資料。請透過網站提供的聯絡方式與我們聯繫。',
    'right-protection': '我們實施適當的技術和組織措施來保護您的電子郵件資料免於未經授權的存取、遺失或揭露。',
    'data-protection-title': '資料保護',
    'data-protection-desc': '我們實施適當的技術和組織措施來保護您的個人資料免於未經授權的存取、遺失或揭露。您的資料僅在必要時由授權人員存取，並且除非經您同意或法律要求，否則不會與第三方分享。',
    'policy-updates-title': '隱私政策更新',
    'policy-updates-desc': '本隱私政策可能會定期更新以反映法律要求或服務變更。任何更新都會在網站上發布，並在生效日期前通知您。',
    'contact-title': '聯絡我們',
    'contact-desc': '如果您對本隱私政策或我們的資料處理實務有任何疑問，請透過以下方式與我們聯繫：',
    'legal-notice': '法律聲明',
    'mandatory-decision': '根據法律要求，您必須明確同意或拒絕我們的資料處理政策才能繼續使用本網站。',
    'i-agree': '我同意',
    'i-disagree': '我不同意',
    'agree-desc': '繼續使用網站並接受條款',
    'disagree-desc': '退出網站，不給予同意',
    'legal-footer': '本同意聲明符合 GDPR、CCPA 及相關隱私法規要求。',
    'effective-date': '生效日期',
    'language': '語言',
    'limited-mode-message': '您已選擇有限模式。基本功能仍可使用，但無個人化服務。',
    'ccpa-gdpr-rights-title': 'CCPA/GDPR 專屬權利',
    'do-not-sell-title': '停止販賣個人資料',
    'do-not-sell-desc': '根據 CCPA 法規，您有權要求我們停止販賣您的個人資料給第三方。',
    'data-portability-title': '資料可攜性',
    'data-portability-desc': '根據 GDPR，您有權以結構化、常用且機器可讀的格式接收您的個人資料。',
    'data-retention-title': '資料保存期限',
    'data-retention-desc': 'IP 資料保存 2 年，電子郵件資料保存至帳戶刪除後 1 年，或依法律要求延長。',
    'do-not-sell-link': '請勿販賣我的個人資料',
    'data-export-link': '申請資料匯出'
  },
  en: {
    'privacy-title': 'Privacy Policy & Data Collection Consent',
    'privacy-subtitle': 'Please read carefully and make your choice',
    'important-notice': 'Important Notice',
    'notice-description': 'Under personal data protection regulations, we must inform you about how our website collects and uses your data, and obtain your explicit consent.',
    'consent-statement': 'Your Rights & Choices',
    'consent-text-1': 'We value your privacy. Before using this website, please understand how we handle your personal data and make your choice:',
    'agree-explanation': 'Agree to our privacy policy and enjoy the complete tarot experience with personalized services and features.',
    'disagree-explanation': 'Decline data collection and return to homepage, though some features may be limited.',
    'ip-collection-title': 'IP Data Collection and Use Notice',
    'ip-collection-intro': 'This website may automatically collect your Internet Protocol (IP) address when you browse or use our services. The IP address is technical information used to identify your network device and ensure proper connection to the website. We collect IP addresses for purposes including but not limited to:',
    'functionality': 'Website Functionality',
    'functionality-desc': 'To ensure the website operates normally and provides the services you request, such as tarot card reading features.',
    'security': 'Security Protection',
    'security-desc': 'To monitor and prevent unauthorized access, fraud, or other potential security threats.',
    'analytics': 'Statistical Analysis',
    'analytics-desc': 'To collect anonymized traffic data for analyzing website usage and improving user experience.',
    'ip-protection': 'Your IP address will be stored in an encrypted manner and accessed only by authorized personnel when necessary. We will not combine your IP address with other personally identifiable information unless you voluntarily provide such data (e.g., email address). Unless required by law or with your consent, we will not disclose your IP address to third parties.',
    'email-collection-title': 'Email Data Collection and Use Notice',
    'email-collection-intro': 'If you choose to register an account, subscribe to newsletters, submit inquiries, or participate in other interactive features on this website, we may collect your email address. The purposes of collecting email addresses include but are not limited to:',
    'account-management': 'Account Management',
    'account-management-desc': 'For registration, login, or password reset to ensure smooth use of personalized services on the website.',
    'communication': 'Communication and Notifications',
    'communication-desc': 'To send you information related to tarot card readings, updates, or responses to your inquiries.',
    'marketing': 'Marketing Promotions',
    'marketing-desc': 'If you consent to receive marketing information, we may send you promotional content or special offers.',
    'user-rights-title': 'Your Rights and Choices',
    'right-unsubscribe': 'You may opt out of receiving marketing emails at any time by clicking the "Unsubscribe" link in the emails.',
    'right-access': 'You have the right to access, modify, or delete the email data we have collected about you. Please contact us via the provided contact methods on the website.',
    'right-protection': 'We implement appropriate technical and organizational measures to protect your email data from unauthorized access, loss, or disclosure.',
    'data-protection-title': 'Data Protection',
    'data-protection-desc': 'We implement appropriate technical and organizational measures to protect your personal data from unauthorized access, loss, or disclosure. Your data will be accessed only by authorized personnel when necessary and will not be shared with third parties without your consent, except as required by law.',
    'policy-updates-title': 'Privacy Policy Updates',
    'policy-updates-desc': 'This Privacy Policy may be updated periodically to reflect legal requirements or service changes. Any updates will be posted on the website, and you will be notified prior to their effective date.',
    'contact-title': 'Contact Us',
    'contact-desc': 'If you have any questions about this Privacy Policy or our data handling practices, please contact us via the following methods:',
    'legal-notice': 'Legal Notice',
    'mandatory-decision': 'By law, you must explicitly agree to or decline our data processing policies to continue using this website.',
    'i-agree': 'I Agree',
    'i-disagree': 'I Disagree',
    'agree-desc': 'Proceed to the website and accept the terms',
    'disagree-desc': 'Exit the website without granting consent',
    'legal-footer': 'This consent statement complies with GDPR, CCPA, and related privacy regulations.',
    'effective-date': 'Effective Date',
    'language': 'Language',
    'limited-mode-message': 'You have chosen limited mode. Basic features remain available without personalization.',
    'ccpa-gdpr-rights-title': 'CCPA/GDPR Specific Rights',
    'do-not-sell-title': 'Do Not Sell Personal Data',
    'do-not-sell-desc': 'Under CCPA regulations, you have the right to request that we stop selling your personal data to third parties.',
    'data-portability-title': 'Data Portability',
    'data-portability-desc': 'Under GDPR, you have the right to receive your personal data in a structured, commonly used, and machine-readable format.',
    'data-retention-title': 'Data Retention Periods',
    'data-retention-desc': 'IP data is retained for 2 years, email data is retained for 1 year after account deletion, or as required by law.',
    'do-not-sell-link': 'Do Not Sell My Personal Information',
    'data-export-link': 'Request Data Export'
  },
  ja: {
    'privacy-title': 'プライバシーポリシー・データ収集同意書',
    'privacy-subtitle': 'よくお読みいただき、選択してください',
    'important-notice': '重要なお知らせ',
    'notice-description': '個人データ保護に関する法規制により、当社ウェブサイトがお客様のデータをどのように収集・使用するかをお知らせし、明示的な同意を得る必要があります。',
    'consent-statement': 'お客様の権利と選択',
    'consent-text-1': '当社はお客様のプライバシーを重視しています。本ウェブサイトをご利用になる前に、個人データの取り扱いについてご理解いただき、選択してください：',
    'agree-explanation': 'プライバシーポリシーに同意し、パーソナライズされたサービスと機能を含む完全なタロット体験をお楽しみください。',
    'disagree-explanation': 'データ収集を拒否し、ホームページに戻ります。一部の機能が制限される場合があります。',
    'ip-collection-title': 'IPデータ収集・使用通知',
    'ip-collection-intro': '本ウェブサイトは、お客様が当社のサービスを閲覧または使用する際に、インターネットプロトコル（IP）アドレスを自動的に収集する場合があります。IPアドレスは、お客様のネットワークデバイスを識別し、ウェブサイトへの適切な接続を確保するために使用される技術情報です。IPアドレスを収集する目的には以下が含まれますが、これらに限定されません：',
    'functionality': 'ウェブサイト機能',
    'functionality-desc': 'ウェブサイトが正常に動作し、タロットカード占い機能などのお客様がリクエストするサービスを提供するため。',
    'security': 'セキュリティ保護',
    'security-desc': '不正アクセス、詐欺、その他の潜在的なセキュリティ脅威を監視し防止するため。',
    'analytics': '統計分析',
    'analytics-desc': 'ウェブサイトの使用状況を分析し、ユーザーエクスペリエンスを向上させるために匿名化されたトラフィックデータを収集するため。',
    'ip-protection': 'お客様のIPアドレスは暗号化された方法で保存され、必要な場合にのみ許可された担当者がアクセスします。お客様が自発的にそのようなデータ（例：メールアドレス）を提供しない限り、IPアドレスを他の個人識別可能な情報と組み合わせることはありません。法律で義務付けられている場合やお客様の同意がある場合を除き、第三者にIPアドレスを開示することはありません。',
    'email-collection-title': 'メールデータ収集・使用通知',
    'email-collection-intro': 'アカウント登録、ニュースレターの購読、お問い合わせの送信、または本ウェブサイトの他のインタラクティブ機能への参加を選択した場合、メールアドレスを収集する場合があります。メールアドレスを収集する目的には以下が含まれますが、これらに限定されません：',
    'account-management': 'アカウント管理',
    'account-management-desc': 'ウェブサイトでのパーソナライズされたサービスの円滑な利用を確保するための登録、ログイン、またはパスワードリセット。',
    'communication': 'コミュニケーション・通知',
    'communication-desc': 'タロットカード占いに関連する情報、更新、またはお問い合わせへの回答をお送りするため。',
    'marketing': 'マーケティング・プロモーション',
    'marketing-desc': 'マーケティング情報の受信に同意いただいた場合、プロモーションコンテンツや特別オファーをお送りすることがあります。',
    'user-rights-title': 'お客様の権利と選択',
    'right-unsubscribe': 'メール内の「配信停止」リンクをクリックすることで、いつでもマーケティングメールの受信を停止できます。',
    'right-access': 'お客様について当社が収集したメールデータにアクセス、修正、削除する権利があります。ウェブサイトで提供されている連絡方法を通じてお問い合わせください。',
    'right-protection': '不正アクセス、紛失、開示からお客様のメールデータを保護するために適切な技術的・組織的措置を実施しています。',
    'data-protection-title': 'データ保護',
    'data-protection-desc': '不正アクセス、紛失、開示からお客様の個人データを保護するために適切な技術的・組織的措置を実施しています。お客様のデータは、必要な場合にのみ許可された担当者がアクセスし、法律で義務付けられている場合を除き、お客様の同意なしに第三者と共有されることはありません。',
    'policy-updates-title': 'プライバシーポリシーの更新',
    'policy-updates-desc': 'このプライバシーポリシーは、法的要件やサービスの変更を反映するために定期的に更新される場合があります。更新はウェブサイトに掲載され、有効日前に通知いたします。',
    'contact-title': 'お問い合わせ',
    'contact-desc': 'このプライバシーポリシーまたは当社のデータ処理慣行について質問がある場合は、以下の方法でお問い合わせください：',
    'legal-notice': '法的通知',
    'mandatory-decision': '法律により、このウェブサイトを継続使用するには、当社のデータ処理ポリシーに明示的に同意または拒否する必要があります。',
    'i-agree': '同意する',
    'i-disagree': '同意しない',
    'agree-desc': 'ウェブサイトに進み条件を受け入れる',
    'disagree-desc': '同意を与えずにウェブサイトを退出',
    'legal-footer': 'この同意声明はGDPR、CCPA、および関連するプライバシー規制に準拠しています。',
    'effective-date': '有効日',
    'language': '言語',
    'limited-mode-message': '制限モードを選択されました。基本機能は利用可能ですが、パーソナライゼーションは無効です。',
    'ccpa-gdpr-rights-title': 'CCPA/GDPR 固有の権利',
    'do-not-sell-title': '個人データの販売停止',
    'do-not-sell-desc': 'CCPA規制に基づき、第三者への個人データの販売を停止するよう要求する権利があります。',
    'data-portability-title': 'データポータビリティ',
    'data-portability-desc': 'GDPRに基づき、構造化された一般的で機械可読な形式で個人データを受け取る権利があります。',
    'data-retention-title': 'データ保持期間',
    'data-retention-desc': 'IPデータは2年間、メールデータはアカウント削除後1年間、または法律で要求される期間保持されます。',
    'do-not-sell-link': '個人情報を販売しないでください',
    'data-export-link': 'データエクスポート申請'
  }
})

// Cookie Management Utilities
const CookieManager = {
  set(name: string, value: string, days: number): void {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    const expires = "expires=" + date.toUTCString()
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict;Secure`
  },
  
  get(name: string): string | null {
    const nameEQ = name + "="
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  },
  
  delete(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  }
}

// Translation helper
const t = (key: string): string => {
  const langTranslations = translations[currentLang.value]
  if (langTranslations && key in langTranslations) {
    return langTranslations[key as keyof typeof langTranslations]
  }
  return key
}

// Methods
const changeLanguage = (lang: LanguageCode) => {
  currentLang.value = lang
}

const checkConsent = (): string | null => {
  const consent = CookieManager.get('nightGodTarotConsent')
  const consentDate = CookieManager.get('nightGodTarotConsentDate')
  
  if (consent && consentDate) {
    const consentTimestamp = parseInt(consentDate)
    const currentTimestamp = Date.now()
    const daysSinceConsent = (currentTimestamp - consentTimestamp) / (1000 * 60 * 60 * 24)
    
    // Consent expires after 365 days
    if (daysSinceConsent < 365) {
      return consent // 'true', 'limited', or 'false'
    }
  }
  return null
}

const handleAgree = (): void => {
  // User agreed - save consent
  CookieManager.set('nightGodTarotConsent', 'true', 365)
  CookieManager.set('nightGodTarotConsentDate', Date.now().toString(), 365)
  CookieManager.set('nightGodTarotLanguage', currentLang.value, 365)
  
  // Track consent
  trackConsent(true)
  
  // Hide modal and enable features
  showModal.value = false
  enableWebsiteFeatures()
  
  // Show success message
  showStatus('success', '✅ ' + t('i-agree'), t('agree-desc'))
  
  console.log('🔒 Legal consent granted - full website access enabled')
}

const handleDisagree = (): void => {
  // User disagreed - save limited consent and return to home
  console.log('🔒 Privacy consent declined - enabling limited mode')
  
  // Save limited consent (no data collection)
  CookieManager.set('nightGodTarotConsent', 'limited', 365)
  CookieManager.set('nightGodTarotConsentDate', Date.now().toString(), 365)
  CookieManager.set('nightGodTarotLanguage', currentLang.value, 365)
  
  // Track rejection (without personal data)
  console.log('📊 Consent declined - limited functionality enabled')
  
  // Hide modal and enable limited features
  showModal.value = false
  enableLimitedFeatures()
  
  // Show info message
  showStatus('warning', '🔒 ' + t('i-disagree'), t('limited-mode-message'))
}

const trackConsent = (agreed: boolean): void => {
  console.log('🔮 Consent tracked:', agreed ? 'Agreed' : 'Disagreed')
  
  // Send to analytics if available
  if (typeof (window as any).gtag !== 'undefined') {
    (window as any).gtag('event', 'consent_response', {
      'consent_given': agreed,
      'app': 'night_god_tarot'
    })
  }

  // Send to backend
  fetch('/api/consent/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      consent: agreed,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    })
  }).catch(error => {
    console.warn('Could not track consent:', error)
  })
}

const enableWebsiteFeatures = (): void => {
  console.log('🌟 Full website features enabled')
  
  // Store consent status globally for other components
  if (typeof window !== 'undefined') {
    ;(window as any).nightGodTarotConsent = true
    ;(window as any).nightGodTarotFeaturesMode = 'full'
  }
  
  // Enable analytics, personalization, etc.
  localStorage.setItem('featuresEnabled', 'true')
  localStorage.setItem('consentMode', 'full')
  
  // Emit event for parent components
  document.dispatchEvent(new CustomEvent('consentGranted', { 
    detail: { fullFeatures: true, mode: 'full' } 
  }))
}

const enableLimitedFeatures = (): void => {
  console.log('🔒 Limited website features enabled')
  
  // Store limited consent status globally
  if (typeof window !== 'undefined') {
    ;(window as any).nightGodTarotConsent = false
    ;(window as any).nightGodTarotFeaturesMode = 'limited'
  }
  
  // Enable only basic features, no tracking/analytics
  localStorage.setItem('featuresEnabled', 'limited')
  localStorage.setItem('consentMode', 'limited')
  
  // Emit event for parent components
  document.dispatchEvent(new CustomEvent('consentLimited', { 
    detail: { limitedFeatures: true, mode: 'limited' } 
  }))
}

const restrictWebsiteFeatures = (): void => {
  console.log('🌫️ Limited website features')
  
  // Store consent status globally
  if (typeof window !== 'undefined') {
    ;(window as any).nightGodTarotConsent = false
  }
  
  // Disable certain features
  localStorage.setItem('featuresEnabled', 'false')
  
  // Emit event for parent components
  document.dispatchEvent(new CustomEvent('consentDenied', { 
    detail: { limitedFeatures: true } 
  }))
}

const showStatus = (type: 'success' | 'warning', title: string, message: string): void => {
  statusMessage.show = true
  statusMessage.type = type
  statusMessage.title = title
  statusMessage.message = message
  
  setTimeout(() => {
    statusMessage.show = false
  }, 5000)
}

const preventClose = (): void => {
  // Show a gentle reminder that they need to make a choice
  const modal = document.querySelector('.cosmic-modal')
  if (modal) {
    modal.classList.add('shake-animation')
    setTimeout(() => {
      modal.classList.remove('shake-animation')
    }, 600)
  }
}

// Visual Effects
const getRandomStarStyle = () => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 3 + 's',
    animationDuration: (2 + Math.random() * 3) + 's'
  }
}

const getRandomParticleStyle = () => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 5 + 's',
    animationDuration: (3 + Math.random() * 4) + 's'
  }
}

// CCPA and Data Export Handlers
const handleCCPARequest = (): void => {
  showStatus('success', '🔒 CCPA Request', 'Your "Do Not Sell" request has been processed. We respect your privacy rights.')
  
  // Save CCPA opt-out preference
  CookieManager.set('nightGodTarot_CCPA_OptOut', 'true', 365)
  
  // Log the request
  console.log('📋 CCPA "Do Not Sell" request processed')
}

const handleDataExport = (): void => {
  showStatus('success', '📋 Data Export', 'Your data export request has been initiated. You will receive your data within 30 days.')
  
  // Create export request record
  const exportRequest = {
    timestamp: Date.now(),
    status: 'pending',
    userAgent: navigator.userAgent,
    language: currentLang.value
  }
  
  // Store export request
  CookieManager.set('nightGodTarot_DataExport', JSON.stringify(exportRequest), 365)
  
  // Log the request
  console.log('🔄 Data export request initiated:', exportRequest)
}

// Lifecycle
onMounted(() => {
  const consent = checkConsent()
  
  // Load saved language preference
  const savedLang = CookieManager.get('nightGodTarotLanguage')
  if (savedLang && ['zh', 'en', 'ja'].includes(savedLang)) {
    currentLang.value = savedLang as LanguageCode
  }
  
  if (consent === null) {
    // No consent record - show modal after a brief delay
    setTimeout(() => {
      showModal.value = true
    }, 1000)
  } else if (consent === 'true') {
    enableWebsiteFeatures()
  } else if (consent === 'limited') {
    enableLimitedFeatures()
  } else {
    restrictWebsiteFeatures()
  }
})

// Expose methods for external use
defineExpose({
  checkConsent,
  clearConsent: () => {
    CookieManager.delete('nightGodTarotConsent')
    CookieManager.delete('nightGodTarotConsentDate')
    showStatus('success', '🔄 重置完成', '同意狀態已清除，頁面將重新載入。')
    setTimeout(() => window.location.reload(), 2000)
  }
})
</script>

<style scoped>
/* Base Overlay */
.consent-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(26, 26, 46, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: cosmicFadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  backdrop-filter: blur(10px);
}

@keyframes cosmicFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(10px);
  }
}

/* Cosmic Modal */
.consent-modal {
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(22, 33, 62, 0.95) 50%, rgba(16, 21, 30, 0.98) 100%);
  border-radius: 25px;
  max-width: 800px;
  width: 90%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 100px rgba(255, 215, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.3);
  animation: modalSlideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(100px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.shake-animation {
  animation: gentleShake 0.6s ease-in-out;
}

@keyframes gentleShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Cosmic Header */
.consent-header {
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%);
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  text-align: center;
}

.header-constellation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.cosmic-symbols {
  display: flex;
  gap: 1.5rem;
  font-size: 2rem;
  animation: symbolFloat 3s ease-in-out infinite;
}

@keyframes symbolFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.cosmic-symbols .symbol:nth-child(2) {
  animation-delay: 0.5s;
}

.cosmic-symbols .symbol:nth-child(3) {
  animation-delay: 1s;
}

.cosmic-title {
  color: #ffd700;
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
  font-family: 'Noto Serif TC', serif;
}

.subtitle {
  color: #c9b037;
  font-size: 1rem;
  font-style: italic;
  opacity: 0.9;
}

/* Content */
.consent-content {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
  color: #ffffff;
}

.mystical-intro {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 215, 0, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.intro-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #ffd700;
  margin: 0;
  font-weight: 500;
}

.sections-container {
  display: grid;
  gap: 1.5rem;
}

.consent-section {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.consent-section:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 215, 0, 0.2);
}

.consent-section.highlight {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 107, 53, 0.05) 100%);
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.section-title {
  color: #ffd700;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-content {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

.mystical-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mystical-list li {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 0.8rem;
  padding-left: 1.5rem;
  position: relative;
  font-size: 0.95rem;
}

.mystical-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.6rem;
  width: 4px;
  height: 4px;
  background: #ffd700;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
}

/* Header Language Switcher */
.language-switcher {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
}

.language-label {
  color: #ffd700;
  font-weight: bold;
  margin-right: 10px;
  font-size: 14px;
}

.lang-btn {
  padding: 6px 12px;
  border-radius: 15px;
  border: 1px solid rgba(255, 215, 0, 0.5);
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lang-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  transform: scale(1.05);
}

.lang-btn.active {
  background: linear-gradient(135deg, #ffd700 0%, #ff6b35 100%);
  color: #1a1a2e;
  border-color: #ffd700;
}

/* Important Notice */
.important-notice {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 25px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 107, 53, 0.08) 100%);
  border: 2px solid rgba(255, 215, 0, 0.4);
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
}

.notice-icon {
  font-size: 24px;
  color: #ffd700;
}

.notice-content {
  flex: 1;
}

.notice-title {
  color: #ffd700;
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 10px 0;
}

.notice-text {
  color: rgba(255, 255, 255, 0.95);
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
}

/* Consent Introduction */
.consent-section.consent-intro {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(103, 126, 234, 0.05) 100%);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  padding: 25px;
}

.consent-explanation {
  margin-top: 15px;
}

.highlight-text {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 20px;
}

.choice-explanation {
  display: grid;
  gap: 15px;
  margin-top: 20px;
}

.choice-option {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.choice-option:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 215, 0, 0.3);
}

.agree-option:hover {
  border-color: rgba(76, 175, 80, 0.4);
  background: rgba(76, 175, 80, 0.05);
}

.disagree-option:hover {
  border-color: rgba(255, 107, 53, 0.4);
  background: rgba(255, 107, 53, 0.05);
}

.choice-icon {
  font-size: 20px;
  margin-top: 2px;
}

.choice-details {
  flex: 1;
}

.choice-details strong {
  display: block;
  font-size: 16px;
  margin-bottom: 5px;
  color: #ffd700;
}

.choice-details p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
}

/* Content Sections */
.consent-section.critical {
  background: linear-gradient(135deg, rgba(255, 0, 0, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%);
  border: 2px solid rgba(255, 0, 0, 0.3);
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.1);
}

.decision-required {
  text-align: center;
  margin: 15px 0;
  padding: 10px;
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 8px;
  color: #ffcccb;
  font-size: 16px;
  animation: pulse-warning 2s infinite;
}

@keyframes pulse-warning {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.legal-list, .rights-list {
  list-style: none;
  padding: 0;
  margin: 15px 0;
}

.legal-list li, .rights-list li {
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  line-height: 1.6;
  font-size: 0.95rem;
}

.legal-list li::before {
  content: '📋';
  margin-right: 8px;
  font-size: 14px;
}

.rights-list li::before {
  content: '⚖️';
  margin-right: 8px;
  font-size: 14px;
}

.protection-notice {
  background: rgba(255, 215, 0, 0.05);
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #ffd700;
  margin-top: 15px;
  font-style: italic;
}

/* Footer */
.consent-footer {
  padding: 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-top: 2px solid rgba(255, 215, 0, 0.2);
}

.footer-warning {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 25px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 0, 0, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%);
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: 12px;
}

.warning-icon {
  font-size: 24px;
  animation: warning-pulse 2s infinite;
}

.warning-content {
  flex: 1;
  color: #ffcccb;
}

.warning-content strong {
  display: block;
  font-size: 18px;
  margin-bottom: 8px;
  color: #ff6b35;
}

.warning-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

@keyframes warning-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.legal-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
}

.legal-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  margin-bottom: 5px;
  font-style: italic;
}

.effective-date {
  color: #ffd700;
  font-size: 11px;
  font-weight: bold;
  margin: 0;
}

.footer-message {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #c9b037;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.cosmic-icon {
  font-size: 1.2rem;
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.button-constellation {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.consent-btn {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  min-width: 140px;
  font-family: 'Noto Serif TC', serif;
}

.consent-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.consent-btn:active {
  transform: translateY(-1px);
}

.disagree-btn {
  border-color: rgba(255, 107, 53, 0.5);
  color: #ff6b35;
}

.disagree-btn:hover {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 107, 53, 0.1) 100%);
  border-color: rgba(255, 107, 53, 0.8);
  box-shadow: 0 10px 25px rgba(255, 107, 53, 0.2);
}

.agree-btn {
  border-color: rgba(255, 215, 0, 0.5);
  color: #ffd700;
}

.agree-btn:hover {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%);
  border-color: rgba(255, 215, 0, 0.8);
  box-shadow: 0 10px 25px rgba(255, 215, 0, 0.2);
}

.btn-icon {
  font-size: 1.5rem;
}

.btn-text {
  font-size: 1.1rem;
  font-weight: 600;
}

.btn-subtext {
  font-size: 0.8rem;
  opacity: 0.7;
  font-style: italic;
}

/* Cosmic Background Effects */
.cosmic-background {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.floating-stars {
  position: absolute;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  font-size: 1rem;
  animation: starFloat 4s ease-in-out infinite;
  opacity: 0.6;
}

@keyframes starFloat {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
    opacity: 0.3;
  }
  50% { 
    transform: translateY(-20px) rotate(180deg); 
    opacity: 0.8;
  }
}

.mystical-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  font-size: 0.8rem;
  animation: particleDrift 6s linear infinite;
  opacity: 0.4;
}

@keyframes particleDrift {
  from { 
    transform: translateX(-50px) rotate(0deg);
    opacity: 0;
  }
  10% { opacity: 0.4; }
  90% { opacity: 0.4; }
  to { 
    transform: translateX(100vw) rotate(360deg);
    opacity: 0;
  }
}

/* Status Toast */
.status-toast {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 10001;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%);
  border-radius: 15px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid;
  backdrop-filter: blur(15px);
  animation: toastSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  max-width: 400px;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.status-toast.success {
  border-color: rgba(16, 185, 129, 0.5);
}

.status-toast.warning {
  border-color: rgba(245, 158, 11, 0.5);
}

.toast-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  color: #ffd700;
  margin-bottom: 0.3rem;
  font-size: 0.95rem;
}

.toast-message {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  line-height: 1.4;
}

/* Scrollbar Styling */
.consent-content::-webkit-scrollbar {
  width: 8px;
}

.consent-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.consent-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  border-radius: 4px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .consent-modal {
    width: 95%;
    max-height: 90vh;
    margin: 1rem;
  }
  
  .consent-header,
  .consent-content,
  .consent-footer {
    padding: 1.5rem;
  }
  
  .cosmic-title {
    font-size: 1.8rem;
  }
  
  .button-constellation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .consent-btn {
    width: 100%;
  }
  
  .status-toast {
    right: 10px;
    left: 10px;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .cosmic-symbols {
    font-size: 1.5rem;
    gap: 1rem;
  }
  
  .cosmic-title {
    font-size: 1.5rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
  }
  
  .section-title {
    font-size: 1rem;
  }
  
  .section-content,
  .mystical-list li {
    font-size: 0.9rem;
  }
}
</style>