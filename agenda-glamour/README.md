# 👑 Agenda Glamour - Sistema Premium de Agendamento

Sistema de agendamento profissional para salões de beleza, desenvolvido com **React 19 + Vite** e design **corporativo premium**.

## 🎨 Design System Profissional

O projeto implementa um **sistema de design premium** com identidade visual sofisticada:

### **Paleta de Cores Corporativa**

- **Primária**: `#2563eb` (Azul profissional)
- **Secundária**: `#f8fafc` (Cinza claro elegante)
- **Fundo**: `#fafbfc` (Off-white premium)
- **Acentos**: Sistema completo para success, warning, error
- **Tema escuro**: Suporte completo com variáveis CSS

### **Tipografia Elegante**

- **Inter** - Fonte principal (corpo de texto, interface)
- **Playfair Display** - Fonte de destaque (títulos, logo)
- **Hierarquia consistente** com pesos e tamanhos profissionais

### **Sistema de Ícones Premium**

- **Biblioteca personalizada** de ícones SVG vetorizados
- **40+ ícones profissionais** específicos para salões de beleza
- **Design refinado** com `strokeWidth: 1.5` para elegância
- **Ícones exclusivos**: crown, diamond, palette, scissors, award, etc.

## 🏗️ Arquitetura do Sistema

### **Estrutura de Pastas Otimizada**

```
agenda-glamour/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes principais
│   │   │   ├── ui/              # Sistema de design
│   │   │   │   ├── Icons.jsx    # Biblioteca de ícones premium
│   │   │   │   ├── use-mobile.ts # Hook responsivo
│   │   │   │   └── utils.ts     # Utilitários
│   │   │   ├── AdminDashboard.jsx      # Painel administrativo
│   │   │   ├── AdminAppointments.jsx   # Gestão de agendamentos
│   │   │   ├── AppointmentsList.jsx    # Lista do cliente
│   │   │   ├── BookingForm.jsx         # Formulário de agendamento
│   │   │   ├── DashboardOverview.jsx   # Dashboard com métricas
│   │   │   ├── ProfessionalsManagement.jsx # CRUD profissionais
│   │   │   ├── ServicesManagement.jsx  # CRUD serviços
│   │   │   └── SharedDataWrapper.jsx   # Provider de estado global
│   │   └── App.css              # Estilos do componente principal
│   ├── services/
│   │   └── api.js               # Camada de API/Backend
│   ├── styles/                  # Sistema de estilos modular
│   │   ├── fonts.css            # Tipografia profissional
│   │   ├── theme.css            # Variáveis CSS e temas
│   │   ├── index.css            # Reset e estilos base
│   │   ├── utilities.css        # Classes utilitárias
│   │   └── tailwind.css         # Configuração Tailwind
│   ├── App.jsx                  # Componente raiz do cliente
│   └── main.jsx                 # Entry point da aplicação
├── backend-glamour/             # API Backend (Node.js + Prisma)
│   ├── routes/                  # Endpoints da API
│   ├── prisma/                  # Schema do banco de dados
│   └── server.js               # Servidor Express
├── tailwind.config.js          # Configuração do Tailwind CSS
├── postcss.config.mjs          # Configuração PostCSS
└── vite.config.js              # Configuração Vite
```

### **Fluxo de Navegação e Conexão entre Páginas**

#### **1. Roteamento Principal**

```jsx
// SharedDataWrapper.jsx - Gerenciador central de rotas
<Routes>
  <Route path="/" element={<App />} /> // Área do Cliente
  <Route path="/admin" element={<AdminDashboard />} /> // Área Admin
</Routes>
```

#### **2. Área do Cliente (`/`)**

- **Landing Page** com identidade premium
- **Tabs de navegação**:
  - `Novo Agendamento` → `BookingForm.jsx`
  - `Meus Agendamentos` → `AppointmentsList.jsx`

#### **3. Área Administrativa (`/admin`)**

