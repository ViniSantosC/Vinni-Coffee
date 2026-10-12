const produtos = document.querySelectorAll(".produto");

const busca = document.getElementById("busca");
const preco = document.getElementById("preco");
const valorAtual = document.getElementById("valor-atual");

const filtros = document.querySelectorAll("[data-filtro]");

function filtrarProdutos() {
    // Categorias selecionadas
    const categorias = [
        ...document.querySelectorAll(
            '[data-filtro="categoria"]:checked'
        )
    ].map(filtro => filtro.value);

    // Torras selecionadas
    const torras = [
        ...document.querySelectorAll(
            '[data-filtro="torra"]:checked'
        )
    ].map(filtro => filtro.value);

    // Texto pesquisado
    const textoBusca = busca.value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    // Preço máximo escolhido
    const precoMaximo = Number(preco.value);

    produtos.forEach(produto => {
        const categoria = produto.dataset.categoria;
        const torra = produto.dataset.torra;
        const precoProduto = Number(produto.dataset.preco);

        const nome = produto.querySelector("h1")
            .textContent
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        // Verifica cada condição
        const categoriaValida =
            categorias.length === 0 ||
            categorias.includes(categoria);

        const torraValida =
            torras.length === 0 ||
            torras.includes(torra);

        const precoValido =
            precoProduto <= precoMaximo;

        const buscaValida =
            nome.includes(textoBusca);

        // Mostra somente os produtos aprovados
        produto.hidden = !(
            categoriaValida &&
            torraValida &&
            precoValido &&
            buscaValida
        );
    });

    valorAtual.textContent = precoMaximo;
}

// Atualiza quando o usuário pesquisa
busca.addEventListener("input", filtrarProdutos);

// Atualiza quando altera o preço
preco.addEventListener("input", filtrarProdutos);

// Atualiza quando marca ou desmarca filtros
filtros.forEach(filtro => {
    filtro.addEventListener("change", filtrarProdutos);
});

// Executa a filtragem inicial
filtrarProdutos();

function lerCarrinhoSalvo() {
    try {
        const dados = JSON.parse(
            localStorage.getItem("carrinho") || "[]"
        );

        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

const areaProdutosCatalogo = document.querySelector(".produtos");

areaProdutosCatalogo.addEventListener("click", (event) => {
    const botao = event.target.closest(".adicionar-carrinho");

    if (!botao) return;

    const produto = botao.closest(".produto");

    if (!produto) return;

    const id = produto.dataset.id;
    const nome = produto.querySelector("h1").textContent.trim();
    const preco = Number(produto.dataset.preco);
    const imagem = produto.querySelector("img").getAttribute("src");

    if (!id || !Number.isFinite(preco) || preco < 0) {
        alert("Não foi possível adicionar esse produto.");
        return;
    }

    const carrinho = lerCarrinhoSalvo();

    // Verifica se o produto já está no carrinho
    const existente = carrinho.find(item => item.id === id);

    if (existente) {
        // Se já existe, aumenta a quantidade
        existente.quantidade++;
    } else {
        // Se não existe, adiciona um novo item
        carrinho.push({
            id: id,
            nome: nome,
            preco: preco,
            imagem: imagem,
            quantidade: 1
        });
    }

    // Salva os dados no navegador
    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    alert(`${nome} foi adicionado ao carrinho!`);
});
const descricao = produto.querySelector("p")?.textContent.trim() || "";
const peso = produto.dataset.peso || "";