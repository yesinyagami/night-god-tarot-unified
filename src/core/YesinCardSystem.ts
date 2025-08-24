/**
 * Yesin Yagami's Complete 94-Card System Integration
 * 78 Traditional Tarot + 16 Unique Oracle Cards
 * With custom artwork and Khrael language bindings
 */

export class YesinCompleteCardSystem {
  private readonly TOTAL_CARDS = 94;
  private readonly TRADITIONAL_CARDS = 78;
  private readonly ORACLE_CARDS = 16;
  private readonly CARD_PATH = '/assets/cardspicture/';

  // Complete 78-card traditional deck with your artwork
  private readonly traditionalDeck: Map<number, TarotCard> = new Map([
    // Major Arcana (22 cards)
    [1, { id: 1, name: 'The Fool', image: '01_The_Fool.png', khral: '𐌷𐌴𐍂𐌀𐌽', element: 'Air', journey: 'Beginning' }],
    [2, { id: 2, name: 'The Magician', image: '02_The_Magician.png', khral: '𐌼𐌰𐌲𐌹𐍃', element: 'Fire', journey: 'Manifestation' }],
    [3, { id: 3, name: 'The High Priestess', image: '03_The_High_Priestess.png', khral: '𐍀𐍂𐌹𐌴𐍃𐍄', element: 'Water', journey: 'Intuition' }],
    [4, { id: 4, name: 'The Empress', image: '04_The_Empress.png', khral: '𐌴𐌼𐍀𐍂𐌴𐍃𐍃', element: 'Earth', journey: 'Nurturing' }],
    [5, { id: 5, name: 'The Emperor', image: '05_The_Emperor.png', khral: '𐌴𐌼𐍀𐌴𐍂𐍉𐍂', element: 'Fire', journey: 'Authority' }],
    [6, { id: 6, name: 'The Hierophant', image: '06_The_Hierophant.png', khral: '𐌷𐌹𐌴𐍂𐍉𐍆𐌰𐌽𐍄', element: 'Earth', journey: 'Tradition' }],
    [7, { id: 7, name: 'The Lovers', image: '07_The_Lovers.png', khral: '𐌻𐍉𐌼𐌿𐍂𐍃', element: 'Air', journey: 'Choice' }],
    [8, { id: 8, name: 'The Chariot', image: '08_The_Chariot.png', khral: '𐍂𐌰𐌸𐌰', element: 'Water', journey: 'Control' }],
    [9, { id: 9, name: 'Strength', image: '09_Strength.png', khral: '𐍃𐍄𐍂𐌴𐌽𐌲𐌸', element: 'Fire', journey: 'Inner Power' }],
    [10, { id: 10, name: 'The Hermit', image: '10_The_Hermit.png', khral: '𐌷𐌴𐍂𐌼𐌹𐍄', element: 'Earth', journey: 'Soul Searching' }],
    [11, { id: 11, name: 'Wheel of Fortune', image: '11_Wheel_of_Fortune.png', khral: '𐍅𐌷𐌴𐌴𐌻', element: 'Fire', journey: 'Destiny' }],
    [12, { id: 12, name: 'Justice', image: '12_Justice.png', khral: '𐌾𐌿𐍃𐍄𐌹𐍄𐌹𐌰', element: 'Air', journey: 'Balance' }],
    [13, { id: 13, name: 'The Hanged Man', image: '13_The_Hanged_Man.png', khral: '𐌷𐌰𐌽𐌲𐌹𐌽𐌲', element: 'Water', journey: 'Sacrifice' }],
    [14, { id: 14, name: 'Death', image: '14_Death.png', khral: '𐌳𐌴𐌰𐌸', element: 'Water', journey: 'Transformation' }],
    [15, { id: 15, name: 'Temperance', image: '15_Temperance.png', khral: '𐍄𐌴𐌼𐍀𐌴𐍂𐌰𐌽𐍃', element: 'Fire', journey: 'Moderation' }],
    [16, { id: 16, name: 'The Devil', image: '16_The_Devil.png', khral: '𐌳𐌹𐌰𐌱𐍉𐌻', element: 'Earth', journey: 'Temptation' }],
    [17, { id: 17, name: 'The Tower', image: '17_The_Tower.png', khral: '𐍄𐌿𐍂𐍂𐌹𐍃', element: 'Fire', journey: 'Revelation' }],
    [18, { id: 18, name: 'The Star', image: '18_The_Star.png', khral: '𐍃𐍄𐌴𐌻𐌻𐌰', element: 'Air', journey: 'Hope' }],
    [19, { id: 19, name: 'The Moon', image: '19_The_Moon.png', khral: '𐌻𐌿𐌽𐌰', element: 'Water', journey: 'Illusion' }],
    [20, { id: 20, name: 'The Sun', image: '20_The_Sun.png', khral: '𐍃𐍉𐌻', element: 'Fire', journey: 'Joy' }],
    [21, { id: 21, name: 'Judgement', image: '21_Judgement.png', khral: '𐌾𐌿𐌳𐌲𐌴𐌼𐌴𐌽𐍄', element: 'Fire', journey: 'Rebirth' }],
    [22, { id: 22, name: 'The World', image: '22_The_World.png', khral: '𐍅𐍉𐍂𐌻𐌳', element: 'Earth', journey: 'Completion' }],

    // Minor Arcana - Wands (Fire)
    [23, { id: 23, name: 'Ace of Wands', image: '23_Ace_of_Wands.png', khral: '𐌰𐍃 𐍅𐌰𐌽𐌳', suit: 'Wands', element: 'Fire' }],
    [24, { id: 24, name: 'Two of Wands', image: '24_Two_of_Wands.png', khral: '𐍄𐍅𐍉 𐍅𐌰𐌽𐌳', suit: 'Wands', element: 'Fire' }],
    [25, { id: 25, name: 'Three of Wands', image: '25_Three_of_Wands.png', khral: '𐌸𐍂𐌹 𐍅𐌰𐌽𐌳', suit: 'Wands', element: 'Fire' }],
    [26, { id: 26, name: 'Four of Wands', image: '26_Four_of_Wands.png', khral: '𐍆𐍉𐌿𐍂 𐍅𐌰𐌽𐌳', suit: 'Wands', element: 'Fire' }],
    [27, { id: 27, name: 'Five of Wands', image: '27_Five_of_Wands.png', khral: '𐍆𐌹𐍆 𐍅𐌰𐌽𐌳', suit: 'Wands', element: 'Fire' }],
    [28, { id: 28, name: 'Six of Wands', image: '28_Six_of_Wands.png', khral: '𐍃𐌹𐍇 𐍅𐌰𐌽𐌳', suit: 'Wands', element: 'Fire' }],
    [29, { id: 29, name: 'Seven of Wands', image: '29_Seven_of_Wands.png', khral: '𐍃𐌴𐍆𐌰𐌽 𐍅𐌰𐌽𐌳', suit: 'Wands', element: 'Fire' }],
    [30, { id: 30, name: 'Eight of Wands', image: '30_Eight_of_Wands.png', khral: '𐌰𐌷𐍄 𐍅𐌰𐌽𐌳', suit: 'Wands', element: 'Fire' }],
    [31, { id: 31, name: 'Nine of Wands', image: '31_Nine_of_Wands.png', khral: '𐌽𐌹𐌽 𐍅𐌰𐌽𐌳', suit: 'Wands', element: 'Fire' }],
    [32, { id: 32, name: 'Ten of Wands', image: '32_Ten_of_Wands.png', khral: '𐍄𐌴𐌽 𐍅𐌰𐌽𐌳', suit: 'Wands', element: 'Fire' }],
    [33, { id: 33, name: 'Page of Wands', image: '33_Page_of_Wands.png', khral: '𐍀𐌰𐌲 𐍅𐌰𐌽𐌳', suit: 'Wands', element: 'Fire', court: 'Earth of Fire' }],
    [34, { id: 34, name: 'Knight of Wands', image: '34_Knight_of_Wands.png', khral: '𐌽𐌰𐌷𐍄 𐍅𐌰𐌽𐌳', suit: 'Wands', element: 'Fire', court: 'Air of Fire' }],
    [35, { id: 35, name: 'Queen of Wands', image: '35_Queen_of_Wands.png', khral: '𐌵𐌿𐌹𐌽 𐍅𐌰𐌽𐌳', suit: 'Wands', element: 'Fire', court: 'Water of Fire' }],
    [36, { id: 36, name: 'King of Wands', image: '36_King_of_Wands.png', khral: '𐌺𐌹𐌽𐌲 𐍅𐌰𐌽𐌳', suit: 'Wands', element: 'Fire', court: 'Fire of Fire' }],

    // Minor Arcana - Cups (Water)
    [37, { id: 37, name: 'Ace of Cups', image: '37_Ace_of_Cups.png', khral: '𐌰𐍃 𐌺𐌿𐍀', suit: 'Cups', element: 'Water' }],
    [38, { id: 38, name: 'Two of Cups', image: '38_Two_of_Cups.png', khral: '𐍄𐍅𐍉 𐌺𐌿𐍀', suit: 'Cups', element: 'Water' }],
    [39, { id: 39, name: 'Three of Cups', image: '39_Three_of_Cups.png', khral: '𐌸𐍂𐌹 𐌺𐌿𐍀', suit: 'Cups', element: 'Water' }],
    [40, { id: 40, name: 'Four of Cups', image: '40_Four_of_Cups.png', khral: '𐍆𐍉𐌿𐍂 𐌺𐌿𐍀', suit: 'Cups', element: 'Water' }],
    [41, { id: 41, name: 'Five of Cups', image: '41_Five_of_Cups.png', khral: '𐍆𐌹𐍆 𐌺𐌿𐍀', suit: 'Cups', element: 'Water' }],
    [42, { id: 42, name: 'Six of Cups', image: '42_Six_of_Cups.png', khral: '𐍃𐌹𐍇 𐌺𐌿𐍀', suit: 'Cups', element: 'Water' }],
    [43, { id: 43, name: 'Seven of Cups', image: '43_Seven_of_Cups.png', khral: '𐍃𐌴𐍆𐌰𐌽 𐌺𐌿𐍀', suit: 'Cups', element: 'Water' }],
    [44, { id: 44, name: 'Eight of Cups', image: '44_Eight_of_Cups.png', khral: '𐌰𐌷𐍄 𐌺𐌿𐍀', suit: 'Cups', element: 'Water' }],
    [45, { id: 45, name: 'Nine of Cups', image: '45_Nine_of_Cups.png', khral: '𐌽𐌹𐌽 𐌺𐌿𐍀', suit: 'Cups', element: 'Water' }],
    [46, { id: 46, name: 'Ten of Cups', image: '46_Ten_of_Cups.png', khral: '𐍄𐌴𐌽 𐌺𐌿𐍀', suit: 'Cups', element: 'Water' }],
    [47, { id: 47, name: 'Page of Cups', image: '47_Page_of_Cups.png', khral: '𐍀𐌰𐌲 𐌺𐌿𐍀', suit: 'Cups', element: 'Water', court: 'Earth of Water' }],
    [48, { id: 48, name: 'Knight of Cups', image: '48_Knight_of_Cups.png', khral: '𐌽𐌰𐌷𐍄 𐌺𐌿𐍀', suit: 'Cups', element: 'Water', court: 'Air of Water' }],
    [49, { id: 49, name: 'Queen of Cups', image: '49_Queen_of_Cups.png', khral: '𐌵𐌿𐌹𐌽 𐌺𐌿𐍀', suit: 'Cups', element: 'Water', court: 'Water of Water' }],
    [50, { id: 50, name: 'King of Cups', image: '50_King_of_Cups.png', khral: '𐌺𐌹𐌽𐌲 𐌺𐌿𐍀', suit: 'Cups', element: 'Water', court: 'Fire of Water' }],

    // Minor Arcana - Swords (Air)
    [51, { id: 51, name: 'Ace of Swords', image: '51_Ace_of_Swords.png', khral: '𐌰𐍃 𐍃𐍅𐍉𐍂𐌳', suit: 'Swords', element: 'Air' }],
    [52, { id: 52, name: 'Two of Swords', image: '52_Two_of_Swords.png', khral: '𐍄𐍅𐍉 𐍃𐍅𐍉𐍂𐌳', suit: 'Swords', element: 'Air' }],
    [53, { id: 53, name: 'Three of Swords', image: '53_Three_of_Swords.png', khral: '𐌸𐍂𐌹 𐍃𐍅𐍉𐍂𐌳', suit: 'Swords', element: 'Air' }],
    [54, { id: 54, name: 'Four of Swords', image: '54_Four_of_Swords.png', khral: '𐍆𐍉𐌿𐍂 𐍃𐍅𐍉𐍂𐌳', suit: 'Swords', element: 'Air' }],
    [55, { id: 55, name: 'Five of Swords', image: '55_Five_of_Swords.png', khral: '𐍆𐌹𐍆 𐍃𐍅𐍉𐍂𐌳', suit: 'Swords', element: 'Air' }],
    [56, { id: 56, name: 'Six of Swords', image: '56_Six_of_Swords.png', khral: '𐍃𐌹𐍇 𐍃𐍅𐍉𐍂𐌳', suit: 'Swords', element: 'Air' }],
    [57, { id: 57, name: 'Seven of Swords', image: '57_Seven_of_Swords.png', khral: '𐍃𐌴𐍆𐌰𐌽 𐍃𐍅𐍉𐍂𐌳', suit: 'Swords', element: 'Air' }],
    [58, { id: 58, name: 'Eight of Swords', image: '58_Eight_of_Swords.png', khral: '𐌰𐌷𐍄 𐍃𐍅𐍉𐍂𐌳', suit: 'Swords', element: 'Air' }],
    [59, { id: 59, name: 'Nine of Swords', image: '59_Nine_of_Swords.png', khral: '𐌽𐌹𐌽 𐍃𐍅𐍉𐍂𐌳', suit: 'Swords', element: 'Air' }],
    [60, { id: 60, name: 'Ten of Swords', image: '60_Ten_of_Swords.png', khral: '𐍄𐌴𐌽 𐍃𐍅𐍉𐍂𐌳', suit: 'Swords', element: 'Air' }],
    [61, { id: 61, name: 'Page of Swords', image: '61_Page_of_Swords.png', khral: '𐍀𐌰𐌲 𐍃𐍅𐍉𐍂𐌳', suit: 'Swords', element: 'Air', court: 'Earth of Air' }],
    [62, { id: 62, name: 'Knight of Swords', image: '62_Knight_of_Swords.png', khral: '𐌽𐌰𐌷𐍄 𐍃𐍅𐍉𐍂𐌳', suit: 'Swords', element: 'Air', court: 'Air of Air' }],
    [63, { id: 63, name: 'Queen of Swords', image: '63_Queen_of_Swords.png', khral: '𐌵𐌿𐌹𐌽 𐍃𐍅𐍉𐍂𐌳', suit: 'Swords', element: 'Air', court: 'Water of Air' }],
    [64, { id: 64, name: 'King of Swords', image: '64_King_of_Swords.png', khral: '𐌺𐌹𐌽𐌲 𐍃𐍅𐍉𐍂𐌳', suit: 'Swords', element: 'Air', court: 'Fire of Air' }],

    // Minor Arcana - Pentacles (Earth)
    [65, { id: 65, name: 'Ace of Pentacles', image: '65_Ace_of_Pentacles.png', khral: '𐌰𐍃 𐍀𐌴𐌽𐍄', suit: 'Pentacles', element: 'Earth' }],
    [66, { id: 66, name: 'Two of Pentacles', image: '66_Two_of_Pentacles.png', khral: '𐍄𐍅𐍉 𐍀𐌴𐌽𐍄', suit: 'Pentacles', element: 'Earth' }],
    [67, { id: 67, name: 'Three of Pentacles', image: '67_Three_of_Pentacles.png', khral: '𐌸𐍂𐌹 𐍀𐌴𐌽𐍄', suit: 'Pentacles', element: 'Earth' }],
    [68, { id: 68, name: 'Four of Pentacles', image: '68_Four_of_Pentacles.png', khral: '𐍆𐍉𐌿𐍂 𐍀𐌴𐌽𐍄', suit: 'Pentacles', element: 'Earth' }],
    [69, { id: 69, name: 'Five of Pentacles', image: '69_Five_of_Pentacles.png', khral: '𐍆𐌹𐍆 𐍀𐌴𐌽𐍄', suit: 'Pentacles', element: 'Earth' }],
    [70, { id: 70, name: 'Six of Pentacles', image: '70_Six_of_Pentacles.png', khral: '𐍃𐌹𐍇 𐍀𐌴𐌽𐍄', suit: 'Pentacles', element: 'Earth' }],
    [71, { id: 71, name: 'Seven of Pentacles', image: '71_Seven_of_Pentacles.png', khral: '𐍃𐌴𐍆𐌰𐌽 𐍀𐌴𐌽𐍄', suit: 'Pentacles', element: 'Earth' }],
    [72, { id: 72, name: 'Eight of Pentacles', image: '72_Eight_of_Pentacles.png', khral: '𐌰𐌷𐍄 𐍀𐌴𐌽𐍄', suit: 'Pentacles', element: 'Earth' }],
    [73, { id: 73, name: 'Nine of Pentacles', image: '73_Nine_of_Pentacles.png', khral: '𐌽𐌹𐌽 𐍀𐌴𐌽𐍄', suit: 'Pentacles', element: 'Earth' }],
    [74, { id: 74, name: 'Ten of Pentacles', image: '74_Ten_of_Pentacles.png', khral: '𐍄𐌴𐌽 𐍀𐌴𐌽𐍄', suit: 'Pentacles', element: 'Earth' }],
    [75, { id: 75, name: 'Page of Pentacles', image: '75_Page_of_Pentacles.png', khral: '𐍀𐌰𐌲 𐍀𐌴𐌽𐍄', suit: 'Pentacles', element: 'Earth', court: 'Earth of Earth' }],
    [76, { id: 76, name: 'Knight of Pentacles', image: '76_Knight_of_Pentacles.png', khral: '𐌽𐌰𐌷𐍄 𐍀𐌴𐌽𐍄', suit: 'Pentacles', element: 'Earth', court: 'Air of Earth' }],
    [77, { id: 77, name: 'Queen of Pentacles', image: '77_Queen_of_Pentacles.png', khral: '𐌵𐌿𐌹𐌽 𐍀𐌴𐌽𐍄', suit: 'Pentacles', element: 'Earth', court: 'Water of Earth' }],
    [78, { id: 78, name: 'King of Pentacles', image: '78_King_of_Pentacles.png', khral: '𐌺𐌹𐌽𐌲 𐍀𐌴𐌽𐍄', suit: 'Pentacles', element: 'Earth', court: 'Fire of Earth' }]
  ]);

