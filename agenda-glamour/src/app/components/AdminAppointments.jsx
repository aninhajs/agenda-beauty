import { useState } from "react";
import Icon from "./ui/LucideIcons";
import "./AdminAppointments.css";

export default function AdminAppointments({
  appointments,
  onUpdate,
  onDelete,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleStatusChange = (id, status) => {
    onUpdate(id, { status });
    alert("Status atualizado com sucesso");
  };

  const handleDelete = (appointment) => {
    if (
      window.confirm(
        `Deseja excluir o agendamento de ${appointment.clientName}?`,
      )
    ) {
      onDelete(appointment.id);
    }
  };

  // Filter appointments
  const filteredAppointments = appointments
    .filter((apt) => {
      const serviceName = apt.service?.name ?? apt.service ?? "";
      const professionalName = apt.professional?.name ?? apt.professional ?? "";
      const matchesSearch =
        apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professionalName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || apt.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "completed":
        return "#3b82f6";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendente";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      default:
        return "Pendente";
    }
  };

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

  return (
    <div className="admin-appointments-card">
      <div className="card-header">
        <h2>Gerenciar Agendamentos</h2>
        <p className="card-description">
          Visualize e gerencie todos os agendamentos do salão
        </p>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por cliente, serviço ou profissional..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-select-wrapper">
          <span className="filter-icon">🔽</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="pending">Pendentes</option>
            <option value="confirmed">Confirmados</option>
            <option value="completed">Concluídos</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">
            <Icon name="calendar" size={48} />
          </span>
          <p>Nenhum agendamento encontrado</p>
        </div>
      ) : (
        <div className="admin-appointments-list">
          {filteredAppointments.map((appointment) => {
            const isPast =
              new Date(`${appointment.date}T${appointment.time}`) < new Date();

            return (
              <div
                key={appointment.id}
                className={`admin-appointment-item ${isPast && appointment.status !== "completed" ? "overdue" : ""}`}
              >
                <div className="admin-appointment-content">
                  <div className="admin-appointment-header">
                    <h3>{appointment.clientName}</h3>
                    <div className="badges">
                      {isToday(appointment.date) && (
                        <span className="badge today">Hoje</span>
                      )}
                      {isPast && appointment.status !== "completed" && (
                        <span className="badge overdue">Atrasado</span>
                      )}
                    </div>
                  </div>

                  <div className="admin-appointment-details">
                    <div className="detail">
                      <span className="detail-icon">
                        <Icon name="scissors" size={16} />
                      </span>
                      <span>
                        {appointment.service?.name ?? appointment.service}
                      </span>
                    </div>

                    <div className="detail">
                      <span className="detail-icon">
                        <Icon name="users" size={16} />
                      </span>
                      <span>
                        {appointment.professional?.name ??
                          appointment.professional}
                      </span>
                    </div>

                    <div className="detail">
                      <span className="detail-icon">
                        <Icon name="calendar" size={16} />
                      </span>
                      <span>{formatDate(appointment.date)}</span>
                    </div>

                    <div className="detail">
                      <span className="detail-icon">
                        <Icon name="clock" size={16} />
                      </span>
                      <span>{appointment.time}</span>
                    </div>
                  </div>

                  <div className="admin-appointment-footer">
                    <div className="price">
                      R${" "}
                      {(
                        appointment.service?.price ??
                        appointment.price ??
                        0
                      ).toFixed(2)}
                    </div>
                    <select
                      value={appointment.status || "pending"}
                      onChange={(e) =>
                        handleStatusChange(appointment.id, e.target.value)
                      }
                      className="status-select"
                    >
                      <option value="pending">Pendente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="completed">Concluído</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>

                <div className="admin-appointment-actions">
                  <div
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusColor(appointment.status),
                    }}
                  >
                    {getStatusLabel(appointment.status)}
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(appointment)}
                  >
                    <Icon name="trash" size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
