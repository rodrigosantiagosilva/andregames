<template>
  <ion-page class="tutorial-page">
    <ion-header class="tutorial-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            default-href="/"
            text=""
            :icon="arrowBackOutline"
          />
        </ion-buttons>

        <ion-title>Como jogar</ion-title>

        <ion-buttons slot="end">
          <ion-button aria-label="Início" @click="irParaInicio">
            <ion-icon :icon="homeOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="tutorial-content">
      <ion-grid fixed>
        <ion-row>
          <ion-col size="12" size-md="10" offset-md="1">

            <!-- Apresentação -->
            <ion-card class="tutorial-hero">
              <ion-card-content>
                <ion-badge class="hero-badge">
                  GUIA DO JOGADOR
                </ion-badge>

                <ion-text>
                  <h1>
                    Aprenda a jogar
                    <br />
                    sem cair no <em>BURRO.</em>
                  </h1>

                  <p>
                    Entenda as regras e prepare-se para a próxima rodada.
                    Você não precisa de internet para jogar localmente.
                  </p>
                </ion-text>

                <ion-button
                  expand="block"
                  class="hero-button"
                  @click="irParaJogo"
                >
                  Vamos jogar
                  <ion-icon slot="end" :icon="arrowForwardOutline" />
                </ion-button>
              </ion-card-content>
            </ion-card>

            <!-- Objetivo -->
            <ion-text>
              <h2 class="section-heading">O objetivo</h2>

              <p class="section-description">
                Reúna quatro cartas do mesmo valor. Preste atenção às cartas
                que recebe e passe uma delas ao próximo jogador.
              </p>
            </ion-text>

            <!-- Regras -->
            <ion-card class="rule-card">
              <ion-card-content>
<ion-list lines="none">

  <ion-item>
    <ion-avatar slot="start" class="step-avatar">
      <ion-icon :icon="peopleOutline" />
    </ion-avatar>

    <ion-label>
      <h3>1. Reúna os jogadores</h3>
      <p>
        Forme uma mesa com os participantes disponíveis.
        Na versão Bluetooth, todos precisam estar próximos
        para estabelecer a conexão.
      </p>
    </ion-label>
  </ion-item>

  <ion-item>
    <ion-avatar slot="start" class="step-avatar">
      <ion-icon :icon="albumsOutline" />
    </ion-avatar>

    <ion-label>
      <h3>2. Observe suas cartas</h3>
      <p>
        Confira as cartas da sua mão e procure valores iguais.
        Planeje suas jogadas para tentar formar uma quadra.
      </p>
    </ion-label>
  </ion-item>

  <ion-item>
    <ion-avatar slot="start" class="step-avatar">
      <ion-icon :icon="addCircleOutline" />
    </ion-avatar>

    <ion-label>
      <h3>3. Compre uma carta</h3>
      <p>
        Durante seu turno, utilize a opção de compra para
        receber uma nova carta do monte, quando essa ação
        estiver disponível.
      </p>
    </ion-label>
  </ion-item>

  <ion-item>
    <ion-avatar slot="start" class="step-avatar">
      <ion-icon :icon="trashOutline"/>
    </ion-avatar>

    <ion-label>
      <h3>4. Descarte uma carta</h3>
      <p>
        Depois de comprar, escolha uma carta da sua mão
        para descartar. Assim, você pode manter as cartas
        que mais ajudam a completar sua quadra.
      </p>
    </ion-label>
  </ion-item>

  <ion-item>
    <ion-avatar slot="start" class="step-avatar">
      <ion-icon :icon="trophyOutline" />
    </ion-avatar>

    <ion-label>
      <h3>5. Forme uma quadra</h3>
      <p>
        Seu objetivo continua sendo reunir quatro cartas
        do mesmo valor, como quatro ases ou quatro reis.
        Fique atento às penalidades dos outros jogadores.
      </p>
    </ion-label>
  </ion-item>

</ion-list>
              </ion-card-content>
            </ion-card>

            <!-- Penalidades -->
            <ion-card class="penalty-card">
              <ion-card-content>
                <ion-icon
                  class="penalty-icon"
                  :icon="alertCircleOutline"
                />

                <ion-text>
                  <h2>Cuidado com o BURRO</h2>

                  <p>
                    Evite ser o jogador penalizado quando alguém completar
                    a quadra. Conforme as penalidades se acumulam, as letras
                    de BURRO são preenchidas.
                  </p>
                </ion-text>

                <ion-grid class="letters-grid">
                  <ion-row>
                    <ion-col
                      v-for="(letter, index) in letters"
                      :key="`${letter}-${index}`"
                      size="auto"
                    >
                      <ion-chip
                        :class="{
                          'letter-active': index < demoPenalty
                        }"
                      >
                        <ion-label>{{ letter }}</ion-label>
                      </ion-chip>
                    </ion-col>
                  </ion-row>
                </ion-grid>

                <ion-text>
                  <p class="caption">
                    Exemplo visual das cinco letras de penalidade.
                  </p>
                </ion-text>
              </ion-card-content>
            </ion-card>

            <!-- Dica -->
            <ion-card class="tip-card">
              <ion-card-content>
                <ion-icon :icon="bulbOutline" />

                <ion-text>
                  <h3>Dica para começar</h3>

                  <p>
                    Observe quais valores aparecem na sua mão e escolha
                    cuidadosamente a carta que será passada. A estratégia
                    ajuda, mas fique atento à ordem dos turnos.
                  </p>
                </ion-text>
              </ion-card-content>
            </ion-card>

            <!-- Botão final -->
            <ion-button
              expand="block"
              class="bottom-button"
              @click="irParaJogo"
            >
              Entendi, quero jogar
              <ion-icon slot="end" :icon="arrowForwardOutline" />
            </ion-button>

            <!-- Rodapé -->
            <ion-text>
              <p class="footer-note">
                BURRO · Cartas entre amigos · Tutorial
              </p>
            </ion-text>

          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonBadge,
  IonText,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonChip,
} from '@ionic/vue';

