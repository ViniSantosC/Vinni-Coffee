function mudarQuantidade(valor) {
  const input = document.getElementById("quantidade");
  let atual = parseInt(input.value) + valor;

  // Garante que o usuário não diminua para menos de 1
  if (atual < 1) {
    atual = 1;
  }

  // Opcional: define um limite máximo por compra (ex: 99)
  if (atual > 99) {
    atual = 99;
  }

  input.value = atual;
}
