substitua na tela de partida 
<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app-content">
      <div class="app-shell">
        <header class="topbar">
          <button
            v-if="app.screen !== 'home'"
            class="icon-button back-button"
            aria-label="Voltar"
            @click="back"
          >
            <ion-icon :icon="arrowBackOutline" />
          </button>
          <button
            v-else
            class="brand-lockup"
            aria-label="BURRO início"
            @click="app.returnHome()"
          >
            <span class="brand-symbol"
              ><span></span><span></span><span></span
            ></span>
            <span>BURRO</span>
          </button>
          <div class="topbar-right">
            <span class="offline-badge"
              ><span class="status-light"></span> OFFLINE</span
            >
            <button
              v-if="app.screen !== 'history' && app.screen !== 'details'"
              class="icon-button history-shortcut"
              aria-label="Histórico"
              @click="app.openHistory()"
            >
              <ion-icon :icon="timeOutline" />
            </button>
          </div>
        </header>

        <main class="screen-frame">
          <div v-if="app.error" class="feedback error-feedback" role="alert">
            <span>{{ app.error }}</span>
            <button aria-label="Fechar mensagem" @click="app.error = ''">
              <ion-icon :icon="closeOutline" />
            </button>
          </div>
          <div v-if="app.notice" class="feedback notice-feedback" role="status">
            <span>{{ app.notice }}</span>
            <button aria-label="Fechar mensagem" @click="app.notice = ''">
              <ion-icon :icon="closeOutline" />
            </button>
          </div>

          <section v-if="app.screen === 'home'" class="home-screen page-enter">
            <div class="home-kicker">
              <span class="kicker-line"></span> JOGO DE RODA · 2 A 6 PESSOAS
            </div>
            <div class="hero-layout">
              <div class="hero-copy">
                <h1>
                  Uma carta<br />de cada vez.<br /><em>Sem escapatória.</em>
                </h1>
                <p>
                  Forme sua quadra. Passe a carta. Não deixe o BURRO cair no seu
                  colo.
                </p>
                <button
                  class="button-primary hero-button"
                  @click="app.continueToIdentity()"
                >
                  Abrir uma mesa <ion-icon :icon="arrowForwardOutline" />
                </button>

                <button
                  class="text-button tutorial-shortcut"
                  @click="abrirTutorial"
                >
                  <ion-icon :icon="bookOutline" />
                  Aprenda a jogar
                  <ion-icon :icon="arrowForwardOutline" />
                </button>
              </div>
              <div class="card-art" aria-hidden="true">
                <div class="art-card art-card-back">
                  <span>R</span><small>BURRO</small>
                </div>
                <div class="art-card art-card-middle">
                  <small>Q</small><span>♣</span>
                </div>
                <div class="art-card art-card-front">
                  <small>4</small><span>♦</span><b>4</b>
                </div>
                <div class="art-stamp">SEM<br />INTERNET</div>
              </div>
            </div>
            <div class="home-footer">
              <span><b>01</b> Uma quadra de iguais</span>
              <span><b>02</b> Cinco letras encerram o jogo</span>
              <button class="text-button" @click="app.openHistory()">
                Ver histórico <ion-icon :icon="arrowForwardOutline" />
              </button>
            </div>
            <div class="home-note">
              <ion-icon :icon="bluetoothOutline" /> Partidas locais via
              Bluetooth · Android
            </div>
          </section>

          <section
            v-else-if="app.screen === 'identity'"
            class="form-screen page-enter"
          >
            <div class="section-number">01 / IDENTIFICAÇÃO</div>
            <h1>Como te<br /><em>chamam?</em></h1>
            <p class="lead">
              Escolha um nome para esta mesa. Até 20 caracteres.
            </p>
            <form class="identity-form" @submit.prevent="app.continueToModes()">
              <label for="player-name">Seu nome</label>
              <input
                id="player-name"
                v-model="app.playerNameInput"
                maxlength="20"
                autocomplete="nickname"
                placeholder="Ex.: Rafa"
                autofocus
              />
              <p v-if="app.identityError" class="field-error" role="alert">
                {{ app.identityError }}
              </p>
              <button class="button-primary full-button" type="submit">
                Continuar <ion-icon :icon="arrowForwardOutline" />
              </button>
            </form>
            <p class="privacy-line">
              <ion-icon :icon="lockClosedOutline" /> Seu nome fica salvo apenas
              neste aparelho.
            </p>
          </section>

          <section
            v-else-if="app.screen === 'choose'"
            class="choose-screen page-enter"
          >
            <div class="section-number">02 / NOVA MESA</div>
            <h1>Escolha seu<br /><em>lugar.</em></h1>
            <p class="lead">
              Olá, {{ app.playerName }}. Convide quem está por perto.
            </p>
            <div class="mode-list">
              <button
                class="mode-row create-row"
                :disabled="app.busy"
                @click="app.createRoom()"
              >
                <span class="mode-icon"><ion-icon :icon="addOutline" /></span>
                <span class="mode-copy"
                  ><b>Criar uma mesa</b
                  ><small>Você será o anfitrião</small></span
                >
                <ion-icon class="mode-arrow" :icon="arrowForwardOutline" />
              </button>
              <button
                class="mode-row"
                :disabled="app.busy"
                @click="app.findRooms()"
              >
                <span class="mode-icon search-icon"
                  ><ion-icon :icon="bluetoothOutline"
                /></span>
                <span class="mode-copy"
                  ><b>Procurar mesas</b
                  ><small>Descobrir jogadores próximos</small></span
                >
                <ion-icon class="mode-arrow" :icon="arrowForwardOutline" />
              </button>
            </div>
            <div class="bluetooth-callout">
              <span class="bluetooth-pulse"
                ><ion-icon :icon="bluetoothOutline"
              /></span>
              <div>
                <b>Conexão local</b
                ><small
                  >Sem internet. O Android pedirá acesso ao Bluetooth.</small
                >
              </div>
            </div>
            <button
              class="text-button edit-name"
              @click="app.screen = 'identity'"
            >
              Trocar nome
            </button>
          </section>

          <section
            v-else-if="app.screen === 'search'"
            class="search-screen page-enter"
          >
            <div class="section-number">BLUETOOTH / DESCOBERTA</div>
            <h1>Mesas<br /><em>por perto.</em></h1>
            <div class="scan-status" :class="{ scanning: app.scanning }">
              <span class="scan-orbit"
                ><ion-icon :icon="bluetoothOutline"
              /></span>
              <div>
                <b>{{
                  app.scanning ? "Procurando mesas" : "Busca encerrada"
                }}</b
                ><small>{{
                  app.scanning
                    ? "Mantenha esta tela aberta."
                    : `${app.rooms.length} mesa(s) encontrada(s)`
                }}</small>
              </div>
              <button
                v-if="app.scanning"
                class="icon-button"
                aria-label="Parar busca"
                @click="stopSearch"
              >
                <ion-icon :icon="closeOutline" />
              </button>
            </div>
            <div v-if="app.rooms.length" class="room-list">
              <button
                v-for="room in app.rooms"
                :key="room.address"
                class="room-row"
                :disabled="app.busy"
                @click="app.joinRoom(room)"
              >
                <span class="room-rssi"><ion-icon :icon="radioOutline" /></span>
                <span class="room-copy"
                  ><b>{{ room.name }}</b
                  ><small>Sala BLE próxima · {{ room.rssi }} dBm</small></span
                >
                <span class="room-join"
                  >Entrar <ion-icon :icon="arrowForwardOutline"
                /></span>
              </button>
            </div>
            <div v-else-if="!app.scanning" class="empty-state">
              <span class="empty-mark">∅</span><b>Nenhuma mesa encontrada</b
              ><small
                >Confira se o anfitrião está anunciando uma sala e tente
                novamente.</small
              >
            </div>
            <button
              v-if="!app.scanning"
              class="button-primary full-button"
              :disabled="app.busy"
              @click="app.findRooms()"
            >
              Buscar novamente <ion-icon :icon="refreshOutline" />
            </button>
            <div v-if="app.busy" class="connecting-line">
              <ion-spinner name="crescent" /> Conectando e lendo a sala...
            </div>
          </section>

          <section
            v-else-if="app.screen === 'lobby' && app.game"
            class="lobby-screen page-enter"
          >
            <div class="section-number">
              SALA DE ESPERA / {{ app.game.code }}
            </div>
            <div class="lobby-heading">
              <div>
                <h1>A mesa<br /><em>está aberta.</em></h1>
                <p class="lead">
                  {{ app.game.players.length }} de 6 lugares ocupados
                </p>
              </div>
              <div class="table-seal">
                <span>R</span><small>{{ app.game.code }}</small>
              </div>
            </div>
            <div class="connection-strip">
              <span
                class="connection-dot"
                :class="{
                  live:
                    app.connectionLabel.includes('conectado') ||
                    app.connectionLabel.includes('Anunciando'),
                }"
              ></span
              >{{ app.connectionLabel }}
            </div>
            <div v-if="app.joinRequests.length" class="request-list">
              <div class="list-label">
                PEDIDOS DE ENTRADA <span>{{ app.joinRequests.length }}</span>
              </div>
              <div
                v-for="request in app.joinRequests"
                :key="request.id"
                class="request-row"
              >
                <div class="player-avatar">
                  {{ request.name.slice(0, 1).toUpperCase() }}
                </div>
                <b>{{ request.name }}</b>
                <div class="request-actions">
                  <button
                    class="accept-button"
                    :aria-label="`Aceitar ${request.name}`"
                    @click="app.decideRequest(request, true)"
                  >
                    <ion-icon :icon="checkmarkOutline" /></button
                  ><button
                    class="reject-button"
                    :aria-label="`Recusar ${request.name}`"
                    @click="app.decideRequest(request, false)"
                  >
                    <ion-icon :icon="closeOutline" />
                  </button>
                </div>
              </div>
            </div>
            <div class="list-label">
              JOGADORES <span>{{ app.game.players.length }} / 6</span>
            </div>
            <div class="player-list">
              <div
                v-for="player in [...app.game.players].sort(
                  (a, b) => a.order - b.order,
                )"
                :key="player.id"
                class="player-row"
              >
                <div class="player-avatar" :class="{ host: player.isHost }">
                  {{ player.name.slice(0, 1).toUpperCase() }}
                </div>
                <div class="player-copy">
                  <b
                    >{{ player.name }}
                    <small v-if="player.id === app.localPlayerId"
                      >VOCÊ</small
                    ></b
                  ><span
                    >{{ player.isHost ? "Anfitrião" : "Jogador" }} · lugar
                    {{ player.order + 1 }}</span
                  >
                </div>
                <span
                  class="player-connection"
                  :class="{ connected: player.connected }"
                  ><i></i>{{ player.connected ? "Conectado" : "Offline" }}</span
                >
              </div>
              <div
                v-for="index in 6 - app.game.players.length"
                :key="`empty-${index}`"
                class="player-row empty-player"
              >
                <div class="player-avatar dashed">+</div>
                <span>Aguardando jogador</span>
              </div>
            </div>
            <p v-if="!app.isHost" class="waiting-note">
              <span class="waiting-pulse"></span
              >{{
                app.connectionLabel.includes("aprovação")
                  ? "Aguardando aprovação do anfitrião..."
                  : "Aguardando início da partida..."
              }}
            </p>
            <button
              v-if="app.isHost"
              class="button-primary full-button start-button"
              :disabled="app.game.players.length < 2"
              @click="app.beginGame()"
            >
              {{
                app.game.players.length < 2
                  ? "Aguardando mais alguém"
                  : "Iniciar partida"
              }}
              <ion-icon :icon="playOutline" />
            </button>
            <button class="text-button leave-button" @click="app.leaveRoom()">
              Sair da sala
            </button>
          </section>
