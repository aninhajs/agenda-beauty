import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando a semeadura (seed) do banco de dados...");

  // Profissionais Padrão
  const professionals = [
    {
      id: "1",
      name: "Ana Paula",
      specialty: "Cabeleireira",
      email: "ana@salaoeelegance.com",
      phone: "(11) 98765-4321",
    },
    {
      id: "2",
      name: "Carla Santos",
      specialty: "Manicure",
      email: "carla@salaoeelegance.com",
      phone: "(11) 98765-4322",
    },
    {
      id: "3",
      name: "Fernanda Lima",
      specialty: "Esteticista",
      email: "fernanda@salaoeelegance.com",
      phone: "(11) 98765-4323",
    },
  ];

  console.log("Inserindo/Atualizando profissionais...");
  for (const prof of professionals) {
    await prisma.professional.upsert({
      where: { id: prof.id },
      update: prof,
      create: prof,
    });
  }

  // Serviços Padrão
  const services = [
    {
      id: "1",
      name: "Corte Feminino",
      price: 80,
      duration: 60,
      category: "Cabelo",
    },
    {
      id: "2",
      name: "Corte + Escova",
      price: 120,
      duration: 90,
      category: "Cabelo",
    },
    {
      id: "3",
      name: "Manicure",
      price: 45,
      duration: 45,
      category: "Unhas",
    },
    {
      id: "4",
      name: "Pedicure",
      price: 50,
      duration: 60,
      category: "Unhas",
    },
    {
      id: "5",
      name: "Limpeza de Pele",
      price: 150,
      duration: 90,
      category: "Estética",
    },
  ];

  console.log("Inserindo/Atualizando serviços...");
  for (const srv of services) {
    await prisma.service.upsert({
      where: { id: srv.id },
      update: srv,
      create: srv,
    });
  }

  console.log("✅ Semeadura do banco de dados concluída com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante a semeadura:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