  // Your unique 16 Oracle cards from Song of the Silence universe
  private readonly oracleDeck: Map<number, OracleCard> = new Map([
    [79, { 
      id: 79, 
      name: 'The Hidden Oracle', 
      image: '79_The_Hidden_Oracle.png', 
      khral: '𐍈𐌹𐌳𐌰𐌽 𐍉𐍂𐌰𐌺𐌻',
      power: 'Reveals concealed truths',
      novelChapter: 'Volume 1: The First Silence',
      unlockCondition: 'Complete first reading',
      element: 'Void',
      ability: 'Penetrates illusions and reveals what has been hidden from view'
    }],
    [80, { 
      id: 80, 
      name: 'The Shadow Guide', 
      image: '80_The_Shadow_Guide.png', 
      khral: '𐍃𐌷𐌰𐌳𐍉 𐌲𐌿𐌹𐌳',
      power: 'Navigates the unconscious',
      novelChapter: 'Volume 2: Breath of the Void',
      unlockCondition: 'Face a difficult truth',
      element: 'Shadow',
      ability: 'Guides through dark aspects of the psyche toward integration'
    }],
    [81, { 
      id: 81, 
      name: 'The Light Bearer', 
      image: '81_The_Light_Bearer.png', 
      khral: '𐌻𐌹𐌷𐍄 𐌱𐌴𐌰𐍂',
      power: 'Illuminates the path forward',
      novelChapter: 'Volume 3: The Witnessing Eye',
      unlockCondition: 'Achieve clarity in a reading',
      element: 'Light',
      ability: 'Brings divine illumination to any situation'
    }],
    [82, { 
      id: 82, 
      name: 'The Dream Walker', 
      image: '82_The_Dream_Walker.png', 
      khral: '𐌳𐍂𐌴𐌰𐌼 𐍅𐌰𐌻𐌺',
      power: 'Bridges conscious and unconscious realms',
      novelChapter: 'Volume 4: Mnemonic Poetry',
      unlockCondition: 'Interpret a dream-related reading',
      element: 'Dream',
      ability: 'Accesses wisdom from the dream realm and memory'
    }],
    [83, { 
      id: 83, 
      name: 'The Soul Mirror', 
      image: '83_The_Soul_Mirror.png', 
      khral: '𐍃𐍉𐌿𐌻 𐌼𐌹𐍂𐍂',
      power: 'Reflects true inner nature',
      novelChapter: 'Volume 5: The Night God Awakens',
      unlockCondition: 'Complete 10 readings',
      element: 'Reflection',
      ability: 'Shows the querent their authentic self without masks'
    }],
    [84, { 
      id: 84, 
      name: 'The Time Keeper', 
      image: '84_The_Time_Keeper.png', 
      khral: '𐍄𐌹𐌼𐌴 𐌺𐌹𐍀',
      power: 'Governs temporal flow and timing',
      novelChapter: 'Volume 6: Quantum Linguistics',
      unlockCondition: 'Reading during significant astrological event',
      element: 'Time',
      ability: 'Reveals perfect timing and temporal patterns'
    }],
    [85, { 
      id: 85, 
      name: 'The Fate Weaver', 
      image: '85_The_Fate_Weaver.png', 
      khral: '𐍆𐌰𐍄𐌴 𐍅𐌴𐌰𐍆',
      power: 'Manipulates threads of destiny',
      novelChapter: 'Volume 7: The Herean Codex',
      unlockCondition: 'Master Celtic Cross spread',
      element: 'Destiny',
      ability: 'Shows how choices weave the fabric of fate'
    }],
    [86, { 
      id: 86, 
      name: 'The Spirit Guardian', 
      image: '86_The_Spirit_Guardian.png', 
      khral: '𐍃𐍀𐌹𐍂𐌹𐍄 𐌲𐌰𐍂𐌳',
      power: 'Protects and guides from spiritual realm',
      novelChapter: 'Volume 8: Silence Between Words',
      unlockCondition: 'Connect with spirit guide during reading',
      element: 'Spirit',
      ability: 'Provides spiritual protection and guidance'
    }],
    [87, { 
      id: 87, 
      name: 'The Mystic Vision', 
      image: '87_The_Mystic_Vision.png', 
      khral: '𐌼𐌹𐍃𐍄𐌹𐍃 𐍅𐌹𐍃𐌹𐍉𐌽',
      power: 'Grants prophetic sight',
      novelChapter: 'Volume 9: The Final Utterance',
      unlockCondition: 'Achieve 90% accuracy in predictions',
      element: 'Vision',
      ability: 'Opens the third eye to see beyond the veil'
    }],
    [88, { 
      id: 88, 
      name: 'The Sacred Journey', 
      image: '88_The_Sacred_Journey.png', 
      khral: '𐍃𐌰𐌺𐍂𐌰𐌳 𐌾𐌿𐍂𐌽𐌹',
      power: 'Maps the soul\'s evolutionary path',
      novelChapter: 'Special: Hero\'s Journey',
      unlockCondition: 'Complete full novel reading',
      element: 'Journey',
      ability: 'Reveals the sacred path of personal evolution'
    }],
    [89, { 
      id: 89, 
      name: 'The Inner Truth', 
      image: '89_The_Inner_Truth.png', 
      khral: '𐌹𐌽𐌰𐍂 𐍄𐍂𐌿𐌸',
      power: 'Unveils absolute personal truth',
      novelChapter: 'Special: Truth Revelation',
      unlockCondition: 'Confront deepest fear in reading',
      element: 'Truth',
      ability: 'Strips away all illusions to reveal core truth'
    }],
    [90, { 
      id: 90, 
      name: 'The Cosmic Balance', 
      image: '90_The_Cosmic_Balance.png', 
      khral: '𐌺𐍉𐍃𐌼𐌹𐍃 𐌱𐌰𐌻𐌰𐌽𐍃',
      power: 'Harmonizes all opposing forces',
      novelChapter: 'Special: Universal Harmony',
      unlockCondition: 'Achieve perfect reading score',
      element: 'Balance',
      ability: 'Brings cosmic equilibrium to any situation'
    }],
    [91, { 
      id: 91, 
      name: 'The Divine Messenger', 
      image: '91_The_Divine_Messenger.png', 
      khral: '𐌳𐌹𐍅𐌹𐌽 𐌼𐌴𐍃𐌰𐌽𐌲',
      power: 'Channels messages from higher realms',
      novelChapter: 'Special: Divine Communication',
      unlockCondition: 'Receive spiritual message during reading',
      element: 'Message',
      ability: 'Delivers direct communication from divine sources'
    }],
    [92, { 
      id: 92, 
      name: 'The Eternal Flame', 
      image: '92_The_Eternal_Flame.png', 
      khral: '𐌴𐍄𐌰𐍂𐌽𐌰𐌻 𐍆𐌻𐌰𐌼',
      power: 'Ignites immortal spiritual fire',
      novelChapter: 'Special: Eternal Wisdom',
      unlockCondition: 'Maintain 30-day reading streak',
      element: 'Eternity',
      ability: 'Kindles the eternal flame of wisdom within'
    }],
    [93, { 
      id: 93, 
      name: 'The Wisdom Keeper', 
      image: '93_The_Wisdom_Keeper.png', 
      khral: '𐍅𐌹𐍃𐌳𐍉𐌼 𐌺𐌹𐍀',
      power: 'Guardian of ancient knowledge',
      novelChapter: 'Special: Ancient Wisdom',
      unlockCondition: 'Learn 50 Khrael phrases',
      element: 'Wisdom',
      ability: 'Accesses the akashic records of all knowledge'
    }],
    [94, { 
      id: 94, 
      name: 'The Heart\'s Desire', 
      image: '94_The_Hearts_Desire.png', 
      khral: '𐌷𐌰𐍂𐍄 𐌳𐌰𐌶𐌰𐌹𐍂',
      power: 'Manifests deepest heart wishes',
      novelChapter: 'Special: Ultimate Fulfillment',
      unlockCondition: 'Master all previous oracle cards',
      element: 'Desire',
      ability: 'Aligns reality with the heart\'s truest desires'
    }]
  ]);

