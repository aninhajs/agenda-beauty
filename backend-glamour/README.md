# 🔗 Backend Agenda Glamour API

API REST profissional para o sistema premium de agendamento **Agenda Glamour**.

## 🏗️ Arquitetura da API

### **Stack Tecnológico**

- **Node.js 18+** - Runtime JavaScript moderno
- **Express.js 4.18** - Framework web minimalista e rápido
- **Prisma ORM 5.x** - ORM type-safe com auto-completion
- **PostgreSQL** - Banco de dados relacional robusto (via Supabase)
- **JWT** - Autenticação stateless segura
- **bcrypt** - Hash de senhas com salt

### **Estrutura do Projeto**

```
backend-glamour/
├── routes/                    # Endpoints da API
│   ├── appointments.js        # CRUD de agendamentos
│   ├── auth.js               # Login/registro/autenticação
│   ├── professionals.js      # Gestão de profissionais
│   └── services.js          # Catálogo de serviços
├── prisma/                   # Configuração do banco
│   ├── schema.prisma        # Schema do banco de dados
│   └── migrations/          # Histórico de migrações
├── generated/prisma/         # Cliente Prisma auto-gerado
├── .env                     # Variáveis de ambiente
├── server.js                # Servidor Express principal
└── package.json             # Dependências e scripts
```

## 🔧 Configuração e Setup

### **1. Pré-requisitos**

```bash
# Verificar versões
node --version  # Requer v18+
npm --version   # Requer v8+
```

### **2. Instalação**

```bash
# Clone o repositório (se necessário)
cd backend-glamour

# Instalar dependências
npm install
```

### **3. Configuração do Banco de Dados**

#### **Opção A: Supabase (Recomendado para produção)**

```bash
# 1. Crie uma conta no Supabase: https://supabase.com
# 2. Crie um novo projeto
# 3. Vá em Settings > Database > Connection String
# 4. Copie a URL de conexão
```

#### **Opção B: PostgreSQL Local**

```bash
# 1. Instale PostgreSQL localmente
# 2. Crie um banco de dados
createdb agenda_glamour_db
```

### **4. Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do backend:

```env
# Banco de dados (escolha uma das opções)
# Supabase
DATABASE_URL="postgresql://postgres:[SUA_SENHA]@[ID_DO_PROJETO].supabase.co:5432/postgres"

# Ou PostgreSQL Local
# DATABASE_URL="postgresql://usuario:senha@localhost:5432/agenda_glamour_db"

# Segurança
JWT_SECRET="sua-chave-secreta-muito-segura-aqui-min-32-chars"
BCRYPT_ROUNDS=12

# Servidor
PORT=3001
NODE_ENV=development

# CORS (frontend URL)
FRONTEND_URL="http://localhost:5173"
```

### **5. Configuração do Prisma**

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações (primeira vez)
npx prisma migrate dev --name init

# Ou empurrar mudanças do schema (desenvolvimento)
npx prisma db push

# Visualizar dados (opcional)
npx prisma studio
```

## 🚀 Executar o Servidor

### **Desenvolvimento**

```bash
npm run dev
# Servidor inicia em: http://localhost:3001
# Hot reload ativado com nodemon
```

### **Produção**

```bash
npm start
# Servidor otimizada para produção
```

## 📋 Endpoints da API

### **Base URL**: `http://localhost:3001/api`

### **🔐 Autenticação (`/auth`)**

```bash
# Registrar novo usuário
POST /api/auth/register
Content-Type: application/json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "role": "client" // ou "admin"
}

# Login
POST /api/auth/login
Content-Type: application/json
{
  "email": "joao@email.com",
  "password": "senha123"
}

# Verificar token
GET /api/auth/verify
Authorization: Bearer <token>
```

### **📅 Agendamentos (`/appointments`)**