import {
  alertCircleOutline,
  albumsOutline,
  addCircleOutline,
  arrowBackOutline,
  arrowForwardOutline,
  bulbOutline,
  homeOutline,
  peopleOutline,
  trashOutline,
  trophyOutline,
} from 'ionicons/icons';

const router = useRouter();

const letters = ['B', 'U', 'R', 'R', 'O'];
const demoPenalty = ref(3);

function irParaInicio(): void {
  void router.push('/home');
}

function irParaJogo(): void {
  void router.push('/home');
}
</script>

<style scoped>
/* ========================================
   TUTORIAL BURRO
   Fundo branco e textos laranja
======================================== */

.tutorial-page {
  --orange: #f97316;
  --orange-dark: #ea580c;
  --orange-light: #fff4eb;
  --orange-border: #fed7aa;
  --white: #ffffff;

  background: var(--white);
  color: var(--orange-dark);
}

/* Fundo geral */

.tutorial-content {
  --background: #ffffff;
  --color: #ea580c;
}

.tutorial-content::part(background) {
  background: #ffffff;
}

.tutorial-content::part(scroll) {
  padding-bottom: 24px;
}

/* Cabeçalho */

.tutorial-header ion-toolbar {
  --background: #ffffff;
  --color: #ea580c;
  --border-color: #fed7aa;

  border-bottom: 1px solid #fed7aa;
  padding: 4px 8px;
}

.tutorial-header ion-title {
  color: #ea580c;
  font-size: 1.05rem;
  font-weight: 800;
}

.tutorial-header ion-back-button,
.tutorial-header ion-button {
  --color: #f97316;
}

/* Espaçamento */

.tutorial-content ion-grid[fixed] {
  padding: 24px 16px;
}

.tutorial-content ion-col {
  min-width: 0;
}

/* Apresentação */

.tutorial-hero {
  margin: 0 0 32px;
  overflow: hidden;

  border: 1px solid #fed7aa;
  border-radius: 22px;

  background: #ffffff;
  box-shadow: 0 8px 28px rgba(234, 88, 12, 0.07);
}

.tutorial-hero ion-card-content {
  padding: 30px 24px;
}

.hero-badge {
  --background: #fff4eb;
  --color: #ea580c;

  padding: 8px 12px;
  margin-bottom: 16px;

  border: 1px solid #fed7aa;
  border-radius: 8px;

  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 1px;
}

.tutorial-hero h1 {
  margin: 14px 0 16px;

  color: #ea580c;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 850;
  line-height: 1.15;
  letter-spacing: -1px;
}

.tutorial-hero h1 em {
  color: #f97316;
  font-style: normal;
}

.tutorial-hero p {
  max-width: 540px;
  margin: 0 0 24px;

  color: #ea580c;
  font-size: 0.96rem;
  line-height: 1.8;
}

.hero-button {
  --background: #f97316;
  --background-hover: #ea580c;
  --background-activated: #ea580c;
  --color: #ffffff;
  --border-radius: 12px;

  max-width: 230px;
  margin-top: 8px;

  font-weight: 800;
  text-transform: none;
}

/* Objetivo */

.section-heading {
  margin: 0 0 10px;

  color: #ea580c;
  font-size: 1.65rem;
  font-weight: 850;
  letter-spacing: -0.5px;
}

.section-description {
  margin: 0 0 22px;

  color: #ea580c;
  font-size: 0.95rem;
  line-height: 1.8;
}

/* Cartões */

