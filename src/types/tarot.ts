// ===== Tarot Card Types =====

export type Arcana = 'major' | 'minor';
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles';
export type Element = 'fire' | 'water' | 'air' | 'earth' | 'spirit';
export type MinorRank =
  | 'ace' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
  | 'page' | 'knight' | 'queen' | 'king';

export type LifeArea = 'general' | 'love' | 'study' | 'work' | 'travel' | 'social';

export interface CardMeanings {
  general: string;
  love: string;
  study: string;
  work: string;
  travel: string;
  social: string;
}

export interface TarotCard {
  id: number;                    // 0-77
  name: string;                  // English name
  nameZh: string;                // Chinese name
  arcana: Arcana;
  suit: Suit | null;
  number: number;
  rank: MinorRank | null;
  element: Element;
  symbol: string;                // Emoji symbol
  keywordsUpright: string[];
  keywordsReversed: string[];
  meaningsUpright: CardMeanings;
  meaningsReversed: CardMeanings;
  isGenerallyPositive: boolean;
  descriptionZh: string;
}

export interface SpreadPosition {
  name: string;
  nameZh: string;
  description: string;
}

export type SpreadCategory = 'love' | 'study' | 'work' | 'travel' | 'social';

export interface SpreadType {
  id: string;
  name: string;
  nameZh: string;
  icon: string;                  // Lucide icon name
  category: SpreadCategory;
  cardCount: number;
  positions: SpreadPosition[];
  description: string;
  color: string;                 // CSS color for the spread button
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position: SpreadPosition;
}

export interface TarotReading {
  id: string;
  timestamp: number;
  spreadType: SpreadType;
  cards: DrawnCard[];
}

// ===== Divination State Machine =====
export type DivinationPhase =
  | 'idle'
  | 'selecting_spread'
  | 'shuffling'
  | 'spreading'
  | 'selecting_cards'
  | 'confirming'
  | 'transitioning'
  | 'revealing'
  | 'complete';
