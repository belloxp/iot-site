/* ============================================================
   DESAFIOS.JS
   Comportamento da página de desafios práticos (desafios.html):
   1. Insere os códigos (js/dados-desafios.js) nos blocos marcados
      com data-codigo, já com realce de sintaxe e botão copiar
   2. Abas "Arduino Uno" / "ESP32 · ESP8266" de cada desafio
   3. Apenas um vídeo toca por vez
   ============================================================ */

/* ---------- 1. CÓDIGOS DOS DESAFIOS ---------- */
document.querySelectorAll("[data-codigo]").forEach((alvo) => {
  const item = DESAFIOS_CODIGO[alvo.dataset.codigo];
  if (!item) return;
  // montarBlocoCodigo() e ativarBotoesCopiar() vêm do js/codigo.js
  alvo.innerHTML = montarBlocoCodigo(item.codigo, item.arquivo);
  ativarBotoesCopiar(alvo);
});

/* ---------- 2. ABAS DE CADA DESAFIO ---------- */
// Cada .abas é independente: clicar em uma aba só afeta o próprio desafio
document.querySelectorAll(".abas").forEach((abas) => {
  const botoes = abas.querySelectorAll(".aba-botao");
  const paineis = abas.querySelectorAll(".aba-painel");

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      botoes.forEach((b) => {
        b.classList.toggle("ativo", b === botao);
        b.setAttribute("aria-selected", b === botao);
      });
      paineis.forEach((painel) => {
        painel.classList.toggle("ativo", painel.dataset.painel === botao.dataset.aba);
      });
    });
  });
});

/* ---------- 3. UM VÍDEO POR VEZ ---------- */
const videos = document.querySelectorAll(".card-video video");
videos.forEach((video) => {
  video.addEventListener("play", () => {
    videos.forEach((outro) => {
      if (outro !== video) outro.pause();
    });
  });
});
