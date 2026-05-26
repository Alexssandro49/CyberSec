// src/services/apiService.js

const BASE_URL = 'https://localhost:7199/api';

export const apiFetch = async (endpoint, options = {}) => {
  let token = localStorage.getItem('token');
  
  // 1. Prepara a chamada original
  let headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // 2. Faz a chamada
  let response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  // 3. A MÁGICA ACONTECE AQUI: A API rejeitou (Token expirou)?
  if (response.status === 401) {
    console.log("Token expirado. Iniciando renovação silenciosa...");
    
    // Tentamos renovar o token
    const refreshResponse = await fetch(`${BASE_URL}/Usuarios/RefreshToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(token) // Cuidado: Envie no formato que o seu C# espera!
    });

    if (refreshResponse.ok) {
      // Sucesso! Pega o novo token
      const data = await refreshResponse.json();
      token = data.token; // Supondo que sua API retorna { token: "novo_token_aqui" }
      
      // Atualiza o cofre (localStorage)
      localStorage.setItem('token', token);

      // Atualiza o cabeçalho com o NOVO token
      headers['Authorization'] = `Bearer ${token}`;

      // 4. REFAZ a chamada original que o auditor tinha tentado fazer
      response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
      
    } else {
      // 5. O PLANO DE EMERGÊNCIA: Se até a renovação falhou (ex: o usuário ficou 1 mês sem acessar), aí sim desloga.
      alert("Sua sessão de segurança expirou. Por favor, entre novamente.");
      localStorage.clear();
      window.location.href = '/';
      return null;
    }
  }

  return response;
};