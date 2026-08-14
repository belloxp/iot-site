/* ============================================================
   CODIGO.JS
   Funções compartilhadas para exibir os exemplos de programação
   em Arduino (linguagem C/C++) nas páginas do site:

   1. escaparHTML()      — impede que o código seja interpretado
                           como marcação pelo navegador
   2. realcarCodigo()    — realce de sintaxe simples (comentários,
                           textos, diretivas, palavras-chave...)
   3. montarBlocoCodigo()— monta o bloco visual com botão copiar
   4. ativarBotoesCopiar() — copia o código para a área de
                           transferência do usuário
   ============================================================ */

/**
 * Converte os caracteres especiais em entidades HTML.
 * Precisa ser feito ANTES do realce, senão trechos como
 * "#include <DHT.h>" seriam interpretados como uma tag.
 */
function escaparHTML(texto) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Palavras-chave da linguagem e constantes próprias do Arduino
const PALAVRAS_CHAVE = [
  "void", "int", "float", "double", "bool", "boolean", "byte", "char", "long",
  "short", "unsigned", "signed", "const", "static", "volatile", "struct",
  "if", "else", "for", "while", "do", "switch", "case", "default", "break",
  "continue", "return", "true", "false", "HIGH", "LOW", "INPUT", "OUTPUT",
  "INPUT_PULLUP", "RISING", "FALLING", "CHANGE", "setup", "loop"
];

/**
 * Aplica um realce de sintaxe simples usando uma única passagem
 * de expressão regular. A ordem das alternativas é importante:
 * o que vier primeiro tem prioridade (um comentário com aspas,
 * por exemplo, deve ser tratado como comentário).
 */
function realcarCodigo(codigo) {
  const seguro = escaparHTML(codigo);

  const padrao = new RegExp(
    [
      "(\\/\\/[^\\n]*)",                       // 1: comentário de linha
      "(\"[^\"\\n]*\")",                       // 2: texto entre aspas
      "(#\\w+)",                               // 3: diretiva de pré-processador
      "\\b(" + PALAVRAS_CHAVE.join("|") + ")\\b", // 4: palavras-chave
      "\\b(\\d+\\.?\\d*)\\b",                  // 5: números
      "\\b([A-Za-z_]\\w*)(?=\\s*\\()"          // 6: chamadas de função
    ].join("|"),
    "g"
  );

  return seguro.replace(
    padrao,
    (trecho, comentario, texto, diretiva, chave, numero, funcao) => {
      if (comentario) return `<span class="cod-comentario">${comentario}</span>`;
      if (texto)      return `<span class="cod-texto">${texto}</span>`;
      if (diretiva)   return `<span class="cod-diretiva">${diretiva}</span>`;
      if (chave)      return `<span class="cod-chave">${chave}</span>`;
      if (numero)     return `<span class="cod-numero">${numero}</span>`;
      if (funcao)     return `<span class="cod-funcao">${funcao}</span>`;
      return trecho;
    }
  );
}

/**
 * Monta o bloco completo do código: cabeçalho com o nome do
 * arquivo, botão de copiar e o código já realçado.
 */
function montarBlocoCodigo(codigo, titulo) {
  const rotulo = titulo || "sketch.ino";

  return `
    <div class="bloco-codigo">
      <div class="codigo-cabecalho">
        <span class="codigo-titulo">${rotulo}</span>
        <button class="botao-copiar" type="button">copiar</button>
      </div>
      <pre><code>${realcarCodigo(codigo)}</code></pre>
    </div>
  `;
}

/**
 * Ativa os botões "copiar" existentes dentro de um contêiner.
 * Usa a API de área de transferência do navegador e, em caso de
 * falha (ou navegador antigo), recorre ao método com textarea.
 */
function ativarBotoesCopiar(container) {
  const escopo = container || document;

  escopo.querySelectorAll(".botao-copiar").forEach((botao) => {
    botao.addEventListener("click", () => {
      // Recupera o código a partir do <pre>, preservando quebras de linha
      const bloco = botao.closest(".bloco-codigo");
      const codigo = bloco.querySelector("code").innerText;

      const confirmar = () => {
        botao.textContent = "copiado!";
        botao.classList.add("copiado");
        // Volta ao estado original depois de 2 segundos
        setTimeout(() => {
          botao.textContent = "copiar";
          botao.classList.remove("copiado");
        }, 2000);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(codigo).then(confirmar);
      } else {
        // Alternativa para navegadores sem suporte à API moderna
        const area = document.createElement("textarea");
        area.value = codigo;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
        confirmar();
      }
    });
  });
}

/* ------------------------------------------------------------
   Realce automático dos códigos escritos direto no HTML.
   Basta marcar o elemento com <code class="codigo-arduino">.
   ------------------------------------------------------------ */
document.querySelectorAll("code.codigo-arduino").forEach((elemento) => {
  // textContent devolve o código já sem as entidades HTML do arquivo
  elemento.innerHTML = realcarCodigo(elemento.textContent.trim());
});

// Ativa os botões de copiar que já existem na página ao carregar
ativarBotoesCopiar(document);