- **Dashboard principal** com 4 seções em tabs:
  - `Visão Geral` → `DashboardOverview.jsx` (métricas e gráficos)
  - `Agendamentos` → `AdminAppointments.jsx` (CRUD completo)
  - `Profissionais` → `ProfessionalsManagement.jsx` (gestão de equipe)
  - `Serviços` → `ServicesManagement.jsx` (catálogo de serviços)

### **Gerenciamento de Estado Global**

O `SharedDataWrapper` atua como **provider centralizado**:

```jsx
// Estado compartilhado entre todas as páginas
const [appointments, setAppointments] = useState([]);
const [professionals, setProfessionals] = useState([]);
const [services, setServices] = useState([]);

// Sincronização automática entre cliente e admin
// Mudanças no admin refletem instantaneamente no cliente
```

### **Comunicação Frontend ↔ Backend**

```jsx
// services/api.js - Camada de abstração da API
export const servicesApi = {
  getAll: () => fetch("/api/services"),
  create: (data) => fetch("/api/services", { method: "POST", body: data }),
  update: (id, data) =>
    fetch(`/api/services/${id}`, { method: "PUT", body: data }),
  delete: (id) => fetch(`/api/services/${id}`, { method: "DELETE" }),
};
```

## ⚡ Tecnologias e Stack

### **Frontend Moderno**

- **React 19** - Framework principal com hooks mais recentes
- **Vite** - Build tool ultra-rápido
- **React Router DOM 7** - Roteamento SPA
- **Recharts 3.6** - Gráficos e dashboards interativos
- **Tailwind CSS** - Framework CSS utilitário
- **PostCSS** - Processamento CSS avançado

### **Backend Robusto**

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **Prisma** - ORM moderno e type-safe
- **PostgreSQL/SQLite** - Banco de dados relacional

### **Ferramentas de Desenvolvimento**

- **ESLint** - Linting e qualidade de código
- **Lucide React** - Ícones adicionais premium
- **CSS Custom Properties** - Variáveis CSS nativas para temas

## 🚀 Funcionalidades Implementadas

### **Área do Cliente (UX Premium)**

✅ **Agendamento Intuitivo**

- Formulário step-by-step elegante
- Seleção visual de horários disponíveis
- Validação em tempo real
- Confirmação com resumo detalhado

✅ **Gestão de Agendamentos**

- Dashboard pessoal com estatísticas
- Histórico completo de serviços
- Cancelamento simplificado
- Status visual (confirmado, pendente, concluído)

### **Área Administrativa (Gestão Completa)**

✅ **Dashboard Executivo**

- Métricas em tempo real
- Gráficos interativos (receita, agendamentos)
- KPIs profissionais
- Análise de performance por período

✅ **CRUD Completo**

- **Serviços**: Criar, editar, excluir com categorias
- **Profissionais**: Gestão de equipe com especialidades
- **Agendamentos**: Controle total do calendário

✅ **Sincronização Live**

- Estado global compartilhado
- Updates em tempo real
- Consistência de dados garantida

## 🎯 Como Executar o Projeto

### **1. Configuração do Frontend**

```bash
# Clone o repositório
git clone <repo-url>
cd agenda-glamour/agenda-glamour

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### **2. Configuração do Backend**

```bash
# Navegue para o backend
cd ../backend-glamour

# Instale as dependências
npm install

# Configure o banco de dados
npx prisma generate
npx prisma db push

