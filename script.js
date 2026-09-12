pt · JS
// script.js
// Ainda SEM a consulta à API — isso entra no próximo commit ("Implementa consulta a API com fetch").
 
const form = document.getElementById("form-busca");
const campoBusca = document.getElementById("campo-busca");
const botaoAleatorio = document.getElementById("botao-aleatorio");
const areaResultado = document.getElementById("resultado");
 
// TODO (próximo commit): trocar esta função por uma chamada real à PokeAPI com fetch,
// usando async/await e lendo o JSON da resposta.
function buscarPokemon(termo) {
  areaResultado.innerHTML = `<p class="placeholder">Você buscou por "${termo}". A consulta à API ainda não foi implementada.</p>`;
}
 
// TODO (próximo commit): sortear um número e buscar esse Pokémon pela API.
function buscarAleatorio() {
  areaResultado.innerHTML = `<p class="placeholder">Busca aleatória ainda não implementada.</p>`;
}
 
form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const termo = campoBusca.value.trim();
  if (termo) buscarPokemon(termo);
});
 
botaoAleatorio.addEventListener("click", buscarAleatorio);
 
