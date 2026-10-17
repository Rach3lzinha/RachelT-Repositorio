# Pokédex Terminal

## Autor

Rachel Tolentino de Sena — Matrícula 22612246

## Descrição

Aplicação web com visual de terminal retrô que consulta a PokeAPI e mostra dados completos de qualquer Pokémon: imagem, tipos, altura, peso, habilidades e estatísticas base. A aplicação permite realizar consultas rápidas, sortear um Pokémon e salvar os Pokémon consultados no banco de dados.

## API utilizada

- Nome da API: [PokeAPI](https://pokeapi.co/)
- Documentação: https://pokeapi.co/docs/v2
- Endpoint consumido: `GET https://pokeapi.co/api/v2/pokemon/{nome-ou-numero}`

## Banco de dados e persistência

A aplicação utiliza o **Supabase** como banco de dados. O Supabase fornece um banco PostgreSQL hospedado na nuvem e permite que a aplicação consulte, salve e remova registros por meio da biblioteca `@supabase/supabase-js`.

A busca inicial dos dados é feita na PokeAPI. Quando o usuário clica em **Salvar favorito**, os dados do Pokémon são enviados para a tabela `Pokedex` no Supabase. Dessa forma, os registros continuam disponíveis mesmo depois que a página é fechada ou recarregada.

### Estrutura da tabela `Pokedex`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `int8` | Número identificador do Pokémon e chave primária. |
| `nome` | `varchar` ou `text` | Nome do Pokémon. |
| `altura` | `int8` | Altura informada pela PokeAPI, em decímetros. |
| `peso` | `int8` | Peso informado pela PokeAPI, em hectogramas. |
| `experiencia_base` | `int8` | Experiência-base do Pokémon. |
| `imagens_url` | `text` | Endereço da imagem oficial do Pokémon. |
| `sprite_url` | `text` | Endereço do sprite padrão. |
| `tipos` | `text` | Tipo ou tipos do Pokémon. |
| `habilidades` | `text` | Habilidades do Pokémon. |
| `estatisticas` | `jsonb` | Estatísticas base, como HP, ataque, defesa e velocidade. |
| `url_pokeapi` | `text` | Endereço do registro correspondente na PokeAPI. |
| `criado_em` | `timestamptz` | Data e hora em que o registro foi salvo. Possui valor padrão `now()`. |

### O que é salvo

Ao salvar um Pokémon, a aplicação armazena:

- seu número e nome;
- altura, peso e experiência-base;
- URL da imagem oficial e do sprite;
- tipos e habilidades;
- estatísticas base em formato JSON;
- URL do registro na PokeAPI;
- data e hora do salvamento.

O campo `estatisticas` usa o tipo `jsonb` porque reúne várias informações em um único objeto. Um exemplo de valor armazenado é:

```json
{
  "hp": 35,
  "attack": 55,
  "defense": 40,
  "special-attack": 50,
  "special-defense": 50,
  "speed": 90
}
```

### Operações realizadas no banco

O projeto utiliza as operações básicas de persistência:

- **Create/Upsert:** salva o Pokémon na tabela `Pokedex`;
- **Read:** lista os Pokémon salvos e ordena pela data de criação;
- **Delete:** remove um Pokémon salvo pelo seu `id`.

O `upsert` é utilizado para evitar erro quando o usuário tenta salvar novamente um Pokémon que já possui o mesmo `id` na tabela.

### Limitação conhecida de segurança

Para fins acadêmicos e de demonstração, a tabela possui políticas de acesso RLS que permitem as operações necessárias ao usuário anônimo do site. Isso significa que visitantes não autenticados podem consultar, inserir e remover registros, conforme as políticas configuradas no Supabase.

Em uma aplicação real, o ideal seria exigir autenticação e restringir as operações para que cada usuário pudesse acessar somente os próprios favoritos.

## Funcionalidades

- Buscar um Pokémon pelo nome ou número;
- Buscar um Pokémon aleatório com um clique;
- Visualizar imagem oficial, número, tipos, altura, peso, habilidades e estatísticas base;
- Salvar Pokémon na tabela `Pokedex` do Supabase;
- Listar os Pokémon salvos;
- Remover Pokémon salvos;
- Receber mensagens amigáveis quando o Pokémon não é encontrado ou uma API está indisponível.

## Como executar localmente

1. Clone o repositório:

   ```bash
   git clone URL_DO_REPOSITORIO
   ```

2. Entre na pasta do projeto:

   ```bash
   cd NOME_DO_REPOSITORIO
   ```

3. Abra o arquivo `index.html` em um servidor local ou publique o projeto pelo GitHub Pages.

> Como o projeto utiliza módulos JavaScript e chamadas externas para a PokeAPI e o Supabase, recomenda-se executá-lo por meio de um servidor local, como a extensão Live Server do Visual Studio Code, em vez de abrir o arquivo diretamente pelo endereço `file://`.

## Links

- **Aplicação no ar (GitHub Pages):** https://rach3lzinha.github.io/RachelT-Repositorio/
- **Repositório:** https://github.com/Rach3lzinha/RachelT-Repositorio