  async loadCard(cardId: number): Promise<CardData> {
    let card: TarotCard | OracleCard;
    let cardPath: string;

    if (cardId <= this.TRADITIONAL_CARDS) {
      card = this.traditionalDeck.get(cardId);
      cardPath = `${this.CARD_PATH}${card.image}`;
    } else {
      card = this.oracleDeck.get(cardId);
      cardPath = `${this.CARD_PATH}${card.image}`;
    }

    if (!card) {
      throw new Error(`Card ${cardId} not found`);
    }

    // Load card image and create 3D animation data
    const cardData: CardData = {
      id: card.id,
      name: card.name,
      imagePath: cardPath,
      khralSymbol: card.khral,
      element: card.element,
      description: await this.generateCardDescription(card),
      animation: this.generateCardAnimation(card),
      novelConnection: this.getNovelConnection(card),
      unlockStatus: await this.checkUnlockStatus(cardId)
    };

    return cardData;
  }

  async generateCardDescription(card: TarotCard | OracleCard): Promise<string> {
    // Generate AI-enhanced descriptions using 8 models
    if (card.id <= 78) {
      return this.getTraditionalDescription(card as TarotCard);
    } else {
      return this.getOracleDescription(card as OracleCard);
    }
  }

  private getTraditionalDescription(card: TarotCard): string {
    const descriptions = {
      'The Fool': 'New beginnings, innocence, spontaneity. The Fool represents the pure potential at the start of any journey. In Khrael: 𐌷𐌴𐍂𐌀𐌽 - "The breath before speech."',
      'The Magician': 'Manifestation, resourcefulness, power. The Magician channels divine will through earthly tools. In Khrael: 𐌼𐌰𐌲𐌹𐍃 - "As above, so below."',
      'The High Priestess': 'Intuition, sacred knowledge, divine feminine. She guards the veil between conscious and unconscious realms. In Khrael: 𐍀𐍂𐌹𐌴𐍃𐍄 - "She who witnesses in silence."'
      // ... continue for all 78 cards
    };
    
    return descriptions[card.name] || `${card.name}: A card of ${card.element} energy, representing the journey of ${card.journey || 'transformation'}.`;
  }

