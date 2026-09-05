# Guia Completo de Deploy no Render

## 📋 Pré-requisitos
- Conta criada no [Render.com](https://render.com)
- Repositório GitHub com o projeto
- Conta no [Neon.tech](https://neon.tech) para banco de dados PostgreSQL (ou outro serviço de banco)

---

## 🚀 Passo a Passo

### **PARTE 1: Preparar o Repositório**

#### 1.1 Estruturar o projeto no GitHub
Seu projeto tem duas pastas separadas (frontend e backend). Opções:

**Opção A: Monorepo no mesmo repositório (RECOMENDADO)**
```
seu-repo/
├── agenda-glamour/ (frontend)
├── backend-glamour/ (backend)
└── README.md
```

**Opção B: Repositórios separados**
- Crie dois repositórios no GitHub
- Um para `agenda-glamour`
- Um para `backend-glamour`

**Vamos usar Opção A (monorepo):**

#### 1.2 Adicionar arquivo `.gitignore` na raiz (se não existir)
```
node_modules/
.env
.env.local
dist/
build/
.DS_Store
```

#### 1.3 Adicionar `.env.example` no backend
Arquivo: `backend-glamour/.env.example`
```
DATABASE_URL=postgresql://user:password@host/database
JWT_SECRET=sua_chave_secreta_aqui
NODE_ENV=production
PORT=3001
```

#### 1.4 Fazer commit e push para GitHub
```bash
git add .
git commit -m "Preparar projeto para deploy no Render"
git push origin main
```

---

### **PARTE 2: Configurar Banco de Dados (Neon)**

#### 2.1 Criar conta no Neon.tech
1. Acesse [neon.tech](https://neon.tech)
2. Clique em "Sign Up"
3. Crie sua conta

#### 2.2 Criar um projeto no Neon
1. No dashboard, clique em "Create New Project"
2. Escolha um nome (ex: `agenda-glamour`)
3. Clique em "Create"

#### 2.3 Copiar a string de conexão
1. No projeto criado, vá para "Connection string"
2. Copie a URL que começa com `postgresql://`
3. Salve essa URL (vamos usar no Render)

**Formato esperado:**
```
postgresql://user:password@host/database?sslmode=require
```

---

### **PARTE 3: Deploy do Backend no Render**

#### 3.1 Criar um novo Web Service no Render
1. Acesse [dashboard.render.com](https://dashboard.render.com)
2. Clique em "+ New" → "Web Service"
3. Conecte seu repositório GitHub
4. Selecione o repositório com seu projeto

#### 3.2 Configurar o Web Service

| Campo | Valor |
|-------|-------|
| **Name** | `agenda-glamour-api` |
| **Environment** | `Node` |
| **Region** | `São Paulo (sa-east-1)` (mais próximo do BR) |
| **Branch** | `main` |
| **Root Directory** | `backend-glamour` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

#### 3.3 Adicionar Variáveis de Ambiente
Na seção "Environment", adicione:

```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=sua_chave_secreta_bem_complexa_aqui
NODE_ENV=production
PORT=3001
```

⚠️ **IMPORTANTE:** Use a URL do Neon que você copiou no Passo 2.3

#### 3.4 Configurar Build e Deploy
- **Auto-deploy:** Marque "Auto-deploy" para fazer deploy automático a cada push
- Clique em "Create Web Service"
- Aguarde o deploy (leva 2-5 minutos)

#### 3.5 Copiar a URL do Backend
Após o deploy, você receberá uma URL como:
```
https://agenda-glamour-api.onrender.com
```

Salve essa URL para a próxima etapa.

---

### **PARTE 4: Deploy do Frontend no Render**

#### 4.1 Criar um novo Static Site no Render
1. No dashboard do Render, clique em "+ New" → "Static Site"
2. Conecte seu repositório GitHub
3. Selecione o mesmo repositório

#### 4.2 Configurar o Static Site

| Campo | Valor |
|-------|-------|
| **Name** | `agenda-glamour` |
| **Region** | `São Paulo (sa-east-1)` |
| **Branch** | `main` |
| **Root Directory** | `agenda-glamour` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

#### 4.3 Adicionar Variável de Ambiente
Na seção "Environment", adicione:
```
VITE_API_URL=https://agenda-glamour-api.onrender.com
```

⚠️ Use a URL do backend que você copiou no Passo 3.5

#### 4.4 Criar e fazer deploy
- Clique em "Create Static Site"
- Aguarde o deploy (leva 2-5 minutos)
- Você receberá uma URL como: `https://agenda-glamour.onrender.com`

---

### **PARTE 5: Configurar CORS no Backend (SE NECESSÁRIO)**

Se o frontend não conseguir comunicar com o backend, atualize o `backend-glamour/server.js`:

```javascript
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Configurar CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", // Vite dev
  process.env.FRONTEND_URL || "https://agenda-glamour.onrender.com"
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ... resto do código
```

Após essa mudança, faça commit e push. O Render fará auto-deploy automaticamente.

---

### **PARTE 6: Configurar Banco de Dados Prisma (Migrações)**

#### 6.1 Opção A: Rodar migrações automaticamente

Crie um arquivo `render.yaml` na raiz do backend:

Arquivo: `backend-glamour/render.yaml`
```yaml
services:
  - type: web
    name: agenda-glamour-api
    env: node
    plan: free
    buildCommand: npm install && npx prisma migrate deploy
    startCommand: node server.js
```

#### 6.2 Opção B: Rodar manualmente via SSH

Se precisar executar comandos no Render após o deploy:

1. Acesse o Web Service no dashboard
2. Vá para "Shell" no topo
3. Execute:
```bash
npx prisma migrate deploy
npx prisma db seed
```

---

### **PARTE 7: Verificar o Deploy**

#### 7.1 Testar o Backend
Abra no navegador:
```
https://agenda-glamour-api.onrender.com/
```

Você deve ver:
```json
{ "message": "Bem-vindo à API do Agenda Glamour!" }
```

#### 7.2 Testar o Frontend
Abra:
```
https://agenda-glamour.onrender.com
```

Verifique se a aplicação carrega corretamente.

#### 7.3 Verificar Logs
No dashboard do Render:
- Clique no seu serviço
- Vá para "Logs" para verificar erros

---

## 🔧 Troubleshooting

### Erro: "DATABASE_URL is not set"
✅ **Solução:** Adicione a variável `DATABASE_URL` no ambiente do Web Service

### Frontend não consegue conectar ao backend
✅ **Solução:** 
1. Verifique se `VITE_API_URL` está correto no frontend
2. Verifique se o CORS está configurado corretamente no backend
3. Verifique os logs do backend

### Migrações Prisma não foram executadas
✅ **Solução:** No Shell do Render, execute:
```bash
npx prisma migrate deploy
```

### Porta 3001 não funciona
✅ **Solução:** Render usa a variável `PORT` automaticamente. Certifique-se que o backend está usando:
```javascript
const PORT = process.env.PORT || 3001;
```

---

## 📚 Variáveis de Ambiente Resumo

### Backend (`backend-glamour`)
```
DATABASE_URL=postgresql://...@neon.com/...?sslmode=require
JWT_SECRET=sua_chave_secreta_muito_complexa
NODE_ENV=production
PORT=3001
```

### Frontend (`agenda-glamour`)
```
VITE_API_URL=https://agenda-glamour-api.onrender.com
```

---

## 🎯 URLs Finais
- **Frontend:** https://agenda-glamour.onrender.com
- **Backend API:** https://agenda-glamour-api.onrender.com
- **Banco de Dados:** Gerenciado pelo Neon

---

## 📝 Próximas Etapas

1. ✅ Testar todas as funcionalidades do app
2. ✅ Configurar domínio customizado (opcional)
3. ✅ Monitorar logs e performance
4. ✅ Configurar backups do banco de dados

Sucesso! 🚀