```bash
# Listar agendamentos
GET /api/appointments
Authorization: Bearer <token>

# Criar agendamento
POST /api/appointments
Authorization: Bearer <token>
Content-Type: application/json
{
  "serviceId": "uuid",
  "professionalId": "uuid",
  "date": "2026-03-15",
  "time": "14:30",
  "clientName": "Maria Silva",
  "clientPhone": "(11) 99999-9999"
}

# Atualizar agendamento
PUT /api/appointments/:id
Authorization: Bearer <token>
Content-Type: application/json
{
  "status": "confirmed", // confirmed, pending, cancelled, completed
  "date": "2026-03-16",
  "time": "15:00"
}

# Deletar agendamento
DELETE /api/appointments/:id
Authorization: Bearer <token>
```

### **👥 Profissionais (`/professionals`)**

```bash
# Listar profissionais
GET /api/professionals

# Criar profissional (admin)
POST /api/professionals
Authorization: Bearer <token-admin>
Content-Type: application/json
{
  "name": "Ana Paula",
  "specialty": "Colorista",
  "phone": "(11) 88888-8888",
  "email": "ana@salao.com"
}

# Atualizar profissional
PUT /api/professionals/:id
Authorization: Bearer <token-admin>

# Deletar profissional
DELETE /api/professionals/:id
Authorization: Bearer <token-admin>
```

### **✂️ Serviços (`/services`)**

```bash
# Listar serviços
GET /api/services

# Criar serviço (admin)
POST /api/services
Authorization: Bearer <token-admin>
Content-Type: application/json
{
  "name": "Corte + Escova",
  "description": "Corte personalizado com escova modeladora",
  "price": 120.00,
  "duration": 90,
  "category": "Cabelo"
}

# Atualizar serviço
PUT /api/services/:id
Authorization: Bearer <token-admin>

# Deletar serviço
DELETE /api/services/:id
Authorization: Bearer <token-admin>
```

## 📊 Schema do Banco de Dados

### **Tabelas Principais**

#### **Users**

```sql
- id: UUID (PK)
- name: String
- email: String (unique)
- password: String (hashed)
- role: Enum(client, admin)
- phone: String?
- created_at: DateTime
- updated_at: DateTime
```

#### **Services**

```sql
- id: UUID (PK)
- name: String
- description: String?
- price: Decimal
- duration: Integer (minutos)
- category: String
- active: Boolean
- created_at: DateTime
- updated_at: DateTime
```

#### **Professionals**

```sql
- id: UUID (PK)
- name: String
- specialty: String
- phone: String?
- email: String?
- active: Boolean
- created_at: DateTime
- updated_at: DateTime
```

#### **Appointments**

```sql
- id: UUID (PK)
- user_id: UUID (FK → Users)
- service_id: UUID (FK → Services)
- professional_id: UUID (FK → Professionals)
- date: Date
- time: Time
- status: Enum(pending, confirmed, cancelled, completed)
- client_name: String
- client_phone: String?
- notes: String?
- price: Decimal
- created_at: DateTime
- updated_at: DateTime
```

## 🔒 Segurança e Middlewares

### **Autenticação JWT**

```javascript
// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
```

### **Validação de Dados**

- **express-validator** para sanitização
- **Joi** para schemas de validação
- **Rate limiting** com express-rate-limit
- **CORS** configurado para domínios específicos

### **Hash de Senhas**

```javascript
// bcrypt com 12 rounds (recomendado para 2026)
const hashedPassword = await bcrypt.hash(password, 12);
```

## 🐛 Debugging e Logs

### **Logs Estruturados**

```bash
# Ativar logs detalhados
DEBUG=agenda-glamour:* npm run dev

# Logs de database
DEBUG=prisma:* npm run dev
```

### **Prisma Studio (Database GUI)**

```bash
npx prisma studio
# Interface web em: http://localhost:5555
```

## 📦 Deploy e Produção

### **Variáveis de Produção**

```env
NODE_ENV=production
DATABASE_URL="postgresql://..."
JWT_SECRET="chave-super-secreta-producao"
PORT=3001
```

### **Build e Deploy**

```bash
# Build otimizada
npm run build

# Deploy no Heroku
git push heroku main

# Deploy na Vercel
vercel --prod

# Deploy no Railway
railway up
```

## 🔄 Sincronização com Frontend

### **Estado Global Compartilhado**

