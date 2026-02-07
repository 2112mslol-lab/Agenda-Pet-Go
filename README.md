# 🐾 AgendaPetGo

> Sistema completo de agendamento e gestão para Pet Shops com perfis profissionais personalizáveis.

[![Deploy](https://img.shields.io/badge/deploy-vercel-black)](https://vercel.com)
[![React](https://img.shields.io/badge/react-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/supabase-2.90.1-green)](https://supabase.com/)

---

## 🎯 Sobre o Projeto

AgendaPetGo é uma plataforma moderna e completa para gestão de Pet Shops, oferecendo:

- 📅 **Sistema de Agendamento Online** - Clientes podem agendar serviços facilmente
- 👤 **Perfis Profissionais Personalizáveis** - Cada profissional tem seu próprio perfil público
- 🎨 **Interface Moderna e Responsiva** - Design premium com Tailwind CSS e shadcn/ui
- 📊 **Dashboard Administrativo** - Gestão completa de serviços, profissionais e horários
- 🔐 **Autenticação Segura** - Sistema de login com Supabase
- 📱 **SEO Otimizado** - Páginas otimizadas para mecanismos de busca

---

## ✨ Principais Funcionalidades

### Para Clientes
- ✅ Visualizar serviços disponíveis
- ✅ Agendar horários com profissionais específicos
- ✅ Receber confirmação de agendamento
- ✅ Acessar perfis públicos dos profissionais

### Para Administradores
- ✅ Gerenciar profissionais e serviços
- ✅ Configurar horários de funcionamento
- ✅ Visualizar e gerenciar agendamentos
- ✅ Personalizar perfil da empresa
- ✅ Controlar disponibilidade de horários

---

## 🚀 Tecnologias

### Frontend
- **React 18.3** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI de alta qualidade
- **React Router** - Roteamento SPA
- **TanStack Query** - Gerenciamento de estado assíncrono

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Real-time subscriptions
  - Edge Functions

### Ferramentas
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Recharts** - Visualização de dados
- **Vitest** - Framework de testes

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/agendapetgo.git
cd agendapetgo
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo .env.example para .env
# Adicione suas credenciais do Supabase
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

4. **Execute as migrações do banco de dados**
```bash
# Configure o Supabase CLI e execute as migrações em supabase/migrations/
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Acesse a aplicação**
```
http://localhost:5173
```

---

## 🏗️ Estrutura do Projeto

```
agendapetgo/
├── src/
│   ├── components/      # Componentes React reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   ├── hooks/          # Custom hooks
│   ├── integrations/   # Integrações (Supabase)
│   └── lib/            # Utilitários
├── supabase/           # Configuração e migrações
└── public/             # Arquivos estáticos
```

📖 **Documentação completa**: Veja [ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md)

---

## 📝 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Linting do código
npm run test         # Executar testes
npm run test:watch   # Testes em modo watch
```

---

## 🚀 Deploy

Este projeto está configurado para deploy automático na **Vercel**.

### Deploy Manual
```bash
npm run build
# Os arquivos de build estarão em dist/
```

### Configuração Vercel
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework Preset: `vite`

---

## 🔐 Integração Mercado Pago

Para configurar pagamentos com Mercado Pago:

1. Consulte [MERCADOPAGO_GUIDE.md](./MERCADOPAGO_GUIDE.md) para configuração da Edge Function
2. Consulte [MERCADOPAGO_WEBHOOK.md](./MERCADOPAGO_WEBHOOK.md) para configuração de webhooks

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é privado e proprietário.

---

## 📧 Contato

Para dúvidas ou suporte, entre em contato através do repositório.

---

**Desenvolvido com ❤️ para Pet Shops**
