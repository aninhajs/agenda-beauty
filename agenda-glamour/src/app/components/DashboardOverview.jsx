import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import Icon from "./ui/LucideIcons";
import "./DashboardOverview.css";

export default function DashboardOverview({
  appointments = [],
  professionals = [],
  services = [],
}) {
  // Calculate statistics
  const totalRevenue = appointments.reduce(
    (sum, apt) => sum + (apt.service?.price ?? apt.price ?? 0),
    0,
  );
  const confirmedAppointments = appointments.filter(
    (apt) => apt.status === "confirmed",
  ).length;
  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "pending",
  ).length;

  // Revenue by service category
  const revenueByCategory = services.reduce((acc, service) => {
    const serviceAppointments = appointments.filter((apt) => {
      const serviceName = apt.service?.name ?? apt.service;
      return serviceName === service.name;
    });
    const revenue = serviceAppointments.reduce(
      (sum, apt) => sum + (apt.service?.price ?? apt.price ?? 0),
      0,
    );

    const existing = acc.find((item) => item.category === service.category);
    if (existing) {
      existing.revenue += revenue;
    } else {
      acc.push({ category: service.category, revenue });
    }
    return acc;
  }, []);

  // Appointments by professional
  const appointmentsByProfessional = professionals.map((prof) => ({
    name: prof.name,
    appointments: appointments.filter((apt) => {
      const professionalName = apt.professional?.name ?? apt.professional;
      return professionalName === prof.name;
    }).length,
  }));

  // Daily revenue (mock data for demonstration)
  const dailyRevenueData = [
    { day: "Seg", revenue: 1200 },
    { day: "Ter", revenue: 1800 },
    { day: "Qua", revenue: 1500 },
    { day: "Qui", revenue: 2200 },
    { day: "Sex", revenue: 2800 },
    { day: "Sáb", revenue: 3200 },
    { day: "Dom", revenue: 1600 },
  ];

  return (
    <div className="dashboard-overview">
      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card green">
          <div className="metric-header">
            <span className="metric-icon">
              <Icon name="dollar" size={24} />
            </span>
            <h3>Receita Total</h3>
          </div>
          <div className="metric-value">R$ {totalRevenue.toFixed(2)}</div>
          <div className="metric-footer">+12% vs. mês anterior</div>
        </div>

        <div className="metric-card blue">
          <div className="metric-header">
            <span className="metric-icon">
              <Icon name="calendar" size={24} />
            </span>
            <h3>Agendamentos</h3>
          </div>
          <div className="metric-value">{appointments.length}</div>
          <div className="metric-footer">
            {confirmedAppointments} confirmados
          </div>
        </div>

        <div className="metric-card purple">
          <div className="metric-header">
            <span className="metric-icon">
              <Icon name="users" size={24} />
            </span>
            <h3>Profissionais</h3>
          </div>
          <div className="metric-value">{professionals.length}</div>
          <div className="metric-footer">Equipe ativa</div>
        </div>

        <div className="metric-card orange">
          <div className="metric-header">
            <span className="metric-icon">
              <Icon name="clock" size={24} />
            </span>
            <h3>Pendentes</h3>
          </div>
          <div className="metric-value">{pendingAppointments}</div>
          <div className="metric-footer">Aguardando confirmação</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="charts-row">
        {/* Revenue Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <Icon name="analytics" size={20} /> Receita Semanal
            </h3>
            <p>Evolução da receita nos últimos 7 dias</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`R$ ${value}`, "Receita"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-row">
        {/* Appointments by Professional */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Agendamentos por Profissional</h3>
            <p>Distribuição de trabalho da equipe</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentsByProfessional}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="appointments"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Receita por Categoria</h3>
            <p>Serviços mais lucrativos</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`R$ ${value}`, "Receita"]}
                />
                <Bar dataKey="revenue" fill="#ec4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Services */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Serviços Mais Procurados</h3>
          <p>Ranking de popularidade</p>
        </div>
        <div className="top-services">
          {services
            .map((service) => ({
              ...service,
              count: appointments.filter((apt) => {
                const serviceName = apt.service?.name ?? apt.service;
                return serviceName === service.name;
              }).length,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map((service, index) => (
              <div key={service.id} className="service-rank-item">
                <div className="service-rank-left">
                  <div className="rank-badge">{index + 1}</div>
                  <div className="service-info">
                    <h4>{service.name}</h4>
                    <p>{service.category}</p>
                  </div>
                </div>
                <div className="service-rank-right">
                  <div className="service-count">
                    {service.count} agendamentos
                  </div>
                  <div className="service-price">R$ {service.price}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
