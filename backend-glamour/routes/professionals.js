import express from "express";
import dotenv from "dotenv";
import prisma from "../lib/prisma.js";

// Carregar variáveis de ambiente
dotenv.config();

const router = express.Router();

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
  // Por enquanto, vamos permitir tudo (implementar depois com JWT)
  next();
};

// GET /professionals - Listar todos os profissionais
router.get("/", async (req, res) => {
  try {
    const professionals = await prisma.professional.findMany({
      orderBy: { name: "asc" },
    });
    res.json(professionals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar profissionais" });
  }
});

// GET /professionals/:id - Buscar profissional por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const professional = await prisma.professional.findUnique({
      where: { id },
    });

    if (!professional) {
      return res.status(404).json({ error: "Profissional não encontrado" });
    }

    res.json(professional);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar profissional" });
  }
});

// POST /professionals - Criar novo profissional (apenas admin)
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { name, specialty, email, phone } = req.body;

    const professional = await prisma.professional.create({
      data: { 
        name, 
        specialty, 
        email: email || null, 
        phone: phone || null 
      },
    });

    res.status(201).json(professional);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar profissional" });
  }
});

// PUT /professionals/:id - Atualizar profissional (apenas admin)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialty, email, phone } = req.body;

    const professional = await prisma.professional.update({
      where: { id },
      data: { 
        name, 
        specialty, 
        email: email || null, 
        phone: phone || null 
      },
    });

    res.json(professional);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Profissional não encontrado" });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar profissional" });
  }
});

// DELETE /professionals/:id - Deletar profissional (apenas admin)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.professional.delete({
      where: { id },
    });

    res.json({ message: "Profissional deletado com sucesso" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Profissional não encontrado" });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar profissional" });
  }
});

export default router;
