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

## Resumo dos Fluxos

| Caso de Uso | Início | Fim |
|------------|--------|-----|
| Auditoria de Conformidade | Usuário Autenticado | Auditoria Registrada com Gráficos |
| Dashboard e Relatórios | Auditorias Cadastradas | Relatório Processado |

---

## Atores Identificados
- **Usuário**: Realiza auditorias e visualiza dashboards
- **Sistema**: Processa dados, gera gráficos e armazena informações

## Elementos Críticos dos Fluxos
1. **Autenticação**: Obrigatória para auditoria
2. **Validação**: Cada seleção é validada antes do prosseguimento
3. **Armazenamento**: Dados persistidos após conclusão
4. **Geração de Relatórios**: Dinâmica baseada na seleção do usuário
