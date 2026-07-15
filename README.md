# RoboHub 4.0 — Robótica Industrial & IoT

Portal web técnico e educativo que apresenta os **7 principais modelos de robôs industriais**
utilizados na Indústria 4.0 e sua relação com a **Internet das Coisas (IoT)**.

> Projeto desenvolvido como Avaliação Prática da Unidade Curricular **Internet das Coisas** —
> Curso Técnico em Desenvolvimento de Sistemas — **SENAI/SC**
> Docente: José Ricardo Maçaneiro

## 🤖 Conteúdo do site

**Página inicial (`index.html`)**
- Conceito de Internet das Coisas (IoT) e arquitetura básica de um sistema IoT
- Conceito de Robótica Industrial (definição ISO 8373 e componentes de um robô)
- Importância da automação industrial
- Relação entre robótica e IoT (manutenção preditiva, digital twin, OEE)
- Protocolos de comunicação industrial: **Ethernet Industrial, MQTT, OPC UA e PROFINET**

**Catálogo (`robos.html`)** com busca em tempo real e ficha técnica completa (`robo.html`) de cada robô:

| Robô | Também conhecido como |
|---|---|
| Cartesiano | Robô linear / Gantry |
| SCARA | Selective Compliance Assembly Robot Arm |
| Articulado | Braço antropomórfico |
| Cilíndrico | Manipulador de coordenadas cilíndricas |
| Delta | Robô paralelo / Spider |
| Polar | Robô esférico |
| Colaborativo | Cobot |

Cada ficha técnica apresenta: **conceito, princípio de funcionamento, características técnicas,
aplicações industriais, integração com automação/IoT e 3 modelos comerciais de fabricantes distintos**, com imagens ilustrativas.

## 🗂️ Estrutura do projeto

```
├── index.html          # Página inicial (conceitos de IoT e robótica)
├── robos.html          # Catálogo com busca em tempo real
├── robo.html           # Página de detalhe dinâmica (?id=<robo>)
├── css/
│   └── style.css       # Folha de estilo única (tema industrial, responsivo)
├── js/
│   ├── dados-robos.js  # Base de dados dos 7 robôs (conteúdo técnico)
│   ├── main.js         # Menu responsivo, animações de scroll, contadores
│   ├── catalogo.js     # Renderização dos cards e filtro de busca
│   └── robo.js         # Montagem dinâmica da ficha técnica + abas
└── img/                # Imagens ilustrativas dos robôs
```

## 🛠️ Tecnologias e recursos

- **HTML5 semântico** — páginas estruturadas com `header`, `nav`, `main`, `section`, `article`, `footer`
- **CSS3** — variáveis CSS, Grid, Flexbox, media queries (layout 100% responsivo), animações
- **JavaScript puro (vanilla)** — sem frameworks:
  - Menu hambúrguer responsivo
  - Busca/filtro de robôs em tempo real
  - Página de detalhe montada dinamicamente a partir da URL (`URLSearchParams`)
  - Sistema de abas (tabs) na ficha técnica
  - Animações de revelação ao rolar (`IntersectionObserver`)
  - Contadores animados (`requestAnimationFrame`)
- Código-fonte organizado e **comentado nas principais rotinas**

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