<section
  v-else-if="app.screen === 'game' && app.game"
  class="game-screen page-enter"
>
  <div class="game-topline">
    <div>
      <span class="section-number">
        RODADA {{ String(app.game.round).padStart(2, "0") }}
      </span>
      <b class="game-code">{{ app.game.code }}</b>
    </div>

    <span class="connection-mini">
      <i
        :class="{
          live:
            app.connectionLabel.includes('Conectado') ||
            app.connectionLabel.includes('conectado'),
        }"
      ></i>
      {{
        app.connectionLabel.includes("Conectado") ||
        app.connectionLabel.includes("conectado")
          ? "Conectado"
          : "Sem conexão"
      }}
    </span>
  </div>

  <div class="table-felt">
    <div class="table-ring"></div>

    <div class="table-center">
      <div class="center-card">
        <span>R</span>
        <small>BURRO</small>
      </div>

      <b>
        {{
          app.activePlayer?.id === app.localPlayerId
            ? "SUA VEZ"
            : `VEZ DE ${app.activePlayer?.name ?? "..."}`
        }}
      </b>

      <small>
        {{
          !app.isMyTurn
            ? "Aguarde sua vez."
            : app.game.turnPhase === "draw"
              ? "Compre uma carta para começar."
              : "Escolha uma carta para descartar."
        }}
      </small>
    </div>

    <div
      v-for="player in app.game.players"
      :key="player.id"
      class="seat"
      :class="[
        `seat-${player.order}`,
        {
          'seat-active': player.id === app.game.currentPlayerId,
          'seat-local': player.id === app.localPlayerId,
        },
      ]"
    >
      <div class="seat-avatar">
        {{ player.name.slice(0, 1).toUpperCase() }}

        <span
          v-if="player.id === app.game.currentPlayerId"
          class="turn-star"
        >
          ✦
        </span>
      </div>

      <b>
        {{
          player.id === app.localPlayerId
            ? "Você"
            : player.name
        }}
      </b>

      <small>
        {{ player.isHost ? "ANFITRIÃO" : `LUGAR ${player.order + 1}` }}
      </small>

      <div
        class="penalty-track"
        :aria-label="`${player.penalty} letras de BURRO`"
      >
        <span
          v-for="letter in 5"
          :key="letter"
          :class="{ earned: letter <= player.penalty }"
        >
          {{ "BURRO"[letter - 1] }}
        </span>
      </div>
    </div>
  </div>

  <div class="direction-line">
    <span>
      <i class="direction-dot receiving"></i>
      Monte de compra
      <b>{{ app.game.deckCount }} cartas</b>
    </span>

    <span class="direction-arrow">·</span>

    <span>
      Descartes
      <b>{{ app.game.discardPile.length }} cartas</b>
      <i class="direction-dot sending"></i>
    </span>
  </div>

  <div class="hand-heading">
    <div>
      <span class="section-number">SUA MÃO</span>
      <b>{{ app.localHand.length }} CARTAS</b>
    </div>

    <span v-if="app.isMyTurn" class="your-turn-label">
      {{
        app.game.turnPhase === "draw"
          ? "Compre uma carta"
          : "Selecione para descartar"
      }}
    </span>

    <span v-else class="wait-turn-label">
      Turno de {{ app.activePlayer?.name ?? "..." }}
    </span>
  </div>

  <div
    class="hand"
    :class="{
      disabled:
        !app.isMyTurn ||
        app.movePending ||
        app.game.turnPhase !== 'discard',
    }"
  >
    <button
      v-for="card in app.localHand"
      :key="card.id"
      class="playing-card"
      :class="{ selected: app.selectedCardId === card.id }"
      :disabled="
        !app.isMyTurn ||
        app.movePending ||
        app.game.turnPhase !== 'discard'
      "
      :aria-pressed="app.selectedCardId === card.id"
      @click="app.chooseCard(card.id)"
    >
      <span class="card-corner">{{ card.value }}</span>
      <span class="card-face">{{ card.value }}</span>
      <span class="card-caption">
        {{ app.selectedCardId === card.id ? "SELECIONADA" : "DESCARTAR" }}
      </span>
    </button>
  </div>

  <button
    v-if="app.game.turnPhase === 'draw'"
    class="button-primary full-button confirm-button"
    :disabled="!app.canBuyCard"
    @click="app.buyCard()"
  >
    {{
      app.movePending
        ? "Aguardando anfitrião..."
        : "Comprar carta"
    }}
    <ion-icon :icon="arrowForwardOutline" />
  </button>

  <button
    v-else
    class="button-primary full-button confirm-button"
    :disabled="!app.canDiscardCard"
    @click="app.confirmCard()"
  >
    {{
      app.movePending
        ? "Aguardando anfitrião..."
        : "Descartar carta selecionada"
    }}
    <ion-icon :icon="arrowForwardOutline" />
  </button>

  <p v-if="app.isMyTurn && app.game.turnPhase === 'discard'" class="game-hint">
    Fique com quatro cartas. Se formar uma quadra de valores iguais,
    o próximo jogador recebe uma letra de BURRO.
  </p>

  <p v-if="app.movePending" class="game-hint">
    Aguardando confirmação do anfitrião...
  </p>

  <button class="text-button game-leave" @click="app.leaveRoom()">
    Sair da partida
  </button>
