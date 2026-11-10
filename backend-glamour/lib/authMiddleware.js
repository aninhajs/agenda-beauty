import jwt from "jsonwebtoken";

/**
 * Middleware que verifica se a requisição contém um JWT válido.
 * Adiciona `req.user = { userId, role }` para uso nas rotas.
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Acesso não autorizado. Token ausente." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret-key");
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

/**
 * Middleware que verifica se o usuário autenticado tem role ADMIN.
 * Deve ser usado APÓS requireAuth.
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Acesso negado. Apenas administradores." });
  }
  next();
}
