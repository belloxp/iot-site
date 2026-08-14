/* ============================================================
   SENSOR.JS
   Monta a ficha técnica de um sensor (sensor.html) de forma
   dinâmica, seguindo os 10 itens exigidos no projeto.

   1. Lê o parâmetro "id" da URL (ex.: sensor.html?id=dht11)
   2. Localiza o sensor no array SENSORES
   3. Injeta a ficha completa no <main>
   4. Ativa as abas e o botão de copiar o código
   ============================================================ */

const conteudoSensor = document.getElementById("conteudoSensor");

// 1. Lê o id do sensor a partir da query string da URL
const parametrosSensor = new URLSearchParams(window.location.search);
const idSensor = parametrosSensor.get("id");

// 2. Procura o sensor na base de dados
const sensor = SENSORES.find((s) => s.id === idSensor);

/**
 * Transforma um array de textos em itens de lista <li>.
 */
function montarItens(itens) {
  return itens.map((item) => `<li>${item}</li>`).join("");
}

/**
 * Monta a ficha de dados rápidos exibida ao lado da imagem.
 * A primeira especificação (normalmente a tensão de operação) é
 * dividida no caractere ":" para virar rótulo + valor.
 */
function montarFichaRapida(s) {
  const principal = s.especificacoes[0].split(":");
  const rotulo = principal.length > 1 ? principal[0] : "Especificação";
  const valor = principal.length > 1 ? principal.slice(1).join(":") : principal[0];

  return `
    <dl class="ficha-rapida">
      <div><dt>Categoria</dt><dd>${s.categoria}</dd></div>
      <div><dt>Tipo de sinal</dt><dd>${s.sinal}</dd></div>
      <div><dt>${rotulo}</dt><dd>${valor.trim()}</dd></div>
    </dl>
  `;
}

/**
 * Navegação circular entre as fichas (sensor anterior / próximo).
 */
function montarNavegacaoEntreSensores(s) {
  const indice = SENSORES.indexOf(s);
  // O operador % faz a lista "dar a volta": do último retorna ao primeiro
  const anterior = SENSORES[(indice - 1 + SENSORES.length) % SENSORES.length];
  const proximo = SENSORES[(indice + 1) % SENSORES.length];

  return `
    <div class="robo-navegacao">
      <a href="sensor.html?id=${anterior.id}" class="botao botao-vazado">← ${anterior.nome}</a>
      <a href="sensores.html" class="botao botao-vazado">Todos os sensores</a>
      <a href="sensor.html?id=${proximo.id}" class="botao botao-vazado">${proximo.nome} →</a>
    </div>
  `;
}