</section>


          <section
            v-else-if="app.screen === 'result' && app.game"
            class="result-screen page-enter"
          >
            <div class="result-stamp"><ion-icon :icon="trophyOutline" /></div>
            <div class="section-number">FIM DE JOGO / {{ app.game.code }}</div>
            <h1>
              {{ app.game.result?.winnerId ? 'Quadra!' : 'Partida<br />interrompida.'
              }}
            </h1>
            <p class="lead">
              {{
                app.game?.result?.winnerId
                  ? `${app.game.players.find((player) => player.id === app.game?.result?.winnerId)?.name} fechou quatro iguais.`
                  : app.notice || "A conexão foi encerrada antes do fim."
              }}
            </p>
            <div class="result-score">
              <div>
                <span>RODADAS</span><b>{{ app.game.round }}</b>
              </div>
              <div>
                <span>SUA PENALIDADE</span
                ><b>{{
                  "BURRO".slice(0, app.localPlayer?.penalty ?? 0) || "—"
                }}</b>
              </div>
              <div>
                <span>ENCERRAMENTO</span
                ><b>{{ app.game.result?.reason ?? "Partida interrompida" }}</b>
              </div>
            </div>
            <div class="result-players">
              <span class="list-label">PARTICIPANTES</span>
              <div
                v-for="player in [...app.game.players].sort(
                  (a, b) => a.order - b.order,
                )"
                :key="player.id"
                class="result-player"
              >
                <span>{{ String(player.order + 1).padStart(2, "0") }}</span
                ><b>{{ player.name }}</b
                ><small>{{
                  player.id === app.game.result?.winnerId
                    ? "VENCEDOR"
                    : `${player.penalty}/5 LETRAS`
                }}</small>
              </div>
            </div>
            <button
              class="button-primary full-button"
              @click="app.returnHome()"
            >
              Voltar ao início <ion-icon :icon="arrowForwardOutline" />
            </button>
            <button
              class="text-button full-text-button"
              @click="
                app.openDetails({
                  ...app.game,
                  localPlayerId: app.localPlayerId,
                })
              "
            >
              Ver detalhes da partida
            </button>
          </section>

          <section
            v-else-if="app.screen === 'history'"
            class="history-screen page-enter"
          >
            <div class="section-number">
              ARQUIVO LOCAL / {{ app.history.length }} PARTIDAS
            </div>
            <div class="history-heading">
              <h1>Seu<br /><em>histórico.</em></h1>
              <button
                v-if="app.history.length"
                class="icon-button delete-all"
                aria-label="Limpar histórico"
                @click="app.clearHistory()"
              >
                <ion-icon :icon="trashOutline" />
              </button>
            </div>
            <div v-if="app.history.length" class="history-list">
              <div
                v-for="entry in app.history"
                :key="entry.id"
                class="history-row"
              >
                <button class="history-open" @click="app.openDetails(entry)">
                  <span class="history-date">{{
                    formatDate(entry.startedAt ?? entry.endedAt)
                  }}</span
                  ><b>{{
                    entry.players.map((player) => player.name).join(" · ")
                  }}</b
                  ><small
                    >{{ entry.round }} rodadas ·
                    {{ entry.result?.reason ?? "Interrompida" }}</small
                  ><span class="history-result"
                    >{{
                      entry.result?.winnerId
                        ? entry.players.find(
                            (player) => player.id === entry.result?.winnerId,
                          )?.name + " venceu"
                        : "Sem vencedor"
                    }}
                    <ion-icon :icon="arrowForwardOutline"
                  /></span>
                </button>
                <button
                  class="delete-entry"
                  :aria-label="`Excluir partida de ${formatDate(entry.startedAt ?? entry.endedAt)}`"
                  @click="app.removeHistoryEntry(entry)"
                >
                  <ion-icon :icon="trashOutline" />
                </button>
              </div>
            </div>
            <div v-else class="empty-state history-empty">
              <span class="empty-mark">00</span><b>Nenhuma partida salva</b
              ><small
                >As partidas concluídas e interrompidas aparecem aqui.</small
              >
            </div>
            <button class="text-button history-home" @click="app.returnHome()">
              <ion-icon :icon="arrowBackOutline" /> Voltar ao início
            </button>
          </section>

          <section
            v-else-if="app.screen === 'details' && app.selectedHistory"
            class="details-screen page-enter"
          >
            <div class="section-number">
              REGISTRO / {{ app.selectedHistory.code }}
            </div>
            <h1>Detalhes<br /><em>da mesa.</em></h1>
            <div class="detail-block">
              <span>INÍCIO</span
              ><b>{{ formatDateTime(app.selectedHistory.startedAt) }}</b
              ><span>ENCERRAMENTO</span
              ><b>{{ formatDateTime(app.selectedHistory.endedAt) }}</b>
            </div>
            <div class="detail-block">
              <span>RESULTADO</span
              ><b>{{
                app.selectedHistory.result?.winnerId
                  ? `${app.selectedHistory.players.find((player) => player.id === app.selectedHistory?.result?.winnerId)?.name} venceu`
                  : "Partida sem vencedor"
              }}</b
              ><span>MOTIVO</span
              ><b>{{ app.selectedHistory.result?.reason ?? "Interrompida" }}</b
              ><span>RODADAS</span><b>{{ app.selectedHistory.round }}</b>
            </div>
            <div class="result-players">
              <span class="list-label">ORDEM DOS JOGADORES</span>
              <div
                v-for="player in [...app.selectedHistory.players].sort(
                  (a, b) => a.order - b.order,
                )"
                :key="player.id"
                class="result-player"
              >
                <span>{{ String(player.order + 1).padStart(2, "0") }}</span
                ><b>{{ player.name }}</b
                ><small>{{ player.penalty }}/5 LETRAS</small>
              </div>
            </div>
            <button
              class="button-primary full-button"
              @click="app.screen = 'history'"
            >
              <ion-icon :icon="arrowBackOutline" /> Voltar ao histórico
            </button>
          </section>
        </main>
        <footer class="app-footer">
          <span>BURRO / CARTAS ENTRE AMIGOS</span
          ><span>v1.0 <i></i> {{ app.game?.code ?? "SEM MESA" }}</span>
        </footer>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { IonContent, IonIcon, IonPage, IonSpinner } from "@ionic/vue";
