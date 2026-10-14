
import type { Card, Game, Player } from '@/types/game';

const CARD_VALUES = [
  'A', 'K', 'Q', 'J', '10', '9', '8',
  '7', '6', '5', '4', '3', '2',
];

const MAX_PLAYERS = 6;
const INITIAL_HAND_SIZE = 4;
const MAX_PENALTIES = 5;

export class GameRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GameRuleError';
  }
}

function shuffleCards(
  cards: Card[],
  random: () => number = Math.random,
): Card[] {
  const shuffled = [...cards];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));

    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function createDeck(
  playerCount: number,
  random: () => number = Math.random,
): Card[] {
  if (
    !Number.isInteger(playerCount)
    || playerCount < 2
    || playerCount > MAX_PLAYERS
  ) {
    throw new GameRuleError(
      'A partida precisa ter de 2 a 6 jogadores.',
    );
  }

  const deck = CARD_VALUES.flatMap((value) =>
    Array.from({ length: 4 }, (_, copy) => ({
      id: `${value}-${copy}`,
      value,
    })),
  );

  return shuffleCards(deck, random);
}

export function hasFourOfKind(hand: Card[]): boolean {
  return (
    hand.length === INITIAL_HAND_SIZE
    && hand.every((card) => card.value === hand[0].value)
  );
}

function nextPlayer(
  players: Player[],
  playerId: string,
): Player {
  const ordered = [...players].sort(
    (left, right) => left.order - right.order,
  );

  const currentIndex = ordered.findIndex(
    (player) => player.id === playerId,
  );

  if (currentIndex < 0 || ordered.length < 2) {
    throw new GameRuleError(
      'Jogador inválido para esta partida.',
    );
  }

  return ordered[(currentIndex + 1) % ordered.length];
}

function assertCurrentPlayer(
  game: Game,
  playerId: string,
): Player {
  if (game.status !== 'playing') {
    throw new GameRuleError(
      'A partida não está em andamento.',
    );
  }

  if (game.currentPlayerId !== playerId) {
    throw new GameRuleError(
      'Não é o turno deste jogador.',
    );
  }

  const player = game.players.find(
    (candidate) => candidate.id === playerId,
  );

  if (!player) {
    throw new GameRuleError('Jogador não encontrado.');
  }

  if (!player.connected) {
    throw new GameRuleError(
      'Jogador desconectado não pode jogar.',
    );
  }

  if (!game.hands[playerId]) {
    throw new GameRuleError(
      'A mão do jogador não foi encontrada.',
    );
  }

  return player;
}

function replenishDeck(
  game: Game,
  random: () => number = Math.random,
): Pick<Game, 'deck' | 'discardPile'> {
  if (game.deck.length > 0) {
    return {
      deck: [...game.deck],
      discardPile: [...game.discardPile],
    };
  }

  if (game.discardPile.length < 2) {
    throw new GameRuleError(
      'Não há cartas suficientes para comprar. O monte acabou.',
    );
  }

  const topDiscard =
    game.discardPile[game.discardPile.length - 1];

  const recyclable = game.discardPile.slice(0, -1);

  return {
    deck: shuffleCards(recyclable, random),
    discardPile: [topDiscard],
  };
}

/**
 * Aplica uma penalidade ao próximo jogador quando o jogador
 * ativo termina sua ação com quatro cartas iguais.
 */
function applyPenalty(
  game: Game,
  playerId: string,
  hand: Card[],
  now: number,
): Pick<
  Game,
  'players' | 'status' | 'result' | 'endedAt' | 'currentPlayerId'
> {
  if (!hasFourOfKind(hand)) {
    return {
      players: game.players,
      status: game.status,
      result: game.result,
      endedAt: game.endedAt,
      currentPlayerId: nextPlayer(
        game.players,
        playerId,
      ).id,
    };
  }

  const penalizedPlayer = nextPlayer(
    game.players,
    playerId,
  );

  const newPenalty = penalizedPlayer.penalty + 1;

  const players = game.players.map((player) =>
    player.id === penalizedPlayer.id
      ? {
          ...player,
          penalty: Math.min(newPenalty, MAX_PENALTIES),
        }
      : player,
  );

  if (newPenalty >= MAX_PENALTIES) {
    return {
      players,
      status: 'finished',
      endedAt: now,
      currentPlayerId: null,
      result: {
        winnerId: playerId,
        penalizedPlayerId: penalizedPlayer.id,
        reason: 'BURRO completo',
        endedAt: now,
      },
    };
  }

  return {
    players,
    status: game.status,
    result: game.result,
    endedAt: game.endedAt,
    currentPlayerId: penalizedPlayer.id,
  };
}

/**
 * Inicia a partida e distribui quatro cartas para cada jogador.
 */
export function startGame(
  game: Game,
  random: () => number = Math.random,
  now = Date.now(),
): Game {
  if (game.status !== 'lobby') {
    throw new GameRuleError(
      'A sala não está aguardando jogadores.',
    );
  }

  if (game.players.length < 2) {
    throw new GameRuleError(
      'São necessários pelo menos 2 jogadores.',
    );
  }

  if (game.players.length > MAX_PLAYERS) {
    throw new GameRuleError(
      'O limite é de 6 jogadores.',
    );
  }

  const players = [...game.players]
    .sort((left, right) => left.order - right.order)
    .map((player) => ({
      ...player,
      penalty: 0,
    }));

  const deck = createDeck(players.length, random);

  const hands: Record<string, Card[]> = Object.fromEntries(
    players.map((player) => [player.id, []]),
  );

  for (
    let cardIndex = 0;
    cardIndex < INITIAL_HAND_SIZE;
    cardIndex += 1
  ) {
    for (const player of players) {
      const card = deck.pop();

      if (!card) {
        throw new GameRuleError(
          'Não há cartas suficientes para distribuir.',
        );
      }

      hands[player.id].push(card);
    }
  }

  return {
    ...game,
    status: 'playing',
    players,
    hands,
    deck,
    deckCount: deck.length,
    discardPile: [],
    turnPhase: 'draw',
    pendingPasses: {},
    currentPlayerId: players[0].id,
    round: 1,
    startedAt: now,
    endedAt: null,
    result: null,
  };
}

