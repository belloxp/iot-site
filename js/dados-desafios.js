/* ============================================================
   DADOS-DESAFIOS.JS
   Códigos-fonte dos 3 desafios práticos (desafios.html).
   Cada desafio tem duas versões:
   - arduino: sketch para Arduino Uno (o mesmo usado no Tinkercad)
   - esp:     sketch único para ESP32 ou ESP8266, que mantém a
              lógica local e publica o estado em um painel web
              servido pela própria placa (Wi-Fi)

   Os códigos usam String.raw para que as barras invertidas
   (\n, \") cheguem intactas ao bloco exibido na página.
   ============================================================ */

const DESAFIOS_CODIGO = {

  /* ---------------------------------------------------------
     DESAFIO 1 — ILUMINAÇÃO INTELIGENTE (PIR + LDR + LED)
     --------------------------------------------------------- */
  "d1-arduino": {
    arquivo: "desafio1-iluminacao.ino",
    codigo: String.raw`// ============================================================
// DESAFIO 1 - ILUMINACAO INTELIGENTE (Arduino Uno / Tinkercad)
// Sensor PIR (presenca) + LDR (luminosidade) controlando um LED
//
// Logica:
//   pessoa presente + ambiente escuro -> LED LIGADO
//   pessoa presente + ambiente claro  -> LED DESLIGADO
//   sem pessoa                        -> LED DESLIGADO
// ============================================================

const int PINO_PIR = 2;    // saida digital do sensor PIR
const int PINO_LDR = A0;   // divisor de tensao: 5V - LDR - A0 - 10k - GND
const int PINO_LED = 9;    // LED com resistor de 220 ohms

// Leitura do LDR abaixo deste valor = ambiente ESCURO (escala 0 a 1023).
// Ajuste de acordo com a iluminacao da sala (veja o Monitor Serial).
const int LIMITE_ESCURO = 400;

void setup() {
  Serial.begin(9600);
  pinMode(PINO_PIR, INPUT);
  pinMode(PINO_LED, OUTPUT);
  digitalWrite(PINO_LED, LOW);
}

void loop() {
  // 1. LER os dois sensores
  bool presenca = digitalRead(PINO_PIR) == HIGH;  // HIGH = movimento detectado
  int  luz      = analogRead(PINO_LDR);           // mais luz = valor maior

  // 2. PROCESSAR: o ambiente e escuro quando a luz fica abaixo do limite
  bool escuro = luz < LIMITE_ESCURO;

  // 3. ATUAR: o LED so acende quando as DUAS condicoes sao verdadeiras (E logico)
  if (presenca && escuro) {
    digitalWrite(PINO_LED, HIGH);
  } else {
    digitalWrite(PINO_LED, LOW);
  }

  // 4. COMUNICAR: mostra o raciocinio no Monitor Serial
  Serial.print("Presenca: ");
  Serial.print(presenca ? "SIM" : "NAO");
  Serial.print(" | Luz: ");
  Serial.print(luz);
  Serial.print(escuro ? " (escuro)" : " (claro)");
  Serial.print(" | LED: ");
  Serial.println((presenca && escuro) ? "LIGADO" : "DESLIGADO");

  delay(200);
}`
  },

  "d1-esp": {
    arquivo: "desafio1-iluminacao-esp.ino",
    codigo: String.raw`// ============================================================
// DESAFIO 1 - ILUMINACAO INTELIGENTE (ESP32 ou ESP8266)
// Mesma logica do Arduino + painel web servido pela placa.
// Abra no navegador o IP exibido no Monitor Serial.
// ============================================================

#if defined(ESP32)
  #include <WiFi.h>
  #include <WebServer.h>
  WebServer servidor(80);
  const int PINO_PIR = 27;
  const int PINO_LDR = 34;    // ADC1: funciona com o Wi-Fi ligado
  const int PINO_LED = 2;
  const int ADC_MAX  = 4095;  // conversor A/D de 12 bits
#else
  #include <ESP8266WiFi.h>
  #include <ESP8266WebServer.h>
  ESP8266WebServer servidor(80);
  const int PINO_PIR = D5;
  const int PINO_LDR = A0;    // unica entrada analogica do ESP8266
  const int PINO_LED = D6;
  const int ADC_MAX  = 1023;  // conversor A/D de 10 bits
#endif

const char* SSID  = "NOME_DA_REDE";
const char* SENHA = "SENHA_DA_REDE";

// Limite em PORCENTAGEM de luz, para funcionar igual nas duas placas
const int LIMITE_ESCURO_PCT = 40;

bool presenca = false;
bool escuro   = false;
int  luzPct   = 0;

// Pagina do painel: busca /dados a cada 1 segundo e atualiza os cartoes
const char PAGINA[] PROGMEM = R"html(
<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Iluminacao Inteligente</title>
<style>
body{font-family:sans-serif;background:#0a0c10;color:#e8edf4;text-align:center;padding:2rem}
.card{display:inline-block;background:#12161d;border:1px solid #222a35;border-radius:8px;padding:1rem 1.5rem;margin:.5rem;min-width:150px}
.valor{font-size:1.5rem;color:#ff9f1c;margin-top:.4rem}
</style></head><body>
<h1>Iluminacao Inteligente</h1>
<div class="card">Presenca<div class="valor" id="presenca">--</div></div>
<div class="card">Luminosidade<div class="valor" id="luz">--</div></div>
<div class="card">LED<div class="valor" id="led">--</div></div>
<script>
function atualizar(){
  fetch('/dados').then(function(r){return r.json();}).then(function(d){
    document.getElementById('presenca').textContent = d.presenca ? 'SIM' : 'NAO';
    document.getElementById('luz').textContent = d.luz + '% ' + (d.escuro ? '(escuro)' : '(claro)');
    document.getElementById('led').textContent = d.led ? 'LIGADO' : 'DESLIGADO';
  });
}
setInterval(atualizar, 1000); atualizar();
</script></body></html>
)html";

void enviarPagina() {
  servidor.send_P(200, "text/html", PAGINA);
}

// Estado atual em JSON, consumido pela pagina (ou por qualquer sistema IoT)
void enviarDados() {
  bool led = presenca && escuro;
  String json = "{\"presenca\":" + String(presenca ? "true" : "false") +
                ",\"luz\":" + String(luzPct) +
                ",\"escuro\":" + String(escuro ? "true" : "false") +
                ",\"led\":" + String(led ? "true" : "false") + "}";
  servidor.send(200, "application/json", json);
}

void conectarWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, SENHA);
  Serial.print("Conectando ao Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.print("\nPainel web: http://");
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(115200);
  pinMode(PINO_PIR, INPUT);
  pinMode(PINO_LED, OUTPUT);

  conectarWiFi();
  servidor.on("/", enviarPagina);
  servidor.on("/dados", enviarDados);
  servidor.begin();
}

void loop() {
  servidor.handleClient();   // atende o navegador sem travar a logica

  presenca = digitalRead(PINO_PIR) == HIGH;
  luzPct   = map(analogRead(PINO_LDR), 0, ADC_MAX, 0, 100);
  escuro   = luzPct < LIMITE_ESCURO_PCT;

  digitalWrite(PINO_LED, (presenca && escuro) ? HIGH : LOW);
  delay(50);
}`
  },

  /* ---------------------------------------------------------
     DESAFIO 2 — ESTACIONAMENTO INTELIGENTE
     (HC-SR04 + potenciômetro + LED)
     --------------------------------------------------------- */
  "d2-arduino": {
    arquivo: "desafio2-estacionamento.ino",
    codigo: String.raw`// ============================================================
// DESAFIO 2 - ESTACIONAMENTO INTELIGENTE (Arduino Uno / Tinkercad)
// Sensor ultrassonico HC-SR04 mede a distancia;
// o potenciometro define a distancia limite (seguranca).
//
// Exemplo com limite de 20 cm:
//   mais de 20 cm      -> LED desligado
//   entre 10 e 20 cm   -> LED piscando (mais rapido quanto mais perto)
//   menos de 10 cm     -> LED ligado continuamente
// ============================================================

const int PINO_TRIG   = 7;
const int PINO_ECHO   = 6;
const int PINO_POT    = A0;
const int PINO_LED    = 9;
const int PINO_BUZZER = 11;   // opcional: alerta sonoro junto com o LED

// Faixa que o potenciometro consegue ajustar
const int LIMITE_MIN = 10;    // cm (potenciometro todo para a esquerda)
const int LIMITE_MAX = 100;   // cm (potenciometro todo para a direita)

// Faixa do intervalo de piscada (desafio adicional)
const int PISCA_RAPIDO = 60;  // ms, quando o objeto esta quase na zona critica
const int PISCA_LENTO  = 500; // ms, quando o objeto acabou de entrar no limite

unsigned long ultimoPisca = 0;
bool ledAceso = false;

// Dispara o pulso de 10 us e converte o tempo do eco em centimetros
long medirDistancia() {
  digitalWrite(PINO_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PINO_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PINO_TRIG, LOW);

  long duracao = pulseIn(PINO_ECHO, HIGH, 30000);  // timeout de 30 ms (~5 m)
  if (duracao == 0) return 999;                    // sem eco: nada a frente
  return duracao * 0.0343 / 2;                     // som: 343 m/s, ida e volta
}

void setup() {
  Serial.begin(9600);
  pinMode(PINO_TRIG, OUTPUT);
  pinMode(PINO_ECHO, INPUT);
  pinMode(PINO_LED, OUTPUT);
  pinMode(PINO_BUZZER, OUTPUT);
}

void loop() {
  // 1. O POTENCIOMETRO define o limite de seguranca (10 a 100 cm)
  int leituraPot  = analogRead(PINO_POT);
  int limite      = map(leituraPot, 0, 1023, LIMITE_MIN, LIMITE_MAX);
  int zonaCritica = limite / 2;   // metade do limite = LED fixo

  // 2. O ULTRASSONICO mede a distancia do objeto
  long distancia = medirDistancia();
  String estado;

  if (distancia > limite) {
    // Objeto distante: sem alerta
    digitalWrite(PINO_LED, LOW);
    noTone(PINO_BUZZER);
    ledAceso = false;
    estado = "DESLIGADO";

  } else if (distancia > zonaCritica) {
    // Objeto se aproximando: pisca, e o intervalo DIMINUI com a distancia
    int intervalo = map(distancia, zonaCritica, limite, PISCA_RAPIDO, PISCA_LENTO);

    if (millis() - ultimoPisca >= (unsigned long)intervalo) {
      ultimoPisca = millis();
      ledAceso = !ledAceso;
      digitalWrite(PINO_LED, ledAceso ? HIGH : LOW);
      if (ledAceso) tone(PINO_BUZZER, 1200, 40); else noTone(PINO_BUZZER);
    }
    estado = "PISCANDO (" + String(intervalo) + " ms)";

  } else {
    // Objeto dentro da distancia critica: alerta continuo
    digitalWrite(PINO_LED, HIGH);
    tone(PINO_BUZZER, 1800);
    ledAceso = true;
    estado = "LIGADO";
  }

  // 3. Monitor Serial: mostra como o potenciometro mudou os limites
  Serial.print("Distancia: ");
  Serial.print(distancia);
  Serial.print(" cm | Pot: ");
  Serial.print(map(leituraPot, 0, 1023, 0, 100));
  Serial.print("% | Limite: ");
  Serial.print(limite);
  Serial.print(" cm | Critico: ");
  Serial.print(zonaCritica);
  Serial.print(" cm | LED: ");
  Serial.println(estado);

  delay(30);
}`
  },

  "d2-esp": {
    arquivo: "desafio2-estacionamento-esp.ino",
    codigo: String.raw`// ============================================================
// DESAFIO 2 - ESTACIONAMENTO INTELIGENTE (ESP32 ou ESP8266)
// Mesma logica do Arduino + painel web com a distancia ao vivo.
// ATENCAO: o ECHO do HC-SR04 sai em 5 V. Use um divisor de tensao
// (1 k + 2 k) para baixar para 3,3 V antes de ligar no ESP.
// ============================================================

#if defined(ESP32)
  #include <WiFi.h>
  #include <WebServer.h>
  WebServer servidor(80);
  const int PINO_TRIG = 5;
  const int PINO_ECHO = 18;
  const int PINO_POT  = 34;
  const int PINO_LED  = 2;
  const int ADC_MAX   = 4095;
#else
  #include <ESP8266WiFi.h>
  #include <ESP8266WebServer.h>
  ESP8266WebServer servidor(80);
  const int PINO_TRIG = D1;
  const int PINO_ECHO = D2;
  const int PINO_POT  = A0;
  const int PINO_LED  = D6;
  const int ADC_MAX   = 1023;
#endif

const char* SSID  = "NOME_DA_REDE";
const char* SENHA = "SENHA_DA_REDE";

const int LIMITE_MIN = 10, LIMITE_MAX = 100;       // cm
const int PISCA_RAPIDO = 60, PISCA_LENTO = 500;    // ms

long distancia = 999;
int  limite    = 20;
int  intervalo = 0;
const char* estado = "DESLIGADO";

unsigned long ultimoPisca = 0;
bool ledAceso = false;

const char PAGINA[] PROGMEM = R"html(
<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Estacionamento Inteligente</title>
<style>
body{font-family:sans-serif;background:#0a0c10;color:#e8edf4;text-align:center;padding:2rem}
.card{display:inline-block;background:#12161d;border:1px solid #222a35;border-radius:8px;padding:1rem 1.5rem;margin:.5rem;min-width:150px}
.valor{font-size:1.5rem;color:#ff9f1c;margin-top:.4rem}
.barra{height:14px;background:#222a35;border-radius:7px;max-width:420px;margin:1.5rem auto;overflow:hidden}
.barra div{height:100%;background:#ff9f1c;transition:width .3s}
</style></head><body>
<h1>Estacionamento Inteligente</h1>
<div class="card">Distancia<div class="valor" id="dist">--</div></div>
<div class="card">Limite (pot.)<div class="valor" id="lim">--</div></div>
<div class="card">LED<div class="valor" id="led">--</div></div>
<div class="barra"><div id="prox" style="width:0"></div></div>
<script>
function atualizar(){
  fetch('/dados').then(function(r){return r.json();}).then(function(d){
    document.getElementById('dist').textContent = d.distancia >= 999 ? 'livre' : d.distancia + ' cm';
    document.getElementById('lim').textContent = d.limite + ' cm';
    document.getElementById('led').textContent = d.estado;
    var p = Math.max(0, Math.min(100, 100 - d.distancia / d.limite * 100));
    document.getElementById('prox').style.width = p + '%';
  });
}
setInterval(atualizar, 500); atualizar();
</script></body></html>
)html";

long medirDistancia() {
  digitalWrite(PINO_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PINO_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PINO_TRIG, LOW);
  long duracao = pulseIn(PINO_ECHO, HIGH, 30000);
  if (duracao == 0) return 999;
  return duracao * 0.0343 / 2;
}

void enviarPagina() {
  servidor.send_P(200, "text/html", PAGINA);
}

void enviarDados() {
  String json = "{\"distancia\":" + String(distancia) +
                ",\"limite\":" + String(limite) +
                ",\"intervalo\":" + String(intervalo) +
                ",\"estado\":\"" + String(estado) + "\"}";
  servidor.send(200, "application/json", json);
}

void conectarWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, SENHA);
  Serial.print("Conectando ao Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.print("\nPainel web: http://");
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(115200);
  pinMode(PINO_TRIG, OUTPUT);
  pinMode(PINO_ECHO, INPUT);
  pinMode(PINO_LED, OUTPUT);

  conectarWiFi();
  servidor.on("/", enviarPagina);
  servidor.on("/dados", enviarDados);
  servidor.begin();
}

void loop() {
  servidor.handleClient();

  limite = map(analogRead(PINO_POT), 0, ADC_MAX, LIMITE_MIN, LIMITE_MAX);
  int zonaCritica = limite / 2;
  distancia = medirDistancia();

  if (distancia > limite) {
    digitalWrite(PINO_LED, LOW);
    ledAceso = false;
    intervalo = 0;
    estado = "DESLIGADO";
  } else if (distancia > zonaCritica) {
    intervalo = map(distancia, zonaCritica, limite, PISCA_RAPIDO, PISCA_LENTO);
    if (millis() - ultimoPisca >= (unsigned long)intervalo) {
      ultimoPisca = millis();
      ledAceso = !ledAceso;
      digitalWrite(PINO_LED, ledAceso ? HIGH : LOW);
    }
    estado = "PISCANDO";
  } else {
    digitalWrite(PINO_LED, HIGH);
    ledAceso = true;
    intervalo = 0;
    estado = "LIGADO";
  }

  delay(30);
}`
  },

  /* ---------------------------------------------------------
     DESAFIO 3 — AMBIENTE INTELIGENTE
     (temperatura + umidade + LED RGB + buzzer)
     --------------------------------------------------------- */
  "d3-arduino": {
    arquivo: "desafio3-ambiente.ino",
    codigo: String.raw`// ============================================================
// DESAFIO 3 - AMBIENTE INTELIGENTE (Arduino Uno)
// Monitoramento de temperatura e umidade da estufa com LED RGB.
//
// O Tinkercad nao possui o DHT11. Por isso o codigo tem 2 modos:
//   USAR_DHT11 0 -> Tinkercad: TMP36 (temperatura) + potenciometro
//                   simulando o sensor de umidade (0 a 100 %)
//   USAR_DHT11 1 -> montagem fisica com o sensor DHT11
//
// Valores de referencia da estufa:
//   temperatura adequada: ate 30 C   | umidade adequada: 40 % ou mais
//
// Indicacao (LED RGB):
//   tudo adequado                   -> VERDE
//   temperatura alta                -> VERMELHO
//   umidade baixa                   -> AMARELO (vermelho + verde)
//   temperatura alta + umidade baixa-> alterna VERMELHO/AMARELO + bip
//   falha de leitura do sensor      -> AZUL
// ============================================================

#define USAR_DHT11 0

#if USAR_DHT11
  #include <DHT.h>
  DHT dht(2, DHT11);          // DHT11 no pino digital 2
#endif

const int PINO_TMP36  = A0;   // TMP36 (apenas no Tinkercad)
const int PINO_UMID   = A1;   // potenciometro simulando a umidade
const int PINO_R      = 9;    // LED RGB catodo comum (resistor 220 ohms em cada cor)
const int PINO_G      = 10;
const int PINO_B      = 11;
const int PINO_BUZZER = 8;

// Valores de referencia definidos para a estufa
const float TEMP_MAX = 30.0;  // C
const float UMID_MIN = 40.0;  // %

float lerTemperatura() {
#if USAR_DHT11
  return dht.readTemperature();
#else
  float tensao = analogRead(PINO_TMP36) * (5.0 / 1023.0);
  return (tensao - 0.5) * 100.0;   // TMP36: 10 mV/C com offset de 500 mV
#endif
}

float lerUmidade() {
#if USAR_DHT11
  return dht.readHumidity();
#else
  return map(analogRead(PINO_UMID), 0, 1023, 0, 100);
#endif
}

// Acende a combinacao de cores do LED RGB
void cor(bool r, bool g, bool b) {
  digitalWrite(PINO_R, r ? HIGH : LOW);
  digitalWrite(PINO_G, g ? HIGH : LOW);
  digitalWrite(PINO_B, b ? HIGH : LOW);
}

void setup() {
  Serial.begin(9600);
  pinMode(PINO_R, OUTPUT);
  pinMode(PINO_G, OUTPUT);
  pinMode(PINO_B, OUTPUT);
  pinMode(PINO_BUZZER, OUTPUT);
#if USAR_DHT11
  dht.begin();
#endif
}

void loop() {
  float temperatura = lerTemperatura();
  float umidade     = lerUmidade();

  // Protecao: leitura invalida do sensor
  if (isnan(temperatura) || isnan(umidade)) {
    cor(false, false, true);          // AZUL = falha
    Serial.println("Falha na leitura do sensor!");
    delay(1000);
    return;
  }

  // Cada condicao e avaliada de forma INDEPENDENTE
  bool tempAlta  = temperatura > TEMP_MAX;
  bool umidBaixa = umidade < UMID_MIN;
  String situacao;

  if (tempAlta && umidBaixa) {
    // Desafio adicional: as DUAS condicoes ao mesmo tempo.
    // O LED alterna entre vermelho e amarelo a cada 500 ms
    // e o buzzer bipa, indicando que ha mais de um problema.
    bool fase = (millis() / 500) % 2;
    if (fase) {
      cor(true, false, false);        // VERMELHO
      tone(PINO_BUZZER, 2000, 120);
    } else {
      cor(true, true, false);         // AMARELO
    }
    situacao = "TEMPERATURA ALTA + UMIDADE BAIXA";
  } else if (tempAlta) {
    cor(true, false, false);          // VERMELHO
    situacao = "TEMPERATURA ALTA";
  } else if (umidBaixa) {
    cor(true, true, false);           // AMARELO
    situacao = "UMIDADE BAIXA";
  } else {
    cor(false, true, false);          // VERDE
    noTone(PINO_BUZZER);
    situacao = "CONDICAO ADEQUADA";
  }

  Serial.print("Temp: ");
  Serial.print(temperatura, 1);
  Serial.print(" C | Umidade: ");
  Serial.print(umidade, 0);
  Serial.print(" % | ");
  Serial.println(situacao);

  delay(100);
}`
  },

  "d3-esp": {
    arquivo: "desafio3-ambiente-esp.ino",
    codigo: String.raw`// ============================================================
// DESAFIO 3 - AMBIENTE INTELIGENTE (ESP32 ou ESP8266 + DHT11)
// Mesma logica do Arduino + painel web da estufa.
// Biblioteca: "DHT sensor library" (Adafruit) no Gerenciador.
// ============================================================

#include <DHT.h>

#if defined(ESP32)
  #include <WiFi.h>
  #include <WebServer.h>
  WebServer servidor(80);
  const int PINO_DHT = 4;
  const int PINO_R = 25, PINO_G = 26, PINO_B = 27;
  const int PINO_BUZZER = 23;
#else
  #include <ESP8266WiFi.h>
  #include <ESP8266WebServer.h>
  ESP8266WebServer servidor(80);
  const int PINO_DHT = D7;
  const int PINO_R = D1, PINO_G = D2, PINO_B = D5;
  const int PINO_BUZZER = D6;
#endif

DHT dht(PINO_DHT, DHT11);

const char* SSID  = "NOME_DA_REDE";
const char* SENHA = "SENHA_DA_REDE";

const float TEMP_MAX = 30.0;
const float UMID_MIN = 40.0;

float temperatura = NAN, umidade = NAN;
bool  tempAlta = false, umidBaixa = false;
unsigned long ultimaLeitura = 0;

const char PAGINA[] PROGMEM = R"html(
<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Estufa Inteligente</title>
<style>
body{font-family:sans-serif;background:#0a0c10;color:#e8edf4;text-align:center;padding:2rem}
.card{display:inline-block;background:#12161d;border:1px solid #222a35;border-radius:8px;padding:1rem 1.5rem;margin:.5rem;min-width:150px}
.valor{font-size:1.5rem;color:#ff9f1c;margin-top:.4rem}
.alerta{display:inline-block;margin:.3rem;padding:.4rem .8rem;border-radius:20px;font-weight:bold}
</style></head><body>
<h1>Estufa Inteligente</h1>
<div class="card">Temperatura<div class="valor" id="temp">--</div></div>
<div class="card">Umidade<div class="valor" id="umid">--</div></div>
<div id="alertas"></div>
<script>
function selo(texto, cor){ return '<span class="alerta" style="background:' + cor + '">' + texto + '</span>'; }
function atualizar(){
  fetch('/dados').then(function(r){return r.json();}).then(function(d){
    document.getElementById('temp').textContent = d.temperatura + ' C';
    document.getElementById('umid').textContent = d.umidade + ' %';
    var html = '';
    if (d.tempAlta)  html += selo('Temperatura alta', '#c0392b');
    if (d.umidBaixa) html += selo('Umidade baixa', '#b7950b');
    if (!d.tempAlta && !d.umidBaixa) html = selo('Condicao adequada', '#1e8449');
    document.getElementById('alertas').innerHTML = html;
  });
}
setInterval(atualizar, 2000); atualizar();
</script></body></html>
)html";

void cor(bool r, bool g, bool b) {
  digitalWrite(PINO_R, r ? HIGH : LOW);
  digitalWrite(PINO_G, g ? HIGH : LOW);
  digitalWrite(PINO_B, b ? HIGH : LOW);
}

void enviarPagina() {
  servidor.send_P(200, "text/html", PAGINA);
}

void enviarDados() {
  String json = "{\"temperatura\":" + String(temperatura, 1) +
                ",\"umidade\":" + String(umidade, 0) +
                ",\"tempAlta\":" + String(tempAlta ? "true" : "false") +
                ",\"umidBaixa\":" + String(umidBaixa ? "true" : "false") + "}";
  servidor.send(200, "application/json", json);
}

void conectarWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, SENHA);
  Serial.print("Conectando ao Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.print("\nPainel web: http://");
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(115200);
  pinMode(PINO_R, OUTPUT);
  pinMode(PINO_G, OUTPUT);
  pinMode(PINO_B, OUTPUT);
  pinMode(PINO_BUZZER, OUTPUT);
  dht.begin();

  conectarWiFi();
  servidor.on("/", enviarPagina);
  servidor.on("/dados", enviarDados);
  servidor.begin();
}

void loop() {
  servidor.handleClient();

  // O DHT11 so entrega uma leitura nova a cada ~2 segundos
  if (millis() - ultimaLeitura >= 2000) {
    ultimaLeitura = millis();
    temperatura = dht.readTemperature();
    umidade     = dht.readHumidity();
  }

  if (isnan(temperatura) || isnan(umidade)) {
    cor(false, false, true);    // AZUL = falha de leitura
    return;
  }

  tempAlta  = temperatura > TEMP_MAX;
  umidBaixa = umidade < UMID_MIN;

  if (tempAlta && umidBaixa) {
    bool fase = (millis() / 500) % 2;
    if (fase) cor(true, false, false); else cor(true, true, false);
    if (fase) tone(PINO_BUZZER, 2000, 120);
  } else if (tempAlta) {
    cor(true, false, false);
  } else if (umidBaixa) {
    cor(true, true, false);
  } else {
    cor(false, true, false);
    noTone(PINO_BUZZER);
  }

  delay(20);
}`
  }
};
