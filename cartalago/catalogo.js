const inputPreco = document.getElementById("preco");
const valorAtual = document.getElementById("valor-atual");

// Escuta o evento 'input' para atualizar o texto em tempo real
inputPreco.addEventListener("input", (event) => {
  valorAtual.textContent = event.target.value;
});
