/* ============================================================
   ROBO.JS
   Monta a página de detalhe (robo.html) dinamicamente.
   1. Lê o parâmetro "id" da URL (ex.: robo.html?id=scara)
   2. Busca o robô correspondente no array ROBOS
   3. Injeta a ficha técnica completa no <main>
   4. Ativa o comportamento de abas (tabs) da ficha
   ============================================================ */

const conteudoRobo = document.getElementById("conteudoRobo");

// 1. Lê o id do robô a partir da query string da URL
const parametros = new URLSearchParams(window.location.search);
const idRobo = parametros.get("id");

// 2. Procura o robô na base de dados
const robo = ROBOS.find((r) => r.id === idRobo);

/**
 * Monta a lista <li> de um array de textos.
 */
function montarLista(itens) {
  return itens.map((item) => `<li>${item}</li>`).join("");
}

/**
 * Monta os cards dos modelos comerciais (3 fabricantes distintos).
 */
function montarModelos(modelos) {
  return modelos
    .map(
      (m) => `
      <article class="card-modelo">
        <h4>${m.nome}</h4>
        <p class="card-modelo-fabricante">${m.fabricante}</p>
        <p>${m.descricao}</p>
      </article>
    `
    )
    .join("");
}

/**
 * Links de navegação entre robôs (anterior / próximo),
 * calculados pela posição do robô atual no array.
 */
function montarNavegacaoEntreRobos() {
  const indice = ROBOS.indexOf(robo);
  // O operador % faz a navegação "circular": do último volta ao primeiro
  const anterior = ROBOS[(indice - 1 + ROBOS.length) % ROBOS.length];
  const proximo = ROBOS[(indice + 1) % ROBOS.length];

  return `
    <div class="robo-navegacao">
      <a href="robo.html?id=${anterior.id}" class="botao botao-vazado">← ${anterior.nome}</a>
      <a href="robos.html" class="botao botao-vazado">Todos os robôs</a>
      <a href="robo.html?id=${proximo.id}" class="botao botao-vazado">${proximo.nome} →</a>
    </div>
  `;
}

// 3. Renderiza a página (ou uma mensagem de erro se o id for inválido)
if (!robo) {
  conteudoRobo.innerHTML = `
    <section class="secao">
      <div class="container centro">
        <h1 class="secao-titulo">Robô não encontrado</h1>
        <p class="secao-subtitulo">O robô solicitado não existe no catálogo.</p>
        <a href="robos.html" class="botao">Voltar ao catálogo</a>
      </div>
    </section>
  `;
} else {
  // Atualiza o título da aba do navegador com o nome do robô
  document.title = `${robo.nome} — SensorHub 4.0`;

  conteudoRobo.innerHTML = `
    <section class="secao">
      <div class="container">

        <!-- Trilha de navegação (breadcrumb) -->
        <nav class="breadcrumb">
          <a href="index.html">Início</a> /
          <a href="robos.html">Catálogo</a> /
          <span>${robo.nome}</span>
        </nav>

        <!-- Cabeçalho da ficha: imagem + apresentação -->
        <div class="robo-hero">
          <div class="robo-hero-imagem">
            <img src="${robo.imagem}" alt="Ilustração do ${robo.nome}" />
          </div>
          <div class="robo-hero-texto">
            <span class="card-robo-tag">${robo.apelido}</span>
            <h1>${robo.nome}</h1>
            <p>${robo.resumo}</p>
          </div>
        </div>

        <!-- Abas da ficha técnica (controladas por JavaScript) -->
        <div class="abas" id="abas">
          <div class="abas-botoes" role="tablist">
            <button class="aba-botao ativo" data-aba="conceito" role="tab">Conceito</button>
            <button class="aba-botao" data-aba="funcionamento" role="tab">Funcionamento</button>
            <button class="aba-botao" data-aba="caracteristicas" role="tab">Características</button>
            <button class="aba-botao" data-aba="aplicacoes" role="tab">Aplicações</button>
            <button class="aba-botao" data-aba="iot" role="tab">Integração IoT</button>
          </div>

          <div class="aba-painel ativo" id="aba-conceito" role="tabpanel">
            <h2>Conceito</h2>
            <p>${robo.conceito}</p>
          </div>

          <div class="aba-painel" id="aba-funcionamento" role="tabpanel">
            <h2>Princípio de funcionamento</h2>
            <p>${robo.funcionamento}</p>
          </div>

          <div class="aba-painel" id="aba-caracteristicas" role="tabpanel">
            <h2>Principais características técnicas</h2>
            <ul class="lista-marcada">${montarLista(robo.caracteristicas)}</ul>
          </div>

          <div class="aba-painel" id="aba-aplicacoes" role="tabpanel">
            <h2>Aplicações industriais</h2>
            <ul class="lista-marcada">${montarLista(robo.aplicacoes)}</ul>
          </div>

          <div class="aba-painel" id="aba-iot" role="tabpanel">
            <h2>Integração com automação e IoT</h2>
            <p>${robo.iot}</p>
          </div>
        </div>

        <!-- Modelos comerciais de fabricantes distintos -->
        <h2 class="secao-titulo modelos-titulo">Modelos comerciais no mercado</h2>
        <div class="grade-modelos">
          ${montarModelos(robo.modelos)}
        </div>

        ${montarNavegacaoEntreRobos()}
      </div>
    </section>
  `;

  // 4. Comportamento das abas: mostra apenas o painel da aba clicada
  const botoesAba = conteudoRobo.querySelectorAll(".aba-botao");
  const paineis = conteudoRobo.querySelectorAll(".aba-painel");

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
}
