import { useState, useEffect } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  
  // 1. Estados para controlar a empresa selecionada e os módulos dela
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [modulos, setModulos] = useState([]);
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const lidarComLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // 2. Busca os módulos na API sempre que uma empresa for selecionada
  useEffect(() => {
    if (empresaSelecionada) {
      const buscarModulos = async () => {
        try {
          // Aqui fará a busca real na sua API C# no futuro
          const resposta = await fetch(`http://localhost:5187/api/Modulos/Empresa/${empresaSelecionada.id}`);
          if (resposta.ok) {
            setModulos(await resposta.json());
          } else {
            throw new Error("Usando fallback local");
          }
        } catch (error) {
          // Fallback para você já testar o visual para a apresentação
          setModulos([
            { id: 1, nome: 'ISO 27001 (SI)' },
            { id: 2, nome: 'ISO 27701 (PI)' }
          ]);
        }
      };
      buscarModulos();
    } else {
      setModulos([]); // Limpa se não houver empresa
    }
  }, [empresaSelecionada]);

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-300">
      
      {/* BARRA LATERAL ESQUERDA */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-slate-800 shrink-0">
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <svg className="w-8 h-8 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            PSI<span className="text-indigo-500">Auditoria</span>
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          
          {/* Link Dinâmico: Início */}
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive 
                ? 'text-white bg-indigo-500/10 border border-indigo-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
              }`
            }
          >
            Início
          </NavLink>

          {/* Link Dinâmico: Empresas */}
          <NavLink 
            to="/empresas" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive 
                ? 'text-white bg-indigo-500/10 border border-indigo-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
              }`
            }
          >
            Empresas
          </NavLink>

          {/* ================= MENU DINÂMICO DA EMPRESA SELECIONADA ================= */}
          {empresaSelecionada && (
            <div className="mt-8 pt-4 border-t border-slate-800">
              <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Auditoria Ativa
              </p>
              
              {/* Lista os módulos retornados pela sua API C# */}
              <div className="space-y-1">
                {modulos.map((modulo) => (
                  <NavLink 
                    key={modulo.id} 
                    to={`/relatorio/${empresaSelecionada.id}/modulo/${modulo.id}`} 
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                        isActive 
                        ? 'text-white bg-indigo-500/10 border border-indigo-500/20 font-bold' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Relatório {modulo.nome}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* BARRA SUPERIOR - Ajustada para justify-between */}
        <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 shrink-0">
          
          {/* 4. DADOS DA EMPRESA NA NAVBAR */}
          <div className="flex-1">
            {empresaSelecionada && (
              <div className="flex items-center gap-3 animate-fade-in">
                <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-wide">{empresaSelecionada.nome}</p>
                  <p className="text-xs text-slate-400 font-mono">CNPJ: {empresaSelecionada.cnpj}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-sm font-bold text-white">{usuario?.nome}</p>
              <p className="text-xs text-slate-400">{usuario?.email}</p>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <button onClick={lidarComLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-red-500/10">
              Sair
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
          {/* 5. PASSANDO A FUNÇÃO DE SELEÇÃO PARA AS ROTAS FILHAS */}
          <Outlet context={{ empresaSelecionada, setEmpresaSelecionada }} />
        </main>

      </div>
    </div>
  );
}