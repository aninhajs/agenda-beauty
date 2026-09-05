import { useState, useEffect } from 'react';
import { blockedDatesApi } from '../../services/api.js';
import './BookingForm.css';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
];

export default function BookingForm({ onBooking, services, professionals }) {
  const [clientName, setClientName] = useState('');
  const [service, setService] = useState('');
  const [professional, setProfessional] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Regra 5: Lista de datas bloqueadas pelo admin
  const [blockedDates, setBlockedDates] = useState([]);

  // Regra 5: Carregar datas bloqueadas ao montar o componente
  useEffect(() => {
    blockedDatesApi.getAll()
      .then((data) => setBlockedDates(data.map((d) => d.date)))
      .catch(() => setBlockedDates([])); // Ignora erro silenciosamente
  }, []);

  const selectedService = services.find(s => s.name === service);

  // Regra 5: Verificar se a data selecionada está bloqueada
  const isDateBlocked = blockedDates.includes(date);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!clientName || !service || !professional || !date || !time) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    // Regra 5: Impedir agendamento em dia bloqueado
    if (isDateBlocked) {
      alert('Este dia está indisponível. Por favor, selecione outra data.');
      return;
    }

    onBooking({
      clientName,
      service,
      professional,
      date,
      time,
      price: selectedService?.price || 0,
    });

    // Reset form
    setClientName('');
    setService('');
    setProfessional('');
    setDate('');
    setTime('');

    alert(`Agendamento realizado com sucesso!\n${clientName} - ${service} em ${date} às ${time}`);
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-card">
      <div className="card-header">
        <h2>Agendar Horário</h2>
        <p className="card-description">Preencha os dados abaixo para realizar seu agendamento</p>
      </div>
      
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="clientName">Nome do Cliente</label>
            <input
              id="clientName"
              type="text"
              placeholder="Digite seu nome"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="service">Serviço</label>
            <select
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
            >
              <option value="">Selecione o serviço</option>
              {services.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} - R$ {s.price} ({s.duration} min)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="professional">Profissional</label>
            <select
              id="professional"
              value={professional}
              onChange={(e) => setProfessional(e.target.value)}
              required
            >
              <option value="">Selecione o profissional</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} - {p.specialty}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Data</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              required
              style={isDateBlocked ? { borderColor: '#ef4444', background: 'rgba(239,68,68,0.08)' } : {}}
            />
            {/* Regra 5: Aviso visual se data bloqueada */}
            {isDateBlocked && (
              <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>
                🚫 Este dia está indisponível. Por favor, escolha outra data.
              </p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Horário</label>
          <div className="time-slots">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                className={`time-slot ${time === slot ? 'selected' : ''}`}
                onClick={() => setTime(slot)}
              >
                {slot}
                {time === slot && <span className="check-icon">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {selectedService && (
          <div className="summary">
            <h3>Resumo do Agendamento</h3>
            <div className="summary-content">
              <p><strong>Serviço:</strong> {service}</p>
              <p><strong>Duração:</strong> {selectedService.duration} minutos</p>
              <p><strong>Valor:</strong> R$ {selectedService.price.toFixed(2)}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={isDateBlocked}
          style={isDateBlocked ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          Confirmar Agendamento
        </button>
      </form>
    </div>
  );
}
