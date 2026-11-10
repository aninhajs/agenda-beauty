import bcrypt from "bcryptjs";
import prisma from "./lib/prisma.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function createAdmin() {
  console.log("\n🛠️  Criador de Usuário Administrador - Agenda Glamour\n");
  console.log("=".repeat(50));

  try {
    // Coletar dados
    const email = await question("📧 E-mail do admin: ");
    const name = await question("👤 Nome do admin: ");
    const password = await question("🔐 Senha do admin: ");
    const confirmPassword = await question("🔐 Confirme a senha: ");

    // Validações
    if (!email || !name || !password) {
      console.log("\n❌ Todos os campos são obrigatórios!");
      rl.close();
      process.exit(1);
    }

    if (password !== confirmPassword) {
      console.log("\n❌ As senhas não coincidem!");
      rl.close();
      process.exit(1);
    }

    if (password.length < 6) {
      console.log("\n❌ A senha deve ter no mínimo 6 caracteres!");
      rl.close();
      process.exit(1);
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`\n❌ Usuário com email "${email}" já existe!`);
      rl.close();
      process.exit(1);
    }

    // Hash da senha
    console.log("\n⏳ Processando...");
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

    console.log("\n" + "=".repeat(50));
    console.log("✅ ADMIN CRIADO COM SUCESSO!\n");
    console.log("📋 Detalhes:");
    console.log(`   ID: ${admin.id}`);
    console.log(`   Nome: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Criado em: ${admin.createdAt.toLocaleString("pt-BR")}`);
    console.log("\n" + "=".repeat(50));
    console.log("\n🎯 Você pode fazer login em: http://localhost:5173#admin");
    console.log(`   Email: ${email}`);
    console.log(`   Senha: (a que você digitou)\n`);

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Erro ao criar admin:");
    console.error(error.message);
    rl.close();
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