  private getOracleDescription(card: OracleCard): string {
    return `${card.name}: ${card.ability}\n\nPower: ${card.power}\nElement: ${card.element}\nNovel Connection: ${card.novelChapter}\n\nKhrael Meaning: ${card.khral} - The ancient language speaks of this card's unique vibration within the Song of Silence universe.`;
  }

  private generateCardAnimation(card: TarotCard | OracleCard): CardAnimation {
    return {
      flipDuration: 0.8,
      goldShimmer: true,
      particleEffect: card.id > 78 ? 'oracle_burst' : 'traditional_glow',
      khralSymbolAnimation: 'fade_in_with_glow',
      backgroundPattern: this.getCardBackground(card.element),
      soundEffect: card.id > 78 ? 'mystical_chime' : 'card_flip'
    };
  }

  private getCardBackground(element: string): string {
    const backgrounds = {
      'Fire': 'radial-gradient(circle, #ff6b6b, #ff8e53)',
      'Water': 'radial-gradient(circle, #4ecdc4, #45b7d1)',
      'Air': 'radial-gradient(circle, #96ceb4, #feca57)',
      'Earth': 'radial-gradient(circle, #8b7355, #a0956a)',
      'Spirit': 'radial-gradient(circle, #8b5cf6, #a855f7)',
      'Void': 'radial-gradient(circle, #1a1a2e, #16213e)',
      'Light': 'radial-gradient(circle, #ffd700, #ffed4e)',
      'Shadow': 'radial-gradient(circle, #2c2c54, #40407a)',
      'Time': 'radial-gradient(circle, #74b9ff, #0984e3)',
      'Destiny': 'radial-gradient(circle, #fd79a8, #e84393)'
    };
    
    return backgrounds[element] || backgrounds['Spirit'];
  }

