# 🛠️ Sistema de Chamados - Fatec

Este sistema de chamados foi desenvolvido com o objetivo de **facilitar o gerenciamento de solicitações internas** na Faculdade de Tecnologia (Fatec). Ele permite que os usuários abram, acompanhem e finalizem chamados técnicos ou administrativos, organizando de forma eficiente a comunicação entre solicitantes e responsáveis pelos atendimentos.

## 📌 Funcionalidades

- 📄 Cadastro de chamados com assunto, descrição, categoria e nível de prioridade
- 👨‍💼 Atribuição de chamados a responsáveis
- 🔄 Acompanhamento do status dos chamados (aberto, em andamento, resolvido, etc.)
- 🗂️ Classificação por categoria
- 🔍 Filtro e busca por código, status, categoria, responsável ou palavra-chave
- 📅 Registro de data e hora de abertura
- 📧 Notificação por e-mail para o solicitante
- 🔒 Sistema de login para acesso de usuários autenticados
- 📊 Painel administrativo com visão geral dos chamados

## 🏛️ Público-Alvo

- Funcionários, professores, estudante e técnicos administrativos da Fatec que precisam de suporte interno
- Equipe de TI ou setores responsáveis pelo atendimento dos chamados

## 🧑‍💻 Tecnologias Utilizadas

- **Frontend:** React com JavaScript
- **Backend:** Node.js com Express
- **Banco de Dados:** MySQL
- **ORM:** Sequelize
- **Outros:** JWT para autenticação, REST API

## 🧱 Estrutura do Projeto

- `/frontend`: Aplicação React para interação com os usuários
- `/backend`: API Node.js responsável pelo gerenciamento dos dados

## 📂 Como rodar o projeto localmente

### Pré-requisitos

Antes de iniciar, é necessário ter os seguintes softwares instalados:

- 🐬 **MySQL Workbench**
- 🖥️ **XAMPP** (utilizado para iniciar o servidor MySQL local)
- 🧠 **Node.js** (para rodar backend e frontend)
- 🌐 **Navegador** (Google Chrome recomendado)

### Passos para rodar:

1. **Inicie o MySQL via XAMPP**  
   Abra o painel do XAMPP e inicie o módulo **MySQL**.

2. **Abra o MySQL Workbench**  
   Conecte-se ao seu servidor local.

3. **Importe o banco de dados**  
   No Workbench, importe o arquivo `bd_sistema_chamado_fatec.sql` para criar as tabelas, views e dados iniciais.

4. **Clone o repositório**

   ```bash
   git clone https://github.com/DanielBrandao12/tarefaTI.git
   cd tarefaTI
5. **Crie um arquivo .env dentro da pasta do backend com o seguinte conteúdo:
      DB_HOST=localhost
      DB_USER=root
      DB_PASS=
      DB_NAME=bd_sistema_chamado_fatec
      DIALECT=mysql
      EMAIL_USER=
      EMAIL_PASSWORD=
      EMAIL_HOST= 
      DOMINIO_HOST=http://localhost:3000

6. **Acesse o backend
      cd backend
      npm install
      npm run dev
7. **Acesse o frontend
    cd ../frontend
    npm install
    npm run dev

✅ Status do Projeto
🚧 Em desenvolvimento contínuo — funcionalidades novas sendo adicionadas conforme as demandas internas.


