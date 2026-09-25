import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Use somente a URL base do projeto. Não acrescente /rest/v1/.
const SUPABASE_URL = "https://hivfuatqzbsjpvkogaxz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdmZ1YXRxemJzanB2a29nYXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNjUwNDIsImV4cCI6MjEwNTk0MTA0Mn0.V6U3qJZc6gzAHMtw1giR7gEgyuO4ZQX8uTv3x0DtiHA";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const TABELA = "Pokedex";

const formulario = document.querySelector("#form-busca");
const campoBusca = document.querySelector("#campo-busca");
const botaoAleatorio = document.querySelector("#botao-aleatorio");
const resultado = document.querySelector("#resultado");
const listaFavoritos = document.querySelector("#lista-favoritos");

function escaparHTML(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function mensagem(elemento, texto) {
  elemento.innerHTML = `<p class="placeholder">&gt; ${escaparHTML(texto)}</p>`;
}

function dadosParaTabela(pokemon) {
  return {
    id: pokemon.id,
    nome: pokemon.name,
    altura: pokemon.height,
    peso: pokemon.weight,
    experiencia_base: pokemon.base_experience,
    imagens_url: pokemon.sprites.other?.["official-artwork"]?.front_default || pokemon.sprites.front_default,
    sprite_url: pokemon.sprites.front_default,
    tipos: pokemon.types.map((item) => item.type.name).join(", "),
    habilidades: pokemon.abilities.map((item) => item.ability.name).join(", "),
    estatisticas: Object.fromEntries(
      pokemon.stats.map((item) => [item.stat.name, item.base_stat])
    ),
    url_pokeapi: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`
  };
}

async function buscarNaPokeAPI(valor) {
  const busca = String(valor).trim().toLowerCase();
  if (!busca) return;

  mensagem(resultado, "Consultando a PokeAPI...");

  try {
    const resposta = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(busca)}`
    );

    if (!resposta.ok) throw new Error("Pokémon não encontrado");

    const pokemon = await resposta.json();
    exibirPokemon(pokemon);
  } catch (erro) {
    console.error(erro);
    mensagem(resultado, "Pokémon não encontrado.");
  }
}

function exibirPokemon(pokemon) {
  const dados = dadosParaTabela(pokemon);
  const imagem = dados.imagem_url || "";

  resultado.innerHTML = `
    <article class="pokemon-card">
      <img src="${escaparHTML(imagem)}" alt="Imagem de ${escaparHTML(pokemon.name)}">
      <h2>#${pokemon.id} — ${escaparHTML(pokemon.name)}</h2>
      <p><strong>Altura:</strong> ${pokemon.height} dm</p>
      <p><strong>Peso:</strong> ${pokemon.weight} hg</p>
      <p><strong>Tipo(s):</strong> ${escaparHTML(dados.tipos)}</p>
      <p><strong>Habilidade(s):</strong> ${escaparHTML(dados.habilidades)}</p>
      <button type="button" id="botao-salvar">SALVAR FAVORITO</button>
    </article>
  `;

  document.querySelector("#botao-salvar").addEventListener("click", () => {
    salvarFavorito(dados);
  });
}

// CREATE/UPDATE — salva o Pokémon na tabela Pokedex.
// O upsert evita erro se o mesmo Pokémon já estiver salvo.
async function salvarFavorito(dados) {
  const { error } = await supabase
    .from(TABELA)
    .upsert(dados, { onConflict: "id" });

  if (error) {
    console.error("Erro ao salvar no Supabase:", error);
    alert(`Erro ao salvar: ${error.message}`);
    return;
  }

  alert("Pokémon salvo com sucesso!");
  listarFavoritos();
}

// READ — lista os Pokémon da tabela Pokedex.
async function listarFavoritos() {
  const { data, error } = await supabase
    .from(TABELA)
    .select("id, nome, imagem_url")
    .order("id");

  if (error) {
    console.error("Erro ao listar no Supabase:", error);
    mensagem(listaFavoritos, `Erro ao carregar: ${error.message}`);
    return;
  }

  if (!data?.length) {
    mensagem(listaFavoritos, "Nenhum Pokémon salvo.");
    return;
  }

  listaFavoritos.innerHTML = data.map((pokemon) => `
    <div class="favorito">
      <span>#${escaparHTML(pokemon.id)} — ${escaparHTML(pokemon.nome)}</span>
      <button type="button" class="botao-remover" data-id="${escaparHTML(pokemon.id)}">REMOVER</button>
    </div>
  `).join("");

  listaFavoritos.querySelectorAll(".botao-remover").forEach((botao) => {
    botao.addEventListener("click", () => removerFavorito(botao.dataset.id));
  });
}

// DELETE — remove o Pokémon pelo id.
async function removerFavorito(id) {
  const { error } = await supabase
    .from(TABELA)
    .delete()
    .eq("id", Number(id));

  if (error) {
    console.error("Erro ao remover do Supabase:", error);
    alert(`Erro ao remover: ${error.message}`);
    return;
  }

  listarFavoritos();
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  buscarNaPokeAPI(campoBusca.value);
});

botaoAleatorio.addEventListener("click", () => {
  const numero = Math.floor(Math.random() * 1025) + 1;
  campoBusca.value = numero;
  buscarNaPokeAPI(numero);
});

listarFavoritos();
