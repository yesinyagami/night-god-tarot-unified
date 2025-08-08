// 檔案位置: src/data/tarot-data.js

// 👇👇👇【您的任務】👇👇👇
// 請將您所有的塔羅牌資料物件，全部放入這個陣列中。
const tarotCards = [
  // 這裡是第一張卡的範例格式，請依照這個格式放入您所有的卡牌
  {
    id: 'strength', // 一個獨一無二的英文ID
    name: { zh: '力量', en: 'Strength', ja: '力' },
    image: '/assets/strength.png', // 指向 public/assets/ 中的圖片路徑
    description: { zh: '力量牌代表內在的勇氣...', en: 'Strength represents...', ja: '力のカードは...' },
    // ...以及您為這張牌準備的其他所有資料欄位...
  },

  // {
  //   id: 'empress',
  //   name: { zh: '皇后', ... },
  //   image: '/assets/the-empress.png',
  //   ...
  // },

  // ...貼上您其餘所有的卡牌資料...

];

export default tarotCards;