# Inicie o servidor
npm start
```

### **3. Acessos do Sistema**

- **Cliente**: [http://localhost:5173/](http://localhost:5173/)
- **Admin**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **API**: [http://localhost:3001/](http://localhost:3001/)

## 🔧 Configurações Técnicas

### **Variáveis CSS (Design System)**

```css
/* theme.css - Sistema de cores profissional */
:root {
  --primary: #2563eb; /* Azul corporativo */
  --secondary: #f8fafc; /* Cinza elegante */
  --success: #059669; /* Verde profissional */
  --warning: #d97706; /* Laranja executivo */
  --destructive: #dc2626; /* Vermelho corporativo */
  --radius: 0.5rem; /* Bordas consistentes */
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1); /* Sombras elegantes */
}
```

### **Componente de Ícone Reutilizável**

```jsx
// ui/Icons.jsx - Sistema de ícones premium
<Icon name="crown" size={28} className="text-primary" />
<Icon name="calendar" size={18} />
<Icon name="diamond" size={24} />
```

### **Classes Utilitárias Profissionais**

```css
/* utilities.css - Sistema de classes reutilizáveis */
.btn-primary {
  background: var(--primary);
  color: var(--primary-foreground);
}
.card {
  background: var(--card);
  border: 1px solid var(--border);
}
.shadow-premium {
  box-shadow: var(--shadow-xl);
}
```

## 🌟 Diferenciais Técnicos

### **Performance Otimizada**

- **Lazy loading** de componentes
- **Memoização** com React.memo
- **Bundle splitting** automático do Vite
- **Tree shaking** para builds menores

### **Responsividade Premium**

- **Mobile-first** design approach
- **Breakpoints profissionais** (480px, 768px, 1024px, 1200px)
- **Touch-friendly** interfaces
- **Progressive enhancement**

### **Acessibilidade (A11y)**

- **ARIA labels** completos
- **Keyboard navigation** otimizada
- **High contrast** mode support
- **Screen reader** compatibility

### **Developer Experience**

- **Hot Module Replacement** (HMR)
- **TypeScript** ready structure
- **ESLint** configuration avançada
- **Component documentation** inline

## 🚀 Roadmap e Melhorias Futuras

### **V2.0 - Autenticação & Segurança**

- [ ] Sistema de login/registro
- [ ] JWT tokens e refresh tokens
- [ ] Roles e permissões (admin, funcionário, cliente)
- [ ] Proteção de rotas sensíveis

### **V2.1 - Features Premium**

- [ ] Notificações push em tempo real
- [ ] Sistema de avaliações e reviews
- [ ] Programa de fidelidade
- [ ] Integração com calendários (Google, Outlook)

### **V2.2 - Análises Avançadas**

- [ ] Dashboard de BI com analytics
- [ ] Relatórios exportáveis (PDF, Excel)
- [ ] Previsão de demanda com IA
- [ ] Métricas de satisfação do cliente

### **V2.3 - Integrações**

- [ ] Gateway de pagamento (Stripe, PagSeguro)
- [ ] WhatsApp Business API
- [ ] SMS confirmações automáticas
- [ ] Integração com redes sociais

### **V2.4 - Expansão**

- [ ] Multi-tenancy (múltiplos salões)
- [ ] App mobile nativo (React Native)
- [ ] PWA com offline-first
- [ ] Marketplace de serviços

## 📱 Compatibilidade

- ✅ **Chrome 90+**
- ✅ **Firefox 88+**
- ✅ **Safari 14+**
- ✅ **Edge 90+**
- ✅ **Mobile browsers** (iOS Safari, Chrome Mobile)

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo LICENSE para detalhes.

---

**Desenvolvido com 💎 para oferecer uma experiência premium tanto para clientes quanto para administradores de salões de beleza.**

## Documentação dos Componentes

- **App.jsx**: Interface do cliente, recebe dados via props, exibe agendamentos e formulário de agendamento
- **AdminDashboard.jsx**: Painel administrativo, gerencia serviços, profissionais e agendamentos
- **SharedDataWrapper.jsx**: Centraliza e compartilha estado global entre cliente e admin
- **BookingForm.jsx**: Formulário para agendar serviços
- **AppointmentsList.jsx**: Lista de agendamentos do cliente, permite cancelar
- **DashboardOverview.jsx**: Exibe estatísticas e gráficos para o admin
- **ProfessionalsManagement.jsx**: CRUD de profissionais
- **ServicesManagement.jsx**: CRUD de serviços

---

Projeto pronto para evoluir e receber dados reais, com arquitetura moderna e escalável.
