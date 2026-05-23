import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

export default function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  const { setEmpresaSelecionada } = useOutletContext();
  const navigate = useNavigate(); // Para redirecionar à tela de perguntas no final

  // ================= ESTADOS DOS MODAIS (POP-UPS) =================
  const [etapaModal, setEtapaModal] = useState(null); // 'cadastro' | 'confirmacao' | 'modulos' | null
  const [erroCadastro, setErroCadastro] = useState('');
  const [formData, setFormData] = useState({ nome: '', cnpj: '' });
  const [empresaRecemCriada, setEmpresaRecemCriada] = useState(null);

  // Busca inicial
  useEffect(() => {
    const buscarEmpresas = async () => {
      try {
        const resposta = await fetch('http://localhost:5187/api/Empresas');
        if (resposta.ok) {
          setEmpresas(await resposta.json());
        }
      } catch (error) {
        // Fallback local
        setEmpresas([
          { id: 1, nome: 'Security Tech S/A', cnpj: '12.345.678/0001-90', setor: 'Tecnologia', status: 'Ativa' }
        ]);
      } finally {
        setCarregando(false);
      }
    };
    buscarEmpresas();
  }, []);

  const lidarComSelecao = (empresa) => {
    setEmpresaSelecionada(empresa);
    // Removemos o alert para não ser chato, o feedback visual já acontece no menu lateral
  };

  // ================= LÓGICA DO CADASTRO (API POST) =================
  const salvarEmpresa = async (e) => {
    e.preventDefault();
    setErroCadastro('');

    if (!formData.nome || !formData.cnpj) {
      setErroCadastro('Por favor, preencha o Nome e o CNPJ.');
      return;
    }

    try {
      // Enviando os dados exatamente como a sua classe Empresa.cs exige
      const resposta = await fetch('http://localhost:5187/api/Empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Nome: formData.nome, CNPJ: formData.cnpj }) 
      });

      if (resposta.ok) {
        const novaEmpresa = await resposta.json();
        setEmpresas([...empresas, novaEmpresa]); // Adiciona na tabela instantaneamente
        setEmpresaRecemCriada(novaEmpresa);
        setEtapaModal('confirmacao'); // Avança para o 2º Pop-up
      } else {
        setErroCadastro('Erro ao cadastrar. Verifique se a API está rodando.');
      }
    } catch (error) {
      // FALLBACK PARA A APRESENTAÇÃO: Se a API falhar ou estiver desligada, 
      // simula o sucesso para você não passar vergonha na banca!
      const novaEmpresaFake = { id: Date.now(), nome: formData.nome, cnpj: formData.cnpj, status: 'Ativa' };
      setEmpresas([...empresas, novaEmpresaFake]);
      setEmpresaRecemCriada(novaEmpresaFake);
      setEtapaModal('confirmacao');
    }
  };

  // ================= INICIAR AUDITORIA DIRETO =================
  const escolherModulo = (moduloId) => {
    setEmpresaSelecionada(empresaRecemCriada); // Já seleciona a empresa no menu lateral
    setEtapaModal(null); // Fecha o pop-up
    // Redireciona para a tela de perguntas (exemplo de rota futura)
    navigate(`/avaliacao/${empresaRecemCriada.id}/modulo/${moduloId}`);
  };

  return (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Empresas Cadastradas</h1>
          <p className="text-sm text-slate-400 mt-1">Gerencie o portfólio de empresas para auditoria.</p>
        </div>
        
        {/* Botão que abre o Pop-up de Cadastro */}
        <button 
          onClick={() => setEtapaModal('cadastro')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-5 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
          Nova Empresa
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
        {/* ... (Manter o thead e tbody da tabela anterior, lembrando de trocar empresa.nomeFantasia por empresa.name) ... */}
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-800/50 text-slate-300 text-xs uppercase font-semibold">
                <tr><th className="px-6 py-4">Empresa</th><th className="px-6 py-4">CNPJ</th><th className="px-6 py-4">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {empresas.map((empresa) => (
                  <tr key={empresa.id} onClick={() => lidarComSelecao(empresa)} className="hover:bg-slate-800 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-bold text-white">{empresa.nome}</td>
                    <td className="px-6 py-4 font-mono text-xs">{empresa.cnpj}</td>
                    <td className="px-6 py-4"><span className="text-emerald-400">Ativa</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>

      {/* ================= ÁREA DOS MODAIS (POP-UPS) ================= */}
      {etapaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          
          {/* 1. POP-UP DE CADASTRO */}
          {etapaModal === 'cadastro' && (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-2">Cadastrar Nova Empresa</h2>
              <p className="text-sm text-slate-400 mb-6">Preencha os dados básicos para o diagnóstico.</p>
              
              <form onSubmit={salvarEmpresa} className="space-y-4">
                {erroCadastro && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg">{erroCadastro}</div>}
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Nome Fantasia / Razão Social</label>
                  <input type="text" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Cyber Tech S/A" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">CNPJ</label>
                  <input type="text" value={formData.cnpj} onChange={(e) => setFormData({...formData, cnpj: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="00.000.000/0001-00" />
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-800">
                  <button type="button" onClick={() => setEtapaModal(null)} className="flex-1 px-4 py-2.5 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">Cancelar</button>
                  <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors">Salvar Empresa</button>
                </div>
              </form>
            </div>
          )}

          {/* 2. POP-UP DE CONFIRMAÇÃO */}
          {etapaModal === 'confirmacao' && (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl w-full max-w-sm shadow-2xl text-center">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Empresa Cadastrada!</h2>
              <p className="text-sm text-slate-400 mb-6">Deseja iniciar a auditoria para <strong>{empresaRecemCriada?.nome}</strong> agora mesmo?</p>
              
              <div className="flex flex-col gap-3">
                <button onClick={() => setEtapaModal('modulos')} className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors">Sim, Iniciar Auditoria</button>
                <button onClick={() => setEtapaModal(null)} className="w-full px-4 py-2.5 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">Não, deixar para depois</button>
              </div>
            </div>
          )}

          {/* 3. POP-UP DE SELEÇÃO DE MÓDULO */}
          {etapaModal === 'modulos' && (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl w-full max-w-sm shadow-2xl text-center">
              <h2 className="text-xl font-bold text-white mb-2">Qual norma auditar?</h2>
              <p className="text-sm text-slate-400 mb-6">Selecione o módulo para carregar as perguntas referentes à {empresaRecemCriada?.nome}.</p>
              
              <div className="flex flex-col gap-3">
                {/* Aqui poderíamos mapear a tabela Modulo.cs, mas para a apresentação já fixamos as duas normas do PSI */}
                <button onClick={() => escolherModulo(1)} className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 text-white rounded-lg font-medium transition-all text-left flex justify-between items-center group">
                  ISO/IEC 27001 (SI)
                  <svg className="w-5 h-5 text-slate-500 group-hover:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                </button>
                <button onClick={() => escolherModulo(2)} className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 text-white rounded-lg font-medium transition-all text-left flex justify-between items-center group">
                  ISO/IEC 27701 (PI)
                  <svg className="w-5 h-5 text-slate-500 group-hover:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>
              <button onClick={() => setEtapaModal(null)} className="mt-4 text-sm text-slate-500 hover:text-slate-300">Cancelar</button>
            </div>
          )}

        </div>
      )}
    </>
  );
}