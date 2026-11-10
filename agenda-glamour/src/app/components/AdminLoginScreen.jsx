import { useState } from "react";
import { adminAuthApi, authApi } from "../../services/api.js";

/**
 * Tela de login exclusiva para administradores.
 * Exibida quando alguém acessa /admin sem sessão válida.
 * Inclui abas para Login e Registro de novo admin.
 */
export default function AdminLoginScreen({ onLogin }) {
  const [tab, setTab] = useState("login");
  
  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Register fields
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState(null);
  const [regSuccess, setRegSuccess] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await adminAuthApi.login({ email, password });
      onLogin(data.user);
    } catch (err) {
      setError(err.message || "Credenciais inválidas. Verifique e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);
    setRegLoading(true);

    try {
      // Validações
      if (!regName || !regEmail || !regPassword || !regConfirmPassword) {
        throw new Error("Todos os campos são obrigatórios");
      }

      if (regPassword !== regConfirmPassword) {
        throw new Error("As senhas não coincidem");
      }

      if (regPassword.length < 6) {
        throw new Error("A senha deve ter no mínimo 6 caracteres");
      }

      // Registrar novo admin
      const data = await authApi.register({
        email: regEmail,
        password: regPassword,
        name: regName,
        role: "ADMIN"
      });

      setRegSuccess(`✅ Admin "${regName}" registrado com sucesso! Agora faça login.`);
      
      // Limpar formulário
      setRegEmail("");
      setRegPassword("");
      setRegConfirmPassword("");
      setRegName("");
      
      // Mudar para aba de login após 2 segundos
      setTimeout(() => {
        setTab("login");
        setEmail(regEmail);
      }, 2000);
    } catch (err) {
      setRegError(err.message || "Erro ao registrar. Tente novamente.");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrap}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#f59e0b" }}>
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 style={styles.title}>Painel Administrativo</h1>
          <p style={styles.subtitle}>Acesso restrito — faça login com sua conta admin</p>
        </div>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <button
            onClick={() => {
              setTab("login");
              setRegError(null);
              setRegSuccess(null);
            }}
            style={{
              ...styles.tab,
              ...(!tab || tab === "login" ? styles.tabActive : styles.tabInactive)
            }}
          >
            🔐 Login
          </button>
          <button
            onClick={() => {
              setTab("register");
              setError(null);
            }}
            style={{
              ...styles.tab,
              ...(tab === "register" ? styles.tabActive : styles.tabInactive)
            }}
          >
            ➕ Registrar Admin
          </button>
        </div>

        {/* Login Form */}
        {(!tab || tab === "login") && (
          <form onSubmit={handleLoginSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>E-mail</label>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@salaoeelegance.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                autoFocus
                autoComplete="username"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Senha</label>
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div style={styles.errorBox}>
                ⚠️ {error}
              </div>
            )}

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              style={{
                ...styles.btn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Entrando..." : "Entrar no Painel →"}
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === "register" && (
          <form onSubmit={handleRegisterSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Nome Completo</label>
              <input
                id="admin-name"
                type="text"
                placeholder="Ana Paula"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                style={styles.input}
                autoFocus
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>E-mail</label>
              <input
                id="admin-reg-email"
                type="email"
                placeholder="admin@salaoeelegance.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                style={styles.input}
                autoComplete="username"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Senha</label>
              <input
                id="admin-reg-password"
                type="password"
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                style={styles.input}
                autoComplete="new-password"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Confirmar Senha</label>
              <input
                id="admin-reg-confirm-password"
                type="password"
                placeholder="••••••••"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                required
                style={styles.input}
                autoComplete="new-password"
              />
            </div>

            {regError && (
              <div style={styles.errorBox}>
                ⚠️ {regError}
              </div>
            )}

            {regSuccess && (
              <div style={styles.successBox}>
                ✅ {regSuccess}
              </div>
            )}

            <button
              id="admin-register-btn"
              type="submit"
              disabled={regLoading}
              style={{
                ...styles.btn,
                opacity: regLoading ? 0.7 : 1,
                cursor: regLoading ? "not-allowed" : "pointer",
              }}
            >
              {regLoading ? "Registrando..." : "Criar Admin →"}
            </button>
          </form>
        )}

        <p style={styles.hint}>
          🔒 Esta área é exclusiva para administradores do salão.
        </p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f0a1e 0%, #1a0f35 50%, #0f172a 100%)",
    padding: "20px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.04)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(245, 158, 11, 0.2)",
    borderRadius: "24px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,158,11,0.05)",
  },
  header: {
    textAlign: "center",
    marginBottom: "36px",
  },
  iconWrap: {
    width: "64px",
    height: "64px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(251,191,36,0.1))",
    border: "1px solid rgba(245,158,11,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px auto",
  },
  title: {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 8px 0",
  },
  subtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "13px",
    margin: 0,
    lineHeight: "1.5",
  },
  tabsContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  tab: {
    flex: 1,
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "600",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    transition: "all 0.2s",
    borderBottom: "3px solid transparent",
  },
  tabActive: {
    color: "#f59e0b",
    borderBottomColor: "#f59e0b",
  },
  tabInactive: {
    color: "rgba(255,255,255,0.5)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  input: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    padding: "14px 16px",
    color: "#ffffff",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  errorBox: {
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.25)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#fca5a5",
    fontSize: "13px",
    lineHeight: "1.5",
  },
  successBox: {
    background: "rgba(34, 197, 94, 0.12)",
    border: "1px solid rgba(34, 197, 94, 0.25)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#86efac",
    fontSize: "13px",
    lineHeight: "1.5",
  },
  btn: {
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#000",
    border: "none",
    borderRadius: "12px",
    padding: "16px",
    fontSize: "15px",
    fontWeight: "700",
    letterSpacing: "0.02em",
    marginTop: "4px",
    transition: "transform 0.15s, box-shadow 0.15s",
    boxShadow: "0 8px 24px rgba(245,158,11,0.3)",
  },
  hint: {
    color: "rgba(255,255,255,0.25)",
    fontSize: "12px",
    textAlign: "center",
    marginTop: "20px",
    marginBottom: 0,
  },
};
