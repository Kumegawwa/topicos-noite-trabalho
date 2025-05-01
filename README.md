# Tópicos Especiais - Gerenciador Escolar (API + React)

Este repositório contém o projeto desenvolvido para a disciplina de **Tópicos Especiais de Sistemas**. Trata-se de uma aplicação web simples de **gerenciamento escolar**, composta por uma **Web API mínima em C#/.NET 8** com **SQLite** e um front-end moderno utilizando **React com TypeScript**.

## 🎯 Objetivo

Construir uma aplicação web full-stack aplicando conceitos de arquitetura RESTful, boas práticas de código, versionamento com Git e uso de banco de dados relacional com Entity Framework.

## 📁 Link do Repositório

[https://github.com/Kumegawwa/topicos-noite-trabalho](https://github.com/Kumegawwa/topicos-noite-trabalho)

---

## 🧰 Tecnologias Utilizadas

- **Back-end:** C# / .NET 8 (API Mínima), Entity Framework Core
- **Banco de Dados:** SQLite (`escola.db`)
- **Front-end:** React, TypeScript, Axios
- **Versionamento:** Git (com histórico de commits contínuo e colaborativo)

---

## 🚀 Como Executar o Projeto

### ✅ Pré-requisitos

Certifique-se de ter instalado:

- [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
- [Node.js 18.x+](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

---

## 📦 Instalação

### 1. Clonar o Repositório

```bash
git clone https://github.com/Kumegawwa/topicos-noite-trabalho.git
cd topicos-noite-trabalho
```

---

## 🖥️ Executar o Back-end (API)

1. Acesse a pasta da API:
   ```bash
   cd Api
   ```

2. Restaure os pacotes:
   ```bash
   dotnet restore
   ```

3. Execute as migrações (cria o banco `escola.db`):
   ```bash
   dotnet ef database update
   ```

   > Caso necessário, instale a ferramenta global:  
   > `dotnet tool install --global dotnet-ef`

4. Execute o servidor:
   ```bash
   dotnet run
   ```

   A API estará disponível em:
   - `http://localhost:5000`
   - `https://localhost:5001`

---

## 🌐 Executar o Front-end (React)

1. Em um terminal separado, vá para a pasta do front-end:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

   O front-end estará em `http://localhost:3000`

---

## 🔧 Funcionalidades Implementadas

### Back-end:
- CRUD completo de:
  - Alunos
  - Cursos
  - Matérias
- Relações entre entidades (ex.: Aluno x Curso)
- Validações com DataAnnotations e regras de negócio

### Front-end:
- Cadastro e listagem de alunos
- Integração com API via Axios
- Validações de formulário com feedback ao usuário

---

## ✅ Requisitos Atendidos

- [x] API mínima em C# com REST
- [x] Banco de dados SQLite + EF Core
- [x] CRUD completo + relacionamento
- [x] Front-end em React + TypeScript
- [x] Validações no back e front-end
- [x] Versionamento com Git (repositório público)
- [x] Documentação clara para execução

---

## 📌 Observações

- Verifique se as portas `3000`, `5000` ou `5001` estão livres antes de iniciar.
- Para ambientes de produção, configure variáveis de ambiente e HTTPS corretamente.
- Em caso de dúvidas ou problemas, abra uma *issue* no repositório.

---

## 👥 Colaboradores

> Lista de integrantes do grupo 

- Lucas Kumegawa de Godoi - RGM: 42045681
- Pedro Henrique Vasconcelo - RGM: 37226142