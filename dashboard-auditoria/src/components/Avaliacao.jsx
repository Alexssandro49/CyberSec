import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'; // ✅ CORRIGIDO: Importado o useOutletContext
import { apiFetch } from '../services/apiService';

export default function Avaliacao() {
  const { id_empresa, id_modulo } = useParams();
  const navigate = useNavigate();
  const { recarregarModulos } = useOutletContext(); // ✅ Agora funcionará perfeitamente
  const [perguntas, setPerguntas] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [respostas, setRespostas] = useState({});

  const cacheKey = `auditoria_progresso_empresa_${id_empresa}_modulo_${id_modulo}`;

  useEffect(() => {
    const buscarPerguntas = async () => {
      try {
        // ✅ Perfeito: Busca totalmente dinâmica baseada no ID real do banco, sem travar no valor 1
        const resposta = await apiFetch(`/Perguntas/Modulo/${id_modulo}`);
        if (resposta.ok) {
          setPerguntas(await resposta.json());
        } else {
          throw new Error();
        }
      } catch (error) {
        // ====================================================================
        // FALLBACK LOCAL: Em caso de falha de conexão com a API
        // ====================================================================
        const dadosSimulados = [
          {
            id: 1,
            nome: "Políticas de segurança da informação",
            descricao: "Tem o controle preventivo de definição, aprovação e revisão das diretrizes de segurança da informação e suas políticas específicas?",
            controle: { nome: "Controle A.5.1", categoria: "Organizacionais" }
          },
          {
            id: 2,
            nome: "Papéis e responsabilidades pela segurança",
            descricao: "Estão definidos e atribuídos todos os papéis e responsabilidades de segurança da informação de acordo com as necessidades da organização?",
            controle: { nome: "Controle A.5.3", categoria: "Organizacionais" }
          }
        ];
        setPerguntas(dadosSimulados);

        // Restaurar progresso do cache se existir
        const cacheSalvo = localStorage.getItem(cacheKey);
        if (cacheSalvo) {
          const dadosCache = JSON.parse(cacheSalvo);
          setRespostas(dadosCache.respostas);
          setIndiceAtual(dadosCache.indiceAtual);
        }
      } finally {
        setCarregando(false);
      }
    };

    buscarPerguntas();
  }, [id_modulo, id_empresa, cacheKey]);

  const registrarResposta = (tipoResposta) => {
    const perguntaAtual = perguntas[indiceAtual];
    
    const novasRespostas = {
      ...respostas,
      [perguntaAtual.id]: tipoResposta
    };
    
    setRespostas(novasRespostas);

    if (indiceAtual < perguntas.length - 1) {
      const proximoIndice = indiceAtual + 1;
      setIndiceAtual(proximoIndice);

      localStorage.setItem(cacheKey, JSON.stringify({
        respostas: novasRespostas,
        indiceAtual: proximoIndice
      }));
    } else {
      finalizarAuditoria(novasRespostas);
    }
  };

  const finalizarAuditoria = async (respostasFinais) => {
    const arrayRespostas = Object.keys(respostasFinais).map((perguntaId) => ({
      PerguntaId: parseInt(perguntaId),
      Resposta: respostasFinais[perguntaId]
    }));

    const usuarioString = localStorage.getItem('usuario');
    const usuarioId = usuarioString ? JSON.parse(usuarioString).id : 1;

    const payload = {
      UsuarioId: usuarioId,
      EmpresaId: parseInt(id_empresa), // Ajuste se no back estiver EmpresaId ou CompanyId
      Respostas: arrayRespostas
    };

    try {
      setCarregando(true); 
      const resposta = await apiFetch('/Auditorias', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

      if (resposta.ok) {
        alert("Auditoria finalizada e salva com sucesso!");
        localStorage.removeItem(cacheKey);
        
        if (recarregarModulos) {
          recarregarModulos();
        }
        
        navigate('/Relatorio');
      } else {
        alert("Erro ao salvar as respostas.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com a API.");
    } finally {
      setCarregando(false);
    }
  };

  const voltarPergunta = () => {
    if (indiceAtual > 0) {
      const indiceAnterior = indiceAtual - 1;
      setIndiceAtual(indiceAnterior);
      localStorage.setItem(cacheKey, JSON.stringify({
        respostas: respostas,
        indiceAtual: indiceAnterior
      }));
    }
  };

  const cancelarAuditoria = () => {
    if(window.confirm("Deseja interromper o diagnóstico? Seu progresso atual nesta sessão será descartado.")) {
      localStorage.removeItem(cacheKey);
      navigate('/dashboard');
    }
  };
  
  if (carregando) return <div className="p-10 text-white text-center">Processando dados do questionário...</div>;
  if (perguntas.length === 0) return <div className="p-10 text-white text-center">Nenhum controle mapeado neste módulo.</div>;

  const perguntaAtual = perguntas[indiceAtual];
  const progresso = ((indiceAtual + 1) / perguntas.length) * 100;

  return (
    <div className="max-w-4xl mx-auto py-6 animate-fade-in text-slate-300">
      
      {/* BARRA DE PROGRESSO */}
      <div className="mb-7">
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-indigo-400 font-semibold uppercase tracking-wider text-sm">Progresso do Diagnóstico</h2>
          <span className="text-slate-400 text-sm font-medium">{indiceAtual + 1} de {perguntas.length} Controles</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2.5">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progresso}%` }}></div>
        </div>
      </div>

      {/* FAMÍLIA E IDENTIFICAÇÃO DO CONTROLE */}
      <div className="mb-6 flex items-center gap-4">
        <h3 className="text-2xl font-extrabold text-indigo-400">
          {perguntaAtual.controle?.nome}
        </h3>
        <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-4 py-1.5 rounded-full text-sml font-bold tracking-wide">
          {perguntaAtual.controle?.controle || "Geral"}
        </span>
      </div>

      {/* ==================================================================== */}
      {/* NOVO BLOCO: TÍTULO DA PERGUNTA + DESCRIÇÃO EXPLICATIVA SEPARADOS */}
      {/* ==================================================================== */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight tracking-tight">
          {perguntaAtual.nome || "Amostra Operacional"}
        </h1>
        <p className="text-base sm:text-lg text-slate-400 font-medium leading-relaxed max-w-3xl">
          {perguntaAtual.descricao}
        </p>
      </div>
      {/* ==================================================================== */}

      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-4">Selecione o estado atual:</p>

      {/* BOTÕES DE RESPOSTA */}
      <div className="space-y-4">
        {/* Opção: Conforme (Sim - 0) */}
        <button onClick={() => registrarResposta(0)} className="w-full bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 p-5 rounded-xl flex items-center gap-5 transition-all group text-left">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-white mb-1">Conforme</h4>
            <p className="text-sm text-slate-400">O controle atende plenamente e está em conformidade com as diretrizes.</p>
          </div>
        </button>

        {/* Bloco: Não Conforme */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-5">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Não Conforme</h4>
              <p className="text-sm text-slate-400">O controle possui lacunas ou não foi adotado.</p>
            </div>
          </div>
          <div className="flex gap-4 pt-2">
            <button onClick={() => registrarResposta(3)} className="flex-1 border border-amber-500/30 hover:border-amber-500 text-amber-500 font-medium py-3 px-4 rounded-lg transition-colors bg-amber-500/5 hover:bg-amber-500/10">
              Em Trabalho / Andamento
            </button>
            <button onClick={() => registrarResposta(1)} className="flex-1 border border-rose-500/30 hover:border-rose-500 text-rose-500 font-medium py-3 px-4 rounded-lg transition-colors bg-rose-500/5 hover:bg-rose-500/10">
              Não Implementado
            </button>
          </div>
        </div>

        {/* Opção: Não se Aplica (2) */}
        <button onClick={() => registrarResposta(2)} className="w-full bg-slate-900 border border-slate-800 hover:border-slate-600 hover:bg-slate-800 p-5 rounded-xl flex items-center gap-5 transition-all group text-left">
          <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-slate-700 transition-colors">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-white mb-1">Não se Aplica</h4>
            <p className="text-sm text-slate-400">Este requisito está fora do escopo ou estrutura jurídica da empresa.</p>
          </div>
        </button>
      </div>

      {/* RODAPÉ DE NAVEGAÇÃO */}
      <div className="mt-10 flex justify-between items-center border-t border-slate-800 pt-6">
        <button 
          onClick={voltarPergunta}
          disabled={indiceAtual === 0}
          className={`flex items-center gap-2 font-medium ${indiceAtual === 0 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white transition-colors'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
          Voltar Controle
        </button>

        <button onClick={cancelarAuditoria} className="text-slate-500 hover:text-rose-400 text-sm font-medium transition-colors">
          Cancelar Diagnóstico
        </button>
      </div>

    </div>
  );
}