import {
  addOutline,
  arrowBackOutline,
  arrowForwardOutline,
  bluetoothOutline,
  checkmarkOutline,
  closeOutline,
  lockClosedOutline,
  playOutline,
  radioOutline,
  refreshOutline,
  timeOutline,
  trophyOutline,
  trashOutline,
  bookOutline
} from "ionicons/icons";
import { useGameApp } from "@/composables/useGameApp";
import { bluetoothService } from "@/services/bluetooth/BluetoothService";
import { useRouter } from "vue-router";

const router = useRouter();

function abrirTutorial(): void {
  void router.push("/tutorial");
}

const app = reactive(useGameApp());

function formatDate(value?: number | null): string {
  return value
    ? new Date(value).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Data indisponível";
}

function formatDateTime(value?: number | null): string {
  return value
    ? new Date(value).toLocaleString("pt-BR", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Não registrado";
}

async function stopSearch(): Promise<void> {
  await bluetoothService.stopScan();
  app.scanning = false;
}

function back(): void {
  if (app.screen === "identity") app.screen = "home";
  else if (app.screen === "choose") app.screen = "identity";
  else if (app.screen === "search") app.screen = "choose";
  else if (app.screen === "history") app.screen = "home";
  else if (app.screen === "details") app.screen = "history";
  else if (app.screen === "lobby" || app.screen === "game")
    void app.leaveRoom();
  else if (app.screen === "result") void app.returnHome();
}
</script>

<style scoped>
:global(body) {
  background: #f4f6f2;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.app-content {
  --background: #f4f6f2;
}

.app-shell {
  --surface: #ffffff;
  --surface-soft: #edf2ec;
  --ink: #172b23;
  --muted: #75837a;
  --line: #e0e7df;
  --green: #245b43;
  --green-dark: #163d2d;
  --red: #c34e3b;

  min-height: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: max(18px, env(safe-area-inset-top)) 28px
    max(18px, env(safe-area-inset-bottom));
  color: var(--ink);
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 66px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--line);
  flex-shrink: 0;
}

