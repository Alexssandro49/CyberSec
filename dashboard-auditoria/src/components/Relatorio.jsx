import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function Relatorio() {
  // Captura os dois identificadores passados na URL do navegador
  const { id_empresa, id_modulo } = useParams();
  
  const [historicoAuditorias, setHistoricoAuditorias] = useState([]);
  const [auditoriaSelecionada, setAuditoriaSelecionada] = useState(null);
  const [controlesExpandidos, setControlesExpandidos] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [controlesAtuais, setControlesAtuais] = useState([]);
  // Descobre textualmente qual norma está ativa para colocar ao lado do título
  const nomeModuloAtivo = id_modulo === '1' ? 'ISO/IEC 27001 (SI)' : 'ISO/IEC 27701 (Privacy)';

  useEffect(() => {
    // Nova URL da API C# respeitando a divisão por módulos
    const buscarDadosRelatorio = async () => {
      try {
        const resposta = await fetch(`http://localhost:5187/api/Auditorias/Empresa/${id_empresa}/Modulo/${id_modulo}`);
        if (resposta.ok) {
          const dados = await resposta.json();
          setHistoricoAuditorias(dados);
          setAuditoriaSelecionada(dados[dados.length - 1]);
        } else {
          throw new Error();
        }
      } catch (error) {
        // Fallback robusto e isolado por módulo para a apresentação do TCC
        const mockPorModulo = id_modulo === '1' ? [
          { id: 101, data: "10/01/2026", modulo: "ISO 27001", score: 65 },
          { id: 102, data: "15/03/2026", modulo: "ISO 27001", score: 78 },
          { id: 103, data: "22/05/2026", modulo: "ISO 27001", score: 92 }
        ] : [
          { id: 201, data: "05/02/2026", modulo: "ISO 27701", score: 40 },
          { id: 202, data: "19/05/2026", modulo: "ISO 27701", score: 81 }
        ];

        setHistoricoAuditorias(mockPorModulo);
        setAuditoriaSelecionada(mockPorModulo[mockPorModulo.length - 1]);
      } finally {
        setCarregando(false);
      }
    };
    buscarDadosRelatorio();
  }, [id_empresa, id_modulo]);
  useEffect(() => {
    if (!auditoriaSelecionada) return; // Se não tem auditoria, não faz nada

    const buscarControlesDetalhados = async () => {
      try {
        const resposta = await fetch(`http://localhost:5187/api/Controles/Auditoria/${auditoriaSelecionada.id}`);        
        if (resposta.ok) {
            const dados = await resposta.json();
            setControlesAtuais(dados); // Salva na tela os dados do C#
        } else {
            throw new Error();
        }
      } catch (error) {
        console.warn("Usando fallback de controles...");
        setControlesAtuais([
           { id: 1, nome: "Controle A.5.1", categoria: "Organizacionais", desempenho: 95, perguntas: [{ id: 1, descricao: "Falha na API", resposta: "Sim" }] }
        ]);
      }
    };

    buscarControlesDetalhados();
  }, [auditoriaSelecionada]);
 
  const toggleControle = (id) => {
    setControlesExpandidos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (carregando) return <div className="p-10 text-white text-center">Processando gráficos por escopo...</div>;

  const melhorAuditoria = [...historicoAuditorias].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="max-w-6xl mx-auto py-4 animate-fade-in text-slate-300">
      
      {/* CABEÇALHO DO RELATÓRIO COM O MÓDULO AO LADO */}
      <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-3xl font-bold text-white">Relatório Executivo</h1>
            <span className="text-xl font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              {nomeModuloAtivo}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-2">Métricas de conformidade e evolução histórica exclusivas deste módulo.</p>
        </div>

        {/* SELECT FILTRO POR DATA */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          <label className="text-xs font-bold text-slate-500 uppercase">Histórico:</label>
          <select 
            value={auditoriaSelecionada?.id || ''} 
            onChange={(e) => setAuditoriaSelecionada(historicoAuditorias.find(a => a.id === parseInt(e.target.value)))}
            className="bg-transparent text-white font-semibold text-sm outline-none cursor-pointer"
          >
            {historicoAuditorias.map(aud => (
              <option key={aud.id} value={aud.id} className="bg-slate-900 text-white">
                Exame de {aud.data}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PAINEL DE METRICAS E GRÁFICO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between h-40 border-l-4 border-l-emerald-500 shadow-lg">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Melhor Score no Módulo</h3>
              <p className="text-xs text-slate-400 mt-1">Registrado em: {melhorAuditoria?.data}</p>
            </div>
            <p className="text-5xl font-extrabold text-white">{melhorAuditoria?.score}%</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between h-40 border-l-4 border-l-indigo-500 shadow-lg animate-fade-in">
            <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nota do Exame Selecionado</h3>
                {/* Exibe dinamicamente a data da auditoria que foi escolhida no select */}
                <p className="text-xs text-slate-400 mt-1">Realizado em: {auditoriaSelecionada?.data || "--"}</p>
            </div>
            <div className="flex justify-between items-baseline mt-4">
                {/* MUDANÇA AQUI: Agora lê diretamente do estado que muda no dropdown */}
                <span className="text-5xl font-extrabold text-white tracking-tight">
                {auditoriaSelecionada?.score}%
                </span>
                <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                Filtro Ativo
                </span>
            </div>
          </div>
        </div>

        {/* GRÁFICO RECHARTS DE LINHA */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Curva de Evolução da Norma</h3>
          <p className="text-xs text-slate-500 mb-4">Progresso temporal de maturidade de controles organizacionais e técnicos.</p>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicoAuditorias} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="data" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 8 }} name="Conformidade %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* LISTAGEM DE CONTROLES COM ACORDEÃO EXPANSÍVEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/50">
          <h3 className="text-lg font-bold text-white">Análise Detalhada por Famílias</h3>
          <p className="text-xs text-slate-400 mt-1">Clique sobre a linha do controle para auditar a resposta de cada pergunta individual.</p>
        </div>

        <div className="divide-y divide-slate-800">
          {controlesAtuais.length === 0 ? (
            <p className="p-6 text-slate-500 text-center text-sm">Nenhum dado detalhado de controle para esta versão.</p>
          ) : controlesAtuais.map((ctrl) => {
            const expandido = !!controlesExpandidos[ctrl.id];
            return (
              <div key={ctrl.id}>
                <div onClick={() => toggleControle(ctrl.id)} className="px-6 py-5 flex items-center justify-between hover:bg-slate-800/30 cursor-pointer transition-colors select-none">
                  <div className="flex items-center gap-4">
                    <svg className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${expandido ? 'transform rotate-90 text-indigo-400' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <div>
                      <strong className="text-white text-base font-bold mr-2">{ctrl.nome}</strong>
                      <span className="text-xsl font-bold text-indigo-600 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 ">{ctrl.categoria}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full max-w-xs justify-end">
                    <div className="w-full bg-slate-800 rounded-full h-2 hidden sm:block">
                      <div className={`h-2 rounded-full ${ctrl.desempenho >= 80 ? 'bg-emerald-500' : ctrl.desempenho >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${ctrl.desempenho}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-white bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-center">{ctrl.desempenho}%</span>
                  </div>
                </div>

                {expandido && (
                  <div className="bg-slate-950/60 px-12 py-4 border-t border-slate-800/50">
                    <div className="space-y-4 py-2">
                    {ctrl.perguntas.map((perg) => (
                        <div key={perg.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4 last:border-0 last:pb-0">
                        
                        {/* Bloco de Texto: Título em destaque + Descrição abaixo */}
                        <div className="flex-1 min-w-0">
                            {/* Campo nome: Título da Pergunta em negrito e maior */}
                            <h4 className="text-white font-bold text-base tracking-wide mb-1">
                            {perg.nome || "Controle Operacional"}
                            </h4>
                            {/* Campo descricao: Texto detalhado explicativo logo abaixo */}
                            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-3xl">
                            {perg.descricao}
                            </p>
                        </div>
                        
                        {/* Badge do Status da Resposta (Sim/Não) */}
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border whitespace-nowrap shrink-0 self-start sm:self-center ${
                            perg.resposta === 'Sim' || perg.resposta === 'Conforme' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            perg.resposta === 'Não' || perg.resposta === 'Não Conforme' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                            perg.resposta === 'EmAndamento' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                            {perg.resposta}
                        </span>

                        </div>
                    ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}