# 🚀 CRM Elite

> **Plataforma inteligente de gestão de relacionamento com clientes (CRM) — 100% frontend, zero dependências externas.**

![CRM Elite](https://img.shields.io/badge/CRM-Elite-7c3aed?style=for-the-badge&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## ✨ Features

- 📊 **Dashboard Analítico** — Métricas em tempo real, gráficos de vendas e funil de conversão
- 👥 **Gestão de Contatos** — Visualização em grade ou lista, busca e filtros avançados
- 📋 **Pipeline Kanban** — Drag & drop de deals entre etapas do funil de vendas
- ✅ **Gestão de Tarefas** — Prioridades, vencimentos e status em tempo real
- 📈 **Relatórios** — Gráficos de conversão, status de clientes e performance mensal
- 💾 **Persistência Local** — Dados salvos automaticamente no localStorage
- 🎨 **Design Premium Dark** — Interface glassmorphism com gradientes e animações suaves
- 📱 **Responsivo** — Funciona perfeitamente em desktop, tablet e mobile

## 🛠️ Tecnologias

- **HTML5** — Estrutura semântica
- **CSS3 Vanilla** — Design system completo com variáveis CSS, animações e responsividade
- **JavaScript ES6+** — Módulos, localStorage API, Canvas API para gráficos
- **Canvas API** — Gráficos de linha, barras e doughnut customizados (sem libs externas!)
- **Nginx** — Servidor web para produção
- **Docker** — Container pronto para deploy

## 🚀 Como Rodar

### 🔧 Localmente (sem Docker)

Basta abrir o `index.html` no navegador — sem necessidade de servidor!

```bash
# Clone o repositório
git clone https://github.com/dluzgames/crm-elite.git
cd crm-elite

# Abra no navegador
xdg-open index.html  # Linux
open index.html       # macOS
```

### 🐳 Com Docker

```bash
# Build da imagem
docker build -t crm-elite .

# Rodar o container
docker run -d -p 8080:80 --name crm-elite crm-elite

# Acesse em:
# http://localhost:8080
```

## 📁 Estrutura do Projeto

```
crm-elite/
├── index.html      # Estrutura HTML principal + modais
├── style.css       # Design system completo (~980 linhas)
├── app.js          # Lógica da aplicação + gráficos Canvas (~975 linhas)
├── nginx.conf      # Configuração Nginx para produção
├── Dockerfile      # Container Docker
└── .gitignore
```

## 📸 Páginas

| Página | Descrição |
|--------|----------|
| 📊 Dashboard | Visão geral com KPIs, gráfico de vendas, funil e atividade recente |
| 👥 Contatos | Gestão de leads, prospects e clientes com busca e filtros |
| 📋 Pipeline | Board Kanban com drag & drop para gerenciar deals |
| ✅ Tarefas | Lista de tarefas com filtros por status e prioridade |
| 📈 Relatórios | Gráficos analíticos de performance e conversão |

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl+K` | Focar na busca global |
| `Esc` | Fechar modais |

## 🎨 Design

- **Paleta:** Dark theme com acentos em roxo (`#a78bfa`), azul (`#38bdf8`) e verde (`#34d399`)
- **Tipografia:** Inter (Google Fonts)
- **Animações:** Micro-animações em hover, modais com spring animation
- **Gráficos:** 100% Canvas API nativa, sem bibliotecas externas

---

**Feito com ❤️ por [Dluz Games](https://github.com/dluzgames)**
