import { Solver } from "shared";

// \--- Day 7: Camel Cards ---
// ---------------------------
//
// Your all-expenses-paid trip turns out to be a one-way, five-minute ride in an [airship](https://en.wikipedia.org/wiki/Airship). (At least it's a _cool_ airship!) It drops you off at the edge of a vast desert and descends back to Island Island.
//
// "Did you bring the parts?"
//
// You turn around to see an Elf completely covered in white clothing, wearing goggles, and riding a large [camel](https://en.wikipedia.org/wiki/Dromedary).
//
// "Did you bring the parts?" she asks again, louder this time. You aren't sure what parts she's looking for; you're here to figure out why the sand stopped.
//
// "The parts! For the sand, yes! Come with me; I will show you." She beckons you onto the camel.
//
// After riding a bit across the sands of Desert Island, you can see what look like very large rocks covering half of the horizon. The Elf explains that the rocks are all along the part of Desert Island that is directly above Island Island, making it hard to even get there. Normally, they use big machines to move the rocks and filter the sand, but the machines have broken down because Desert Island recently stopped receiving the _parts_ they need to fix the machines.
//
// You've already assumed it'll be your job to figure out why the parts stopped when she asks if you can help. You agree automatically.
//
// Because the journey will take a few days, she offers to teach you the game of _Camel Cards_. Camel Cards is sort of similar to [poker](https://en.wikipedia.org/wiki/List_of_poker_hands) except it's designed to be easier to play while riding a camel.
//
// In Camel Cards, you get a list of _hands_, and your goal is to order them based on the _strength_ of each hand. A hand consists of _five cards_ labeled one of `A`, `K`, `Q`, `J`, `T`, `9`, `8`, `7`, `6`, `5`, `4`, `3`, or `2`. The relative strength of each card follows this order, where `A` is the highest and `2` is the lowest.
//
// Every hand is exactly one _type_. From strongest to weakest, they are:
//
// *   _Five of a kind_, where all five cards have the same label: `AAAAA`
// *   _Four of a kind_, where four cards have the same label and one card has a different label: `AA8AA`
// *   _Full house_, where three cards have the same label, and the remaining two cards share a different label: `23332`
// *   _Three of a kind_, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: `TTT98`
// *   _Two pair_, where two cards share one label, two other cards share a second label, and the remaining card has a third label: `23432`
// *   _One pair_, where two cards share one label, and the other three cards have a different label from the pair and each other: `A23A4`
// *   _High card_, where all cards' labels are distinct: `23456`
//
// Hands are primarily ordered based on type; for example, every _full house_ is stronger than any _three of a kind_.
//
// If two hands have the same type, a second ordering rule takes effect. Start by comparing the _first card in each hand_. If these cards are different, the hand with the stronger first card is considered stronger. If the first card in each hand have the _same label_, however, then move on to considering the _second card in each hand_. If they differ, the hand with the higher second card wins; otherwise, continue with the third card in each hand, then the fourth, then the fifth.
//
// So, `33332` and `2AAAA` are both _four of a kind_ hands, but `33332` is stronger because its first card is stronger. Similarly, `77888` and `77788` are both a _full house_, but `77888` is stronger because its third card is stronger (and both hands have the same first and second card).
//
// To play Camel Cards, you are given a list of hands and their corresponding _bid_ (your puzzle input). For example:
//
//     32T3K 765
//     T55J5 684
//     KK677 28
//     KTJJT 220
//     QQQJA 483
//
//
// This example shows five hands; each hand is followed by its _bid_ amount. Each hand wins an amount equal to its bid multiplied by its _rank_, where the weakest hand gets rank 1, the second-weakest hand gets rank 2, and so on up to the strongest hand. Because there are five hands in this example, the strongest hand will have rank 5 and its bid will be multiplied by 5.
//
// So, the first step is to put the hands in order of strength:
//
// *   `32T3K` is the only _one pair_ and the other hands are all a stronger type, so it gets rank _1_.
// *   `KK677` and `KTJJT` are both _two pair_. Their first cards both have the same label, but the second card of `KK677` is stronger (`K` vs `T`), so `KTJJT` gets rank _2_ and `KK677` gets rank _3_.
// *   `T55J5` and `QQQJA` are both _three of a kind_. `QQQJA` has a stronger first card, so it gets rank _5_ and `T55J5` gets rank _4_.
//
// Now, you can determine the total winnings of this set of hands by adding up the result of multiplying each hand's bid with its rank (`765` \* 1 + `220` \* 2 + `28` \* 3 + `684` \* 4 + `483` \* 5). So the _total winnings_ in this example are `_6440_`.
//
// Find the rank of every hand in your set. _What are the total winnings?_

type Card =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

type HandCards = [Card, Card, Card, Card, Card];

const CARD_STRENGTH = {
  A: 13,
  K: 12,
  Q: 11,
  J: 10,
  T: 9,
  "9": 8,
  "8": 7,
  "7": 6,
  "6": 5,
  "5": 4,
  "4": 3,
  "3": 2,
  "2": 1,
} as const;

