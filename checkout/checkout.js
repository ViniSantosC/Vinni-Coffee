
const form = document.getElementById("form-checkout");
const resumoProdutos = document.getElementById("resumo-produtos");

const subtotalElemento = document.getElementById("subtotal");
const freteElemento = document.getElementById("frete");
const totalElemento = document.getElementById("total");

const tipoEntrega = document.getElementById("tipoEntrega");
const campoEndereco = document.getElementById("campo-endereco");
const endereco = document.getElementById("endereco");

const botaoConfirmar = document.getElementById("confirmar-pedido");

const TAXA_ENTREGA = 5; 

function lerCarrinho() {
    try {
        const dados = JSON.parse(
            localStorage.getItem("carrinho") || "[]"
        );

        if (!Array.isArray(dados)) return [];

        return dados.filter(item =>
            item &&
            item.id != null &&
            Number.isFinite(Number(item.preco)) &&
            Number(item.preco) >= 0 &&
            Number.isInteger(Number(item.quantidade)) &&
            Number(item.quantidade) >= 1
        );
    } catch {
        return [];
    }
}

function moeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

function calcularSubtotal(carrinho) {
    return carrinho.reduce((soma, item) => {
        return soma + Number(item.preco) * Number(item.quantidade);
    }, 0);
}

function atualizarResumo() {
    const carrinho = lerCarrinho();

    const subtotal = calcularSubtotal(carrinho);
    const frete = tipoEntrega.value === "entrega" ? TAXA_ENTREGA : 0;
    const total = subtotal + frete;

    resumoProdutos.innerHTML = carrinho.length
        ? carrinho.map(item => `
            <div class="produto-resumo">
                <span>${escaparHTML(item.nome)} × ${Number(item.quantidade)}</span>
                <strong>
                    ${moeda(Number(item.preco) * Number(item.quantidade))}
                </strong>
            </div>
        `).join("")
        : "<p>Seu carrinho está vazio.</p>";

    subtotalElemento.textContent = moeda(subtotal);
    freteElemento.textContent = moeda(frete);
    totalElemento.textContent = moeda(total);

    botaoConfirmar.disabled = carrinho.length === 0;

    return { carrinho, subtotal, frete, total };
}

function atualizarEndereco() {
    const precisaEndereco = tipoEntrega.value === "entrega";

    campoEndereco.hidden = !precisaEndereco;
    endereco.required = precisaEndereco;

    atualizarResumo();
}

tipoEntrega.addEventListener("change", atualizarEndereco);

// Atualiza os valores quando o checkout abre
atualizarEndereco();

form.addEventListener("submit", event => {
    event.preventDefault();

    const { carrinho, subtotal, frete, total } = atualizarResumo();

    if (carrinho.length === 0) {
        alert("Adicione produtos ao carrinho antes de continuar.");
        return;
    }

    if (!form.reportValidity()) return;

    // Registra um pedido apenas para a demonstração local
    const pedido = {
        numero: `VIN-${Date.now()}`,
        itens: carrinho,
        subtotal,
        frete,
        total,
        tipoEntrega: tipoEntrega.value,
        pagamento: document.getElementById("pagamento").value,
        data: new Date().toISOString()
    };

    localStorage.setItem("ultimoPedido", JSON.stringify(pedido));
    localStorage.removeItem("carrinho");

    document.getElementById("checkout-conteudo").innerHTML = `
        <h1>Pedido registrado!</h1>
        <p>Pedido de demonstração: ${escaparHTML(pedido.numero)}</p>
        <p>Total: ${moeda(pedido.total)}</p>
        <p>Esta é uma simulação. O pedido não foi enviado à loja e nenhum pagamento foi realizado.</p>
        <a href="../cartalago/catalago.html">Voltar à loja</a>
    `;
});