import type { TarotCard } from '../types/tarot'

export const tarotCards: TarotCard[] = [
  // Major Arcana (0-21)
  {
    id: '0',
    name: 'The Fool',
    arcana: 'major',
    number: 0,
    keywords: {
      upright: ['new beginnings', 'innocence', 'spontaneity', 'free spirit'],
      reversed: ['recklessness', 'poor judgment', 'gullible', 'unprepared']
    },
    meanings: {
      upright: {
        general: 'The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect, having beginner\'s luck, improvisation and believing in the universe.',
        love: 'New romantic beginnings, taking a leap of faith in love, innocent affection.',
        career: 'New job opportunities, starting fresh, taking calculated risks in career.',
        spiritual: 'Spiritual awakening, beginning a new spiritual journey, trust in the universe.'
      },
      reversed: {
        general: 'When reversed, The Fool can represent recklessness, taking foolish risks, being unprepared, having poor judgment, or being gullible.',
        love: 'Naive approach to love, rushing into relationships without thought.',
        career: 'Poor career decisions, lack of planning, missed opportunities.',
        spiritual: 'Spiritual confusion, lack of direction, ignoring inner wisdom.'
      }
    },
    image: '/assets/cards/00_fool.png',
    description: 'The Fool stands at the edge of a cliff, ready to take a leap of faith into the unknown.',
    element: 'air'
  },
  {
    id: '1',
    name: 'The Magician',
    arcana: 'major',
    number: 1,
    keywords: {
      upright: ['manifestation', 'resourcefulness', 'power', 'inspired action'],
      reversed: ['manipulation', 'poor planning', 'unused talents']
    },
    meanings: {
      upright: {
        general: 'The Magician represents manifestation, resourcefulness, power, and inspired action. You have the tools and abilities to achieve your goals.',
        love: 'Manifestation in love, taking action in relationships, magnetic attraction.',
        career: 'Using skills and talents, leadership, successful projects.',
        spiritual: 'Spiritual power, manifestation abilities, channeling divine energy.'
      },
      reversed: {
        general: 'Reversed, The Magician can indicate manipulation, poor planning, or unused talents.',
        love: 'Manipulation in relationships, trickery, illusions in love.',
        career: 'Misuse of skills, lack of focus, unfulfilled potential.',
        spiritual: 'Blocked spiritual power, misuse of abilities, disconnection.'
      }
    },
    image: '/assets/cards/01_magician.png',
    description: 'The Magician channels the divine energy, wielding the tools of manifestation.',
    element: 'air'
  },
  {
    id: '2',
    name: 'The High Priestess',
    arcana: 'major',
    number: 2,
    keywords: {
      upright: ['intuition', 'sacred knowledge', 'divine feminine', 'subconscious mind'],
      reversed: ['secrets', 'disconnected from intuition', 'blocked feminine energy']
    },
    meanings: {
      upright: {
        general: 'The High Priestess represents intuition, sacred knowledge, divine feminine, and subconscious mind.',
        love: 'Intuitive understanding in relationships, deep emotional connections.',
        career: 'Trusting intuition in career decisions, behind-the-scenes influence.',
        spiritual: 'Deep spiritual wisdom, connection to the divine feminine, psychic abilities.'
      },
      reversed: {
        general: 'Blocked intuition, keeping secrets, disconnection from inner wisdom.',
        love: 'Hidden aspects in relationships, lack of emotional understanding.',
        career: 'Ignoring intuition in career, hidden agendas.',
        spiritual: 'Spiritual confusion, blocked psychic abilities, ignoring inner voice.'
      }
    },
    image: '/assets/cards/02_high_priestess.png',
    description: 'The High Priestess sits between the pillars of wisdom, guardian of sacred mysteries.',
    element: 'water'
  },
  {
    id: '3',
    name: 'The Empress',
    arcana: 'major',
    number: 3,
    keywords: {
      upright: ['femininity', 'beauty', 'nature', 'nurturing', 'abundance'],
      reversed: ['creative block', 'dependence on others', 'lack of self-care']
    },
    meanings: {
      upright: {
        general: 'The Empress represents femininity, beauty, nature, nurturing, and abundance.',
        love: 'Nurturing relationships, maternal love, fertility and growth.',
        career: 'Creative abundance, nurturing leadership, business growth.',
        spiritual: 'Connection to Mother Earth, creative spiritual expression.'
      },
      reversed: {
        general: 'Creative blocks, lack of self-care, over-dependence on others.',
        love: 'Smothering in relationships, lack of independence.',
        career: 'Creative stagnation, lack of growth, poor work-life balance.',
        spiritual: 'Disconnection from nature, blocked creativity, spiritual emptiness.'
      }
    },
    image: '/assets/cards/03_empress.png',
    description: 'The Empress embodies the abundant mother figure, surrounded by nature\'s bounty.',
    element: 'earth'
  },
  {
    id: '4',
    name: 'The Emperor',
    arcana: 'major',
    number: 4,
    keywords: {
      upright: ['authority', 'establishment', 'structure', 'father figure'],
      reversed: ['domination', 'excessive control', 'lack of discipline']
    },
    meanings: {
      upright: {
        general: 'The Emperor represents authority, establishment, structure, and father figure.',
        love: 'Stability in relationships, protective partner, traditional values.',
        career: 'Leadership roles, structure and organization, business success.',
        spiritual: 'Spiritual discipline, ordered spiritual practice, divine authority.'
      },
      reversed: {
        general: 'Excessive control, abuse of power, lack of discipline.',
        love: 'Controlling relationships, lack of emotional expression.',
        career: 'Abuse of authority, rigid structures, lack of flexibility.',
        spiritual: 'Spiritual rigidity, abuse of spiritual power, lack of compassion.'
      }
    },
    image: '/assets/cards/04_emperor.png',
    description: 'The Emperor sits on his throne of authority, representing order and control.',
    element: 'fire'
  },
  {
    id: '5',
    name: 'The Hierophant',
    arcana: 'major',
    number: 5,
    keywords: {
      upright: ['spiritual wisdom', 'religious beliefs', 'conformity', 'tradition'],
      reversed: ['personal beliefs', 'freedom', 'challenging tradition']
    },
    meanings: {
      upright: {
        general: 'The Hierophant represents spiritual wisdom, religious beliefs, conformity, and tradition.',
        love: 'Traditional relationships, spiritual connection, commitment ceremonies.',
        career: 'Traditional career paths, mentorship, established institutions.',
        spiritual: 'Formal spiritual education, religious guidance, traditional practices.'
      },
      reversed: {
        general: 'Challenging tradition, personal spiritual beliefs, non-conformity.',
        love: 'Unconventional relationships, breaking relationship traditions.',
        career: 'Non-traditional career paths, challenging authority, innovation.',
        spiritual: 'Personal spiritual path, questioning religious doctrine, spiritual freedom.'
      }
    },
    image: '/assets/cards/05_hierophant.png',
    description: 'The Hierophant represents spiritual authority and traditional wisdom.',
    element: 'earth'
  },
  {
    id: '6',
    name: 'The Lovers',
    arcana: 'major',
    number: 6,
    keywords: {
      upright: ['love', 'harmony', 'relationships', 'values alignment'],
      reversed: ['disharmony', 'imbalance', 'misaligned values']
    },
    meanings: {
      upright: {
        general: 'The Lovers represent love, harmony, relationships, and values alignment.',
        love: 'Deep romantic connection, soulmate relationships, choices in love.',
        career: 'Partnership in business, collaborative projects, value-based decisions.',
        spiritual: 'Spiritual partnership, divine love, union of opposites.'
      },
      reversed: {
        general: 'Relationship disharmony, poor choices, misaligned values.',
        love: 'Relationship problems, lack of harmony, difficult choices.',
        career: 'Partnership issues, conflicting values, poor teamwork.',
        spiritual: 'Spiritual imbalance, disconnection from divine love.'
      }
    },
    image: '/assets/cards/06_lovers.png',
    description: 'The Lovers represent the union of masculine and feminine energies.',
    element: 'air'
  },
  {
    id: '7',
    name: 'The Chariot',
    arcana: 'major',
    number: 7,
    keywords: {
      upright: ['control', 'willpower', 'success', 'determination'],
      reversed: ['lack of control', 'lack of direction', 'aggression']
    },
    meanings: {
      upright: {
        general: 'The Chariot represents control, willpower, success, and determination.',
        love: 'Taking control in relationships, determined pursuit of love.',
        career: 'Career success through determination, achieving goals, leadership.',
        spiritual: 'Spiritual discipline, overcoming obstacles, spiritual victory.'
      },
      reversed: {
        general: 'Lack of control, losing direction, aggression without purpose.',
        love: 'Relationship conflicts, lack of direction in love, controlling behavior.',
        career: 'Career stagnation, lack of focus, workplace conflicts.',
        spiritual: 'Spiritual confusion, lack of direction, inner conflict.'
      }
    },
    image: '/assets/cards/07_chariot.png',
    description: 'The Chariot represents triumph through maintaining control and balance.',
    element: 'water'
  },
  {
    id: '8',
    name: 'Strength',
    arcana: 'major',
    number: 8,
    keywords: {
      upright: ['strength', 'courage', 'persuasion', 'influence', 'compassion'],
      reversed: ['self-doubt', 'weakness', 'insecurity']
    },
    meanings: {
      upright: {
        general: 'Strength represents inner strength, courage, persuasion, influence, and compassion.',
        love: 'Compassionate love, patience in relationships, emotional strength.',
        career: 'Leadership through compassion, influencing others positively.',
        spiritual: 'Spiritual courage, taming the ego, compassionate spirituality.'
      },
      reversed: {
        general: 'Self-doubt, weakness, lack of confidence, abuse of power.',
        love: 'Emotional weakness, lack of confidence in relationships.',
        career: 'Lack of leadership, self-doubt, avoiding challenges.',
        spiritual: 'Spiritual weakness, lack of faith, giving in to lower instincts.'
      }
    },
    image: '/assets/cards/08_strength.png',
    description: 'Strength shows the gentle taming of a lion, representing inner strength over brute force.',
    element: 'fire'
  },
  {
    id: '9',
    name: 'The Hermit',
    arcana: 'major',
    number: 9,
    keywords: {
      upright: ['soul searching', 'seeking inner guidance', 'looking inward'],
      reversed: ['isolation', 'loneliness', 'withdrawal']
    },
    meanings: {
      upright: {
        general: 'The Hermit represents soul searching, seeking inner guidance, and looking inward.',
        love: 'Soul searching in relationships, seeking inner truth about love.',
        career: 'Seeking career guidance, introspection about professional path.',
        spiritual: 'Spiritual seeking, inner wisdom, enlightenment through solitude.'
      },
      reversed: {
        general: 'Isolation, loneliness, avoiding introspection, stubbornness.',
        love: 'Avoiding relationship issues, emotional withdrawal, loneliness.',
        career: 'Avoiding career decisions, isolation at work, refusing guidance.',
        spiritual: 'Spiritual isolation, avoiding inner work, refusing wisdom.'
      }
    },
    image: '/assets/cards/09_hermit.png',
    description: 'The Hermit holds a lantern to light the way for spiritual seeking.',
    element: 'earth'
  },
  {
    id: '10',
    name: 'Wheel of Fortune',
    arcana: 'major',
    number: 10,
    keywords: {
      upright: ['good luck', 'karma', 'life cycles', 'destiny', 'turning point'],
      reversed: ['bad luck', 'lack of control', 'clinging to control']
    },
    meanings: {
      upright: {
        general: 'Wheel of Fortune represents good luck, karma, life cycles, destiny, and turning points.',
        love: 'Positive changes in relationships, karmic connections, fate in love.',
        career: 'Career opportunities, positive changes, success through cycles.',
        spiritual: 'Karmic lessons, spiritual cycles, divine timing, fate.'
      },
      reversed: {
        general: 'Bad luck, lack of control, resisting change, clinging to the past.',
        love: 'Relationship setbacks, bad timing in love, karmic challenges.',
        career: 'Career setbacks, missed opportunities, resisting change.',
        spiritual: 'Resisting karmic lessons, bad spiritual timing, lack of faith.'
      }
    },
    image: '/assets/cards/10_wheel_of_fortune.png',
    description: 'The Wheel of Fortune represents the cycles of life and the role of fate.',
    element: 'fire'
  },
  {
    id: '11',
    name: 'Justice',
    arcana: 'major',
    number: 11,
    keywords: {
      upright: ['justice', 'fairness', 'truth', 'cause and effect', 'law'],
      reversed: ['unfairness', 'lack of accountability', 'dishonesty']
    },
    meanings: {
      upright: {
        general: 'Justice represents fairness, truth, cause and effect, and law.',
        love: 'Fair relationships, balanced partnerships, truth in love.',
        career: 'Fair treatment at work, legal matters, balanced decisions.',
        spiritual: 'Karmic justice, spiritual truth, moral integrity, divine law.'
      },
      reversed: {
        general: 'Unfairness, lack of accountability, dishonesty, bias.',
        love: 'Unfair relationships, dishonesty in love, imbalanced partnerships.',
        career: 'Workplace injustice, legal problems, unethical behavior.',
        spiritual: 'Avoiding karmic consequences, moral confusion, spiritual dishonesty.'
      }
    },
    image: '/assets/cards/11_justice.png',
    description: 'Justice holds the scales of truth and the sword of decision.',
    element: 'air'
  },
  {
    id: '12',
    name: 'The Hanged Man',
    arcana: 'major',
    number: 12,
    keywords: {
      upright: ['suspension', 'restriction', 'letting go', 'sacrifice'],
      reversed: ['delays', 'resistance', 'stalling', 'indecision']
    },
    meanings: {
      upright: {
        general: 'The Hanged Man represents suspension, restriction, letting go, and sacrifice.',
        love: 'Sacrificing for love, waiting in relationships, new perspectives.',
        career: 'Career delays, sacrifice for future gain, different perspectives.',
        spiritual: 'Spiritual sacrifice, surrendering control, enlightenment through letting go.'
      },
      reversed: {
        general: 'Unnecessary delays, resistance to change, stalling, indecision.',
        love: 'Avoiding necessary sacrifices, relationship stagnation.',
        career: 'Career stagnation, avoiding necessary changes, indecision.',
        spiritual: 'Resisting spiritual growth, avoiding necessary surrender.'
      }
    },
    image: '/assets/cards/12_hanged_man.png',
    description: 'The Hanged Man hangs in peaceful surrender, gaining wisdom through sacrifice.',
    element: 'water'
  },
  {
    id: '13',
    name: 'Death',
    arcana: 'major',
    number: 13,
    keywords: {
      upright: ['endings', 'beginnings', 'change', 'transformation', 'transition'],
      reversed: ['resistance to change', 'personal transformation', 'inner purging']
    },
    meanings: {
      upright: {
        general: 'Death represents endings, beginnings, change, transformation, and transition.',
        love: 'End of relationship phase, transformation in love, new beginnings.',
        career: 'Career transformation, end of old job, new professional identity.',
        spiritual: 'Spiritual transformation, death of old self, rebirth, initiation.'
      },
      reversed: {
        general: 'Resistance to change, avoiding endings, fear of transformation.',
        love: 'Avoiding relationship changes, clinging to past, fear of commitment.',
        career: 'Resisting career change, avoiding necessary endings.',
        spiritual: 'Avoiding spiritual growth, resistance to transformation, spiritual stagnation.'
      }
    },
    image: '/assets/cards/13_death.png',
    description: 'Death rides forth, representing transformation and the cycle of endings and beginnings.',
    element: 'water'
  },
  {
    id: '14',
    name: 'Temperance',
    arcana: 'major',
    number: 14,
    keywords: {
      upright: ['balance', 'moderation', 'patience', 'purpose'],
      reversed: ['imbalance', 'excess', 'self-healing', 'realignment']
    },
    meanings: {
      upright: {
        general: 'Temperance represents balance, moderation, patience, and purpose.',
        love: 'Balanced relationships, patience in love, harmonious partnerships.',
        career: 'Work-life balance, patient career building, purposeful work.',
        spiritual: 'Spiritual balance, patience in growth, divine purpose, moderation.'
      },
      reversed: {
        general: 'Imbalance, excess, lack of long-term vision, self-healing needed.',
        love: 'Imbalanced relationships, lack of harmony, healing needed.',
        career: 'Work imbalance, lack of purpose, excessive behavior.',
        spiritual: 'Spiritual imbalance, lack of moderation, need for realignment.'
      }
    },
    image: '/assets/cards/14_temperance.png',
    description: 'Temperance pours water between cups, symbolizing balance and moderation.',
    element: 'fire'
  },
  {
    id: '15',
    name: 'The Devil',
    arcana: 'major',
    number: 15,
    keywords: {
      upright: ['bondage', 'addiction', 'sexuality', 'materialism'],
      reversed: ['releasing limiting beliefs', 'exploring dark thoughts', 'detachment']
    },
    meanings: {
      upright: {
        general: 'The Devil represents bondage, addiction, sexuality, and materialism.',
        love: 'Obsessive relationships, sexual attraction, unhealthy attachments.',
        career: 'Feeling trapped at work, materialistic pursuits, workplace toxicity.',
        spiritual: 'Spiritual bondage, attachment to material world, shadow work needed.'
      },
      reversed: {
        general: 'Breaking free from limitations, overcoming addiction, spiritual awakening.',
        love: 'Breaking free from toxic relationships, overcoming obsession.',
        career: 'Leaving toxic work environment, overcoming career limitations.',
        spiritual: 'Spiritual liberation, overcoming shadow aspects, breaking free from illusion.'
      }
    },
    image: '/assets/cards/15_devil.png',
    description: 'The Devil represents the material bonds and illusions that limit spiritual growth.',
    element: 'earth'
  },
  {
    id: '16',
    name: 'The Tower',
    arcana: 'major',
    number: 16,
    keywords: {
      upright: ['sudden change', 'upheaval', 'chaos', 'revelation', 'awakening'],
      reversed: ['personal transformation', 'fear of change', 'avoiding disaster']
    },
    meanings: {
      upright: {
        general: 'The Tower represents sudden change, upheaval, chaos, revelation, and awakening.',
        love: 'Sudden relationship changes, revelations, breakups, awakening.',
        career: 'Sudden career changes, job loss, workplace upheaval, revelations.',
        spiritual: 'Spiritual awakening, destruction of false beliefs, divine intervention.'
      },
      reversed: {
        general: 'Personal transformation, fear of change, avoiding disaster, gradual change.',
        love: 'Avoiding relationship problems, fear of commitment, gradual changes.',
        career: 'Avoiding career changes, fear of professional upheaval.',
        spiritual: 'Resisting spiritual awakening, gradual spiritual transformation.'
      }
    },
    image: '/assets/cards/16_tower.png',
    description: 'The Tower is struck by lightning, representing sudden revelation and change.',
    element: 'fire'
  },
  {
    id: '17',
    name: 'The Star',
    arcana: 'major',
    number: 17,
    keywords: {
      upright: ['hope', 'faith', 'purpose', 'renewal', 'spirituality'],
      reversed: ['lack of faith', 'despair', 'self-trust', 'disconnection']
    },
    meanings: {
      upright: {
        general: 'The Star represents hope, faith, purpose, renewal, and spirituality.',
        love: 'Hope in relationships, spiritual love, renewal of faith in love.',
        career: 'Career inspiration, purposeful work, hope for the future.',
        spiritual: 'Spiritual guidance, connection to divine, renewed faith, inspiration.'
      },
      reversed: {
        general: 'Lack of faith, despair, disconnection from purpose, self-doubt.',
        love: 'Loss of hope in love, disconnection from partner, despair.',
        career: 'Lack of career direction, loss of inspiration, hopelessness.',
        spiritual: 'Spiritual disconnection, loss of faith, lack of inspiration.'
      }
    },
    image: '/assets/cards/17_star.png',
    description: 'The Star pours water under the night sky, representing hope and spiritual guidance.',
    element: 'air'
  },
  {
    id: '18',
    name: 'The Moon',
    arcana: 'major',
    number: 18,
    keywords: {
      upright: ['illusion', 'fear', 'anxiety', 'subconscious', 'intuition'],
      reversed: ['releasing fear', 'repressed emotion', 'inner confusion']
    },
    meanings: {
      upright: {
        general: 'The Moon represents illusion, fear, anxiety, subconscious, and intuition.',
        love: 'Confusion in relationships, hidden emotions, intuitive insights.',
        career: 'Workplace deception, unclear career path, trusting intuition.',
        spiritual: 'Psychic abilities, subconscious wisdom, spiritual illusions, shadow work.'
      },
      reversed: {
        general: 'Releasing fear, overcoming anxiety, clarity after confusion.',
        love: 'Clearing relationship confusion, releasing romantic fears.',
        career: 'Career clarity, overcoming workplace anxiety, truth revealed.',
        spiritual: 'Spiritual clarity, overcoming spiritual fears, releasing illusions.'
      }
    },
    image: '/assets/cards/18_moon.png',
    description: 'The Moon illuminates the path between two towers, representing intuition and illusion.',
    element: 'water'
  },
  {
    id: '19',
    name: 'The Sun',
    arcana: 'major',
    number: 19,
    keywords: {
      upright: ['positivity', 'fun', 'warmth', 'success', 'vitality'],
      reversed: ['inner child', 'feeling down', 'overly optimistic']
    },
    meanings: {
      upright: {
        general: 'The Sun represents positivity, fun, warmth, success, and vitality.',
        love: 'Joyful relationships, celebration of love, positive energy.',
        career: 'Career success, recognition, positive work environment.',
        spiritual: 'Spiritual joy, enlightenment, positive spiritual energy, celebration.'
      },
      reversed: {
        general: 'Sadness, lack of enthusiasm, blocked positive energy, inner child issues.',
        love: 'Relationship sadness, lack of joy in love, inner child healing needed.',
        career: 'Lack of career satisfaction, workplace negativity, burnout.',
        spiritual: 'Spiritual sadness, blocked joy, need for inner child healing.'
      }
    },
    image: '/assets/cards/19_sun.png',
    description: 'The Sun shines brightly over a child on a white horse, representing joy and success.',
    element: 'fire'
  },
  {
    id: '20',
    name: 'Judgement',
    arcana: 'major',
    number: 20,
    keywords: {
      upright: ['judgement', 'rebirth', 'inner calling', 'absolution'],
      reversed: ['self-doubt', 'inner critic', 'ignoring the call']
    },
    meanings: {
      upright: {
        general: 'Judgement represents judgement, rebirth, inner calling, and absolution.',
        love: 'Relationship rebirth, forgiveness, answering love\'s call.',
        career: 'Career calling, professional rebirth, making important decisions.',
        spiritual: 'Spiritual awakening, divine calling, forgiveness, spiritual rebirth.'
      },
      reversed: {
        general: 'Self-doubt, harsh self-judgment, ignoring inner calling, lack of forgiveness.',
        love: 'Self-criticism in relationships, avoiding love\'s call, unforgiveness.',
        career: 'Ignoring career calling, self-doubt, harsh professional judgment.',
        spiritual: 'Spiritual self-doubt, ignoring divine calling, lack of spiritual forgiveness.'
      }
    },
    image: '/assets/cards/20_judgement.png',
    description: 'An angel blows a trumpet, calling souls to their final judgment and rebirth.',
    element: 'fire'
  },
  {
    id: '21',
    name: 'The World',
    arcana: 'major',
    number: 21,
    keywords: {
      upright: ['completion', 'accomplishment', 'travel', 'fulfillment'],
      reversed: ['seeking personal closure', 'short-cut to success']
    },
    meanings: {
      upright: {
        general: 'The World represents completion, accomplishment, travel, and fulfillment.',
        love: 'Relationship fulfillment, complete love, soulmate connection.',
        career: 'Career completion, professional achievement, worldwide success.',
        spiritual: 'Spiritual completion, enlightenment, cosmic consciousness, unity.'
      },
      reversed: {
        general: 'Incomplete projects, lack of achievement, seeking shortcuts, unfulfillment.',
        love: 'Incomplete relationships, lack of fulfillment, seeking quick fixes.',
        career: 'Incomplete career goals, lack of professional fulfillment.',
        spiritual: 'Incomplete spiritual journey, seeking spiritual shortcuts, lack of integration.'
      }
    },
    image: '/assets/cards/21_world.png',
    description: 'A dancing figure in a laurel wreath represents the completion of the major arcana journey.',
    element: 'earth'
  },
  
  // Minor Arcana - Cups (Water Element)
  {
    id: '22',
    name: 'Ace of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 1,
    keywords: {
      upright: ['love', 'new relationships', 'compassion', 'creativity'],
      reversed: ['self-love', 'intuition', 'repressed emotions']
    },
    meanings: {
      upright: {
        general: 'New emotional beginnings, love, compassion, and creativity.',
        love: 'New romantic beginning, emotional fulfillment, deep connection.',
        career: 'Creative career opportunities, compassionate leadership.',
        spiritual: 'Spiritual love, emotional awakening, divine compassion.'
      },
      reversed: {
        general: 'Need for self-love, blocked emotions, creative blocks.',
        love: 'Self-love needed, emotional barriers, one-sided love.',
        career: 'Lack of creative fulfillment, emotional workplace issues.',
        spiritual: 'Need for spiritual self-love, blocked intuition.'
      }
    },
    image: '/assets/cards/22_ace_cups.png',
    description: 'A hand holds a golden cup overflowing with water, representing new emotional beginnings.',
    element: 'water'
  },
  {
    id: '23',
    name: 'Two of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 2,
    keywords: {
      upright: ['unified love', 'partnership', 'mutual attraction'],
      reversed: ['self-love', 'break-ups', 'disharmony']
    },
    meanings: {
      upright: {
        general: 'Partnership, mutual attraction, unified love, harmony.',
        love: 'Mutual love, romantic partnership, deep connection.',
        career: 'Business partnership, teamwork, cooperation.',
        spiritual: 'Spiritual partnership, divine union, balanced energies.'
      },
      reversed: {
        general: 'Relationship issues, self-love needed, disharmony.',
        love: 'Relationship problems, breakup, imbalance in love.',
        career: 'Partnership issues, lack of cooperation.',
        spiritual: 'Need for spiritual balance, inner harmony work.'
      }
    },
    image: '/assets/cards/23_two_cups.png',
    description: 'Two figures raise their cups in a toast, symbolizing partnership and mutual respect.',
    element: 'water'
  },
  {
    id: '24',
    name: 'Three of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 3,
    keywords: {
      upright: ['celebration', 'friendship', 'creativity', 'community'],
      reversed: ['independence', 'alone time', 'creative blocks']
    },
    meanings: {
      upright: {
        general: 'Celebration, friendship, creativity, community support.',
        love: 'Celebration in relationships, support from friends.',
        career: 'Team success, creative collaboration, workplace celebration.',
        spiritual: 'Spiritual community, celebration of growth, shared wisdom.'
      },
      reversed: {
        general: 'Need for independence, creative blocks, isolation.',
        love: 'Third party interference, lack of support in relationships.',
        career: 'Workplace gossip, lack of teamwork, creative frustration.',
        spiritual: 'Need for spiritual solitude, avoiding spiritual community.'
      }
    },
    image: '/assets/cards/24_three_cups.png',
    description: 'Three women raise their cups in celebration, representing friendship and joy.',
    element: 'water'
  },
  {
    id: '25',
    name: 'Four of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 4,
    keywords: {
      upright: ['meditation', 'contemplation', 'apathy', 'reevaluation'],
      reversed: ['retreat', 'withdrawal', 'checking in with yourself']
    },
    meanings: {
      upright: {
        general: 'Contemplation, meditation, apathy, reevaluation of priorities.',
        love: 'Relationship apathy, taking love for granted, emotional withdrawal.',
        career: 'Career dissatisfaction, contemplating change, lack of motivation.',
        spiritual: 'Spiritual contemplation, meditation, reevaluating beliefs.'
      },
      reversed: {
        general: 'Coming out of contemplation, renewed interest, motivation returning.',
        love: 'Renewed interest in relationships, appreciation for love.',
        career: 'Renewed career motivation, taking action after contemplation.',
        spiritual: 'Spiritual action after contemplation, renewed faith.'
      }
    },
    image: '/assets/cards/25_four_cups.png',
    description: 'A figure sits under a tree contemplating three cups, while a fourth is offered.',
    element: 'water'
  },
  {
    id: '26',
    name: 'Five of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 5,
    keywords: {
      upright: ['regret', 'failure', 'disappointment', 'pessimism'],
      reversed: ['personal setbacks', 'self-forgiveness', 'moving on']
    },
    meanings: {
      upright: {
        general: 'Regret, failure, disappointment, pessimism, loss.',
        love: 'Relationship disappointment, heartbreak, mourning lost love.',
        career: 'Career setbacks, disappointment, professional failure.',
        spiritual: 'Spiritual disappointment, loss of faith, mourning.'
      },
      reversed: {
        general: 'Moving on from disappointment, self-forgiveness, learning from failure.',
        love: 'Healing from heartbreak, forgiveness, moving forward in love.',
        career: 'Learning from career mistakes, professional recovery.',
        spiritual: 'Spiritual healing, forgiveness, renewed faith.'
      }
    },
    image: '/assets/cards/26_five_cups.png',
    description: 'A cloaked figure mourns over three spilled cups while two remain standing.',
    element: 'water'
  },
  {
    id: '27',
    name: 'Six of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 6,
    keywords: {
      upright: ['revisiting the past', 'childhood memories', 'innocence'],
      reversed: ['moving forward', 'leaving the past', 'independence']
    },
    meanings: {
      upright: {
        general: 'Nostalgia, childhood memories, innocence, revisiting the past.',
        love: 'Past love returning, innocent romance, childhood sweethearts.',
        career: 'Returning to past career, mentoring, traditional approaches.',
        spiritual: 'Spiritual innocence, returning to simple faith, past life memories.'
      },
      reversed: {
        general: 'Moving forward, leaving the past behind, independence from family.',
        love: 'Moving on from past relationships, independence in love.',
        career: 'Leaving old career behind, professional independence.',
        spiritual: 'Spiritual independence, leaving old beliefs, moving forward.'
      }
    },
    image: '/assets/cards/27_six_cups.png',
    description: 'A child offers flowers to another, representing innocence and nostalgia.',
    element: 'water'
  },
  {
    id: '28',
    name: 'Seven of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 7,
    keywords: {
      upright: ['opportunities', 'choices', 'wishful thinking', 'illusion'],
      reversed: ['alignment', 'personal values', 'overwhelmed by choices']
    },
    meanings: {
      upright: {
        general: 'Many choices, opportunities, wishful thinking, illusion.',
        love: 'Many romantic options, unrealistic expectations in love.',
        career: 'Multiple career opportunities, difficulty choosing direction.',
        spiritual: 'Many spiritual paths, confusion about direction, illusion.'
      },
      reversed: {
        general: 'Clarity about choices, alignment with values, realistic expectations.',
        love: 'Clarity about what you want in love, realistic romance.',
        career: 'Career clarity, focused professional direction.',
        spiritual: 'Spiritual clarity, focused spiritual path, realistic goals.'
      }
    },
    image: '/assets/cards/28_seven_cups.png',
    description: 'A figure contemplates seven cups floating in clouds, representing choices and illusion.',
    element: 'water'
  },
  {
    id: '29',
    name: 'Eight of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 8,
    keywords: {
      upright: ['disappointment', 'abandonment', 'withdrawal', 'escapism'],
      reversed: ['staying', 'avoidance', 'fear of change', 'stagnation']
    },
    meanings: {
      upright: {
        general: 'Leaving behind what no longer serves, disappointment, seeking deeper meaning.',
        love: 'Leaving unsatisfying relationship, emotional disappointment.',
        career: 'Leaving unfulfilling job, career disappointment, seeking purpose.',
        spiritual: 'Spiritual seeking, leaving material pursuits, soul searching.'
      },
      reversed: {
        general: 'Avoiding necessary change, fear of leaving, stagnation.',
        love: 'Staying in unsatisfying relationship, avoiding relationship change.',
        career: 'Staying in unfulfilling job, avoiding career change.',
        spiritual: 'Avoiding spiritual growth, staying in spiritual comfort zone.'
      }
    },
    image: '/assets/cards/29_eight_cups.png',
    description: 'A figure walks away from eight cups, seeking something more meaningful.',
    element: 'water'
  },
  {
    id: '30',
    name: 'Nine of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 9,
    keywords: {
      upright: ['contentment', 'satisfaction', 'luxury', 'self-sufficiency'],
      reversed: ['inner happiness', 'materialism', 'dissatisfaction']
    },
    meanings: {
      upright: {
        general: 'Contentment, satisfaction, emotional fulfillment, wishes coming true.',
        love: 'Relationship satisfaction, emotional fulfillment, happy love.',
        career: 'Career satisfaction, professional fulfillment, success.',
        spiritual: 'Spiritual satisfaction, emotional well-being, inner peace.'
      },
      reversed: {
        general: 'Seeking inner happiness, materialism not fulfilling, superficial satisfaction.',
        love: 'Seeking deeper love connection, superficial relationships.',
        career: 'Superficial career success, seeking meaningful work.',
        spiritual: 'Seeking true spiritual fulfillment, avoiding spiritual materialism.'
      }
    },
    image: '/assets/cards/30_nine_cups.png',
    description: 'A satisfied figure sits with arms crossed before nine cups, representing contentment.',
    element: 'water'
  },
  {
    id: '31',
    name: 'Ten of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 10,
    keywords: {
      upright: ['divine love', 'blissful relationships', 'harmony', 'alignment'],
      reversed: ['misaligned values', 'struggling relationships', 'disharmony']
    },
    meanings: {
      upright: {
        general: 'Divine love, blissful relationships, harmony, emotional fulfillment.',
        love: 'Perfect relationship, family harmony, lasting love, emotional fulfillment.',
        career: 'Fulfilling work environment, team harmony, aligned values.',
        spiritual: 'Spiritual fulfillment, divine love, perfect alignment, unity.'
      },
      reversed: {
        general: 'Misaligned values, relationship struggles, family disharmony.',
        love: 'Relationship problems, family issues, seeking love elsewhere.',
        career: 'Workplace disharmony, value conflicts, unfulfilling work.',
        spiritual: 'Spiritual disharmony, seeking fulfillment, misaligned practices.'
      }
    },
    image: '/assets/cards/31_ten_cups.png',
    description: 'A happy family celebrates under a rainbow of ten cups, representing perfect harmony.',
    element: 'water'
  },
  
  // Court Cards - Cups
  {
    id: '32',
    name: 'Page of Cups',
    arcana: 'minor',
    suit: 'cups',
    keywords: {
      upright: ['creative opportunities', 'intuitive messages', 'curiosity', 'possibility'],
      reversed: ['new ideas', 'doubting intuition', 'creative blocks']
    },
    meanings: {
      upright: {
        general: 'Creative opportunities, intuitive messages, emotional curiosity.',
        love: 'New romantic interest, creative expression in love.',
        career: 'Creative opportunities, intuitive career guidance.',
        spiritual: 'Spiritual messages, psychic development, creative spirituality.'
      },
      reversed: {
        general: 'Doubting intuition, creative blocks, emotional immaturity.',
        love: 'Emotional immaturity in relationships, blocked heart chakra.',
        career: 'Creative blocks, doubting professional intuition.',
        spiritual: 'Spiritual doubts, blocked intuition, emotional healing needed.'
      }
    },
    image: '/assets/cards/32_page_cups.png',
    description: 'A young person holds a cup with a fish emerging, representing creative potential.',
    element: 'water'
  },
  {
    id: '33',
    name: 'Knight of Cups',
    arcana: 'minor',
    suit: 'cups',
    keywords: {
      upright: ['romance', 'charm', 'following the heart', 'imagination'],
      reversed: ['moodiness', 'disappointment', 'overemotional']
    },
    meanings: {
      upright: {
        general: 'Romance, charm, following the heart, imagination, idealism.',
        love: 'Romantic pursuit, charming partner, following heart in love.',
        career: 'Creative career pursuit, following passion, artistic work.',
        spiritual: 'Following spiritual heart, romantic spirituality, idealistic faith.'
      },
      reversed: {
        general: 'Moodiness, disappointment, being overemotional, unrealistic expectations.',
        love: 'Moody in relationships, unrealistic romantic expectations.',
        career: 'Unrealistic career expectations, emotional workplace behavior.',
        spiritual: 'Spiritual moodiness, unrealistic spiritual expectations.'
      }
    },
    image: '/assets/cards/33_knight_cups.png',
    description: 'A knight on a white horse holds a cup, representing romantic idealism.',
    element: 'water'
  },
  {
    id: '34',
    name: 'Queen of Cups',
    arcana: 'minor',
    suit: 'cups',
    keywords: {
      upright: ['compassionate', 'caring', 'emotionally stable', 'intuitive'],
      reversed: ['inner feelings', 'self-care', 'codependency']
    },
    meanings: {
      upright: {
        general: 'Compassion, emotional stability, intuitive wisdom, nurturing.',
        love: 'Nurturing partner, emotional support, compassionate love.',
        career: 'Compassionate leadership, caring professional, emotional intelligence.',
        spiritual: 'Spiritual nurturing, compassionate spirituality, intuitive wisdom.'
      },
      reversed: {
        general: 'Need for self-care, codependency, emotional instability.',
        love: 'Codependent relationships, need for emotional boundaries.',
        career: 'Workplace codependency, need for professional boundaries.',
        spiritual: 'Need for spiritual self-care, emotional spiritual healing.'
      }
    },
    image: '/assets/cards/34_queen_cups.png',
    description: 'The Queen of Cups holds her chalice while gazing thoughtfully at the sea.',
    element: 'water'
  },
  {
    id: '35',
    name: 'King of Cups',
    arcana: 'minor',
    suit: 'cups',
    keywords: {
      upright: ['emotionally balanced', 'compassionate', 'diplomatic'],
      reversed: ['self-compassion', 'inner feelings', 'moodiness']
    },
    meanings: {
      upright: {
        general: 'Emotional balance, compassionate leadership, diplomatic wisdom.',
        love: 'Emotionally mature partner, balanced relationship, wise love.',
        career: 'Compassionate leadership, emotional intelligence, diplomatic success.',
        spiritual: 'Spiritual mastery, emotional wisdom, compassionate teacher.'
      },
      reversed: {
        general: 'Need for self-compassion, emotional manipulation, moodiness.',
        love: 'Emotional manipulation in relationships, need for balance.',
        career: 'Emotional workplace manipulation, need for professional balance.',
        spiritual: 'Need for spiritual emotional balance, avoiding spiritual manipulation.'
      }
    },
    image: '/assets/cards/35_king_cups.png',
    description: 'The King of Cups sits on his throne, master of emotions and compassion.',
    element: 'water'
  },

  // Minor Arcana - Wands (Fire Element) - First 5 cards
  {
    id: '36',
    name: 'Ace of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 1,
    keywords: {
      upright: ['inspiration', 'new opportunities', 'growth'],
      reversed: ['lack of energy', 'delays', 'creative blocks']
    },
    meanings: {
      upright: {
        general: 'New creative beginnings, inspiration, potential for growth.',
        love: 'Passionate new romance, sexual energy, creative love.',
        career: 'New career opportunities, creative projects, entrepreneurial spirit.',
        spiritual: 'Spiritual inspiration, creative spirituality, divine spark.'
      },
      reversed: {
        general: 'Lack of energy, creative blocks, delayed opportunities.',
        love: 'Lack of passion, delayed romance, creative blocks in love.',
        career: 'Delayed career opportunities, lack of creative inspiration.',
        spiritual: 'Spiritual blocks, lack of inspiration, creative spiritual healing needed.'
      }
    },
    image: '/assets/cards/36_ace_wands.png',
    description: 'A hand emerges from a cloud holding a wand with sprouting leaves.',
    element: 'fire'
  },
  {
    id: '37',
    name: 'Two of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 2,
    keywords: {
      upright: ['future planning', 'making decisions', 'leaving comfort zone'],
      reversed: ['personal goals', 'inner alignment', 'fear of unknown']
    },
    meanings: {
      upright: {
        general: 'Future planning, making decisions, personal power, leaving comfort zone.',
        love: 'Planning future with partner, decisions about relationships.',
        career: 'Career planning, business expansion, leadership decisions.',
        spiritual: 'Spiritual planning, choosing spiritual path, personal power.'
      },
      reversed: {
        general: 'Need for inner alignment, fear of the unknown, lack of planning.',
        love: 'Lack of relationship direction, fear of commitment.',
        career: 'Poor career planning, fear of professional risks.',
        spiritual: 'Spiritual confusion, lack of direction, need for inner work.'
      }
    },
    image: '/assets/cards/37_two_wands.png',
    description: 'A figure holds a globe while contemplating future possibilities.',
    element: 'fire'
  },
  {
    id: '38',
    name: 'Three of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 3,
    keywords: {
      upright: ['progress', 'expansion', 'foresight', 'overseas opportunities'],
      reversed: ['playing small', 'lack of foresight', 'unexpected delays']
    },
    meanings: {
      upright: {
        general: 'Progress, expansion, foresight, overseas opportunities, leadership.',
        love: 'Relationship expansion, long-distance love, future vision.',
        career: 'Business expansion, overseas opportunities, career progress.',
        spiritual: 'Spiritual expansion, teaching others, sharing wisdom.'
      },
      reversed: {
        general: 'Playing small, lack of foresight, unexpected delays, missed opportunities.',
        love: 'Limited relationship vision, missed romantic opportunities.',
        career: 'Limited career vision, missed business opportunities.',
        spiritual: 'Limited spiritual vision, missed teaching opportunities.'
      }
    },
    image: '/assets/cards/38_three_wands.png',
    description: 'A figure overlooks the sea, watching ships representing expanding ventures.',
    element: 'fire'
  },
  {
    id: '39',
    name: 'Four of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 4,
    keywords: {
      upright: ['celebration', 'joy', 'harmony', 'relaxation', 'homecoming'],
      reversed: ['personal celebration', 'inner harmony', 'conflict at home']
    },
    meanings: {
      upright: {
        general: 'Celebration, joy, harmony, stability, homecoming, achievement.',
        love: 'Relationship milestones, engagement, marriage, family harmony.',
        career: 'Career achievements, team celebration, workplace harmony.',
        spiritual: 'Spiritual celebration, community gathering, inner harmony.'
      },
      reversed: {
        general: 'Need for personal celebration, inner harmony work, family conflict.',
        love: 'Relationship conflicts, family disapproval, inner relationship work.',
        career: 'Workplace conflicts, lack of team harmony, personal achievement.',
        spiritual: 'Need for inner spiritual harmony, community conflicts.'
      }
    },
    image: '/assets/cards/39_four_wands.png',
    description: 'Two figures celebrate under a canopy of flowers and four wands.',
    element: 'fire'
  },
  {
    id: '40',
    name: 'Five of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 5,
    keywords: {
      upright: ['conflict', 'disagreements', 'competition', 'tension'],
      reversed: ['inner conflict', 'conflict avoidance', 'releasing tension']
    },
    meanings: {
      upright: {
        general: 'Conflict, disagreements, competition, tension, struggle for dominance.',
        love: 'Relationship conflicts, competition for attention, arguments.',
        career: 'Workplace competition, conflicts with colleagues, tension.',
        spiritual: 'Spiritual conflicts, competing beliefs, inner tension.'
      },
      reversed: {
        general: 'Inner conflict, avoiding confrontation, releasing tension, resolution.',
        love: 'Avoiding relationship conflicts, inner relationship work needed.',
        career: 'Avoiding workplace conflicts, inner professional development.',
        spiritual: 'Inner spiritual conflict, avoiding spiritual confrontation.'
      }
    },
    image: '/assets/cards/40_five_wands.png',
    description: 'Five figures engage in playful combat with their wands, representing competition.',
    element: 'fire'
  },

  // Complete remaining 38 cards for full 78-card deck
  {
    id: '41',
    name: 'Six of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 6,
    keywords: {
      upright: ['success', 'public recognition', 'progress', 'self-confidence'],
      reversed: ['private achievement', 'personal definition of success', 'fall from grace']
    },
    meanings: {
      upright: {
        general: 'Success, public recognition, progress, self-confidence, victory.',
        love: 'Successful relationships, public recognition of love, confidence.',
        career: 'Career success, public recognition, professional achievement.',
        spiritual: 'Spiritual success, recognition for spiritual work, confidence.'
      },
      reversed: {
        general: 'Private achievement, personal success definition, fall from grace.',
        love: 'Private relationship success, personal love achievement.',
        career: 'Personal career achievement, avoiding public recognition.',
        spiritual: 'Private spiritual achievement, personal spiritual success.'
      }
    },
    image: '/assets/cards/41_six_wands.png',
    description: 'A victorious figure on horseback receives acclaim from the crowd.',
    element: 'fire'
  },
  {
    id: '42',
    name: 'Seven of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 7,
    keywords: {
      upright: ['challenge', 'competition', 'protection', 'perseverance'],
      reversed: ['exhaustion', 'giving up', 'overwhelmed']
    },
    meanings: {
      upright: {
        general: 'Standing your ground, defending position, perseverance against odds.',
        love: 'Fighting for relationship, defending love, overcoming challenges.',
        career: 'Defending professional position, workplace competition, perseverance.',
        spiritual: 'Defending spiritual beliefs, spiritual challenges, inner strength.'
      },
      reversed: {
        general: 'Exhaustion from fighting, giving up, feeling overwhelmed.',
        love: 'Exhausted from relationship fights, giving up on love.',
        career: 'Professional burnout, giving up career fight, overwhelmed.',
        spiritual: 'Spiritual exhaustion, giving up spiritual practice, overwhelmed.'
      }
    },
    image: '/assets/cards/42_seven_wands.png',
    description: 'A figure defends their position against six attacking wands from below.',
    element: 'fire'
  },
  {
    id: '43',
    name: 'Eight of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 8,
    keywords: {
      upright: ['movement', 'speed', 'progress', 'quick decisions'],
      reversed: ['delays', 'frustration', 'resisting change', 'internal alignment']
    },
    meanings: {
      upright: {
        general: 'Rapid movement, speed, progress, quick decisions, swift action.',
        love: 'Fast-moving romance, quick relationship decisions, passionate love.',
        career: 'Rapid career progress, quick professional decisions, fast results.',
        spiritual: 'Rapid spiritual growth, quick spiritual insights, divine timing.'
      },
      reversed: {
        general: 'Delays, frustration, resisting change, need for internal alignment.',
        love: 'Delayed romance, relationship frustrations, resisting love changes.',
        career: 'Career delays, professional frustrations, resisting workplace change.',
        spiritual: 'Spiritual delays, frustrations with growth, resisting spiritual change.'
      }
    },
    image: '/assets/cards/43_eight_wands.png',
    description: 'Eight wands fly swiftly through the air toward their destination.',
    element: 'fire'
  },
  {
    id: '44',
    name: 'Nine of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 9,
    keywords: {
      upright: ['persistence', 'test of faith', 'boundaries', 'resilience'],
      reversed: ['inner resources', 'struggle', 'overwhelm', 'paranoia']
    },
    meanings: {
      upright: {
        general: 'Persistence, test of faith, maintaining boundaries, resilience.',
        love: 'Relationship endurance, love boundaries, testing times.',
        career: 'Professional persistence, career boundaries, workplace resilience.',
        spiritual: 'Spiritual endurance, faith testing, spiritual boundaries.'
      },
      reversed: {
        general: 'Drawing on inner resources, struggle, feeling overwhelmed.',
        love: 'Relationship struggles, love overwhelm, boundary issues.',
        career: 'Career struggles, professional overwhelm, workplace paranoia.',
        spiritual: 'Spiritual struggles, faith overwhelm, spiritual paranoia.'
      }
    },
    image: '/assets/cards/44_nine_wands.png',
    description: 'A wounded figure guards eight wands while holding the ninth defensively.',
    element: 'fire'
  },
  {
    id: '45',
    name: 'Ten of Wands',
    arcana: 'minor',
    suit: 'wands',
    number: 10,
    keywords: {
      upright: ['burden', 'extra responsibility', 'hard work', 'completion'],
      reversed: ['doing it all', 'carrying the load', 'delegation', 'release']
    },
    meanings: {
      upright: {
        general: 'Heavy burden, extra responsibility, hard work, near completion.',
        love: 'Relationship burdens, taking on too much, love responsibilities.',
        career: 'Work overload, extra responsibilities, career burden, near success.',
        spiritual: 'Spiritual burdens, taking on too much, spiritual responsibility.'
      },
      reversed: {
        general: 'Need for delegation, releasing burdens, sharing load, letting go.',
        love: 'Sharing relationship burdens, delegating love responsibilities.',
        career: 'Delegating work, sharing professional load, releasing career burden.',
        spiritual: 'Sharing spiritual burdens, delegating spiritual work, release.'
      }
    },
    image: '/assets/cards/45_ten_wands.png',
    description: 'A figure struggles under the weight of ten heavy wands.',
    element: 'fire'
  },
  
  // Court Cards - Wands
  {
    id: '46',
    name: 'Page of Wands',
    arcana: 'minor',
    suit: 'wands',
    keywords: {
      upright: ['inspiration', 'ideas', 'discovery', 'limitless potential'],
      reversed: ['lack of direction', 'no follow-through', 'disappointing news']
    },
    meanings: {
      upright: {
        general: 'Inspiration, new ideas, discovery, limitless potential, enthusiasm.',
        love: 'New romantic inspiration, creative love expression, passionate ideas.',
        career: 'Career inspiration, new professional ideas, creative opportunities.',
        spiritual: 'Spiritual inspiration, new spiritual ideas, divine messages.'
      },
      reversed: {
        general: 'Lack of direction, no follow-through, disappointing news, scattered energy.',
        love: 'Lack of romantic direction, no follow-through in love.',
        career: 'Lack of career direction, no professional follow-through.',
        spiritual: 'Lack of spiritual direction, no spiritual follow-through.'
      }
    },
    image: '/assets/cards/46_page_wands.png',
    description: 'A young person examines a sprouting wand with wonder and curiosity.',
    element: 'fire'
  },
  {
    id: '47',
    name: 'Knight of Wands',
    arcana: 'minor',
    suit: 'wands',
    keywords: {
      upright: ['action', 'adventure', 'fearlessness', 'confidence'],
      reversed: ['anger', 'impulsiveness', 'recklessness', 'haste']
    },
    meanings: {
      upright: {
        general: 'Action, adventure, fearlessness, confidence, charging forward.',
        love: 'Passionate romance, adventurous love, confident pursuit.',
        career: 'Taking career action, professional adventure, confident moves.',
        spiritual: 'Spiritual action, fearless spiritual pursuit, confident faith.'
      },
      reversed: {
        general: 'Anger, impulsiveness, recklessness, haste, lack of direction.',
        love: 'Impulsive romance, reckless love decisions, hasty relationships.',
        career: 'Reckless career moves, impulsive professional decisions.',
        spiritual: 'Impulsive spiritual decisions, reckless spiritual pursuit.'
      }
    },
    image: '/assets/cards/47_knight_wands.png',
    description: 'A knight charges forward on a rearing horse, wand held high.',
    element: 'fire'
  },
  {
    id: '48',
    name: 'Queen of Wands',
    arcana: 'minor',
    suit: 'wands',
    keywords: {
      upright: ['courage', 'confidence', 'independence', 'social butterfly'],
      reversed: ['self-respect', 'self-confidence', 'introverted', 'self-focussed']
    },
    meanings: {
      upright: {
        general: 'Courage, confidence, independence, social leadership, warmth.',
        love: 'Confident in love, independent partner, warm relationships.',
        career: 'Confident leadership, independent work style, social success.',
        spiritual: 'Spiritual confidence, independent spiritual path, warm spirituality.'
      },
      reversed: {
        general: 'Need for self-respect, building confidence, focusing inward.',
        love: 'Building romantic confidence, self-love needed, introverted love.',
        career: 'Building professional confidence, self-focused career development.',
        spiritual: 'Building spiritual confidence, self-focused spiritual work.'
      }
    },
    image: '/assets/cards/48_queen_wands.png',
    description: 'The Queen sits confidently with her wand and sunflower, exuding warmth.',
    element: 'fire'
  },
  {
    id: '49',
    name: 'King of Wands',
    arcana: 'minor',
    suit: 'wands',
    keywords: {
      upright: ['natural-born leader', 'vision', 'entrepreneur', 'honour'],
      reversed: ['impulsiveness', 'haste', 'ruthless', 'high expectations']
    },
    meanings: {
      upright: {
        general: 'Natural leadership, vision, entrepreneurship, honor, inspiring others.',
        love: 'Leading in relationships, visionary love, honorable partner.',
        career: 'Entrepreneurial success, visionary leadership, professional honor.',
        spiritual: 'Spiritual leadership, divine vision, honorable spiritual practice.'
      },
      reversed: {
        general: 'Impulsive leadership, haste, ruthlessness, unrealistic expectations.',
        love: 'Impulsive in love, hasty relationship decisions, high expectations.',
        career: 'Ruthless leadership, hasty business decisions, unrealistic goals.',
        spiritual: 'Impulsive spiritual leadership, unrealistic spiritual expectations.'
      }
    },
    image: '/assets/cards/49_king_wands.png',
    description: 'The King sits powerfully on his throne, master of creative fire energy.',
    element: 'fire'
  },

  // Minor Arcana - Swords (Air Element)
  {
    id: '50',
    name: 'Ace of Swords',
    arcana: 'minor',
    suit: 'swords',
    number: 1,
    keywords: {
      upright: ['breakthrough', 'clarity', 'sharp mind', 'new ideas'],
      reversed: ['inner clarity', 're-thinking', 'clouded judgement']
    },
    meanings: {
      upright: {
        general: 'Mental breakthrough, clarity, sharp mind, new ideas, truth.',
        love: 'Clarity in relationships, honest communication, new understanding.',
        career: 'Career breakthrough, clear thinking, new professional ideas.',
        spiritual: 'Spiritual breakthrough, divine clarity, new spiritual understanding.'
      },
      reversed: {
        general: 'Need for inner clarity, re-thinking, clouded judgment, confusion.',
        love: 'Relationship confusion, need for honest communication.',
        career: 'Professional confusion, need for career clarity.',
        spiritual: 'Spiritual confusion, need for divine clarity.'
      }
    },
    image: '/assets/cards/50_ace_swords.png',
    description: 'A hand emerges from clouds grasping a sword crowned with victory.',
    element: 'air'
  },
  {
    id: '51',
    name: 'Two of Swords',
    arcana: 'minor',
    suit: 'swords',
    number: 2,
    keywords: {
      upright: ['difficult decisions', 'weighing options', 'indecision', 'blocked emotions'],
      reversed: ['indecision', 'confusion', 'information overload', 'no right choice']
    },
    meanings: {
      upright: {
        general: 'Difficult decisions, weighing options, indecision, stalemate.',
        love: 'Relationship decisions, choosing between partners, love confusion.',
        career: 'Career decisions, weighing job options, professional indecision.',
        spiritual: 'Spiritual choices, weighing different paths, divine guidance needed.'
      },
      reversed: {
        general: 'Overwhelming choices, information overload, avoiding decisions.',
        love: 'Avoiding relationship decisions, love overwhelm, confusion.',
        career: 'Avoiding career decisions, professional overwhelm, too many options.',
        spiritual: 'Avoiding spiritual decisions, spiritual overwhelm, too many paths.'
      }
    },
    image: '/assets/cards/51_two_swords.png',
    description: 'A blindfolded figure sits with crossed swords, representing difficult choices.',
    element: 'air'
  },
  {
    id: '52',
    name: 'Three of Swords',
    arcana: 'minor',
    suit: 'swords',
    number: 3,
    keywords: {
      upright: ['heartbreak', 'emotional pain', 'sorrow', 'grief', 'loss'],
      reversed: ['negative self-talk', 'releasing pain', 'optimism', 'forgiveness']
    },
    meanings: {
      upright: {
        general: 'Heartbreak, emotional pain, sorrow, grief, loss, betrayal.',
        love: 'Heartbreak, relationship pain, love betrayal, romantic loss.',
        career: 'Career disappointment, professional betrayal, workplace grief.',
        spiritual: 'Spiritual pain, loss of faith, divine disappointment.'
      },
      reversed: {
        general: 'Healing from pain, releasing sorrow, forgiveness, optimism.',
        love: 'Healing from heartbreak, forgiving in love, relationship optimism.',
        career: 'Healing from career pain, professional forgiveness, optimism.',
        spiritual: 'Spiritual healing, forgiving divine plan, spiritual optimism.'
      }
    },
    image: '/assets/cards/52_three_swords.png',
    description: 'Three swords pierce a red heart beneath stormy clouds.',
    element: 'air'
  },
  {
    id: '53',
    name: 'Four of Swords',
    arcana: 'minor',
    suit: 'swords',
    number: 4,
    keywords: {
      upright: ['rest', 'relaxation', 'meditation', 'contemplation', 'recuperation'],
      reversed: ['awakening', 're-entering world', 'restlessness', 'burnout']
    },
    meanings: {
      upright: {
        general: 'Rest, relaxation, meditation, contemplation, mental recuperation.',
        love: 'Relationship rest, taking break from love, romantic contemplation.',
        career: 'Career break, professional rest, workplace contemplation.',
        spiritual: 'Spiritual rest, meditation, contemplating divine purpose.'
      },
      reversed: {
        general: 'Awakening from rest, re-entering world, restlessness, burnout.',
        love: 'Awakening to love, re-entering relationships, romantic restlessness.',
        career: 'Returning to career, professional awakening, workplace burnout.',
        spiritual: 'Spiritual awakening, returning to active practice, spiritual burnout.'
      }
    },
    image: '/assets/cards/53_four_swords.png',
    description: 'A figure lies in peaceful rest with three swords displayed above.',
    element: 'air'
  },
  {
    id: '54',
    name: 'Five of Swords',
    arcana: 'minor',
    suit: 'swords',
    number: 5,
    keywords: {
      upright: ['conflict', 'disagreements', 'competition', 'defeat', 'winning at all costs'],
      reversed: ['reconciliation', 'making amends', 'past resentment']
    },
    meanings: {
      upright: {
        general: 'Conflict, disagreements, competition, defeat, hollow victory.',
        love: 'Relationship conflicts, love competition, romantic defeat.',
        career: 'Workplace conflicts, professional competition, career defeat.',
        spiritual: 'Spiritual conflicts, competing beliefs, spiritual defeat.'
      },
      reversed: {
        general: 'Reconciliation, making amends, releasing past resentment.',
        love: 'Relationship reconciliation, love forgiveness, romantic healing.',
        career: 'Workplace reconciliation, professional forgiveness, career healing.',
        spiritual: 'Spiritual reconciliation, divine forgiveness, spiritual healing.'
      }
    },
    image: '/assets/cards/54_five_swords.png',
    description: 'A figure gathers swords while others walk away in defeat.',
    element: 'air'
  },
  {
    id: '55',
    name: 'Six of Swords',
    arcana: 'minor',
    suit: 'swords',
    number: 6,
    keywords: {
      upright: ['transition', 'change', 'rite of passage', 'releasing baggage'],
      reversed: ['personal transition', 'resistance to change', 'unfinished business']
    },
    meanings: {
      upright: {
        general: 'Transition, change, moving forward, releasing baggage, journey.',
        love: 'Relationship transition, moving forward in love, releasing past.',
        career: 'Career transition, professional change, moving to better situation.',
        spiritual: 'Spiritual transition, moving to higher understanding, spiritual journey.'
      },
      reversed: {
        general: 'Resisting change, personal transition, unfinished business.',
        love: 'Resisting relationship change, unfinished romantic business.',
        career: 'Resisting career change, unfinished professional business.',
        spiritual: 'Resisting spiritual change, unfinished spiritual business.'
      }
    },
    image: '/assets/cards/55_six_swords.png',
    description: 'A ferryman guides passengers across calm waters toward a new shore.',
    element: 'air'
  },
  {
    id: '56',
    name: 'Seven of Swords',
    arcana: 'minor',
    suit: 'swords',
    number: 7,
    keywords: {
      upright: ['betrayal', 'deception', 'getting away with something', 'strategy'],
      reversed: ['imposter syndrome', 'self-deceit', 'keeping secrets']
    },
    meanings: {
      upright: {
        general: 'Betrayal, deception, theft, getting away with something, stealth.',
        love: 'Romantic betrayal, love deception, cheating, dishonesty.',
        career: 'Workplace betrayal, professional deception, office politics.',
        spiritual: 'Spiritual betrayal, false teachings, deceptive practices.'
      },
      reversed: {
        general: 'Imposter syndrome, self-deceit, keeping secrets, being caught.',
        love: 'Self-deception in love, keeping romantic secrets, guilt.',
        career: 'Professional imposter syndrome, keeping work secrets.',
        spiritual: 'Spiritual self-deception, keeping spiritual secrets, false humility.'
      }
    },
    image: '/assets/cards/56_seven_swords.png',
    description: 'A figure sneaks away carrying five swords while two remain behind.',
    element: 'air'
  },
  {
    id: '57',
    name: 'Eight of Swords',
    arcana: 'minor',
    suit: 'swords',
    number: 8,
    keywords: {
      upright: ['negative thoughts', 'self-imposed restriction', 'imprisonment', 'victim mentality'],
      reversed: ['self-limiting beliefs', 'inner critic', 'releasing negative thoughts']
    },
    meanings: {
      upright: {
        general: 'Mental imprisonment, self-imposed restrictions, victim mentality, trapped thinking.',
        love: 'Feeling trapped in love, relationship victim mentality, love fears.',
        career: 'Career imprisonment, professional victim mentality, workplace fears.',
        spiritual: 'Spiritual imprisonment, religious guilt, divine victim mentality.'
      },
      reversed: {
        general: 'Releasing self-limiting beliefs, overcoming inner critic, mental freedom.',
        love: 'Freeing self from love limitations, overcoming romantic fears.',
        career: 'Professional mental freedom, overcoming career limitations.',
        spiritual: 'Spiritual freedom, releasing religious guilt, divine liberation.'
      }
    },
    image: '/assets/cards/57_eight_swords.png',
    description: 'A bound figure stands surrounded by eight swords, yet freedom is possible.',
    element: 'air'
  },
  {
    id: '58',
    name: 'Nine of Swords',
    arcana: 'minor',
    suit: 'swords',
    number: 9,
    keywords: {
      upright: ['anxiety', 'worry', 'fear', 'depression', 'nightmares'],
      reversed: ['inner turmoil', 'deep-seated fears', 'secrets', 'releasing anxiety']
    },
    meanings: {
      upright: {
        general: 'Anxiety, worry, fear, depression, nightmares, mental anguish.',
        love: 'Relationship anxiety, love worries, romantic fears, heartbreak.',
        career: 'Career anxiety, professional worries, workplace fears, stress.',
        spiritual: 'Spiritual anxiety, religious fears, divine worries, dark night of soul.'
      },
      reversed: {
        general: 'Releasing anxiety, overcoming fears, healing mental wounds.',
        love: 'Healing romantic anxiety, overcoming love fears, relationship peace.',
        career: 'Healing career anxiety, overcoming professional fears, work peace.',
        spiritual: 'Healing spiritual anxiety, overcoming religious fears, divine peace.'
      }
    },
    image: '/assets/cards/58_nine_swords.png',
    description: 'A figure sits up in bed, head in hands, tormented by worry.',
    element: 'air'
  },
  {
    id: '59',
    name: 'Ten of Swords',
    arcana: 'minor',
    suit: 'swords',
    number: 10,
    keywords: {
      upright: ['painful endings', 'deep wounds', 'betrayal', 'loss', 'crisis'],
      reversed: ['recovery', 'regeneration', 'resisting an inevitable end']
    },
    meanings: {
      upright: {
        general: 'Painful endings, deep wounds, betrayal, loss, rock bottom.',
        love: 'Relationship ending, romantic betrayal, heartbreak, love loss.',
        career: 'Career ending, professional betrayal, job loss, workplace crisis.',
        spiritual: 'Spiritual crisis, faith loss, divine betrayal, dark night.'
      },
      reversed: {
        general: 'Recovery from crisis, regeneration, resisting inevitable end.',
        love: 'Recovering from heartbreak, relationship regeneration, love healing.',
        career: 'Career recovery, professional regeneration, workplace healing.',
        spiritual: 'Spiritual recovery, faith regeneration, divine healing.'
      }
    },
    image: '/assets/cards/59_ten_swords.png',
    description: 'A figure lies face down with ten swords in their back as dawn approaches.',
    element: 'air'
  },
  
  // Court Cards - Swords
  {
    id: '60',
    name: 'Page of Swords',
    arcana: 'minor',
    suit: 'swords',
    keywords: {
      upright: ['new ideas', 'curiosity', 'thirst for knowledge', 'new ways of communicating'],
      reversed: ['self-expression', 'all talk and no action', 'lack of planning']
    },
    meanings: {
      upright: {
        general: 'New ideas, curiosity, thirst for knowledge, mental agility.',
        love: 'Curious about love, new romantic communication, intellectual attraction.',
        career: 'New professional ideas, workplace curiosity, learning opportunities.',
        spiritual: 'Spiritual curiosity, new understanding, divine communication.'
      },
      reversed: {
        general: 'All talk no action, lack of planning, scattered thoughts.',
        love: 'Romantic talk without action, scattered love thoughts.',
        career: 'Professional talk without action, scattered career plans.',
        spiritual: 'Spiritual talk without practice, scattered spiritual thoughts.'
      }
    },
    image: '/assets/cards/60_page_swords.png',
    description: 'A young person stands alert with sword raised, ready for mental challenges.',
    element: 'air'
  },
  {
    id: '61',
    name: 'Knight of Swords',
    arcana: 'minor',
    suit: 'swords',
    number: 11,
    keywords: {
      upright: ['ambitious', 'action-oriented', 'driven to succeed', 'fast-thinking'],
      reversed: ['restless', 'unfocused', 'impulsive', 'burn-out']
    },
    meanings: {
      upright: {
        general: 'Ambitious action, driven to succeed, fast thinking, direct approach.',
        love: 'Ambitious in love, direct romantic approach, fast-moving relationships.',
        career: 'Career ambition, direct professional approach, fast advancement.',
        spiritual: 'Ambitious spiritual growth, direct spiritual approach, fast development.'
      },
      reversed: {
        general: 'Restless energy, unfocused action, impulsive decisions, burnout.',
        love: 'Restless in love, impulsive romantic decisions, relationship burnout.',
        career: 'Professional restlessness, impulsive career moves, work burnout.',
        spiritual: 'Spiritual restlessness, impulsive spiritual decisions, practice burnout.'
      }
    },
    image: '/assets/cards/61_knight_swords.png',
    description: 'A knight charges forward with sword extended, representing swift action.',
    element: 'air'
  },
  {
    id: '62',
    name: 'Queen of Swords',
    arcana: 'minor',
    suit: 'swords',
    keywords: {
      upright: ['independent', 'unbiased judgement', 'clear boundaries', 'direct communication'],
      reversed: ['overly-emotional', 'easily influenced', 'harsh', 'bitter']
    },
    meanings: {
      upright: {
        general: 'Independence, unbiased judgment, clear boundaries, direct communication.',
        love: 'Independent in relationships, clear love boundaries, honest communication.',
        career: 'Professional independence, unbiased decisions, clear workplace boundaries.',
        spiritual: 'Spiritual independence, clear divine boundaries, honest spiritual communication.'
      },
      reversed: {
        general: 'Overly emotional, easily influenced, harsh judgment, bitterness.',
        love: 'Overly emotional in love, harsh romantic judgment, bitterness.',
        career: 'Overly emotional at work, harsh professional judgment, workplace bitterness.',
        spiritual: 'Overly emotional spiritually, harsh spiritual judgment, religious bitterness.'
      }
    },
    image: '/assets/cards/62_queen_swords.png',
    description: 'The Queen sits with sword raised, representing clear thinking and independence.',
    element: 'air'
  },
  {
    id: '63',
    name: 'King of Swords',
    arcana: 'minor',
    suit: 'swords',
    keywords: {
      upright: ['mental clarity', 'intellectual power', 'authority', 'truth'],
      reversed: ['quiet power', 'inner truth', 'misuse of power', 'manipulation']
    },
    meanings: {
      upright: {
        general: 'Mental clarity, intellectual power, authority, truth, fair judgment.',
        love: 'Intellectual love connection, fair relationship judgment, honest communication.',
        career: 'Professional authority, intellectual leadership, fair workplace judgment.',
        spiritual: 'Spiritual authority, divine truth, clear spiritual judgment, wisdom.'
      },
      reversed: {
        general: 'Misuse of intellectual power, manipulation, unfair judgment.',
        love: 'Manipulative in relationships, unfair romantic judgment, intellectual coldness.',
        career: 'Professional manipulation, unfair workplace judgment, authoritarian leadership.',
        spiritual: 'Spiritual manipulation, misuse of spiritual authority, false wisdom.'
      }
    },
    image: '/assets/cards/63_king_swords.png',
    description: 'The King sits authoritatively with sword upright, master of mental clarity.',
    element: 'air'
  },

  // Minor Arcana - Pentacles (Earth Element)
  {
    id: '64',
    name: 'Ace of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    number: 1,
    keywords: {
      upright: ['manifestation', 'new financial opportunity', 'abundance'],
      reversed: ['lost opportunity', 'lack of planning', 'bad investment']
    },
    meanings: {
      upright: {
        general: 'New financial opportunity, manifestation, abundance, material success.',
        love: 'Stable relationship foundation, commitment, security in love.',
        career: 'New job opportunity, financial success, material advancement.',
        spiritual: 'Manifesting spiritual goals, abundant blessings, grounded spirituality.'
      },
      reversed: {
        general: 'Lost opportunity, lack of planning, bad investment, missed chances.',
        love: 'Missed romantic opportunity, lack of commitment, insecurity.',
        career: 'Lost job opportunity, poor career planning, financial mistakes.',
        spiritual: 'Missed spiritual opportunity, lack of grounded practice, spiritual materialism.'
      }
    },
    image: '/assets/cards/64_ace_pentacles.png',
    description: 'A hand emerges from clouds holding a golden pentacle, symbol of material manifestation.',
    element: 'earth'
  },
  {
    id: '65',
    name: 'Two of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    number: 2,
    keywords: {
      upright: ['multiple priorities', 'time management', 'prioritisation', 'adaptability'],
      reversed: ['over-committed', 'disorganisation', 'reprioritisation']
    },
    meanings: {
      upright: {
        general: 'Juggling priorities, time management, adaptability, balance.',
        love: 'Balancing love and other priorities, relationship flexibility.',
        career: 'Managing multiple projects, work-life balance, professional adaptability.',
        spiritual: 'Balancing spiritual and material life, flexible spiritual practice.'
      },
      reversed: {
        general: 'Over-commitment, disorganization, need for reprioritization.',
        love: 'Relationship imbalance, neglecting love for other priorities.',
        career: 'Work overload, poor time management, career imbalance.',
        spiritual: 'Spiritual imbalance, neglecting practice, need for spiritual organization.'
      }
    },
    image: '/assets/cards/65_two_pentacles.png',
    description: 'A figure juggles two pentacles connected by an infinity symbol.',
    element: 'earth'
  },
  {
    id: '66',
    name: 'Three of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    number: 3,
    keywords: {
      upright: ['teamwork', 'collaboration', 'learning', 'implementation'],
      reversed: ['disharmony', 'misalignment', 'lack of teamwork']
    },
    meanings: {
      upright: {
        general: 'Teamwork, collaboration, learning, skill development, implementation.',
        love: 'Relationship teamwork, building together, learning from each other.',
        career: 'Professional collaboration, team projects, skill building, mentorship.',
        spiritual: 'Spiritual teamwork, learning from others, implementing teachings.'
      },
      reversed: {
        general: 'Team disharmony, poor collaboration, lack of cooperation.',
        love: 'Relationship discord, poor communication, lack of cooperation.',
        career: 'Workplace conflicts, poor teamwork, lack of professional cooperation.',
        spiritual: 'Spiritual community conflicts, lack of cooperation, ego issues.'
      }
    },
    image: '/assets/cards/66_three_pentacles.png',
    description: 'Craftsmen work together on a cathedral, representing collaborative mastery.',
    element: 'earth'
  },
  {
    id: '67',
    name: 'Four of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    number: 4,
    keywords: {
      upright: ['saving money', 'security', 'conservatism', 'scarcity', 'control'],
      reversed: ['over-spending', 'greed', 'self-protection']
    },
    meanings: {
      upright: {
        general: 'Financial security, saving money, conservatism, material control.',
        love: 'Possessive relationships, need for emotional security, controlling love.',
        career: 'Financial career security, conservative professional approach, control.',
        spiritual: 'Spiritual security, conservative spiritual approach, controlling faith.'
      },
      reversed: {
        general: 'Overspending, greed, loss of control, excessive self-protection.',
        love: 'Overly possessive in love, relationship greed, emotional hoarding.',
        career: 'Financial career recklessness, professional greed, loss of control.',
        spiritual: 'Spiritual greed, hoarding spiritual knowledge, loss of faith control.'
      }
    },
    image: '/assets/cards/67_four_pentacles.png',
    description: 'A figure clutches four pentacles protectively, representing material security.',
    element: 'earth'
  },
  {
    id: '68',
    name: 'Five of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    number: 5,
    keywords: {
      upright: ['financial loss', 'poverty', 'lack mindset', 'isolation', 'worry'],
      reversed: ['recovery', 'charity', 'improvement', 'end of bad times']
    },
    meanings: {
      upright: {
        general: 'Financial hardship, poverty, lack mindset, material insecurity.',
        love: 'Relationship poverty, emotional lack, feeling unloved, isolation.',
        career: 'Career hardship, job insecurity, professional poverty, workplace isolation.',
        spiritual: 'Spiritual poverty, feeling disconnected from divine, lack of faith.'
      },
      reversed: {
        general: 'Recovery from hardship, accepting help, improvement, charity.',
        love: 'Recovery from relationship hardship, accepting love help, improvement.',
        career: 'Career recovery, accepting professional help, workplace improvement.',
        spiritual: 'Spiritual recovery, accepting divine help, faith improvement.'
      }
    },
    image: '/assets/cards/68_five_pentacles.png',
    description: 'Two figures struggle in poverty outside a lit church window.',
    element: 'earth'
  },
  {
    id: '69',
    name: 'Six of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    number: 6,
    keywords: {
      upright: ['generosity', 'charity', 'community', 'material help', 'sharing'],
      reversed: ['self-care', 'unpaid debts', 'one-sided charity']
    },
    meanings: {
      upright: {
        general: 'Generosity, charity, sharing wealth, community support, giving and receiving.',
        love: 'Generous in relationships, sharing love, mutual support, caring.',
        career: 'Workplace generosity, professional mentoring, sharing success.',
        spiritual: 'Spiritual generosity, sharing wisdom, community service, divine giving.'
      },
      reversed: {
        general: 'Need for self-care, unpaid debts, one-sided giving, unequal exchange.',
        love: 'One-sided relationships, need for love self-care, unequal giving.',
        career: 'One-sided professional giving, need for career self-care, workplace inequality.',
        spiritual: 'One-sided spiritual giving, need for spiritual self-care, unbalanced service.'
      }
    },
    image: '/assets/cards/69_six_pentacles.png',
    description: 'A wealthy figure gives coins to beggars, representing balanced exchange.',
    element: 'earth'
  },
  {
    id: '70',
    name: 'Seven of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    number: 7,
    keywords: {
      upright: ['long-term view', 'sustainable results', 'perseverance', 'investment'],
      reversed: ['lack of long-term view', 'limited success', 'impatience']
    },
    meanings: {
      upright: {
        general: 'Long-term planning, sustainable results, patience, investment paying off.',
        love: 'Long-term relationship building, patient love, investment in partnership.',
        career: 'Career patience, long-term professional planning, investment in skills.',
        spiritual: 'Long-term spiritual growth, patient practice, investment in development.'
      },
      reversed: {
        general: 'Impatience, short-term thinking, limited success, poor investment.',
        love: 'Impatient in relationships, short-term love thinking, poor emotional investment.',
        career: 'Career impatience, short-term professional thinking, poor skill investment.',
        spiritual: 'Spiritual impatience, short-term practice, poor spiritual investment.'
      }
    },
    image: '/assets/cards/70_seven_pentacles.png',
    description: 'A farmer contemplates the growing pentacles on his crop, representing patient cultivation.',
    element: 'earth'
  },
  {
    id: '71',
    name: 'Eight of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    number: 8,
    keywords: {
      upright: ['apprenticeship', 'repetitive tasks', 'mastery', 'skill development'],
      reversed: ['lack of focus', 'no motivation', 'poor quality', 'lack of effort']
    },
    meanings: {
      upright: {
        general: 'Skill development, apprenticeship, mastery through practice, dedication.',
        love: 'Working on relationship skills, dedication to love, improving partnership.',
        career: 'Professional skill development, career mastery, dedicated work ethic.',
        spiritual: 'Spiritual practice, developing spiritual skills, dedicated spiritual work.'
      },
      reversed: {
        general: 'Lack of focus, poor quality work, no motivation, avoiding effort.',
        love: 'Not working on relationship, poor love effort, avoiding partnership work.',
        career: 'Poor work quality, lack of professional focus, avoiding skill development.',
        spiritual: 'Poor spiritual effort, lack of practice focus, avoiding spiritual work.'
      }
    },
    image: '/assets/cards/71_eight_pentacles.png',
    description: 'A craftsman diligently works on pentacles, representing dedicated skill development.',
    element: 'earth'
  },
  {
    id: '72',
    name: 'Nine of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    number: 9,
    keywords: {
      upright: ['abundance', 'luxury', 'self-sufficiency', 'financial independence'],
      reversed: ['self-worth', 'over-investment in work', 'hustling']
    },
    meanings: {
      upright: {
        general: 'Financial independence, luxury, self-sufficiency, material abundance.',
        love: 'Independent in relationships, self-sufficient love, abundant affection.',
        career: 'Career success, professional independence, financial achievement.',
        spiritual: 'Spiritual abundance, self-sufficient practice, independent faith.'
      },
      reversed: {
        general: 'Issues with self-worth, over-investment in work, financial dependence.',
        love: 'Love self-worth issues, over-investment in relationships, emotional dependence.',
        career: 'Career self-worth issues, work addiction, professional over-investment.',
        spiritual: 'Spiritual self-worth issues, over-investment in practice, faith dependence.'
      }
    },
    image: '/assets/cards/72_nine_pentacles.png',
    description: 'An elegant figure enjoys the fruits of their labor in a abundant garden.',
    element: 'earth'
  },
  {
    id: '73',
    name: 'Ten of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    number: 10,
    keywords: {
      upright: ['legacy', 'culmination', 'inheritance', 'spiritual home'],
      reversed: ['the fleeting nature of material wealth', 'family disputes']
    },
    meanings: {
      upright: {
        general: 'Legacy, family wealth, inheritance, long-term security, culmination.',
        love: 'Family love, relationship legacy, long-term partnership, generational love.',
        career: 'Career legacy, professional inheritance, long-term success, family business.',
        spiritual: 'Spiritual legacy, generational faith, long-term spiritual security.'
      },
      reversed: {
        general: 'Family disputes, fleeting wealth, inheritance issues, lack of legacy.',
        love: 'Family relationship disputes, temporary love, partnership issues.',
        career: 'Career disputes, temporary success, professional family issues.',
        spiritual: 'Spiritual family disputes, temporary faith, legacy issues.'
      }
    },
    image: '/assets/cards/73_ten_pentacles.png',
    description: 'A multi-generational family enjoys prosperity under the ten pentacles archway.',
    element: 'earth'
  },
  
  // Court Cards - Pentacles
  {
    id: '74',
    name: 'Page of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    keywords: {
      upright: ['manifestation', 'financial opportunity', 'skill development'],
      reversed: ['lack of progress', 'procrastination', 'learn from failure']
    },
    meanings: {
      upright: {
        general: 'New financial opportunity, learning practical skills, manifestation.',
        love: 'Practical approach to love, building relationship foundation.',
        career: 'New job opportunity, learning professional skills, career foundation.',
        spiritual: 'Practical spirituality, learning spiritual skills, grounding practice.'
      },
      reversed: {
        general: 'Procrastination, lack of progress, learning from failure.',
        love: 'Procrastinating in relationships, lack of love progress, romantic lessons.',
        career: 'Career procrastination, lack of professional progress, work lessons.',
        spiritual: 'Spiritual procrastination, lack of practice progress, spiritual lessons.'
      }
    },
    image: '/assets/cards/74_page_pentacles.png',
    description: 'A young person studies a pentacle intently, representing practical learning.',
    element: 'earth'
  },
  {
    id: '75',
    name: 'Knight of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    keywords: {
      upright: ['hard work', 'productivity', 'routine', 'conservatism'],
      reversed: ['self-discipline', 'boredom', 'frustration', 'no rewards despite effort']
    },
    meanings: {
      upright: {
        general: 'Hard work, productivity, methodical approach, conservative progress.',
        love: 'Steady relationship progress, reliable partner, methodical love approach.',
        career: 'Consistent work ethic, methodical career approach, steady advancement.',
        spiritual: 'Steady spiritual practice, methodical spiritual approach, reliable faith.'
      },
      reversed: {
        general: 'Boredom, frustration, lack of progress despite effort, impatience.',
        love: 'Relationship boredom, frustrated love progress, impatient with partner.',
        career: 'Career boredom, frustrated professional progress, impatient with advancement.',
        spiritual: 'Spiritual boredom, frustrated spiritual progress, impatient with growth.'
      }
    },
    image: '/assets/cards/75_knight_pentacles.png',
    description: 'A knight sits steadily on his horse, representing methodical progress.',
    element: 'earth'
  },
  {
    id: '76',
    name: 'Queen of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    keywords: {
      upright: ['nurturing', 'practical', 'providing financially', 'a working parent'],
      reversed: ['financial independence', 'self-care', 'work-home conflict']
    },
    meanings: {
      upright: {
        general: 'Nurturing abundance, practical care, providing for others, grounded wisdom.',
        love: 'Nurturing partner, providing for family, practical love expression.',
        career: 'Providing through work, nurturing leadership, practical professional approach.',
        spiritual: 'Nurturing spiritual community, providing spiritual care, practical faith.'
      },
      reversed: {
        general: 'Need for financial independence, self-care, work-home balance issues.',
        love: 'Need for relationship independence, love self-care, partnership balance.',
        career: 'Need for professional independence, work self-care, career-life balance.',
        spiritual: 'Need for spiritual independence, spiritual self-care, practice-life balance.'
      }
    },
    image: '/assets/cards/76_queen_pentacles.png',
    description: 'The Queen sits in a garden of abundance, nurturing growth and prosperity.',
    element: 'earth'
  },
  {
    id: '77',
    name: 'King of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    keywords: {
      upright: ['financial success', 'business acumen', 'security', 'discipline'],
      reversed: ['financially inept', 'obsessed with wealth', 'stubborn', 'materialistic']
    },
    meanings: {
      upright: {
        general: 'Financial mastery, business success, material security, generous leadership.',
        love: 'Providing security in relationships, stable partnership, generous love.',
        career: 'Business mastery, financial success, secure career, generous leadership.',
        spiritual: 'Spiritual mastery, providing for spiritual community, abundant wisdom.'
      },
      reversed: {
        general: 'Materialistic obsession, financial ineptitude, stubborn about money.',
        love: 'Materialistic in relationships, stubborn about partnership finances.',
        career: 'Poor business judgment, obsessed with career wealth, professional stubbornness.',
        spiritual: 'Materialistic spirituality, obsessed with spiritual wealth, stubborn faith.'
      }
    },
    image: '/assets/cards/77_king_pentacles.png',
    description: 'The King sits on his throne surrounded by pentacles, master of material realm.',
    element: 'earth'
  }
]

// Export for compatibility
export default tarotCards