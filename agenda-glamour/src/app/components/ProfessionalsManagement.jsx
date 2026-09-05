import { useState } from "react";
import Icon from "./ui/LucideIcons";
import "./ProfessionalsManagement.css";

export default function ProfessionalsManagement({
  professionals,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.specialty) {
      alert("Nome e especialidade são obrigatórios");
      return;
    }

    if (editingId) {
      onUpdate(editingId, formData);
      alert("Profissional atualizado com sucesso");
      setEditingId(null);
    } else {
      onAdd(formData);
      alert("Profissional adicionado com sucesso");
      setIsAddModalOpen(false);
    }

    setFormData({ name: "", specialty: "", email: "", phone: "" });
  };

  const handleEdit = (professional) => {
    setFormData({
      name: professional.name,
      specialty: professional.specialty,
      email: professional.email || "",
      phone: professional.phone || "",
    });
    setEditingId(professional.id);
  };

  const handleDelete = (professional) => {
    if (window.confirm(`Deseja remover ${professional.name}?`)) {
      onDelete(professional.id);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", specialty: "", email: "", phone: "" });
  };

  return (
    <div className="professionals-management">
      <div className="management-header">
        <div>
          <h2>Equipe de Profissionais</h2>
          <p>Gerencie os profissionais do salão</p>
        </div>
        <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
          ➕ Adicionar Profissional
        </button>
      </div>

      {/* Professionals Grid */}
      <div className="professionals-grid">
        {professionals.map((professional) => (
          <div
            key={professional.id}
            className={`professional-card ${editingId === professional.id ? "editing" : ""}`}
          >
            <div className="professional-header">
              <div className="professional-avatar">👤</div>
              <div className="professional-title">
                <h3>{professional.name}</h3>
                <p>{professional.specialty}</p>
              </div>
            </div>

            <div className="professional-body">
              {editingId === professional.id ? (
                <form onSubmit={handleSubmit} className="edit-form">
                  <div className="form-group">
                    <label>Nome</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Especialidade</label>
                    <input
                      type="text"
                      value={formData.specialty}
                      onChange={(e) =>
                        setFormData({ ...formData, specialty: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>E-mail</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="cancel-btn"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="professional-contacts">
                    {professional.email && (
                      <div className="contact-item">
                        <span className="contact-icon">
                          <Icon name="mail" size={16} />
                        </span>
                        <span>{professional.email}</span>
                      </div>
                    )}
                    {professional.phone && (
                      <div className="contact-item">
                        <span className="contact-icon">
                          <Icon name="phone" size={16} />
                        </span>
                        <span>{professional.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="professional-actions">
                    <button
                      onClick={() => handleEdit(professional)}
                      className="edit-btn"
                    >
                      <Icon name="edit" size={16} /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(professional)}
                      className="remove-btn"
                    >
                      <Icon name="trash" size={16} /> Remover
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Novo Profissional</h2>
              <button
                className="modal-close"
                onClick={() => setIsAddModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Especialidade *</label>
                <input
                  type="text"
                  placeholder="Ex: Cabeleireira, Barbeiro, Manicure"
                  value={formData.specialty}
                  onChange={(e) =>
                    setFormData({ ...formData, specialty: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input
                  type="tel"
                  placeholder="(11) 98765-4321"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <button type="submit" className="submit-modal-btn">
                Adicionar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
