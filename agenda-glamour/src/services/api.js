// Configuração da API
const API_BASE_URL = "http://127.0.0.1:3001/api";

// Lê o token admin do localStorage (salvo após login admin)
function getAdminToken() {
  try {
    const stored = localStorage.getItem("glamour_admin");
    return stored ? JSON.parse(stored).token : null;
  } catch {
    return null;
  }
}

// Função helper para fazer requests
async function apiRequest(url, options = {}) {
  try {
    const token = getAdminToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Serviços (Services)
export const servicesApi = {
  getAll: () => apiRequest("/services"),
  create: (service) =>
    apiRequest("/services", {
      method: "POST",
      body: JSON.stringify(service),
    }),
  update: (id, service) =>
    apiRequest(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(service),
    }),
  delete: (id) =>
    apiRequest(`/services/${id}`, {
      method: "DELETE",
    }),
};

// Profissionais (Professionals)
export const professionalsApi = {
  getAll: () => apiRequest("/professionals"),
  create: (professional) =>
    apiRequest("/professionals", {
      method: "POST",
      body: JSON.stringify(professional),
    }),
  update: (id, professional) =>
    apiRequest(`/professionals/${id}`, {
      method: "PUT",
      body: JSON.stringify(professional),
    }),
  delete: (id) =>
    apiRequest(`/professionals/${id}`, {
      method: "DELETE",
    }),
};

// Agendamentos (Appointments)
export const appointmentsApi = {
  getAll: () => apiRequest("/appointments"),
  // Regra 2: Buscar agendamentos filtrados pelo clientId do cliente logado
  getByClient: (clientId) => apiRequest(`/appointments/client/${clientId}`),
  create: (appointment) =>
    apiRequest("/appointments", {
      method: "POST",
      body: JSON.stringify(appointment),
    }),
  update: (id, appointment) =>
    apiRequest(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(appointment),
    }),
  delete: (id) =>
    apiRequest(`/appointments/${id}`, {
      method: "DELETE",
    }),
};

// Autenticação (Auth) — admin via email/senha
export const authApi = {
  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
};

// Autenticação de admin — salva token no localStorage
export const adminAuthApi = {
  login: async (credentials) => {
    const data = await authApi.login(credentials);
    if (data.token && data.user?.role === "ADMIN") {
      localStorage.setItem(
        "glamour_admin",
        JSON.stringify({ token: data.token, user: data.user })
      );
      return data;
    }
    throw new Error("Acesso negado. Usuário não é administrador.");
  },
  logout: () => {
    localStorage.removeItem("glamour_admin");
  },
  getSession: () => {
    try {
      const stored = localStorage.getItem("glamour_admin");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },
};

// Autenticação de cliente via Nome + WhatsApp (Regra 1)
export const clientAuthApi = {
  login: (data) =>
    apiRequest("/auth/client-login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Dias bloqueados pelo admin (Regra 5)
export const blockedDatesApi = {
  getAll: () => apiRequest("/blocked-dates"),
  create: (data) =>
    apiRequest("/blocked-dates", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/blocked-dates/${id}`, {
      method: "DELETE",
    }),
};

// Teste de conectividade
export const healthCheck = () => fetch("/health").then((res) => res.json());
