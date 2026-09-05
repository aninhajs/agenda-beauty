import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./lib/prisma.js";

// Importar rotas
import authRoutes from "./routes/auth.js";
import professionalRoutes from "./routes/professionals.js";
import serviceRoutes from "./routes/services.js";
import appointmentRoutes from "./routes/appointments.js";
import blockedDateRoutes from "./routes/blocked-dates.js";

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Log middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/professionals", professionalRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/blocked-dates", blockedDateRoutes);

// Rotas básicas
app.get("/", (req, res) => {
  res.json({ message: "Bem-vindo à API do Agenda Glamour!" });
});

// Rota para testar conexão com o banco
app.get("/health", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: "OK", message: "Conectado ao banco de dados" });
  } catch (error) {
    res
      .status(500)
      .json({ status: "ERROR", message: "Erro na conexão com o banco" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
