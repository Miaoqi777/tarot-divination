import { ALL_CARDS } from '../data/cards';
import type { TarotCard, DrawnCard, SpreadType, TarotReading } from '../types/tarot';

/** Fisher-Yates shuffle — returns a new shuffled array */
export function shuffleDeck(): TarotCard[] {
  const deck = [...ALL_CARDS];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/** Determine if a card is reversed (~30% chance) */
export function determineReversal(): boolean {
  return Math.random() < 0.3;
}

/** Draw cards from the shuffled deck at the selected indices */
export function drawCards(
  deck: TarotCard[],
  indices: number[],
  spread: SpreadType
): DrawnCard[] {
  return indices.map((deckIndex, i) => ({
    card: deck[deckIndex],
    isReversed: determineReversal(),
    position: spread.positions[i],
  }));
}

/** Generate unique reading ID */
export function generateReadingId(): string {
  return `reading_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Create a full tarot reading */
export function createReading(spread: SpreadType, drawn: DrawnCard[]): TarotReading {
  return {
    id: generateReadingId(),
    timestamp: Date.now(),
    spreadType: spread,
    cards: drawn,
  };
}

/** Get gentle phrasing modifier for negative cards */
function softenIfNegative(card: TarotCard, meaning: string): string {
  if (!card.isGenerallyPositive) {
    // Add gentle caveat for negative cards
    const softeners = [
      '需要注意的是，',
      '值得留意的是，',
      '这提示我们，',
      '也许可以这样理解：',
    ];
    const endings = [
      '但这些挑战同时也是成长的契机。',
      '不过请记住，每一次困难都是一次蜕变的机会。',
      '保持积极的心态，这些都能够转化为动力。',
      '用平和的心态去面对，你会发现自己的成长。',
    ];
    const prefix = softeners[Math.floor(Math.random() * softeners.length)];
    const suffix = endings[Math.floor(Math.random() * endings.length)];
    return `${prefix}${meaning} ${suffix}`;
  }
  return meaning;
}

/** Generate a comprehensive reading interpretation */
export function generateInterpretation(drawn: DrawnCard[]): string[] {
  return drawn.map(({ card, isReversed, position }) => {
    const meaning = isReversed
      ? card.meaningsReversed.general
      : card.meaningsUpright.general;
    const orientation = isReversed ? '（逆位）' : '（正位）';
    const softened = softenIfNegative(card, meaning);
    return `【${position.nameZh}】${card.nameZh} ${card.symbol} ${orientation}\n\n${softened}`;
  });
}

/** Get context-specific meaning based on spread category */
export function getContextualMeaning(drawn: DrawnCard, area: string): string {
  const { card, isReversed } = drawn;
  const meanings = isReversed ? card.meaningsReversed : card.meaningsUpright;
  const meaning = (meanings as any)[area] || meanings.general;
  return softenIfNegative(card, meaning);
}
