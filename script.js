Script · JS
// script.js
// Já trata erros (busca sem resultado e falha de conexão) — mas AINDA sem o visual de cartão
// (isso entra no próximo commit: "Estiliza cartao de resultados").
 
const URL_BASE = "https://pokeapi.co/api/v2/pokemon/";
const MAIOR_ID_CONHECIDO = 1025; // total aproximado de Pokémon cadastrados na API
 
const form = document.getElementById("form-busca");
const campoBusca = document.getElementById("campo-busca");
const botaoAleatorio = document.getElementById("botao-aleatorio");
const areaResultado = document.getElementById("resultado");
 
function mostrarCarregando() {
  areaResultado.innerHTML = `<p class="carregando">Carregando...</p>`;
}
 
function mostrarErro(mensagem) {
  // Ainda sem classe estilizada — só a mensagem, sem formatação visual de destaque
  areaResultado.innerHTML = `<p class="erro">${mensagem}</p>`;
}
 
function montarResultado(dados) {
  const nome = dados.name;
  const numero = dados.id;
  const imagem = dados.sprites.front_default;
  const altura = (dados.height / 10).toFixed(1); // decímetros → metros
  const peso = (dados.weight / 10).toFixed(1); // hectogramas → kg
  const habilidades = dados.abilities.map((a) => a.ability.name).join(", ");
 
  areaResultado.innerHTML = `
    <p>Nome: ${nome}</p>
    <p>Número: ${numero}</p>
    <img src="${imagem}" alt="${nome}" width="120">
    <p>Altura: ${altura} m</p>
    <p>Peso: ${peso} kg</p>
    <p>Habilidades: ${habilidades}</p>
  `;
}
 
// ---------- Função principal: consulta a API com tratamento de erro ----------
async function buscarPokemon(termo) {
  if (!termo) return;
  const termoTratado = termo.toLowerCase().trim();
  mostrarCarregando();
 
  try {
    const resposta = await fetch(URL_BASE + termoTratado);
 
    // A PokeAPI devolve 404 quando o nome/número não existe
    if (resposta.status === 404) {
      mostrarErro(`Nenhum Pokémon encontrado para "${termo}". Confira a grafia ou o número e tente de novo.`);
      return;
    }
 
    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}`);
    }
 
    const dados = await resposta.json();
    montarResultado(dados);
  } catch (erro) {
    // Cai aqui em falhas de rede, API fora do ar, ou qualquer outro erro inesperado
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
 