O backend mantém **sincronização em tempo real** com o frontend através de:

1. **APIs RESTful** padronizadas
2. **WebSockets** para atualizações live (roadmap)
3. **Polling inteligente** para dados críticos
4. **Cache strategy** otimizada

### **Fluxo de Dados**

```
Frontend (React) ↔️ API (Express) ↔️ Database (PostgreSQL)
     ↓                    ↓                    ↓
SharedDataWrapper → HTTP Requests → Prisma ORM
```

## 🧪 Testes e Qualidade

### **Executar Testes**

```bash
# Testes unitários
npm test

# Testes de integração
npm run test:integration

# Coverage
npm run test:coverage
```

### **Linting e Formatação**

```bash
# ESLint
npm run lint

# Prettier
npm run format
```

## 📈 Performance e Otimização

### **Database Optimization**

- **Indexes** em campos de busca frequente
- **Connection pooling** com Prisma
- **Query optimization** com explain analyze

### **API Performance**

- **Compression** middleware ativado
- **Rate limiting** por endpoint
- **Response caching** estratégico
- **Request validation** eficiente

## 🔮 Roadmap Backend

### **V2.0 - Features Premium**

- [ ] **WebSockets** para real-time notifications
- [ ] **File upload** para fotos de profissionais
- [ ] **Email service** com templates
- [ ] **SMS integration** para confirmações

### **V2.1 - Analytics**

- [ ] **Metrics collection** com Prometheus
- [ ] **Business intelligence** endpoints
- [ ] **Reports generation** (PDF/Excel)
- [ ] **Data export** APIs

### **V2.2 - Integrations**

- [ ] **Payment gateway** (Stripe/PagSeguro)
- [ ] **Calendar sync** (Google/Outlook)
- [ ] **WhatsApp Business** API
- [ ] **Social login** (Google/Facebook)

---

**🔧 API desenvolvida para alta performance, escalabilidade e experiência premium.**

```bash
npm start
```

O servidor rodará na porta 3001 por padrão.

## Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### Profissionais

- `GET /api/professionals` - Listar profissionais
- `GET /api/professionals/:id` - Buscar profissional
- `POST /api/professionals` - Criar profissional (admin)
- `PUT /api/professionals/:id` - Atualizar profissional (admin)
- `DELETE /api/professionals/:id` - Deletar profissional (admin)

### Serviços

- `GET /api/services` - Listar serviços
- `GET /api/services/:id` - Buscar serviço
- `POST /api/services` - Criar serviço (admin)
- `PUT /api/services/:id` - Atualizar serviço (admin)
- `DELETE /api/services/:id` - Deletar serviço (admin)

### Agendamentos

- `GET /api/appointments` - Listar agendamentos
- `GET /api/appointments/:id` - Buscar agendamento
- `POST /api/appointments` - Criar agendamento
- `PUT /api/appointments/:id` - Atualizar status (admin)
- `DELETE /api/appointments/:id` - Cancelar agendamento

## Estrutura do Banco

### Users

- `id`: String (CUID)
- `email`: String (único)
- `password`: String (hash)
- `name`: String
- `role`: Enum (CLIENT, ADMIN)
- `createdAt`, `updatedAt`: DateTime

### Professionals

- `id`: String (CUID)
- `name`: String
- `specialty`: String
- `createdAt`, `updatedAt`: DateTime

### Services

- `id`: String (CUID)
- `name`: String
- `price`: Float
- `duration`: Int (minutos)
- `createdAt`, `updatedAt`: DateTime

### Appointments

- `id`: String (CUID)
- `clientName`: String
- `date`: String (YYYY-MM-DD)
- `time`: String (HH:MM)
- `status`: Enum (PENDING, CONFIRMED, CANCELLED)
- `userId`: String (FK)
- `professionalId`: String (FK)
- `serviceId`: String (FK)
- `createdAt`, `updatedAt`: DateTime

## Próximos Passos

- Implementar middleware de autenticação JWT
- Adicionar validação de dados com Zod
- Criar testes automatizados
- Implementar paginação nas listagens
- Adicionar logs de auditoria
