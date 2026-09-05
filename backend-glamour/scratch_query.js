import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("Simulando criação de agendamento...");
  try {
    const appointment = await prisma.appointment.create({
      data: {
        clientName: "Cliente Teste",
        date: "2026-08-25",
        time: "14:00",
        userId: null,
        professionalId: "1", // ID fallback do frontend
        serviceId: "1",      // ID fallback do frontend
      },
    });
    console.log("Sucesso:", appointment);
  } catch (error) {
    console.error("Erro capturado durante simulação:");
    console.error(error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
