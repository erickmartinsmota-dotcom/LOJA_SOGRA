import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCA00i6Jpjk_SFQjda-WMN2Q-QDaLEPNS8",
    authDomain: "lojinha-da-sogra.firebaseapp.com",
    projectId: "lojinha-da-sogra",
    storageBucket: "lojinha-da-sogra.firebasestorage.app",
    messagingSenderId: "637321141515",
    appId: "1:637321141515:web:715fdc3a661491d7e4d60e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let todosProdutosAdmin = [];

onAuthStateChanged(auth, (user) => { 
    if (!user) window.location.href = "login.html"; 
    else carregarProdutosAdmin(); 
});

document.getElementById('btnSalvar').addEventListener('click', async () => {
    const id = document.getElementById('editId').value;
    
    // Pega o texto da caixa e separa linha por linha para criar a galeria
    const textoImagens = document.getElementById('imgAdmin').value;
    const arrayImagens = textoImagens.split('\n').map(link => link.trim()).filter(link => link !== '');

    


    const dados = {
        nome: document.getElementById('nomeAdmin').value,
        descricao: document.getElementById('descAdmin').value,
        preco: parseFloat(document.getElementById('precoAdmin').value),
        imagens: arrayImagens, // Nova forma: Guarda VÁRIAS imagens
        imagem: arrayImagens[0] || "", // Mantem compatibilidade com a antiga
        categoria: document.getElementById('catAdmin').value,
        genero: document.getElementById('generoAdmin').value,
        tamanhos: document.getElementById('tamanhosAdmin').value
    };

    try {
        if (id) await updateDoc(doc(db, "produtos", id), dados);
        else await addDoc(collection(db, "produtos"), dados);
        location.reload(); 
    } catch (e) {
        console.error(e); alert("Deu erro! Olhe o Console (F12).");
    }
});

document.getElementById('filtroCategoriaAdmin').addEventListener('change', renderizarListaAdmin);

async function carregarProdutosAdmin() {
    const docs = await getDocs(collection(db, "produtos"));
    todosProdutosAdmin = []; 
    docs.forEach(d => { let p = d.data(); p.id = d.id; todosProdutosAdmin.push(p); });
    renderizarListaAdmin(); 
}

function renderizarListaAdmin() {
    const lista = document.getElementById('listaProdutosAdmin');
    const categoriaSelecionada = document.getElementById('filtroCategoriaAdmin').value;
    lista.innerHTML = '';

    const filtrados = categoriaSelecionada === 'Todas' ? todosProdutosAdmin : todosProdutosAdmin.filter(p => p.categoria === categoriaSelecionada);

    if (filtrados.length === 0) {
        lista.innerHTML = `<p style="text-align: center; color: #666; padding: 20px;">Nenhum produto encontrado.</p>`; return;
    }

    filtrados.forEach(p => {
        let generoTag = p.genero && p.genero !== 'Todos' ? ` | ${p.genero}` : '';
        // CÓDIGO MAIS LIMPO: Passa só o ID para a função de editar
        lista.innerHTML += `
            <div style="background:#fff; padding:15px; margin-bottom:10px; border:1px solid #ddd; border-radius:5px; display:flex; justify-content:space-between; align-items:center; color: #333; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <span><strong>${p.nome}</strong> <span style="font-size:0.75rem; color: #1E5631; background: #e9f5ec; padding: 2px 6px; border-radius: 4px; margin-left: 5px;">${p.categoria || 'Sem Cat'}${generoTag}</span></span>
                <div>
                    <button onclick="prepararEdicao('${p.id}')" style="background:#D4AF37; color: #333; font-weight: bold; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Editar</button>
                    <button onclick="deletar('${p.id}')" style="background:#dc3545; color:white; font-weight: bold; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Excluir</button>
                </div>
            </div>`;
    });
}

// Melhoria: Busca os dados direto da memória para não bugar textos longos (como múltiplos links)
window.prepararEdicao = (id) => {
    const p = todosProdutosAdmin.find(item => item.id === id);
    document.getElementById('editId').value = p.id;
    document.getElementById('nomeAdmin').value = p.nome;
    document.getElementById('descAdmin').value = p.descricao;
    document.getElementById('precoAdmin').value = p.preco;
    document.getElementById('tamanhosAdmin').value = p.tamanhos || "";
    
    // Transforma a lista de volta em texto quebrado por linhas
    let imagensTexto = p.imagens && p.imagens.length > 0 ? p.imagens.join('\n') : (p.imagem || '');
    document.getElementById('imgAdmin').value = imagensTexto;
    
    document.getElementById('catAdmin').value = p.categoria || "Outros";
    document.getElementById('generoAdmin').value = p.genero || "Todos";
    document.getElementById('statusAcao').innerText = "✏️ Editando Produto";
    document.getElementById('btnCanc').style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.cancelarEdicao = () => location.reload();
window.deletar = async (id) => { if(confirm("EXCLUIR este produto definitivamente?")) { await deleteDoc(doc(db, "produtos", id)); location.reload(); } };
window.fazerLogout = () => signOut(auth).then(() => window.location.href = "login.html");