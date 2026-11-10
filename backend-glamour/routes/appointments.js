import express from "express";
import dotenv from "dotenv";
import prisma from "../lib/prisma.js";
import { requireAuth, requireAdmin } from "../lib/authMiddleware.js";

// Carregar variáveis de ambiente
dotenv.config();

const router = express.Router();

// GET /appointments - Listar TODOS os agendamentos (apenas admin)
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    // Por enquanto, retorna todos (implementar filtro por usuário depois)
    const appointments = await prisma.appointment.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        professional: true,
        service: true,
      },
      orderBy: { date: "asc" },
    });
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar agendamentos" });
  }
});

// GET /appointments/client/:clientId - Listar agendamentos do cliente logado (Regra 2)
router.get("/client/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const appointments = await prisma.appointment.findMany({
      where: {
        clientId: Number(clientId),
      },
      include: {
        professional: true,
        service: true,
      },
      orderBy: { date: "asc" },
    });
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar agendamentos do cliente" });
  }
});

// GET /appointments/:id - Buscar agendamento por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        professional: true,
        service: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar agendamento" });
  }
});

// POST /appointments - Criar novo agendamento
router.post("/", async (req, res) => {
  try {
    const { clientName, serviceId, professionalId, date, time, userId, clientId } =
      req.body;

    // Verificar se o horário está disponível
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        professionalId,
        date,
        time,
        status: { not: "CANCELLED" },
      },
    });

    if (existingAppointment) {
      return res.status(400).json({ error: "Este horário já está ocupado para este profissional." });
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientName,
        date,
        time,
        userId: userId || null,
        professionalId,
        serviceId,
        // Regra 2: associar ao cliente de WhatsApp, se fornecido
        ...(clientId ? { clientId: Number(clientId) } : {}),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        professional: true,
        service: true,
      },
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar agendamento" });
  }
});

// PUT /appointments/:id - Atualizar agendamento (apenas admin)
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        professional: true,
        service: true,
      },
    });

    res.json(appointment);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar agendamento" });
  }
});

// DELETE /appointments/:id - Cancelar agendamento (apenas admin ou dono)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.appointment.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    res.json({ message: "Agendamento cancelado com sucesso" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao cancelar agendamento" });
  }
});

export default router;
