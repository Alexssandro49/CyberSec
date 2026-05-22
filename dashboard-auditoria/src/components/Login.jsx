import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  // Novos estados para feedback visual
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const lidarComLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resposta = await fetch('http://localhost:5187/api/Usuarios/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha })
      });

      if (resposta.ok) {
        // Login com sucesso (Status 200)
        const dadosUsuario = await resposta.json();
        console.log('Login efetuado:', dadosUsuario);
        
        // Aqui você pode salvar os dados no localStorage e redirecionar para o Dashboard
        localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
        window.location.href = '/dashboard';
      } else {
        // Trata os erros (Status 400 ou 404) retornados pela sua API C#
        const mensagemErro = await resposta.text(); 
        setErro(mensagemErro || 'Erro ao tentar fazer login.');
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      // Se a API estiver desligada ou der erro de CORS
      setErro('Não foi possível conectar ao servidor. Verifique se a API está rodando.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight">
            Cyber<span className="text-blue-600">Auditoria</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Acesse o painel de conformidade ISO
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={lidarComLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            
            {/* Mensagem de Erro Dinâmica */}
            {erro && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                {erro}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail corporativo</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 mt-1 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="auditor@empresa.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha de acesso</label>
              <input
                id="senha"
                name="senha"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 mt-1 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={carregando}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                carregando ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              } transition-colors duration-200`}
            >
              {carregando ? 'Verificando credenciais...' : 'Entrar no Sistema'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}