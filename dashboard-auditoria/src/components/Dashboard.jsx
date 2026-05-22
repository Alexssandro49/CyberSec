export default function Dashboard() {
  const ultimasAuditorias = [
    { id: 1, empresa: 'TechCorp Solutions', norma: 'ISO 27001', data: '22/05/2026', status: 'Concluído', score: '92%' },
    { id: 2, empresa: 'FinHealth S.A.', norma: 'ISO 27701', data: '20/05/2026', status: 'Em Andamento', score: '--' },
  ];

  return (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Visão Geral</h1>
          <p className="text-sm text-slate-400 mt-1">Diagnóstico de Conformidade ISO 27001 & 27701</p>
        </div>
        
        {/* Botão idêntico ao da sua imagem */}
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-5 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all flex items-center gap-2">
          Nova Auditoria
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Cartão Dark 1 */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm border-l-4 border-l-indigo-500">
            <h3 className="text-sm font-medium text-slate-400 mb-1">Índice Médio de Conformidade</h3>
            <p className="text-3xl font-bold text-white">85%</p>
            <p className="text-xs text-emerald-400 mt-2 font-medium">↑ 4% desde a última avaliação</p>
        </div>

        {/* Cartão Dark 2 */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm border-l-4 border-l-amber-500">
            <h3 className="text-sm font-medium text-slate-400 mb-1">Auditorias em Andamento</h3>
            <p className="text-3xl font-bold text-white">3</p>
            <p className="text-xs text-slate-500 mt-2">Módulos pendentes de revisão</p>
        </div>

        {/* Cartão Dark 3 */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm border-l-4 border-l-rose-500">
            <h3 className="text-sm font-medium text-slate-400 mb-1">Não Conformidades Críticas</h3>
            <p className="text-3xl font-bold text-white">12</p>
            <p className="text-xs text-rose-400 mt-2 font-medium">Atenção requerida nos controles</p>
        </div>
      </div>

      {/* Tabela Dark */}
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
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {ultimasAuditorias.map((auditoria) => (
                <tr key={auditoria.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{auditoria.empresa}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {auditoria.norma}
                    </span>
                  </td>
                  <td className="px-6 py-4">{auditoria.data}</td>
                  <td className="px-6 py-4 text-slate-300">{auditoria.status}</td>
                  <td className="px-6 py-4 text-right font-bold text-white">{auditoria.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}