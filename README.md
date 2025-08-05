# Dashboard de Gestão de Categorias

Sistema completo de gestão de categorias de produtos desenvolvido em React.js com arquitetura modular e design responsivo.

## Versão Atual: 2.4.03

---

## Funcionalidades

- **Autenticação completa** com JWT
- **CRUD de categorias** (Criar, Listar, Editar, Excluir)
- **Upload de imagens** para categorias
- **Sistema de filtros** e busca
- **Dashboard com estatísticas**
- **Navegação multi-página** com React Router
- **Design responsivo** com Tailwind CSS
- **Sistema de notificações** (Toast)
- **Estados de loading** e skeleton loaders
- **Tratamento de erros** robusto

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React | 18 | Biblioteca principal |
| React Router DOM | 6+ | Navegação entre páginas |
| Tailwind CSS | 3+ | Framework CSS utilitário |
| Lucide React | - | Biblioteca de ícones |
| JavaScript | ES6+ | Linguagem de programação |

---

## Estrutura do Projeto

```
src/
├── components/
│   ├── common/                     # Componentes reutilizáveis
│   │   ├── Header.js              # Cabeçalho da aplicação
│   │   ├── Sidebar.js             # Menu lateral de navegação
│   │   ├── Toast.js               # Sistema de notificações
│   │   ├── LoadingSkeleton.js     # Componentes de loading
│   │   └── ProtectedRoute.js      # Rotas protegidas por autenticação
│   ├── auth/
│   │   └── LoginForm.js           # Formulário de autenticação
│   ├── categories/                # Componentes específicos de categorias
│   └── dashboard/                 # Componentes do dashboard principal
│       ├── StatsCards.js          # Cards de estatísticas
│       └── RecentCategories.js    # Lista de categorias recentes
├── pages/                         # Páginas principais da aplicação
│   ├── LoginPage.js               # Página de autenticação
│   ├── DashboardPage.js           # Página principal com estatísticas
│   └── CategoriesPage.js          # Página de gestão de categorias
├── services/                      # Serviços de comunicação com API
│   ├── api.js                     # Funções de comunicação com backend
│   └── auth.js                    # Serviços de autenticação
├── contexts/                      # Contextos React para estado global
│   └── AuthContext.js             # Gerenciamento de estado de autenticação
├── hooks/                         # Hooks customizados
│   ├── useToast.js                # Hook para sistema de notificações
│   └── useCategories.js           # Hook para gestão de categorias
├── utils/                         # Utilitários e helpers
│   ├── config.js                  # Configurações centralizadas
│   ├── helpers.js                 # Funções auxiliares
│   └── constants.js               # Constantes do sistema
├── App.js                         # Router principal da aplicação
└── index.js                       # Ponto de entrada
```

---

## Instalação e Configuração

### Pré-requisitos

- Node.js versão 16 ou superior
- npm ou yarn como gerenciador de pacotes

### Passos de Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre no diretório do projeto
cd dashboard-categorias

# Instale as dependências
npm install

# Instale o React Router (se necessário)
npm install react-router-dom

