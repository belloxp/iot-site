const perguntas = [
  {
    categoria: 'Arduino',
    pergunta: 'Qual função do Arduino é executada uma vez ao iniciar o programa?',
    respostas: [
      { texto: 'loop()', correta: false },
      { texto: 'setup()', correta: true },
      { texto: 'start()', correta: false },
      { texto: 'run()', correta: false }
    ]
  },
  {
    categoria: 'Arduino',
    pergunta: 'Qual pino é normalmente usado para ler um sensor analógico no Arduino Uno?',
    respostas: [
      { texto: 'Pino digital 13', correta: false },
      { texto: 'Pino analógico A0', correta: true },
      { texto: 'Pino RX', correta: false },
      { texto: 'Pino 5V', correta: false }
    ]
  },
  {
    categoria: 'Multímetro',
    pergunta: 'Quando o multímetro está na escala de tensão CC, ele mede a diferença de potencial entre dois pontos em:',
    respostas: [
      { texto: 'Ohms', correta: false },
      { texto: 'Amperes', correta: false },
      { texto: 'Volts', correta: true },
      { texto: 'Watts', correta: false }
    ]
  },
  {
    categoria: 'ESP',
    pergunta: 'Qual placa é muito utilizada em projetos IoT por ter Wi‑Fi integrado e custo acessível?',
    respostas: [
      { texto: 'ESP32', correta: true },
      { texto: 'ATmega328P', correta: false },
      { texto: 'LM35', correta: false },
      { texto: 'L293D', correta: false }
    ]
  },
  {
    categoria: 'Codificação',
    pergunta: 'Em programação, qual estrutura repete blocos de código enquanto uma condição for verdadeira?',
    respostas: [
      { texto: 'if', correta: false },
      { texto: 'for', correta: false },
      { texto: 'while', correta: true },
      { texto: 'switch', correta: false }
    ]
  },
  {
    categoria: 'Codificação',
    pergunta: 'Qual operador lógico representa a condição “E” em C/C++?',
    respostas: [
      { texto: '||', correta: false },
      { texto: '&&', correta: true },
      { texto: '!=', correta: false },
      { texto: '=', correta: false }
    ]
  },
  {
    categoria: 'Codificação',
    pergunta: 'Qual é a finalidade da função map() no Arduino?',
    respostas: [
      { texto: 'Reiniciar a placa', correta: false },
      { texto: 'Transformar um valor de um intervalo em outro intervalo', correta: true },
      { texto: 'Salvar dados na memória EEPROM', correta: false },
      { texto: 'Acessar rede Wi‑Fi', correta: false }
    ]
  },
  {
    categoria: 'Robôs',
    pergunta: 'Qual componente é usado para controlar a direção de um motor DC em um robô?',
    respostas: [
      { texto: 'LDR', correta: false },
      { texto: 'Motor driver', correta: true },
      { texto: 'Termistor', correta: false },
      { texto: 'Buzzer', correta: false }
    ]
  },
  {
    categoria: 'Sensores',
    pergunta: 'Qual sensor detecta a presença de objetos sem contato, por meio de ondas ultrassônicas?',
    respostas: [
      { texto: 'Sensor ultrassônico', correta: true },
      { texto: 'Sensor de temperatura LM35', correta: false },
      { texto: 'Potenciômetro', correta: false },
      { texto: 'LED RGB', correta: false }
    ]
  },
  {
    categoria: 'Sensores',
    pergunta: 'Qual tipo de sensor varia sua resistência conforme a intensidade de luz?',
    respostas: [
      { texto: 'LDR', correta: true },
      { texto: 'PIR', correta: false },
      { texto: 'Rele', correta: false },
      { texto: 'Servo motor', correta: false }
    ]
  }
];

const STORAGE_KEY = 'sensorhub_quiz_ranking_v1';
const MAX_RANKING = 10;

const inicioQuiz = document.getElementById('inicioQuiz');
const quizCard = document.getElementById('quizCard');
const resultadoContainer = document.getElementById('resultadoContainer');
const formNomeUsuario = document.getElementById('formNomeUsuario');
const nomeParticipante = document.getElementById('nomeParticipante');
const indicadorPergunta = document.getElementById('indicadorPergunta');
const categoriaPergunta = document.getElementById('categoriaPergunta');
const textoPergunta = document.getElementById('textoPergunta');
const opcoesContainer = document.getElementById('opcoesContainer');
const proximoBtn = document.getElementById('proximoBtn');
const pontosAtuais = document.getElementById('pontosAtuais');
const resultadoTitulo = document.getElementById('resultadoTitulo');
const resultadoTexto = document.getElementById('resultadoTexto');
const resultadoPontos = document.getElementById('resultadoPontos');
const resultadoAcertos = document.getElementById('resultadoAcertos');
const resultadoPercentual = document.getElementById('resultadoPercentual');
const reiniciarBtn = document.getElementById('reiniciarBtn');
const rankingLista = document.getElementById('rankingLista');

let indicePergunta = 0;
let pontuacao = 0;
let acertos = 0;
let nomeUsuario = '';
let respostaSelecionada = null;

