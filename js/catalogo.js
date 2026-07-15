/* ============================================================
   CATALOGO.JS
   Renderiza a grade de cards dos robôs (usada na página inicial
   e no catálogo) a partir do array ROBOS (js/dados-robos.js)
   e implementa a busca em tempo real na página do catálogo.
   ============================================================ */

const gradeRobos = document.getElementById("gradeRobos");
const campoBusca = document.getElementById("campoBusca");
const semResultados = document.getElementById("semResultados");

/**
 * Monta o HTML de um card de robô.
 * Cada card leva para a página de detalhe: robo.html?id=<id-do-robo>
 * O índice numerado (01–07) é calculado pela posição no array original.
 */
function criarCard(robo) {
  // Índice sempre relativo ao catálogo completo, mesmo com a busca ativa
  const indice = String(ROBOS.indexOf(robo) + 1).padStart(2, "0");
  return `
    <a href="robo.html?id=${robo.id}" class="card-robo">
      <span class="card-robo-indice">${indice}</span>
      <div class="card-robo-imagem">
        <img src="${robo.imagem}" alt="Ilustração do ${robo.nome}" loading="lazy" />
      </div>
      <div class="card-robo-corpo">
        <span class="card-robo-tag">${robo.apelido}</span>
        <h3>${robo.nome}</h3>
        <p>${robo.resumo}</p>
        <span class="card-robo-link">Ver ficha técnica →</span>
      </div>
    </a>
  `;
}

/**
 * Renderiza a lista de robôs na grade.
 * Recebe um array (pode ser o completo ou o filtrado pela busca).
 */
function renderizarGrade(lista) {
  if (!gradeRobos) return;
  gradeRobos.innerHTML = lista.map(criarCard).join("");

  // Exibe/oculta a mensagem de "nenhum resultado"
  if (semResultados) {
    semResultados.hidden = lista.length > 0;
  }
}

/**
 * Filtra os robôs conforme o texto digitado na busca.
 * A pesquisa considera nome, apelido, resumo, aplicações e características.
 */
function filtrarRobos(termo) {
  const texto = termo.trim().toLowerCase();
  if (!texto) return ROBOS; // busca vazia → mostra todos

  return ROBOS.filter((robo) => {
    // Junta todos os campos pesquisáveis em uma única string
    const conteudo = [
      robo.nome,
      robo.apelido,
      robo.resumo,
      robo.aplicacoes.join(" "),
      robo.caracteristicas.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return conteudo.includes(texto);
  });
}

// Renderização inicial com todos os robôs
renderizarGrade(ROBOS);

// Busca em tempo real: filtra a cada tecla digitada (apenas na página do catálogo)
if (campoBusca) {
  campoBusca.addEventListener("input", () => {
    renderizarGrade(filtrarRobos(campoBusca.value));
  });
}
