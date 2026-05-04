// login.js
const SENHA_SECRETA = "1234"; 

window.verificar = () => {
    const senhaDigitada = document.getElementById('senha').value;
    
    if (senhaDigitada === SENHA_SECRETA) {
        localStorage.setItem('admin_autenticado', 'true');
        alert("Acesso autorizado!");
        window.location.href = "admin.html";
    } else {
        alert("Senha incorreta!");
    }
};