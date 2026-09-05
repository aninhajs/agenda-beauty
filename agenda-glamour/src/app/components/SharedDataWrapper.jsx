import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import App from "../../App.jsx";
import AdminDashboard from "./AdminDashboard";
import {
  servicesApi,
  professionalsApi,
  appointmentsApi,
  clientAuthApi,
} from "../../services/api.js";

// ─── Tela de Login do Cliente (Regra 1) ────────────────────────────────────
function ClientLoginScreen({ onLogin }) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatWhatsapp = (value) => {
    // Remove tudo que não for dígito
    const digits = value.replace(/\D/g, "");
    // Formata como (XX) XXXXX-XXXX
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleWhatsappChange = (e) => {
    setWhatsapp(formatWhatsapp(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Extrair apenas dígitos do WhatsApp
    const whatsappDigits = whatsapp.replace(/\D/g, "");

    if (!name.trim()) {
      setError("Por favor, informe seu nome.");
      return;
    }
    if (whatsappDigits.length < 10) {
      setError("Por favor, informe um WhatsApp válido.");
      return;
    }

    setLoading(true);
    try {
      const data = await clientAuthApi.login({
        name: name.trim(),
        whatsapp: whatsappDigits,
      });
      onLogin(data.client);
    } catch (err) {
      setError("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.loginOverlay}>
      <div style={styles.loginCard}>
        {/* Logo/Header */}
        <div style={styles.loginHeader}>
          <div style={styles.loginLogo}>💎</div>
          <h1 style={styles.loginTitle}>Brenda Beauty</h1>
          <p style={styles.loginSubtitle}>
            Entre com seu nome e WhatsApp para agendar
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={styles.loginForm}>
          <div style={styles.loginField}>
            <label style={styles.loginLabel}>Seu Nome</label>
            <input
              type="text"
              placeholder="Digite seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.loginInput}
              autoFocus
            />
          </div>

          <div style={styles.loginField}>
            <label style={styles.loginLabel}>WhatsApp</label>
            <input
              type="tel"
              placeholder="(11) 99999-9999"
              value={whatsapp}
              onChange={handleWhatsappChange}
              style={styles.loginInput}
              maxLength={15}
            />
          </div>

          {error && <div style={styles.loginError}>⚠️ {error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.loginBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Entrando..." : "Entrar →"}
          </button>
        </form>

        <p style={styles.loginHint}>
          Se for seu primeiro acesso, criaremos sua conta automaticamente.
        </p>
      </div>
    </div>
  );
}

// ─── Estilos inline para o Login ───────────────────────────────────────────
const styles = {
  loginOverlay: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #1a0a2e 0%, #2d1b55 50%, #1a0a2e 100%)",
    padding: "20px",
  },
  loginCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "24px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
  },
  loginHeader: {
    textAlign: "center",
    marginBottom: "36px",
  },
  loginLogo: {
    fontSize: "48px",
    marginBottom: "12px",
    filter: "drop-shadow(0 0 20px rgba(236, 72, 153, 0.6))",
  },
  loginTitle: {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "700",
    margin: "0 0 8px 0",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  loginSubtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "14px",
    margin: 0,
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  loginField: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  loginLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  loginInput: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "12px",
    padding: "14px 16px",
    color: "#ffffff",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  loginError: {
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#fca5a5",
    fontSize: "13px",
  },
  loginBtn: {
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "16px",
    fontSize: "16px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    marginTop: "4px",
    transition: "transform 0.15s, box-shadow 0.15s",
    boxShadow: "0 8px 24px rgba(236, 72, 153, 0.35)",
  },
  loginHint: {
    color: "rgba(255,255,255,0.35)",
    fontSize: "12px",
    textAlign: "center",
    marginTop: "20px",
    marginBottom: 0,
  },
};

// ─── SharedDataWrapper Principal ───────────────────────────────────────────
export function SharedDataWrapper() {
  const [appointments, setAppointments] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Regra 1: Estado do cliente logado (persistido no localStorage)
  const [loggedClient, setLoggedClient] = useState(() => {
    try {
      const stored = localStorage.getItem("glamour_client");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Regra 1: Salvar/limpar cliente no localStorage
  const handleLogin = (client) => {
    localStorage.setItem("glamour_client", JSON.stringify(client));
    setLoggedClient(client);
  };

  const handleLogout = () => {
    localStorage.removeItem("glamour_client");
    setLoggedClient(null);
  };

  // Carregar dados do backend na inicialização
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log("Tentando carregar dados do servidor...");

        // Tentativa de carregar do backend com timeout
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 3000),
        );

        const [appointmentsData, professionalsData, servicesData] =
          await Promise.race([
            Promise.all([
              appointmentsApi.getAll(),
              professionalsApi.getAll(),
              servicesApi.getAll(),
            ]),
            timeout,
          ]);

        setAppointments(appointmentsData);
        setProfessionals(professionalsData);
        setServices(servicesData);
        setError(null);
        console.log("✅ Dados carregados do servidor com sucesso");
      } catch (err) {
        console.error("⚠️ Erro ao carregar dados:", err.message);
        console.log("📱 Usando dados offline como fallback");
        setError(null); // Não mostrar erro, apenas usar dados offline

        // Dados de fallback em caso de erro
        setAppointments([
          {
            id: "1",
            clientName: "Maria Silva",
            service: "Corte + Escova",
            professional: "Ana Paula",
            date: "2025-01-02",
            time: "14:00",
            price: 120,
            status: "confirmed",
          },
        ]);
        setProfessionals([
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
        ]);
        setServices([
          {
            id: "1",
            name: "Corte Feminino",
            price: 80,
            duration: 60,
          },
          {
            id: "2",
            name: "Corte + Escova",
            price: 120,
            duration: 90,
          },
          {
            id: "3",
            name: "Manicure",
            price: 45,
            duration: 45,
          },
          {
            id: "4",
            name: "Pedicure",
            price: 50,
            duration: 60,
          },
          {
            id: "5",
            name: "Limpeza de Pele",
            price: 150,
            duration: 90,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // CRUD para Agendamentos
  const handleBooking = async (appointment) => {
    try {
      // Mapear nomes para IDs
      const selectedService = services.find(
        (s) => s.name === appointment.service,
      );
      const selectedProfessional = professionals.find(
        (p) => p.name === appointment.professional,
      );

      if (!selectedService) {
        throw new Error(`Serviço "${appointment.service}" não encontrado`);
      }

      if (!selectedProfessional) {
        throw new Error(
          `Profissional "${appointment.professional}" não encontrado`,
        );
      }

      // Temporariamente criar agendamento apenas localmente
      const localAppointment = {
        id: Date.now().toString(),
        clientName: appointment.clientName,
        service: appointment.service,
        professional: appointment.professional,
        date: appointment.date,
        time: appointment.time,
        price: appointment.price,
        status: "pending",
      };

      // Adicionar ao estado local imediatamente
      setAppointments([...appointments, localAppointment]);
      console.log("✅ Agendamento criado localmente:", localAppointment);

      // Tentar sincronizar com backend (opcional)
      try {
        const appointmentData = {
          clientName: appointment.clientName,
          serviceId: selectedService.id,
          professionalId: selectedProfessional.id,
          date: appointment.date,
          time: appointment.time,
          status: "pending",
          // Regra 2: associar ao cliente logado
          ...(loggedClient ? { clientId: loggedClient.id } : {}),
        };

        await appointmentsApi.create(appointmentData);
        console.log("✅ Agendamento sincronizado com servidor");
      } catch (syncError) {
        console.log("📱 Agendamento mantido apenas localmente (modo offline)");
      }
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      alert(`Erro ao criar agendamento: ${error.message}`);
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await appointmentsApi.delete(id);
      setAppointments(appointments.filter((apt) => apt.id !== id));
    } catch (error) {
      console.error("Erro ao deletar agendamento:", error);
      // Fallback local
      setAppointments(appointments.filter((apt) => apt.id !== id));
    }
  };

  const handleUpdateAppointment = async (id, updates) => {
    try {
      const updatedAppointment = await appointmentsApi.update(id, updates);
      setAppointments(
        appointments.map((apt) => (apt.id === id ? updatedAppointment : apt)),
      );
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      // Fallback local
      setAppointments(
        appointments.map((apt) =>
          apt.id === id ? { ...apt, ...updates } : apt,
        ),
      );
    }
  };

  // CRUD para Profissionais
  const handleAddProfessional = async (professional) => {
    try {
      const newProfessional = await professionalsApi.create(professional);
      setProfessionals([...professionals, newProfessional]);
    } catch (error) {
      console.error("Erro ao criar profissional:", error);
      setProfessionals([
        ...professionals,
        { ...professional, id: Date.now().toString() },
      ]);
    }
  };

  const handleUpdateProfessional = async (id, updates) => {
    try {
      const updatedProfessional = await professionalsApi.update(id, updates);
      setProfessionals(
        professionals.map((prof) =>
          prof.id === id ? updatedProfessional : prof,
        ),
      );
    } catch (error) {
      console.error("Erro ao atualizar profissional:", error);
      setProfessionals(
        professionals.map((prof) =>
          prof.id === id ? { ...prof, ...updates } : prof,
        ),
      );
    }
  };

  const handleDeleteProfessional = async (id) => {
    try {
      await professionalsApi.delete(id);
      setProfessionals(professionals.filter((prof) => prof.id !== id));
    } catch (error) {
      console.error("Erro ao deletar profissional:", error);
      setProfessionals(professionals.filter((prof) => prof.id !== id));
    }
  };

  // CRUD para Serviços
  const handleAddService = async (service) => {
    try {
      const newService = await servicesApi.create(service);
      setServices([...services, newService]);
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      setServices([...services, { ...service, id: Date.now().toString() }]);
    }
  };

  const handleUpdateService = async (id, updates) => {
    try {
      const updatedService = await servicesApi.update(id, updates);
      setServices(
        services.map((srv) => (srv.id === id ? updatedService : srv)),
      );
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      setServices(
        services.map((srv) => (srv.id === id ? { ...srv, ...updates } : srv)),
      );
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await servicesApi.delete(id);
      setServices(services.filter((srv) => srv.id !== id));
    } catch (error) {
      console.error("Erro ao deletar serviço:", error);
      setServices(services.filter((srv) => srv.id !== id));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Carregando dados do servidor...
      </div>
    );
  }

  // Regra 1: Exibir tela de login se o cliente não estiver autenticado
  // (apenas na rota "/", não no painel admin)
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  if (!loggedClient && !isAdminRoute) {
    return <ClientLoginScreen onLogin={handleLogin} />;
  }

  return (
    <>
      {error && (
        <div
          style={{
            backgroundColor: "#ffeb3b",
            color: "#333",
            padding: "10px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          ⚠️ {error}
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <App
              appointments={appointments}
              professionals={professionals}
              services={services}
              onBooking={handleBooking}
              onDeleteAppointment={handleDeleteAppointment}
              loggedClient={loggedClient}
              onLogout={handleLogout}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <AdminDashboard
              appointments={appointments}
              professionals={professionals}
              services={services}
              onUpdateAppointment={handleUpdateAppointment}
              onDeleteAppointment={handleDeleteAppointment}
              onAddProfessional={handleAddProfessional}
              onUpdateProfessional={handleUpdateProfessional}
              onDeleteProfessional={handleDeleteProfessional}
              onAddService={handleAddService}
              onUpdateService={handleUpdateService}
              onDeleteService={handleDeleteService}
            />
          }
        />
      </Routes>
    </>
  );
}