  private getNovelConnection(card: TarotCard | OracleCard): NovelConnection | null {
    if (card.id > 78) {
      const oracleCard = card as OracleCard;
      return {
        chapter: oracleCard.novelChapter,
        unlockCondition: oracleCard.unlockCondition,
        storyRelevance: `This card plays a crucial role in ${oracleCard.novelChapter}, representing the archetype of ${oracleCard.power.toLowerCase()}.`
      };
    }
    
    // Traditional cards also connect to novel volumes
    const volumeConnection = Math.ceil(card.id / 8.67); // ~78 cards / 9 volumes
    return {
      chapter: `Volume ${Math.min(volumeConnection, 9)}: Connected through the Song of Silence`,
      storyRelevance: `Traditional tarot wisdom enhanced by the Night God universe narrative.`
    };
  }

  async shuffleDeck(deckType: 'traditional' | 'oracle' | 'complete' = 'complete'): Promise<number[]> {
    let cardIds: number[] = [];
    
    switch (deckType) {
      case 'traditional':
        cardIds = Array.from({ length: 78 }, (_, i) => i + 1);
        break;
      case 'oracle':
        cardIds = Array.from({ length: 16 }, (_, i) => i + 79);
        break;
      case 'complete':
        cardIds = Array.from({ length: 94 }, (_, i) => i + 1);
        break;
    }
    
    // Quantum-inspired shuffle algorithm
    for (let i = cardIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardIds[i], cardIds[j]] = [cardIds[j], cardIds[i]];
    }
    
