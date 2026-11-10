import express from "express";
import prisma from "../lib/prisma.js";
import { requireAuth, requireAdmin } from "../lib/authMiddleware.js";

const router = express.Router();

// GET /api/blocked-dates — Listar todos os dias bloqueados
router.get("/", async (req, res) => {
  try {
    const blockedDates = await prisma.blockedDate.findMany({
      orderBy: { date: "asc" },
    });
    res.json(blockedDates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar dias bloqueados" });
  }
});

// POST /api/blocked-dates — Bloquear um dia (apenas admin)
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { date, reason } = req.body;

    if (!date) {
      return res.status(400).json({ error: "Data é obrigatória" });
    }

    // Verifica se o dia já está bloqueado
    const existing = await prisma.blockedDate.findUnique({
      where: { date },
    });

    if (existing) {
      return res.status(400).json({ error: "Este dia já está bloqueado" });
    }

    const blockedDate = await prisma.blockedDate.create({
      data: { date, reason },
    });

    res.status(201).json(blockedDate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao bloquear dia" });
  }
});

// DELETE /api/blocked-dates/:id — Remover bloqueio (apenas admin)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.blockedDate.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Bloqueio removido com sucesso" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Bloqueio não encontrado" });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao remover bloqueio" });
  }
});

export default router;
