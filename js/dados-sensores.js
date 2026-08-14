/* ============================================================
   DADOS-SENSORES.JS
   Base de dados dos sensores IoT e industriais do catálogo.

   Cada objeto reúne as 10 informações exigidas no projeto:
   1. nome            6. tipoSinal (Analógico, Digital, I2C, SPI, UART, 4-20 mA)
   2. categoria       7. aplicacoes (industriais / IoT)
   3. conceito        8. exemplo (projeto + código Arduino)
   4. funcionamento   9. imagem (foto ilustrativa do módulo)
   5. especificacoes 10. fabricantes / modelos comerciais

   Campos auxiliares: id (usado na URL), resumo (card) e
   sinal (etiqueta curta usada nos filtros da página de catálogo).
   ============================================================ */

const SENSORES = [
  /* ---------------------------------------------------------- 01 */
  {
    id: "dht11",
    nome: "DHT11",
    categoria: "Temperatura e Umidade",
    sinal: "Digital",
    imagem: "img/sensores/dht11.png",
    resumo:
      "Sensor digital combinado de temperatura e umidade relativa do ar, de baixo custo e leitura por protocolo proprietário de 1 fio.",
    conceito:
      "O DHT11 é um sensor digital composto que mede, em um único encapsulamento, a temperatura e a umidade relativa do ar. Ele já entrega os valores convertidos e calibrados em formato digital, dispensando conversores A/D externos e circuitos de condicionamento de sinal. É o sensor mais utilizado em projetos didáticos de IoT justamente por reunir baixo custo, ligação simples (3 fios) e ampla disponibilidade de bibliotecas.",
    funcionamento:
      "A medição de umidade é feita por um elemento resistivo: um substrato coberto por um polímero higroscópico cuja resistência elétrica varia conforme a quantidade de vapor de água absorvida. A temperatura é medida por um termistor NTC, cuja resistência cai à medida que a temperatura sobe. Um microcontrolador de 8 bits interno lê os dois elementos, aplica a calibração gravada de fábrica na memória OTP e transmite o resultado como um quadro de 40 bits (16 de umidade, 16 de temperatura e 8 de checksum) por um único fio de dados, usando um protocolo próprio baseado na duração dos pulsos.",
    especificacoes: [
      "Tensão de operação: 3,0 V a 5,5 V CC",
      "Faixa de umidade: 20% a 90% UR — precisão de ±5% UR",
      "Faixa de temperatura: 0 °C a 50 °C — precisão de ±2 °C",
      "Resolução: 1% UR e 1 °C (valores inteiros)",
      "Taxa de amostragem: 1 leitura por segundo (1 Hz)",
      "Corrente em medição: 0,3 mA (2 µA em repouso)",
      "Encapsulamento de 4 pinos (apenas 3 utilizados)"
    ],
    tipoSinal:
      "Digital — barramento de 1 fio (single-wire) com protocolo proprietário de temporização de pulsos. Não é compatível com o padrão 1-Wire da Dallas/Maxim. Exige resistor de pull-up de 4,7 kΩ a 10 kΩ na linha de dados.",
    aplicacoes: [
      "Monitoramento de temperatura e umidade em salas de servidores e quadros elétricos",
      "Controle de climatização (HVAC) em ambientes prediais e industriais",
      "Estações meteorológicas didáticas e nós de IoT conectados por Wi-Fi/MQTT",
      "Estufas e casas de vegetação na agricultura de precisão",
      "Controle de umidade em processos de secagem e armazenagem de grãos"
    ],
    exemplo: {
      titulo: "Nó IoT de conforto térmico com alerta visual",
      descricao:
        "O DHT11 é lido a cada 2 segundos por um Arduino Uno. Os valores são impressos no Monitor Serial (que, em um projeto IoT, seria substituído por uma publicação MQTT feita por um ESP32) e um LED de alerta é acionado sempre que a temperatura ultrapassa 30 °C ou a umidade cai abaixo de 40%.",
      ligacao: [
        "VCC → 5 V do Arduino",
        "GND → GND",
        "DATA → pino digital 2 (com pull-up de 10 kΩ para o VCC)",
        "LED de alerta → pino digital 8 (em série com resistor de 220 Ω)"
      ],
      codigo: `// --- DHT11: temperatura e umidade com alerta ---
// Biblioteca: "DHT sensor library" (Adafruit)
#include <DHT.h>

#define PINO_DHT 2      // pino de dados do sensor
#define TIPO_DHT DHT11  // modelo do sensor (DHT11 ou DHT22)
#define LED_ALERTA 8

DHT dht(PINO_DHT, TIPO_DHT);

void setup() {
  Serial.begin(9600);
  pinMode(LED_ALERTA, OUTPUT);
  dht.begin();                 // inicializa a comunicação de 1 fio
}

void loop() {
  // O DHT11 aceita no máximo 1 leitura por segundo
  delay(2000);

  float umidade = dht.readHumidity();
  float temperatura = dht.readTemperature();  // em graus Celsius

  // isnan() detecta falha de leitura (checksum inválido ou fio solto)
  if (isnan(umidade) || isnan(temperatura)) {
    Serial.println("Falha na leitura do DHT11!");
    return;
  }

  Serial.print("Temperatura: ");
  Serial.print(temperatura);
  Serial.print(" C  |  Umidade: ");
  Serial.print(umidade);
  Serial.println(" %");

  // Regra de controle: aciona o alerta fora da faixa de conforto
  bool foraDaFaixa = (temperatura > 30.0 || umidade < 40.0);
  digitalWrite(LED_ALERTA, foraDaFaixa ? HIGH : LOW);
}`
    },
    fabricantes: [
      "Aosong (ASAIR) — fabricante original, modelo DHT11",
      "Módulos KY-015 e similares (placa com pull-up já embutido)",
      "Equivalentes comerciais: RHT01, Grove Temperature & Humidity Sensor (Seeed Studio)"
    ]
  },

  /* ---------------------------------------------------------- 02 */
  {
    id: "dht22",
    nome: "DHT22 / AM2302",
    categoria: "Temperatura e Umidade",
    sinal: "Digital",
    imagem: "img/sensores/dht22.png",
    resumo:
      "Versão de maior precisão e faixa de medição do DHT11, com resolução decimal e leitura de temperaturas negativas.",
    conceito:
      "O DHT22, também comercializado como AM2302, é o sucessor direto do DHT11. Mantém o mesmo formato de ligação e o mesmo protocolo digital de 1 fio, porém com sensores internos de melhor qualidade: mede temperaturas negativas, cobre praticamente toda a faixa de umidade e entrega os valores com uma casa decimal. É a escolha adequada quando o projeto exige precisão real de medição e não apenas demonstração didática.",
    funcionamento:
      "A umidade é medida por um sensor capacitivo: duas placas condutoras separadas por um filme polimérico higroscópico. A absorção de vapor de água altera a constante dielétrica do filme e, portanto, a capacitância do conjunto — princípio mais estável e menos sujeito a deriva que o elemento resistivo do DHT11. A temperatura é lida por um termistor NTC. O microcontrolador interno digitaliza os dois sinais com 16 bits cada, aplica a curva de calibração de fábrica e transmite o quadro de 40 bits pelo pino de dados, exatamente como o DHT11.",
    especificacoes: [
      "Tensão de operação: 3,3 V a 6 V CC",
      "Faixa de umidade: 0% a 100% UR — precisão de ±2% a ±5% UR",
      "Faixa de temperatura: -40 °C a +80 °C — precisão de ±0,5 °C",
      "Resolução: 0,1% UR e 0,1 °C",
      "Taxa de amostragem: 1 leitura a cada 2 segundos (0,5 Hz)",
      "Corrente em medição: 1 mA a 1,5 mA",
      "Estabilidade de longo prazo: deriva menor que ±0,5% UR ao ano"
    ],
    tipoSinal:
      "Digital — mesmo barramento de 1 fio (single-wire) do DHT11, com resistor de pull-up de 4,7 kΩ a 10 kΩ. Comprimento de cabo recomendado de até 20 m (acima de 2 m, usar cabo blindado).",
    aplicacoes: [
      "Estações meteorológicas profissionais e monitoramento ambiental",
      "Câmaras frias e sistemas de refrigeração (mede temperaturas negativas)",
      "Controle de umidade em estufas, incubadoras e câmaras de germinação",
      "Monitoramento de museus, arquivos e adegas climatizadas",
      "Nós IoT de qualidade ambiental industrial com envio por LoRa ou MQTT"
    ],
    exemplo: {
      titulo: "Registro ambiental com cálculo do índice de calor",
      descricao:
        "Além de ler temperatura e umidade, o programa calcula o índice de calor (sensação térmica) usando a própria biblioteca e classifica a condição do ambiente. Em um projeto IoT real, esse mesmo bloco roda em um ESP32 e o resultado é publicado em um tópico MQTT lido por um dashboard.",
      ligacao: [
        "VCC (pino 1) → 3,3 V ou 5 V",
        "DATA (pino 2) → pino digital 4, com pull-up de 10 kΩ",
        "Pino 3 → não conectado",
        "GND (pino 4) → GND"
      ],
      codigo: `// --- DHT22: temperatura, umidade e indice de calor ---
#include <DHT.h>

#define PINO_DHT 4
#define TIPO_DHT DHT22

DHT dht(PINO_DHT, TIPO_DHT);

void setup() {
  Serial.begin(9600);
  Serial.println("Monitor ambiental DHT22");
  dht.begin();
}

void loop() {
  delay(2000);                 // o DHT22 exige 2 s entre leituras

  float umidade = dht.readHumidity();
  float temperatura = dht.readTemperature();

  if (isnan(umidade) || isnan(temperatura)) {
    Serial.println("Erro de leitura do sensor.");
    return;
  }

  // Indice de calor (sensacao termica) calculado pela biblioteca.
  // O parametro "false" indica que a temperatura esta em Celsius.
  float sensacao = dht.computeHeatIndex(temperatura, umidade, false);

  Serial.print("T: ");   Serial.print(temperatura, 1);
  Serial.print(" C | UR: "); Serial.print(umidade, 1);
  Serial.print(" % | Sensacao: "); Serial.print(sensacao, 1);
  Serial.print(" C -> ");

  // Classificacao simples da condicao do ambiente
  if (sensacao < 27)      Serial.println("CONFORTAVEL");
  else if (sensacao < 32) Serial.println("ATENCAO");
  else                    Serial.println("CRITICO");
}`
    },
    fabricantes: [
      "Aosong (ASAIR) — DHT22 e a versão encapsulada AM2302 com cabo",
      "Adafruit — módulo DHT22 com resistor de pull-up montado",
      "Alternativas de precisão superior: Sensirion SHT31 (I2C) e Bosch BME280 (I2C/SPI)"
    ]
  },

  /* ---------------------------------------------------------- 03 */
  {
    id: "lm35",
    nome: "LM35",
    categoria: "Temperatura",
    sinal: "Analógico",
    imagem: "img/sensores/lm35.png",
    resumo:
      "Sensor analógico de temperatura com saída linear de 10 mV/°C, calibrado diretamente em graus Celsius.",
    conceito:
      "O LM35 é um circuito integrado sensor de temperatura de precisão cuja tensão de saída é linearmente proporcional à temperatura em graus Celsius. Sua grande vantagem sobre um termistor comum é não exigir linearização por software nem calibração externa: a saída já sai pronta, na razão de 10 mV para cada grau Celsius. É um clássico da instrumentação analógica e um excelente exemplo didático de sinal analógico em sistemas de aquisição de dados.",
    funcionamento:
      "O princípio baseia-se na dependência térmica da tensão base-emissor de transistores bipolares integrados. Internamente, dois transistores operam com densidades de corrente diferentes; a diferença entre suas tensões base-emissor é proporcional à temperatura absoluta (princípio PTAT). Um amplificador interno escala e desloca esse valor para que a saída seja 0 V a 0 °C e cresça 10 mV a cada grau. No Arduino, essa tensão é lida por um pino analógico e convertida pelo conversor A/D de 10 bits: temperatura = (leitura × 5000 / 1024) / 10.",
    especificacoes: [
      "Tensão de alimentação: 4 V a 30 V CC",
      "Faixa de medição: 0 °C a 100 °C (versão LM35DZ) ou -55 °C a +150 °C (LM35A com polarização negativa)",
      "Sensibilidade: 10 mV/°C, linear",
      "Precisão típica: ±0,5 °C a 25 °C",
      "Corrente de operação: menor que 60 µA (autoaquecimento inferior a 0,1 °C)",
      "Impedância de saída baixa: 0,1 Ω para carga de 1 mA",
      "Encapsulamentos: TO-92, TO-220 e SOIC"
    ],
    tipoSinal:
      "Analógico — tensão contínua proporcional à temperatura, lida por uma entrada analógica (ADC). Em ambiente industrial ruidoso, o sinal costuma ser convertido por um transmissor para o padrão 4-20 mA antes de percorrer longas distâncias.",
    aplicacoes: [
      "Monitoramento de temperatura de motores, mancais e painéis elétricos",
      "Controle de fornos, estufas e banhos térmicos de baixa temperatura",
      "Sistemas de proteção térmica com desligamento automático",
      "Aquisição de dados analógicos em CLPs por entrada de tensão 0-10 V (com condicionamento)",
      "Termostatos e controle de ventilação forçada em armários de automação"
    ],
    exemplo: {
      titulo: "Termostato com histerese e média móvel",
      descricao:
        "O programa faz 10 leituras do ADC e calcula a média para reduzir o ruído do sinal analógico, converte o valor para graus Celsius e liga um ventilador (via relé) acima de 35 °C, desligando somente abaixo de 32 °C. Essa diferença entre os limites — a histerese — evita que o relé fique chaveando sem parar em torno do ponto de ajuste.",
      ligacao: [
        "Pino 1 (+Vs) → 5 V",
        "Pino 2 (Vout) → entrada analógica A0",
        "Pino 3 (GND) → GND",
        "Relé do ventilador → pino digital 7"
      ],
      codigo: `// --- LM35: termostato com histerese ---
const int PINO_LM35 = A0;
const int RELE = 7;

const float LIGA_EM   = 35.0;   // liga o ventilador acima disso
const float DESLIGA_EM = 32.0;  // so desliga abaixo disso (histerese)

bool ventiladorLigado = false;

// Le o ADC varias vezes e devolve a temperatura media em Celsius
float lerTemperatura() {
  long soma = 0;
  for (int i = 0; i < 10; i++) {
    soma += analogRead(PINO_LM35);
    delay(10);
  }
  float media = soma / 10.0;

  // ADC de 10 bits (0-1023) com referencia de 5 V -> tensao em mV
  float milivolts = media * (5000.0 / 1024.0);

  // O LM35 fornece 10 mV por grau Celsius
  return milivolts / 10.0;
}

void setup() {
  Serial.begin(9600);
  pinMode(RELE, OUTPUT);
}

void loop() {
  float temperatura = lerTemperatura();
  Serial.print("Temperatura: ");
  Serial.print(temperatura, 1);
  Serial.println(" C");

  // Controle liga-desliga com histerese
  if (!ventiladorLigado && temperatura > LIGA_EM) {
    ventiladorLigado = true;
    digitalWrite(RELE, HIGH);
    Serial.println(">> Ventilador LIGADO");
  } else if (ventiladorLigado && temperatura < DESLIGA_EM) {
    ventiladorLigado = false;
    digitalWrite(RELE, LOW);
    Serial.println(">> Ventilador DESLIGADO");
  }

  delay(1000);
}`
    },
    fabricantes: [
      "Texas Instruments — LM35, LM35A, LM35DZ (fabricante original)",
      "Analog Devices / ON Semiconductor — equivalentes de segunda fonte",
      "Famílias relacionadas: TMP36 (saída com offset, mede negativos) e LM335 (saída em Kelvin)"
    ]
  },

  /* ---------------------------------------------------------- 04 */
  {
    id: "ds18b20",
    nome: "DS18B20",
    categoria: "Temperatura",
    sinal: "Digital (1-Wire)",
    imagem: "img/sensores/ds18b20.png",
    resumo:
      "Termômetro digital de alta precisão com barramento 1-Wire e endereço único de 64 bits — vários sensores em um único fio.",
    conceito:
      "O DS18B20 é um sensor digital de temperatura que se comunica pelo barramento 1-Wire da Maxim/Dallas. Sua característica mais marcante é possuir um número de série exclusivo de 64 bits gravado de fábrica, o que permite ligar dezenas de sensores no mesmo par de fios e identificar cada um individualmente. Existe na versão TO-92 (placa) e na versão de sonda de aço inoxidável à prova d'água, a mais usada em aplicações industriais de líquidos.",
    funcionamento:
      "Internamente, o sensor mede a temperatura comparando a frequência de dois osciladores: um com coeficiente térmico baixo (referência) e outro fortemente dependente da temperatura. A contagem de ciclos entre eles alimenta um contador que produz o valor digital. O resultado, com resolução configurável de 9 a 12 bits, é armazenado em um registrador interno (scratchpad). O mestre do barramento (Arduino) envia um comando de conversão, aguarda o tempo necessário e depois lê os dois bytes de temperatura, sempre endereçando o sensor pelo seu ROM code de 64 bits. O barramento pode ainda operar em modo parasita, alimentando o sensor pela própria linha de dados (apenas 2 fios).",
    especificacoes: [
      "Tensão de operação: 3,0 V a 5,5 V CC",
      "Faixa de medição: -55 °C a +125 °C",
      "Precisão: ±0,5 °C entre -10 °C e +85 °C",
      "Resolução programável: 9, 10, 11 ou 12 bits (0,5 °C a 0,0625 °C)",
      "Tempo de conversão: até 750 ms em 12 bits",
      "Endereço serial exclusivo de 64 bits gravado em ROM",
      "Alarmes de temperatura alta/baixa programáveis em memória EEPROM"
    ],
    tipoSinal:
      "Digital — barramento 1-Wire (padrão Dallas/Maxim), com resistor de pull-up de 4,7 kΩ. Vários sensores compartilham o mesmo pino do microcontrolador; comprimentos de barramento de até 100 m são viáveis com cabeamento adequado.",
    aplicacoes: [
      "Medição de temperatura de líquidos em tanques, caldeiras e trocadores de calor",
      "Monitoramento multiponto de câmaras frias e cadeia do frio (versão sonda)",
      "Perfil térmico de fornos e estufas com vários pontos no mesmo cabo",
      "Controle de temperatura em processos alimentícios e farmacêuticos",
      "Monitoramento de temperatura de enrolamentos e mancais de motores"
    ],
    exemplo: {
      titulo: "Monitoramento multiponto de um tanque de processo",
      descricao:
        "Três sondas DS18B20 são instaladas em alturas diferentes de um tanque e ligadas ao mesmo pino do Arduino. O programa descobre automaticamente quantos sensores existem no barramento, lê todos e sinaliza qual deles está fora da faixa — a base de um sistema de controle de estratificação térmica.",
      ligacao: [
        "Fio vermelho (VDD) → 5 V",
        "Fio preto (GND) → GND",
        "Fio amarelo (DQ) → pino digital 3, com pull-up de 4,7 kΩ para o 5 V",
        "Todas as sondas em paralelo no mesmo barramento"
      ],
      codigo: `// --- DS18B20: varios sensores no mesmo barramento 1-Wire ---
// Bibliotecas: OneWire + DallasTemperature
#include <OneWire.h>
#include <DallasTemperature.h>

#define PINO_1WIRE 3
const float LIMITE_ALARME = 60.0;

OneWire barramento(PINO_1WIRE);
DallasTemperature sensores(&barramento);

void setup() {
  Serial.begin(9600);
  sensores.begin();

  // Conta quantos dispositivos responderam no barramento
  Serial.print("Sensores encontrados: ");
  Serial.println(sensores.getDeviceCount());

  sensores.setResolution(12);   // 12 bits = 0,0625 C de resolucao
}

void loop() {
  // Um unico comando dispara a conversao em TODOS os sensores
  sensores.requestTemperatures();

  int total = sensores.getDeviceCount();
  for (int i = 0; i < total; i++) {
    float t = sensores.getTempCByIndex(i);

    Serial.print("Sonda ");
    Serial.print(i);
    Serial.print(": ");
    Serial.print(t, 2);
    Serial.print(" C");

    if (t > LIMITE_ALARME) Serial.print("  <<< ALARME");
    Serial.println();
  }

  Serial.println("-----------------------");
  delay(2000);
}`
    },
    fabricantes: [
      "Analog Devices / Maxim Integrated — DS18B20 e DS18B20-PAR (fabricante original)",
      "Sondas industriais encapsuladas em aço inox com cabo PVC ou silicone",
      "Família relacionada: DS18S20 (9 bits) e DS1822 (versão econômica)"
    ]
  },

  /* ---------------------------------------------------------- 05 */
  {
    id: "ldr",
    nome: "LDR (Fotorresistor)",
    categoria: "Luminosidade",
    sinal: "Analógico",
    imagem: "img/sensores/ldr.png",
    resumo:
      "Resistor dependente de luz: sua resistência cai à medida que a iluminação aumenta. O sensor de luz mais simples e barato.",
    conceito:
      "O LDR (Light Dependent Resistor), ou fotorresistor, é um componente passivo de dois terminais cuja resistência elétrica varia inversamente com a intensidade luminosa que incide sobre ele: no escuro apresenta centenas de milhares de ohms e, sob luz intensa, poucas centenas. Não é um sensor calibrado — mede variação relativa de luz, não lux absoluto — mas é imbatível em custo e simplicidade para tarefas de detecção de claro/escuro.",
    funcionamento:
      "O elemento sensível é uma trilha serpentina de material semicondutor fotossensível, tipicamente sulfeto de cádmio (CdS), depositada sobre um substrato cerâmico. Quando fótons com energia suficiente atingem o material, elétrons são promovidos da banda de valência para a banda de condução, criando pares elétron-lacuna e aumentando a condutividade — ou seja, reduzindo a resistência. Como o LDR é um resistor variável e não uma fonte de tensão, ele é sempre ligado em um divisor de tensão com um resistor fixo (tipicamente 10 kΩ); é a tensão do ponto central desse divisor que o Arduino lê no pino analógico.",
    especificacoes: [
      "Resistência no escuro: 0,5 MΩ a 1 MΩ (modelo GL5528)",
      "Resistência a 10 lux: 8 kΩ a 20 kΩ",
      "Tensão máxima de operação: 150 V CC",
      "Potência máxima dissipada: 100 mW",
      "Pico de sensibilidade espectral: cerca de 540 nm (luz verde, próximo ao olho humano)",
      "Tempo de resposta: 20 ms a 30 ms (lento comparado a fotodiodos)",
      "Faixa de temperatura: -30 °C a +70 °C"
    ],
    tipoSinal:
      "Analógico — usado em divisor de tensão, entregando uma tensão que varia com a luz. Módulos prontos (como o KY-018) acrescentam um comparador LM393 e passam a oferecer também uma saída digital com limiar ajustável por trimpot.",
    aplicacoes: [
      "Acionamento automático de iluminação pública e industrial (relé fotoelétrico)",
      "Controle de brilho de painéis, displays e sinalizadores",
      "Detecção de presença/passagem de peças por interrupção de feixe de luz",
      "Contagem de objetos em esteiras com emissor de luz oposto",
      "Sensores de nível em silos por bloqueio óptico e detecção de fim de bobina"
    ],
    exemplo: {
      titulo: "Iluminação automática com leitura percentual",
      descricao:
        "O LDR forma um divisor de tensão com um resistor de 10 kΩ. O programa converte a leitura bruta do ADC em uma escala percentual de luminosidade com a função map() e liga um LED (representando a lâmpada) quando o ambiente escurece — exatamente a lógica de um relé fotoelétrico industrial.",
      ligacao: [
        "5 V → um terminal do LDR",
        "Outro terminal do LDR → nó central → entrada analógica A0",
        "Nó central → resistor de 10 kΩ → GND",
        "LED (lâmpada) → pino digital 9 com resistor de 220 Ω"
      ],
      codigo: `// --- LDR: rele fotoeletrico com leitura percentual ---
const int PINO_LDR = A0;
const int LAMPADA = 9;
const int LIMIAR = 30;   // abaixo de 30% de luz, acende

void setup() {
  Serial.begin(9600);
  pinMode(LAMPADA, OUTPUT);
}

void loop() {
  int leitura = analogRead(PINO_LDR);   // 0 a 1023

  // Converte a leitura bruta em escala de 0 a 100% de luminosidade.
  // Com o LDR ligado ao 5 V, quanto MAIS luz, MAIOR a leitura.
  int luminosidade = map(leitura, 0, 1023, 0, 100);

  Serial.print("ADC: ");
  Serial.print(leitura);
  Serial.print("  |  Luminosidade: ");
  Serial.print(luminosidade);
  Serial.println(" %");

  if (luminosidade < LIMIAR) {
    digitalWrite(LAMPADA, HIGH);   // ambiente escuro -> acende
  } else {
    digitalWrite(LAMPADA, LOW);
  }

  delay(300);
}`
    },
    fabricantes: [
      "Série GL55xx (GL5516, GL5528, GL5539) — padrão de mercado",
      "Advanced Photonix / PerkinElmer — fotocélulas industriais de CdS",
      "Módulos prontos: KY-018 e Grove Light Sensor (com comparador embarcado)"
    ]
  },

  /* ---------------------------------------------------------- 06 */
  {
    id: "bh1750",
    nome: "BH1750",
    categoria: "Luminosidade",
    sinal: "I2C",
    imagem: "img/sensores/bh1750.png",
    resumo:
      "Sensor digital de luz ambiente que entrega o valor diretamente em lux pelo barramento I2C, já com resposta próxima à do olho humano.",
    conceito:
      "O BH1750FVI é um sensor digital de intensidade luminosa que resolve as duas grandes limitações do LDR: ele é calibrado (entrega lux, uma unidade fotométrica padronizada) e possui resposta espectral ajustada à sensibilidade do olho humano. Por se comunicar via I2C, dispensa o divisor de tensão, a conversão A/D e qualquer tabela de calibração — o valor chega pronto ao microcontrolador.",
    funcionamento:
      "Um fotodiodo integrado gera uma corrente proporcional à luz incidente. Um conversor corrente-frequência transforma essa corrente em um trem de pulsos, contado internamente por um período de integração configurável (tipicamente 120 ms no modo de alta resolução). O resultado de 16 bits é dividido por um fator de escala e disponibilizado em lux nos registradores do sensor, lidos pelo mestre I2C. O tempo de medição (MTreg) pode ser alterado para ampliar a faixa útil, permitindo medir tanto ambientes muito escuros quanto luz solar direta.",
    especificacoes: [
      "Tensão de operação: 2,4 V a 3,6 V (módulos trazem regulador para 5 V)",
      "Faixa de medição: 1 lux a 65.535 lux",
      "Resolução: 1 lux (modo alta resolução) ou 0,5 lux (modo H2)",
      "Erro de medição: ±20% (típico ±10% após ajuste do MTreg)",
      "Endereços I2C: 0x23 (pino ADDR em nível baixo) ou 0x5C (nível alto)",
      "Corrente de operação: 120 µA (0,01 µA em modo power down)",
      "Rejeição de ruído de 50/60 Hz da iluminação artificial"
    ],
    tipoSinal:
      "Digital I2C — dois fios (SDA e SCL) compartilhados com outros dispositivos do barramento. Como possui dois endereços selecionáveis, é possível ligar dois BH1750 no mesmo barramento.",
    aplicacoes: [
      "Controle automático de iluminação predial e industrial (dimerização por lux)",
      "Ajuste de brilho de IHMs, painéis e displays conforme a luz ambiente",
      "Monitoramento de iluminância em postos de trabalho para conformidade com normas de ergonomia (NR-17 / NBR ISO 8995)",
      "Medição de radiação luminosa em estufas e agricultura de precisão",
      "Estações meteorológicas e nós IoT de conforto ambiental"
    ],
    exemplo: {
      titulo: "Controle de iluminação por nível de lux com dimerização PWM",
      descricao:
        "O BH1750 mede a iluminância real do posto de trabalho. O programa compara o valor com o mínimo exigido (500 lux) e ajusta o brilho de uma luminária LED por PWM, aumentando a potência apenas quando a luz natural não é suficiente — a lógica de um sistema de daylight harvesting.",
      ligacao: [
        "VCC → 5 V (o módulo possui regulador de 3,3 V)",
        "GND → GND",
        "SCL → A5 (Arduino Uno) ou GPIO22 (ESP32)",
        "SDA → A4 (Arduino Uno) ou GPIO21 (ESP32)",
        "ADDR → livre (endereço 0x23) · Luminária LED → pino PWM 6"
      ],
      codigo: `// --- BH1750: controle de iluminacao por lux (I2C) ---
// Bibliotecas: Wire (nativa) + BH1750
#include <Wire.h>
#include <BH1750.h>

BH1750 luximetro;
const int LUMINARIA = 6;      // pino com PWM
const float LUX_ALVO = 500.0; // iluminancia minima desejada

void setup() {
  Serial.begin(9600);
  pinMode(LUMINARIA, OUTPUT);

  Wire.begin();               // inicializa o barramento I2C
  if (luximetro.begin(BH1750::CONTINUOUS_HIGH_RES_MODE)) {
    Serial.println("BH1750 iniciado no endereco 0x23");
  } else {
    Serial.println("Falha ao encontrar o BH1750!");
  }
}

void loop() {
  float lux = luximetro.readLightLevel();

  Serial.print("Iluminancia: ");
  Serial.print(lux);
  Serial.println(" lx");

  // Quanto mais luz natural houver, menos potencia a luminaria precisa
  float falta = LUX_ALVO - lux;
  if (falta < 0) falta = 0;

  int pwm = map(falta, 0, LUX_ALVO, 0, 255);
  pwm = constrain(pwm, 0, 255);
  analogWrite(LUMINARIA, pwm);

  Serial.print("PWM da luminaria: ");
  Serial.println(pwm);

  delay(1000);
}`
    },
    fabricantes: [
      "ROHM Semiconductor — BH1750FVI (fabricante original)",
      "Módulos GY-302 e GY-30 (versões com regulador e nível lógico para 5 V)",
      "Alternativas I2C: TSL2561, TSL2591 (Adafruit/AMS) e VEML7700 (Vishay)"
    ]
  },

  /* ---------------------------------------------------------- 07 */
  {
    id: "hcsr04",
    nome: "HC-SR04",
    categoria: "Distância",
    sinal: "Digital",
    imagem: "img/sensores/hcsr04.png",
    resumo:
      "Sensor ultrassônico que mede distância pelo tempo de eco de um pulso sonoro de 40 kHz, sem contato com o objeto.",
    conceito:
      "O HC-SR04 é um sensor de distância por ultrassom composto por um transdutor emissor e um receptor. Ele mede a distância até um obstáculo pelo tempo que uma onda sonora leva para ir até o alvo e voltar — o mesmo princípio do sonar. Por não depender da cor, da transparência ou do brilho da superfície (limitações dos sensores ópticos), é muito usado em medição de nível e detecção de obstáculos.",
    funcionamento:
      "O microcontrolador aplica um pulso de 10 µs no pino TRIG. O sensor então emite automaticamente uma rajada de 8 ciclos de ultrassom a 40 kHz e coloca o pino ECHO em nível alto. Quando o eco retorna ao receptor, o pino ECHO volta a nível baixo. A largura desse pulso é o tempo de ida e volta da onda. Como o som percorre o ar a aproximadamente 340 m/s (0,0343 cm/µs) e o percurso é duplo, a distância é calculada por: distância (cm) = tempo (µs) × 0,0343 / 2, ou de forma equivalente, tempo / 58. A velocidade do som varia com a temperatura, o que introduz erro de cerca de 0,17% por grau Celsius — em aplicações precisas, compensa-se essa variação com um sensor de temperatura auxiliar.",
    especificacoes: [
      "Tensão de operação: 5 V CC — corrente de 15 mA",
      "Faixa de medição: 2 cm a 400 cm",
      "Precisão: ±3 mm em condições ideais",
      "Ângulo de abertura do feixe: aproximadamente 15°",
      "Frequência ultrassônica: 40 kHz",
      "Pulso de disparo (TRIG): 10 µs em nível alto",
      "Taxa de medição recomendada: máximo de 20 leituras por segundo (60 ms entre ciclos)"
    ],
    tipoSinal:
      "Digital — dois pinos discretos: TRIG (saída do microcontrolador) e ECHO (entrada, com largura de pulso proporcional à distância). Em placas de 3,3 V como o ESP32, o pino ECHO exige divisor de tensão ou conversor de nível.",
    aplicacoes: [
      "Medição de nível de líquidos e sólidos em tanques e silos sem contato",
      "Detecção de presença e de obstáculos em AGVs e robôs móveis",
      "Contagem e detecção de peças em esteiras transportadoras",
      "Sistemas de estacionamento e de segurança perimetral",
      "Controle de altura de empilhamento e de folga entre equipamentos"
    ],
    exemplo: {
      titulo: "Medidor de nível de reservatório com alarme de baixo nível",
      descricao:
        "O sensor é instalado no topo de um reservatório de 100 cm de profundidade. O programa mede a distância até a lâmina d'água, converte esse valor em percentual de volume e aciona um alarme sonoro quando o nível cai abaixo de 20% — o esqueleto de um sistema de telemetria de reservatório em IoT.",
      ligacao: [
        "VCC → 5 V",
        "TRIG → pino digital 9",
        "ECHO → pino digital 10",
        "GND → GND · Buzzer de alarme → pino digital 11"
      ],
      codigo: `// --- HC-SR04: medidor de nivel de reservatorio ---
const int TRIG = 9;
const int ECHO = 10;
const int BUZZER = 11;

const float ALTURA_TANQUE = 100.0;  // cm, do sensor ao fundo

// Dispara o pulso e devolve a distancia medida em centimetros
float medirDistancia() {
  // Pulso de disparo de 10 microssegundos
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);

  // pulseIn mede quanto tempo o ECHO fica em nivel alto (em us)
  long duracao = pulseIn(ECHO, HIGH, 30000);  // timeout de 30 ms
  if (duracao == 0) return -1;                // nenhum eco recebido

  // Velocidade do som = 0,0343 cm/us; divide por 2 (ida e volta)
  return (duracao * 0.0343) / 2.0;
}

void setup() {
  Serial.begin(9600);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  pinMode(BUZZER, OUTPUT);
}

void loop() {
  float distancia = medirDistancia();

  if (distancia < 0) {
    Serial.println("Fora de alcance.");
  } else {
    // Quanto MAIOR a distancia ate a agua, MENOR o nivel do tanque
    float nivel = ((ALTURA_TANQUE - distancia) / ALTURA_TANQUE) * 100.0;
    nivel = constrain(nivel, 0, 100);

    Serial.print("Distancia: ");
    Serial.print(distancia, 1);
    Serial.print(" cm  |  Nivel: ");
    Serial.print(nivel, 0);
    Serial.println(" %");

    digitalWrite(BUZZER, nivel < 20 ? HIGH : LOW);
  }

  delay(200);   // respeita o intervalo minimo entre medicoes
}`
    },
    fabricantes: [
      "ElecFreaks — HC-SR04 (versão original) e HC-SR04P (3,3 V a 5 V)",
      "Versões industriais à prova d'água: JSN-SR04T e AJ-SR04M (sonda separada)",
      "Alternativas profissionais: Pepperl+Fuchs UB800 e Sick UM30 (saída 4-20 mA / IO-Link)"
    ]
  },

  /* ---------------------------------------------------------- 08 */
  {
    id: "pir",
    nome: "PIR HC-SR501",
    categoria: "Movimento",
    sinal: "Digital",
    imagem: "img/sensores/pir.png",
    resumo:
      "Sensor infravermelho passivo que detecta a movimentação de corpos quentes (pessoas e animais) pela variação da radiação térmica.",
    conceito:
      "O HC-SR501 é um módulo de sensor PIR (Passive Infra-Red). Ele é chamado de passivo porque não emite nenhuma radiação: apenas capta a radiação infravermelha (calor) já emitida naturalmente pelos corpos presentes na cena. Como só responde a variações, ele detecta movimento — não presença estática. É o sensor padrão de automação predial para acionamento automático de iluminação e alarmes.",
    funcionamento:
      "O elemento sensor é um cristal piroelétrico dividido em dois segmentos ligados em oposição. Quando a radiação infravermelha incidente é igual nos dois segmentos (cena parada), os sinais se cancelam e a saída é nula. Ao passar uma pessoa, o calor atinge primeiro um segmento e depois o outro, gerando um pulso diferencial. A lente de Fresnel branca sobre o sensor divide o campo de visão em várias zonas, ampliando esse efeito e aumentando o alcance. Um circuito integrado (BISS0001) amplifica e compara o sinal, entregando nível alto na saída. Dois trimpots ajustam a sensibilidade (alcance) e o tempo de retenção da saída acionada; um jumper seleciona entre disparo único (H) e disparo repetitivo (L).",
    especificacoes: [
      "Tensão de operação: 4,5 V a 20 V CC (saída em nível TTL 3,3 V)",
      "Alcance ajustável: 3 m a 7 m",
      "Ângulo de detecção: aproximadamente 110° a 120°",
      "Tempo de retenção do sinal: ajustável de 3 s a 300 s",
      "Tempo de bloqueio após disparo: cerca de 2,5 s",
      "Corrente em repouso: menor que 50 µA",
      "Temperatura de trabalho: -15 °C a +70 °C"
    ],
    tipoSinal:
      "Digital — saída discreta de nível alto (3,3 V) enquanto há movimento detectado, ideal para leitura por interrupção externa. Não fornece medida proporcional, apenas o estado detectado/não detectado.",
    aplicacoes: [
      "Acionamento automático de iluminação em corredores, almoxarifados e sanitários",
      "Alarmes de intrusão e monitoramento de áreas restritas da planta",
      "Detecção de presença humana em zonas perigosas de máquinas (função auxiliar, não de segurança certificada)",
      "Ativação de IHMs, catracas e sistemas em modo de economia de energia",
      "Contagem aproximada de fluxo de pessoas em ambientes industriais"
    ],
    exemplo: {
      titulo: "Iluminação automática com temporizador e contagem de eventos",
      descricao:
        "O sensor é lido por interrupção externa para não perder nenhum disparo. Ao detectar movimento, o programa acende a luz e reinicia um temporizador de 30 segundos; a luz só apaga quando esse tempo se esgota sem novos disparos. O total de acionamentos é contabilizado — dado típico enviado a um dashboard IoT de ocupação.",
      ligacao: [
        "VCC → 5 V",
        "OUT → pino digital 2 (entrada com suporte a interrupção)",
        "GND → GND",
        "Relé/LED da iluminação → pino digital 12"
      ],
      codigo: `// --- PIR HC-SR501: iluminacao automatica com temporizador ---
const int PINO_PIR = 2;
const int ILUMINACAO = 12;
const unsigned long TEMPO_LIGADO = 30000UL;  // 30 s

volatile bool movimentoDetectado = false;
unsigned long ultimoMovimento = 0;
unsigned int totalEventos = 0;

// Rotina de interrupcao: executada na borda de subida do sensor
void aoDetectarMovimento() {
  movimentoDetectado = true;
}

void setup() {
  Serial.begin(9600);
  pinMode(PINO_PIR, INPUT);
  pinMode(ILUMINACAO, OUTPUT);

  attachInterrupt(digitalPinToInterrupt(PINO_PIR),
                  aoDetectarMovimento, RISING);

  Serial.println("Aguardando estabilizacao do PIR (60 s)...");
  delay(5000);   // em campo, o PIR precisa de ate 60 s para estabilizar
}

void loop() {
  if (movimentoDetectado) {
    movimentoDetectado = false;
    ultimoMovimento = millis();
    totalEventos++;

    digitalWrite(ILUMINACAO, HIGH);
    Serial.print("Movimento detectado! Total de eventos: ");
    Serial.println(totalEventos);
  }

  // Desliga a luz apos o tempo sem novos disparos (temporizador nao bloqueante)
  if (millis() - ultimoMovimento > TEMPO_LIGADO &&
      digitalRead(ILUMINACAO) == HIGH) {
    digitalWrite(ILUMINACAO, LOW);
    Serial.println("Sem movimento: iluminacao desligada.");
  }
}`
    },
    fabricantes: [
      "Módulos HC-SR501, HC-SR505 (miniatura) e AM312 (3,3 V, ideal para ESP32)",
      "Panasonic — série EKMB (PIR industriais de alta estabilidade)",
      "Sensores prediais: Steinel, Legrand e WEG (detectores de presença comerciais)"
    ]
  },

  /* ---------------------------------------------------------- 09 */
  {
    id: "indutivo",
    nome: "Sensor Indutivo LJ12A3",
    categoria: "Proximidade",
    sinal: "Digital (PNP/NPN)",
    imagem: "img/sensores/indutivo.png",
    resumo:
      "Sensor de proximidade industrial que detecta objetos metálicos sem contato, por variação de campo eletromagnético.",
    conceito:
      "O sensor de proximidade indutivo é um dos componentes mais usados na automação industrial. Ele detecta a presença de objetos metálicos a curta distância, sem qualquer contato físico, e por isso não sofre desgaste mecânico — ao contrário das chaves fim de curso que substituiu. O modelo LJ12A3-4-Z/BX possui corpo cilíndrico rosqueado M12 e distância nominal de acionamento de 4 mm. É totalmente selado, resistente a poeira, óleo e vibração, o que o torna ideal para o chão de fábrica.",
    funcionamento:
      "Um oscilador LC alimenta uma bobina montada atrás da face ativa do sensor, gerando um campo eletromagnético alternado de alta frequência. Quando um objeto metálico entra nesse campo, correntes parasitas (correntes de Foucault) são induzidas na superfície do metal. Essas correntes consomem energia do circuito oscilador, reduzindo a amplitude da oscilação. Um circuito detector monitora essa amplitude e, ao ultrapassar um limiar, comuta a saída por meio de um gatilho Schmitt (que garante histerese e evita oscilação do sinal). Por depender de correntes induzidas, o sensor detecta apenas metais — com alcance máximo para o aço doce e reduzido para alumínio, latão e cobre, que exigem fator de correção.",
    especificacoes: [
      "Tensão de operação: 6 V a 36 V CC (tipicamente 24 V CC industrial)",
      "Distância nominal de detecção (Sn): 4 mm (LJ12A3-4)",
      "Corpo cilíndrico rosqueado M12 — versão blindada (flush) ou não blindada",
      "Corrente de saída: até 300 mA (saída a transistor NPN ou PNP)",
      "Frequência de comutação: até 500 Hz a 1 kHz",
      "Grau de proteção: IP67 (selado contra poeira e jatos d'água)",
      "Saída NO (normalmente aberta) ou NC (normalmente fechada), com LED indicador"
    ],
    tipoSinal:
      "Digital discreto a transistor — versões PNP (saída fornece +V quando acionada, padrão europeu/brasileiro) ou NPN (saída aterra o sinal, padrão asiático). Como opera em 24 V, exige divisor de tensão ou optoacoplador para ligar a um Arduino de 5 V; em CLPs, conecta-se diretamente às entradas digitais.",
    aplicacoes: [
      "Detecção de posição de cilindros pneumáticos, cames e batentes",
      "Contagem de peças metálicas em esteiras transportadoras",
      "Fim de curso sem contato em portas, gavetas e mesas de máquinas",
      "Medição de rotação de engrenagens e eixos (contagem de dentes)",
      "Verificação de presença de peça em dispositivos de usinagem e prensas"
    ],
    exemplo: {
      titulo: "Contador de peças metálicas em esteira",
      descricao:
        "O sensor indutivo é montado ao lado da esteira e detecta cada peça metálica que passa. O programa usa interrupção com filtro de debounce por software para contar as peças e, a cada lote de 12 unidades, aciona uma saída que comanda o desvio para a caixa de embalagem — a base de um sistema de contagem e paletização.",
      ligacao: [
        "Fio marrom (+) → 24 V CC (fonte industrial)",
        "Fio azul (−) → 0 V, com GND comum ao Arduino",
        "Fio preto (saída PNP) → divisor de tensão (10 kΩ / 4,7 kΩ) → pino digital 2",
        "Saída de desvio (relé) → pino digital 8"
      ],
      codigo: `// --- Sensor indutivo LJ12A3: contador de pecas em esteira ---
const int PINO_SENSOR = 2;
const int RELE_DESVIO = 8;
const int PECAS_POR_LOTE = 12;

volatile unsigned long contador = 0;
volatile unsigned long ultimoPulso = 0;

// Interrupcao com filtro de ruido (debounce de 5 ms por software)
void contarPeca() {
  unsigned long agora = millis();
  if (agora - ultimoPulso > 5) {
    contador++;
    ultimoPulso = agora;
  }
}

void setup() {
  Serial.begin(9600);
  pinMode(PINO_SENSOR, INPUT);
  pinMode(RELE_DESVIO, OUTPUT);

  attachInterrupt(digitalPinToInterrupt(PINO_SENSOR), contarPeca, RISING);
  Serial.println("Contador de pecas iniciado.");
}

void loop() {
  static unsigned long ultimoLote = 0;

  // Le a variavel volatile com as interrupcoes desabilitadas
  noInterrupts();
  unsigned long total = contador;
  interrupts();

  Serial.print("Pecas contadas: ");
  Serial.println(total);

  // A cada lote completo, aciona o desvio por 500 ms
  if (total / PECAS_POR_LOTE > ultimoLote) {
    ultimoLote = total / PECAS_POR_LOTE;
    Serial.println(">> Lote completo: acionando desvio");
    digitalWrite(RELE_DESVIO, HIGH);
    delay(500);
    digitalWrite(RELE_DESVIO, LOW);
  }

  delay(200);
}`
    },
    fabricantes: [
      "Modelos genéricos LJ12A3-4-Z/BX (PNP NO), Z/AX, Z/BY — amplamente disponíveis",
      "Fabricantes industriais: Pepperl+Fuchs, Sick, Balluff, Turck e Omron",
      "Nacionais: Metaltex, WEG e Sense (linha completa de indutivos M8 a M30)"
    ]
  },

  /* ---------------------------------------------------------- 10 */
  {
    id: "capacitivo",
    nome: "Sensor Capacitivo LJ18A3",
    categoria: "Proximidade",
    sinal: "Digital (PNP/NPN)",
    imagem: "img/sensores/capacitivo.png",
    resumo:
      "Sensor de proximidade que detecta qualquer material — sólidos, líquidos, plásticos e pós — por variação de capacitância.",
    conceito:
      "O sensor de proximidade capacitivo funciona de forma análoga ao indutivo, mas com uma vantagem decisiva: detecta praticamente qualquer material, e não apenas metais. Ele responde a plásticos, vidro, madeira, papel, grãos, pós e líquidos, inclusive através de paredes finas de recipientes não metálicos. Por isso é o sensor preferido para detecção de nível de produtos em silos, tanques e tubulações. O LJ18A3-8-Z/BX tem corpo M18 e distância de acionamento de 8 mm.",
    funcionamento:
      "A face ativa do sensor é uma das placas de um capacitor; a outra placa é o próprio ambiente/objeto aproximado. Quando um material entra na região da face ativa, ele altera a constante dielétrica do meio e, com isso, a capacitância do conjunto. Essa capacitância faz parte de um circuito oscilador RC: com o aumento da capacitância, o oscilador — que estava parado — começa a oscilar. Um detector de amplitude percebe o início da oscilação e comuta a saída. A distância de acionamento depende fortemente da constante dielétrica do material: água (ε ≈ 80) é detectada a distâncias muito maiores que plásticos (ε ≈ 2 a 4). Um potenciômetro na traseira permite ajustar a sensibilidade para cada aplicação.",
    especificacoes: [
      "Tensão de operação: 6 V a 36 V CC",
      "Distância nominal de detecção (Sn): 8 mm, ajustável por potenciômetro",
      "Corpo cilíndrico rosqueado M18",
      "Corrente de saída: até 300 mA (NPN ou PNP, NO ou NC)",
      "Frequência de comutação: até 100 Hz",
      "Grau de proteção: IP67",
      "Detecta metais, líquidos, plásticos, vidro, madeira, grãos e pós"
    ],
    tipoSinal:
      "Digital discreto a transistor (PNP ou NPN), com LED de estado. Conecta-se diretamente a entradas digitais de CLP em 24 V; com Arduino, exige adaptação de nível de tensão.",
    aplicacoes: [
      "Detecção de nível de líquidos e grãos através da parede do recipiente",
      "Verificação de presença de produto dentro de embalagens plásticas ou de papelão",
      "Controle de nível em silos de ração, cimento, açúcar e resinas plásticas",
      "Detecção de entupimento em calhas e dutos de transporte pneumático",
      "Contagem de caixas, garrafas e produtos não metálicos em esteiras"
    ],
    exemplo: {
      titulo: "Controle automático de nível de silo com dois sensores",
      descricao:
        "Dois sensores capacitivos são instalados no silo: um no nível mínimo e outro no nível máximo. O programa implementa a lógica clássica de intertravamento — liga a rosca de alimentação quando o nível cai abaixo do mínimo e só desliga quando o nível máximo é atingido — e sinaliza os estados por LEDs no painel.",
      ligacao: [
        "Ambos os sensores: marrom → 24 V, azul → 0 V (GND comum)",
        "Sensor de nível MÍNIMO (preto) → divisor de tensão → pino digital 4",
        "Sensor de nível MÁXIMO (preto) → divisor de tensão → pino digital 5",
        "Relé da rosca de alimentação → pino digital 7"
      ],
      codigo: `// --- Sensor capacitivo LJ18A3: controle de nivel de silo ---
const int NIVEL_MIN = 4;   // sensor inferior
const int NIVEL_MAX = 5;   // sensor superior
const int RELE_ROSCA = 7;  // motor de alimentacao

bool enchendo = false;

void setup() {
  Serial.begin(9600);
  pinMode(NIVEL_MIN, INPUT);
  pinMode(NIVEL_MAX, INPUT);
  pinMode(RELE_ROSCA, OUTPUT);
}

void loop() {
  // Sensor PNP: HIGH significa "material detectado nesta altura"
  bool temMinimo = digitalRead(NIVEL_MIN);
  bool temMaximo = digitalRead(NIVEL_MAX);

  // Logica de intertravamento do enchimento
  if (!temMinimo && !enchendo) {
    enchendo = true;
    digitalWrite(RELE_ROSCA, HIGH);
    Serial.println("Nivel baixo -> rosca de alimentacao LIGADA");
  }
  if (temMaximo && enchendo) {
    enchendo = false;
    digitalWrite(RELE_ROSCA, LOW);
    Serial.println("Nivel maximo atingido -> rosca DESLIGADA");
  }

  // Diagnostico: sensor superior ativo com o inferior inativo e impossivel
  if (temMaximo && !temMinimo) {
    Serial.println("ALARME: falha de sensor ou material aderido!");
  }

  Serial.print("Min: "); Serial.print(temMinimo);
  Serial.print(" | Max: "); Serial.println(temMaximo);
  delay(500);
}`
    },
    fabricantes: [
      "Modelos genéricos LJ18A3-8-Z/BX e LJ12A3-4-J/DZ (versões CA)",
      "Fabricantes industriais: Pepperl+Fuchs, Balluff, ifm electronic e Turck",
      "Nacionais: Sense, Metaltex e WEG (linha de capacitivos M12 a M30)"
    ]
  },

  /* ---------------------------------------------------------- 11 */
  {
    id: "mq2",
    nome: "MQ-2",
    categoria: "Gás",
    sinal: "Analógico + Digital",
    imagem: "img/sensores/mq2.png",
    resumo:
      "Sensor de gases combustíveis e fumaça (GLP, metano, propano, hidrogênio, álcool) baseado em óxido de estanho aquecido.",
    conceito:
      "O MQ-2 pertence à família de sensores de gás MQ, do tipo semicondutor de óxido metálico (MOS). Ele detecta a presença de gases combustíveis e de fumaça no ar, sendo o sensor mais usado em alarmes de vazamento de gás e de incêndio em projetos de IoT. Não é um sensor seletivo — responde a vários gases ao mesmo tempo — e por isso é adequado a alarmes de presença de gás, não à medição precisa de concentração de um gás específico.",
    funcionamento:
      "O elemento sensível é uma camada de dióxido de estanho (SnO₂) depositada sobre um tubo cerâmico com um filamento aquecedor interno. O aquecedor mantém o material a cerca de 300 °C. Nessa temperatura, o oxigênio do ar se adsorve na superfície do SnO₂, capturando elétrons e criando uma barreira de potencial que deixa o material com alta resistência. Quando moléculas de gás combustível entram em contato com a superfície aquecida, elas reagem com o oxigênio adsorvido e liberam os elétrons capturados, reduzindo a resistência do sensor. Essa resistência é lida por um divisor de tensão e entregue na saída analógica. O módulo ainda traz um comparador LM393 com trimpot, que gera uma saída digital ao ultrapassar o limiar ajustado. O sensor exige pré-aquecimento (de 20 s a 24 h, conforme a precisão desejada) antes de fornecer leituras estáveis.",
    especificacoes: [
      "Tensão de operação: 5 V CC — consumo do aquecedor: cerca de 150 mA (800 mW)",
      "Faixa de detecção: 300 ppm a 10.000 ppm (GLP, propano, metano, hidrogênio, álcool e fumaça)",
      "Resistência do sensor (Rs) em ar limpo: 3 kΩ a 30 kΩ",
      "Tempo de pré-aquecimento: mínimo de 20 s (24 h para estabilidade plena)",
      "Tempo de resposta: menor que 10 s",
      "Umidade de operação: menor que 95% UR, sem condensação",
      "Vida útil típica: cerca de 5 anos"
    ],
    tipoSinal:
      "Duplo — saída analógica (AO) proporcional à concentração de gás, lida pelo ADC, e saída digital (DO) do comparador LM393, que muda de estado no limiar ajustado pelo trimpot. Em projetos IoT, usa-se a analógica para tendência e a digital para o alarme imediato.",
    aplicacoes: [
      "Alarmes de vazamento de GLP e gás natural em cozinhas industriais e caldeiras",
      "Detecção precoce de fumaça e princípio de incêndio em painéis e almoxarifados",
      "Monitoramento de atmosfera em espaços confinados antes da entrada de trabalhadores",
      "Segurança em áreas de armazenamento de solventes e combustíveis",
      "Nós IoT de segurança industrial com notificação remota via MQTT"
    ],
    exemplo: {
      titulo: "Alarme de vazamento de gás com dois níveis de alerta",
      descricao:
        "O programa monitora continuamente a saída analógica do MQ-2 e aplica dois limiares: um de atenção, que apenas sinaliza, e um crítico, que dispara a sirene e corta a eletroválvula de gás. O bloco de pré-aquecimento no setup() garante que o sensor só comece a operar depois de estabilizado.",
      ligacao: [
        "VCC → 5 V (fonte capaz de fornecer 200 mA)",
        "GND → GND",
        "AO (saída analógica) → A0",
        "DO (saída digital) → pino digital 3",
        "Sirene → pino 8 · Relé da eletroválvula → pino 9"
      ],
      codigo: `// --- MQ-2: alarme de gas combustivel e fumaca ---
const int PINO_AO = A0;
const int PINO_DO = 3;
const int SIRENE = 8;
const int VALVULA = 9;

const int LIMITE_ATENCAO = 300;   // valor de ADC (ajustar em campo)
const int LIMITE_CRITICO = 550;

void setup() {
  Serial.begin(9600);
  pinMode(PINO_DO, INPUT);
  pinMode(SIRENE, OUTPUT);
  pinMode(VALVULA, OUTPUT);

  digitalWrite(VALVULA, HIGH);    // valvula aberta em operacao normal

  // O elemento aquecedor precisa estabilizar antes da primeira leitura
  Serial.println("Pre-aquecendo o sensor MQ-2...");
  delay(20000);
  Serial.println("Sensor pronto.");
}

void loop() {
  int leitura = analogRead(PINO_AO);
  bool alarmeDigital = (digitalRead(PINO_DO) == LOW); // DO ativa em nivel baixo

  Serial.print("Nivel de gas (ADC): ");
  Serial.print(leitura);

  if (leitura >= LIMITE_CRITICO || alarmeDigital) {
    Serial.println("  >>> VAZAMENTO CRITICO!");
    digitalWrite(SIRENE, HIGH);
    digitalWrite(VALVULA, LOW);        // fecha a eletrovalvula
  } else if (leitura >= LIMITE_ATENCAO) {
    Serial.println("  >> Atencao: gas detectado");
    digitalWrite(SIRENE, LOW);
  } else {
    Serial.println("  | Atmosfera normal");
    digitalWrite(SIRENE, LOW);
    digitalWrite(VALVULA, HIGH);
  }

  delay(1000);
}`
    },
    fabricantes: [
      "Hanwei Electronics (Winsen) — MQ-2 original e série MQ completa",
      "Módulos prontos: FC-22, Grove Gas Sensor MQ2 (Seeed Studio) e KY-035",
      "Alternativas industriais calibradas: Figaro TGS2610 e sensores catalíticos Dräger/MSA"
    ]
  },

  /* ---------------------------------------------------------- 12 */
  {
    id: "mq135",
    nome: "MQ-135",
    categoria: "Gás",
    sinal: "Analógico + Digital",
    imagem: "img/sensores/mq135.png",
    resumo:
      "Sensor de qualidade do ar sensível a amônia, óxidos de nitrogênio, benzeno, fumaça e CO₂ — usado como índice geral de poluição.",
    conceito:
      "O MQ-135 é o membro da família MQ voltado ao monitoramento da qualidade do ar. Diferentemente do MQ-2, que foca em gases combustíveis, ele responde a poluentes e compostos orgânicos voláteis presentes em ambientes internos: amônia (NH₃), óxidos de nitrogênio (NOx), benzeno, álcool, fumaça e dióxido de carbono. Seu valor é frequentemente convertido em um índice de qualidade do ar (AQI) aproximado, sendo o sensor mais comum em nós IoT de monitoramento ambiental de baixo custo.",
    funcionamento:
      "O princípio é o mesmo do MQ-2: um elemento de dióxido de estanho (SnO₂) aquecido a cerca de 300 °C por um filamento interno. Em ar limpo, o oxigênio adsorvido na superfície mantém a resistência alta; na presença de gases redutores, reações químicas na superfície liberam elétrons e a resistência cai. A diferença está na dopagem do material e no perfil de aquecimento, que deslocam a seletividade para os poluentes de interesse. A concentração em ppm é estimada pela razão Rs/R0, onde Rs é a resistência medida e R0 é a resistência do sensor em ar limpo — valor que precisa ser levantado por calibração antes do uso. A relação entre Rs/R0 e a concentração é uma curva logarítmica fornecida no datasheet.",
    especificacoes: [
      "Tensão de operação: 5 V CC — consumo do aquecedor: cerca de 150 mA",
      "Faixa de detecção: 10 ppm a 1.000 ppm (NH₃, NOx, benzeno, álcool, fumaça, CO₂)",
      "Resistência de carga (RL) ajustável no módulo, tipicamente 20 kΩ",
      "Tempo de pré-aquecimento: 24 h para leituras confiáveis em ppm",
      "Sensibilidade: Rs (ar) / Rs (100 ppm NH₃) maior ou igual a 5",
      "Condições nominais de calibração: 20 °C e 65% UR",
      "Vida útil típica: cerca de 5 anos"
    ],
    tipoSinal:
      "Duplo — saída analógica (AO) para acompanhar a tendência da qualidade do ar e saída digital (DO) do comparador LM393 para alarme por limiar. Para valores em ppm é obrigatório calibrar R0 em ar limpo.",
    aplicacoes: [
      "Monitoramento da qualidade do ar em galpões, oficinas e salas de produção",
      "Controle de renovação de ar e acionamento de exaustores por concentração de poluentes",
      "Detecção de vapores de solventes em cabines de pintura e laboratórios",
      "Monitoramento ambiental urbano e industrial com nós IoT distribuídos",
      "Verificação de atmosfera em estações de tratamento de efluentes (amônia e gás sulfídrico)"
    ],
    exemplo: {
      titulo: "Índice de qualidade do ar com acionamento de exaustor",
      descricao:
        "O programa calcula a razão Rs/R0 a partir da leitura analógica, estima a concentração em ppm pela curva do datasheet e classifica o ar em quatro faixas. Quando a qualidade cai para nível ruim, o exaustor é acionado automaticamente — a lógica de um sistema de ventilação inteligente.",
      ligacao: [
        "VCC → 5 V · GND → GND",
        "AO → entrada analógica A0",
        "DO → pino digital 2 (alarme por limiar)",
        "Relé do exaustor → pino digital 10"
      ],
      codigo: `// --- MQ-135: indice de qualidade do ar ---
const int PINO_AO = A0;
const int RELE_EXAUSTOR = 10;

const float RL = 20.0;    // resistencia de carga do modulo, em kilo-ohms
const float R0 = 76.63;   // resistencia em ar limpo (obtida na calibracao)

// Converte a leitura do ADC na resistencia atual do sensor (Rs)
float lerRs() {
  int adc = analogRead(PINO_AO);
  if (adc == 0) return 0;

  float tensao = adc * (5.0 / 1023.0);
  // Divisor de tensao: Rs = RL * (Vc - Vout) / Vout
  return RL * (5.0 - tensao) / tensao;
}

void setup() {
  Serial.begin(9600);
  pinMode(RELE_EXAUSTOR, OUTPUT);
  Serial.println("MQ-135 aquecendo...");
  delay(20000);
}

void loop() {
  float rs = lerRs();
  float razao = rs / R0;

  // Curva aproximada do datasheet para CO2 equivalente (ppm)
  float ppm = 116.6020682 * pow(razao, -2.769034857);

  Serial.print("Rs/R0: ");  Serial.print(razao, 2);
  Serial.print("  |  CO2 equivalente: "); Serial.print(ppm, 0);
  Serial.print(" ppm  ->  ");

  if (ppm < 700)       Serial.println("BOM");
  else if (ppm < 1100) Serial.println("MODERADO");
  else if (ppm < 1600) Serial.println("RUIM");
  else                 Serial.println("MUITO RUIM");

  // Aciona a renovacao de ar quando a qualidade piora
  digitalWrite(RELE_EXAUSTOR, ppm > 1100 ? HIGH : LOW);

  delay(2000);
}`
    },
    fabricantes: [
      "Hanwei Electronics (Winsen) — MQ-135 original",
      "Módulos genéricos com comparador LM393 e trimpot de limiar",
      "Alternativas digitais calibradas: Sensirion SGP30/SGP40 (I2C) e Winsen MH-Z19 (CO₂ NDIR, UART)"
    ]
  },

  /* ---------------------------------------------------------- 13 */
  {
    id: "solo",
    nome: "Sensor Capacitivo de Umidade do Solo",
    categoria: "Umidade",
    sinal: "Analógico",
    imagem: "img/sensores/solo.png",
    resumo:
      "Sonda que mede a umidade do solo por variação de capacitância, sem eletrodos expostos — logo, sem corrosão.",
    conceito:
      "O sensor capacitivo de umidade do solo é a evolução do antigo sensor resistivo (YL-69/FC-28). No modelo resistivo, dois eletrodos metálicos ficam em contato direto com a terra e sofrem corrosão eletrolítica em poucas semanas. No capacitivo, a trilha condutora é totalmente encapsulada na placa, sem metal exposto, o que garante vida útil muito maior. É o sensor central de qualquer projeto de irrigação inteligente e agricultura de precisão baseada em IoT.",
    funcionamento:
      "Um oscilador (normalmente um temporizador 555 embarcado na própria placa) gera um sinal de alta frequência, tipicamente 1,5 MHz. A sonda funciona como um capacitor cujo dielétrico é o solo ao redor: como a água tem constante dielétrica muito alta (ε ≈ 80) comparada ao ar (ε ≈ 1) e às partículas de solo seco (ε ≈ 4), a capacitância cresce fortemente com a umidade. Essa variação de capacitância altera a impedância do circuito, e um retificador converte o resultado em uma tensão contínua na saída analógica: quanto mais úmido o solo, menor a tensão. A conversão para percentual exige calibração de dois pontos — leitura com a sonda ao ar (solo totalmente seco) e submersa em água (100% de umidade).",
    especificacoes: [
      "Tensão de operação: 3,3 V a 5,5 V CC",
      "Saída analógica: 0 V a 3,0 V (com alimentação de 5 V)",
      "Corrente de operação: cerca de 5 mA",
      "Frequência do oscilador interno: aproximadamente 1,5 MHz",
      "Comprimento da sonda: 98 mm de área de medição",
      "Material: FR4 com verniz de proteção (sem eletrodos expostos)",
      "Requer calibração de dois pontos (seco e submerso) para leitura percentual"
    ],
    tipoSinal:
      "Analógico — tensão contínua inversamente proporcional à umidade do solo, lida por uma entrada de ADC. Em versões industriais, o mesmo princípio aparece com saída padronizada de 4-20 mA ou barramento SDI-12 e RS-485/Modbus.",
    aplicacoes: [
      "Irrigação automatizada em estufas, viveiros e lavouras (agricultura de precisão)",
      "Monitoramento de umidade do solo em áreas de risco geotécnico e taludes",
      "Controle de compactação e umidade em canteiros de obras",
      "Gestão hídrica em fazendas verticais e cultivo indoor",
      "Redes IoT agrícolas com transmissão LoRaWAN por longa distância"
    ],
    exemplo: {
      titulo: "Irrigação automática com calibração de dois pontos",
      descricao:
        "O programa converte a leitura bruta do ADC em percentual de umidade usando os valores de calibração medidos com a sonda seca e submersa. Quando a umidade cai abaixo de 35%, uma bomba é acionada por um tempo limitado, com bloqueio de segurança para evitar irrigação contínua em caso de falha do sensor.",
      ligacao: [
        "VCC → 5 V · GND → GND",
        "AOUT → entrada analógica A0",
        "Relé da bomba/válvula solenoide → pino digital 6",
        "Sonda enterrada verticalmente até a marca de nível máximo"
      ],
      codigo: `// --- Umidade do solo (capacitivo): irrigacao automatica ---
const int PINO_SOLO = A0;
const int BOMBA = 6;

// Valores de CALIBRACAO medidos com o proprio sensor:
const int LEITURA_SECO = 620;   // sonda ao ar livre
const int LEITURA_AGUA = 260;   // sonda submersa em agua

const int UMIDADE_MINIMA = 35;          // % para iniciar a irrigacao
const unsigned long TEMPO_IRRIGA = 8000; // 8 s de acionamento

void setup() {
  Serial.begin(9600);
  pinMode(BOMBA, OUTPUT);
}

void loop() {
  int leitura = analogRead(PINO_SOLO);

  // Converte a leitura bruta em percentual usando a calibracao.
  // Atencao: a leitura DIMINUI conforme a umidade AUMENTA.
  int umidade = map(leitura, LEITURA_SECO, LEITURA_AGUA, 0, 100);
  umidade = constrain(umidade, 0, 100);

  Serial.print("ADC: ");     Serial.print(leitura);
  Serial.print("  |  Umidade do solo: ");
  Serial.print(umidade);     Serial.println(" %");

  // Protecao: leitura fora da faixa esperada indica sensor solto ou danificado
  if (leitura > 700 || leitura < 200) {
    Serial.println("ALARME: verifique o sensor!");
    digitalWrite(BOMBA, LOW);
  } else if (umidade < UMIDADE_MINIMA) {
    Serial.println(">> Solo seco: irrigando...");
    digitalWrite(BOMBA, HIGH);
    delay(TEMPO_IRRIGA);
    digitalWrite(BOMBA, LOW);
    delay(30000);   // aguarda a agua se distribuir antes de medir de novo
  }

  delay(2000);
}`
    },
    fabricantes: [
      "Módulos Capacitive Soil Moisture Sensor v1.2 e v2.0 (DFRobot e genéricos)",
      "DFRobot — SEN0193 e SEN0308 (versão à prova d'água com cabo)",
      "Industriais: Sentek Drill & Drop, METER TEROS 12 e Irrometer Watermark (SDI-12 / 4-20 mA)"
    ]
  },

  /* ---------------------------------------------------------- 14 */
  {
    id: "fc37",
    nome: "Sensor de Chuva FC-37",
    categoria: "Chuva",
    sinal: "Analógico + Digital",
    imagem: "img/sensores/fc37.png",
    resumo:
      "Placa com trilhas condutoras interdigitadas que detecta a presença e a intensidade de água da chuva sobre a superfície.",
    conceito:
      "O FC-37 (também vendido como YL-83) é um detector de chuva formado por duas peças: uma placa coletora, exposta ao tempo, com trilhas de cobre em formato de pente entrelaçado, e um módulo comparador que condiciona o sinal. Quando gotas de água caem sobre a placa, elas fecham parcialmente o circuito entre as trilhas. É um sensor de detecção — indica se está chovendo e, aproximadamente, o quanto a superfície está molhada — e não um pluviômetro, que mede volume acumulado.",
    funcionamento:
      "As trilhas de cobre interdigitadas formam um circuito aberto quando a placa está seca (resistência praticamente infinita). A água da chuva, por conter sais dissolvidos, é levemente condutora: ao cobrir as trilhas, ela cria um caminho de corrente cuja resistência diminui à medida que a superfície molhada aumenta. Essa resistência forma um divisor de tensão com um resistor fixo no módulo, produzindo a saída analógica: placa seca resulta em tensão alta, placa encharcada em tensão baixa. Em paralelo, um comparador LM393 compara essa tensão com o valor ajustado no trimpot e chaveia a saída digital, permitindo um disparo imediato sem processamento. As trilhas sofrem corrosão com o tempo, por isso o módulo deve ser energizado apenas no momento da leitura em instalações permanentes.",
    especificacoes: [
      "Tensão de operação: 3,3 V a 5 V CC",
      "Saída analógica: 0 V (encharcado) a 5 V (seco)",
      "Saída digital: nível baixo quando o limiar de chuva é ultrapassado",
      "Área da placa coletora: aproximadamente 5 cm × 4 cm",
      "Comparador LM393 com trimpot de ajuste de sensibilidade",
      "Corrente de operação: menor que 20 mA",
      "LEDs indicadores de alimentação e de estado da saída digital"
    ],
    tipoSinal:
      "Duplo — analógico (AO) proporcional à área molhada e digital (DO) com limiar ajustável. A saída digital é ativa em nível baixo (LOW quando detecta chuva).",
    aplicacoes: [
      "Fechamento automático de janelas, claraboias e telhados retráteis",
      "Recolhimento automático de toldos e proteção de equipamentos ao tempo",
      "Estações meteorológicas e monitoramento agrícola conectado",
      "Bloqueio de sistemas de irrigação durante a chuva (economia de água)",
      "Detecção de vazamento e de infiltração em áreas técnicas e subestações"
    ],
    exemplo: {
      titulo: "Bloqueio inteligente de irrigação em dias de chuva",
      descricao:
        "O sensor classifica a condição em seco, garoa ou chuva forte a partir da leitura analógica. Enquanto houver chuva, o sistema de irrigação fica bloqueado e um servo motor fecha a cobertura de proteção da estufa — decisão automática típica de um sistema agrícola conectado.",
      ligacao: [
        "Placa coletora → módulo comparador (2 fios)",
        "VCC → 5 V · GND → GND",
        "AO → entrada analógica A1",
        "DO → pino digital 4 · Relé da irrigação → pino digital 5"
      ],
      codigo: `// --- FC-37: detector de chuva com bloqueio de irrigacao ---
const int PINO_AO = A1;
const int PINO_DO = 4;
const int RELE_IRRIGACAO = 5;

void setup() {
  Serial.begin(9600);
  pinMode(PINO_DO, INPUT);
  pinMode(RELE_IRRIGACAO, OUTPUT);
  digitalWrite(RELE_IRRIGACAO, HIGH);   // irrigacao liberada
}

void loop() {
  int leitura = analogRead(PINO_AO);      // 0 = encharcado, 1023 = seco
  bool chovendo = (digitalRead(PINO_DO) == LOW);  // DO ativo em nivel baixo

  Serial.print("Leitura: ");
  Serial.print(leitura);
  Serial.print("  ->  ");

  // Classificacao da intensidade a partir do sinal analogico
  if (leitura > 800) {
    Serial.println("SECO");
    digitalWrite(RELE_IRRIGACAO, HIGH);   // pode irrigar
  } else if (leitura > 400) {
    Serial.println("GAROA / UMIDADE");
    digitalWrite(RELE_IRRIGACAO, LOW);    // bloqueia por precaucao
  } else {
    Serial.println("CHUVA FORTE");
    digitalWrite(RELE_IRRIGACAO, LOW);
  }

  if (chovendo) Serial.println("   [saida digital: chuva detectada]");

  delay(1000);
}`
    },
    fabricantes: [
      "Módulos genéricos FC-37, YL-83 e YL-38 (placa + comparador)",
      "Versões automotivas: sensores de chuva ópticos por infravermelho (Bosch, Hella)",
      "Industriais/meteorológicos: pluviômetros de báscula Davis, Hidromec e sensores Vaisala"
    ]
  },

  /* ---------------------------------------------------------- 15 */
  {
    id: "boia",
    nome: "Sensor de Nível (Boia)",
    categoria: "Nível",
    sinal: "Digital (contato seco)",
    imagem: "img/sensores/boia.png",
    resumo:
      "Chave de nível que abre ou fecha um contato elétrico quando o flutuador é deslocado pelo líquido do reservatório.",
    conceito:
      "A chave de nível tipo boia é o sensor de nível mais simples, robusto e confiável que existe. Ela não mede o nível de forma contínua: apenas indica se o líquido está acima ou abaixo do ponto onde foi instalada. Por ser um contato puramente eletromecânico, funciona com qualquer tensão e é imune a interferência eletromagnética, o que a torna presente em praticamente todo reservatório, caixa d'água ou tanque industrial — tipicamente em pares, para nível mínimo e máximo.",
    funcionamento:
      "Nas boias magnéticas (as mais comuns em automação), um flutuador contendo um ímã anelar permanente desliza livremente ao longo de uma haste. Dentro da haste há uma ampola reed switch: duas lâminas ferromagnéticas seladas em vidro. Quando o líquido sobe e o flutuador se aproxima da ampola, o campo magnético do ímã magnetiza as lâminas, que se atraem e fecham o contato. Ao descer, o campo enfraquece e as lâminas se separam. Como não há contato entre o mecanismo e o circuito elétrico, o conjunto é totalmente selado e à prova d'água. Já a boia de contrapeso, usada em caixas d'água, é uma chave mecânica basculante acionada pela inclinação do flutuador. Em ambos os casos, o sensor entrega um contato seco (NA ou NF), sem tensão própria.",
    especificacoes: [
      "Tipo de contato: reed switch NA (normalmente aberto) ou NF, selecionável pela inversão do flutuador",
      "Tensão de comutação: até 100 V CC / 220 V CA (conforme o modelo)",
      "Corrente máxima de contato: 0,5 A a 3 A",
      "Materiais: haste e flutuador em PP, nylon, PVDF ou aço inoxidável",
      "Temperatura de operação: -10 °C a +80 °C (até 125 °C em modelos inox)",
      "Pressão máxima: até 10 bar em modelos industriais",
      "Vida útil elétrica: acima de 100.000 operações"
    ],
    tipoSinal:
      "Digital por contato seco — o sensor apenas abre ou fecha um circuito, sem fornecer tensão. No Arduino, liga-se entre o pino e o GND com resistor de pull-up (interno ou externo); em CLPs, conecta-se diretamente a uma entrada digital 24 V.",
    aplicacoes: [
      "Controle automático de bombas em caixas d'água e cisternas (nível mínimo e máximo)",
      "Proteção contra funcionamento a seco de bombas e motobombas",
      "Alarme de transbordo em tanques de processo e estações elevatórias",
      "Nível de óleo, líquido de arrefecimento e fluido hidráulico em máquinas",
      "Intertravamento de segurança em caldeiras e reservatórios de combate a incêndio"
    ],
    exemplo: {
      titulo: "Automação completa de bomba com duas boias e proteção a seco",
      descricao:
        "Uma boia no reservatório inferior (cisterna) protege a bomba contra funcionamento a seco e duas boias no reservatório superior definem os níveis de liga e desliga. O programa implementa o intertravamento completo com filtro de debounce para ignorar a ondulação da água.",
      ligacao: [
        "Boia da cisterna → pino digital 7 e GND (INPUT_PULLUP)",
        "Boia de nível mínimo da caixa → pino digital 8 e GND",
        "Boia de nível máximo da caixa → pino digital 9 e GND",
        "Relé da bomba → pino digital 10"
      ],
      codigo: `// --- Boia de nivel: automacao de bomba com protecao a seco ---
const int BOIA_CISTERNA = 7;   // ha agua para bombear?
const int BOIA_MINIMO   = 8;   // caixa superior no nivel minimo
const int BOIA_MAXIMO   = 9;   // caixa superior cheia
const int RELE_BOMBA    = 10;

bool bombaLigada = false;

// Le a boia com filtro de debounce (a agua ondula e gera falsos pulsos)
bool lerBoia(int pino) {
  bool estado = (digitalRead(pino) == LOW);  // LOW = contato fechado
  delay(50);
  return estado && (digitalRead(pino) == LOW);
}

void setup() {
  Serial.begin(9600);
  // INPUT_PULLUP dispensa resistores externos no contato seco
  pinMode(BOIA_CISTERNA, INPUT_PULLUP);
  pinMode(BOIA_MINIMO,   INPUT_PULLUP);
  pinMode(BOIA_MAXIMO,   INPUT_PULLUP);
  pinMode(RELE_BOMBA, OUTPUT);
}

void loop() {
  bool temAguaNaCisterna = lerBoia(BOIA_CISTERNA);
  bool atingiuMinimo     = lerBoia(BOIA_MINIMO);
  bool atingiuMaximo     = lerBoia(BOIA_MAXIMO);

  // Protecao: sem agua na cisterna, a bomba NUNCA liga
  if (!temAguaNaCisterna) {
    if (bombaLigada) Serial.println("PROTECAO: cisterna vazia!");
    bombaLigada = false;
  }
  else if (!atingiuMinimo && !bombaLigada) {
    bombaLigada = true;
    Serial.println("Nivel baixo -> bomba LIGADA");
  }
  else if (atingiuMaximo && bombaLigada) {
    bombaLigada = false;
    Serial.println("Caixa cheia -> bomba DESLIGADA");
  }

  digitalWrite(RELE_BOMBA, bombaLigada ? HIGH : LOW);
  delay(500);
}`
    },
    fabricantes: [
      "Boias magnéticas de haste: Margirius, Icos, Digimec e Coel",
      "Industriais: Gems Sensors, Madison Company e Sick (chaves de nível certificadas)",
      "Alternativas contínuas: sensores hidrostáticos de pressão e radar de nível (Vega, Endress+Hauser)"
    ]
  },

  /* ---------------------------------------------------------- 16 */
  {
    id: "yfs201",
    nome: "YF-S201",
    categoria: "Fluxo",
    sinal: "Digital (frequência)",
    imagem: "img/sensores/yfs201.png",
    resumo:
      "Sensor de vazão de água com turbina interna e sensor Hall, que gera pulsos proporcionais ao volume que passa pela tubulação.",
    conceito:
      "O YF-S201 é um medidor de vazão de água do tipo turbina, instalado em linha na tubulação. A água que passa gira um rotor interno, e cada volta produz pulsos elétricos que são contados pelo microcontrolador. Como a frequência dos pulsos é proporcional à vazão instantânea e o total de pulsos é proporcional ao volume acumulado, um único sensor fornece as duas informações — sendo a base de hidrômetros inteligentes e sistemas de dosagem.",
    funcionamento:
      "Dentro do corpo plástico existe um rotor de pás (turbina) com um pequeno ímã embutido. Ao passar pelo sensor, a água empurra as pás e o rotor gira com velocidade proporcional à vazão. Um sensor de efeito Hall montado do lado de fora do duto — isolado da água — detecta a passagem do ímã a cada volta e gera um pulso de onda quadrada. A relação entre a frequência dos pulsos e a vazão é dada pelo fator K do sensor: para o YF-S201, F (Hz) ≈ 7,5 × Q (L/min). Assim, contando os pulsos por segundo obtém-se a vazão instantânea, e integrando essa contagem no tempo obtém-se o volume total consumido.",
    especificacoes: [
      "Tensão de operação: 5 V a 18 V CC — corrente de 15 mA em 5 V",
      "Faixa de vazão: 1 L/min a 30 L/min",
      "Fator de conversão: frequência (Hz) = 7,5 × vazão (L/min)",
      "Precisão: ±10% (típica ±3% após calibração do fator K)",
      "Pressão máxima de trabalho: 1,75 MPa (17,5 bar)",
      "Rosca das conexões: 1/2 polegada macho (BSP)",
      "Temperatura do líquido: -25 °C a +80 °C"
    ],
    tipoSinal:
      "Digital por frequência — trem de pulsos de onda quadrada em coletor aberto, exigindo resistor de pull-up. É lido por interrupção externa no microcontrolador ou por entrada rápida de contagem (high-speed counter) no CLP.",
    aplicacoes: [
      "Hidrômetros inteligentes e telemetria de consumo de água em IoT",
      "Dosagem volumétrica de líquidos em processos industriais e envase",
      "Monitoramento de vazão em sistemas de refrigeração e torres de resfriamento",
      "Detecção de vazamentos por consumo anormal em horários de inatividade",
      "Controle de irrigação por volume aplicado (e não por tempo)"
    ],
    exemplo: {
      titulo: "Hidrômetro digital com vazão instantânea e volume acumulado",
      descricao:
        "O programa conta os pulsos do sensor por interrupção e, a cada segundo, calcula a vazão em litros por minuto e acumula o volume total em litros. Um alarme é gerado se houver consumo contínuo por muito tempo — indício clássico de vazamento na instalação.",
      ligacao: [
        "Fio vermelho (VCC) → 5 V",
        "Fio preto (GND) → GND",
        "Fio amarelo (sinal) → pino digital 2 (interrupção), com pull-up de 10 kΩ",
        "Sensor instalado com a seta do corpo no sentido do fluxo"
      ],
      codigo: `// --- YF-S201: hidrometro digital ---
const int PINO_FLUXO = 2;
const float FATOR_K = 7.5;   // pulsos por segundo para cada L/min

volatile unsigned int pulsos = 0;
float volumeTotal = 0.0;     // litros acumulados
unsigned long marcaTempo = 0;
int segundosComFluxo = 0;

// Interrupcao: chamada a cada volta da turbina
void contarPulso() {
  pulsos++;
}

void setup() {
  Serial.begin(9600);
  pinMode(PINO_FLUXO, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(PINO_FLUXO), contarPulso, FALLING);
  marcaTempo = millis();
}

void loop() {
  // Executa o calculo uma vez por segundo
  if (millis() - marcaTempo < 1000) return;
  marcaTempo = millis();

  // Copia e zera o contador com a interrupcao desabilitada
  detachInterrupt(digitalPinToInterrupt(PINO_FLUXO));
  unsigned int frequencia = pulsos;
  pulsos = 0;

  // Vazao instantanea a partir da frequencia dos pulsos
  float vazao = frequencia / FATOR_K;        // litros por minuto
  volumeTotal += vazao / 60.0;               // litros no ultimo segundo

  Serial.print("Vazao: ");   Serial.print(vazao, 2);
  Serial.print(" L/min  |  Volume total: ");
  Serial.print(volumeTotal, 3); Serial.println(" L");

  // Deteccao de vazamento: fluxo continuo por mais de 10 minutos
  if (vazao > 0.5) segundosComFluxo++;
  else             segundosComFluxo = 0;

  if (segundosComFluxo > 600) {
    Serial.println("ALERTA: consumo continuo - possivel vazamento!");
  }

  attachInterrupt(digitalPinToInterrupt(PINO_FLUXO), contarPulso, FALLING);
}`
    },
    fabricantes: [
      "YF-S201, YF-S401 (1/4 pol.) e YF-B5 (corpo metálico) — família de sensores de turbina",
      "Seeed Studio — G1/2 Water Flow Sensor (mesma base construtiva)",
      "Industriais: medidores eletromagnéticos e ultrassônicos da Endress+Hauser, Krohne e Siemens (saída 4-20 mA / Modbus)"
    ]
  },

  /* ---------------------------------------------------------- 17 */
  {
    id: "acs712",
    nome: "ACS712",
    categoria: "Corrente",
    sinal: "Analógico",
    imagem: "img/sensores/acs712.png",
    resumo:
      "Sensor de corrente por efeito Hall com isolação galvânica, capaz de medir corrente contínua e alternada sem contato elétrico com o circuito medido.",
    conceito:
      "O ACS712 é um sensor de corrente linear baseado no efeito Hall. A corrente a ser medida atravessa uma trilha de cobre interna ao próprio chip, e o sensor devolve uma tensão analógica proporcional a essa corrente. Sua característica mais importante é a isolação galvânica: o circuito de potência (que pode operar em 220 V) fica eletricamente separado do circuito de medição de 5 V, permitindo que um Arduino monitore com segurança cargas de alta tensão. Por medir tanto corrente contínua quanto alternada, é a base de medidores de energia, monitores de motores e sistemas de proteção contra sobrecarga.",
    funcionamento:
      "A corrente medida percorre um condutor de cobre de baixíssima resistência (1,2 mΩ) integrado ao encapsulamento. Toda corrente elétrica gera ao seu redor um campo magnético proporcional à sua intensidade (lei de Ampère). Um elemento Hall de silício posicionado logo abaixo desse condutor converte o campo magnético em uma pequena tensão, que é amplificada, filtrada e ajustada por um circuito interno. A saída é ratiométrica e fica centrada na metade da alimentação: com 5 V e corrente zero, a saída é de 2,5 V. A partir daí, a tensão sobe para correntes em um sentido e desce para o sentido oposto, na proporção definida pela sensibilidade do modelo (por exemplo, 185 mV por ampère na versão de 5 A).",
    especificacoes: [
      "Tensão de alimentação: 5 V CC — corrente de consumo de 10 mA",
      "Versões: 5 A (185 mV/A), 20 A (100 mV/A) e 30 A (66 mV/A)",
      "Saída em repouso (0 A): VCC/2 = 2,5 V",
      "Mede corrente contínua (CC) e alternada (CA)",
      "Isolação: 2,1 kVRMS entre o circuito de potência e a saída",
      "Resistência do condutor interno: 1,2 mΩ (baixa perda por aquecimento)",
      "Largura de banda: até 80 kHz — tempo de resposta de 5 µs",
      "Erro típico: ±1,5% a 25 °C"
    ],
    tipoSinal:
      "Analógico — tensão contínua proporcional à corrente, lida por uma entrada ADC (A0 a A5 no Arduino). Por ser ratiométrica, a leitura depende da estabilidade da alimentação de 5 V. Em ambiente industrial, o equivalente é o transdutor de corrente com saída padronizada de 4-20 mA.",
    aplicacoes: [
      "Monitoramento de consumo elétrico e submedição de energia em IoT",
      "Proteção de motores contra sobrecarga, subcarga e rotor travado",
      "Manutenção preditiva pela assinatura de corrente do motor (análise MCSA)",
      "Controle de carga e descarga de baterias em sistemas solares",
      "Detecção de falha de fase e de queima de resistências em fornos industriais"
    ],
    exemplo: {
      titulo: "Monitor de corrente de motor com proteção contra sobrecarga",
      descricao:
        "O ACS712 mede a corrente de um motor e o Arduino calcula o valor eficaz (RMS) a partir de uma janela de amostras. Se a corrente ultrapassar o limite nominal por mais de 3 segundos, um relé desliga a carga — evitando desarmes indevidos causados pelo pico de partida do motor.",
      ligacao: [
        "VCC → 5 V do Arduino",
        "GND → GND",
        "OUT → pino analógico A0",
        "Terminais verdes (IP+ e IP-) → em SÉRIE com a carga a ser medida",
        "Relé de proteção → pino digital 7"
      ],
      codigo: `// --- ACS712: medicao de corrente RMS com protecao ---
const int PINO_SENSOR = A0;
const int PINO_RELE   = 7;

const float SENSIBILIDADE = 0.185;  // V/A -> 185 mV/A (versao 5 A)
const float CORRENTE_MAX  = 4.0;    // limite de protecao em amperes
float offset = 2.5;                 // tensao de saida com 0 A

// Le uma janela de amostras e devolve a corrente eficaz (RMS)
float lerCorrenteRMS() {
  float somaQuadrados = 0;
  const int AMOSTRAS = 500;

  for (int i = 0; i < AMOSTRAS; i++) {
    // Converte a leitura de 10 bits (0-1023) para volts
    float tensao = analogRead(PINO_SENSOR) * (5.0 / 1023.0);
    float corrente = (tensao - offset) / SENSIBILIDADE;
    somaQuadrados += corrente * corrente;
    delayMicroseconds(200);
  }
  return sqrt(somaQuadrados / AMOSTRAS);
}

void setup() {
  Serial.begin(9600);
  pinMode(PINO_RELE, OUTPUT);
  digitalWrite(PINO_RELE, HIGH);   // carga ligada

  // Calibracao: mede o offset real com a carga desligada
  long soma = 0;
  for (int i = 0; i < 1000; i++) soma += analogRead(PINO_SENSOR);
  offset = (soma / 1000.0) * (5.0 / 1023.0);
  Serial.print("Offset calibrado: "); Serial.println(offset, 3);
}

void loop() {
  static int segundosAcima = 0;
  float corrente = lerCorrenteRMS();

  Serial.print("Corrente: ");
  Serial.print(corrente, 2);
  Serial.println(" A");

  // A sobrecarga so desarma se persistir - ignora o pico de partida
  if (corrente > CORRENTE_MAX) segundosAcima++;
  else                         segundosAcima = 0;

  if (segundosAcima >= 3) {
    digitalWrite(PINO_RELE, LOW);
    Serial.println("SOBRECARGA! Carga desligada pela protecao.");
  }
  delay(1000);
}`
    },
    fabricantes: [
      "Allegro MicroSystems — fabricante original das famílias ACS712, ACS758 (200 A) e ACS37800",
      "Módulos prontos ACS712ELCTR-05B-T, -20A-T e -30A-T (placa azul com bornes)",
      "Alternativas industriais: transdutores de corrente Weg, Schneider Electric e Sense (saída 4-20 mA)"
    ]
  },

  /* ---------------------------------------------------------- 18 */
  {
    id: "zmpt",
    nome: "ZMPT101B",
    categoria: "Tensão",
    sinal: "Analógico",
    imagem: "img/sensores/zmpt.png",
    resumo:
      "Módulo sensor de tensão alternada com transformador de precisão, usado para medir a tensão da rede elétrica com isolação total.",
    conceito:
      "O ZMPT101B é um módulo para medição de tensão alternada (CA) construído em torno de um transformador de tensão de precisão. Ele reduz a tensão da rede elétrica — 127 V ou 220 V — a um nível seguro que pode ser lido pela entrada analógica de um microcontrolador. Como o acoplamento é magnético, existe isolação galvânica completa entre a rede e o circuito de baixa tensão. Junto com o ACS712, forma a dupla clássica de medidores de energia em IoT: um mede a tensão, o outro a corrente, e o produto dos dois fornece a potência consumida.",
    funcionamento:
      "O coração do módulo é um transformador de precisão do tipo corrente-corrente (2 mA : 2 mA) com alta linearidade e baixo defasamento angular. A tensão da rede é aplicada ao primário através de um resistor limitador, o que converte a tensão em uma corrente proporcional de poucos miliampères. O secundário reproduz essa corrente, que é transformada de volta em tensão por um resistor de carga. Como o microcontrolador não lê tensões negativas, um amplificador operacional na placa soma um nível contínuo de VCC/2 ao sinal: a senoide passa a oscilar em torno de 2,5 V. Um trimpot multivoltas ajusta o ganho. O firmware amostra rapidamente a forma de onda, subtrai o offset, eleva cada amostra ao quadrado e extrai a raiz da média — obtendo o valor eficaz (RMS) da tensão.",
    especificacoes: [
      "Tensão de alimentação do módulo: 5 V CC (versões 3,3 V disponíveis)",
      "Faixa de medição: até 250 V CA (com o resistor limitador padrão)",
      "Relação do transformador: 1000:1000 (2 mA : 2 mA)",
      "Saída analógica centrada em VCC/2, com amplitude ajustável por trimpot",
      "Linearidade: melhor que 0,2% — defasagem angular menor que 20'",
      "Faixa de frequência: 50 Hz / 60 Hz",
      "Isolação: transformador com rigidez dielétrica de 3000 V"
    ],
    tipoSinal:
      "Analógico — senoide de baixa amplitude sobreposta a um nível CC de VCC/2, lida por uma entrada ADC. Exige amostragem rápida (centenas de leituras por ciclo) para o cálculo correto do valor RMS. Em quadros industriais, a função equivalente é feita por multimedidores de energia com saída Modbus RTU.",
    aplicacoes: [
      "Medidores de energia e submedição por setor da planta industrial (IoT energético)",
      "Detecção de subtensão, sobretensão e falta de fase em quadros de distribuição",
      "Monitoramento da qualidade da energia elétrica e proteção de equipamentos sensíveis",
      "Sistemas de nobreak, geradores e transferência automática de fonte",
      "Cálculo de potência ativa e fator de potência quando combinado ao ACS712"
    ],
    exemplo: {
      titulo: "Monitor de tensão da rede com alarme de subtensão e sobretensão",
      descricao:
        "O Arduino amostra a forma de onda durante alguns ciclos completos, calcula a tensão eficaz e a compara com a faixa aceitável da rede. Fora da faixa, aciona um alerta — o mesmo princípio usado por protetores eletrônicos de geladeiras e servidores. ATENÇÃO: o primário do módulo é ligado diretamente à rede elétrica; a montagem exige circuito desenergizado, isolação adequada e acompanhamento do docente.",
      ligacao: [
        "VCC → 5 V do Arduino",
        "GND → GND",
        "OUT → pino analógico A0",
        "Terminais do primário → fase e neutro da rede (com fusível de proteção)",
        "Trimpot ajustado até a saída ficar em ~2,5 V com a rede desligada"
      ],
      codigo: `// --- ZMPT101B: medicao de tensao eficaz (RMS) da rede ---
const int PINO_SENSOR = A0;

// Constante obtida na calibracao com um multimetro de referencia
const float FATOR_CALIBRACAO = 0.35;
const float TENSAO_MINIMA = 198.0;   // limite inferior para rede 220 V
const float TENSAO_MAXIMA = 242.0;   // limite superior para rede 220 V

float lerTensaoRMS() {
  float somaQuadrados = 0;
  int amostras = 0;
  unsigned long inicio = millis();

  // Amostra por 200 ms = 12 ciclos completos em 60 Hz
  while (millis() - inicio < 200) {
    int leitura = analogRead(PINO_SENSOR);
    // Remove o nivel CC de 512 (equivalente a 2,5 V)
    float valor = leitura - 512.0;
    somaQuadrados += valor * valor;
    amostras++;
  }

  float rmsBruto = sqrt(somaQuadrados / amostras);
  return rmsBruto * FATOR_CALIBRACAO;
}

void setup() {
  Serial.begin(9600);
}

void loop() {
  float tensao = lerTensaoRMS();

  Serial.print("Tensao da rede: ");
  Serial.print(tensao, 1);
  Serial.print(" V -> ");

  if (tensao < TENSAO_MINIMA) {
    Serial.println("SUBTENSAO! Risco para motores e compressores.");
  } else if (tensao > TENSAO_MAXIMA) {
    Serial.println("SOBRETENSAO! Risco para equipamentos eletronicos.");
  } else {
    Serial.println("tensao normal.");
  }
  delay(1000);
}`
    },
    fabricantes: [
      "Qingxian Zeming Langxi Electronic — fabricante original do transformador ZMPT101B",
      "Módulos comerciais ZMPT101B V1.0 (placa azul com trimpot multivoltas)",
      "Alternativas: transformadores ZMPT107, sensores de tensão Hall LV 25-P (LEM) e multimedidores Weg MMW03"
    ]
  },

  /* ---------------------------------------------------------- 19 */
  {
    id: "sw420",
    nome: "SW-420",
    categoria: "Vibração",
    sinal: "Digital",
    imagem: "img/sensores/sw420.png",
    resumo:
      "Módulo detector de vibração e impacto com sensibilidade ajustável, usado em alarmes e monitoramento de máquinas rotativas.",
    conceito:
      "O SW-420 é um sensor de vibração do tipo interruptor mecânico. Diferente de um acelerômetro, ele não mede a intensidade nem a direção da vibração: apenas informa se houve movimento acima de um limiar ajustável. Essa simplicidade o torna barato e imediato de usar, sendo aplicado em alarmes contra violação, detecção de impacto em transporte de cargas e, na indústria, como indicador de anormalidade em máquinas que deveriam operar suavemente.",
    funcionamento:
      "Dentro de um pequeno cilindro metálico existe uma mola condutora envolvendo um eletrodo central. Em repouso, a mola encosta no eletrodo e o circuito permanece fechado (nível lógico baixo). Quando o conjunto sofre vibração ou impacto, a mola oscila e perde momentaneamente o contato, abrindo e fechando o circuito rapidamente e produzindo um trem de pulsos irregulares. Na placa, esse sinal alimenta um comparador LM393: o trimpot define a tensão de referência, ou seja, o limiar de sensibilidade, e a saída DO comuta para nível alto sempre que a vibração ultrapassa esse limiar. Um LED indicador na placa acende junto com o disparo.",
    especificacoes: [
      "Tensão de operação: 3,3 V a 5 V CC",
      "Saída digital (DO) via comparador LM393 — nível TTL",
      "Sensibilidade ajustável por trimpot de 10 kΩ",
      "Estado em repouso: contato fechado (nível lógico baixo)",
      "Tempo de resposta: menor que 0,1 ms",
      "Corrente de saída: até 15 mA",
      "Não direcional — responde a vibração em qualquer eixo",
      "Temperatura de operação: -40 °C a +85 °C"
    ],
    tipoSinal:
      "Digital — saída binária de dois estados (com vibração / sem vibração), lida por entrada digital comum ou, preferencialmente, por interrupção externa para contar eventos sem travar o programa. Não fornece amplitude nem frequência: quando o projeto exige análise de vibração real, usa-se um acelerômetro (MPU-6050, ADXL345) ou um transdutor industrial de 4-20 mA.",
    aplicacoes: [
      "Manutenção preditiva: detecção de desbalanceamento e desalinhamento em motores e bombas",
      "Alarmes contra violação de painéis, cofres, caixas eletrônicos e equipamentos",
      "Monitoramento de impacto no transporte e na movimentação de cargas frágeis",
      "Desligamento de segurança de máquinas com vibração anormal",
      "Detecção de funcionamento (liga/desliga) de equipamentos sem acesso ao circuito elétrico"
    ],
    exemplo: {
      titulo: "Monitor de vibração de motor para manutenção preditiva",
      descricao:
        "O sensor é fixado na carcaça de um motor. O Arduino conta os eventos de vibração em janelas de 10 segundos: uma contagem baixa indica operação normal, e uma contagem elevada sinaliza desbalanceamento ou desgaste de rolamento — a informação que, em um sistema IoT, seria publicada por MQTT para o painel de manutenção.",
      ligacao: [
        "VCC → 5 V do Arduino",
        "GND → GND",
        "DO → pino digital 2 (entrada de interrupção)",
        "LED de alerta → pino digital 8",
        "Módulo fixado rigidamente na carcaça do motor"
      ],
      codigo: `// --- SW-420: contagem de eventos de vibracao ---
const int PINO_SW420 = 2;
const int LED_ALERTA = 8;

const int LIMITE_ALERTA = 50;   // eventos por janela de 10 s

volatile unsigned int eventos = 0;
unsigned long marcaTempo = 0;

// Interrupcao: incrementa a cada pulso do sensor
void registrarVibracao() {
  eventos++;
}

void setup() {
  Serial.begin(9600);
  pinMode(PINO_SW420, INPUT);
  pinMode(LED_ALERTA, OUTPUT);
  attachInterrupt(digitalPinToInterrupt(PINO_SW420), registrarVibracao, RISING);
  marcaTempo = millis();
}

void loop() {
  // Fecha a janela de medicao a cada 10 segundos
  if (millis() - marcaTempo < 10000) return;
  marcaTempo = millis();

  noInterrupts();
  unsigned int total = eventos;
  eventos = 0;
  interrupts();

  Serial.print("Eventos de vibracao (10 s): ");
  Serial.print(total);

  if (total > LIMITE_ALERTA) {
    digitalWrite(LED_ALERTA, HIGH);
    Serial.println(" -> ALERTA: vibracao acima do normal!");
  } else {
    digitalWrite(LED_ALERTA, LOW);
    Serial.println(" -> operacao normal.");
  }
}`
    },
    fabricantes: [
      "Sensor SW-420 e variante SW-18010P (mais sensível) — fabricação genérica asiática",
      "Módulos KY-002 e KY-031 (versões com encapsulamento diferente do mesmo princípio)",
      "Alternativas industriais: transmissores de vibração SKF, IFM Electronic e Banner (saída 4-20 mA / IO-Link)"
    ]
  },

  /* ---------------------------------------------------------- 20 */
  {
    id: "hall",
    nome: "Sensor Hall A3144",
    categoria: "Rotação",
    sinal: "Digital",
    imagem: "img/sensores/hall.png",
    resumo:
      "Chave magnética de efeito Hall que detecta a aproximação de um ímã, usada em tacômetros, contadores de voltas e fim de curso sem contato.",
    conceito:
      "O A3144 é um sensor de efeito Hall do tipo interruptor: ele não mede a intensidade do campo magnético, apenas comuta a saída quando um ímã se aproxima o suficiente. Por não haver contato mecânico, tem vida útil praticamente ilimitada e é imune a poeira, água e sujeira — vantagem decisiva sobre chaves de contato. É a solução padrão para medir a velocidade de rotação de motores, eixos e ventiladores, bastando fixar um ímã na parte girante.",
    funcionamento:
      "Uma corrente elétrica atravessa uma fina lâmina de material semicondutor. Quando um campo magnético perpendicular incide sobre ela, a força de Lorentz desvia lateralmente os portadores de carga, criando uma diferença de potencial entre as bordas da lâmina — é a tensão Hall, proporcional à intensidade do campo. No A3144, essa tensão é amplificada e comparada com um limiar por um circuito Schmitt trigger, o que garante uma comutação limpa, sem oscilação. O sensor é unipolar: responde apenas ao polo sul do ímã. A saída é do tipo coletor aberto — o chip só consegue puxar a linha para o nível baixo, exigindo resistor de pull-up (já presente nos módulos prontos). Para medir rotação, conta-se quantos pulsos ocorrem por segundo e multiplica-se por 60 para obter o valor em RPM.",
    especificacoes: [
      "Tensão de operação: 4,5 V a 24 V CC (ampla faixa)",
      "Corrente de alimentação: 9 mA (típica)",
      "Saída em coletor aberto: suporta até 25 mA",
      "Sensor unipolar — comuta com o polo sul do ímã",
      "Frequência de operação: até 100 kHz",
      "Tempos de subida e descida: menores que 0,5 µs",
      "Temperatura de operação: -40 °C a +150 °C",
      "Encapsulamento TO-92 de 3 pinos"
    ],
    tipoSinal:
      "Digital em coletor aberto — trem de pulsos cuja frequência é proporcional à rotação. Lido por interrupção externa no microcontrolador ou por entrada rápida de contagem no CLP. Não confundir com os sensores Hall lineares (como o do ACS712), que fornecem saída analógica proporcional ao campo.",
    aplicacoes: [
      "Tacômetros e medição de RPM de motores, eixos e ventiladores",
      "Contagem de peças e de voltas em esteiras e roletes",
      "Fim de curso e detecção de posição sem contato em cilindros pneumáticos",
      "Sensores de velocidade em veículos, bicicletas e sistemas ABS",
      "Detecção de abertura de portas e tampas em sistemas de intertravamento de segurança"
    ],
    exemplo: {
      titulo: "Tacômetro digital com detecção de motor parado",
      descricao:
        "Um ímã é fixado no eixo do motor e o sensor Hall é posicionado a poucos milímetros dele. Cada volta gera um pulso; o Arduino conta os pulsos em janelas de 1 segundo e converte para RPM. Se nenhum pulso for detectado com o motor acionado, o sistema sinaliza rotor travado — falha crítica que causa a queima do enrolamento.",
      ligacao: [
        "VCC → 5 V do Arduino",
        "GND → GND",
        "OUT → pino digital 2 (com pull-up de 10 kΩ, se sensor puro)",
        "Ímã de neodímio fixado no eixo, com folga de 3 a 5 mm do sensor"
      ],
      codigo: `// --- Sensor Hall A3144: tacometro digital (RPM) ---
const int PINO_HALL = 2;
const int IMAS_POR_VOLTA = 1;   // quantidade de imas fixados no eixo

volatile unsigned int pulsos = 0;
unsigned long marcaTempo = 0;

// Interrupcao: chamada a cada passagem do ima
void contarPulso() {
  pulsos++;
}

void setup() {
  Serial.begin(9600);
  pinMode(PINO_HALL, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(PINO_HALL), contarPulso, FALLING);
  marcaTempo = millis();
}

void loop() {
  // Calcula a rotacao uma vez por segundo
  if (millis() - marcaTempo < 1000) return;
  marcaTempo = millis();

  noInterrupts();
  unsigned int total = pulsos;
  pulsos = 0;
  interrupts();

  // pulsos por segundo x 60 = rotacoes por minuto
  int rpm = (total * 60) / IMAS_POR_VOLTA;

  Serial.print("Rotacao: ");
  Serial.print(rpm);
  Serial.println(" RPM");

  if (rpm == 0) {
    Serial.println("ALERTA: eixo parado - verificar rotor travado!");
  }
}`
    },
    fabricantes: [
      "Allegro MicroSystems — A3144, A1104 e família de chaves Hall",
      "Honeywell — série SS400 e SS500 de sensores Hall digitais",
      "Módulos prontos KY-003 (Hall digital) e KY-024 (Hall linear com saída analógica)",
      "Industriais: sensores de rotação Pepperl+Fuchs, IFM e Turck com saída PNP/NPN"
    ]
  },

  /* ---------------------------------------------------------- 21 */
  {
    id: "mfrc522",
    nome: "MFRC522 (RFID)",
    categoria: "RFID",
    sinal: "SPI",
    imagem: "img/sensores/mfrc522.png",
    resumo:
      "Leitor e gravador RFID de 13,56 MHz compatível com cartões MIFARE, usado em controle de acesso e identificação automática de itens.",
    conceito:
      "O MFRC522 é um módulo de identificação por radiofrequência (RFID) que lê e grava dados em cartões e tags que operam em 13,56 MHz, seguindo o padrão ISO/IEC 14443A — o mesmo dos cartões MIFARE. RFID é uma das tecnologias fundacionais da Internet das Coisas: ela dá a cada objeto físico uma identidade digital única, permitindo rastrear peças, ferramentas e pessoas sem digitação manual e sem contato. Na indústria, é o que permite saber, automaticamente, qual produto está em qual estação da linha de produção.",
    funcionamento:
      "A antena impressa na placa gera um campo eletromagnético de 13,56 MHz. Quando uma tag entra nesse campo, a bobina interna do cartão capta a energia por indução e alimenta seu próprio chip — por isso as tags são passivas, sem bateria. Energizado, o chip do cartão responde modulando a carga sobre o campo do leitor, técnica chamada modulação de carga, que o MFRC522 detecta e decodifica. O diálogo segue o protocolo ISO 14443A: o leitor emite um comando de requisição, as tags presentes respondem, um procedimento de anticolisão isola uma única tag e obtém seu UID (identificador único de fábrica), e então é possível autenticar um setor com chave criptográfica e ler ou gravar seus blocos de dados. O módulo conversa com o microcontrolador por SPI, atuando como escravo.",
    especificacoes: [
      "Tensão de operação: 3,3 V CC — os pinos NÃO são tolerantes a 5 V",
      "Frequência de trabalho: 13,56 MHz (padrão ISO/IEC 14443A)",
      "Distância de leitura: 0 a 60 mm (típica de 25 mm)",
      "Corrente: 13 a 26 mA em operação e 10 µA em modo de repouso",
      "Cartões suportados: MIFARE Classic 1K/4K, MIFARE Ultralight e NTAG",
      "Taxa de transferência SPI: até 10 Mbit/s",
      "Memória típica do cartão: 1 KB em 16 setores de 4 blocos",
      "Interfaces disponíveis no chip: SPI, I2C e UART (módulos vêm em SPI)"
    ],
    tipoSinal:
      "SPI — barramento síncrono de 4 fios (SCK, MOSI, MISO e SS), com o Arduino operando como mestre. Permite altas velocidades e vários dispositivos no mesmo barramento, cada um com seu próprio pino SS. Atenção ao nível lógico: o módulo é de 3,3 V e deve ser alimentado pelo pino 3V3 do Arduino, nunca pelo de 5 V.",
    aplicacoes: [
      "Controle de acesso a áreas restritas, catracas e armários de ferramentas",
      "Identificação de operadores e liberação de máquinas conforme habilitação",
      "Rastreabilidade de peças, paletes e ordens de produção na linha de montagem",
      "Controle de estoque e inventário automatizado em almoxarifados",
      "Registro de ponto e sistemas de bilhetagem em transporte público"
    ],
    exemplo: {
      titulo: "Controle de acesso com liberação por cartão autorizado",
      descricao:
        "O leitor aguarda a aproximação de um cartão, lê seu UID e o compara com uma lista de identificadores autorizados. Sendo válido, aciona um relé que destrava a fechadura elétrica por 3 segundos e registra o evento; sendo inválido, sinaliza a negativa. Em um sistema IoT real, o UID seria consultado em um servidor e cada acesso enviado à nuvem.",
      ligacao: [
        "VCC (3,3 V) → pino 3V3 do Arduino — NUNCA em 5 V",
        "GND → GND | RST → pino digital 9 | SDA (SS) → pino digital 10",
        "MOSI → pino 11 | MISO → pino 12 | SCK → pino 13",
        "Relé da fechadura → pino digital 4",
        "LED verde → pino 5 | LED vermelho → pino 6"
      ],
      codigo: `// --- MFRC522: controle de acesso por RFID ---
// Biblioteca: "MFRC522" (Miguel Balboa)
#include <SPI.h>
#include <MFRC522.h>

#define PINO_SS  10
#define PINO_RST 9

const int RELE = 4, LED_VERDE = 5, LED_VERMELHO = 6;

MFRC522 leitor(PINO_SS, PINO_RST);

// Lista de UIDs autorizados (4 bytes cada)
byte autorizados[][4] = {
  {0xA1, 0xB2, 0xC3, 0xD4},
  {0x12, 0x34, 0x56, 0x78}
};
const int TOTAL_AUTORIZADOS = 2;

// Compara o UID lido com a lista de cartoes liberados
bool cartaoAutorizado(byte *uid, byte tamanho) {
  if (tamanho != 4) return false;

  for (int i = 0; i < TOTAL_AUTORIZADOS; i++) {
    bool igual = true;
    for (int j = 0; j < 4; j++) {
      if (uid[j] != autorizados[i][j]) { igual = false; break; }
    }
    if (igual) return true;
  }
  return false;
}

void setup() {
  Serial.begin(9600);
  SPI.begin();            // inicia o barramento SPI
  leitor.PCD_Init();      // inicia o modulo RFID

  pinMode(RELE, OUTPUT);
  pinMode(LED_VERDE, OUTPUT);
  pinMode(LED_VERMELHO, OUTPUT);
  Serial.println("Aproxime o cartao do leitor...");
}

void loop() {
  // Verifica se ha um novo cartao no campo do leitor
  if (!leitor.PICC_IsNewCardPresent()) return;
  if (!leitor.PICC_ReadCardSerial()) return;

  Serial.print("UID lido: ");
  for (byte i = 0; i < leitor.uid.size; i++) {
    Serial.print(leitor.uid.uidByte[i], HEX);
    Serial.print(" ");
  }
  Serial.println();

  if (cartaoAutorizado(leitor.uid.uidByte, leitor.uid.size)) {
    Serial.println("ACESSO LIBERADO");
    digitalWrite(LED_VERDE, HIGH);
    digitalWrite(RELE, HIGH);       // destrava a fechadura
    delay(3000);
    digitalWrite(RELE, LOW);
    digitalWrite(LED_VERDE, LOW);
  } else {
    Serial.println("ACESSO NEGADO");
    digitalWrite(LED_VERMELHO, HIGH);
    delay(1500);
    digitalWrite(LED_VERMELHO, LOW);
  }

  leitor.PICC_HaltA();          // encerra a comunicacao com o cartao
  leitor.PCD_StopCrypto1();
}`
    },
    fabricantes: [
      "NXP Semiconductors — fabricante do chip MFRC522 e da tecnologia MIFARE",
      "Módulos comerciais RC522 (kit com cartão e chaveiro) e RFID-RC522 da Sunfounder",
      "Alternativas: PN532 (com suporte a NFC), RDM6300 (125 kHz) e leitores industriais Balluff, IFM e Turck com saída IO-Link"
    ]
  },

  /* ---------------------------------------------------------- 22 */
  {
    id: "hx711",
    nome: "Célula de Carga + HX711",
    categoria: "Peso",
    sinal: "Digital",
    imagem: "img/sensores/hx711.png",
    resumo:
      "Conjunto formado por uma célula de carga com extensômetros e um conversor A/D de 24 bits, base de balanças e sistemas de pesagem industrial.",
    conceito:
      "A célula de carga é um transdutor que converte força ou peso em um sinal elétrico. Sozinha, ela gera uma variação de tensão da ordem de poucos milivolts — pequena demais para ser lida diretamente pelo conversor A/D de 10 bits do Arduino. Por isso ela é usada em conjunto com o HX711, um amplificador e conversor analógico-digital de 24 bits projetado especificamente para pontes de extensômetros. O par célula + HX711 é o padrão de fato para pesagem em projetos eletrônicos, de balanças de bancada a silos e dosadores industriais.",
    funcionamento:
      "A célula é um bloco metálico que se deforma elasticamente sob carga. Colados a ele há extensômetros (strain gauges) — grades condutoras cuja resistência elétrica varia quando são esticadas ou comprimidas. Quatro deles formam uma ponte de Wheatstone: dois se alongam e dois se contraem, o que desequilibra a ponte e produz entre suas saídas uma tensão diferencial proporcional ao peso, tipicamente 2 mV para cada volt de excitação em carga máxima. O HX711 alimenta a ponte, amplifica esse sinal diferencial com ganho de até 128 vezes e o digitaliza em 24 bits, alcançando resolução suficiente para distinguir gramas em uma escala de dezenas de quilos. A comunicação com o microcontrolador é feita por dois fios (DT e SCK) com protocolo serial próprio. Para transformar a leitura bruta em unidade de massa, o sistema precisa ser calibrado com um peso conhecido e ter a tara descontada.",
    especificacoes: [
      "HX711 — alimentação: 2,6 V a 5,5 V CC, consumo menor que 1,5 mA",
      "Conversor A/D de 24 bits com ganho selecionável de 32, 64 ou 128",
      "Taxa de amostragem: 10 SPS ou 80 SPS (selecionável)",
      "Células comuns: 1 kg, 5 kg, 10 kg, 20 kg, 50 kg e 200 kg",
      "Sensibilidade típica da célula: 1,0 a 2,0 mV/V",
      "Precisão da célula: 0,05% da carga máxima (classe C3 em modelos industriais)",
      "Tensão de excitação da ponte: 5 V (fornecida pelo HX711)",
      "Ligação padrão de 4 fios: E+ (vermelho), E- (preto), A+ (branco), A- (verde)"
    ],
    tipoSinal:
      "Digital — protocolo serial síncrono proprietário de 2 fios (DT para dados e SCK para clock), não compatível com I2C nem SPI. O sinal original da célula é analógico diferencial da ordem de milivolts. Em pesagem industrial, o equivalente são os indicadores e transmissores de peso com saída 4-20 mA, Modbus RTU ou Profibus.",
    aplicacoes: [
      "Balanças industriais, comerciais e de bancada",
      "Dosagem gravimétrica de insumos em processos de mistura e envase",
      "Monitoramento de nível por peso em silos, tanques e tolvas",
      "Controle de estoque automatizado por variação de massa em prateleiras inteligentes",
      "Ensaios de força, tração e compressão em bancadas de teste"
    ],
    exemplo: {
      titulo: "Balança digital com tara e alarme de dosagem",
      descricao:
        "Após a calibração com um peso conhecido, o sistema exibe a massa em gramas e permite zerar a tara para descontar o recipiente. Ao atingir a massa alvo da receita, um alerta é acionado para interromper a alimentação do produto — princípio direto das dosadoras gravimétricas industriais.",
      ligacao: [
        "Célula: vermelho → E+ | preto → E- | branco → A- | verde → A+",
        "HX711 VCC → 5 V do Arduino | GND → GND",
        "HX711 DT → pino digital 3 | SCK → pino digital 2",
        "Buzzer de alerta → pino digital 8",
        "Célula fixada em um lado e com a carga aplicada no outro (viga em balanço)"
      ],
      codigo: `// --- Celula de carga + HX711: balanca digital ---
// Biblioteca: "HX711" (Bogdan Necula)
#include <HX711.h>

const int PINO_DT  = 3;
const int PINO_SCK = 2;
const int BUZZER   = 8;

// Fator obtido na calibracao: leitura bruta dividida pelo peso real
const float FATOR_CALIBRACAO = 420.5;
const float PESO_ALVO = 250.0;   // massa desejada em gramas

HX711 balanca;

void setup() {
  Serial.begin(9600);
  pinMode(BUZZER, OUTPUT);

  balanca.begin(PINO_DT, PINO_SCK);
  balanca.set_scale(FATOR_CALIBRACAO);  // aplica o fator de calibracao
  balanca.tare();                       // zera com a balanca vazia

  Serial.println("Balanca pronta. Coloque o produto.");
}

void loop() {
  // Media de 10 leituras para reduzir o ruido
  float peso = balanca.get_units(10);

  Serial.print("Peso: ");
  Serial.print(peso, 1);
  Serial.println(" g");

  // Dosagem atingida: sinaliza para interromper a alimentacao
  if (peso >= PESO_ALVO) {
    Serial.println("DOSAGEM COMPLETA - interromper alimentacao!");
    digitalWrite(BUZZER, HIGH);
    delay(500);
    digitalWrite(BUZZER, LOW);
  }
  delay(500);
}`
    },
    fabricantes: [
      "Avia Semiconductor — fabricante do conversor HX711",
      "Células de carga: Alfa Instrumentos, Líder Balanças e HBM (modelos industriais certificados)",
      "Módulos prontos: HX711 vermelho e verde (placas de 2 e 4 canais)",
      "Alternativas: conversores NAU7802 (I2C) e indicadores de pesagem Weg e Toledo com saída 4-20 mA"
    ]
  },

  /* ---------------------------------------------------------- 23 */
  {
    id: "ky037",
    nome: "KY-037",
    categoria: "Som",
    sinal: "Analógico + Digital",
    imagem: "img/sensores/ky037.png",
    resumo:
      "Módulo sensor de som com microfone de eletreto, que fornece tanto o nível sonoro analógico quanto um disparo digital por limiar ajustável.",
    conceito:
      "O KY-037 é um módulo detector de som formado por um microfone de eletreto e um circuito comparador. Ele oferece duas saídas simultâneas: uma analógica, que acompanha a intensidade do som captado, e uma digital, que muda de estado quando o ruído ultrapassa um limiar ajustado no trimpot. Não é um decibelímetro calibrado — mede variação relativa de intensidade —, mas atende bem a aplicações de detecção de ruído anormal em máquinas, acionamento por palma e monitoramento ambiental em IoT.",
    funcionamento:
      "A cápsula de eletreto contém um diafragma metalizado sobre uma placa com carga elétrica permanente, formando um capacitor. As ondas sonoras fazem o diafragma vibrar, alterando a distância entre as placas e, consequentemente, a capacitância. Essa variação produz um pequeno sinal elétrico, amplificado por um transistor JFET embutido na própria cápsula. Na placa, o sinal passa por um estágio de amplificação e segue por dois caminhos: a saída AO entrega a forma de onda amplificada, cuja envoltória o microcontrolador amostra para estimar o nível sonoro; e um comparador LM393 confronta o sinal com a tensão de referência definida pelo trimpot, comutando a saída DO sempre que o som ultrapassa esse limiar.",
    especificacoes: [
      "Tensão de operação: 3,3 V a 5 V CC",
      "Saídas: AO (analógica) e DO (digital, via comparador LM393)",
      "Sensibilidade do microfone: -46 dB (típica, com desvio de ±2 dB)",
      "Faixa de frequência captada: 50 Hz a 20 kHz",
      "Limiar de disparo ajustável por trimpot de 10 kΩ",
      "LEDs indicadores de alimentação e de disparo na placa",
      "Impedância do microfone: 2,2 kΩ",
      "Medição relativa — não fornece leitura calibrada em decibéis"
    ],
    tipoSinal:
      "Analógico e digital simultaneamente — a saída AO é lida por entrada ADC e permite acompanhar a intensidade do ruído, enquanto a DO funciona como um gatilho binário para eventos. Para medição normativa de ruído ocupacional, usam-se decibelímetros calibrados de classe 1 ou 2, e não este módulo.",
    aplicacoes: [
      "Monitoramento de ruído ambiental e ocupacional em ambientes fabris",
      "Detecção de ruído anormal em máquinas — indício de falha mecânica ou cavitação",
      "Detecção de vazamento de ar comprimido pelo ruído característico de alta frequência",
      "Acionamento de iluminação e dispositivos por palma ou comando sonoro",
      "Alarmes acionados por quebra de vidro, impacto ou som de sirene"
    ],
    exemplo: {
      titulo: "Monitor de nível de ruído com registro de picos",
      descricao:
        "O programa amostra a saída analógica por 50 milissegundos, extrai a amplitude entre o pico máximo e mínimo e converte esse valor em um nível relativo de ruído. Quando o limite configurado é ultrapassado, aciona um alerta e conta o evento — dado que, em um projeto IoT, alimentaria um painel de conforto acústico da fábrica.",
      ligacao: [
        "VCC → 5 V do Arduino",
        "GND → GND",
        "AO → pino analógico A0 (intensidade do som)",
        "DO → pino digital 2 (disparo por limiar)",
        "LED de alerta → pino digital 8"
      ],
      codigo: `// --- KY-037: monitor de nivel de ruido ---
const int PINO_AO = A0;
const int PINO_DO = 2;
const int LED_ALERTA = 8;

const int LIMITE_RUIDO = 250;   // amplitude considerada ruido alto
int eventosAltos = 0;

// Mede a amplitude do som em uma janela de 50 ms
int medirAmplitude() {
  int maximo = 0;
  int minimo = 1023;
  unsigned long inicio = millis();

  while (millis() - inicio < 50) {
    int leitura = analogRead(PINO_AO);
    if (leitura > maximo) maximo = leitura;
    if (leitura < minimo) minimo = leitura;
  }
  return maximo - minimo;   // amplitude pico a pico
}

void setup() {
  Serial.begin(9600);
  pinMode(PINO_DO, INPUT);
  pinMode(LED_ALERTA, OUTPUT);
}

void loop() {
  int amplitude = medirAmplitude();

  Serial.print("Nivel de ruido: ");
  Serial.print(amplitude);

  if (amplitude > LIMITE_RUIDO) {
    eventosAltos++;
    digitalWrite(LED_ALERTA, HIGH);
    Serial.print(" -> RUIDO ALTO! Ocorrencias: ");
    Serial.println(eventosAltos);
  } else {
    digitalWrite(LED_ALERTA, LOW);
    Serial.println(" -> nivel normal.");
  }
  delay(200);
}`
    },
    fabricantes: [
      "Módulos KY-037 (microfone grande) e KY-038 (microfone pequeno) — linha Keyes",
      "Cápsulas de eletreto: CUI Devices, PUI Audio e Knowles",
      "Alternativas: MAX9814 (com controle automático de ganho), INMP441 (I2S digital) e decibelímetros industriais Instrutherm e Minipa"
    ]
  },

  /* ---------------------------------------------------------- 24 */
  {
    id: "chama",
    nome: "Sensor de Chama IR",
    categoria: "Chama",
    sinal: "Analógico + Digital",
    imagem: "img/sensores/chama.png",
    resumo:
      "Detector de fogo por radiação infravermelha, que identifica a presença de chama pela emissão característica de sua combustão.",
    conceito:
      "O sensor de chama infravermelho detecta a radiação emitida pelo fogo em uma faixa específica do infravermelho próximo, entre aproximadamente 760 e 1100 nanômetros. Ele responde muito mais rápido que um detector de fumaça, pois identifica a chama diretamente, sem esperar que a fumaça se desloque até o sensor. Por isso é aplicado em sistemas de segurança contra incêndio, em fornos e caldeiras — onde é preciso confirmar se o queimador realmente acendeu — e em robôs de competição de combate a fogo.",
    funcionamento:
      "O elemento sensor é um fotodiodo de infravermelho encapsulado em resina escura, que filtra a luz visível e restringe a resposta à faixa infravermelha típica da combustão. Ao ser atingido por essa radiação, o fotodiodo gera uma corrente proporcional à intensidade recebida, convertida em tensão por um resistor de carga. A placa disponibiliza essa tensão na saída AO, permitindo estimar a distância ou a intensidade do fogo, e a compara com um limiar ajustável em um comparador LM393, que aciona a saída DO. O ângulo de detecção é de cerca de 60 graus e o alcance típico chega a 100 cm para uma chama de vela. Como a luz solar direta e as lâmpadas incandescentes também emitem infravermelho, o posicionamento do sensor exige cuidado para evitar alarmes falsos — nos detectores industriais esse problema é resolvido pela análise da frequência de cintilação da chama e pelo uso combinado das faixas ultravioleta e infravermelha.",
    especificacoes: [
      "Tensão de operação: 3,3 V a 5 V CC",
      "Faixa espectral de detecção: 760 nm a 1100 nm (infravermelho próximo)",
      "Ângulo de detecção: aproximadamente 60 graus",
      "Distância de detecção: até 100 cm (chama de vela) — até 200 cm para fogo maior",
      "Saídas: AO (analógica) e DO (digital, via comparador LM393)",
      "Tempo de resposta: menor que 15 µs",
      "Limiar de disparo ajustável por trimpot",
      "Temperatura de operação: -25 °C a +85 °C"
    ],
    tipoSinal:
      "Analógico e digital — a saída AO indica a intensidade da radiação captada (quanto mais próxima e intensa a chama, menor a leitura, pois o fotodiodo puxa a tensão para baixo) e a DO fornece um alarme binário. Em plantas industriais, os detectores de chama certificados usam saídas 4-20 mA, contatos de relé ou protocolos endereçáveis integrados ao painel de incêndio.",
    aplicacoes: [
      "Sistemas de detecção e alarme de incêndio em ambientes industriais",
      "Supervisão de chama em queimadores de fornos, caldeiras e estufas",
      "Proteção de áreas de armazenamento de líquidos e gases inflamáveis",
      "Acionamento automático de sistemas de extinção e corte de gás",
      "Robótica de segurança e competições de robôs de combate a incêndio"
    ],
    exemplo: {
      titulo: "Sistema de alarme de incêndio com corte automático de gás",
      descricao:
        "O sensor monitora continuamente a presença de chama. Ao detectar fogo, o Arduino aciona uma sirene, acende um sinalizador e fecha a válvula solenoide de gás por meio de um relé. A leitura analógica permite ainda estimar a proximidade da chama e diferenciar um foco pequeno de um incêndio já desenvolvido.",
      ligacao: [
        "VCC → 5 V do Arduino",
        "GND → GND",
        "AO → pino analógico A0 | DO → pino digital 2",
        "Buzzer/sirene → pino digital 8",
        "Relé da válvula de gás → pino digital 7 (normalmente aberto)"
      ],
      codigo: `// --- Sensor de Chama IR: alarme de incendio ---
const int PINO_AO = A0;
const int PINO_DO = 2;
const int SIRENE  = 8;
const int RELE_GAS = 7;

void setup() {
  Serial.begin(9600);
  pinMode(PINO_DO, INPUT);
  pinMode(SIRENE, OUTPUT);
  pinMode(RELE_GAS, OUTPUT);
  digitalWrite(RELE_GAS, HIGH);   // valvula de gas aberta
  Serial.println("Sistema de deteccao de chama ativo.");
}

void loop() {
  int intensidade = analogRead(PINO_AO);
  // A saida DO vai para nivel BAIXO quando ha chama
  bool chamaDetectada = (digitalRead(PINO_DO) == LOW);

  Serial.print("Leitura IR: ");
  Serial.print(intensidade);

  if (chamaDetectada) {
    Serial.println(" -> CHAMA DETECTADA!");

    // Quanto menor a leitura, mais proxima ou intensa e a chama
    if (intensidade < 200) {
      Serial.println("EMERGENCIA: fogo proximo - evacuar a area!");
    }

    digitalWrite(RELE_GAS, LOW);   // corta o fornecimento de gas
    tone(SIRENE, 2000);            // sirene de alarme
  } else {
    Serial.println(" -> ambiente seguro.");
    noTone(SIRENE);
  }
  delay(300);
}`
    },
    fabricantes: [
      "Módulos KY-026 e Flame Sensor de 3 e 4 pinos — fabricação genérica",
      "Fotodiodos IR: Vishay, Everlight e Osram Opto Semiconductors",
      "Detectores industriais certificados: Honeywell, Det-Tronics, Spectrex e MSA (chama UV/IR e IR3)"
    ]
  },

  /* ---------------------------------------------------------- 25 */
  {
    id: "ky040",
    nome: "Encoder Incremental KY-040",
    categoria: "Encoder",
    sinal: "Digital (quadratura)",
    imagem: "img/sensores/ky040.png",
    resumo:
      "Encoder rotativo incremental com saída em quadratura, que informa a quantidade e o sentido de rotação para controle de posição e ajuste de parâmetros.",
    conceito:
      "O KY-040 é um encoder rotativo incremental: um dispositivo que converte o movimento de rotação de um eixo em pulsos elétricos. Diferente de um potenciômetro, ele gira indefinidamente e não indica uma posição absoluta — informa apenas quanto girou e para que lado, a partir de um ponto de referência. Esse é exatamente o princípio dos encoders acoplados a servomotores e a eixos de máquinas CNC, que fecham a malha de realimentação dos sistemas de controle de posição. O módulo ainda inclui um botão embutido, acionado ao pressionar o eixo.",
    funcionamento:
      "Dentro do encoder existe um disco com trilhas condutoras interrompidas e dois contatos deslizantes, defasados fisicamente entre si. Ao girar, cada contato produz uma onda quadrada, e a defasagem construtiva faz com que os dois sinais — chamados CLK (A) e DT (B) — fiquem 90 graus fora de fase. É a chamada saída em quadratura, e ela é o que revela o sentido da rotação: no momento em que o sinal CLK muda de estado, basta observar DT. Se os dois estiverem em níveis diferentes, o giro é em um sentido; se estiverem iguais, é no sentido oposto. Contando as transições, obtém-se o deslocamento angular. Como os contatos são mecânicos, existe repique elétrico (bounce), que precisa ser filtrado por software ou por um filtro RC. O KY-040 possui 20 pulsos por volta e 30 detentes — os pontos de encaixe que se sentem ao girar.",
    especificacoes: [
      "Tensão de operação: 3,3 V a 5 V CC",
      "Resolução: 20 pulsos por volta (30 detentes mecânicos)",
      "Saídas: CLK (canal A), DT (canal B) e SW (botão do eixo)",
      "Rotação contínua sem batente — giro ilimitado nos dois sentidos",
      "Resistores de pull-up já presentes na placa",
      "Vida útil: aproximadamente 30.000 ciclos de rotação",
      "Botão momentâneo integrado, acionado pela pressão no eixo",
      "Necessita tratamento de repique (debounce) por software"
    ],
    tipoSinal:
      "Digital em quadratura — dois trens de pulsos defasados em 90 graus, lidos por interrupção externa para não perder passos durante giros rápidos. Encoders industriais seguem o mesmo princípio, porém em versão óptica ou magnética, com milhares de pulsos por volta, canal Z de referência e saídas diferenciais (RS-422) para imunidade a ruído em cabos longos.",
    aplicacoes: [
      "Realimentação de posição e velocidade em servomotores e eixos de máquinas CNC",
      "Medição de comprimento e controle de corte em bobinas e esteiras transportadoras",
      "Interfaces de operador (IHM): ajuste de setpoints, navegação em menus e seleção de receitas",
      "Controle de posicionamento em robôs, mesas móveis e sistemas de dosagem",
      "Contagem de peças pelo deslocamento linear da esteira em linhas de produção"
    ],
    exemplo: {
      titulo: "Ajuste de setpoint de temperatura com encoder e botão de confirmação",
      descricao:
        "O encoder é lido por interrupção: girar no sentido horário aumenta o valor de referência e no anti-horário o reduz. Pressionar o eixo confirma o ajuste e zera o contador — a interface típica de controladores industriais de temperatura e de painéis de operação de máquinas.",
      ligacao: [
        "+ (VCC) → 5 V do Arduino | GND → GND",
        "CLK → pino digital 2 (interrupção)",
        "DT → pino digital 3",
        "SW (botão) → pino digital 4, configurado com INPUT_PULLUP"
      ],
      codigo: `// --- KY-040: ajuste de setpoint com encoder rotativo ---
const int PINO_CLK = 2;
const int PINO_DT  = 3;
const int PINO_SW  = 4;

volatile int setpoint = 25;        // temperatura desejada em graus C
volatile int ultimoEstadoCLK;
volatile unsigned long ultimoGiro = 0;

// Interrupcao: identifica o sentido do giro pela quadratura
void lerEncoder() {
  // Filtro de repique: ignora transicoes com menos de 5 ms
  if (millis() - ultimoGiro < 5) return;

  int estadoCLK = digitalRead(PINO_CLK);

  if (estadoCLK != ultimoEstadoCLK) {
    // Se DT esta diferente de CLK, o giro e horario
    if (digitalRead(PINO_DT) != estadoCLK) setpoint++;
    else                                   setpoint--;

    // Mantem o valor dentro da faixa util do processo
    setpoint = constrain(setpoint, 10, 90);
    ultimoGiro = millis();
  }
  ultimoEstadoCLK = estadoCLK;
}

void setup() {
  Serial.begin(9600);
  pinMode(PINO_CLK, INPUT);
  pinMode(PINO_DT,  INPUT);
  pinMode(PINO_SW,  INPUT_PULLUP);

  ultimoEstadoCLK = digitalRead(PINO_CLK);
  attachInterrupt(digitalPinToInterrupt(PINO_CLK), lerEncoder, CHANGE);

  Serial.println("Gire o encoder para ajustar o setpoint.");
}

void loop() {
  static int ultimoValor = -1;

  // So imprime quando o valor muda, evitando poluir o monitor serial
  if (setpoint != ultimoValor) {
    Serial.print("Setpoint: ");
    Serial.print(setpoint);
    Serial.println(" C");
    ultimoValor = setpoint;
  }

  // Botao do eixo confirma o ajuste
  if (digitalRead(PINO_SW) == LOW) {
    Serial.print("SETPOINT CONFIRMADO: ");
    Serial.print(setpoint);
    Serial.println(" C");
    delay(300);   // debounce simples do botao
  }
}`
    },
    fabricantes: [
      "Módulos KY-040 e HW-040 — linha Keyes de encoders rotativos",
      "Bourns e ALPS Alpine — encoders incrementais mecânicos de uso profissional",
      "Industriais: encoders ópticos e magnéticos Hengstler, Kübler, Heidenhain, Omron e Sick (com canal Z e saída RS-422)"
    ]
  }
];
