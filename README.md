# Gateway Web App

Aplicação web completa construída com Flask para gerenciamento de recursos de integração (gateways). Inclui autenticação de usuários, cadastro, edição, remoção e listagem de recursos, além de busca simples.

## Requisitos

- Python 3.11+
- Ambiente virtual recomendado

## Configuração do ambiente

```bash
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
.venv\\Scripts\\activate   # Windows PowerShell
pip install -r requirements.txt
```

## Inicialização do banco de dados

Crie o banco de dados e um usuário administrador padrão:

```bash
flask --app app:create_app init-db
```

Credenciais padrão geradas:

- **E-mail:** `admin@gateway.local`
- **Senha:** `admin123`

## Executando o servidor de desenvolvimento

```bash
flask --app app:create_app run
```

ou

```bash
python run.py
```

A aplicação ficará disponível em `http://127.0.0.1:5000`.

## Estrutura de funcionalidades

- **Autenticação:** Login, logout e cadastro de novos usuários.
- **CRUD de recursos:** Criar, listar, buscar, editar e excluir recursos do gateway associados ao usuário autenticado.
- **Interface responsiva:** Interface construída com Bootstrap 5.

## Testes

Ainda não há testes automatizados configurados.
