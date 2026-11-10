import fetch from "node-fetch";

const API_URL = "http://127.0.0.1:3001/api";

async function testAdminLogin() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log("\n🧪 Teste de Login do Admin\n");
    console.log("Uso: node test-admin-login.js <email> <senha>\n");
    console.log("Exemplo: node test-admin-login.js admin@salaoeelegance.com senha123\n");
    process.exit(1);
  }

  const email = args[0];
  const password = args[1];

  console.log("\n🧪 Testando login do admin...\n");
  console.log(`📧 Email: ${email}`);
  console.log(`🔐 Senha: ${"*".repeat(password.length)}`);
  console.log("\n⏳ Enviando requisição para: ${API_URL}/auth/login\n`);

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("❌ Login falhou!\n");
      console.log("Status:", response.status);
      console.log("Erro:", data.error);
      console.log("");
      process.exit(1);
    }

    console.log("✅ LOGIN REALIZADO COM SUCESSO!\n");
    console.log("📋 Resposta da API:");
    console.log(`   Mensagem: ${data.message}`);
    console.log(`   Usuário ID: ${data.user.id}`);
    console.log(`   Email: ${data.user.email}`);
    console.log(`   Nome: ${data.user.name}`);
    console.log(`   Role: ${data.user.role}`);
    console.log(`\n🔑 Token JWT (primeiros 50 chars):\n   ${data.token.substring(0, 50)}...\n`);
    console.log("🎯 Acesso ao painel: http://localhost:5173#admin\n");

    process.exit(0);
  } catch (error) {
    console.log("❌ Erro ao conectar à API:\n");
    console.log(error.message);
    console.log("\n💡 Dicas:");
    console.log("   - Certifique-se de que o backend está rodando: npm run dev");
    console.log("   - Verifique se o banco de dados está conectado");
    console.log("   - Confirme se o email e senha estão corretos\n");
    process.exit(1);
  }
}

testAdminLogin();
