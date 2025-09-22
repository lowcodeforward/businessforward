# BusinessForward Gateway

Aplicação web completa (frontend + backend + banco de dados) para gestão de usuários, produtos e pedidos, com autenticação segura e documentação da API.

## Visão Geral

- **Backend:** Node.js + Express + Sequelize + PostgreSQL
- **Frontend:** React (Vite) + React Router + Axios
- **Autenticação:** JWT, hash de senha (bcrypt), middleware de proteção de rotas e controle de perfis (admin x usuário)
- **Banco:** PostgreSQL com migrations e seeders usando `sequelize-cli`
- **Documentação:** Swagger disponível em `http://localhost:4000/api/docs`

## Pré-requisitos

- Node.js 18+
- npm 9+
- Docker (opcional, recomendado para subir o banco rapidamente)

## Estrutura do Projeto

```
.
├── backend/          # API REST
├── frontend/         # Aplicação React
├── docker-compose.yml
└── README.md
```

## Configuração do Backend

1. Copie o arquivo de variáveis de ambiente:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. (Opcional) Suba o banco de dados PostgreSQL com Docker:
   ```bash
   cd ..
   docker compose up -d db
   ```

   O serviço expõe o Postgres em `postgres://postgres:postgres@localhost:5432/businessforward`.

3. Instale as dependências do backend:
   ```bash
   cd backend
   npm install
   ```

4. Execute migrations e seeders (cria tabelas e usuário admin):
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Inicie a API em modo desenvolvimento:
   ```bash
   npm run dev
   ```

   A API ficará disponível em `http://localhost:4000`.

## Configuração do Frontend

1. Copie o arquivo de ambiente (opcional):
   ```bash
   cd frontend
   cp .env.example .env
   ```

   O valor padrão (`VITE_API_URL`) aponta para `http://localhost:4000/api`.

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o frontend:
   ```bash
   npm run dev
   ```

   A aplicação estará disponível em `http://localhost:5173`.

## Fluxo de Autenticação

- Registro e login disponíveis em `/login` e `/register`.
- Após login, o token JWT é armazenado localmente e enviado em todas as requisições.
- Rotas protegidas: produtos, pedidos e usuários (esta última apenas para administradores).

## Usuário Administrador Padrão

Após rodar os seeders, você terá o seguinte usuário para o primeiro acesso:

- **Email:** `admin@businessforward.com`
- **Senha:** `Admin@123`

## Endpoints Principais

A documentação completa está no Swagger (`/api/docs`). Endpoints básicos:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users` (admin)
- `GET /api/products`
- `POST /api/orders`

## Scripts Úteis

- `npm run db:migrate` – aplica migrations
- `npm run db:migrate:undo` – desfaz a última migration
- `npm run db:seed` – executa seeders
- `npm run db:seed:undo` – desfaz seeders

## Testes

O projeto não possui testes automatizados prontos. Recomenda-se validar manualmente:

1. Registro de usuário e login
2. CRUD de produtos (com usuário admin)
3. Criação e listagem de pedidos para usuários comuns e admin
4. Verificação de permissões (usuário comum não consegue acessar `/users`)

## Próximos Passos Sugeridos

- Adicionar testes automatizados (unitários e integração)
- Containerizar backend/frontend em conjunto com docker-compose
- Implementar tratamento de erros mais detalhado no frontend
