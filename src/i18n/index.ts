import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    element: 'Element',
    energy: 'Energy',
    nextRank: 'Next Rank',
    mysticalJourney: 'Mystical Journey',
    chooseMysticalJourney: 'Choose Your Mystical Journey',
    unlockDivineWisdom: 'Unlock Divine Wisdom',
    dailyDraws: 'Daily Draws',
    seeker: 'Seeker',
    free: 'Free',
    perfectForBeginners: 'Perfect for Beginners'
  },
  'zh-TW': {
    element: '元素',
    energy: '能量',
    nextRank: '下一階級',
    mysticalJourney: '神秘之旅',
    chooseMysticalJourney: '選擇您的神秘之旅',
    unlockDivineWisdom: '解鎖神聖智慧',
    dailyDraws: '每日抽牌',
    seeker: '探索者',
    free: '免費',
    perfectForBeginners: '完美適合初學者'
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

export default i18n