.brand-lockup {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border: 0;
  background: transparent;
  color: var(--ink);
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 1.8px;
}

.brand-symbol {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 24px;
}

.brand-symbol span {
  width: 8px;
  height: 15px;
  border: 2px solid var(--red);
  border-radius: 3px;
  transform: rotate(-12deg);
}

.brand-symbol span:nth-child(2) {
  height: 21px;
  background: var(--red);
  transform: none;
}

.brand-symbol span:nth-child(3) {
  transform: rotate(12deg);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.offline-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  color: var(--muted);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}

.status-light {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #d19a3b;
  box-shadow: 0 0 0 3px #f8eed9;
}

.icon-button {
  width: 42px;
  height: 42px;
  display: inline-grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
  color: var(--ink);
  font-size: 19px;
  transition:
    background 0.2s,
    transform 0.2s;
}

.icon-button:active {
  transform: scale(0.96);
  background: var(--surface-soft);
}

.back-button {
  border: 0;
  background: transparent;
  margin-left: -8px;
}

.screen-frame {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.page-enter {
  animation: pageEnter 0.35s ease both;
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h1 {
  margin: 24px 0 18px;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(44px, 7vw, 76px);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: -2px;
}

h1 em {
  color: var(--red);
  font-weight: 400;
}

.home-screen {
  flex: 1;
  padding-top: clamp(36px, 7vh, 82px);
  display: flex;
  flex-direction: column;
}

.home-kicker,
.section-number {
  color: var(--muted);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.home-kicker {
  display: flex;
  align-items: center;
  gap: 10px;
}

.kicker-line {
  width: 26px;
  height: 3px;
  border-radius: 3px;
  background: var(--red);
}

.hero-layout {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  min-height: 390px;
  gap: 24px;
}

.hero-copy {
  position: relative;
  z-index: 1;
  padding: 25px 0 35px;
}

.hero-copy p,
.lead {
  max-width: 410px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.8;
  margin: 0 0 28px;
}

.button-primary {
  min-height: 54px;
  padding: 0 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  border: 0;
  border-radius: 15px;
  background: var(--green);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  box-shadow: 0 7px 18px rgb(36 91 67 / 15%);
  transition:
    transform 0.2s,
    background 0.2s,
    box-shadow 0.2s;
}

.button-primary:hover:not(:disabled) {
  background: var(--green-dark);
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgb(36 91 67 / 20%);
}

.button-primary:active:not(:disabled) {
  transform: scale(0.98);
}

.button-primary:disabled {
  background: #b9c5bc;
  color: #f4f6f2;
  box-shadow: none;
}

.button-primary ion-icon {
  font-size: 18px;
}

.hero-button {
  min-width: 210px;
}

.card-art {
  position: relative;
  width: 100%;
  height: 330px;
  display: grid;
  place-items: center;
  border-radius: 30px;
  background:
    radial-gradient(circle at 80% 15%, rgb(255 255 255 / 12%), transparent 35%),
    linear-gradient(145deg, #285a43, #153a2c);
  overflow: hidden;
}

.card-art::before,
.card-art::after {
  content: "";
  position: absolute;
  width: 230px;
  height: 230px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 50%;
}

.card-art::after {
  width: 290px;
  height: 290px;
}

.art-card {
  position: absolute;
  width: 135px;
  height: 195px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 14px;
  border: 1px solid rgb(23 43 35 / 12%);
  border-radius: 12px;
  box-shadow: 0 18px 35px rgb(0 0 0 / 22%);
}

.art-card-back {
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--red);
  color: #fff8ec;
  transform: translate(-48px, 3px) rotate(-15deg);
}

.art-card-back span {
  font:
    700 65px Georgia,
    serif;
}

.art-card-back small {
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 2px;
}

.art-card-middle {
  background: #f0e8d5;
  color: var(--green);
  transform: translate(0, -9px) rotate(0deg);
}

.art-card-middle small,
.art-card-front small {
  font:
    700 25px Georgia,
    serif;
}

.art-card-middle span {
  align-self: center;
  font-size: 59px;
}

.art-card-front {
  background: #fffdf5;
  color: var(--red);
  transform: translate(49px, 5px) rotate(13deg);
}

.art-card-front span {
  align-self: center;
  font-size: 52px;
}

.art-card-front b {
  align-self: flex-end;
  font:
    700 25px Georgia,
    serif;
  transform: rotate(180deg);
}

.art-stamp {
  position: absolute;
  right: 20px;
  bottom: 17px;
  padding: 8px 10px;
  border: 1px solid #e7c66d;
  border-radius: 8px;
  color: #f1d78d;
  font-size: 8px;
  font-weight: 900;
  line-height: 1.4;
  letter-spacing: 1px;
  transform: rotate(-6deg);
}

.home-footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
  min-height: 68px;
  padding: 12px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.home-footer > span {
  color: var(--muted);
  font-size: 10px;
}

.home-footer > span b {
  padding-right: 6px;
  color: var(--red);
}

.text-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 0;
  border: 0;
  background: transparent;
  color: var(--green);
  font-size: 12px;
  font-weight: 800;
}

.text-button:active {
  opacity: 0.7;
}

.home-footer .text-button {
  margin-left: auto;
}

.home-note {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 16px 0 8px;
  color: var(--muted);
  font-size: 11px;
}

.home-note ion-icon {
  color: var(--green);
  font-size: 17px;
}

.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid var(--line);
  color: #96a098;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.7px;
}

.app-footer span:last-child {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-footer i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--red);
}

/* Formulários e telas secundárias */