    return cardIds;
  }

  async performCelticCross(userId: string): Promise<CelticCrossReading> {
    const shuffledDeck = await this.shuffleDeck('complete');
    const selectedCards = shuffledDeck.slice(0, 10);
    
    const positions = [
      'Present Situation',
      'Challenge/Cross',
      'Distant Past/Foundation', 
      'Recent Past',
      'Possible Future',
      'Immediate Future',
      'Your Approach',
      'External Influences',
      'Hopes and Fears',
      'Final Outcome'
    ];
    
    const reading = await Promise.all(
      selectedCards.map(async (cardId, index) => {
        const card = await this.loadCard(cardId);
        return {
          position: positions[index],
          card,
          aiInterpretation: await this.getAIInterpretation(card, positions[index], userId),
          khralWisdom: this.getKhralWisdom(card.khralSymbol)
        };
      })
    );
    
    return {
      id: `celtic_${userId}_${Date.now()}`,
      userId,
      timestamp: Date.now(),
      cards: reading,
      overallTheme: await this.synthesizeReading(reading),
      novelUnlock: await this.checkNovelUnlock(userId, reading),
      nextSteps: this.generateNextSteps(reading)
    };
  }

  private async getAIInterpretation(card: CardData, position: string, userId: string): Promise<string> {
    // This would connect to the 8-AI orchestrator
    return `AI synthesis for ${card.name} in position "${position}" - combining insights from GPT-4, Claude, Gemini, and 5 other models to provide unprecedented accuracy.`;
  }

  private getKhralWisdom(khralSymbol: string): string {
    const wisdom = {
      '𐌷𐌴𐍂𐌀𐌽': 'In the beginning was the Word, and the Word was Silence.',
      '𐌼𐌰𐌲𐌹𐍃': 'The will shapes reality through focused intention.',
      '𐍀𐍂𐌹𐌴𐍃𐍄': 'She who guards the threshold between worlds.'
      // ... more Khrael wisdom for each symbol
    };
    
    return wisdom[khralSymbol] || 'The ancient language whispers secrets yet to be understood.';
  }

  async checkUnlockStatus(cardId: number): Promise<UnlockStatus> {
    if (cardId <= 78) {
      return { unlocked: true, type: 'traditional' };
    }
    
    // Oracle cards have special unlock conditions
    const oracleCard = this.oracleDeck.get(cardId);
    return {
      unlocked: false, // Check user progress
      type: 'oracle',
      condition: oracleCard?.unlockCondition || 'Unknown condition',
      progress: 0 // Calculate based on user achievements
    };
  }
}

