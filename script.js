import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL =
  "https://hivfuatqzbsjpvkogaxz.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_5IE9a5qhVuu2EHU6j6UhFA_DvQHWPmM";

const supabase = createClient(
  "https://hivfuatqzbsjpvkogaxz.supabase.co",
  "SUA_CHAVE_PUBLICA"
 );

const formulario = document.getElementById("form-busca");
const campoBusca = document.getElementById("campo-busca");
const botaoAleatorio = document.getElementById("botao-aleatorio");
const resultado = document.getElementById("resultado");
const listaFavoritos = document.getElementById("lista-favoritos");

function escaparHTML(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function mostrarMensagem(elemento, mensagem) {
  elemento.innerHTML = `
    <p class="placeholder">&gt; ${escaparHTML(mensagem)}</p>
  `;
}

// Busca um Pokémon na PokeAPI
async function buscarPokemon(valor) {
  const busca = String(valor).trim().toLowerCase();

  if (!busca) {
    mostrarMensagem(resultado, "Digite o nome ou número de um Pokémon.");
    return;
  }

  mostrarMensagem(resultado, "Buscando Pokémon...");

  try {
    const resposta = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(busca )}`
    );

    if (!resposta.ok) {
      throw new Error("Pokémon não encontrado");
    }

    const pokemon = await resposta.json();
    renderizarPokemon(pokemon);
  } catch (erro) {
    console.error(erro);
    mostrarMensagem(resultado, "Pokémon não encontrado.");
  }
}

// Exibe o Pokémon na tela
function renderizarPokemon(pokemon) {
  const imagem =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;

  const dadosExtra = {
    id: pokemon.id,
    altura: pokemon.height,
    peso: pokemon.weight,
    imagem_url: imagem,
    tipos: pokemon.types.map((item) => item.type.name),
    habilidades: pokemon.abilities.map(
      (item) => item.ability.name
    ),
    estatisticas: Object.fromEntries(
      pokemon.stats.map((item) => [
        item.stat.name,
        item.base_stat
      ])
    )
  };

  resultado.innerHTML = `
    <article class="pokemon-card">
      <img
        src="${imagem}"
        alt="Imagem de ${escaparHTML(pokemon.name)}"
      />

      <h2>#${pokemon.id} — ${escaparHTML(pokemon.name)}</h2>

      <p><strong>Altura:</strong> ${pokemon.height} dm</p>
      <p><strong>Peso:</strong> ${pokemon.weight} hg</p>

      <p>
        <strong>Tipo(s):</strong>
        ${pokemon.types
          .map((item) => item.type.name)
          .join(", ")}
      </p>

      <p>
        <strong>Habilidade(s):</strong>
        ${pokemon.abilities
          .map((item) => item.ability.name)
          .join(", ")}
      </p>

      <button id="botao-salvar-favorito" type="button">
        SALVAR FAVORITO
      </button>
    </article>
  `;

  document
    .getElementById("botao-salvar-favorito")
    .addEventListener("click", () => {
      salvarFavorito(pokemon.name, dadosExtra);
    });
}

// CREATE — salvar favorito
async function salvarFavorito(nome, extra) {
  const { error } = await supabase
    .from("Pokedex")
    .insert({
      id: extra.id,
      nome: nome,
      altura: extra.altura,
      peso: extra.peso,
      imagem_url: extra.imagem_url,
      tipos: extra.tipos.join(", "),
      habilidades: extra.habilidades.join(", "),
      estatisticas: extra.estatisticas
    });

  if (error) {
    console.error("Erro ao salvar favorito:", error);
    alert("Erro ao salvar: " + error.message);
    return;
  }

  alert("Pokémon salvo na tabela Pokedex!");
  listarFavoritos();
}


// READ — listar favoritos
async function listarFavoritos() {
  const { data, error } = await supabase
    .from("Pokedex")
    .select("*")
    .order("id");

  if (error) {
    console.error("Erro ao listar Pokémon:", error);
    mostrarMensagem(
      listaFavoritos,
      "Erro ao carregar os Pokémon."
    );
    return;
  }

  if (!data || data.length === 0) {
    mostrarMensagem(
      listaFavoritos,
      "Nenhum Pokémon salvo."
    );
    return;
  }

  listaFavoritos.innerHTML = data
    .map(
      (pokemon) => `
        <div class="favorito">
          <span>
            #${pokemon.id}
            ${escaparHTML(pokemon.nome)}
          </span>

          <button
            type="button"
            class="botao-remover"
            data-id="${pokemon.id}"
          >
            REMOVER
          </button>
        </div>
      `
    )
    .join("");

  document
    .querySelectorAll(".botao-remover")
    .forEach((botao) => {
      botao.addEventListener("click", () => {
        removerFavorito(botao.dataset.id);
      });
    });
}

// DELETE — remover favorito
async function removerFavorito(id) {
  const { error } = await supabase
    .from("Pokedex")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao remover Pokémon:", error);
    alert("Erro ao remover: " + error.message);
    return;
  }

  listarFavoritos();
}


// Botão BUSCAR
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  buscarPokemon(campoBusca.value);
});

// Botão ALEATÓRIO
botaoAleatorio.addEventListener("click", () => {
  const numeroAleatorio =
    Math.floor(Math.random() * 1025) + 1;

  campoBusca.value = numeroAleatorio;
  buscarPokemon(numeroAleatorio);
});

// Carrega os favoritos ao abrir a página
listarFavoritos();
