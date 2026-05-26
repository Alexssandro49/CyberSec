# Fluxogramas dos Casos de Uso - Sistema CyberSec

## Caso de Uso 1: Realizar Auditoria de Conformidade

```mermaid
flowchart TD
    A[Usuário Autenticado] --> B{Acessar Módulo de Auditoria}
    B -->|Sucesso| C[Sistema Exibe Módulo de Auditoria]
    B -->|Falha| A
    
    C --> D[Selecionar Norma]
    D --> E{Qual Norma?}
    E -->|ISO/IEC 27001| F[Norma Selecionada: 27001]
    E -->|ISO/IEC 27701| G[Norma Selecionada: 27701]
    
    F --> H[Sistema Solicita Nome da Empresa]
    G --> H
    
    H --> I[Usuário Insere Nome da Empresa]
    I --> J[Sistema Carrega Controles da Auditoria]
    
    J --> K[Usuário Avalia Cada Controle]
    K --> L{Selecionar Status}
    L -->|Conforme| M[Marcado como Conforme]
    L -->|Não Conforme| N[Marcado como Não Conforme]
    L -->|Não se Aplica| O[Marcado como Não se Aplica]
    
    M --> P{Mais Controles?}
    N --> P
    O --> P
    
    P -->|Sim| K
    P -->|Não| Q[Auditoria Concluída]
    
    Q --> R[Sistema Armazena Dados e Data da Auditoria]
    R --> S[Gera Dashboards e Gráficos de Conformidade]
    
    S --> T[Sistema Agrupa Resultados por Tipos de Controle]
    T --> U[Apresenta Gráficos ao Usuário]
    U --> V[Fim: Auditoria Registrada com Sucesso]
```

---

## Caso de Uso 2: Visualizar Dashboard e Relatórios

```mermaid
flowchart TD
    A[Auditorias Cadastradas no Sistema] --> B{Usuário Acessa Dashboard}
    B -->|Sucesso| C[Sistema Carrega Dados das Auditorias]
    B -->|Falha| A
    
    C --> D[Sistema Apresenta Gráficos de Conformidade]
    D --> E[Gráficos Agrupados por Tipos de Controle]
    
    E --> F[Sistema Apresenta Gráfico Geral de Conformidade]
    F --> G[Dashboard Exibido Completo]
    
    G --> H{Usuário Seleciona?}
    H -->|Auditoria Anterior| I[Usuário Escolhe Auditoria para Comparação]
    H -->|Tipo de Relatório| K[Usuário Seleciona Tipo de Relatório]
    H -->|Visualizar| M[Continua Visualizando Dashboard]
    
    I --> J[Sistema Recupera Últimas 3 Auditorias]
    J --> L[Exibe Dados Comparativos]
    L --> H
    
    K --> N{Qual Tipo?}
    N -->|Relatório Completo| O[Sistema Gera Relatório Completo]
    N -->|Relatório Parcial| P[Sistema Gera Relatório Parcial]
    
    O --> Q[Relatório Disponível para Download/Visualização]
    P --> Q
    
    Q --> R[Usuário Visualiza Relatório]
    R --> S{Continuar?}
    S -->|Sim| H
    S -->|Não| T[Fim: Relatório Processado]
    
    M --> U{Continuar Navegando?}
    U -->|Sim| H
    U -->|Não| T
```

---

## Caso de Uso 3: Pesquisar Solução de Problemas

```mermaid
flowchart TD
    A[Usuário Acessa Sistema] --> B[Sistema Exibe Página de Pesquisa]
    B --> C[Usuário Acessa Barra de Pesquisa]
    
    C --> D[Usuário Insere Problema/Palavra-chave]
    D --> E{Sistema Processa Busca}
    
    E -->|Resultados Encontrados| F[Sistema Apresenta Tela com Soluções]
    E -->|Sem Resultados| G[Sistema Exibe Mensagem: Nenhum Resultado]
    
    G --> H{Tentar Novamente?}
    H -->|Sim| C
    H -->|Não| I[Fim: Sem Solução Encontrada]
    
    F --> J[Sistema Lista Problemas Similares]
    J --> K[Cada Item Exibe: Descrição + Tipo de Solução]
    
    K --> L{Usuário Seleciona Item}
    L -->|Problema| M[Sistema Exibe Detalhes do Problema]
    L -->|Solução| N[Sistema Exibe Descrição da Solução]
    
    M --> O[Sistema Apresenta Recursos Disponíveis]
    N --> O
    
    O --> P{Qual Recurso?}
    P -->|Vídeo Aula| Q[Sistema Exibe Vídeo Aula]
    P -->|Relatório| R[Sistema Exibe Relatório Detalhado]
    P -->|Ambos| S[Sistema Exibe Vídeo Aula e Relatório]
    
    Q --> T[Usuário Visualiza Conteúdo]
    R --> T
    S --> T
    
    T --> U{Conteúdo Útil?}
    U -->|Sim| V[Problema Resolvido]
    U -->|Não| W{Pesquisar Novamente?}
    
    W -->|Sim| C
    W -->|Não| I
    
    V --> X[Fim: Solução Apresentada com Sucesso]
```

---

## Resumo dos Fluxos

| Caso de Uso | Início | Fim |
|------------|--------|-----|
| Auditoria de Conformidade | Usuário Autenticado | Auditoria Registrada com Gráficos |
| Dashboard e Relatórios | Auditorias Cadastradas | Relatório Processado |
| Pesquisa de Soluções | Usuário no Sistema | Solução Apresentada ou Nova Busca |

---

## Atores Identificados
- **Usuário**: Realiza auditorias, visualiza dashboards e pesquisa soluções
- **Sistema**: Processa dados, gera gráficos, armazena informações e recupera soluções

## Elementos Críticos dos Fluxos
1. **Autenticação**: Obrigatória para auditoria
2. **Validação**: Cada seleção é validada antes do prosseguimento
3. **Armazenamento**: Dados persistidos após conclusão
4. **Geração de Relatórios**: Dinâmica baseada na seleção do usuário
5. **Tratamento de Erros**: Loops para tentar novamente em caso de falha
