import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCA00i6Jpjk_SFQjda-WMN2Q-QDaLEPNS8",
  authDomain: "lojinha-da-sogra.firebaseapp.com",
  projectId: "lojinha-da-sogra",
  storageBucket: "lojinha-da-sogra.firebasestorage.app",
  messagingSenderId: "637321141515",
  appId: "1:637321141515:web:715fdc3a661491d7e4d60e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('btnEntrar').addEventListener('click', async () => {
    const email = document.getElementById('emailLogin').value;
    const senha = document.getElementById('senhaLogin').value;
    try {
        await signInWithEmailAndPassword(auth, email, senha);
        window.location.href = "Admin.html"; 
    } catch (erro) {
        alert("❌ E-mail ou senha incorretos!");
    }
});