.form-screen,
.choose-screen,
.search-screen,
.lobby-screen,
.history-screen,
.details-screen,
.result-screen {
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  padding: clamp(35px, 7vh, 76px) 0 44px;
}

.form-screen h1,
.choose-screen h1,
.search-screen h1,
.history-screen h1,
.details-screen h1,
.result-screen h1 {
  font-size: clamp(46px, 8vw, 68px);
}

.form-screen .lead,
.choose-screen .lead,
.search-screen .lead {
  margin-bottom: 30px;
}

.identity-form {
  display: flex;
  flex-direction: column;
  gap: 11px;
  max-width: 430px;
}

.identity-form label {
  margin-top: 5px;
  color: var(--ink);
  font-size: 12px;
  font-weight: 800;
}

.identity-form input {
  width: 100%;
  height: 56px;
  padding: 0 16px;
  border: 1px solid #d8e1d7;
  border-radius: 14px;
  outline: none;
  background: var(--surface);
  color: var(--ink);
  font-size: 15px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.identity-form input:focus {
  border-color: var(--green);
  box-shadow: 0 0 0 4px rgb(36 91 67 / 9%);
}

.full-button {
  width: 100%;
  margin-top: 15px;
}

.field-error {
  margin: 0;
  color: #b53c30;
  font-size: 12px;
}

.privacy-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  color: var(--muted);
  font-size: 11px;
}

.mode-list {
  display: grid;
  gap: 12px;
  border: 0;
}

.mode-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 17px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--surface);
  color: var(--ink);
  text-align: left;
  transition:
    border-color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
}

.mode-row:hover:not(:disabled) {
  border-color: #b5cabb;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgb(30 55 39 / 6%);
}

.mode-row:disabled {
  opacity: 0.6;
}

.mode-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 14px;
  background: #e8f0e5;
  color: var(--green);
  font-size: 23px;
}

.create-row .mode-icon {
  background: #f9e9e3;
  color: var(--red);
}

.mode-copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mode-copy b {
  font-size: 14px;
}

.mode-copy small,
.bluetooth-callout small {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.5;
}

.mode-arrow {
  color: var(--muted);
  font-size: 18px;
}

.bluetooth-callout {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 17px;
  margin-top: 20px;
  border: 1px solid #dce7d8;
  border-radius: 16px;
  background: #edf4e9;
}

.bluetooth-pulse {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 13px;
  background: #dcebd8;
  color: var(--green);
  font-size: 20px;
}

.bluetooth-callout div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.bluetooth-callout b {
  font-size: 12px;
}

.edit-name {
  margin-top: 15px;
}

.feedback {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  max-width: 650px;
  padding: 13px 15px;
  margin: 13px auto 0;
  border-radius: 12px;
  font-size: 12px;
  line-height: 1.6;
}

.feedback button {
  flex: 0 0 25px;
  width: 25px;
  height: 25px;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 18px;
}

.error-feedback {
  border: 1px solid #f1d0c7;
  background: #fff0eb;
  color: #963a2c;
}

.notice-feedback {
  border: 1px solid #cfe1cc;
  background: #eaf4e7;
  color: #315d3c;
}

/* Busca de salas */

.scan-status {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 15px;
  margin-bottom: 18px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
}

.scan-status > div {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.scan-status b {
  font-size: 12px;
}

.scan-status small {
  color: var(--muted);
  font-size: 11px;
}

.scan-orbit {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: #e8f0e5;
  color: var(--green);
  font-size: 20px;
}

.scan-status.scanning .scan-orbit {
  animation: pulse 1.7s infinite;
}

@keyframes pulse {
  50% {
    box-shadow: 0 0 0 7px rgb(91 133 94 / 12%);
  }
}

.room-list {
  display: grid;
  gap: 10px;
}

.room-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
  color: var(--ink);
  text-align: left;
}

.room-rssi {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: #e8f0e5;
  color: var(--green);
  font-size: 19px;
}

.room-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.room-copy b {
  font-size: 12px;
}

.room-copy small {
  color: var(--muted);
  font-size: 10px;
}

.room-join {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--green);
  font-size: 10px;
  font-weight: 800;
}

.empty-state {
  min-height: 190px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 24px;
  border: 1px dashed #d4dfd3;
  border-radius: 20px;
  background: rgb(255 255 255 / 60%);
  color: var(--muted);
  text-align: center;
}

.empty-mark {
  color: var(--red);
  font:
    400 38px Georgia,
    serif;
}

.empty-state b {
  color: var(--ink);
  font-size: 14px;
}

.empty-state small {
  max-width: 280px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.7;
}

.connecting-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 16px;
  color: var(--green);
  font-size: 12px;
}

/* Sala de espera */

.lobby-screen {
  max-width: 720px;
}

.lobby-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.lobby-heading h1 {
  font-size: clamp(43px, 8vw, 65px);
}

.lobby-heading .lead {
  margin: 0 0 20px;
  font-size: 12px;
}

.table-seal {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #c7d8c6;
  border-radius: 22px;
  background: #e9f1e5;
  color: var(--green);
  transform: rotate(4deg);
}

.table-seal span {
  font:
    700 30px Georgia,
    serif;
  line-height: 1;
}

.table-seal small {
  margin-top: 5px;
  font-size: 8px;
  font-weight: 900;
}

.connection-strip {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 14px;
  margin: 10px 0 24px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface);
  color: var(--muted);
  font-size: 11px;
}

.connection-dot,
.player-connection i,
.connection-mini i {
  width: 7px;
  height: 7px;
  display: inline-block;
  flex-shrink: 0;
  border-radius: 50%;
  background: #d19a3b;
}

.connection-dot.live,
.player-connection.connected i,
.connection-mini i.live {
  background: #398b58;
}

.list-label {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
  color: var(--muted);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1px;
}

.list-label span {
  color: var(--red);
}

.player-row,
.request-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 68px;
  border-bottom: 1px solid var(--line);
}

.player-avatar {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: #e3eee0;
  color: var(--green);
  font:
    700 15px Georgia,
    serif;
}

.player-avatar.host {
  background: #f8e6df;
  color: var(--red);
}

.player-avatar.dashed {
  border: 1px dashed #c5d0c4;
  background: transparent;
  color: #96a398;
  font:
    400 20px system-ui,
    sans-serif;
}

