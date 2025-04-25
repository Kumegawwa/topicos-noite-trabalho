# Tópicos Noite Trabalho

Este repositório contém o projeto desenvolvido para a disciplina de Tópicos Especiais. O projeto é composto por um back-end em .NET e um front-end em Node.js.

## Link do Repositório
[https://github.com/Kumegawwa/topicos-noite-trabalho](https://github.com/Kumegawwa/topicos-noite-trabalho)

## Pré-requisitos
Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:
- [.NET SDK](https://dotnet.microsoft.com/download) (versão 6.0 ou superior)
- [Node.js](https://nodejs.org/) (versão 16.x ou superior)
- [npm](https://www.npmjs.com/) (geralmente incluído com o Node.js)
- Um banco de dados configurado (ex.: SQL Server, PostgreSQL, ou outro compatível com o projeto)
- [Git](https://git-scm.com/) para clonar o repositório

## Instalação

### 1. Clonar o repositório
```bash
git clone https://github.com/Kumegawwa/topicos-noite-trabalho.git
cd topicos-noite-trabalho
```

### 2. Instalar .NET
- Baixe e instale o .NET SDK a partir do [site oficial](https://dotnet.microsoft.com/download).
- Verifique a instalação:
  ```bash
  dotnet --version
  ```

### 3. Instalar Node.js
- Baixe e instale o Node.js a partir do [site oficial](https://nodejs.org/).
- Verifique a instalação:
  ```bash
  node --version
  npm --version
  ```

## Como rodar o back-end
1. Navegue até a pasta do back-end (ex.: `backend`):
   ```bash
   cd backend
   ```
2. Instale as dependências do .NET:
   ```bash
   dotnet restore
   ```
3. Configure a string de conexão com o banco de dados no arquivo `appsettings.json` ou por variáveis de ambiente.
4. Execute o projeto:
   ```bash
   dotnet run
   ```
   O back-end estará disponível em `https://localhost:5001` (ou a porta configurada).

## Como rodar o front-end
1. Navegue até a pasta do front-end (ex.: `frontend`):
   ```bash
   cd frontend
   ```
2. Instale as dependências do Node.js:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
   O front-end estará disponível em `http://localhost:3000` (ou a porta configurada).

## Como rodar migrações
1. Certifique-se de que o back-end está configurado com a string de conexão correta no `appsettings.json`.
2. Navegue até a pasta do projeto back-end:
   ```bash
   cd backend
   ```
3. Execute as migrações usando o Entity Framework:
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```
   Isso criará e atualizará o banco de dados com base nos modelos definidos.

## Observações
- Certifique-se de que as portas utilizadas pelo back-end e front-end não estão em uso.
- Para ambientes de produção, siga as práticas recomendadas para configuração de variáveis de ambiente e segurança.
- Em caso de dúvidas, abra uma issue no repositório.