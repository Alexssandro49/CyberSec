import { Outlet, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();

  const lidarComLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  const usuario = JSON.parse(localStorage.getItem('usuario')) || { nome: 'Usuário' };
  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-300">
      
      {/* BARRA LATERAL ESQUERDA (Dark) */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <svg className="w-8 h-8 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            PSI<span className="text-indigo-500">Auditoria</span>
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {/* Link Ativo com fundo levemente índigo */}
          <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-white bg-indigo-500/10 border border-indigo-500/20 rounded-lg font-medium transition-colors">
            Início
          </a>
          {/* Link Inativo */}
          <a href="/empresas" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors">
            Empresas
          </a>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* BARRA SUPERIOR (Dark) */}
        <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-end px-8">
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-sm font-bold text-white">{usuario.nome}</p>
              <p className="text-xs text-slate-400">{usuario.email}</p>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <button onClick={lidarComLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-red-500/10">
              Sair
            </button>
          </div>
        </header>

        {/* ÁREA DINÂMICA */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
          <Outlet /> 
        </main>

      </div>
    </div>
  );
}