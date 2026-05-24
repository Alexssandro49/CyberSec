import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  // Puxa o contexto global que configuramos no Layout
  const { empresaSelecionada, setEmpresaSelecionada } = useOutletContext();
  const [auditorias, setAuditorias] = useState([]);
  const [dadosAud, setDadosAud] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  // Estados dos Modais
  const [modalAtivo, setModalAtivo] = useState(null); // 'selecionar_modulo' | 'nova_sessao' | null
  const [erro, setErro] = useState('');
  
  // Estado para o formulário de Nova Sessão
  const [formData, setFormData] = useState({ nome: '', cnpj: '', moduloId: null });
  const [carregandoSessao, setCarregandoSessao] = useState(false);


  useEffect(() => {
      const buscarAuditorias = async () => {
        try {
          const resposta = await fetch('http://localhost:5187/api/Auditorias/Recentes');
          if (resposta.ok) {
            setAuditorias(await resposta.json());
          }
        } catch (error) {
          // Fallback local
          setAuditorias([
            { id: 1, empresa: 'Security Tech S/A', cnpj: '12.345.678/0001-90', setor: 'Tecnologia', status: 'Ativa' }
          ]);
        } finally {
          setCarregando(false);
        }
      };
      buscarAuditorias();
    }, []);
  useEffect(() => {
        const buscarDados = async () => {
          try {
            const resposta = await fetch('http://localhost:5187/api/Auditorias/Estatisticas');
            if (resposta.ok) {
              setDadosAud(await resposta.json());
            }
          } catch (error) {
            // Fallback local
            setDadosAud([
              { totalAuditorias:'--', empresasAuditadas: '--', iso27001: '--', iso27701: '--'}
            ]);
          } finally {
            setCarregando(false);
          }
        };
        buscarDados();
      }, []);
  useEffect(() => {
        const buscarModulos = async () => {
          try {
            const resposta = await fetch('http://localhost:5187/api/Modulos');
            if (resposta.ok) {
              setModulos(await resposta.json());
            }
          } catch (error) {
            // Fallback local
            setModulos([
              { id: 1, nome: 'ISO 27001' },
              { id: 2, nome: 'ISO 27701' }
            ]);   
          } finally {
            setCarregando(false);
          }
        };
        buscarModulos();
      }, []);
  // ================= LÓGICA DO BOTÃO PRINCIPAL =================
  const lidarComNovaAuditoria = () => {
    if (empresaSelecionada) {
      setModalAtivo('selecionar_modulo');
    } else {
      setModalAtivo('nova_sessao');
    }
  };

  // ================= INICIAR COM EMPRESA EXISTENTE =================
  const iniciarAuditoriaExistente = (moduloId) => {
    setModalAtivo(null);
    navigate(`/avaliacao/${empresaSelecionada.id}/modulo/${moduloId}`);
  };

  // ================= INICIAR NOVA SESSÃO (Criar Empresa + Iniciar) =================
  const iniciarNovaSessao = async (e) => {
    e.preventDefault();
    setErro('');

    if (!formData.nome || !formData.cnpj) {
      setErro('Por favor, preencha o Nome e o CNPJ da empresa.');
      return;
    }
    if (!formData.moduloId) {
      setErro('Selecione uma norma de referência para auditar.');
      return;
    }

    setCarregandoSessao(true);

    try {
      // 1. Cadastra a nova empresa na API
      const resposta = await fetch('http://localhost:5187/api/Empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Nome: formData.nome, CNPJ: formData.cnpj }) 
      });

      let novaEmpresa;
      if (resposta.ok) {
        novaEmpresa = await resposta.json();
      } else {
        throw new Error('Erro na API');
      }

      // 2. Define a empresa como selecionada no Layout global
      setEmpresaSelecionada(novaEmpresa);
      
      // 3. Redireciona para o questionário
      setModalAtivo(null);
      navigate(`/avaliacao/${novaEmpresa.id}/modulo/${formData.moduloId}`);

    } catch (error) {
      // FALLBACK PARA A APRESENTAÇÃO: Proteção caso a API esteja desligada
      console.warn("Usando fallback de criação de empresa para demonstração.");
      const novaEmpresaFake = { id: Date.now(), nome: formData.nome, cnpj: formData.cnpj };
      setEmpresaSelecionada(novaEmpresaFake);
      setModalAtivo(null);
      navigate(`/avaliacao/${novaEmpresaFake.id}/modulo/${formData.moduloId}`);
    } finally {
      setCarregandoSessao(false);
    }
  };
  if (carregando) return <div className="p-10 text-white text-center">Processando dados...</div>;
  return (
    <>
    
      {/* CABEÇALHO DO DASHBOARD */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Visão Geral</h1>
          <p className="text-sm text-slate-400 mt-1">Diagnóstico de Conformidade ISO 27001 & 27701</p>
        </div>
        
        {/* Botão Dinâmico */}
        <button 
          onClick={lidarComNovaAuditoria}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-5 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all flex items-center gap-2"
        >
          {empresaSelecionada ? 'Nova Auditoria' : 'Iniciar Nova Auditoria'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
        </button>
      </div>

      {/* KPIs (MANTIDOS IGUAIS) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm border-l-4 border-l-indigo-500">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Total de Auditorias Realizadas</h3>
            <p className="text-4xl font-bold text-white">{dadosAud.totalAuditorias}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm border-l-4 border-l-amber-500">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Empresas Auditadas</h3>
            <p className="text-4xl font-bold text-white">{dadosAud.empresasAuditadas}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm border-l-4 border-l-rose-500">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Auditorias ISO 27001</h3>
            <p className="text-4xl font-bold text-white">{dadosAud.iso27001}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm border-l-4 border-l-rose-500">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Auditorias ISO 27701</h3>
            <p className="text-4xl font-bold text-white">{dadosAud.iso27701}</p>
        </div>
      </div>
      {/* TABELA (MANTIDA IGUAL) */}
      <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Auditorias Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-800/50 text-slate-300 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4">Norma</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {auditorias.map((auditoria) => (
                <tr key={auditoria.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{auditoria.empresa}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {auditoria.norma}
                    </span>
                  </td>
                  <td className="px-6 py-4">{auditoria.data}</td>
                  <td className="px-6 py-4 text-right font-bold text-white">{auditoria.score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= ÁREA DOS MODAIS ================= */}
      {modalAtivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in px-4">
          
          {/* 1. POP-UP: ESCOLHER MÓDULO (Empresa já selecionada) */}
          {modalAtivo === 'selecionar_modulo' && (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl w-full max-w-sm shadow-2xl text-center relative">
              <button onClick={() => setModalAtivo(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              
              <h2 className="text-xl font-bold text-white mb-2">Iniciar Auditoria</h2>
              <p className="text-sm text-slate-400 mb-6">Qual módulo deseja avaliar para <strong>{empresaSelecionada.nome}</strong>?</p>
              
              <div className="flex flex-col gap-3">
                {modulos.map((modulo) => (
                  <button onClick={() => iniciarAuditoriaExistente(modulo.id)} className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 text-white rounded-lg font-medium transition-all text-left flex justify-between items-center group">
                  {modulo.nome}
                  <svg className="w-5 h-5 text-slate-500 group-hover:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. POP-UP: NOVA SESSÃO (Design Baseado na Imagem Fornecida) */}
          {modalAtivo === 'nova_sessao' && (
            <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-2xl w-full max-w-2xl shadow-2xl relative">
              <button onClick={() => setModalAtivo(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              
              <div className="mb-8">
                <span className="bg-indigo-900/50 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Nova Sessão</span>
                <h2 className="text-2xl font-bold text-white mt-4 mb-2">Identificação da Empresa & Escopo</h2>
                <p className="text-sm text-slate-400">Preencha as informações para iniciar o diagnóstico de segurança.</p>
              </div>
              
              <form onSubmit={iniciarNovaSessao}>
                {erro && <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg">{erro}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nome Fantasia da Empresa</label>
                    <input type="text" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="w-full bg-[#1e293b] border border-slate-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Ex: Security Tech S/A" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">CNPJ da Empresa</label>
                    <input type="text" value={formData.cnpj} onChange={(e) => setFormData({...formData, cnpj: e.target.value})} className="w-full bg-[#1e293b] border border-slate-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Ex: 00.000.000/0001-00" />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Norma de Referência</label>
                  <div className="flex gap-4">
                    {modulos.map((modulo) => (
                      <button type="button" onClick={() => setFormData({...formData, moduloId: modulo.id})} className={`flex-1 py-3 px-4 rounded-lg border font-medium transition-all ${formData.moduloId === modulo.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-[#1e293b] border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                        {modulo.nome}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Dados serão salvos via SQL Server</span>
                  </div>
                  
                  <button type="submit" disabled={carregandoSessao} className={`py-3 px-8 rounded-lg font-bold text-white transition-all flex items-center gap-2 ${carregandoSessao ? 'bg-indigo-800 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)]'}`}>
                    {carregandoSessao ? 'Iniciando...' : 'Iniciar Auditoria'}
                    {!carregandoSessao && <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}
    </>
  );
}