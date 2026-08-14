# SensorHub 4.0 — Sensores IoT & Automação Industrial

Catálogo técnico digital que apresenta **25 sensores utilizados em projetos de Internet das Coisas
e Automação Industrial**, com conceito, princípio de funcionamento, especificações técnicas, tipo
de sinal, aplicações e exemplos completos de programação em **Arduino**.

> Projeto desenvolvido como Avaliação Prática da Unidade Curricular **Internet das Coisas** —
> Curso Técnico em Desenvolvimento de Sistemas — **SENAI/SC**
> Docente: José Ricardo Maçaneiro

## 📄 Conteúdo do site

**Página inicial (`index.html`)**
- Conceito de **Sensoriamento** — sensor, transdutor, atuador e as características metrológicas
- A **importância dos sensores na Automação Industrial**
- A relação entre **sensores, comunicação de dados e controle de processos** (malha aberta × fechada)
- Conceito de **Internet das Coisas (IoT)** e arquitetura de um sistema IoT
- **Arduino** — conceito, funcionamento e programação
- Protocolos industriais: **Ethernet Industrial, MQTT, OPC UA e PROFINET**
- Prévia do catálogo de sensores e a aplicação do sensoriamento à robótica

**Arduino (`arduino.html`)**
- Conceito e características técnicas do **Arduino Uno R3** (ATmega328P)
- Funcionamento: ciclo `setup()` / `loop()`, conversor A/D de 10 bits, PWM e interrupções
- Diagrama de **pinagem** com os grupos I2C, SPI, UART e interrupções
- Formas de comunicação com os sensores: Analógico, Digital, I2C, SPI, UART, 1-Wire e **4–20 mA**
- **25 exemplos de programação** (um por sensor), com esquema de ligação e código comentado
- Integração com **ESP32** e **Raspberry Pi** + exemplo de nó IoT publicando via **MQTT**

**Catálogo de sensores (`sensores.html`)**
- Busca textual em tempo real e filtro por categoria (20 categorias)
- Ficha técnica individual (`sensor.html?id=<sensor>`) organizada em 7 abas

### Sensores catalogados

| # | Sensor | Categoria | Tipo de sinal |
|---|---|---|---|
| 01 | DHT11 | Temperatura e Umidade | Digital (1 fio) |
| 02 | DHT22 / AM2302 | Temperatura e Umidade | Digital (1 fio) |
| 03 | LM35 | Temperatura | Analógico |
| 04 | DS18B20 | Temperatura | Digital (1-Wire) |
| 05 | LDR | Luminosidade | Analógico |
| 06 | BH1750 | Luminosidade | **I2C** |
| 07 | HC-SR04 | Distância | Digital |
| 08 | PIR HC-SR501 | Movimento | Digital |
| 09 | Sensor Indutivo LJ12A3 | Proximidade | Digital (PNP/NPN) |
| 10 | Sensor Capacitivo LJ18A3 | Proximidade | Digital (PNP/NPN) |
| 11 | MQ-2 | Gás | Analógico + Digital |
| 12 | MQ-135 | Gás | Analógico + Digital |
| 13 | Sensor Capacitivo de Umidade do Solo | Umidade | Analógico |
| 14 | Sensor de Chuva FC-37 | Chuva | Analógico + Digital |
| 15 | Sensor de Nível (Boia) | Nível | Digital (contato seco) |
| 16 | YF-S201 | Fluxo | Digital (frequência) |
| 17 | ACS712 | Corrente | Analógico |
| 18 | ZMPT101B | Tensão | Analógico |
| 19 | SW-420 | Vibração | Digital |
| 20 | Sensor Hall A3144 | Rotação | Digital |
| 21 | MFRC522 | RFID | **SPI** |
| 22 | Célula de Carga + HX711 | Peso | Digital (2 fios) |
| 23 | KY-037 | Som | Analógico + Digital |
| 24 | Sensor de Chama IR | Chama | Analógico + Digital |
| 25 | Encoder Incremental KY-040 | Encoder | Digital (quadratura) |

Cada ficha apresenta as **10 informações exigidas no projeto**: nome, categoria, conceito,
princípio de funcionamento, especificações técnicas, tipo de sinal, aplicações industriais/IoT,
exemplo de utilização em um projeto (com código), imagem ilustrativa e fabricantes/modelos
comerciais.

**Catálogo de robôs (`robos.html` / `robo.html`)**
Seção complementar com os 7 modelos de robôs industriais (cartesiano, SCARA, articulado,
cilíndrico, delta, polar e colaborativo) e sua relação com o sensoriamento.

## 🗂️ Estrutura do projeto

```
├── index.html                # Página inicial (sensoriamento, IoT, automação, Arduino)
├── sensores.html             # Catálogo de sensores com busca e filtro por categoria
├── sensor.html               # Ficha técnica dinâmica (?id=<sensor>)
├── arduino.html              # Arduino: características, funcionamento e 25 exemplos
├── robos.html                # Catálogo de robôs industriais
├── robo.html                 # Ficha técnica dinâmica do robô (?id=<robo>)
├── css/
│   └── style.css             # Folha de estilo única (tema industrial, responsivo)
├── js/
│   ├── dados-sensores.js     # Base de dados dos 25 sensores (conteúdo técnico)
│   ├── dados-robos.js        # Base de dados dos 7 robôs
│   ├── main.js               # Menu responsivo, animações de scroll, contadores
│   ├── catalogo-sensores.js  # Cards, busca e filtro por categoria dos sensores
│   ├── catalogo.js           # Cards e busca dos robôs
│   ├── sensor.js             # Montagem dinâmica da ficha do sensor + abas
│   ├── robo.js               # Montagem dinâmica da ficha do robô + abas
│   ├── codigo.js             # Realce de sintaxe e botão "copiar" dos códigos
│   └── arduino.js            # Seletor e renderização dos exemplos de programação
└── img/
    ├── sensores/             # Imagens ilustrativas dos 25 sensores
    ├── arduino-uno.png       # Placa Arduino Uno R3
    ├── arduino-pinout.png    # Diagrama de pinagem
    ├── esp32.png             # Placa ESP32 DevKit
    ├── raspberry-pi.png      # Raspberry Pi 4 Model B
    └── *.png                 # Imagens dos robôs industriais
```

## 🛠️ Tecnologias e recursos

- **HTML5 semântico** — `header`, `nav`, `main`, `section`, `article`, `figure`, `footer`
- **CSS3** — variáveis CSS, Grid, Flexbox, media queries (layout 100% responsivo), animações
- **JavaScript puro (vanilla)** — sem frameworks:
  - Menu hambúrguer responsivo
  - Busca de sensores em tempo real + filtro por categoria com chips
  - Fichas técnicas montadas dinamicamente a partir da URL (`URLSearchParams`)
  - Sistema de abas (tabs) nas fichas técnicas
  - Realce de sintaxe dos códigos Arduino e botão de copiar (Clipboard API)
  - Seletor de exemplos de programação na página do Arduino
  - Animações de revelação ao rolar (`IntersectionObserver`)
  - Contadores animados (`requestAnimationFrame`)
- Código-fonte organizado em pastas e **comentado nas principais rotinas**

## ▶️ Como executar localmente

O site é 100% estático — basta abrir o `index.html` no navegador, ou servir a pasta:

```bash
# com Python
python3 -m http.server 8000

# ou com Node
npx serve .
```

E acessar `http://localhost:8000`.

## 🚀 Publicação

O projeto está pronto para deploy no **Vercel**: basta importar o repositório
(framework preset: *Other*, sem build step) e publicar.
