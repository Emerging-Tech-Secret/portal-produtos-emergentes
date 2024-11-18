# Portal de Produtos Emergentes - Itaú

## Visão Geral

O Portal de Produtos Emergentes é uma plataforma desenvolvida para gerenciar e avaliar protótipos de produtos digitais. O sistema permite o cadastro, avaliação e análise de Product Market Fit (PMF) de produtos emergentes.

## Funcionalidades Principais

### 1. Gestão de Produtos
- Cadastro de novos protótipos
- Visualização em grid com imagens geradas por IA
- Filtros por tags e busca textual
- Sistema de avaliação e feedback

### 2. Análise de PMF
- Cálculo automático de score PMF
- Análise detalhada por métricas
- Recomendações geradas por IA
- Visualização de dados em gráficos

### 3. Gestão de Usuários
- Níveis de acesso: Admin, Member e Reader
- Controle de permissões granular
- Histórico de acessos

## Arquitetura

### Frontend
- React com TypeScript
- Tailwind CSS para estilização
- Lucide React para ícones
- Nivo para visualização de dados

### Integração com IA
- OpenAI para geração de imagens
- GPT-4 para análises e insights

### Banco de Dados
- PostgreSQL com Aurora Serverless
- Schemas otimizados para análise

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Preencha as variáveis no arquivo `.env`:
```
VITE_AWS_REGION=
VITE_AURORA_ARN=
VITE_AURORA_SECRET_ARN=
VITE_AURORA_DATABASE=
VITE_OPENAI_API_KEY=
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Estrutura de Diretórios

```
src/
├── components/     # Componentes React reutilizáveis
├── contexts/       # Contextos React (Auth, Error, DataMode)
├── pages/         # Páginas da aplicação
├── services/      # Serviços de integração
├── types/         # Tipos TypeScript
└── lib/           # Utilitários e configurações
```

## Fluxo de Autenticação

1. Login via Firebase Authentication
2. Controle de sessão com Context API
3. Rotas protegidas com verificação de papel

## Análise de PMF

O cálculo do PMF considera:
- Engajamento do usuário
- Adequação ao problema
- Potencial de mercado
- Viabilidade técnica

## Manutenção

### Logs e Monitoramento
- Tratamento centralizado de erros
- Feedback visual para usuários
- Logs técnicos para debugging

### Backup
- Dados persistidos no Aurora
- Backups automáticos configurados

## Segurança

- Autenticação via Firebase
- Tokens JWT para sessões
- Sanitização de inputs
- Controle de acesso baseado em roles

## Roadmap

### Versão 1.1
- [ ] Integração com Jira
- [ ] Export de relatórios
- [ ] Dashboard avançado

### Versão 1.2
- [ ] Chat em tempo real
- [ ] Notificações push
- [ ] Análise preditiva