.rule-card,
.penalty-card,
.tip-card {
  margin: 0 0 22px;

  border: 1px solid #fed7aa;
  border-radius: 18px;

  background: #ffffff;
  box-shadow: 0 6px 24px rgba(234, 88, 12, 0.05);

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

/* Lista de regras */

.rule-card ion-card-content {
  padding: 10px 18px;
}

.rule-card ion-list {
  padding: 0;
  background: #ffffff;
}

.rule-card ion-item {
  --background: #ffffff;
  --color: #ea580c;
  --border-color: #ffead9;
  --padding-start: 0;
  --inner-padding-end: 0;
  --inner-border-width: 0 0 1px 0;

  margin: 0;
  padding: 12px 0;
}

.rule-card ion-item:last-child {
  --inner-border-width: 0;
}

.step-avatar {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 48px;
  height: 48px;
  min-width: 48px;

  margin-inline-end: 16px;

  border: 1px solid #fed7aa;
  border-radius: 14px;

  background: #fff4eb;
}

.step-avatar ion-icon {
  color: #f97316;
  font-size: 23px;
}

.rule-card ion-label h3 {
  margin: 0 0 7px;

  color: #ea580c;
  font-size: 1rem;
  font-weight: 800;
  white-space: normal;
}

.rule-card ion-label p {
  margin: 0;

  color: #ea580c;
  font-size: 0.89rem;
  line-height: 1.75;
  white-space: normal;
}

/* Penalidades */

.penalty-card {
  border-color: #fed7aa;
  background: #ffffff;
}

.penalty-card ion-card-content {
  padding: 24px;
}

.penalty-icon {
  margin-bottom: 12px;

  color: #f97316;
  font-size: 34px;
}

.penalty-card h2 {
  margin: 0 0 10px;

  color: #ea580c;
  font-size: 1.35rem;
  font-weight: 850;
}

.penalty-card ion-text p {
  margin: 0;

  color: #ea580c;
  font-size: 0.93rem;
  line-height: 1.8;
}

/* Letras BURRO */

.letters-grid {
  padding: 20px 0 8px;
}

.letters-grid ion-row {
  gap: 8px;
}

.letters-grid ion-col {
  padding: 0;
}

.letters-grid ion-chip {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 46px;
  margin: 0;

  border: 1px solid #fed7aa;
  border-radius: 12px;

  --background: #ffffff;
  --color: #ea580c;

  font-size: 1.1rem;
  font-weight: 850;
}

.letters-grid ion-chip.letter-active {
  --background: #f97316;
  --color: #ffffff;

  border-color: #f97316;
}

.penalty-card .caption {
  margin-top: 8px;

  color: #ea580c;
  font-size: 0.8rem;
}

/* Dica */

.tip-card ion-card-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;

  padding: 22px;
  background: #ffffff;
}

.tip-card ion-card-content > ion-icon {
  flex-shrink: 0;

  padding: 12px;
  border: 1px solid #fed7aa;
  border-radius: 14px;

  background: #fff4eb;
  color: #f97316;

  font-size: 24px;
}

.tip-card h3 {
  margin: 2px 0 8px;

  color: #ea580c;
  font-size: 1rem;
  font-weight: 800;
}

.tip-card p {
  margin: 0;

  color: #ea580c;
  font-size: 0.9rem;
  line-height: 1.8;
}

/* Botão final */

.bottom-button {
  --background: #f97316;
  --background-hover: #ea580c;
  --background-activated: #ea580c;
  --color: #ffffff;
  --border-radius: 14px;

  height: 54px;
  margin: 28px 0 18px;

  font-size: 0.98rem;
  font-weight: 800;
  text-transform: none;

  box-shadow: 0 6px 18px rgba(234, 88, 12, 0.14);
}

/* Rodapé */

.footer-note {
  margin: 10px 0 6px;
  padding-bottom: 12px;

  color: #ea580c;
  font-size: 0.78rem;
  text-align: center;
  letter-spacing: 0.4px;
}

/* Efeitos */

@media (hover: hover) {
  .rule-card:hover,
  .penalty-card:hover,
  .tip-card:hover {
    border-color: #f97316;
    box-shadow: 0 10px 28px rgba(234, 88, 12, 0.1);
  }
}

/* Tablets e computadores */

@media (min-width: 768px) {
  .tutorial-content ion-grid[fixed] {
    padding: 36px 24px 20px;
  }

  .tutorial-hero ion-card-content {
    padding: 42px 38px;
  }

  .rule-card ion-card-content {
    padding: 16px 26px;
  }

  .rule-card ion-item {
    padding: 15px 0;
  }

  .penalty-card ion-card-content {
    padding: 30px;
  }

  .tip-card ion-card-content {
    padding: 26px;
  }
}

/* Celulares pequenos */

@media (max-width: 380px) {
  .tutorial-content ion-grid[fixed] {
    padding: 16px 10px;
  }

  .tutorial-hero {
    border-radius: 18px;
  }

  .tutorial-hero ion-card-content {
    padding: 24px 18px;
  }

  .tutorial-hero h1 {
    font-size: 1.9rem;
  }

  .rule-card ion-card-content {
    padding: 8px 12px;
  }

  .step-avatar {
    width: 40px;
    height: 40px;
    min-width: 40px;
    margin-inline-end: 12px;
  }

  .rule-card ion-label h3 {
    font-size: 0.94rem;
  }

  .rule-card ion-label p,
  .tip-card p {
    font-size: 0.84rem;
  }

  .penalty-card ion-card-content,
  .tip-card ion-card-content {
    padding: 18px;
  }
}

/* Acessibilidade */

@media (prefers-reduced-motion: reduce) {
  .rule-card,
  .penalty-card,
  .tip-card {
    transition: none;
  }
}
</style>