function obterRanking() {
  const local = localStorage.getItem(STORAGE_KEY);
  if (!local) return [];

  try {
    const ranking = JSON.parse(local);
    return Array.isArray(ranking) ? ranking : [];
  } catch (error) {
    return [];
  }
}

function salvarRanking(ranking) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ranking));
}

function atualizarRanking() {
  const ranking = obterRanking().sort((a, b) => b.pontos - a.pontos || b.acertos - a.acertos);
  rankingLista.innerHTML = '';

  if (!ranking.length) {
    rankingLista.innerHTML = '<li class="ranking-vazio">Ainda não há participantes no ranking.</li>';
    return;
  }

  ranking.slice(0, MAX_RANKING).forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'ranking-item';
    li.innerHTML = `
      <span class="ranking-posicao">#${index + 1}</span>
      <span class="ranking-nome">${item.nome}</span>
      <span class="ranking-pontos">${item.pontos} pts</span>
    `;
    rankingLista.appendChild(li);
  });
}

function iniciarQuiz() {
  nomeUsuario = nomeParticipante.value.trim();

  if (!nomeUsuario) {
    nomeParticipante.focus();
    return;
  }

  indicePergunta = 0;
  pontuacao = 0;
  acertos = 0;
  respostaSelecionada = null;

  inicioQuiz.classList.add('hidden');
  resultadoContainer.classList.add('hidden');
  quizCard.classList.remove('hidden');

  renderPergunta();
}

function renderPergunta() {
  const perguntaAtual = perguntas[indicePergunta];
  respostaSelecionada = null;
  proximoBtn.disabled = true;

  indicadorPergunta.textContent = `Pergunta ${indicePergunta + 1}/${perguntas.length}`;
  categoriaPergunta.textContent = perguntaAtual.categoria;
  textoPergunta.textContent = perguntaAtual.pergunta;

  opcoesContainer.innerHTML = '';

  perguntaAtual.respostas.forEach((resposta) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiz-opcao';
    button.textContent = resposta.texto;
    button.addEventListener('click', () => selecionarResposta(button, resposta));
    opcoesContainer.appendChild(button);
  });

  pontosAtuais.textContent = `${pontuacao} pts`;
}

function selecionarResposta(button, resposta) {
  respostaSelecionada = resposta;
  proximoBtn.disabled = false;

  const perguntaAtual = perguntas[indicePergunta];

  [...opcoesContainer.children].forEach((botao) => {
    botao.classList.remove('selecionada', 'correta', 'incorreta');

    const respostaMapeada = perguntaAtual.respostas.find((item) => item.texto === botao.textContent);
    if (respostaMapeada && respostaMapeada.correta) {
      botao.classList.add('correta');
    }
  });

  button.classList.add(resposta.correta ? 'correta' : 'incorreta');
  button.classList.add('selecionada');
}

function perguntaAtualResposta(texto) {
  const perguntaAtual = perguntas[indicePergunta];
  return perguntaAtual.respostas.find((resposta) => resposta.texto === texto) || null;
}

function avancarPergunta() {
  if (!respostaSelecionada) return;

  if (respostaSelecionada.correta) {
    acertos += 1;
    pontuacao += 10;
  }

  indicePergunta += 1;
  pontosAtuais.textContent = `${pontuacao} pts`;

  if (indicePergunta < perguntas.length) {
    renderPergunta();
    return;
  }

  finalizarQuiz();
}

function finalizarQuiz() {
  const percentual = Math.round((acertos / perguntas.length) * 100);
  const ranking = obterRanking();
  ranking.push({ nome: nomeUsuario, pontos: pontuacao, acertos });
  const rankingOrdenado = ranking.sort((a, b) => b.pontos - a.pontos || b.acertos - a.acertos).slice(0, MAX_RANKING);
  salvarRanking(rankingOrdenado);

  quizCard.classList.add('hidden');
  resultadoContainer.classList.remove('hidden');

  resultadoPontos.textContent = `${pontuacao}`;
  resultadoAcertos.textContent = `${acertos}/${perguntas.length}`;
  resultadoPercentual.textContent = `${percentual}%`;

  if (percentual >= 80) {
    resultadoTitulo.textContent = 'Excelente desempenho!';
    resultadoTexto.textContent = 'Você dominou os conceitos principais de IoT, Arduino e automação.';
  } else if (percentual >= 50) {
    resultadoTitulo.textContent = 'Bom resultado!';
    resultadoTexto.textContent = 'Você já entende bastante, mas ainda dá para evoluir com mais prática.';
  } else {
    resultadoTitulo.textContent = 'Continue praticando!';
    resultadoTexto.textContent = 'A jornada de aprendizado está apenas começando. Revise os conceitos e tente novamente.';
  }

  atualizarRanking();
}

function reiniciarQuiz() {
  resultadoContainer.classList.add('hidden');
  inicioQuiz.classList.remove('hidden');
  nomeParticipante.value = '';
  nomeParticipante.focus();
  indicePergunta = 0;
  pontuacao = 0;
  acertos = 0;
}

formNomeUsuario.addEventListener('submit', (event) => {
  event.preventDefault();
  iniciarQuiz();
});

proximoBtn.addEventListener('click', avancarPergunta);
reiniciarBtn.addEventListener('click', reiniciarQuiz);

atualizarRanking();
