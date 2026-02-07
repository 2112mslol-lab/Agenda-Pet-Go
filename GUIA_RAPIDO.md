# 🚀 Guia Rápido - AgendaPetGo

> Referência rápida para desenvolvedores

---

## 🎯 Comandos Essenciais

```bash
# Desenvolvimento
npm run dev              # Inicia servidor local (http://localhost:5173)

# Build
npm run build           # Build de produção
npm run build:dev       # Build em modo desenvolvimento
npm run preview         # Preview do build

# Qualidade
npm run lint            # Verificar código
npm run test            # Executar testes
npm run test:watch      # Testes em modo watch
```

---

## 📂 Onde Encontrar...

### Componentes
- **UI Base**: `src/components/ui/` (28 componentes shadcn/ui)
- **Componentes de Negócio**: `src/components/`
  - `BookingForm.tsx` - Formulário de agendamento
  - `ProfessionalManager.tsx` - Gestão de profissionais
  - `ServiceManager.tsx` - Gestão de serviços
  - `BusinessHoursManager.tsx` - Gestão de horários

### Páginas
- **Landing Page**: `src/pages/Index.tsx`
- **Dashboard**: `src/pages/Dashboard.tsx` (arquivo principal - 60KB)
- **Login**: `src/pages/Login.tsx`
- **Perfil Profissional**: `src/pages/ProfessionalProfile.tsx`
- **Páginas SEO**: `src/pages/Agendamento*.tsx`, `src/pages/Sistema*.tsx`

### Configuração
- **Supabase**: `src/integrations/supabase/`
- **Hooks**: `src/hooks/`
- **Utilitários**: `src/lib/`
- **Estilos**: `src/index.css`, `tailwind.config.ts`

---

## 🗺️ Rotas da Aplicação

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | Index.tsx | Landing page |
| `/login` | Login.tsx | Autenticação |
| `/dashboard` | Dashboard.tsx | Painel admin |
| `/:slug` | ProfessionalProfile.tsx | Perfil público |
| `/agendamento-pet-shop` | AgendamentoPetShop.tsx | SEO |
| `/agenda-online-banho-e-tosa` | AgendaOnlineBanhoTosa.tsx | SEO |
| `/sistema-para-pet-shop` | SistemaParaPetShop.tsx | SEO |

---

## 🎨 Componentes UI Mais Usados

```tsx
// Botões
import { Button } from "@/components/ui/button"

// Formulários
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Form } from "@/components/ui/form"

// Cards
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Modais
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"

// Notificações
import { useToast } from "@/hooks/use-toast"
import { toast } from "sonner"

// Navegação
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
```

---

## 🔧 Configuração Inicial

### 1. Variáveis de Ambiente (.env)
```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_supabase
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Executar Migrações
```bash
# Configurar Supabase CLI
# Executar migrações em supabase/migrations/
```

---

## 📊 Estrutura do Dashboard

O Dashboard (`src/pages/Dashboard.tsx`) possui as seguintes abas:

1. **Agendamentos** - Visualizar e gerenciar agendamentos
2. **Profissionais** - Gerenciar profissionais
3. **Serviços** - Gerenciar serviços oferecidos
4. **Horários** - Configurar horários de funcionamento
5. **Configurações** - Configurações gerais do perfil

---

## 🔐 Autenticação

```tsx
// Verificar usuário logado
import { supabase } from "@/integrations/supabase/client"

const { data: { user } } = await supabase.auth.getUser()

// Login
await supabase.auth.signInWithPassword({ email, password })

// Logout
await supabase.auth.signOut()
```

---

## 📝 Padrões de Código

### Componentes
```tsx
// Sempre use TypeScript
interface Props {
  title: string
  onSubmit: () => void
}

export const MyComponent = ({ title, onSubmit }: Props) => {
  return <div>{title}</div>
}
```

### Queries (TanStack Query)
```tsx
import { useQuery } from "@tanstack/react-query"

const { data, isLoading } = useQuery({
  queryKey: ['key'],
  queryFn: async () => {
    // fetch data
  }
})
```

### Formulários (React Hook Form + Zod)
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const schema = z.object({
  name: z.string().min(1)
})

const form = useForm({
  resolver: zodResolver(schema)
})
```

---

## 🎨 Estilização

### Tailwind Classes
```tsx
// Usar classes utilitárias do Tailwind
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
  <Button className="bg-primary hover:bg-primary/90">
    Click me
  </Button>
</div>
```

### Classes Customizadas
Definidas em `src/index.css` e `tailwind.config.ts`

---

## 🐛 Debug

### Logs do Supabase
```tsx
const { data, error } = await supabase.from('table').select()
if (error) console.error('Supabase error:', error)
```

### React Query DevTools
Já configurado no projeto - abra o navegador e veja o painel

---

## 📚 Documentação Completa

- **README.md** - Visão geral e instalação
- **ESTRUTURA_PROJETO.md** - Estrutura detalhada
- **RELATORIO_LIMPEZA.md** - Relatório de organização
- **MERCADOPAGO_GUIDE.md** - Integração Mercado Pago
- **MERCADOPAGO_WEBHOOK.md** - Webhooks Mercado Pago

---

## 🆘 Problemas Comuns

### Build falha
```bash
# Limpar cache e reinstalar
rm -rf node_modules dist
npm install
npm run build
```

### Erro de autenticação Supabase
- Verificar variáveis de ambiente
- Verificar se o projeto Supabase está ativo
- Verificar credenciais

### Componente não encontrado
- Verificar import path (`@/components/...`)
- Verificar se o componente existe em `src/components/ui/`

---

## 🚀 Deploy

### Vercel (Automático)
- Push para branch principal
- Deploy automático configurado

### Manual
```bash
npm run build
# Upload pasta dist/ para servidor
```

---

## 📞 Suporte

Para dúvidas:
1. Consulte a documentação completa
2. Verifique os comentários no código
3. Entre em contato com a equipe

---

**Última atualização**: 07/02/2026
