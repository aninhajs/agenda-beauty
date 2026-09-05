import { useState, useEffect } from "react";
import DashboardOverview from "./DashboardOverview";
import AdminAppointments from "./AdminAppointments";
import ProfessionalsManagement from "./ProfessionalsManagement";
import ServicesManagement from "./ServicesManagement";
import Icon from "./ui/LucideIcons";
import { blockedDatesApi } from "../../services/api.js";
import "./AdminDashboard.css";

// ─── Componente de Gerenciamento de Dias Bloqueados (Regra 5) ─────────────
function BlockedDatesManager() {
  const [blockedDates, setBlockedDates] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    blockedDatesApi
      .getAll()
      .then(setBlockedDates)
      .catch(() => setError("Não foi possível carregar os dias bloqueados."))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newDate) return;
    setSaving(true);
    setError(null);
    try {
      const created = await blockedDatesApi.create({
        date: newDate,
        reason: newReason || null,
      });
      setBlockedDates((prev) =>
        [...prev, created].sort((a, b) => a.date.localeCompare(b.date)),
      );
      setNewDate("");
      setNewReason("");
    } catch {
      setError("Erro ao bloquear o dia. Verifique se já está bloqueado.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Remover este bloqueio?")) return;
    try {
      await blockedDatesApi.delete(id);
      setBlockedDates((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setError("Erro ao remover o bloqueio.");
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Form para adicionar novo dia bloqueado */}
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(67, 56, 202, 0.25) 0%, rgba(59, 130, 246, 0.2) 100%)",
          border: "1px solid rgba(67, 56, 202, 0.3)",
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "28px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <Icon name="calendar" size={24} style={{ color: "#3b82f6" }} />
          <h3
            style={{
              color: "#fff",
              margin: 0,
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            Bloquear Novo Dia
          </h3>
        </div>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "14px",
            marginBottom: "24px",
            marginLeft: "36px",
            lineHeight: "1.5",
          }}
        >
          Marque datas indisponíveis para agendamentos de clientes. Dias
          bloqueados não aparecerão no calendário.
        </p>
        <form
          onSubmit={handleAdd}
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Data *
            </label>
            <input
              type="date"
              value={newDate}
              min={today}
              onChange={(e) => setNewDate(e.target.value)}
              required
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px",
                padding: "12px 16px",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "500",
                outline: "none",
                transition: "all 0.2s ease",
                minWidth: "200px",
              }}
              onFocus={(e) => {
                e.target.style.background = "rgba(255,255,255,0.12)";
                e.target.style.border = "1px solid rgba(59, 130, 246, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.background = "rgba(255,255,255,0.08)";
                e.target.style.border = "1px solid rgba(255,255,255,0.15)";
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              flex: 1,
              minWidth: "220px",
            }}
          >
            <label
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Motivo (opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Feriado, Manutenção, Reunião importante..."
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px",
                padding: "12px 16px",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "500",
                outline: "none",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.background = "rgba(255,255,255,0.12)";
                e.target.style.border = "1px solid rgba(59, 130, 246, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.background = "rgba(255,255,255,0.08)";
                e.target.style.border = "1px solid rgba(255,255,255,0.15)";
              }}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            style={{
              background: saving
                ? "rgba(59, 130, 246, 0.5)"
                : "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "12px 28px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
              whiteSpace: "nowrap",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
            }}
          >
            {saving ? "Bloqueando..." : "Bloquear Data"}
          </button>
        </form>
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              marginTop: "16px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "12px",
              padding: "12px 16px",
            }}
          >
            <Icon
              name="alert"
              size={20}
              style={{ color: "#f87171", marginTop: "2px", flexShrink: 0 }}
            />
            <p
              style={{
                color: "#fca5a5",
                fontSize: "14px",
                margin: 0,
                fontWeight: "500",
              }}
            >
              {error}
            </p>
          </div>
        )}
      </div>

      {/* Lista de dias bloqueados */}
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(20, 20, 30, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <Icon name="calendar" size={24} style={{ color: "#3b82f6" }} />
          <div>
            <h3
              style={{
                color: "#fff",
                margin: 0,
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              Datas Bloqueadas
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "12px",
                margin: "4px 0 0 0",
              }}
            >
              {blockedDates.length > 0
                ? `${blockedDates.length} ${blockedDates.length === 1 ? "dia" : "dias"} bloqueado(s)`
                : "Nenhuma data bloqueada"}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
              Carregando datas bloqueadas...
            </div>
          </div>
        ) : blockedDates.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              Nenhuma data bloqueada no momento.
              <br />
              <span style={{ fontSize: "12px", opacity: 0.8 }}>
                Adicione uma data acima para bloquear no calendário
              </span>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {blockedDates.map((bd) => (
              <div
                key={bd.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background:
                    "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(244, 63, 94, 0.05) 100%)",
                  border: "1px solid rgba(239, 68, 68, 0.15)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  transition: "all 0.2s ease",
                  hover: {
                    borderColor: "rgba(239, 68, 68, 0.3)",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.1)",
                  },
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(239, 68, 68, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.15)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flex: 1,
                  }}
                >
                  <Icon
                    name="calendar"
                    size={20}
                    style={{ color: "#f87171", flexShrink: 0 }}
                  />
                  <div>
                    <div
                      style={{
                        color: "#fca5a5",
                        fontWeight: "700",
                        fontSize: "15px",
                        textTransform: "capitalize",
                      }}
                    >
                      {formatDate(bd.date)}
                    </div>
                    {bd.reason && (
                      <div
                        style={{
                          color: "rgba(255,255,255,0.5)",
                          fontSize: "13px",
                          marginTop: "4px",
                          fontWeight: "500",
                        }}
                      >
                        {bd.reason}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(bd.id)}
                  style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "10px",
                    color: "#fca5a5",
                    padding: "8px 14px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(239, 68, 68, 0.25)";
                    e.currentTarget.style.borderColor =
                      "rgba(239, 68, 68, 0.4)";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(239, 68, 68, 0.15)";
                    e.currentTarget.style.borderColor =
                      "rgba(239, 68, 68, 0.3)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <Icon name="trash" size={14} />
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Agora recebe dados via props do SharedDataWrapper
export default function AdminDashboard({
  appointments = [],
  professionals = [],
  services = [],
  onUpdateAppointment,
  onDeleteAppointment,
  onAddProfessional,
  onUpdateProfessional,
  onDeleteProfessional,
  onAddService,
  onUpdateService,
  onDeleteService,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabItems = [
    {
      id: "overview",
      title: "Dashboard",
      desc: "Métricas executivas",
      icon: "analytics",
    },
    {
      id: "appointments",
      title: "Agendamentos",
      desc: "Gerenciar reservas",
      icon: "calendar",
    },
    {
      id: "professionals",
      title: "Profissionais",
      desc: "Equipe & especialistas",
      icon: "users",
    },
    {
      id: "services",
      title: "Serviços",
      desc: "Catálogo premium",
      icon: "diamond",
    },
    {
      id: "blocked",
      title: "Dias Bloqueados",
      desc: "Imprevistos & feriados",
      icon: "calendar",
    },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    // <div className="admin-dashboard">
    //   {/* Professional Header */}
    //   <div className="admin-header">
    //     <div className="admin-header-content">
    //       <div className="admin-header-info">
    //         <div className="admin-header-icon">
    //           <Icon name="crown" size={32} />
    //         </div>
    //         <div>
    //           <h1 className="admin-header-title">Painel Administrativo</h1>
    //           <p className="admin-header-subtitle">Central de gestão premium</p>
    //         </div>
    //       </div>
    //       <div className="admin-header-badge">
    //         <Icon name="shield" size={20} />
    //         <span>Admin</span>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="admin-tabs">
    //     <div className="admin-tabs-list">
    //       <button
    //         className={`admin-tab ${activeTab === "overview" ? "active" : ""}`}
    //         onClick={() => setActiveTab("overview")}
    //       >
    //         <Icon name="analytics" size={20} />
    //         <span className="admin-tab-text">
    //           <span className="admin-tab-title">Dashboard</span>
    //           <span className="admin-tab-desc">Métricas executivas</span>
    //         </span>
    //       </button>
    //       <button
    //         className={`admin-tab ${activeTab === "appointments" ? "active" : ""}`}
    //         onClick={() => setActiveTab("appointments")}
    //       >
    //         <Icon name="calendar" size={20} />
    //         <span className="admin-tab-text">
    //           <span className="admin-tab-title">Agendamentos</span>
    //           <span className="admin-tab-desc">Gerenciar reservas</span>
    //         </span>
    //       </button>
    //       <button
    //         className={`admin-tab ${activeTab === "professionals" ? "active" : ""}`}
    //         onClick={() => setActiveTab("professionals")}
    //       >
    //         <Icon name="users" size={20} />
    //         <span className="admin-tab-text">
    //           <span className="admin-tab-title">Profissionais</span>
    //           <span className="admin-tab-desc">Equipe & especialistas</span>
    //         </span>
    //       </button>
    //       <button
    //         className={`admin-tab ${activeTab === "services" ? "active" : ""}`}
    //         onClick={() => setActiveTab("services")}
    //       >
    //         <Icon name="diamond" size={20} />
    //         <span className="admin-tab-text">
    //           <span className="admin-tab-title">Serviços</span>
    //           <span className="admin-tab-desc">Catálogo premium</span>
    //         </span>
    //       </button>
    //       {/* Regra 5: Aba de Dias Bloqueados */}
    //       <button
    //         className={`admin-tab ${activeTab === "blocked" ? "active" : ""}`}
    //         onClick={() => setActiveTab("blocked")}
    //       >
    //         <Icon name="calendar" size={20} />
    //         <span className="admin-tab-text">
    //           <span className="admin-tab-title">Dias Bloqueados</span>
    //           <span className="admin-tab-desc">Imprevistos & feriados</span>
    //         </span>
    //       </button>
    //     </div>

    //     <div className="admin-tabs-content">
    //       {activeTab === "overview" && (
    //         <DashboardOverview
    //           appointments={appointments}
    //           professionals={professionals}
    //           services={services}
    //         />
    //       )}

    //       {activeTab === "appointments" && (
    //         <AdminAppointments
    //           appointments={appointments}
    //           onUpdate={onUpdateAppointment}
    //           onDelete={onDeleteAppointment}
    //         />
    //       )}

    //       {activeTab === "professionals" && (
    //         <ProfessionalsManagement
    //           professionals={professionals}
    //           onAdd={onAddProfessional}
    //           onUpdate={onUpdateProfessional}
    //           onDelete={onDeleteProfessional}
    //         />
    //       )}

    //       {activeTab === "services" && (
    //         <ServicesManagement
    //           services={services}
    //           onAdd={onAddService}
    //           onUpdate={onUpdateService}
    //           onDelete={onDeleteService}
    //         />
    //       )}

    //       {/* Regra 5: Painel de Dias Bloqueados */}
    //       {activeTab === "blocked" && <BlockedDatesManager />}
    //     </div>
    //   </div>
    // </div>

    <div className="admin-dashboard">
      {/* Cabeçalho */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-info">
            <div className="admin-header-icon">
              <Icon name="crown" size={32} />
            </div>
            <div>
              <h1 className="admin-header-title">Painel Administrativo</h1>
              <p className="admin-header-subtitle">Central de gestão premium</p>
            </div>
          </div>
          <div className="admin-header-badge">
            <Icon name="shield" size={20} />
            <span>Admin</span>
          </div>
        </div>
      </div>

      {/* Navegação Estilizada como Links */}
      <div className="admin-tabs">
        {/* Botão Hambúrguer para Mobile */}
        <div className="admin-menu-toggle">
          <button
            className="admin-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <span className="admin-current-tab">
            {tabItems.find((tab) => tab.id === activeTab)?.title || "Dashboard"}
          </span>
        </div>

        {/* Navegação Desktop e Mobile Menu */}
        <nav
          className={`admin-tabs-list ${mobileMenuOpen ? "mobile-open" : ""}`}
        >
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabChange(tab.id)}
              style={{ cursor: "pointer", textAlign: "left", width: "100%" }}
            >
              <Icon name={tab.icon} size={20} />
              <span className="admin-tab-text">
                <span className="admin-tab-title">{tab.title}</span>
                <span className="admin-tab-desc">{tab.desc}</span>
              </span>
            </button>
          ))}
        </nav>

        {/* Conteúdo Dinâmico */}
        <div className="admin-tabs-content">
          {activeTab === "overview" && (
            <DashboardOverview
              appointments={appointments}
              professionals={professionals}
              services={services}
            />
          )}
          {activeTab === "appointments" && (
            <AdminAppointments
              appointments={appointments}
              onUpdate={onUpdateAppointment}
              onDelete={onDeleteAppointment}
            />
          )}
          {activeTab === "professionals" && (
            <ProfessionalsManagement
              professionals={professionals}
              onAdd={onAddProfessional}
              onUpdate={onUpdateProfessional}
              onDelete={onDeleteProfessional}
            />
          )}
          {activeTab === "services" && (
            <ServicesManagement
              services={services}
              onAdd={onAddService}
              onUpdate={onUpdateService}
              onDelete={onDeleteService}
            />
          )}
          {activeTab === "blocked" && <BlockedDatesManager />}
        </div>
      </div>
    </div>
  );
}
