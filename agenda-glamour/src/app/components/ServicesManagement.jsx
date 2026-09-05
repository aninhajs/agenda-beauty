import { useState } from "react";
import Icon from "./ui/LucideIcons";
import "./ServicesManagement.css";

const categories = [
  "Cabelo",
  "Unhas",
  "Barba",
  "Estética",
  "Massagem",
  "Outro",
];

export default function ServicesManagement({
  services,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    category: "",
  });
  const [categoryFilter, setCategoryFilter] = useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.duration ||
      !formData.category
    ) {
      alert("Todos os campos são obrigatórios");
      return;
    }

    const serviceData = {
      name: formData.name,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      category: formData.category,
    };

    if (editingId) {
      onUpdate(editingId, serviceData);
      alert("Serviço atualizado com sucesso");
      setEditingId(null);
    } else {
      onAdd(serviceData);
      alert("Serviço adicionado com sucesso");
      setIsAddModalOpen(false);
    }

    setFormData({ name: "", price: "", duration: "", category: "" });
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category,
    });
    setEditingId(service.id);
  };

  const handleDelete = (service) => {
    if (window.confirm(`Deseja remover o serviço ${service.name}?`)) {
      onDelete(service.id);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", price: "", duration: "", category: "" });
  };

  const filteredServices = services.filter(
    (service) =>
      categoryFilter === "all" || service.category === categoryFilter,
  );

  const groupedServices = categories.reduce((acc, category) => {
    const categoryServices = filteredServices.filter(
      (s) => s.category === category,
    );
    if (categoryServices.length > 0) {
      acc[category] = categoryServices;
    }
    return acc;
  }, {});

  return (
    <div className="services-management">
      <div className="management-header">
        <div>
          <h2>Catálogo de Serviços</h2>
          <p>Gerencie os serviços oferecidos</p>
        </div>
        <div className="header-actions">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-filter"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
            ➕ Adicionar Serviço
          </button>
        </div>
      </div>

      {/* Services by Category */}
      {Object.keys(groupedServices).length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">
            <Icon name="scissors" size={48} />
          </span>
          <p>Nenhum serviço encontrado</p>
        </div>
      ) : (
        Object.entries(groupedServices).map(([category, categoryServices]) => (
          <div key={category} className="category-section">
            <div className="category-header">
              <h3>
                <Icon name="tag" size={18} /> {category}
              </h3>
              <span>
                {categoryServices.length}{" "}
                {categoryServices.length === 1 ? "serviço" : "serviços"}
              </span>
            </div>
            <div className="services-grid">
              {categoryServices.map((service) => (
                <div
                  key={service.id}
                  className={`service-card ${editingId === service.id ? "editing" : ""}`}
                >
                  {editingId === service.id ? (
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
                      <div className="form-row">
                        <div className="form-group">
                          <label>Preço (R$)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Duração (min)</label>
                          <input
                            type="number"
                            value={formData.duration}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                duration: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Categoria</label>
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">Selecione</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
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
                      <div className="service-header">
                        <h4>{service.name}</h4>
                      </div>
                      <div className="service-details">
                        <div className="service-detail">
                          <span className="detail-icon">
                            <Icon name="dollar" size={16} />
                          </span>
                          <span>R$ {service.price.toFixed(2)}</span>
                        </div>
                        <div className="service-detail">
                          <span className="detail-icon">
                            <Icon name="clock" size={16} />
                          </span>
                          <span>{service.duration} min</span>
                        </div>
                      </div>
                      <div className="service-actions">
                        <button
                          onClick={() => handleEdit(service)}
                          className="edit-btn"
                        >
                          <Icon name="edit" size={16} /> Editar
                        </button>
                        <button
                          onClick={() => handleDelete(service)}
                          className="remove-btn"
                        >
                          <Icon name="trash" size={16} /> Remover
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Novo Serviço</h2>
              <button
                className="modal-close"
                onClick={() => setIsAddModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Nome do Serviço *</label>
                <input
                  type="text"
                  placeholder="Ex: Corte Feminino"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="80.00"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duração (min) *</label>
                  <input
                    type="number"
                    placeholder="60"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Categoria *</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  <option value="">Selecione a categoria</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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