enum HandType {
  FIVE_OF_A_KIND = 7,
  FOUR_OF_A_KIND = 6,
  FULL_HOUSE = 5,
  THREE_OF_A_KIND = 4,
  TWO_PAIR = 3,
  ONE_PAIR = 2,
  HIGH_CARD = 1,
}

interface Hand {
  cards: HandCards;
  bid: number;
  type: HandType;
}

const computeHandType = (cards: HandCards): HandType => {
  const countTable = cards.reduce((acc, card) => {
    acc[card] = (acc[card] ?? 0) + 1;
    return acc;
  }, {} as Record<Card, number>);
  const counts = Object.entries(countTable).sort((a, b) => b[1] - a[1]);

  switch (counts[0][1]) {
    case 5:
      return HandType.FIVE_OF_A_KIND;
    case 4:
      return HandType.FOUR_OF_A_KIND;
    case 3:
      return counts.length >= 2 && counts[1][1] === 2
        ? HandType.FULL_HOUSE
        : HandType.THREE_OF_A_KIND;
    case 2:
      return counts.length >= 2 && counts[1][1] === 2
        ? HandType.TWO_PAIR
        : HandType.ONE_PAIR;
    default:
      return HandType.HIGH_CARD;
  }
};

const computeHandTypeB = (cards: HandCards): HandType => {
  const countTable = cards.reduce((acc, card) => {
    acc[card] = (acc[card] ?? 0) + 1;
    return acc;
  }, {} as Record<Card, number>);
  const numJokers = countTable["J"] ?? 0;
  const counts = Object.entries(countTable)
    .filter(([k]) => k !== "J")
    .sort((a, b) => b[1] - a[1]);

  switch (counts[0]?.[1]) {
    case 5:
      return HandType.FIVE_OF_A_KIND;
    case 4:
      return numJokers >= 1 ? HandType.FIVE_OF_A_KIND : HandType.FOUR_OF_A_KIND;
    case 3:
      return numJokers >= 2
        ? HandType.FIVE_OF_A_KIND
        : numJokers >= 1
        ? HandType.FOUR_OF_A_KIND
        : counts.length >= 2 && counts[1][1] === 2
        ? HandType.FULL_HOUSE
        : HandType.THREE_OF_A_KIND;
    case 2:
      return numJokers >= 3
        ? HandType.FIVE_OF_A_KIND
        : numJokers >= 2
        ? HandType.FOUR_OF_A_KIND
        : numJokers >= 1
        ? counts.length >= 2 && counts[1][1] === 2
          ? HandType.FULL_HOUSE
          : HandType.THREE_OF_A_KIND
        : counts.length >= 2 && counts[1][1] === 2
        ? HandType.TWO_PAIR
        : HandType.ONE_PAIR;
    default: {
      switch (numJokers) {
        case 1:
          return HandType.ONE_PAIR;
        case 2:
          return HandType.THREE_OF_A_KIND;
        case 3:
          return HandType.FOUR_OF_A_KIND;
        case 4:
        case 5:
          return HandType.FIVE_OF_A_KIND;
        default:
          return HandType.HIGH_CARD;
      }
    }
  }
};

const parseHand = (
  line: string,
  handTypeParser: (cards: HandCards) => HandType = computeHandType
): Hand => {
  const [cardsPart, bidPart] = line.split(" ");
  const cards = [...cardsPart] as HandCards;
  const bid = parseInt(bidPart, 10);
  const type = handTypeParser(cards);

  return { cards, bid, type };
};

const compareHands = (
  a: Hand,
  b: Hand,
  strengthValues: Record<Card, number>
): number => {
  const typeDiff = b.type - a.type;
  if (typeDiff !== 0) {
    return typeDiff;
  }

  for (let i = 0; i < a.cards.length; i++) {
    const cardDiff = strengthValues[b.cards[i]] - strengthValues[a.cards[i]];
    if (cardDiff !== 0) {
      return cardDiff;
    }
  }

  return 0;
};

export const partA: Solver = (lines: string[]) => {
  const hands = lines
    .map((l) => parseHand(l))
    .sort((a, b) => compareHands(a, b, CARD_STRENGTH))
    .map((hand, idx, self) => ({ ...hand, rank: self.length - idx }));

  return hands.map((hand) => hand.bid * hand.rank).reduce((a, b) => a + b);
};

const CARD_STRENGTH_B = {
  A: 13,
  K: 12,
  Q: 11,
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
  J: 1,
} as const;

export const partB: Solver = (lines: string[]) => {
  const hands = lines
    .map((l) => parseHand(l, computeHandTypeB))
    .sort((a, b) => compareHands(a, b, CARD_STRENGTH_B))
    .map((hand, idx, self) => ({ ...hand, rank: self.length - idx }));

  return hands.map((hand) => hand.bid * hand.rank).reduce((a, b) => a + b);
};