function estaLogado() {
    return localStorage.getItem("token") !== null;
}