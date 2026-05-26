import { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import { 
  ResponsiveContainer, 
  LineChart, Line, 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { apiFetch } from '../services/apiService';

export default function Relatorio() {
  const { id_empresa, id_modulo } = useParams();
  
  const [historicoAuditorias, setHistoricoAuditorias] = useState([]);
  const [auditoriaSelecionada, setAuditoriaSelecionada] = useState(null);
  const [controlesExpandidos, setControlesExpandidos] = useState({});
  const [moduloAtual, setModuloAtual] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [controlesAtuais, setControlesAtuais] = useState([]);
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');

  useEffect(() => {
    const buscarDadosRelatorio = async () => {
      try {
        const resposta = await apiFetch(`/Auditorias/Empresa/${id_empresa}/Modulo/${id_modulo}`);
        if (resposta.ok) {
          const dados = await resposta.json();
          setHistoricoAuditorias(dados);
          setAuditoriaSelecionada(dados[dados.length - 1]);
        } else throw new Error();
      } catch (error) {
        const mockPorModulo = id_modulo === '1' ? [
          { id: 101, data: "10/01/2026", score: 65 },
          { id: 102, data: "15/03/2026", score: 78 },
          { id: 103, data: "22/05/2026", score: 92 }
        ] : [ { id: 202, data: "19/05/2026", score: 81 } ];
        setHistoricoAuditorias(mockPorModulo);
        setAuditoriaSelecionada(mockPorModulo[mockPorModulo.length - 1]);
      } finally {
        setCarregando(false);
      }
    };
    buscarDadosRelatorio();
  }, [id_empresa, id_modulo]);

  useEffect(() => {
    if (!auditoriaSelecionada) return;
    const buscarControlesDetalhados = async () => {
      try {
        const resposta = await apiFetch(`/Controles/Auditoria/${auditoriaSelecionada.id}`);
        if (resposta.ok) setControlesAtuais(await resposta.json());
        else throw new Error();
      } catch (error) {
        const mockControles = id_modulo === '1' ? [
          { 
            id: 1, nome: "Controle A.5.1", categoria: "Organizacionais", desempenho: 95, 
            perguntas: [
              { id: 1, nome: "Políticas de Segurança da Informação", descricao: "As políticas são revisadas?", resposta: "Sim" },
              { id: 2, nome: "Análise Crítica das Políticas", descricao: "Passam por comitê gestor técnico anualmente?", resposta: "Sim" }
            ] 
          },
          { 
            id: 2, nome: "Controle A.8.1", categoria: "Controles Técnicos", desempenho: 50, 
            perguntas: [
              { id: 3, nome: "Inventário de Ativos Tecnológicos", descricao: "A organização possui inventário?", resposta: "Não" },
              { id: 4, nome: "Autenticação Multifator (MFA)", descricao: "O acesso exige duplo fator?", resposta: "EmAndamento" }
            ] 
          }
        ] : [];
        setControlesAtuais(mockControles);
      }
    };
    buscarControlesDetalhados();
  }, [auditoriaSelecionada, id_modulo]);


  useEffect(() => {
    const buscarModulo = async () => {
      try {
        const resposta = await apiFetch(`/Modulos/${id_modulo}`);
        if (resposta.ok) setModuloAtual(await resposta.json());
        else throw new Error();
      } catch (error) {
        // CORREÇÃO 1: O mock deve ser um objeto com 'nome', pois o HTML espera moduloAtual.nome
        const mockModulo = id_modulo === '1' ? { nome: 'ISO/IEC 27001 (SI)' } : { nome: 'ISO/IEC 27701 (Privacy)' };
        setModuloAtual(mockModulo);
      }
    };
    buscarModulo();
  }, [ id_modulo]);

  const processarDadosDistribuicao = () => {
    let sim = 0, nao = 0, emAndamento = 0, na = 0;
    controlesAtuais.forEach(ctrl => {
      ctrl.perguntas.forEach(perg => {
        const resp = perg.resposta ? perg.resposta.trim() : '';
        if (resp === 'Sim' || resp === 'Conforme') sim++;
        else if (resp === 'Não' || resp === 'Não Conforme') nao++;
        else if (resp === 'EmAndamento' || resp === 'Em Trabalho') emAndamento++;
        else na++;
      });
    });
    const total = sim + nao + emAndamento + na;
    return [
      { name: 'Conforme', valor: sim, porcentagem: total > 0 ? Math.round((sim / total) * 100) : 0, color: '#10b981' },
      { name: 'Não Conforme', valor: nao, porcentagem: total > 0 ? Math.round((nao / total) * 100) : 0, color: '#f43f5e' },
      { name: 'Em Andamento', valor: emAndamento, porcentagem: total > 0 ? Math.round((emAndamento / total) * 100) : 0, color: '#f59e0b' },
      { name: 'Não se Aplica', valor: na, porcentagem: total > 0 ? Math.round((na / total) * 100) : 0, color: '#64748b' }
    ];
  };

  const dadosGraficos = processarDadosDistribuicao();
  const toggleControle = (id) => setControlesExpandidos(prev => ({ ...prev, [id]: !prev[id] }));
  const gerarPDF = () => window.print();

  const perguntasFiltradas = controlesAtuais.reduce((acc, ctrl) => {
    const perguntasComControle = ctrl.perguntas.map(p => ({
      ...p, controleNome: ctrl.nome, categoria: ctrl.categoria
    }));
    return [...acc, ...perguntasComControle];
  }, []).filter(perg => {
    if (filtroAtivo === 'Todos') return true;
    const resp = perg.resposta ? perg.resposta.trim() : '';
    if (filtroAtivo === 'Conforme') return resp === 'Sim' || resp === 'Conforme';
    if (filtroAtivo === 'Não Conforme') return resp === 'Não' || resp === 'Não Conforme';
    if (filtroAtivo === 'Em Andamento') return resp === 'EmAndamento' || resp === 'Em Trabalho';
    if (filtroAtivo === 'Não se Aplica') return resp !== 'Sim' && resp !== 'Conforme' && resp !== 'Não' && resp !== 'Não Conforme' && resp !== 'EmAndamento' && resp !== 'Em Trabalho';
    return true;
  });

  if (carregando) return <div className="p-10 text-white text-center">Processando gráficos por escopo...</div>;

  const melhorAuditoria = [...historicoAuditorias].sort((a, b) => b.score - a.score)[0];
  const temMultiplasAuditorias = historicoAuditorias.length > 1;

  return (
    <div className="max-w-6xl mx-auto py-4 animate-fade-in text-slate-300 print:text-slate-900 print:bg-white print:p-0">
      
      {/* ======================================================= */}
      {/* CABEÇALHOS (TELA E PDF) */}
      {/* ======================================================= */}
      <div className="hidden print:block border-b-4 border-indigo-600 pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight">CyberAuditoria</h1>
            <p className="text-xs font-bold text-indigo-600 tracking-widest uppercase mt-0.5">Relatório Técnico de Conformidade</p>
          </div>
          <div className="text-right text-xs font-medium text-slate-500 space-y-1">
            <p>Data de Emissão: {auditoriaSelecionada?.data}</p>
            <p>Status: Documento Oficial</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 bg-slate-100 p-4 rounded-xl border border-slate-200">
          <div><span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Empresa Auditada</span><strong className="text-sm font-bold text-slate-800">{auditoriaSelecionada?.empresa || "Empresa Clientes S/A"}</strong></div>
          <div><span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Módulo / Escopo</span><strong className="text-sm font-bold text-slate-800">{moduloAtual.nome}</strong></div>
          <div><span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Data do Exame</span><strong className="text-sm font-bold text-slate-800">{auditoriaSelecionada?.data}</strong></div>
          <div><span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Auditor Responsável</span><strong className="text-sm font-bold text-slate-800">{auditoriaSelecionada?.auditor}</strong></div>
        </div>
      </div>

      <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800 pb-6 print:hidden">
        <div>
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-3xl font-bold text-white">Relatório Executivo</h1>
            <span className="text-xl font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">{moduloAtual.nome}</span>
          </div>
          <p className="text-sm text-slate-400 mt-2">Métricas de conformidade e evolução histórica exclusivas deste módulo.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={gerarPDF} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Gerar PDF
          </button>
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
            <label className="text-xs font-bold text-slate-500 uppercase">Histórico:</label>
            <select value={auditoriaSelecionada?.id || ''} onChange={(e) => setAuditoriaSelecionada(historicoAuditorias.find(a => a.id === parseInt(e.target.value)))} className="bg-transparent text-white font-semibold text-sm outline-none cursor-pointer">
              {[...historicoAuditorias].reverse().map(aud => <option key={aud.id} value={aud.id} className="bg-slate-900 text-white">Exame de {aud.data}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ======================================================= */}
      {/* GRÁFICOS (COMPARTILHADO TELA E PDF) */}
      {/* ======================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 print:mb-6">
        <div className="flex flex-col gap-6 print:flex-row print:w-full print:col-span-3 print:gap-2 ">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between h-40 border-l-4 border-l-emerald-500 shadow-lg print:bg-slate-50 print:border-slate-200 print:flex-1 print:h-25 print:px-4 print:py-1">
            <div><h3 className="text-xsl font-bold text-slate-500 uppercase tracking-wider">Melhor Score no Módulo</h3><p className="text-[14px] text-slate-400 mt-1 ">Realizado em: {melhorAuditoria?.data} por {melhorAuditoria?.auditor}</p></div>
            <p className="text-5xl font-extrabold text-white print:text-slate-900 print:text-3xl">{melhorAuditoria?.score}%</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between h-40 border-l-4 border-l-indigo-500 shadow-lg print:bg-indigo-50 print:border-indigo-100 print:flex-1 print:h-25 print:px-4 print:py-1">
            <div><h3 className="text-xsl font-bold text-slate-500 uppercase tracking-wider print:text-indigo-900">Nota do Exame Atual</h3><p className="text-[14px] text-slate-400 mt-1 print:text-indigo-600">Realizado em: {auditoriaSelecionada?.data} por {auditoriaSelecionada?.auditor}</p></div>
            <p className="text-5xl font-extrabold text-white print:text-indigo-900 print:text-3xl">{auditoriaSelecionada?.score}%</p>
          </div>
        </div>

        {temMultiplasAuditorias ? (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg print:bg-white print:border-slate-200 print:py-2 print:mb-1 print:h-67 print:col-span-3 print:mt-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 print:text-slate-900">Curva de Evolução da Norma</h3>
            <p className="text-xs text-slate-500 mb-4 print:hidden">Progresso de maturidade dos controles gerais.</p>
            <div className="w-full h-56 print:h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicoAuditorias} margin={{ top: 10, right: 55, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" printStroke="#e2e8f0" />
                  <XAxis dataKey="data" stroke="#64748b" fontSize={12} dy={10} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} name="Conformidade %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-sm p-6 print:hidden">
            Gráfico de evolução gerado automaticamente a partir do segundo diagnóstico.
          </div>
        )}
      </div>

      {/* BARRAS E PIZZA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:gap-4 print:overflow-visible">
        
        {/* GRÁFICO DE BARRAS - Isolado com sua própria regra de quebra */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg print:bg-white print:border-slate-200 print:page-break-inside-avoid print:break-inside-avoid print:h-75 print:py-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 print:text-slate-900">Volume de Respostas por Tipo</h3>
          <p className="text-xs text-slate-500 mb-4 print:hidden">Métricas contadas em valores absolutos de requisitos.</p>
          <div className="w-full h-64 print:h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosGraficos} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="valor">
                  {dadosGraficos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO DE PIZZA - Isolado individualmente! Se não couber na Página 1, ele vai INTEIRO para a Página 2 sem cortar */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg print:bg-white print:border-slate-200 flex flex-col justify-between min-h-[340px] print:h-auto print:page-break-inside-avoid print:break-inside-avoid">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider print:text-slate-900">
              Proporção da Conformidade (%)
            </h3>
          </div>
          <div className="w-full h-64 relative flex items-center justify-center pl-2 pr-2 ">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 30, left: 30, bottom: 25 }}>
                <Pie 
                  data={dadosGraficos} 
                  cx="50%" 
                  cy="40%" // Subiu o centro da pizza levemente para dar espaço para a legenda abaixo
                  innerRadius={40} // Reduzido de 45 para 40 para dar mais margem para os textos externos
                  outerRadius={55} // Reduzido de 65 para 55 para os números fixos não saírem do card
                  paddingAngle={4} 
                  dataKey="porcentagem"
                  // Renderiza a porcentagem por fora com uma fonte limpa
                  label={({ porcentagem }) => porcentagem > 0 ? `${porcentagem}%` : ''} 
                  labelLine={true} 
                >
                  {dadosGraficos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                
                {/* Tooltip para visualização na tela do sistema */}
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Proporção']} 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                
                {/* Legenda reposicionada de forma segura na base */}
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  height={32} 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '15px', paddingTop: '2px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ======================================================= */}
      {/* SESSÃO DA TELA: ACORDEÃO INTERATIVO (Oculto no PDF) */}
      {/* ======================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden print:hidden mb-8">
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Análise Detalhada dos Requisitos</h3>
            <p className="text-xs text-slate-400 mt-1">{filtroAtivo === 'Todos' ? "Agrupado por Família de Controle." : `Filtrado por: ${filtroAtivo}`}</p>
          </div>
          <div className="flex bg-slate-950 p-1.5 rounded-xl overflow-x-auto max-w-full border border-slate-800">
            <button onClick={() => setFiltroAtivo('Todos')} className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${filtroAtivo === 'Todos' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>Agrupado</button>
            <button onClick={() => setFiltroAtivo('Conforme')} className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${filtroAtivo === 'Conforme' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'}`}>Conformes</button>
            <button onClick={() => setFiltroAtivo('Não Conforme')} className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${filtroAtivo === 'Não Conforme' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'}`}>Não Conformes</button>
            <button onClick={() => setFiltroAtivo('Em Andamento')} className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${filtroAtivo === 'Em Andamento' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'}`}>Em Andamento</button>
          </div>
        </div>

        {filtroAtivo === 'Todos' ? (
          <div className="divide-y divide-slate-800">
            {controlesAtuais.map((ctrl) => {
              const expandido = !!controlesExpandidos[ctrl.id];
              return (
                <div key={ctrl.id}>
                  <div onClick={() => toggleControle(ctrl.id)} className="px-6 py-5 flex items-center justify-between hover:bg-slate-800/30 cursor-pointer transition-colors select-none">
                    <div className="flex items-center gap-4">
                      <svg className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${expandido ? 'transform rotate-90 text-indigo-400' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                      <div>
                        <strong className="text-white text-base font-bold mr-2">{ctrl.nome}</strong>
                        <span className="text-xsl font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 ">{ctrl.categoria}</span>
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
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-bold text-sm tracking-wide mb-1">{perg.nome}</h4>
                              <p className="text-xs text-slate-400 font-medium leading-relaxed">{perg.descricao}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold border whitespace-nowrap shrink-0 self-start sm:self-center uppercase tracking-wider ${
                              perg.resposta === 'Sim' || perg.resposta === 'Conforme' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              perg.resposta === 'Não' || perg.resposta === 'Não Conforme' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                              perg.resposta === 'EmAndamento' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                            }`}>{perg.resposta}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  <th className="pb-4 font-bold w-1/3 min-w-[200px]">Família / Controle</th>
                  <th className="pb-4 font-bold min-w-[300px]">Requisito Auditado</th>
                  <th className="pb-4 font-bold text-right w-32 min-w-[120px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {perguntasFiltradas.map((perg, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-5 pr-4 align-top">
                      <strong className="text-white text-sm">{perg.controleNome}</strong>
                      <span className="block text-[10px] font-bold text-indigo-400 uppercase tracking-wider pt-3">{perg.categoria}</span>
                      
                    </td>
                    <td className="py-5 pr-4 align-top">
                      <h4 className="text-white font-bold text-sm tracking-wide mb-1.5">{perg.nome}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{perg.descricao}</p>
                    </td>
                    <td className="py-5 align-top text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider ${
                        perg.resposta === 'Sim' || perg.resposta === 'Conforme' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        perg.resposta === 'Não' || perg.resposta === 'Não Conforme' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        perg.resposta === 'EmAndamento' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>{perg.resposta}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================= */}
      {/* SESSÃO DO PDF: MACRO E MICRO SEPARADOS (Oculto na Tela) */}
      {/* ======================================================= */}
      
      {/* MACRO: RESUMO DE DESEMPENHO DOS CONTROLES */}
      <div className="hidden print:block bg-white border border-slate-200 rounded-xl mb-6 break-inside-avoid">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Desempenho por Famílias de Controles</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {controlesAtuais.map((ctrl) => (
            <div key={`pdf-macro-${ctrl.id}`} className="px-6 py-4 flex flex-row items-center justify-between gap-4 page-break-inside-avoid">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 whitespace-nowrap">{ctrl.categoria}</span>
                <strong className="text-slate-900 text-base font-bold">{ctrl.nome}</strong>
              </div>
              <div className="flex items-center gap-4 w-[250px] justify-end">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${ctrl.desempenho >= 80 ? 'bg-emerald-500' : ctrl.desempenho >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${ctrl.desempenho}%` }}></div>
                </div>
                <span className="text-sm font-bold bg-slate-100 text-slate-900 px-3 py-1 rounded-lg border border-slate-300 font-mono min-w-[55px]">{ctrl.desempenho}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MICRO: TABELA DETALHADA COM AS PERGUNTAS FILTRADAS */}
      <div className="hidden print:block bg-white border border-slate-200 rounded-xl">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Detalhamento dos Requisitos</h3>
          <p className="text-xs text-slate-500 mt-1">{filtroAtivo === 'Todos' ? "Listagem de todas as perguntas aplicadas no exame." : `Exibindo resultados filtrados por: ${filtroAtivo}`}</p>
        </div>
        <div className="p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-xs uppercase tracking-wider text-slate-700">
                <th className="pb-4 font-bold w-1/3">Família / Controle</th>
                <th className="pb-4 font-bold">Requisito Auditado</th>
                <th className="pb-4 font-bold text-right w-32">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {perguntasFiltradas.length === 0 && (
                <tr><td colSpan="3" className="py-8 text-center text-slate-500 font-medium">Nenhum requisito para o filtro.</td></tr>
              )}
              {perguntasFiltradas.map((perg, idx) => (
                <tr key={`pdf-micro-${idx}`} className="page-break-inside-avoid">
                  <td className="py-4 pr-4 align-top">
                    <strong className="text-slate-900 text-sm">{perg.controleNome}</strong>
                    <span className="block text-[10px] font-bold text-indigo-600 pt-1 uppercase tracking-wider">{perg.categoria}</span>
                  </td>
                  <td className="py-4 pr-4 align-top">
                    <h4 className="text-slate-800 font-bold text-sm tracking-wide mb-1">{perg.nome}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{perg.descricao}</p>
                  </td>
                  <td className="py-4 align-top text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider ${
                      perg.resposta === 'Sim' || perg.resposta === 'Conforme' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      perg.resposta === 'Não' || perg.resposta === 'Não Conforme' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      perg.resposta === 'EmAndamento' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>{perg.resposta}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          html, body, #root { height: auto !important; min-height: auto !important; overflow: visible !important; background-color: #ffffff !important; color: #0f172a !important; }
          .print\\:hidden { display: none !important; }
          .page-break-inside-avoid { page-break-inside: avoid !important; break-inside: avoid !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}} />
    </div>
  );
}