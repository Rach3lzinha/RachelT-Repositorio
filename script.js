
// script.js
// Já consome a PokeAPI de verdade — mas AINDA:
// - sem tratamento de erro (isso entra no próximo commit)
// - sem o visual de cartão (isso entra no commit depois do de erros)
 
const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";
const MAIOR_ID_CONHECIDO = 1025; // total aproximado de Pokémon cadastrados na API
 
const form = document.getElementById("form-busca");
const campoBusca = document.getElementById("campo-busca");
const botaoAleatorio = document.getElementById("botao-aleatorio");
const areaResultado = document.getElementById("resultado");
 
// ---------- Função principal: consulta a API e mostra os dados (ainda sem try/catch) ----------
async function buscarPokemon(termo) {
  areaResultado.innerHTML = `<p>Carregando...</p>`;
 
  const termoTratado = termo.toLowerCase().trim();
  const resposta = await fetch(URL_BASE + termoTratado);
  const dados = await resposta.json();
 
  // Extraindo os campos que vamos exibir (mínimo de 3 informações da resposta)
  const nome = dados.name;
  const numero = dados.id;
  const imagem = dados.sprites.front_default;
  const altura = (dados.height / 10).toFixed(1); // decímetros → metros
  const peso = (dados.weight / 10).toFixed(1); // hectogramas → kg
  const habilidades = dados.abilities.map((a) => a.ability.name).join(", ");
 
  // Ainda sem classe .cartao nem estilo — só a informação, sem formatação visual
  areaResultado.innerHTML = `
    <p>Nome: ${nome}</p>
    <p>Número: ${numero}</p>
    <img src="${imagem}" alt="${nome}" width="120">
    <p>Altura: ${altura} m</p>
    <p>Peso: ${peso} kg</p>
    <p>Habilidades: ${habilidades}</p>
  `;
}
 
function buscarAleatorio() {
  const idAleatorio = Math.floor(Math.random() * MAIOR_ID_CONHECIDO) + 1;
  campoBusca.value = idAleatorio;
  buscarPokemon(String(idAleatorio));
}
 
form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const termo = campoBusca.value.trim();
  if (termo) buscarPokemon(termo);
});
 
botaoAleatorio.addEventListener("click", buscarAleatorio);
  if (termo) buscarPokemon(termo);
});
 
botaoAleatorio.addEventListener("click", buscarAleatorio);
 
