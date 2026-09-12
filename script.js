// script.js
// Consome a PokeAPI (https://pokeapi.co) — sem chave, JSON via HTTPS, CORS liberado.

const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";
const MAIOR_ID_CONHECIDO = 1025; // total aproximado de Pokémon cadastrados na API

const form = document.getElementById("form-busca");
const campoBusca = document.getElementById("campo-busca");
const botaoAleatorio = document.getElementById("botao-aleatorio");
const areaResultado = document.getElementById("resultado");

// Cor de fundo de cada "chip" de tipo (dado extra, só para deixar a exibição mais útil)
const CORES_TIPO = {
  normal: "#c6c6a7", fire: "#f5a35c", water: "#7fb9f5", electric: "#f7d34c",
  grass: "#8bd18a", ice: "#a8e6e6", fighting: "#e07b7b", poison: "#c98bd6",
  ground: "#e0c68c", flying: "#c3b7f5", psychic: "#f58bb0", bug: "#c3d16b",
  rock: "#cbbd8f", ghost: "#a08bd1", dragon: "#8f9df5", dark: "#a99584",
  steel: "#c9c9d6", fairy: "#f5b8d1"
};

// Formata um valor de altura/peso (que a API devolve em decímetros/hectogramas)
function formatarMedida(valorBruto, unidade) {
  return `${(valorBruto / 10).toFixed(1)} ${unidade}`;
}

function montarTipos(tipos) {
  return tipos
    .map((t) => {
      const nome = t.type.name;
      const cor = CORES_TIPO[nome] || "#cccccc";
      return `<span class="tipo" style="background:${cor}">${nome}</span>`;
    })
    .join("");
}

function montarStats(stats) {
  return stats
    .map((s) => {
      const valor = s.base_stat;
      const porcentagem = Math.min(100, Math.round((valor / 180) * 100));
      return `
        <div class="stat-linha">
          <span class="stat-nome">${s.stat.name.replace("special-", "sp. ")}</span>
          <div class="stat-barra"><div class="stat-preenchido" style="width:${porcentagem}%"></div></div>
          <span class="stat-valor">${valor}</span>
        </div>
      `;
    })
    .join("");
}

function montarCartao(dados) {
  const nome = dados.name;
  const numero = String(dados.id).padStart(3, "0");
  const imagem =
    dados.sprites?.other?.["official-artwork"]?.front_default ||
    dados.sprites?.front_default ||
    "";
  const altura = formatarMedida(dados.height, "m");
  const peso = formatarMedida(dados.weight, "kg");
  const habilidades = dados.abilities.map((a) => a.ability.name).join(", ");

  areaResultado.innerHTML = `
    <article class="cartao">
      <div class="sprite-wrap">
        <img src="${imagem}" alt="Sprite de ${nome}">
      </div>
      <div>
        <div class="cabecalho">
          <h2>${nome}</h2>
          <span class="numero">Nº ${numero}</span>
        </div>
        <div class="tipos">${montarTipos(dados.types)}</div>
        <p class="medidas"><span><b>Altura:</b> ${altura}</span><span><b>Peso:</b> ${peso}</span></p>
        <p class="habilidades"><b>Habilidades:</b> ${habilidades}</p>
      </div>
      <div class="stats">${montarStats(dados.stats)}</div>
    </article>
  `;
}

function mostrarCarregando() {
  areaResultado.innerHTML = `<p class="carregando">&gt; Consultando a Pokédex...</p>`;
}

function mostrarErro(mensagem) {
  areaResultado.innerHTML = `<p class="erro">${mensagem}</p>`;
}

async function buscarPokemon(termo) {
  if (!termo) return;
  const termoTratado = termo.toLowerCase().trim();
  mostrarCarregando();

  try {
    const resposta = await fetch(URL_BASE + termoTratado);

    if (resposta.status === 404) {
      mostrarErro(`Nenhum Pokémon encontrado para "${termo}". Confira a grafia ou o número e tente de novo.`);
      return;
    }

    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}`);
    }

    const dados = await resposta.json();
    montarCartao(dados);
  } catch (erro) {
    console.error("Falha ao buscar Pokémon:", erro);
    mostrarErro("Não foi possível falar com a PokeAPI agora. Verifique sua conexão e tente novamente em instantes.");
  }
}

function buscarAleatorio() {
  const idAleatorio = Math.floor(Math.random() * MAIOR_ID_CONHECIDO) + 1;
  campoBusca.value = idAleatorio;
  buscarPokemon(String(idAleatorio));
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const termo = campoBusca.value.trim();
  if (!termo) {
    mostrarErro("Digite um nome ou número de Pokémon para buscar.");
    return;
  }
  buscarPokemon(termo);
});

botaoAleatorio.addEventListener("click", buscarAleatorio);
