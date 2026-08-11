/* ============================================================
   DADOS-SENSORES.JS
   Base de dados dos sensores IoT e industriais do catálogo.

   Cada objeto reúne as 10 informações exigidas no projeto:
   1. nome            6. tipoSinal (Analógico, Digital, I2C, SPI, UART, 4-20 mA)
   2. categoria       7. aplicacoes (industriais / IoT)
   3. conceito        8. exemplo (projeto + código Arduino)
   4. funcionamento   9. imagem (ilustração vetorial)
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
    imagem: "img/sensores/dht11.svg",
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
    imagem: "img/sensores/dht22.svg",
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
    imagem: "img/sensores/lm35.svg",
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
    imagem: "img/sensores/ds18b20.svg",
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
    imagem: "img/sensores/ldr.svg",
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
    imagem: "img/sensores/bh1750.svg",
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
    imagem: "img/sensores/hcsr04.svg",
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
    imagem: "img/sensores/pir.svg",
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
    imagem: "img/sensores/indutivo.svg",
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
    imagem: "img/sensores/capacitivo.svg",
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
    imagem: "img/sensores/mq2.svg",
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
    imagem: "img/sensores/mq135.svg",
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
    imagem: "img/sensores/solo.svg",
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
    imagem: "img/sensores/fc37.svg",
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
    imagem: "img/sensores/boia.svg",
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
    imagem: "img/sensores/yfs201.svg",
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
  }
];
