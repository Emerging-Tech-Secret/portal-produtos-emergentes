# Portal de Produtos Emergentes - Docker Setup

## Requisitos

- Docker
- Docker Compose

## Instruções de Uso

1. Clone o repositório:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Edite o arquivo `.env` com suas configurações

4. Construa e inicie o container:
```bash
docker-compose up --build
```

5. Acesse a aplicação em:
```
http://localhost:3000
```

## Comandos Úteis

- Iniciar em modo detached:
```bash
docker-compose up -d
```

- Parar os containers:
```bash
docker-compose down
```

- Ver logs:
```bash
docker-compose logs -f
```

- Reconstruir após mudanças:
```bash
docker-compose up --build
```