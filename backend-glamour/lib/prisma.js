// import { neon } from "@neondatabase/serverless";
// import { PrismaClient } from "../generated/prisma/index.js";
// import { PrismaNeon } from "@prisma/adapter-neon";
// import dotenv from "dotenv";

// Carregar variáveis de ambiente
// dotenv.config();

// Verificar se DATABASE_URL está definido
// if (!process.env.DATABASE_URL) {
//   console.error("DATABASE_URL não encontrado no arquivo .env");
//   console.error("Caminho atual:", process.cwd());
//   console.error(
//     "Variáveis de ambiente carregadas:",
//     Object.keys(process.env).filter((k) => k.includes("DATABASE")),
//   );
//   process.exit(1);
// }

// console.log(
//   "DATABASE_URL encontrado:",
//   process.env.DATABASE_URL ? "Sim" : "Não",
// );

// Criar conexão Neon e adapter
// const neonConnection = neon(process.env.DATABASE_URL);
// const adapter = new PrismaNeon(neonConnection);

// Criar instância única do Prisma Client
// const prisma = new PrismaClient({ adapter });

// export default prisma;


import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Verificar se DATABASE_URL está definido
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL não encontrado no arquivo .env");
  process.exit(1);
}

console.log("DATABASE_URL encontrado: Sim");

// Criar instância única do Prisma Client padrão para PostgreSQL
const prisma = new PrismaClient();

export default prisma;
