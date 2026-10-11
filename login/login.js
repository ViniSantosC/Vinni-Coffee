const btnEntrar = document.getElementById("btnEntrar");
const btnCadastrar = document.getElementById("btnCadastrar");
const conteudo = document.getElementById("conteudo");
btnEntrar.addEventListener("click", function Login() {
  conteudo.innerHTML = `
    <div class="acessediv"> 
        <h1 class="acessetitulo">Acesse sua conta</h1> 
        <h2 class="acessetext"> Continue sua jornada com a VinniCoffee. </h2> 
    </div> <form id="logar" class="informacoes">
    <label for="email">E-mail</label>
     <input class="email" name="email" id="email" type="email" placeholder="Seu@email.com" /> 
     <br /> 
     <label for="senha">Senha</label>
      <input class="senha" name="senha" id="senha" type="password" placeholder="Digite sua senha" />
      <button type="submit" id="enviar" class="entrar">Entrar</button>
       </form> 
       <div class="check"> 
       <label class="checkbox-container">
        <input type="checkbox" />
         <span class="custom-checkbox"></span> 
         <span class="lembre">Lembre-me</span> </label> <a class="esqueci" href="#">Esqueci a senha</a> </div>  <p class="não"> Para sua segurança, conheça as <a href="../termos/termos.html">Condições de uso</a> </p> `;
  btnEntrar.classList.add("ativo");
  btnCadastrar.classList.remove("ativo");
});
btnCadastrar.addEventListener("click", () => {
  conteudo.innerHTML = ` <div class="acessediv"> <h1 class="acessetitulo">Crie sua conta</h1> <h2 class="acessetext"> Faça parte da VinniCoffee. </h2> </div> <form id="cadastrar" class="informacoes"> <label for="nome">Nome</label> <input class="email" name="nome" id="nome" type="text" placeholder="Seu nome" /> <br /> <label for="emailCadastro">E-mail</label> <input class="email" name="email" id="emailCadastro" type="email" placeholder="Seu@email.com" /> <br /> <label for="senhaCadastro">Senha</label> <input class="senha" name="senha" id="senhaCadastro" type="password" placeholder="Crie uma senha" />  <button type="submit" id="enviar" class="entrar"> Criar conta </button></form> <p class="não"> Para sua segurança, conheça as <a href="../termos/termos.html">Condições de uso</a> </p> `;
  btnCadastrar.classList.add("ativo");
  btnEntrar.classList.remove("ativo");
});
const sliderContainer = document.querySelector(".EntrarCadastrar");

btnEntrar.addEventListener("click", () => {
  sliderContainer.classList.remove("cadastro-ativo");
});

btnCadastrar.addEventListener("click", () => {
  sliderContainer.classList.add("cadastro-ativo");
});

conteudo.addEventListener("submit", (event) => {
  event.preventDefault();

  const formulario = event.target;
  const dados = Object.fromEntries(new FormData(formulario));

  if (formulario.id === "logar") {
    if (!dados.email || !dados.senha) {
      alert("Faltam informações!");
      return;
    }
    localStorage.setItem("token", "token");
    window.location.href = "../interface/interface.html";
  }

  if (formulario.id === "cadastrar") {
    if (!dados.nome || !dados.email || !dados.senha) {
      alert("Faltam informações!");
      return;
    }
    localStorage.setItem("token", "token");

    window.location.href = "../interface/interface.html";
  }
});
