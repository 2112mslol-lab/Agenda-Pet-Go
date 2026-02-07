# 📁 Estrutura do Projeto AgendaPetGo

## 🎯 Visão Geral
Sistema de agendamento e gestão para Pet Shops com perfis profissionais personalizáveis.

---

## 📂 Estrutura de Diretórios

```
agendapetgo/
├── 📁 public/                    # Arquivos públicos estáticos
│   ├── hero-bg.png              # Imagem de fundo do hero
│   ├── logo.png                 # Logo da aplicação
│   └── robots.txt               # SEO - Instruções para crawlers
│
├── 📁 src/                       # Código-fonte principal
│   ├── 📁 components/           # Componentes React reutilizáveis
│   │   ├── 📁 ui/              # Componentes UI do shadcn/ui (28 componentes ativos)
│   │   ├── BookingForm.tsx     # Formulário de agendamento
│   │   ├── BookingSuccess.tsx  # Tela de sucesso do agendamento
│   │   ├── BusinessHoursManager.tsx  # Gerenciamento de horários
│   │   ├── HeroSection.tsx     # Seção hero da landing page
│   │   ├── ProfessionalManager.tsx   # Gerenciamento de profissionais
│   │   ├── SEO.tsx             # Componente de SEO
│   │   ├── SEOPageTemplate.tsx # Template para páginas SEO
│   │   ├── ServiceManager.tsx  # Gerenciamento de serviços
│   │   ├── ServicesSection.tsx # Seção de serviços
│   │   ├── TimeSlotPicker.tsx  # Seletor de horários
│   │   └── TrustSection.tsx    # Seção de confiança
│   │
│   ├── 📁 hooks/                # Custom React Hooks
│   │   ├── use-mobile.tsx      # Hook para detecção mobile
│   │   └── use-toast.ts        # Hook para notificações toast
│   │
│   ├── 📁 integrations/         # Integrações externas
│   │   └── supabase/           # Cliente e queries do Supabase
│   │
│   ├── 📁 lib/                  # Utilitários e helpers
│   │
│   ├── 📁 pages/                # Páginas da aplicação
│   │   ├── AgendaOnlineBanhoTosa.tsx    # Página SEO
│   │   ├── AgendamentoPetShop.tsx       # Página SEO
│   │   ├── Dashboard.tsx                # Dashboard principal (60KB)
│   │   ├── Index.tsx                    # Landing page (21KB)
│   │   ├── Login.tsx                    # Página de login
│   │   ├── NotFound.tsx                 # Página 404
│   │   ├── ProfessionalProfile.tsx      # Perfil do profissional
│   │   └── SistemaParaPetShop.tsx       # Página SEO
│   │
│   ├── 📁 test/                 # Testes
│   │   ├── example.test.ts     # Exemplo de teste
│   │   └── setup.ts            # Configuração de testes
│   │
│   ├── App.tsx                  # Componente raiz da aplicação
│   ├── index.css                # Estilos globais
│   ├── main.tsx                 # Entry point da aplicação
│   └── vite-env.d.ts           # Tipos do Vite
│
├── 📁 supabase/                 # Configuração do Supabase
│   ├── config.toml             # Configuração
│   └── migrations/             # Migrações do banco de dados (9 arquivos)
│
├── 📄 Arquivos de Configuração
│   ├── .env                    # Variáveis de ambiente
│   ├── .gitignore              # Arquivos ignorados pelo Git
│   ├── components.json         # Configuração do shadcn/ui
│   ├── eslint.config.js        # Configuração do ESLint
│   ├── index.html              # HTML principal
│   ├── package.json            # Dependências e scripts
│   ├── postcss.config.js       # Configuração do PostCSS
│   ├── tailwind.config.ts      # Configuração do Tailwind CSS
│   ├── tsconfig.json           # Configuração do TypeScript
│   ├── tsconfig.app.json       # TypeScript para app
│   ├── tsconfig.node.json      # TypeScript para Node
│   ├── vercel.json             # Configuração do Vercel
│   ├── vite.config.ts          # Configuração do Vite
│   └── vitest.config.ts        # Configuração do Vitest
│
└── 📄 Documentação
    ├── README.md               # Documentação principal
    ├── MERCADOPAGO_GUIDE.md    # Guia de integração Mercado Pago
    └── MERCADOPAGO_WEBHOOK.md  # Configuração de webhooks

```

---

## 🎨 Componentes UI Ativos (shadcn/ui)

### Componentes Essenciais (Alta Utilização)
- ✅ **button** (181 usos) - Botões da aplicação
- ✅ **select** (155 usos) - Seleção de opções
- ✅ **card** (151 usos) - Cards de conteúdo
- ✅ **toast** (140 usos) - Notificações
- ✅ **label** (107 usos) - Labels de formulários
- ✅ **dialog** (80 usos) - Modais e diálogos
- ✅ **input** (69 usos) - Campos de entrada
- ✅ **form** (65 usos) - Formulários

