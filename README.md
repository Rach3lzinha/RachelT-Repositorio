# Pokédex Terminal — Consulta de Pokémon com Favoritos

## Autor
Rachel Tolentino de Sena — 22612246

## Links do Projeto
- **Repositório GitHub:** [https://github.com/Rach3lzinha/RachelT-Repositorio](https://github.com/Rach3lzinha/RachelT-Repositorio)
- **Aplicação no ar (GitHub Pages):** [https://rach3lzinha.github.io/RachelT-Repositorio/](https://rach3lzinha.github.io/RachelT-Repositorio/)
- **Imagem no Docker Hub:** [//hub.docker.com/r/r4ch3lzinha/pokedex-terminal](//hub.docker.com/r/r4ch3lzinha/pokedex-terminal)

---

## Descrição
Aplicação web com visual de terminal retrô que consulta a PokeAPI em tempo real e exibe os dados de um Pokémon: imagem, número, altura, peso, tipos e habilidades. Também é possível sortear um Pokémon aleatório e salvar favoritos em um banco de dados na nuvem, que sobrevivem ao fechamento do navegador.

## API utilizada
- **PokeAPI** — `https://pokeapi.co/api/v2/pokemon/{nome-ou-numero}` (dados e imagens dos Pokémon).

## Funcionalidades
- Buscar Pokémon por nome ou número;
- Sortear um Pokémon aleatório com um clique;
- Exibir imagem, número, altura, peso, tipos e habilidades do Pokémon;
- Salvar Pokémon como favorito (Create/Upsert);
- Listar os favoritos ao abrir a página (Read);
- Remover favoritos (Delete).

---

## 💾 Persistência de Dados (Supabase / PostgreSQL)
Os favoritos são guardados no **Supabase** (PostgreSQL), acessado direto do frontend com a biblioteca `@supabase/supabase-js`.

- **Tabela:** `Pokedex`
- **Operações:** Create (`upsert` por `id`, evitando duplicados), Read (listagem ordenada por `criado_em`) e Delete (remoção por `id`).

### Estrutura da tabela
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | int (chave primária) | Número do Pokémon na PokeAPI |
| `nome` | text | Nome do Pokémon |
| `altura` | int | Altura (decímetros) |
| `peso` | int | Peso (hectogramas) |
| `experiencia_base` | int | Experiência base |
| `imagens_url` | text | URL da imagem oficial |
| `sprite_url` | text | URL do sprite |
| `tipos` | text | Tipos, separados por vírgula |
| `habilidades` | text | Habilidades, separadas por vírgula |
| `estatisticas` | jsonb | Estatísticas base (HP, ataque, defesa etc.) |
| `url_pokeapi` | text | Endereço do Pokémon na PokeAPI |
| `criado_em` | timestamptz (default `now()`) | Data em que foi salvo |

> Confira os tipos no Table Editor do seu projeto e ajuste esta tabela se estiverem diferentes.

### Limitação conhecida
As políticas de acesso (RLS) da tabela estão abertas para a chave `anon`, permitindo leitura e escrita a qualquer visitante. Isso é aceitável nesta etapa, mas em produção seria necessário autenticação e políticas por usuário.

---

## 🐳 Conteinerização com Docker
A aplicação é servida por um **Nginx (Alpine)** dentro de um container.

```dockerfile
FROM nginx:alpine
COPY index.html style.css script.js /usr/share/nginx/html/
EXPOSE 80
```

### Como rodar (comando para o avaliador)
```bash
docker run -d -p 8080:80 --name pokedex-app SEU-USUARIO-DOCKER/SEU-REPOSITORIO-DOCKER:latest
```

Acesse em: `http://localhost:8080`

### Build local
```bash
docker build -t pokedex-terminal .
docker run -d -p 8080:80 --name meu-app pokedex-terminal
```

---

## 🧩 Evidências das Sidequests

### SQ1 · `.dockerignore`
O arquivo `.dockerignore` exclui da imagem o que não é necessário para rodar a aplicação (`.git`, `README.md`, rascunhos). Isso deixa a imagem menor, porque menos arquivos são enviados ao contexto de build e copiados, e torna o build mais rápido.

### SQ2 · Versionamento de imagem
Imagem publicada no Docker Hub com as tags `1.0`, `1.1` e `latest`.

### SQ3 · Descrição no Docker Hub
O overview do repositório no Docker Hub descreve a aplicação, traz o comando `docker run` pronto para copiar e o link do repositório GitHub.

### SQ4 · Orquestração e múltiplos containers
Dois containers da mesma imagem rodando ao mesmo tempo, em portas diferentes:

```bash
docker run -d -p 8080:80 --name pokedex-1 SEU-USUARIO-DOCKER/SEU-REPOSITORIO-DOCKER:latest
docker run -d -p 8081:80 --name pokedex-2 SEU-USUARIO-DOCKER/SEU-REPOSITORIO-DOCKER:latest
```

Evidência (print do `docker ps`): ![docker ps com dois containers](CAMINHO-DO-PRINT.png)

**Se eu tivesse 100 containers, como gerenciaria?**
Gerenciar 100 containers à mão seria inviável. O **Kubernetes** resolve isso organizando as máquinas em um **cluster**, onde os containers rodam dentro de **Pods**. Com **réplicas**, defino quantas cópias da aplicação quero e o Kubernetes mantém esse número: se um container falha, ele sobe outro automaticamente. Ele também faz balanceamento de carga entre as réplicas e permite aumentar ou diminuir a quantidade conforme a demanda.