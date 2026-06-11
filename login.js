const SENHA_SECRETA = "#1um@0209!";

window.fazerLogin = function() {
    // Pega o que foi digitado no campo com id="senha"
    const inputSenha = document.getElementById("senha").value;

    if (inputSenha === SENHA_SECRETA) {
        // Criamos o carimbo com o nome EXATO: 'admin_autenticado'
        localStorage.setItem("admin_autenticado", "true");
        
        // Redireciona para o painel
        window.location.href = "admin.html"; 
    } else {
        alert("Senha incorreta! Tente novamente.");
    }
};