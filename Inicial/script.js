const home = document.getElementById("home");

if (estaLogado()) {
    window.location.href = "../interface/interface.html"
} else {
    window.location.href = "../login/login.html"
}