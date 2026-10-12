const areaCarrinho = document.querySelector(".direita");
const subtotalElemento = document.getElementById("subtotal-carrinho");
const totalElemento = document.getElementById("total-carrinho");

// Lê os produtos salvos no navegador
function lerCarrinho() {
  try {
    const dados = JSON.parse(localStorage.getItem("carrinho") || "[]");

    if (!Array.isArray(dados)) {
      return [];
    }

    return dados
      .filter((item) => item && item.id != null)
      .map((item) => ({
        ...item,
        id: String(item.id),
        preco: Math.max(0, Number(item.preco) || 0),
        quantidade: Math.max(
          1,
          Math.min(99, Math.floor(Number(item.quantidade) || 1)),
        ),
      }));
  } catch {
    return [];
  }
}

// Formata os valores em reais
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Evita interpretar nomes como HTML
function escaparHTML(valor) {
  return String(valor ?? "").replace(
    /[&<>"']/g,
    (caractere) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[caractere],
  );
}

// Salva o carrinho atualizado
function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Mostra os produtos na página
function renderizarCarrinho() {
  const carrinho = lerCarrinho();

  // Remove apenas os produtos dinâmicos antigos
  areaCarrinho.querySelectorAll(":scope > .produto").forEach((produto) => {
    produto.remove();
  });

  areaCarrinho
    .querySelectorAll(":scope > .carrinho-vazio")
    .forEach((mensagem) => {
      mensagem.remove();
    });

  if (carrinho.length === 0) {
    areaCarrinho.insertAdjacentHTML(
      "beforeend",
      '<p class="carrinho-vazio">Seu carrinho está vazio.</p>',
    );

    subtotalElemento.textContent = formatarPreco(0);
    totalElemento.textContent = formatarPreco(0);
    return;
  }
  const totalElemento = document.getElementById("total-carrinho");

  const total = carrinho.reduce((soma, item) => {
    return soma + item.preco * item.quantidade;
  }, 0);

  totalElemento.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  carrinho.forEach((item) => {
    const id = escaparHTML(item.id);
    const nome = escaparHTML(item.nome || "Café");
    const descricao = escaparHTML(item.descricao || "");
    const peso = escaparHTML(item.peso || "");
    const imagem = escaparHTML(item.imagem || "../img/Rectangle 7.png");

    const preco = Number(item.preco) || 0;
    const quantidade = Number(item.quantidade) || 1;
    const totalItem = preco * quantidade;

    const html = `
            <div class="produto">
                <div class="flex">
                    <img src="${imagem}" alt="${nome}">

                    <div>
                        <h1>${nome}</h1>
                        <p>${descricao}</p>
                        <h1>${peso}</h1>
                    </div>
                </div>

                <div class="flex2">
                    <h1>${formatarPreco(preco)}</h1>

                    <div class="seletor-quantidade">
                        <button
                            type="button"
                            class="btn-menos"
                            data-acao="diminuir"
                            data-id="${id}"
                            aria-label="Diminuir quantidade"
                        >-</button>

                        <input
                            type="number"
                            value="${quantidade}"
                            min="1"
                            max="99"
                            readonly
                            aria-label="Quantidade de ${nome}"
                        >

                        <button
                            type="button"
                            class="btn-mais"
                            data-acao="aumentar"
                            data-id="${id}"
                            aria-label="Aumentar quantidade"
                        >+</button>
                    </div>

                    <div class="flex">
                        <h1>${formatarPreco(totalItem)}</h1>

                        <button
                            type="button"
                            class="lixo"
                            data-acao="remover"
                            data-id="${id}"
                            aria-label="Remover ${nome}"
                        >
                            <img src="../img/lata-de-lixo.png" alt="">
                        </button>
                    </div>
                </div>
            </div>
        `;

    areaCarrinho.insertAdjacentHTML("beforeend", html);
  });

  // Soma preço x quantidade de todos os produtos
  const subtotal = carrinho.reduce((soma, item) => {
    return soma + item.preco * item.quantidade;
  }, 0);

  subtotalElemento.textContent = formatarPreco(subtotal);

  // Por enquanto, o frete não entra no cálculo
  totalElemento.textContent = formatarPreco(subtotal);
}

// Trata os botões de quantidade e remoção
areaCarrinho.addEventListener("click", (event) => {
  const botao = event.target.closest("button[data-acao]");

  if (!botao) return;

  const acao = botao.dataset.acao;
  const id = botao.dataset.id;

  const carrinho = lerCarrinho();
  const item = carrinho.find((produto) => produto.id === id);

  if (!item) return;

  if (acao === "aumentar" && item.quantidade < 99) {
    item.quantidade++;
  }

  if (acao === "diminuir") {
    item.quantidade--;

    if (item.quantidade <= 0) {
      const atualizado = carrinho.filter((produto) => produto.id !== id);

      salvarCarrinho(atualizado);
      renderizarCarrinho();
      return;
    }
  }

  if (acao === "remover") {
    const atualizado = carrinho.filter((produto) => produto.id !== id);

    salvarCarrinho(atualizado);
    renderizarCarrinho();
    return;
  }

  salvarCarrinho(carrinho);
  renderizarCarrinho();
});

const botaoFinalizar = document.getElementById("finalizarPedido");

botaoFinalizar.addEventListener("click", () => {
  const carrinho = lerCarrinho();

  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  window.location.href = "../checkout/checkout.html";
});

// Carrega o carrinho ao abrir a página
renderizarCarrinho();