.player-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.player-copy b {
  font-size: 12px;
}

.player-copy b small {
  margin-left: 5px;
  color: var(--red);
  font-size: 9px;
}

.player-copy span,
.empty-player > span:last-child {
  color: var(--muted);
  font-size: 10px;
}

.player-connection {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  font-size: 9px;
}

.player-connection.connected {
  color: var(--green);
}

.empty-player {
  opacity: 0.7;
}

.request-row > b {
  flex: 1;
  font-size: 12px;
}

.request-actions {
  display: flex;
  gap: 8px;
}

.request-actions button {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 12px;
  font-size: 18px;
}

.accept-button {
  background: #e2f0df;
  color: #347347;
}

.reject-button {
  background: #f9e7e1;
  color: #a83d30;
}

.waiting-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 20px 0 10px;
  color: var(--muted);
  font-size: 11px;
}

.waiting-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #d19a3b;
  animation: pulse 1.5s infinite;
}

.start-button {
  margin-top: 20px;
}

.leave-button,
.game-leave {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 8px;
  color: #a34435;
}

/* Mesa de jogo */

.game-screen {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 25px 0 35px;
}

.game-topline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.game-topline > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.game-code {
  color: var(--muted);
  font-size: 10px;
}

.connection-mini {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  font-size: 9px;
}

.table-felt {
  min-height: 350px;
  position: relative;
  display: grid;
  place-items: center;
  margin: 20px 0 0;
  overflow: hidden;
  border: 7px solid #e4e9db;
  border-radius: 190px;
  background: radial-gradient(
    ellipse at center,
    #36704d 0%,
    #24563b 60%,
    #173e2c 100%
  );
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 13%),
    0 12px 28px rgb(28 59 39 / 10%);
  color: #f5f4e8;
}

.table-ring {
  position: absolute;
  inset: 36px 13%;
  border: 1px solid rgb(231 239 218 / 20%);
  border-radius: 50%;
}

.table-center {
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
}

.center-card {
  width: 48px;
  height: 63px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  border: 1px solid #e4e6d9;
  border-radius: 8px;
  background: #f6f1df;
  color: var(--green);
  transform: rotate(-6deg);
}

.center-card span {
  font:
    700 31px Georgia,
    serif;
  line-height: 1;
}

.center-card small {
  font-size: 6px;
  font-weight: 900;
}

.table-center > b {
  color: #fff9e9;
  font-size: 10px;
  letter-spacing: 1px;
}

.table-center > small {
  color: rgb(255 255 255 / 75%);
  font-size: 9px;
}

.seat {
  position: absolute;
  z-index: 2;
  min-width: 62px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #f4f0e4;
}

.seat-0 {
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
}

.seat-1 {
  top: 29%;
  right: 5%;
}
.seat-2 {
  bottom: 22%;
  right: 11%;
}
.seat-3 {
  bottom: 13px;
  left: 50%;
  transform: translateX(-50%);
}
.seat-4 {
  bottom: 22%;
  left: 11%;
}
.seat-5 {
  top: 29%;
  left: 5%;
}

.seat-avatar {
  position: relative;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid rgb(242 238 222 / 55%);
  border-radius: 12px;
  background: rgb(12 35 27 / 25%);
  font:
    700 13px Georgia,
    serif;
}

.seat-active .seat-avatar {
  border: 2px solid #f1c65c;
  color: #ffe194;
  box-shadow: 0 0 0 4px rgb(228 183 79 / 16%);
}

.seat-local .seat-avatar {
  background: #f1ead4;
  color: #254c3c;
}

.seat b {
  max-width: 75px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 9px;
}

.seat small {
  color: rgb(242 238 222 / 65%);
  font-size: 7px;
  font-weight: 800;
}

.turn-star {
  position: absolute;
  top: -7px;
  right: -7px;
  color: #e9bd56;
  font-size: 10px;
}

.penalty-track {
  display: flex;
  gap: 2px;
}

.penalty-track span {
  color: rgb(246 242 226 / 35%);
  font:
    700 7px Georgia,
    serif;
}

.penalty-track span.earned {
  color: #f2bb6c;
}

.direction-line {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  border-bottom: 1px solid var(--line);
  color: var(--muted);
  font-size: 10px;
}

.direction-line span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.direction-line b {
  color: var(--ink);
}

.direction-arrow {
  color: var(--red);
  font-size: 16px;
}

.direction-dot {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
}

.receiving {
  background: #7d9c69;
}
.sending {
  background: var(--red);
}

.hand-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 10px;
  padding: 18px 1px 12px;
}

.hand-heading > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.hand-heading b {
  color: var(--muted);
  font-size: 9px;
}

.your-turn-label,
.wait-turn-label {
  color: var(--green);
  font-size: 11px;
  font-weight: 800;
}

.wait-turn-label {
  color: var(--muted);
}

.hand {
  display: flex;
  justify-content: center;
  gap: clamp(5px, 2vw, 14px);
  padding: 6px 0 12px;
}

.hand.disabled {
  opacity: 0.75;
}

.playing-card {
  flex: 1;
  max-width: 112px;
  aspect-ratio: 0.68;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 7px;
  border: 1px solid #dfe3d9;
  border-radius: 12px;
  background: #fffdf5;
  color: var(--ink);
  box-shadow:
    0 4px 0 #dfe3d9,
    0 9px 18px rgb(39 53 43 / 8%);
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    border-color 0.2s;
}

.playing-card:disabled {
  cursor: default;
}

.playing-card:not(:disabled):hover {
  transform: translateY(-5px);
}

.playing-card.selected {
  transform: translateY(-12px);
  border-color: var(--red);
  box-shadow:
    0 4px 0 var(--red),
    0 12px 20px rgb(87 47 33 / 15%);
}

.card-corner {
  position: absolute;
  top: 9px;
  left: 10px;
  color: var(--red);
  font:
    700 13px Georgia,
    serif;
}

.card-face {
  color: var(--green);
  font:
    700 clamp(28px, 8vw, 46px)/1 Georgia,
    serif;
}

.card-caption {
  position: absolute;
  bottom: 9px;
  color: #929d91;
  font-size: 7px;
  font-weight: 900;
  letter-spacing: 1px;
}

