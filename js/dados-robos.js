/* ============================================================
   DADOS-ROBOS.JS
   Base de dados dos 7 modelos de robôs industriais.
   Cada objeto contém todas as informações exigidas:
   nome, conceito, funcionamento, características técnicas,
   aplicações industriais, integração com IoT e 3 modelos
   comerciais de fabricantes distintos.
   ============================================================ */

const ROBOS = [
  {
    id: "cartesiano",
    nome: "Robô Cartesiano",
    apelido: "Robô Linear / Gantry",
    imagem: "img/cartesiano.png",
    resumo:
      "Robô que se movimenta em três eixos lineares perpendiculares (X, Y e Z), como um sistema de coordenadas cartesianas.",
    conceito:
      "O robô cartesiano, também chamado de robô linear ou gantry (pórtico), é um manipulador cujos três eixos principais de movimento são lineares e perpendiculares entre si, seguindo o sistema de coordenadas cartesianas (X, Y e Z). É uma das configurações mais simples, robustas e previsíveis da robótica industrial, sendo amplamente utilizado quando se necessita de movimentos retilíneos precisos dentro de um volume de trabalho em formato de cubo ou paralelepípedo.",
    funcionamento:
      "Cada eixo do robô cartesiano é acionado por um atuador linear — normalmente composto por servomotor acoplado a fuso de esferas, correia sincronizadora ou cremalheira, deslizando sobre guias lineares. O controlador calcula a posição desejada e envia comandos independentes para cada eixo: o eixo X move o conjunto na horizontal, o eixo Y na profundidade e o eixo Z na vertical. Como não há juntas rotativas na estrutura principal, a cinemática é direta e simples: a posição da ferramenta é a soma dos deslocamentos de cada eixo, o que facilita a programação e garante alta repetibilidade.",
    caracteristicas: [
      "3 graus de liberdade lineares (X, Y, Z), podendo receber um punho rotativo adicional",
      "Volume de trabalho retangular (cúbico), fácil de dimensionar",
      "Alta precisão e repetibilidade — tipicamente entre ±0,01 mm e ±0,05 mm",
      "Grande capacidade de carga, especialmente em estruturas tipo gantry (pórtico)",
      "Estrutura rígida e de fácil manutenção, com custo menor que robôs articulados",
      "Velocidade limitada em trajetórias diagonais, pois depende da composição dos eixos"
    ],
    aplicacoes: [
      "Máquinas CNC e impressoras 3D (o princípio construtivo é o mesmo)",
      "Sistemas pick and place de alta precisão em linhas de montagem",
      "Paletização e despaletização de caixas e produtos",
      "Aplicação de cola, selante e solda em trajetórias retilíneas",
      "Carga e descarga de máquinas-ferramenta",
      "Inspeção e medição dimensional automatizada"
    ],
    iot:
      "Na Indústria 4.0, os robôs cartesianos são equipados com encoders absolutos, sensores de fim de curso, sensores de vibração e de temperatura nos servomotores. Esses dados são coletados pelo CLP ou pelo controlador do robô e publicados em redes industriais como PROFINET ou EtherNet/IP. Por meio de gateways IoT com protocolos MQTT e OPC UA, as informações de posição, ciclos executados e consumo de energia alimentam dashboards em nuvem, permitindo manutenção preditiva (ex.: detectar desgaste do fuso de esferas pela vibração) e cálculo de OEE (eficiência global do equipamento) em tempo real.",
    modelos: [
      {
        nome: "Yamaha FXYx",
        fabricante: "Yamaha Robotics (Japão)",
        descricao:
          "Série de robôs cartesianos de 2 a 6 eixos com curso de até 2.050 mm, repetibilidade de ±0,01 mm e controlador com suporte a Ethernet industrial. Muito usado em montagem eletrônica e pick and place."
      },
      {
        nome: "Festo EXCM",
        fabricante: "Festo (Alemanha)",
        descricao:
          "Manipulador cartesiano planar compacto com acionamento por correia e servomotores. Cobertura total da área de trabalho retangular, ideal para bancadas de montagem e laboratórios de automação."
      },
      {
        nome: "IAI ICSB / Série IK",
        fabricante: "IAI - Intelligent Actuator (Japão)",
        descricao:
          "Sistemas cartesianos modulares de 2 e 3 eixos montados a partir de atuadores elétricos ROBO Cylinder, com controladora com interface EtherCAT/PROFINET e alta repetibilidade (±0,02 mm)."
      }
    ]
  },

  {
    id: "scara",
    nome: "Robô SCARA",
    apelido: "Selective Compliance Assembly Robot Arm",
    imagem: "img/scara.png",
    resumo:
      "Braço com dois eixos rotativos no plano horizontal e um eixo vertical, extremamente rápido em montagem e pick and place.",
    conceito:
      "SCARA é a sigla de Selective Compliance Assembly Robot Arm (braço robótico de montagem com complacência seletiva). Criado no Japão em 1981 pelo professor Hiroshi Makino, é um robô com dois braços articulados que se movem no plano horizontal e um eixo vertical (Z) na extremidade. A 'complacência seletiva' significa que o robô é rígido no eixo vertical, mas levemente flexível no plano horizontal — característica ideal para tarefas de inserção e montagem, pois o braço 'se acomoda' a pequenos desalinhamentos das peças.",
    funcionamento:
      "O SCARA possui duas juntas rotativas (ombro e cotovelo) que trabalham em paralelo ao plano da bancada, posicionando a ferramenta em qualquer ponto X-Y da área de trabalho, que tem formato semelhante a um rim. Um terceiro eixo, prismático, desce e sobe a ferramenta (eixo Z), e um quarto eixo rotaciona o punho (theta). Os servomotores das juntas são controlados simultaneamente pelo controlador, que resolve a cinemática inversa para converter coordenadas cartesianas em ângulos de junta. O resultado é um movimento extremamente rápido e repetitivo no ciclo 'pega-move-solta'.",
    caracteristicas: [
      "4 graus de liberdade: 2 rotativos horizontais + 1 vertical (Z) + rotação do punho",
      "Ciclos extremamente rápidos — ciclo padrão de pick and place abaixo de 0,4 s",
      "Repetibilidade típica de ±0,01 mm, entre as melhores da robótica industrial",
      "Complacência seletiva: rígido na vertical, flexível na horizontal (ideal para inserção de pinos e componentes)",
      "Área de trabalho em formato de 'rim' ao redor da base",
      "Capacidade de carga geralmente entre 1 kg e 20 kg",
      "Ocupa pouco espaço e pode ser montado em bancadas"
    ],
    aplicacoes: [
      "Montagem de componentes eletrônicos (placas de circuito, conectores, parafusamento)",
      "Pick and place de alta velocidade em linhas de produção",
      "Inserção de pinos, buchas e rolamentos",
      "Dispensação de cola e pasta térmica",
      "Embalagem e ordenação de pequenos produtos",
      "Testes e inspeção com câmeras de visão computacional"
    ],
    iot:
      "Controladores SCARA modernos possuem servidor OPC UA embarcado e portas Ethernet industrial (PROFINET, EtherNet/IP, EtherCAT), permitindo que sistemas MES e SCADA leiam em tempo real dados de ciclo, torque dos motores e alarmes. Em células de montagem 4.0, o SCARA troca mensagens MQTT com esteiras e sistemas de visão: a câmera publica a posição da peça no broker e o robô assina esse tópico para corrigir a pega. Os dados históricos de torque também alimentam algoritmos de manutenção preditiva na nuvem, antecipando falhas em redutores e correias.",
    modelos: [
      {
        nome: "Epson LS6-B",
        fabricante: "Epson Robots (Japão)",
        descricao:
          "SCARA de 6 kg de carga com alcance de 500/600/700 mm, repetibilidade de ±0,02 mm e ciclo de 0,35 s. Líder de mercado em montagem eletrônica, com controlador compatível com Ethernet/IP e PROFINET."
      },
      {
        nome: "ABB IRB 910SC",
        fabricante: "ABB (Suíça/Suécia)",
        descricao:
          "SCARA com carga de até 6 kg e alcance de 450 a 650 mm, repetibilidade de ±0,01 mm. Integra-se ao ecossistema ABB Ability para monitoramento em nuvem e ao RobotStudio para programação offline."
      },
      {
        nome: "FANUC SR-6iA",
        fabricante: "FANUC (Japão)",
        descricao:
          "SCARA de 6 kg com alcance de 650 mm, controlador R-30iB compacto, visão integrada iRVision e conectividade com o FANUC ZDT (Zero Down Time), plataforma IIoT de manutenção preditiva."
      }
    ]
  },

  {
    id: "articulado",
    nome: "Robô Articulado",
    apelido: "Braço Robótico Antropomórfico",
    imagem: "img/articulado.png",
    resumo:
      "O clássico braço robótico de 6 eixos rotativos, o mais versátil e mais utilizado na indústria mundial.",
    conceito:
      "O robô articulado, também chamado de antropomórfico, é o manipulador que mais se assemelha ao braço humano: possui juntas rotativas em série que fazem o papel de ombro, cotovelo e punho. É a configuração mais vendida e mais versátil da robótica industrial — os modelos mais comuns possuem 6 graus de liberdade, o que permite posicionar a ferramenta em qualquer ponto do volume de trabalho e com qualquer orientação. É a imagem clássica que vem à mente quando se fala em 'robô industrial'.",
    funcionamento:
      "Cada junta rotativa é acionada por um servomotor de corrente alternada acoplado a um redutor de alta precisão (harmônico ou cicloidal), com encoder absoluto que informa a posição angular ao controlador. O controlador resolve a cinemática inversa — cálculo matemático que converte a posição e orientação desejadas da ferramenta (TCP) nos seis ângulos de junta necessários — e interpola trajetórias lineares, circulares ou ponto a ponto. A programação é feita por teach pendant (guiando o robô pelos pontos), por software de simulação offline ou, nos modelos mais novos, por condução manual direta.",
    caracteristicas: [
      "Normalmente 6 graus de liberdade rotativos (existem versões de 4 a 7 eixos)",
      "Volume de trabalho esférico e amplo ao redor da base",
      "Grande flexibilidade de orientação da ferramenta — alcança pontos por vários ângulos",
      "Capacidade de carga de 3 kg a mais de 2.300 kg nos modelos de grande porte",
      "Alcance de 500 mm até mais de 4,5 m",
      "Repetibilidade típica entre ±0,02 mm e ±0,1 mm",
      "Cinemática complexa que exige controlador com maior poder de processamento"
    ],
    aplicacoes: [
      "Soldagem a ponto e soldagem MIG/MAG na indústria automotiva",
      "Pintura e envernizamento (versões à prova de explosão)",
      "Manipulação e carga/descarga de máquinas (machine tending)",
      "Paletização de cargas pesadas",
      "Rebarbação, polimento e usinagem leve",
      "Montagem de conjuntos mecânicos e colagem de vidros"
    ],
    iot:
      "Os robôs articulados são protagonistas da Indústria 4.0: seus controladores publicam mais de uma centena de variáveis (temperatura dos motores, torque por eixo, corrente, vibração, tempo de ciclo, alarmes) via OPC UA, MQTT e Ethernet industrial (PROFINET/EtherNet/IP). Plataformas como ABB Ability, KUKA iiQoT e FANUC ZDT agregam esses dados na nuvem para manutenção preditiva de redutores, balanceamento de linha e digital twin — a réplica virtual do robô que permite simular alterações de processo antes de aplicá-las na fábrica real.",
    modelos: [
      {
        nome: "ABB IRB 6700",
        fabricante: "ABB (Suíça/Suécia)",
        descricao:
          "Família de robôs de grande porte com carga de 150 a 300 kg e alcance de até 3,2 m. Referência em soldagem a ponto e manuseio na indústria automotiva, com monitoramento pela plataforma ABB Ability."
      },
      {
        nome: "KUKA KR QUANTEC",
        fabricante: "KUKA (Alemanha)",
        descricao:
          "Série de 120 a 300 kg de carga, controlador KR C5 com OPC UA nativo e integração à plataforma IIoT KUKA iiQoT. Amplamente usado em linhas de carroceria e fundição."
      },
      {
        nome: "FANUC M-20iD/25",
        fabricante: "FANUC (Japão)",
        descricao:
          "Robô de 25 kg de carga e 1.831 mm de alcance com braço oco (cabos internos), ideal para manipulação e arc welding. Conecta-se ao FANUC Field System e ao ZDT para análise preditiva."
      }
    ]
  },

  {
    id: "cilindrico",
    nome: "Robô Cilíndrico",
    apelido: "Manipulador de Coordenadas Cilíndricas",
    imagem: "img/cilindricos.png",
    resumo:
      "Combina uma base rotativa com movimentos lineares vertical e horizontal, gerando um volume de trabalho em formato de cilindro.",
    conceito:
      "O robô cilíndrico é um manipulador cujos eixos principais formam um sistema de coordenadas cilíndricas: uma junta rotativa na base (theta), um eixo linear vertical (Z) e um eixo linear horizontal de extensão do braço (R). O volume de trabalho resultante é um cilindro (ou casca cilíndrica) ao redor da base. Foi uma das primeiras configurações da robótica industrial e continua útil em tarefas que exigem alcançar pontos dispostos ao redor do robô, como carregar várias máquinas posicionadas em círculo.",
    funcionamento:
      "A base rotativa gira o conjunto do braço em torno do eixo vertical, definindo o ângulo de trabalho. Uma coluna com guia linear (acionada por servomotor e fuso ou cremalheira) desloca o braço para cima e para baixo, e o próprio braço se estende e retrai horizontalmente de forma telescópica ou sobre guias. A posição da ferramenta é definida por três coordenadas: ângulo de rotação (θ), altura (Z) e raio de extensão (R). A cinemática é simples e o controle é direto, o que torna a programação fácil e o comportamento muito previsível.",
    caracteristicas: [
      "3 graus de liberdade principais: rotação da base + translação vertical + extensão horizontal",
      "Volume de trabalho cilíndrico ao redor da base",
      "Boa rigidez e capacidade de carga elevada",
      "Cinemática simples, de fácil programação e manutenção",
      "Bom alcance vertical em espaços com pegada (footprint) reduzida",
      "Menor destreza de orientação da ferramenta em comparação ao robô articulado",
      "Configuração menos comum atualmente, substituída em parte por SCARA e articulados"
    ],
    aplicacoes: [
      "Carga e descarga de máquinas-ferramenta e injetoras dispostas ao redor do robô",
      "Manuseio de peças em fundição e forjaria",
      "Operações de montagem simples em torno de um eixo central",
      "Soldagem a ponto em posições dispostas radialmente",
      "Movimentação de materiais em células circulares",
      "Aplicações em salas limpas (semicondutores) com braços telescópicos"
    ],
    iot:
      "Mesmo sendo uma configuração clássica, os robôs cilíndricos modernizados recebem sensores de posição absoluta, células de carga e sensores indutivos de presença nas estações que atendem. Integrados a um CLP via PROFINET ou Modbus TCP, publicam status de cada estação de trabalho por MQTT para o sistema supervisório. Em células de machine tending 4.0, o robô cilíndrico consulta via OPC UA o status das máquinas CNC ao seu redor (porta aberta, ciclo concluído, contagem de peças) e decide qual atender primeiro, otimizando o fluxo produtivo.",
    modelos: [
      {
        nome: "Seiko RT3300",
        fabricante: "Seiko Instruments (Japão)",
        descricao:
          "Robô cilíndrico clássico de 4 eixos com repetibilidade de ±0,025 mm, muito difundido em montagem de precisão e manuseio de componentes eletrônicos em células compactas."
      },
      {
        nome: "ST Robotics R19",
        fabricante: "ST Robotics (Reino Unido/EUA)",
        descricao:
          "Robô cilíndrico de bancada com 5 eixos, carga de 1 a 2 kg e alcance de 500 mm. Popular em laboratórios, automação de análises clínicas e ensino de robótica."
      },
      {
        nome: "Yamaha YK-TW (base cilíndrica)",
        fabricante: "Yamaha Robotics (Japão)",
        descricao:
          "Família orbital com conceito de trabalho cilíndrico completo de 360° ao redor do eixo central, usada em pick and place de alta velocidade quando é preciso cobrir toda a área ao redor da base."
      }
    ]
  },

  {
    id: "delta",
    nome: "Robô Delta",
    apelido: "Robô Paralelo / Spider Robot",
    imagem: "img/delta.png",
    resumo:
      "Robô de cinemática paralela com três braços leves ligados a uma base suspensa — o mais rápido do mundo em pick and place.",
    conceito:
      "O robô delta é um robô de cinemática paralela inventado na década de 1980 pelo professor Reymond Clavel (EPFL, Suíça). Em vez de juntas em série como o braço articulado, ele possui três (ou quatro) braços leves de fibra de carbono conectados em paralelo a uma plataforma móvel, tudo suspenso sobre a área de trabalho. Como os motores ficam fixos na base superior e as partes móveis são extremamente leves, o delta alcança acelerações superiores a 10 g e é o campeão absoluto de velocidade em operações de pick and place.",
    funcionamento:
      "Os três servomotores fixados na base superior movem três braços independentes, cada um conectado por paralelogramos articulados à plataforma móvel (efetuador). O uso de paralelogramos garante que a plataforma permaneça sempre paralela à base — ela translada em X, Y e Z sem rotacionar. O controlador resolve a cinemática paralela calculando o ângulo de cada motor para posicionar a plataforma no ponto desejado. Um quarto eixo opcional, passando pelo centro, rotaciona a ferramenta. Normalmente trabalha sincronizado com esteiras e sistemas de visão computacional por conveyor tracking: a câmera identifica o produto em movimento e o robô o captura sem parar a linha.",
    caracteristicas: [
      "Cinemática paralela com 3 ou 4 graus de liberdade",
      "Velocidade extrema: mais de 150 a 300 ciclos de pick and place por minuto",
      "Acelerações superiores a 10 g graças aos braços leves de fibra de carbono",
      "Volume de trabalho em formato de cúpula (cilindro com fundo esférico) sob o robô",
      "Capacidade de carga baixa, tipicamente de 0,5 kg a 8 kg",
      "Montagem suspensa (teto), liberando a área da linha de produção",
      "Excelente repetibilidade (±0,1 mm) em altíssima velocidade"
    ],
    aplicacoes: [
      "Pick and place de alta velocidade em linhas de alimentos (bombons, biscoitos, salgadinhos)",
      "Embalagem primária e formação de kits na indústria farmacêutica",
      "Ordenação de produtos em esteiras com visão computacional",
      "Montagem de pequenos componentes eletrônicos",
      "Classificação e seleção de itens em centros logísticos",
      "Manuseio de produtos em ambientes com alto padrão de higiene (versões washdown)"
    ],
    iot:
      "O delta é o exemplo perfeito de integração robô + sensoriamento IoT: câmeras de visão publicam a posição e orientação de cada produto na esteira, o encoder da esteira transmite a velocidade em tempo real e o controlador funde esses dados para calcular o ponto de captura (conveyor tracking). Em plantas 4.0, contadores de ciclos, taxa de rejeitos e desempenho por receita de produto são publicados via OPC UA e MQTT para o MES, permitindo troca rápida de produção (changeover) por comando remoto e análise de produtividade por SKU na nuvem.",
    modelos: [
      {
        nome: "ABB IRB 360 FlexPicker",
        fabricante: "ABB (Suíça/Suécia)",
        descricao:
          "O delta mais famoso do mercado: carga de 1 a 8 kg, até 100 ciclos/min com produto, integração nativa com o software de visão PickMaster e conveyor tracking de série."
      },
      {
        nome: "FANUC M-2iA",
        fabricante: "FANUC (Japão)",
        descricao:
          "Delta de 3 a 6 kg com versões de 4 e 6 eixos, visão iRVision integrada ao controlador e versões IP69K para lavagem em linhas de alimentos."
      },
      {
        nome: "Omron Quattro 650",
        fabricante: "Omron (Japão)",
        descricao:
          "Único delta de 4 braços do mercado, com plataforma rotativa patenteada, mais de 300 ciclos/min e controlador embarcado na própria base. Destaque em embalagem de alta cadência."
      }
    ]
  },

  {
    id: "polar",
    nome: "Robô Polar",
    apelido: "Robô Esférico",
    imagem: "img/polares.png",
    resumo:
      "Configuração pioneira da robótica industrial: base rotativa, junta de elevação e braço telescópico, com volume de trabalho esférico.",
    conceito:
      "O robô polar, também chamado de esférico, posiciona sua ferramenta usando coordenadas polares: duas juntas rotativas (rotação da base e elevação do braço) e uma junta linear (extensão telescópica do braço). Seu volume de trabalho tem formato de casca esférica ao redor da base. Tem enorme importância histórica: o Unimate, primeiro robô industrial do mundo, instalado na linha da General Motors em 1961, era um robô polar acionado hidraulicamente. A configuração abriu caminho para toda a robótica industrial moderna.",
    funcionamento:
      "A primeira junta rotaciona todo o conjunto em torno do eixo vertical (azimute). A segunda junta inclina o braço para cima e para baixo (elevação). A terceira junta, prismática, estende e retrai o braço telescópico (raio). Assim, qualquer ponto do espaço é alcançado pela combinação de dois ângulos e uma distância — exatamente como coordenadas esféricas na matemática. Nos robôs originais o acionamento era hidráulico com controle por programação ponto a ponto gravada em memória de tambor magnético; nas versões modernas utilizam-se servomotores elétricos e controladores digitais.",
    caracteristicas: [
      "3 graus de liberdade: 2 rotativos (azimute e elevação) + 1 linear (extensão)",
      "Volume de trabalho em formato de casca esférica",
      "Grande alcance horizontal e capacidade de trabalhar acima e abaixo da base",
      "Estrutura robusta, historicamente com acionamento hidráulico para cargas pesadas",
      "Cinemática mais complexa que a cartesiana e a cilíndrica",
      "Configuração pioneira (Unimate, 1961) hoje rara em sua forma pura",
      "Princípio construtivo presente em robôs de solda a ponto de grande porte"
    ],
    aplicacoes: [
      "Carga e descarga de máquinas de fundição sob pressão (die casting)",
      "Soldagem a ponto em linhas automotivas (aplicação histórica do Unimate)",
      "Manuseio de peças quentes e pesadas em forjarias",
      "Empilhamento e movimentação de materiais em áreas amplas",
      "Aplicações que exigem grande alcance radial com base compacta",
      "Base conceitual para robôs modernos de grande envergadura"
    ],
    iot:
      "Robôs de configuração polar modernizados (retrofit) são um caso clássico de digitalização de ativos legados: instalam-se encoders, transdutores de pressão hidráulica, sensores de temperatura e vibração, conectados a um gateway IoT industrial. O gateway converte os sinais para MQTT ou OPC UA e os publica na nuvem, permitindo monitorar a saúde de equipamentos antigos sem trocar o controlador original. Assim, mesmo máquinas com décadas de operação passam a integrar dashboards de manutenção preditiva e sistemas MES da Indústria 4.0.",
    modelos: [
      {
        nome: "Unimate 2000",
        fabricante: "Unimation (EUA)",
        descricao:
          "O primeiro robô industrial do mundo, criado por George Devol e Joseph Engelberger. Acionamento hidráulico, capacidade de até 135 kg e memória de programa em tambor magnético. Instalado na GM em 1961."
      },
      {
        nome: "Versatran",
        fabricante: "AMF - American Machine & Foundry (EUA)",
        descricao:
          "Concorrente direto do Unimate na década de 1960, com configuração polar/cilíndrica e acionamento hidráulico. Um dos primeiros robôs a operar no Japão, dando origem à indústria robótica japonesa."
      },
      {
        nome: "Kawasaki-Unimate 2000",
        fabricante: "Kawasaki Heavy Industries (Japão)",
        descricao:
          "Versão licenciada do Unimate produzida pela Kawasaki a partir de 1969 — o primeiro robô industrial fabricado no Japão, usado em soldagem a ponto na indústria automotiva japonesa."
      }
    ]
  },

  {
    id: "colaborativo",
    nome: "Robô Colaborativo",
    apelido: "Cobot",
    imagem: "img/colaborativos.png",
    resumo:
      "Robô projetado para trabalhar lado a lado com pessoas, sem grades de proteção, com sensores de força e limitação de potência.",
    conceito:
      "O robô colaborativo, ou cobot, é projetado para compartilhar o mesmo espaço de trabalho com seres humanos com segurança, dispensando (após análise de risco) as grades de proteção dos robôs tradicionais. Normalmente tem formato de braço articulado leve de 6 ou 7 eixos, com bordas arredondadas, sensores de força em todas as juntas e velocidade e potência limitadas conforme a norma ISO/TS 15066. Seu grande diferencial é a facilidade de uso: pode ser programado por demonstração, literalmente 'pegando na mão' do robô e guiando-o pelos movimentos.",
    funcionamento:
      "Cada junta do cobot possui, além do servomotor e do encoder, sensores de torque/corrente que medem continuamente as forças externas aplicadas ao braço. Se o robô toca uma pessoa ou obstáculo, o controlador detecta a força anormal em milissegundos e para o movimento imediatamente (parada de segurança classificada). Os modos de operação colaborativa definidos pela ISO/TS 15066 incluem: parada monitorada de segurança, condução manual, monitoramento de velocidade e distância, e limitação de potência e força. A programação é simplificada por interfaces gráficas em tablet e pelo modo de aprendizagem por demonstração (hand guiding).",
    caracteristicas: [
      "6 ou 7 eixos rotativos em estrutura leve (o próprio robô pesa de 10 a 50 kg)",
      "Sensores de força/torque em todas as juntas para detecção de colisão",
      "Conformidade com a especificação de segurança ISO/TS 15066 e ISO 10218",
      "Capacidade de carga típica de 3 kg a 30 kg",
      "Programação intuitiva por demonstração (hand guiding) e interface em tablet",
      "Instalação rápida, sem necessidade de células cercadas (após análise de riscos)",
      "Velocidade reduzida em modo colaborativo em comparação aos robôs industriais tradicionais"
    ],
    aplicacoes: [
      "Montagem assistida lado a lado com operadores",
      "Parafusamento, colagem e dispensação em postos manuais automatizados",
      "Carga e descarga de máquinas CNC em pequenas empresas",
      "Testes de qualidade e inspeção com câmeras",
      "Paletização leve e embalagem em fim de linha",
      "Polimento, lixamento e acabamento com controle de força",
      "Laboratórios, farmácias e indústria de alimentos"
    ],
    iot:
      "Os cobots já nascem conectados: possuem interfaces Ethernet, servidores MQTT/OPC UA nativos ou via plugins (como os URCaps da Universal Robots) e APIs REST para integração com sistemas corporativos. Em uma célula colaborativa 4.0, o cobot publica em tempo real seu estado (executando, aguardando peça, parada de segurança), conta ciclos e mede forças de montagem — dados que alimentam dashboards de produtividade e qualidade na nuvem. Também é comum a integração com sensores vestíveis e câmeras de segurança que ajustam dinamicamente a velocidade do robô conforme a proximidade do operador.",
    modelos: [
      {
        nome: "Universal Robots UR10e",
        fabricante: "Universal Robots (Dinamarca)",
        descricao:
          "O cobot mais vendido do mundo: 6 eixos, carga de 12,5 kg, alcance de 1.300 mm, sensor de força integrado na flange e ecossistema UR+ com centenas de acessórios plug-and-play."
      },
      {
        nome: "FANUC CRX-10iA",
        fabricante: "FANUC (Japão)",
        descricao:
          "Cobot de 10 kg de carga e 1.249 mm de alcance, com 8 anos de operação sem manutenção programada, programação por arrastar ícones em tablet e sensor de contato de alta sensibilidade."
      },
      {
        nome: "ABB GoFa CRB 15000",
        fabricante: "ABB (Suíça/Suécia)",
        descricao:
          "Cobot de 5 kg e alcance de 950 mm com velocidade de até 2,2 m/s, encoders duplos em cada junta para segurança e programação por blocos no software Wizard Easy Programming."
      }
    ]
  }
];
