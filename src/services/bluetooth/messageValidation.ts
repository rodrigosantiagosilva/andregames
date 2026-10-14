
import type {
  BluetoothMessage,
  Game,
  MessageType,
} from '@/types/game';

const MESSAGE_TYPES: MessageType[] = [
  'SOLICITACAO_ENTRADA',
  'JOGADOR_ENTROU',
  'PARTIDA_INICIADA',
  'JOGADA',
  'TROCA_REALIZADA',
  'JOGADOR_COMPLETOU',
  'PARTIDA_FINALIZADA',
  'JOGADOR_DESCONECTADO',
  'RECONEXAO',
  'JOGADA_REJEITADA',
  'ESTADO_PARTIDA',
];

const HOST_ONLY = new Set<MessageType>([
  'JOGADOR_ENTROU',
  'PARTIDA_INICIADA',
  'TROCA_REALIZADA',
  'JOGADOR_COMPLETOU',
  'PARTIDA_FINALIZADA',
  'JOGADA_REJEITADA',
  'ESTADO_PARTIDA',
]);

const SNAPSHOT_TYPES = new Set<MessageType>([
  'PARTIDA_INICIADA',
  'ESTADO_PARTIDA',
  'TROCA_REALIZADA',
  'JOGADOR_COMPLETOU',
  'PARTIDA_FINALIZADA',
]);

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
  );
}

function isCard(value: unknown): boolean {
  return (
    isRecord(value)
    && typeof value.id === 'string'
    && value.id.length > 0
    && typeof value.value === 'string'
    && value.value.length > 0
  );
}

function isCardList(value: unknown): value is Array<{
  id: string;
  value: string;
}> {
  return Array.isArray(value) && value.every(isCard);
}

function isPlayerList(value: unknown): boolean {
  if (
    !Array.isArray(value)
    || value.length < 1
    || value.length > 6
  ) {
    return false;
  }

  const ids = new Set<string>();
  const positions = new Set<number>();

  return value.every((player: unknown) => {
    if (
      !isRecord(player)
      || typeof player.id !== 'string'
      || !player.id
      || typeof player.name !== 'string'
      || !player.name.trim()
      || typeof player.isHost !== 'boolean'
      || typeof player.connected !== 'boolean'
      || !Number.isInteger(player.order)
      || (player.order as number) < 0
      || (player.order as number) > 5
      || !Number.isInteger(player.penalty)
      || (player.penalty as number) < 0
      || (player.penalty as number) > 5
      || ids.has(player.id)
      || positions.has(player.order as number)
    ) {
      return false;
    }

    ids.add(player.id);
    positions.add(player.order as number);

    return true;
  });
}

function isValidTimestampOrNull(value: unknown): boolean {
  return (
    value === null
    || (
      typeof value === 'number'
      && Number.isFinite(value)
    )
  );
}

export function validateBluetoothMessage(
  value: unknown,
  game: Pick<Game, 'id' | 'hostId' | 'players'>,
): value is BluetoothMessage {
  if (!isRecord(value)) {
    return false;
  }

  if (!MESSAGE_TYPES.includes(value.type as MessageType)) {
    return false;
  }

  if (
    value.gameId !== game.id
    || typeof value.senderId !== 'string'
    || !value.senderId
    || typeof value.timestamp !== 'number'
    || !Number.isFinite(value.timestamp)
    || !isRecord(value.payload)
  ) {
    return false;
  }

  const type = value.type as MessageType;
  const payload = value.payload;
  const senderId = value.senderId;

  const isJoinRequest = type === 'SOLICITACAO_ENTRADA';

  const senderExists = game.players.some(
    (player) => player.id === senderId,
  );

  if (!senderExists && !isJoinRequest) {
    return false;
  }

  if (
    HOST_ONLY.has(type)
    && senderId !== game.hostId
  ) {
    return false;
  }

  // Solicitação para entrar na partida.
  if (isJoinRequest) {
    if (
      typeof payload.playerId !== 'string'
      || payload.playerId !== senderId
      || typeof payload.name !== 'string'
      || !payload.name.trim()
    ) {
      return false;
    }
  }

  // Jogadas: comprar uma carta ou descartar uma carta.
  if (type === 'JOGADA') {
    if (
      payload.playerId !== senderId
      || !Number.isInteger(payload.round)
      || (payload.round as number) < 1
      || !['comprar', 'descartar'].includes(
        String(payload.action),
      )
    ) {
      return false;
    }

    if (
      payload.action === 'descartar'
      && (
        typeof payload.cardId !== 'string'
        || !payload.cardId
      )
    ) {
      return false;
    }

    if (
      payload.action === 'comprar'
      && payload.cardId !== undefined
    ) {
      return false;
    }
  }

  // Solicitação de reconexão.
  if (
    type === 'RECONEXAO'
    && payload.playerId !== senderId
  ) {
    return false;
  }

  // Notificação de desconexão.
  if (
    type === 'JOGADOR_DESCONECTADO'
    && senderId !== game.hostId
    && payload.playerId !== senderId
  ) {
    return false;
  }

  // Mensagem de rejeição de jogada.
  if (
    type === 'JOGADA_REJEITADA'
    && typeof payload.message !== 'string'
  ) {
    return false;
  }

  // Resposta a uma solicitação de entrada.
  if (type === 'JOGADOR_ENTROU') {
    if (typeof payload.accepted !== 'boolean') {
      return false;
    }

    if (
      payload.accepted
      && !isPlayerList(payload.players)
    ) {
      return false;
    }
  }

  // Estado sincronizado da partida.
  if (SNAPSHOT_TYPES.has(type)) {
    if (
      !isPlayerList(payload.players)
      || !isCardList(payload.hand)
      || !isCardList(payload.discardPile)
      || !Number.isInteger(payload.deckCount)
      || (payload.deckCount as number) < 0
      || !Number.isInteger(payload.round)
      || (payload.round as number) < 1
      || !['playing', 'finished', 'interrupted'].includes(
        String(payload.status),
      )
      || !['draw', 'discard'].includes(
        String(payload.turnPhase),
      )
    ) {
      return false;
    }

    // As listas foram validadas antes de acessar .length.
    const hand = payload.hand;

    // Durante a compra, a mão deve ter quatro cartas.
    if (
      payload.status === 'playing'
      && payload.turnPhase === 'draw'
      && hand.length !== 4
    ) {
      return false;
    }

    // Depois da compra, o jogador pode ter cinco cartas.
    if (
      payload.status === 'playing'
      && payload.turnPhase === 'discard'
      && hand.length !== 4
      && hand.length !== 5
    ) {
      return false;
    }

    if (
      payload.currentPlayerId !== null
      && typeof payload.currentPlayerId !== 'string'
    ) {
      return false;
    }

    if (
      !isValidTimestampOrNull(payload.startedAt)
      || !isValidTimestampOrNull(payload.endedAt)
    ) {
      return false;
    }

    if (
      payload.result !== null
      && !isRecord(payload.result)
    ) {
      return false;
    }
  }

  return true;
}

export function createBluetoothMessage(
  type: MessageType,
  gameId: string,
  senderId: string,
  payload: unknown,
  timestamp = Date.now(),
): BluetoothMessage {
  return {
    type,
    gameId,
    senderId,
    timestamp,
    payload,
  };
}