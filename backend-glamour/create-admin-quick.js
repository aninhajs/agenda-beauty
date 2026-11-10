import bcrypt from "bcryptjs";
import prisma from "./lib/prisma.js";

// Argumentos de linha de comando
const args = process.argv.slice(2);

async function createAdminQuick() {
  console.log("\n🛠️  Criador Rápido de Admin - Agenda Glamour\n");

  if (args.length < 2) {
    console.log("❌ Uso: node create-admin-quick.js <email> <senha> [nome]\n");
    console.log("Exemplos:");
    console.log('  node create-admin-quick.js admin@salao.com "senha123"');
    console.log('  node create-admin-quick.js admin@salao.com "senha123" "Administrador"\n');
    process.exit(1);
  }

  const email = args[0];
  const password = args[1];
  const name = args[2] || "Administrador";

  try {
    console.log("⏳ Processando...");

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`❌ Usuário com email "${email}" já existe!\n`);
      process.exit(1);
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar admin
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("\n✅ ADMIN CRIADO COM SUCESSO!\n");
    console.log("📋 Detalhes:");
    console.log(`   ID: ${admin.id}`);
    console.log(`   Nome: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}\n`);

    console.log("🎯 Acesso ao Painel:");
    console.log(`   URL: http://localhost:5173#admin`);
    console.log(`   Email: ${email}`);
    console.log(`   Senha: ${password}\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao criar admin:");
    console.error(error.message);
    console.error("");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminQuick();
