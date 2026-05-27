# Guia de Usuário - CyberSec

## Passo a Passo de Utilização do Sistema CyberSec

### Passo 1 — Acessar o Dashboard Inicial
<img width="1280" height="720" alt="1" src="./imagens/dashboard-inicial.png" />

Ao acessar o sistema, o usuário será direcionado para o dashboard inicial. Nesta tela serão exibidas informações gerais sobre as auditorias realizadas no sistema, incluindo:

- Total de auditorias cadastradas;
- Total de empresas cadastradas;
- Quantidade de auditorias ISO/IEC 27001;
- Quantidade de auditorias ISO/IEC 27701.

Logo abaixo, será apresentada uma tabela contendo as cinco auditorias mais recentes, considerando as datas mais próximas da data atual.

No canto superior direito estará disponível o perfil do auditor autenticado e, abaixo dele, o botão para iniciar uma nova auditoria.

No lado esquerdo da tela estará localizado o menu lateral de navegação do sistema.

---

### Passo 2 — Iniciar uma Nova Auditoria

<img width="1280" height="720" alt="4" src="./imagens/nova-auditoria-01.png" />

<img width="1280" height="720" alt="6" src="./imagens/nova-auditoria-02.png" />


Ao clicar no botão **"Nova Auditoria"**, o sistema abrirá uma tela para:

- Cadastro da empresa;
- Seleção do módulo da auditoria desejada.

Os módulos disponíveis são:

- ISO/IEC 27001;
- ISO/IEC 27701.

---

### Passo 3 — Cadastrar uma Empresa

Na aba **Empresas**, o usuário poderá visualizar todas as empresas cadastradas e auditadas no sistema.

<img width="1280" height="720" alt="2" src="./imagens/cadastrar-empresa.png" />


Assim como no dashboard, também existe um botão para cadastrar uma nova empresa.

Após salvar a empresa cadastrada, o sistema perguntará ao usuário se deseja iniciar imediatamente uma auditoria. Conforme a imagem: 

<img width="1280" height="720" alt="5" src="./imagens/iniciar-auditoria.png" />

---

### Passo 4 — Selecionar a Norma da Auditoria

Após confirmar o início da auditoria, o sistema apresentará a norma selecionada para auditoria e iniciará automaticamente a sequência de perguntas relacionadas aos controles.

Caso o usuário retorne ao dashboard e clique novamente em **"Auditoria"**, o sistema exibirá uma caixa de diálogo simplificada solicitando apenas a seleção do módulo desejado.

<img width="1280" height="720" alt="8" src="./imagens/selecionar-norma.png" />

---

### Passo 5 — Selecionar uma Empresa

<img width="1280" height="720" alt="3" src="./imagens/selecionar-empresa.png" />

Ao clicar em uma empresa na página de empresas:

- O menu lateral será expandido;
- Serão exibidos os registros de auditorias relacionadas à empresa selecionada;
- A barra superior esquerda exibirá o nome da empresa atualmente selecionada.

---

### Passo 6 — Responder às Perguntas da Auditoria

<img width="1280" height="720" alt="9" src="./imagens/perguntas-auditoria-01.png" />


Na tela de perguntas da auditoria, o sistema apresentará:

- Uma barra de progresso;
- Total de perguntas;
- Pergunta atual;
- Percentual de progresso da auditoria.

Abaixo da barra serão exibidos:

- O módulo da auditoria;
- O controle correspondente;
- A pergunta da auditoria.

Em seguida, serão apresentadas as possíveis respostas:

<img width="1280" height="720" alt="10" src="./imagens/perguntas-auditoria-02.png" />


- Conforme;
- Não Implementado (Não Conforme);
- Em Andamento;
- Não se Aplica.

A tela também disponibiliza:

- Botão para voltar à pergunta anterior;
- Botão para cancelar a auditoria.

---

### Passo 7 — Acessar os Relatórios

<img width="1280" height="720" alt="3" src="./imagens/acessar-relatorios.png" />


Para acessar os relatórios, é necessário possuir uma empresa selecionada.

Após selecionar uma empresa, o menu lateral disponibilizará os módulos auditados para acesso aos relatórios.

Ao acessar um relatório, a página apresentará:

<img width="1280" height="720" alt="11" src="./imagens/relatorio-01.png" />


- Nome do módulo;
- Botão para gerar relatório em PDF;
- Botão para selecionar auditorias anteriores.

As auditorias serão identificadas pela data de realização, sendo carregada inicialmente a auditoria cuja data seja a mais próxima da atual.

---

### Passo 8 — Visualizar Informações do Relatório

<img width="1280" height="720" alt="14" src="./imagens/relatorio-02.png" />

Na tela do relatório serão exibidas informações como:

- Melhor score obtido no módulo;
- Data da melhor auditoria;
- Nome do auditor responsável;
- Score da auditoria selecionada;
- Data da auditoria selecionada;
- Auditor responsável pela auditoria atual.

Ao lado dessas informações será exibido um gráfico de evolução em curva, responsável por demonstrar a evolução da conformidade utilizando as quatro auditorias mais recentes.

<img width="1280" height="720" alt="12" src="./imagens/relatorio-evolucao.png" />

Caso exista apenas uma auditoria cadastrada, o sistema exibirá uma mensagem informando que não há dados suficientes para comparação.

---

### Passo 9 — Visualizar os Gráficos Estatísticos

<img width="1280" height="720" alt="13" src="./imagens/graficos-estatisticos.png" />

Logo abaixo serão exibidos gráficos estatísticos contendo os resultados da auditoria:

### Gráfico de Barras

Apresenta a quantidade de respostas por categoria. Ao passar o mouse sobre o gráfico, o sistema exibirá o número exato de respostas.

### Gráfico de Evolução

Apresenta o nível de evolução entre auditorias. Ao posicionar o cursor sobre os pontos do gráfico, o sistema mostrará os valores detalhados.

### Gráfico de Pizza

Exibe a porcentagem das respostas de acordo com suas respectivas categorias e cores.

---

### Passo 10 — Visualizar os Controles e Respostas

<img width="1280" height="720" alt="15" src="./imagens/controles-respostas-01.png" />


Na parte inferior da página serão exibidos os controles auditados juntamente com sua porcentagem de conformidade.

Ao clicar sobre um controle, o sistema expandirá automaticamente as informações, exibindo:

- Perguntas relacionadas ao controle;
- Respostas registradas;
- Informações detalhadas da auditoria.

Também estarão disponíveis botões de agrupamento para filtrar as respostas por categoria:

<img width="1280" height="720" alt="16" src="./imagens/controles-respostas-02.png" />

<img width="1280" height="720" alt="17" src="./imagens/controles-respostas-03.png" />

- Conformes;
- Não Conformes;
- Em Andamento.

---

### Passo 11 — Gerar Relatório em PDF

Para gerar corretamente o relatório em PDF, o filtro agrupado deverá estar selecionado.

O relatório gerado conterá:

- Nome da empresa;
- Módulo auditado;
- Data da auditoria;
- Nome do auditor responsável;
- Melhor nota geral;
- Nota atual da auditoria selecionada.

Além disso, o PDF apresentará:

- Gráfico de evolução;
- Gráfico de barras;
- Gráfico de pizza;
- Listagem de controles com suas notas;
- Tabela contendo todas as perguntas e respostas detalhadas da auditoria.

Autores: Sthefanie Nicole de Souza Silva - Acadêmica CST em Redes de Computadores
