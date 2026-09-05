import { useState, useEffect } from "react";
import { appointmentsApi } from "../../services/api.js";
import "./AppointmentsList.css";

export default function AppointmentsList({ appointments: propAppointments, onDelete, loggedClient }) {
  // Regra 2: Estado local dos agendamentos do cliente logado
  const [clientAppointments, setClientAppointments] = useState([]);
  const [loadingClient, setLoadingClient] = useState(false);

  // Regra 4: Estado do modal de bloqueio de cancelamento
  const [cancelBlockedModal, setCancelBlockedModal] = useState(false);

  // Regra 2: Carregar agendamentos filtrados pelo clientId ao montar/trocar cliente
  useEffect(() => {
    if (!loggedClient?.id) {
      // Sem cliente logado: usa a lista passada por prop (compatibilidade)
      setClientAppointments(propAppointments);
      return;
    }

    const fetchClientAppointments = async () => {
      setLoadingClient(true);
      try {
        const data = await appointmentsApi.getByClient(loggedClient.id);
        setClientAppointments(data);
      } catch (err) {
        console.error("Erro ao buscar agendamentos do cliente:", err);
        // Fallback: usa prop caso API falhe
        setClientAppointments(propAppointments);
      } finally {
        setLoadingClient(false);
      }
    };

    fetchClientAppointments();
  }, [loggedClient?.id]);

  // Regra 4: Validação de cancelamento com prazo de 2 horas
  const handleDelete = (appointment) => {
    // Calcular diferença em horas entre agora e o horário do agendamento
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time || appointment.time}`);
    const now = new Date();
    const diffInMs = appointmentDateTime.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 2) {
      // Regra 4: Bloquear cancelamento e exibir modal informativo
      setCancelBlockedModal(true);
      return;
    }

    if (
      window.confirm(
        `Deseja cancelar o agendamento de ${appointment.clientName}?`
      )
    ) {
      onDelete(appointment.id);
      // Atualiza lista local após cancelamento
      setClientAppointments((prev) => prev.filter((a) => a.id !== appointment.id));
    }
  };

  const appointments = loggedClient?.id ? clientAppointments : propAppointments;

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString + "T00:00:00");
    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    return `${date.getDate()} de ${months[date.getMonth()]}`;
  };

  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString + "T00:00:00");
    return date.toDateString() === today.toDateString();
  };

  // Helper para extrair nome do serviço (objeto ou string)
  const getServiceName = (appointment) => {
    if (appointment.service?.name) return appointment.service.name;
    return appointment.service || "—";
  };

  // Helper para extrair nome do profissional (objeto ou string)
  const getProfessionalName = (appointment) => {
    if (appointment.professional?.name) return appointment.professional.name;
    return appointment.professional || "—";
  };

  // Helper para extrair preço (objeto de serviço ou campo direto)
  const getPrice = (appointment) => {
    if (appointment.service?.price != null) return appointment.service.price;
    if (appointment.price != null) return appointment.price;
    return 0;
  };

  return (
    <div className="appointments-container">
      {/* Modal de bloqueio de cancelamento — Regra 4 */}
      {cancelBlockedModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setCancelBlockedModal(false)}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1e0a3c, #2d1b55)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "20px",
              padding: "36px 32px",
              maxWidth: "420px",
              width: "100%",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏰</div>
            <h3
              style={{
                color: "#fff",
                fontSize: "20px",
                fontWeight: "700",
                marginBottom: "12px",
              }}
            >
              Prazo de Cancelamento Expirado
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "14px",
                lineHeight: "1.6",
                marginBottom: "24px",
              }}
            >
              O prazo limite para cancelamento online é de até <strong style={{ color: "#ec4899" }}>2 horas antes</strong>. Por favor, entre em contato com o salão diretamente pelo WhatsApp para desmarcar.
            </p>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#25D366",
                color: "#fff",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "700",
                textDecoration: "none",
                marginBottom: "12px",
              }}
            >
              📲 Falar no WhatsApp
            </a>
            <br />
            <button
              onClick={() => setCancelBlockedModal(false)}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "10px",
                color: "rgba(255,255,255,0.6)",
                padding: "10px 20px",
                cursor: "pointer",
                fontSize: "13px",
                marginTop: "8px",
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Agendamentos */}
      <div className="appointments-card">
        <div className="card-header">
          <h2>Lista de Agendamentos</h2>
          <p className="card-description">
            {loggedClient
              ? `Seus agendamentos, ${loggedClient.name.split(" ")[0]}`
              : "Visualize e gerencie seus agendamentos"}
          </p>
        </div>

        {loadingClient ? (
          <div className="empty-state">
            <span className="empty-icon">⏳</span>
            <p>Carregando seus agendamentos...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📅</span>
            <p>Nenhum agendamento encontrado</p>
            <p className="empty-description">
              Crie seu primeiro agendamento na aba "Novo Agendamento"
            </p>
          </div>
        ) : (
          <div className="appointments-list">
            {sortedAppointments.map((appointment) => (
              <div key={appointment.id} className="appointment-item">
                <div className="appointment-content">
                  <div className="appointment-header">
                    <h3>{appointment.clientName}</h3>
                    {isToday(appointment.date) && (
                      <span className="badge today">Hoje</span>
                    )}
                  </div>

                  <div className="appointment-details">
                    <div className="detail">
                      <span
                        className="detail-icon"
                        style={{ color: "#ec4899" }}
                      >
                        ✂️
                      </span>
                      <span>{getServiceName(appointment)}</span>
                    </div>

                    <div className="detail">
                      <span
                        className="detail-icon"
                        style={{ color: "#8b5cf6" }}
                      >
                        👤
                      </span>
                      <span>{getProfessionalName(appointment)}</span>
                    </div>

                    <div className="detail">
                      <span
                        className="detail-icon"
                        style={{ color: "#6366f1" }}
                      >
                        📅
                      </span>
                      <span>{formatDate(appointment.date)}</span>
                    </div>

                    <div className="detail">
                      <span
                        className="detail-icon"
                        style={{ color: "#3b82f6" }}
                      >
                        🕐
                      </span>
                      <span>{appointment.time}</span>
                    </div>
                  </div>

                  <div className="appointment-price">
                    R$ {getPrice(appointment).toFixed(2)}
                  </div>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(appointment)}
                  title="Cancelar agendamento"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
