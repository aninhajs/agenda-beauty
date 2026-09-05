import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../lib/prisma.js";

// Carregar variáveis de ambiente
dotenv.config();

const router = express.Router();

// Rota de registro
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, role = "CLIENT" } = req.body;

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "secret-key",
      { expiresIn: "7d" },
    );

    res.status(201).json({
      message: "Usuário criado com sucesso",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota de login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "secret-key",
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota de login/cadastro de cliente via Nome e WhatsApp (Regra 1)
router.post("/client-login", async (req, res) => {
  try {
    const { name, whatsapp } = req.body;

    if (!whatsapp) {
      return res.status(400).json({ error: "WhatsApp é obrigatório" });
    }

    // Verificar se o cliente já existe pelo WhatsApp
    let client = await prisma.client.findUnique({
      where: { whatsapp },
    });

    // Se não existir, criar novo registro
    if (!client) {
      if (!name) {
        return res.status(400).json({ error: "Nome é obrigatório para novo cadastro" });
      }
      client = await prisma.client.create({
        data: { name, whatsapp },
      });
    }

    res.json({
      message: client ? "Login realizado com sucesso" : "Cadastro realizado com sucesso",
      client,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
