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

// GET /services - Listar todos os serviços
router.get("/", async (req, res) => {
  try {
    console.log("Attempting to fetch services...");
    const services = await prisma.service.findMany({
      orderBy: { name: "asc" },
    });
    console.log("Services found:", services.length);
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Erro ao buscar serviços" });
  }
});

// GET /services/:id - Buscar serviço por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar serviço" });
  }
});

// POST /services - Criar novo serviço (apenas admin)
router.post("/", requireAdmin, async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { name, price, duration, category } = req.body;

    console.log("Parsed values:", {
      name,
      price: parseFloat(price),
      duration: parseInt(duration),
      category,
    });

    const service = await prisma.service.create({
      data: { 
        name, 
        price: parseFloat(price), 
        duration: parseInt(duration),
        category: category || "Outro"
      },
    });

    console.log("Created service:", service);
    res.status(201).json(service);
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ error: "Erro ao criar serviço" });
  }
});

// PUT /services/:id - Atualizar serviço (apenas admin)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, duration, category } = req.body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        price: parseFloat(price),
        duration: parseInt(duration),
        category: category || undefined,
      },
    });

    res.json(service);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar serviço" });
  }
});

// DELETE /services/:id - Deletar serviço (apenas admin)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.service.delete({
      where: { id },
    });

    res.json({ message: "Serviço deletado com sucesso" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar serviço" });
  }
});

export default router;