// 3. Renderiza a ficha (ou uma mensagem de erro, se o id for inválido)
if (!sensor) {
  conteudoSensor.innerHTML = `
    <section class="secao">
      <div class="container centro">
        <h1 class="secao-titulo">Sensor não encontrado</h1>
        <p class="secao-subtitulo">O sensor solicitado não existe no catálogo.</p>
        <a href="sensores.html" class="botao">Voltar ao catálogo</a>
      </div>
    </section>
  `;
} else {
  // Atualiza o título da aba do navegador com o nome do sensor
  document.title = `${sensor.nome} — SensorHub 4.0`;

  conteudoSensor.innerHTML = `
    <section class="secao">
      <div class="container">

        <!-- Trilha de navegação (breadcrumb) -->
        <nav class="breadcrumb">
          <a href="index.html">Início</a> /
          <a href="sensores.html">Sensores</a> /
          <span>${sensor.nome}</span>
        </nav>

        <!-- Cabeçalho da ficha: imagem ilustrativa + apresentação -->
        <div class="robo-hero">
          <div class="robo-hero-imagem sensor-hero-imagem">
            <img src="${sensor.imagem}" alt="Imagem ilustrativa do sensor ${sensor.nome}" />
          </div>
          <div class="robo-hero-texto">
            <span class="card-robo-tag">${sensor.categoria}</span>
            <h1>${sensor.nome}</h1>
            <p>${sensor.resumo}</p>
            ${montarFichaRapida(sensor)}
          </div>
        </div>

        <!-- Abas da ficha técnica (controladas por JavaScript) -->
        <div class="abas" id="abasSensor">
          <div class="abas-botoes" role="tablist">
            <button class="aba-botao ativo" data-aba="conceito" role="tab">Conceito</button>
            <button class="aba-botao" data-aba="funcionamento" role="tab">Funcionamento</button>
            <button class="aba-botao" data-aba="especificacoes" role="tab">Especificações</button>
            <button class="aba-botao" data-aba="sinal" role="tab">Tipo de sinal</button>
            <button class="aba-botao" data-aba="aplicacoes" role="tab">Aplicações</button>
            <button class="aba-botao" data-aba="exemplo" role="tab">Exemplo com Arduino</button>
            <button class="aba-botao" data-aba="fabricantes" role="tab">Fabricantes</button>
          </div>

          <div class="aba-painel ativo" id="aba-conceito" role="tabpanel">
            <h2>Conceito</h2>
            <p>${sensor.conceito}</p>
          </div>

          <div class="aba-painel" id="aba-funcionamento" role="tabpanel">
            <h2>Princípio de funcionamento</h2>
            <p>${sensor.funcionamento}</p>
          </div>

          <div class="aba-painel" id="aba-especificacoes" role="tabpanel">
            <h2>Principais especificações técnicas</h2>
            <ul class="lista-marcada">${montarItens(sensor.especificacoes)}</ul>
          </div>

          <div class="aba-painel" id="aba-sinal" role="tabpanel">
            <h2>Tipo de sinal e comunicação de dados</h2>
            <p>${sensor.tipoSinal}</p>
          </div>

          <div class="aba-painel" id="aba-aplicacoes" role="tabpanel">
            <h2>Principais aplicações industriais e IoT</h2>
            <ul class="lista-marcada">${montarItens(sensor.aplicacoes)}</ul>
          </div>

          <div class="aba-painel" id="aba-exemplo" role="tabpanel">
            <h2>Exemplo de utilização em um projeto</h2>
            <div class="exemplo-cabecalho">
              <h3>${sensor.exemplo.titulo}</h3>
              <p>${sensor.exemplo.descricao}</p>
            </div>

            <div class="caixa-ligacao">
              <h3>Ligação ao Arduino</h3>
              <ul>${montarItens(sensor.exemplo.ligacao)}</ul>
            </div>

            ${montarBlocoCodigo(sensor.exemplo.codigo, `${sensor.id}.ino`)}
          </div>

          <div class="aba-painel" id="aba-fabricantes" role="tabpanel">
            <h2>Fabricantes e modelos comerciais</h2>
            <ul class="lista-marcada">${montarItens(sensor.fabricantes)}</ul>
          </div>
        </div>

        ${montarNavegacaoEntreSensores(sensor)}
      </div>
    </section>
  `;

  // 4a. Comportamento das abas: exibe apenas o painel da aba clicada
  const botoesAba = conteudoSensor.querySelectorAll(".aba-botao");
  const paineis = conteudoSensor.querySelectorAll(".aba-painel");

  botoesAba.forEach((botao) => {
    botao.addEventListener("click", () => {
      // Remove o destaque de todas as abas e esconde todos os painéis
      botoesAba.forEach((b) => b.classList.remove("ativo"));
      paineis.forEach((p) => p.classList.remove("ativo"));

      // Ativa a aba clicada e o painel correspondente
      botao.classList.add("ativo");
      const painelAlvo = document.getElementById(`aba-${botao.dataset.aba}`);
      if (painelAlvo) painelAlvo.classList.add("ativo");
    });
  });

  // 4b. Habilita o botão de copiar o código do exemplo
  ativarBotoesCopiar(conteudoSensor);
}
