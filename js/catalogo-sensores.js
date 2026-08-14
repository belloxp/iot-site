/* ============================================================
   CATALOGO-SENSORES.JS
   Renderiza a grade de cards dos sensores (usada na página
   sensores.html e na prévia da página inicial) a partir do
   array SENSORES definido em js/dados-sensores.js.

   Recursos de interação com o usuário:
   1. Busca textual em tempo real (nome, categoria, aplicações...)
   2. Filtro por categoria através de chips clicáveis
   3. Contador de resultados e mensagem de "nada encontrado"
   ============================================================ */

const gradeSensores = document.getElementById("gradeSensores");
const buscaSensor = document.getElementById("buscaSensor");
const filtrosCategoria = document.getElementById("filtrosCategoria");
const contagemSensores = document.getElementById("contagemSensores");
const semSensores = document.getElementById("semSensores");

// Categoria selecionada no momento ("todas" exibe o catálogo completo)
let categoriaAtiva = "todas";

/**
 * Monta o HTML de um card de sensor.
 * O card leva para a ficha técnica: sensor.html?id=<id-do-sensor>
 */
function criarCardSensor(sensor) {
  // Índice sempre relativo ao catálogo completo, mesmo com filtro ativo
  const indice = String(SENSORES.indexOf(sensor) + 1).padStart(2, "0");

  return `
    <a href="sensor.html?id=${sensor.id}" class="card-robo">
      <span class="card-robo-indice">${indice}</span>
      <div class="card-robo-imagem imagem-sensor">
        <img src="${sensor.imagem}" alt="Imagem do sensor ${sensor.nome}" loading="lazy" />
      </div>
      <div class="card-robo-corpo">
        <div class="card-meta">
          <span class="card-robo-tag">${sensor.categoria}</span>
          <span class="selo-sinal">${sensor.sinal}</span>
        </div>
        <h3>${sensor.nome}</h3>
        <p>${sensor.resumo}</p>
        <span class="card-robo-link">Ver ficha técnica →</span>
      </div>
    </a>
  `;
}

/**
 * Renderiza a lista recebida na grade e atualiza os avisos de tela.
 */
function renderizarSensores(lista) {
  if (!gradeSensores) return;

  gradeSensores.innerHTML = lista.map(criarCardSensor).join("");

  // Contador de resultados (ex.: "07 de 25 sensores")
  if (contagemSensores) {
    contagemSensores.innerHTML =
      `exibindo <strong>${String(lista.length).padStart(2, "0")}</strong> ` +
      `de ${SENSORES.length} sensores`;
  }

  // Mensagem exibida apenas quando nenhum sensor atende aos filtros
  if (semSensores) {
    semSensores.hidden = lista.length > 0;
  }
}

/**
 * Aplica, ao mesmo tempo, o filtro de categoria e o termo de busca.
 * A pesquisa considera nome, categoria, sinal, resumo e aplicações.
 */
function aplicarFiltros() {
  const termo = buscaSensor ? buscaSensor.value.trim().toLowerCase() : "";

  const filtrados = SENSORES.filter((sensor) => {
    // 1º critério: categoria selecionada nos chips
    const passouCategoria =
      categoriaAtiva === "todas" || sensor.categoria === categoriaAtiva;
    if (!passouCategoria) return false;

    // 2º critério: texto digitado na busca (vazio = aceita todos)
    if (!termo) return true;

    // Junta os campos pesquisáveis em uma única string
    const conteudo = [
      sensor.nome,
      sensor.categoria,
      sensor.sinal,
      sensor.resumo,
      sensor.tipoSinal,
      sensor.aplicacoes.join(" "),
      sensor.fabricantes.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return conteudo.includes(termo);
  });

  renderizarSensores(filtrados);
}

/**
 * Cria os chips de filtro a partir das categorias existentes na base.
 * O objeto Set elimina automaticamente as categorias repetidas.
 */
function montarFiltrosCategoria() {
  if (!filtrosCategoria) return;

  const categorias = ["todas", ...new Set(SENSORES.map((s) => s.categoria))];

  filtrosCategoria.innerHTML = categorias
    .map((categoria) => {
      const ativo = categoria === "todas" ? " ativo" : "";
      return `<button class="chip${ativo}" data-categoria="${categoria}">${categoria}</button>`;
    })
    .join("");

  // Um único listener no contêiner atende a todos os chips (delegação de evento)
  filtrosCategoria.addEventListener("click", (evento) => {
    const chip = evento.target.closest(".chip");
    if (!chip) return;

    // Move o destaque para o chip clicado
    filtrosCategoria.querySelectorAll(".chip").forEach((c) => c.classList.remove("ativo"));
    chip.classList.add("ativo");

    categoriaAtiva = chip.dataset.categoria;
    aplicarFiltros();
  });
}

/* ---------- Inicialização ---------- */
if (gradeSensores) {
  montarFiltrosCategoria();
  renderizarSensores(SENSORES);

  // Busca em tempo real: refiltra a cada tecla digitada
  if (buscaSensor) {
    buscaSensor.addEventListener("input", aplicarFiltros);
  }
}