/**
 * OPÇÃO 1 — Compra uma carta.
 * O jogador passa de quatro para cinco cartas e precisa descartar.
 */
export function buyCard(
  game: Game,
  playerId: string,
  random: () => number = Math.random,
): Game {
  assertCurrentPlayer(game, playerId);

  if (game.turnPhase !== 'draw') {
    throw new GameRuleError(
      'Você já comprou uma carta neste turno.',
    );
  }

  const hand = game.hands[playerId];

  if (!hand || hand.length !== INITIAL_HAND_SIZE) {
    throw new GameRuleError(
      'Você precisa ter exatamente quatro cartas para comprar.',
    );
  }

  const replenished = replenishDeck(game, random);
  const deck = [...replenished.deck];
  const card = deck.pop();

  if (!card) {
    throw new GameRuleError(
      'Não há cartas disponíveis para comprar.',
    );
  }

  return {
    ...game,
    deck,
    deckCount: deck.length,
    discardPile: replenished.discardPile,
    hands: {
      ...game.hands,
      [playerId]: [...hand, card],
    },
    turnPhase: 'discard',
  };
}

/**
 * OPÇÃO 1 — Descarta uma carta depois da compra.
 * O turno termina e passa para o próximo jogador.
 */
export function discardCard(
  game: Game,
  playerId: string,
  cardId: string,
  now = Date.now(),
): Game {
  assertCurrentPlayer(game, playerId);

  if (game.turnPhase !== 'discard') {
    throw new GameRuleError(
      'Compre uma carta antes de descartar.',
    );
  }

  const hand = game.hands[playerId];

  if (!hand || hand.length !== INITIAL_HAND_SIZE + 1) {
    throw new GameRuleError(
      'Sua mão precisa ter cinco cartas para descartar.',
    );
  }

  const cardIndex = hand.findIndex(
    (card) => card.id === cardId,
  );

  if (cardIndex < 0) {
    throw new GameRuleError(
      'A carta selecionada não pertence à sua mão.',
    );
  }

  const discardedCard = hand[cardIndex];

  const nextHand = hand.filter(
    (card) => card.id !== cardId,
  );

  const penalty = applyPenalty(
    game,
    playerId,
    nextHand,
    now,
  );

  return {
    ...game,
    ...penalty,
    hands: {
      ...game.hands,
      [playerId]: nextHand,
    },
    discardPile: [
      ...game.discardPile,
      discardedCard,
    ],
    deckCount: game.deck.length,
    turnPhase: 'draw',
    pendingPasses: {},
    round: game.round + 1,
  };
}

/**
 * OPÇÃO 2 — Repassa uma carta própria.
 *
 * A carta escolhida é trocada por uma carta aleatória da mão
 * do próximo jogador. Ninguém compra do monte nesta ação.
 * Cada jogador continua com quatro cartas.
 */
export function passCard(
  game: Game,
  playerId: string,
  cardId: string,
  random: () => number = Math.random,
  now = Date.now(),
): Game {
  assertCurrentPlayer(game, playerId);

  if (game.turnPhase !== 'draw') {
    throw new GameRuleError(
      'Você já comprou uma carta. Termine o descarte antes de encerrar o turno.',
    );
  }

  const hand = game.hands[playerId];

  if (!hand || hand.length !== INITIAL_HAND_SIZE) {
    throw new GameRuleError(
      'Você precisa ter exatamente quatro cartas para repassar.',
    );
  }

  const cardIndex = hand.findIndex(
    (card) => card.id === cardId,
  );

  if (cardIndex < 0) {
    throw new GameRuleError(
      'A carta selecionada não pertence à sua mão.',
    );
  }

  const recipient = nextPlayer(
    game.players,
    playerId,
  );

  if (!recipient.connected) {
    throw new GameRuleError(
      'O próximo jogador está desconectado.',
    );
  }

  const recipientHand = game.hands[recipient.id];

  if (
    !recipientHand
    || recipientHand.length !== INITIAL_HAND_SIZE
  ) {
    throw new GameRuleError(
      'A mão do próximo jogador não está em um estado válido.',
    );
  }

  const recipientCardIndex = Math.floor(
    random() * recipientHand.length,
  );

  const selectedCard = hand[cardIndex];
  const receivedCard = recipientHand[recipientCardIndex];

  const nextHand = hand.map((card, index) =>
    index === cardIndex ? receivedCard : card,
  );

  const nextRecipientHand = recipientHand.map(
    (card, index) =>
      index === recipientCardIndex ? selectedCard : card,
  );

  // O jogador ativo pode terminar com quatro cartas iguais.
  const penalty = applyPenalty(
    game,
    playerId,
    nextHand,
    now,
  );

  return {
    ...game,
    ...penalty,
    hands: {
      ...game.hands,
      [playerId]: nextHand,
      [recipient.id]: nextRecipientHand,
    },
    deck: [...game.deck],
    deckCount: game.deck.length,
    discardPile: [...game.discardPile],
    turnPhase: 'draw',
    pendingPasses: {},
    round: game.round + 1,
  };
}
