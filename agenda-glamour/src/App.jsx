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
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HEADER - Logo + Informações + Logout */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <header className="app-header">
        <div className="app-header-container">
          {/* Logo e Branding */}
          <div className="app-header-brand">
            <div className="app-logo-icon">
              <Icon name="crown" size={24} />
            </div>
            <div className="app-brand-info">
              <h1 className="app-brand-title">Brenda Beauty</h1>
              <p className="app-brand-tagline">Serviços Premium de Beleza</p>
            </div>
          </div>

          {/* Botão Logout ou Mensagem */}
          {loggedClient ? (
            <button onClick={onLogout} className="app-logout-btn">
              <Icon name="logOut" size={16} />
              <span>Sair</span>
            </button>
          ) : (
            <p className="app-guest-message">Bem-vindo ao nosso salão premium</p>
          )}
        </div>
      </header>
      {/* Conteúdo Principal */}
      <div className="app-container">
        {/* Hero Section */}
        <section className="app-hero">
          <div className="app-hero-content">
            <h2 className="app-hero-title">Agende seu próximo serviço</h2>
            <p className="app-hero-subtitle">Escolha entre nossos serviços premium e profissionais especialistas</p>
          </div>
        </section>

        {/* Abas de Navegação */}
        <div className="app-tabs">
          <div className="app-tabs-nav">
            <button
              className={`app-tab-btn ${activeTab === "booking" ? "active" : ""}`}
              onClick={() => setActiveTab("booking")}
            >
              <Icon name="calendar" size={20} />
              <span>Novo Agendamento</span>
            </button>
            <button
              className={`app-tab-btn ${activeTab === "appointments" ? "active" : ""}`}
              onClick={() => setActiveTab("appointments")}
            >
              <Icon name="briefcase" size={20} />
              <span>Meus Agendamentos</span>
            </button>
          </div>

          {/* Conteúdo das Abas */}
          <div className="app-tabs-content">
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
  );
}
