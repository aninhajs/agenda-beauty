import { useState } from "react";
import BookingForm from "./app/components/BookingForm";
import AppointmentsList from "./app/components/AppointmentsList";
import Icon from "./app/components/ui/LucideIcons";
import "./app/App.css";

// ✅ Agora recebe dados via props do SharedDataWrapper
export default function App({
  appointments = [],
  professionals = [],
  services = [],
  onBooking,
  onDeleteAppointment,
  loggedClient = null,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState("booking");

  const handleBooking = (appointment) => {
    onBooking(appointment);
    setActiveTab("appointments"); // Switch to appointments list after booking
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="logo-container">
              <div className="logo-icon">
                <Icon name="crown" size={28} />
              </div>
              <h1 className="title">Brenda Beauty </h1>
            </div>
            <p className="subtitle">
              Experimente nossos serviços premium de beleza e bem-estar
            </p>
          </div>

          {/* Regra 1: Info do cliente logado + botão de logout */}
          {loggedClient && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: "12px",
                padding: "10px 16px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {/* <span style={{ fontSize: "20px" }}>👤</span> */}
              {/* <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  {loggedClient.name}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "12px",
                  }}
                >
                  📱 {loggedClient.whatsapp}
                </div>
              </div> */}
              <button
                onClick={onLogout}
                style={{
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "8px",
                  color: "#fca5a5",
                  padding: "6px 12px",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Sair
              </button>
            </div>
          )}
        </div>

        {/* Área do cliente: apenas agendamento e visualização */}
        <div className="client-view">
          <div className="tabs">
            <div className="tabs-list">
              <button
                className={`tab ${activeTab === "booking" ? "active" : ""}`}
                onClick={() => setActiveTab("booking")}
              >
                <Icon name="calendar" size={18} />
                Novo Agendamento
              </button>
              <button
                className={`tab ${
                  activeTab === "appointments" ? "active" : ""
                }`}
                onClick={() => setActiveTab("appointments")}
              >
                <Icon name="briefcase" size={18} />
                Meus Agendamentos
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === "booking" && (
                <BookingForm
                  onBooking={handleBooking}
                  services={services}
                  professionals={professionals}
                />
              )}

              {activeTab === "appointments" && (
                <AppointmentsList
                  appointments={appointments}
                  onDelete={onDeleteAppointment}
                  loggedClient={loggedClient}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