.confirm-button {
  margin-top: 10px;
}

/* Resultado, histórico e detalhes */

.result-screen {
  max-width: 600px;
  text-align: center;
}

.result-stamp {
  width: 70px;
  height: 70px;
  display: grid;
  place-items: center;
  margin: 0 auto 22px;
  border: 1px solid #e7d59c;
  border-radius: 22px;
  background: #fbf3dc;
  color: #a88124;
  font-size: 29px;
}

.result-screen h1 {
  font-size: clamp(46px, 10vw, 74px);
}

.result-screen .lead {
  margin: 0 auto 27px;
}

.result-score {
  display: grid;
  grid-template-columns: 0.7fr 1fr 1.2fr;
  gap: 0;
  padding: 19px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  text-align: left;
}

.result-score div {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 10px;
  border-right: 1px solid var(--line);
}

.result-score div:last-child {
  border: 0;
}

.result-score span,
.detail-block span {
  color: var(--muted);
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.6px;
}

.result-score b {
  color: var(--ink);
  font-size: 11px;
  overflow-wrap: anywhere;
}

.result-players {
  margin: 23px 0;
  text-align: left;
}

.result-player {
  min-height: 45px;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--line);
}

.result-player > span {
  color: var(--red);
  font:
    700 12px Georgia,
    serif;
}

.result-player b {
  font-size: 12px;
  overflow-wrap: anywhere;
}

.result-player small {
  color: var(--muted);
  font-size: 8px;
  font-weight: 900;
}

.full-text-button {
  width: 100%;
  justify-content: center;
}

.history-heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
}

.history-heading h1 {
  margin-bottom: 25px;
}

.delete-all {
  margin-top: 25px;
  color: var(--red);
}

.history-list {
  display: grid;
  gap: 10px;
  border: 0;
}

.history-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 14px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
}

.history-open {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 13px 0;
  border: 0;
  background: transparent;
  color: var(--ink);
  text-align: left;
}

.history-date {
  color: var(--muted);
  font-size: 9px;
  font-weight: 800;
}

.history-open b {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}

.history-open small {
  color: var(--muted);
  font-size: 10px;
}

.history-result {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--green);
  font-size: 10px;
  font-weight: 800;
}

.history-result ion-icon {
  font-size: 14px;
}

.delete-entry {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border: 0;
  border-radius: 12px;
  background: #fff0eb;
  color: var(--red);
  font-size: 17px;
}

.history-empty {
  margin: 10px 0;
}

.history-home {
  margin-top: 12px;
}

.detail-block {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 12px;
  padding: 18px 15px;
  margin-bottom: 12px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
}

.detail-block b {
  color: var(--ink);
  font-size: 11px;
  overflow-wrap: anywhere;
}

.details-screen .result-players {
  margin-top: 15px;
}

/* Responsividade */

@media (min-width: 760px) {
  .app-shell {
    padding-right: 42px;
    padding-left: 42px;
  }

  .game-screen {
    padding-top: 30px;
  }

  .table-felt {
    min-height: 400px;
    border-radius: 210px;
  }

  .seat-0 {
    top: 19px;
  }
  .seat-3 {
    bottom: 19px;
  }
}

@media (max-width: 600px) {
  .app-shell {
    padding-right: 18px;
    padding-left: 18px;
  }

  .topbar {
    height: 58px;
  }

  .home-screen {
    padding-top: 35px;
  }

  .hero-layout {
    grid-template-columns: 1fr;
    min-height: initial;
    position: relative;
    gap: 0;
  }

  .hero-copy {
    padding: 25px 0 20px;
  }

  .hero-copy h1 {
    font-size: clamp(46px, 12vw, 65px);
  }

  .hero-copy p {
    max-width: 255px;
    font-size: 13px;
  }

  .card-art {
    position: relative;
    height: 230px;
    margin: 4px 0 24px;
    border-radius: 24px;
  }

  .art-card {
    width: 118px;
    height: 170px;
  }

  .art-card-back span {
    font-size: 55px;
  }

  .art-card-middle span {
    font-size: 48px;
  }

  .art-card-front span {
    font-size: 44px;
  }

  .home-footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 14px 0;
  }

  .home-footer > span {
    font-size: 9px;
    line-height: 1.5;
  }

  .home-footer .text-button {
    grid-column: 1 / -1;
    justify-content: flex-start;
    margin: 0;
  }

  .home-note {
    margin-top: auto;
  }

  .form-screen,
  .choose-screen,
  .search-screen,
  .lobby-screen,
  .history-screen,
  .details-screen,
  .result-screen {
    padding-top: 36px;
  }

  .table-felt {
    min-height: 310px;
    border-radius: 160px;
  }

  .table-ring {
    inset: 35px 8%;
  }

  .seat-1 {
    right: 2%;
  }
  .seat-2 {
    right: 7%;
  }
  .seat-4 {
    left: 7%;
  }
  .seat-5 {
    left: 2%;
  }

  .direction-line {
    gap: 7px;
    font-size: 8px;
  }

  .direction-line span {
    gap: 4px;
  }

  .result-score {
    grid-template-columns: 0.8fr 1fr 1.1fr;
  }

  .result-score div {
    padding: 0 6px;
  }

  .result-score span {
    font-size: 7px;
  }

  .result-score b {
    font-size: 9px;
  }
}

@media (max-width: 375px) {
  .app-shell {
    padding-right: 13px;
    padding-left: 13px;
  }

  .brand-lockup {
    gap: 8px;
    font-size: 13px;
  }

  .offline-badge {
    padding: 8px 9px;
    font-size: 9px;
  }

  .card-art {
    height: 205px;
  }

  .art-card {
    width: 105px;
    height: 153px;
  }

  .table-felt {
    min-height: 285px;
  }

  .seat {
    min-width: 51px;
  }

  .seat-avatar {
    width: 27px;
    height: 27px;
  }

  .seat-1 {
    right: 0;
  }
  .seat-2 {
    right: 3%;
  }
  .seat-4 {
    left: 3%;
  }
  .seat-5 {
    left: 0;
  }

  .player-connection {
    font-size: 8px;
  }

  .result-player {
    grid-template-columns: 26px minmax(0, 1fr) auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
