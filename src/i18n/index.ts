import { createI18n } from 'vue-i18n'

const messages = {
  zh: {
    // Core UI
    title: '夜神塔羅 - AI神諭系統',
    subtitle: '解鎖命運密碼，獲得神聖指引',
    element: '元素',
    energy: '能量',
    nextRank: '下一階級',
    mysticalJourney: '神秘之旅',
    chooseMysticalJourney: '選擇您的神秘之旅',
    unlockDivineWisdom: '解鎖神聖智慧',
    dailyDraws: '每日抽牌',
    seeker: '探索者',
    free: '免費',
    perfectForBeginners: '完美適合初學者',
    
    // Warnings and Safety
    importantWarning: '重要聲明',
    warningMessage: '本系統基於AI技術提供娛樂性占卜服務，僅供參考，不應作為重大決策依據。',
    warningPoint1: '請以理性態度對待占卜結果',
    warningPoint2: '重要決策請諮詢專業人士',
    warningPoint3: '本服務僅限18歲以上用戶使用',
    iUnderstand: '我已理解並同意',
    
    // Registration
    registrationTitle: '啟動記憶系統',
    registrationDescription: '創建專屬靈魂檔案，保存您的神秘旅程',
    nameLabel: '靈魂之名',
    namePlaceholder: '請輸入您的姓名',
    emailLabel: '聯繫方式',
    emailPlaceholder: '請輸入電子郵件',
    passwordLabel: '守護密語',
    passwordPlaceholder: '設定密碼（8位以上）',
    completeRegistration: '啟動記憶系統',
    freeTrialCompleted: '免費體驗已完成，註冊以獲得完整功能',
    unlimitedFlips: '無限制翻牌體驗',
    viewFlippedCards: '查看已翻開的牌卡',
    saveProgress: '保存您的進度與記錄',
    
    // Privacy
    privacyPolicyTitle: '隱私政策',
    ipDataCollectionTitle: 'IP地址收集',
    ipDataCollectionText: '我們收集您的IP地址用於以下目的：',
    websiteFunctionality: '確保網站正常運行',
    securityProtection: '保護系統安全',
    statisticalAnalysis: '進行匿名統計分析',
    ipStorageText: 'IP地址將加密存儲，不會與個人身份關聯',
    emailDataCollectionTitle: '電子郵件收集',
    emailDataCollectionText: '您的電子郵件將用於：',
    accountManagement: '帳戶管理與服務提供',
    communicationNotification: '重要通知與溝通',
    marketingPromotion: '產品更新與優惠資訊（可選）',
    userRights: '您的權利',
    rightUnsubscribe: '隨時取消訂閱營銷郵件',
    rightAccess: '查詢、修改或刪除您的數據',
    rightProtection: '數據安全與隱私保護',
    policyUpdates: '本政策可能會更新，重要變更將會通知您',
    contactUs: '如有問題，請聯繫：support@nightgodtarot.com',
    iAcceptPrivacy: '我接受隱私政策',
    
    // Oracle Interface
    activateOracle: '啟動神諭',
    askUniverse: '向宇宙提問',
    questionPlaceholder: '請描述您想要指引的問題...',
    flippedCardsGallery: '已翻開的神牌',
    shareReading: '分享解讀',
    saveReading: '保存解讀',
    resetReading: '重新開始',
    
    // Tabs
    oracleTab: '神諭占卜',
    chatTab: 'AI對話',
    vipTab: 'VIP會員',
    novelTab: '靈性小說',
    progressTab: '成長進度',
    
    // Chat
    chatPlaceholder: '與AI神諭對話...',
    
    // Notifications
    cardsRevealed: '神牌已顯現',
    selectCards: '請選擇您感應到的牌卡',
    readingComplete: '解讀完成',
    wisdomRevealed: '宇宙智慧已為您揭示',
    audioSuggestion: '音頻建議',
    enhanceConnection: '嘗試雙耳節拍增強連接',
    connectionLost: '連接中斷',
    backupSystem: '啟動備用系統',
    copied: '已複製',
    resultCopied: '解讀結果已複製到剪貼板',
    saved: '已保存',
    readingSaved: '解讀已保存到您的記錄',
    chapterLocked: '章節未解鎖',
    levelUp: '等級提升',
    
    // Novel Chapters
    prologueNumber: '序章',
    prologueTitle: '靜默之歌的起源',
    chapter1Number: '第一章',
    chapter1Title: '克拉埃爾的覺醒',
    chapter2Number: '第二章',
    chapter2Title: '命運之輪轉動',
    chapter3Number: '第三章',
    chapter3Title: '陰影中的真相',
    chapter4Number: '第四章',
    chapter4Title: '光明與黑暗的抉擇',
    chapter5Number: '第五章',
    chapter5Title: '永恆之歌',
    
    // AI Features
    generating: '生成中',
    newAIImage: '新AI圖像',
    reading: '解讀中',
    instantReading: '即時解讀',
    creating: '創建中',
    animate: '動畫',
    researching: '研究中',
    webReading: '網絡增強解讀',
    cancelReading: '取消解讀',
    generatingAIImage: '正在生成AI圖像...'
  },
  
  en: {
    // Core UI
    title: 'Night God Tarot - AI Oracle System',
    subtitle: 'Unlock Destiny Codes, Receive Divine Guidance',
    element: 'Element',
    energy: 'Energy',
    nextRank: 'Next Rank',
    mysticalJourney: 'Mystical Journey',
    chooseMysticalJourney: 'Choose Your Mystical Journey',
    unlockDivineWisdom: 'Unlock Divine Wisdom',
    dailyDraws: 'Daily Draws',
    seeker: 'Seeker',
    free: 'Free',
    perfectForBeginners: 'Perfect for Beginners',
    
    // Warnings and Safety
    importantWarning: 'Important Declaration',
    warningMessage: 'This system provides entertainment-based divination services using AI technology, for reference only and should not be used as a basis for major decisions.',
    warningPoint1: 'Please approach divination results with rationality',
    warningPoint2: 'Consult professionals for important decisions',
    warningPoint3: 'This service is only for users 18 years and older',
    iUnderstand: 'I understand and agree',
    
    // Registration
    registrationTitle: 'Activate Memory System',
    registrationDescription: 'Create your exclusive soul profile and preserve your mystical journey',
    nameLabel: 'Soul Name',
    namePlaceholder: 'Please enter your name',
    emailLabel: 'Contact Method',
    emailPlaceholder: 'Please enter email address',
    passwordLabel: 'Guardian Password',
    passwordPlaceholder: 'Set password (8+ characters)',
    completeRegistration: 'Activate Memory System',
    freeTrialCompleted: 'Free trial completed, register for full features',
    unlimitedFlips: 'Unlimited card flipping experience',
    viewFlippedCards: 'View revealed cards',
    saveProgress: 'Save your progress and records',
    
    // Privacy
    privacyPolicyTitle: 'Privacy Policy',
    ipDataCollectionTitle: 'IP Address Collection',
    ipDataCollectionText: 'We collect your IP address for the following purposes:',
    websiteFunctionality: 'Ensure website functionality',
    securityProtection: 'Protect system security',
    statisticalAnalysis: 'Conduct anonymous statistical analysis',
    ipStorageText: 'IP addresses are encrypted and stored without personal identity association',
    emailDataCollectionTitle: 'Email Collection',
    emailDataCollectionText: 'Your email will be used for:',
    accountManagement: 'Account management and service provision',
    communicationNotification: 'Important notifications and communication',
    marketingPromotion: 'Product updates and promotional information (optional)',
    userRights: 'Your Rights',
    rightUnsubscribe: 'Unsubscribe from marketing emails at any time',
    rightAccess: 'Query, modify, or delete your data',
    rightProtection: 'Data security and privacy protection',
    policyUpdates: 'This policy may be updated, important changes will be notified',
    contactUs: 'For questions, contact: support@nightgodtarot.com',
    iAcceptPrivacy: 'I accept the privacy policy',
    
    // Oracle Interface
    activateOracle: 'Activate Oracle',
    askUniverse: 'Ask the Universe',
    questionPlaceholder: 'Describe the question you seek guidance for...',
    flippedCardsGallery: 'Revealed Divine Cards',
    shareReading: 'Share Reading',
    saveReading: 'Save Reading',
    resetReading: 'Start Over',
    
    // Tabs
    oracleTab: 'Oracle Divination',
    chatTab: 'AI Dialogue',
    vipTab: 'VIP Membership',
    novelTab: 'Spiritual Novel',
    progressTab: 'Growth Progress',
    
    // Chat
    chatPlaceholder: 'Chat with AI Oracle...',
    
    // Notifications
    cardsRevealed: 'Divine cards revealed',
    selectCards: 'Please select the cards you sense',
    readingComplete: 'Reading complete',
    wisdomRevealed: 'Universal wisdom has been revealed for you',
    audioSuggestion: 'Audio suggestion',
    enhanceConnection: 'Try binaural beats to enhance connection',
    connectionLost: 'Connection lost',
    backupSystem: 'Backup system activated',
    copied: 'Copied',
    resultCopied: 'Reading result copied to clipboard',
    saved: 'Saved',
    readingSaved: 'Reading saved to your records',
    chapterLocked: 'Chapter locked',
    levelUp: 'Level up',
    
    // Novel Chapters
    prologueNumber: 'Prologue',
    prologueTitle: 'Origin of the Song of Silence',
    chapter1Number: 'Chapter 1',
    chapter1Title: "Khrael's Awakening",
    chapter2Number: 'Chapter 2',
    chapter2Title: 'The Wheel of Fate Turns',
    chapter3Number: 'Chapter 3',
    chapter3Title: 'Truth in the Shadows',
    chapter4Number: 'Chapter 4',
    chapter4Title: 'Choice Between Light and Darkness',
    chapter5Number: 'Chapter 5',
    chapter5Title: 'The Eternal Song',
    
    // AI Features
    generating: 'Generating',
    newAIImage: 'New AI Image',
    reading: 'Reading',
    instantReading: 'Instant Reading',
    creating: 'Creating',
    animate: 'Animate',
    researching: 'Researching',
    webReading: 'Web Enhanced Reading',
    cancelReading: 'Cancel Reading',
    generatingAIImage: 'Generating AI image...'
  },
  
  ja: {
    // Core UI
    title: 'ナイトゴッドタロット - AI神託システム',
    subtitle: '運命のコードを解き明かし、神聖なガイダンスを受ける',
    element: '元素',
    energy: 'エネルギー',
    nextRank: '次のランク',
    mysticalJourney: '神秘の旅',
    chooseMysticalJourney: 'あなたの神秘の旅を選択',
    unlockDivineWisdom: '神聖な知恵を解放',
    dailyDraws: '毎日のドロー',
    seeker: 'シーカー',
    free: '無料',
    perfectForBeginners: '初心者に最適',
    
    // Warnings and Safety
    importantWarning: '重要な宣言',
    warningMessage: 'このシステムはAI技術を使用した娯楽的な占いサービスを提供しており、参考のみであり、重要な決定の根拠として使用すべきではありません。',
    warningPoint1: '占い結果は理性的に受け止めてください',
    warningPoint2: '重要な決定は専門家にご相談ください',
    warningPoint3: 'このサービスは18歳以上のユーザーのみご利用いただけます',
    iUnderstand: '理解し同意します',
    
    // Registration
    registrationTitle: 'メモリーシステム起動',
    registrationDescription: '専用のソウルプロファイルを作成し、神秘の旅を保存する',
    nameLabel: 'ソウル名',
    namePlaceholder: 'お名前を入力してください',
    emailLabel: '連絡方法',
    emailPlaceholder: 'メールアドレスを入力してください',
    passwordLabel: 'ガーディアンパスワード',
    passwordPlaceholder: 'パスワードを設定（8文字以上）',
    completeRegistration: 'メモリーシステム起動',
    freeTrialCompleted: '無料体験完了、完全機能のため登録してください',
    unlimitedFlips: '無制限カードフリップ体験',
    viewFlippedCards: '公開されたカードを表示',
    saveProgress: '進捗と記録を保存',
    
    // Privacy
    privacyPolicyTitle: 'プライバシーポリシー',
    ipDataCollectionTitle: 'IPアドレス収集',
    ipDataCollectionText: '以下の目的でIPアドレスを収集します：',
    websiteFunctionality: 'ウェブサイト機能の確保',
    securityProtection: 'システムセキュリティの保護',
    statisticalAnalysis: '匿名統計分析の実施',
    ipStorageText: 'IPアドレスは暗号化され、個人識別との関連なく保存されます',
    emailDataCollectionTitle: 'メール収集',
    emailDataCollectionText: 'あなたのメールは以下に使用されます：',
    accountManagement: 'アカウント管理とサービス提供',
    communicationNotification: '重要な通知とコミュニケーション',
    marketingPromotion: '製品更新とプロモーション情報（オプション）',
    userRights: 'あなたの権利',
    rightUnsubscribe: 'いつでもマーケティングメールの配信停止',
    rightAccess: 'データの照会、修正、削除',
    rightProtection: 'データセキュリティとプライバシー保護',
    policyUpdates: 'このポリシーは更新される可能性があり、重要な変更は通知されます',
    contactUs: 'ご質問は以下にお問い合わせください：support@nightgodtarot.com',
    iAcceptPrivacy: 'プライバシーポリシーを受け入れます',
    
    // Oracle Interface
    activateOracle: '神託を起動',
    askUniverse: '宇宙に問いかける',
    questionPlaceholder: 'ガイダンスを求める質問を記述してください...',
    flippedCardsGallery: '公開された神聖なカード',
    shareReading: 'リーディングを共有',
    saveReading: 'リーディングを保存',
    resetReading: '最初からやり直す',
    
    // Tabs
    oracleTab: '神託占い',
    chatTab: 'AI対話',
    vipTab: 'VIPメンバーシップ',
    novelTab: 'スピリチュアル小説',
    progressTab: '成長進捗',
    
    // Chat
    chatPlaceholder: 'AI神託とチャット...',
    
    // Notifications
    cardsRevealed: '神聖なカードが公開されました',
    selectCards: '感じるカードを選択してください',
    readingComplete: 'リーディング完了',
    wisdomRevealed: '宇宙の知恵があなたに明かされました',
    audioSuggestion: 'オーディオ提案',
    enhanceConnection: 'バイノーラルビートで接続を強化してみてください',
    connectionLost: '接続が失われました',
    backupSystem: 'バックアップシステム起動',
    copied: 'コピーしました',
    resultCopied: 'リーディング結果がクリップボードにコピーされました',
    saved: '保存しました',
    readingSaved: 'リーディングが記録に保存されました',
    chapterLocked: 'チャプターロック',
    levelUp: 'レベルアップ',
    
    // Novel Chapters
    prologueNumber: 'プロローグ',
    prologueTitle: '静寂の歌の起源',
    chapter1Number: '第1章',
    chapter1Title: 'クラエルの覚醒',
    chapter2Number: '第2章',
    chapter2Title: '運命の輪が回る',
    chapter3Number: '第3章',
    chapter3Title: '影の中の真実',
    chapter4Number: '第4章',
    chapter4Title: '光と闇の選択',
    chapter5Number: '第5章',
    chapter5Title: '永遠の歌',
    
    // AI Features
    generating: '生成中',
    newAIImage: '新しいAI画像',
    reading: 'リーディング中',
    instantReading: 'インスタントリーディング',
    creating: '作成中',
    animate: 'アニメート',
    researching: '研究中',
    webReading: 'ウェブ強化リーディング',
    cancelReading: 'リーディングをキャンセル',
    generatingAIImage: 'AI画像を生成中...'
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'zh', // Start with Chinese as default
  fallbackLocale: 'en',
  messages,
  globalInjection: true,
  allowComposition: true
})

// Export language utilities
export const availableLocales = ['zh', 'en', 'ja'] as const
export type SupportedLocale = typeof availableLocales[number]

export const localeNames = {
  zh: '中文',
  en: 'English', 
  ja: '日本語'
}

export default i18n