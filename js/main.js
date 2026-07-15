/* ============================================================
   MAIN.JS
   Comportamentos gerais do site, presentes em todas as páginas:
   1. Menu hambúrguer responsivo (mobile)
   2. Animação de revelação ao rolar a página (IntersectionObserver)
   3. Contadores animados da página inicial
   4. Ano atual no rodapé
   ============================================================ */

/* ---------- 1. MENU RESPONSIVO (hambúrguer) ---------- */
const navToggle = document.getElementById("navToggle");
const navLista = document.getElementById("navLista");

if (navToggle && navLista) {
  // Abre/fecha o menu ao clicar no botão hambúrguer
  navToggle.addEventListener("click", () => {
    const aberto = navLista.classList.toggle("aberto");
    navToggle.classList.toggle("ativo", aberto);
    // Atualiza o atributo de acessibilidade
    navToggle.setAttribute("aria-expanded", aberto);
  });

  // Fecha o menu automaticamente ao clicar em qualquer link (melhora a UX no mobile)
  navLista.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLista.classList.remove("aberto");
      navToggle.classList.remove("ativo");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- 2. REVELAÇÃO AO ROLAR ---------- */
// Observa os elementos com a classe .revelar e adiciona .visivel
// quando eles entram na área visível da tela (efeito fade-in + slide-up)
const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target); // anima apenas uma vez
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".revelar").forEach((el) => observador.observe(el));

/* ---------- 3. CONTADORES ANIMADOS ---------- */
// Anima os números do hero (0 até o valor definido em data-alvo)
function animarContador(elemento) {
  const alvo = Number(elemento.dataset.alvo);
  const duracao = 1200; // duração total da animação em ms
  const inicio = performance.now();

  function passo(agora) {
    const progresso = Math.min((agora - inicio) / duracao, 1);
    // Zero à esquerda (07, 21, 04) para o estilo de contador mecânico
    elemento.textContent = String(Math.floor(progresso * alvo)).padStart(2, "0");
    if (progresso < 1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
}

// Os contadores só começam quando ficam visíveis na tela
const observadorContador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        animarContador(entrada.target);
        observadorContador.unobserve(entrada.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".contador").forEach((el) => observadorContador.observe(el));

/* ---------- 4. ANO ATUAL NO RODAPÉ ---------- */
const anoAtual = document.getElementById("anoAtual");
if (anoAtual) {
  anoAtual.textContent = new Date().getFullYear();
}
