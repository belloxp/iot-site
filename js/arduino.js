/* ============================================================
   ARDUINO.JS
   Monta a seção "Exemplos de Programação" da página arduino.html.

   Os exemplos não são digitados na página: eles são lidos do
   array SENSORES (js/dados-sensores.js), de modo que cada sensor
   cadastrado no catálogo ganha automaticamente o seu sketch aqui.

   1. Cria um chip seletor para cada sensor
   2. Renderiza o exemplo escolhido (descrição, ligação e código)
   3. Ativa o botão de copiar o código
   ============================================================ */

const seletorExemplo = document.getElementById("seletorExemplo");
const areaExemplo = document.getElementById("exemploArduino");
const totalExemplos = document.getElementById("totalExemplos");

/**
 * Renderiza o exemplo de programação do sensor recebido.
 */
function mostrarExemplo(sensor) {
  if (!areaExemplo) return;

  areaExemplo.innerHTML = `
    <div class="exemplo-cabecalho">
      <p class="kicker">${sensor.nome} — ${sensor.categoria} · sinal ${sensor.sinal}</p>
      <h3>${sensor.exemplo.titulo}</h3>
      <p>${sensor.exemplo.descricao}</p>
    </div>

    <div class="caixa-ligacao">
      <h3>Ligação ao Arduino</h3>
      <ul>${sensor.exemplo.ligacao.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>

    ${montarBlocoCodigo(sensor.exemplo.codigo, `${sensor.id}.ino`)}

    <a href="sensor.html?id=${sensor.id}" class="botao botao-vazado">
      Ver ficha técnica do ${sensor.nome} →
    </a>
  `;

  // O bloco de código foi recriado, então o botão precisa ser reativado
  ativarBotoesCopiar(areaExemplo);
}

/**
 * Cria um chip para cada sensor do catálogo e trata o clique.
 */
function montarSeletorExemplos() {
  if (!seletorExemplo) return;

  seletorExemplo.innerHTML = SENSORES.map(
    (sensor, indice) => `
      <button class="chip${indice === 0 ? " ativo" : ""}" data-id="${sensor.id}">
        ${sensor.nome}
      </button>
    `
  ).join("");

  // Delegação de evento: um listener atende a todos os chips
  seletorExemplo.addEventListener("click", (evento) => {
    const chip = evento.target.closest(".chip");
    if (!chip) return;

    // Move o destaque para o chip clicado
    seletorExemplo.querySelectorAll(".chip").forEach((c) => c.classList.remove("ativo"));
    chip.classList.add("ativo");

    const escolhido = SENSORES.find((s) => s.id === chip.dataset.id);
    if (escolhido) mostrarExemplo(escolhido);
  });
}

/* ---------- Inicialização ---------- */
if (seletorExemplo && areaExemplo) {
  montarSeletorExemplos();

  // Exibe o primeiro exemplo do catálogo assim que a página carrega
  mostrarExemplo(SENSORES[0]);

  // Informa quantos exemplos estão disponíveis (o projeto exige no mínimo 10)
  if (totalExemplos) {
    totalExemplos.textContent = SENSORES.length;
  }
}