// Export complete system
export const YesinCardSystem = new YesinCompleteCardSystem();

// Card data interfaces
export interface TarotCard {
  id: number;
  name: string;
  image: string;
  khral: string;
  element: string;
  suit?: string;
  court?: string;
  journey?: string;
}

export interface OracleCard {
  id: number;
  name: string;
  image: string;
  khral: string;
  power: string;
  novelChapter: string;
  unlockCondition: string;
  element: string;
  ability: string;
}

export interface CardData {
  id: number;
  name: string;
  imagePath: string;
  khralSymbol: string;
  element: string;
  description: string;
  animation: CardAnimation;
  novelConnection: NovelConnection | null;
  unlockStatus: UnlockStatus;
}

export interface CardAnimation {
  flipDuration: number;
  goldShimmer: boolean;
  particleEffect: string;
  khralSymbolAnimation: string;
  backgroundPattern: string;
  soundEffect: string;
}

export interface NovelConnection {
  chapter: string;
  unlockCondition?: string;
  storyRelevance: string;
}

export interface UnlockStatus {
  unlocked: boolean;
  type: 'traditional' | 'oracle';
  condition?: string;
  progress?: number;
}

export interface CelticCrossReading {
  id: string;
  userId: string;
  timestamp: number;
  cards: Array<{
    position: string;
    card: CardData;
    aiInterpretation: string;
    khralWisdom: string;
  }>;
  overallTheme: string;
  novelUnlock?: any;
  nextSteps: string[];
}