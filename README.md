# 📝 Blog Moderno com Next.js e Supabase

Uma aplicação de blog moderna e completa desenvolvida com **Next.js 15**, **TypeScript**, **Tailwind CSS** e **Supabase**, demonstrando as principais funcionalidades de um sistema de publicação de conteúdo com autenticação e autorização.

Esta aplicação foi criada especialmente para o **curso de Supabase da TreinaWeb**, servindo como projeto prático para demonstrar a integração completa entre frontend moderno e backend-as-a-service, incluindo autenticação, banco de dados relacional, storage de arquivos e políticas de segurança (RLS).

## ✨ Funcionalidades

### 🔐 **Sistema de Autenticação**
- Registro de novos usuários
- Login/logout com email e senha
- Autenticação via Supabase Auth
- Proteção de rotas e recursos
- Criação automática de perfil de usuário

### 📱 **Gestão de Posts**
- **Criação**: Interface intuitiva para criar novos posts
- **Visualização**: Layout responsivo e otimizado para leitura
- **Edição**: Edição completa apenas para autores
- **Exclusão**: Remoção segura de posts próprios
- **Tags**: Sistema de categorização por tags
- **Upload de imagens**: Integração com Supabase Storage

### 🔒 **Segurança e Autorização**
- **Row Level Security (RLS)**: Políticas de segurança no nível do banco
- **Autorização por autor**: Apenas autores podem editar/excluir seus posts
- **Validação de formulários**: Verificação client e server-side
- **Proteção de rotas**: Acesso restrito a páginas administrativas

### 🎨 **Interface e Experiência**
- **Design moderno**: Interface limpa e profissional
- **Responsivo**: Totalmente adaptável para desktop e mobile
- **Dark mode**: Suporte completo a tema escuro
- **Componentes reutilizáveis**: Biblioteca de componentes com shadcn/ui
- **Animações suaves**: Transições e estados de loading
- **SEO otimizado**: Meta tags e estrutura semântica

### ⚡ **Performance e Tecnologia**
- **Next.js 15**: App Router com Server Components
- **TypeScript**: Tipagem completa para maior segurança
- **Tailwind CSS**: Estilização utilitária e responsiva
- **Supabase**: Backend completo como serviço
- **Otimização de imagens**: Next.js Image com lazy loading

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - Next.js 15 (App Router)
  - TypeScript
  - Tailwind CSS
  - Lucide React (ícones)
  - shadcn/ui (componentes)

- **Backend:**
  - Supabase (BaaS)
  - PostgreSQL
  - Supabase Auth
  - Supabase Storage
  - Row Level Security (RLS)

- **Ferramentas:**
  - ESLint
  - PostCSS
  - Git

## 📋 Pré-requisitos

- **Node.js** 18.17 ou superior
- **npm**, **yarn**, **pnpm** ou **bun**
- Conta no **Supabase**

## 🚀 Como rodar a aplicação

### 1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/blog-supabase.git
cd blog-supabase
```

### 2. **Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

### 3. **Configure o Supabase**

#### 3.1. Crie um projeto no Supabase
- Acesse [supabase.com](https://supabase.com)
- Crie uma nova conta ou faça login
- Crie um novo projeto
- Aguarde a configuração do banco de dados

#### 3.2. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

> 📝 **Onde encontrar essas informações:**
> - Acesse seu projeto no Supabase
> - Vá em **Settings** → **API**
> - Copie a **URL** e a **anon key**

### 4. **Configure o banco de dados**

#### 4.1. Execute as migrações SQL
No **SQL Editor** do Supabase, execute os seguintes comandos:

```sql
-- Criar tabela de usuários
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  full_content TEXT NOT NULL,
  url_image TEXT NOT NULL,
  author UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_time TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Permitir leitura pública de usuários" ON usuarios FOR SELECT USING (true);
CREATE POLICY "Usuários podem criar próprio perfil" ON usuarios FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Usuários podem atualizar próprio perfil" ON usuarios FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Permitir leitura pública de posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Usuários autenticados podem criar posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author);
CREATE POLICY "Autores podem atualizar próprios posts" ON posts FOR UPDATE USING (auth.uid() = author);
CREATE POLICY "Autores podem deletar próprios posts" ON posts FOR DELETE USING (auth.uid() = author);

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.usuarios (id, name, email)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), 
    new.email
  ) 
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para novos usuários
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### 4.2. Configure o Storage
No painel do Supabase:

1. Vá em **Storage**
2. Crie um bucket chamado `posts-images`
3. Torne-o público:
   - Clique no bucket
   - Vá em **Configuration**
   - Marque **Public bucket**

### 5. **Execute a aplicação**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

### 6. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📱 Como usar

### 1. **Registro e Login**
- Acesse `/auth/register` para criar uma conta
- Faça login em `/auth/login`
- Seu perfil será criado automaticamente

### 2. **Criar Posts**
- Após o login, acesse `/post/new`
- Preencha o formulário com título, conteúdo, imagem e tags
- Publique seu post

### 3. **Gerenciar Posts**
- Visualize todos os posts na página inicial
- Clique em um post para ler o conteúdo completo
- Se você for o autor, verá botões de **Editar** e **Excluir**

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── auth/              # Páginas de autenticação
│   │   ├── login/         # Página de login
│   │   └── register/      # Página de registro
│   ├── post/              # Páginas relacionadas a posts
│   │   ├── [id]/          # Visualizar post específico
│   │   │   └── edit/      # Editar post
│   │   └── new/           # Criar novo post
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes reutilizáveis
│   └── ui/               # Componentes da biblioteca
├── contexts/              # Contextos React
│   └── AuthContext.tsx   # Contexto de autenticação
├── services/             # Serviços de API
│   └── post.service.ts   # Serviço de posts
├── types/                # Definições de tipos
│   └── post.types.ts     # Tipos relacionados a posts
└── supabase-client.ts    # Cliente do Supabase
```

## 🧪 Funcionalidades Demonstradas

Este projeto demonstra as principais funcionalidades do **Supabase**:

- ✅ **Supabase Auth**: Autenticação completa
- ✅ **PostgreSQL**: Banco de dados relacional
- ✅ **Row Level Security**: Políticas de segurança
- ✅ **Storage**: Upload e gerenciamento de arquivos
- ✅ **Real-time**: Atualizações em tempo real
- ✅ **API Auto-gerada**: REST e GraphQL automáticos
- ✅ **Triggers**: Funções automáticas no banco
- ✅ **Relationships**: Relacionamentos entre tabelas

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa o linter
```

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais como parte do curso de Supabase da TreinaWeb.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Fazer commit das mudanças
4. Fazer push para a branch
5. Abrir um Pull Request

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se seguiu todos os passos de configuração
2. Confirme se as variáveis de ambiente estão corretas
3. Verifique se o Supabase está configurado corretamente
4. Consulte a documentação do [Supabase](https://supabase.com/docs)

---