### Componentes Moderados
- ✅ **alert** (58 usos) - Alertas
- ✅ **separator** (44 usos) - Separadores visuais
- ✅ **tooltip** (37 usos) - Tooltips
- ✅ **tabs** (37 usos) - Abas
- ✅ **toggle** (36 usos) - Toggles
- ✅ **collapsible** (23 usos) - Conteúdo recolhível
- ✅ **checkbox** (23 usos) - Checkboxes
- ✅ **popover** (21 usos) - Popovers
- ✅ **toaster** (18 usos) - Container de toasts

### Componentes de Suporte
- ✅ **badge** (11 usos) - Badges
- ✅ **calendar** (10 usos) - Calendário
- ✅ **skeleton** (10 usos) - Loading states
- ✅ **sonner** (9 usos) - Notificações alternativas
- ✅ **switch** (8 usos) - Switches
- ✅ **avatar** (7 usos) - Avatares
- ✅ **sheet** (5 usos) - Painéis laterais
- ✅ **table** (4 usos) - Tabelas
- ✅ **chart** (3 usos) - Gráficos
- ✅ **textarea** (2 usos) - Áreas de texto

---

## 🚀 Páginas e Rotas

### Rotas Principais
- `/` - Landing page (Index.tsx)
- `/login` - Autenticação
- `/dashboard` - Painel administrativo
- `/:slug` - Perfil dinâmico do profissional

### Páginas SEO (Marketing)
- `/agendamento-pet-shop` - SEO para agendamento
- `/agenda-online-banho-e-tosa` - SEO para banho e tosa
- `/sistema-para-pet-shop` - SEO para sistema

---

## 🔧 Stack Tecnológica

### Core
- **React 18.3.1** - Framework UI
- **TypeScript 5.8.3** - Tipagem estática
- **Vite 5.4.19** - Build tool
- **React Router 6.30.1** - Roteamento

### UI & Styling
- **Tailwind CSS 3.4.17** - Framework CSS
- **shadcn/ui** - Componentes UI
- **Radix UI** - Primitivos acessíveis
- **Lucide React** - Ícones

### Backend & Database
- **Supabase 2.90.1** - Backend as a Service
- **TanStack Query 5.83.0** - Gerenciamento de estado assíncrono

### Forms & Validation
- **React Hook Form 7.61.1** - Gerenciamento de formulários
- **Zod 3.25.76** - Validação de schemas

### Charts & Data Visualization
- **Recharts 2.15.4** - Gráficos

### Testing
- **Vitest 3.2.4** - Framework de testes
- **Testing Library** - Testes de componentes

---

## 📊 Estatísticas do Projeto

### Tamanho dos Arquivos Principais
- **Dashboard.tsx**: 60.2 KB (arquivo mais complexo)
- **Index.tsx**: 21.0 KB (landing page)
- **BookingForm.tsx**: 18.8 KB
- **ProfessionalProfile.tsx**: 10.1 KB

### Dependências
- **Produção**: 50 pacotes
- **Desenvolvimento**: 20 pacotes

---

## 🧹 Limpeza Realizada

### Arquivos Removidos (23 arquivos)
✅ **21 componentes UI não utilizados**:
- accordion, alert-dialog, aspect-ratio, breadcrumb, carousel
- command, context-menu, drawer, dropdown-menu, hover-card
- input-otp, menubar, navigation-menu, pagination, progress
- radio-group, resizable, scroll-area, sidebar, slider, toggle-group

✅ **2 arquivos adicionais**:
- App.css (não importado)
- health.txt (arquivo temporário)

### Resultado
- **Redução de código morto**: ~100KB
- **Manutenibilidade**: Melhorada
- **Clareza**: Estrutura mais limpa

---

## 📝 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run build:dev    # Build em modo desenvolvimento
npm run preview      # Preview do build
npm run lint         # Linting
npm run test         # Executar testes
npm run test:watch   # Testes em modo watch
```

---

## 🔐 Variáveis de Ambiente

Configuradas em `.env`:
- Credenciais do Supabase
- Tokens de API
- Configurações de ambiente

---

## 📦 Deploy

- **Plataforma**: Vercel
- **Deploy automático**: Configurado
- **Configuração**: `vercel.json`

---

## 🎯 Próximos Passos Sugeridos

1. ✅ **Organização concluída** - Arquivos mortos removidos
2. 📝 **Documentação** - Adicionar JSDoc aos componentes principais
3. 🧪 **Testes** - Expandir cobertura de testes
4. ♿ **Acessibilidade** - Auditoria WCAG
5. 🚀 **Performance** - Otimização de bundle size
6. 📱 **PWA** - Transformar em Progressive Web App

---

**Última atualização**: 07/02/2026
**Versão**: 0.0.0