# Execute o projeto em modo desenvolvimento
npm start
```

### Configuração da API

Configure a URL da sua API no arquivo `src/utils/config.js`:

```javascript
export const config = {
  api: {
    baseUrl: 'http://localhost:8080', // Altere para o endereço da sua API
    version: 'v1',
    timeout: 30000,
  }
};
```

---

## Rotas da Aplicação

| Rota | Descrição | Autenticação |
|------|-----------|--------------|
| `/login` | Página de autenticação | Não |
| `/dashboard` | Página principal com estatísticas | Sim |
| `/categories` | Gestão completa de categorias | Sim |
| `/settings` | Configurações do sistema | Sim (em desenvolvimento) |

---

## Changelog

### **v2.4.03** - Grande Refatoração Arquitetural (05/08/2025)

#### Mudanças Principais

**REFATORAÇÃO COMPLETA**
- Migração de aplicação monolítica para arquitetura modular
- Implementação do React Router para navegação multi-página
- Criação de Context API para gerenciamento de estado global
- Desenvolvimento de hooks customizados para lógica reutilizável

**Nova Estrutura de Arquivos**
- Sistema de componentes modulares organizados por funcionalidade
- Páginas individuais com responsabilidades específicas
- Serviços centralizados para comunicação com API
- Utilitários organizados e reutilizáveis
- Contextos React para estado global
- Hooks customizados para lógica compartilhada

**Melhorias de Interface**
- Correção na centralização de botões "Criar Categoria"
- Aprimoramento do sistema de loading com skeleton components
- Melhoria na navegação responsiva entre páginas
- Implementação de Error Boundary para captura de erros globais

**Correções Técnicas**
- Resolução do loop infinito de requisições à API
- Correção de problemas com React StrictMode
- Implementação de sistema de cache para otimizar requisições
- Correção de dependências circulares em hooks

**Gerenciamento de Dependências**
- Adição do react-router-dom para navegação
- Remoção do arquivo monolítico Dashboard.jsx
- Limpeza de arquivos desnecessários do Create React App

### **v2.3.28** - Correções de Upload (04/08/2025)

**Correções**
- Corrigido sistema de upload de imagens na edição de categorias
- Melhorados logs de debug para upload de arquivos
- Padronizado sistema de FormData para operações de criar e editar
- Corrigido Content-Type para requisições multipart/form-data

### **v2.3.27** - Unificação de Upload (03/08/2025)

**Melhorias**
- Aplicado sistema unificado de Blob para upload de arquivos
- Corrigido campo "dados" usando Blob com Content-Type application/json
- Padronizada estrutura de requisição entre operações POST e PUT

---

## Roadmap

### **v2.5.x** - Próxima Release

- [ ] Implementação completa da página de configurações
- [ ] Sistema de permissões e roles de usuário
- [ ] Modo escuro (dark theme)
- [ ] Funcionalidade de exportação de dados

### **v2.6.x** - Release Futura

- [ ] Dashboard com gráficos e analytics avançados
- [ ] Sistema de tags e categorização avançada
- [ ] Busca avançada com múltiplos filtros
- [ ] Sistema de cache avançado com localStorage

### **v3.0.x** - Major Release

- [ ] Refatoração para TypeScript
- [ ] Implementação de testes automatizados
- [ ] Sistema de internacionalização (i18n)
- [ ] PWA (Progressive Web App) support

---

## Scripts Disponíveis

```bash
npm start          # Executa a aplicação em modo desenvolvimento
npm run build      # Gera build otimizado para produção
npm test           # Executa suite de testes (se configurada)
npm run eject      # Ejeta configurações do Create React App (irreversível)
```

---

## Padrões de Desenvolvimento

### Convenções de Código

- **Componentes funcionais** com React Hooks
- **ESLint** para análise estática de código
- **Prettier** para formatação consistente (recomendado)
- **Tailwind CSS** para estilização
- **Nomenclatura em inglês** para código, português para UI

### Estrutura de Commits

```
tipo(escopo): descrição breve

Descrição detalhada das mudanças (opcional)

- Item de mudança 1
- Item de mudança 2
```

### Versionamento

Este projeto segue o padrão **Semantic Versioning**:

- **X.Y.Z** onde:
  - **X (Major)**: Mudanças que quebram compatibilidade
  - **Y (Minor)**: Novas funcionalidades mantendo compatibilidade  
  - **Z (Patch)**: Correções de bugs e melhorias menores

---

## Arquitetura

### Fluxo de Dados

```
Componente → Hook → Service → API → Backend
    ↓           ↓        ↓       ↓
  Estado → Context → Cache → Response
```

### Gerenciamento de Estado

- **Context API** para estado global (autenticação, configurações)
- **useState/useReducer** para estado local de componentes
- **Custom Hooks** para lógica compartilhada entre componentes

### Estrutura de Rotas

- **Rotas públicas**: Acessíveis sem autenticação
- **Rotas protegidas**: Requerem autenticação válida
- **Redirecionamentos automáticos** baseados em estado de autenticação

---