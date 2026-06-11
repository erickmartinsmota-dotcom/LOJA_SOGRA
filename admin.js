// 1. IMPORTAÇÕES DO FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. VERIFICAÇÃO DE SEGURANÇA (LOGIN)
if (localStorage.getItem("admin_autenticado") !== "true") {
    window.location.href = "login.html";
}

// 3. CONFIGURAÇÃO DO FIREBASE
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

// Variável para guardar os produtos carregados
let todosProdutosAdmin = [];

// 4. CARREGAR PRODUTOS DO BANCO
async function carregarProdutosAdmin() {
    try {
        const querySnapshot = await getDocs(collection(db, "produtos"));
        todosProdutosAdmin = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        window.renderizarListaAdmin(); // Chama a função para desenhar na tela
    } catch (error) {
        console.error("Erro ao carregar produtos: ", error);
        alert("Ocorreu um erro ao carregar os produtos do banco de dados.");
    }
}

// 5. DESENHAR A LISTA NA TELA (COM O NOVO VISUAL)
window.renderizarListaAdmin = () => {
    const filtroCat = document.getElementById('filtroCategoriaAdmin').value;
    const lista = document.getElementById('listaProdutosAdmin');
    lista.innerHTML = ""; 

    let filtrados = todosProdutosAdmin;
    if (filtroCat !== "Todas") {
        filtrados = todosProdutosAdmin.filter(p => p.categoria === filtroCat);
    }

    if (filtrados.length === 0) {
        lista.innerHTML = "<p style='text-align:center; color:#888; margin-top:20px;'>Nenhum produto cadastrado nesta categoria.</p>";
        return;
    }

    filtrados.forEach(p => {
        lista.innerHTML += `
            <div class="produto-card">
                <div class="produto-info">
                    <p style="font-weight: bold; color: #1E5631; font-size: 1.1rem; text-transform: uppercase; margin: 0 0 5px 0;">${p.nome}</p>
                    <p style="font-size: 0.9rem; color: #555; margin: 0 0 5px 0;">
                        R$ ${Number(p.preco).toFixed(2)} | <span style="color: #D4AF37; font-weight: bold;">${p.categoria || 'Geral'}</span>
                    </p>
                    <p style="font-size: 0.85rem; color: #888; margin: 0;">
                        Gênero: ${p.genero || 'Todos'} | Tamanhos: ${p.tamanhos || 'N/A'}
                    </p>
                </div>

                <div class="botoes-container">
                    <button class="btn-admin btn-editar" onclick="window.prepararEdicao('${p.id}')">Editar</button>
                    <button class="btn-admin btn-excluir" onclick="window.deletarProduto('${p.id}')">Excluir</button>
                </div>
            </div>
        `;
    });
};

// Quando o filtro mudar, recarrega a lista
document.getElementById('filtroCategoriaAdmin').addEventListener('change', window.renderizarListaAdmin);

// 6. SALVAR OU EDITAR PRODUTO
document.getElementById("btnSalvar").addEventListener("click", async () => {
    const id = document.getElementById("editId").value;
    const nome = document.getElementById("nomeAdmin").value.trim();
    const desc = document.getElementById("descAdmin").value.trim();
    const preco = parseFloat(document.getElementById("precoAdmin").value);
    const imagem = document.getElementById("imgAdmin").value.trim();
    const categoria = document.getElementById("catAdmin").value;
    const genero = document.getElementById("generoAdmin").value;
    const tamanhos = document.getElementById("tamanhosAdmin").value.trim();

    if (!nome || !preco || !imagem) {
        alert("Preencha pelo menos o Nome, Preço e o Link da Imagem!");
        return;
    }

    const dadosProduto = { nome, desc, preco, imagem, categoria, genero, tamanhos };

    try {
        if (id) {
            await updateDoc(doc(db, "produtos", id), dadosProduto);
            alert("Produto atualizado com sucesso!");
        } else {
            await addDoc(collection(db, "produtos"), dadosProduto);
            alert("Produto cadastrado com sucesso!");
        }
        
        window.cancelarEdicao(); 
        carregarProdutosAdmin(); 
        
    } catch (error) {
        console.error("Erro ao salvar produto:", error);
        alert("Erro ao salvar. Verifique o console.");
    }
});

// 7. PREPARAR EDIÇÃO
window.prepararEdicao = (id) => {
    const produto = todosProdutosAdmin.find(p => p.id === id);
    if (!produto) return;

    document.getElementById("editId").value = produto.id;
    document.getElementById("nomeAdmin").value = produto.nome;
    document.getElementById("descAdmin").value = produto.desc || "";
    document.getElementById("precoAdmin").value = produto.preco;
    document.getElementById("imgAdmin").value = produto.imagem;
    document.getElementById("catAdmin").value = produto.categoria || "Outros";
    document.getElementById("generoAdmin").value = produto.genero || "Todos";
    document.getElementById("tamanhosAdmin").value = produto.tamanhos || "";

    document.getElementById("statusAcao").innerText = "Editando Produto: " + produto.nome;
    document.getElementById("statusAcao").style.color = "#d9534f";
    document.getElementById("btnSalvar").innerText = "Atualizar Alterações";
    document.getElementById("btnCanc").style.display = "inline-block";
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 8. CANCELAR EDIÇÃO
window.cancelarEdicao = () => {
    document.getElementById("editId").value = "";
    document.getElementById("nomeAdmin").value = "";
    document.getElementById("descAdmin").value = "";
    document.getElementById("precoAdmin").value = "";
    document.getElementById("imgAdmin").value = "";
    document.getElementById("catAdmin").value = "Kits Mães";
    document.getElementById("generoAdmin").value = "Todos";
    document.getElementById("tamanhosAdmin").value = "";

    document.getElementById("statusAcao").innerText = "Adicionando Novo Produto";
    document.getElementById("statusAcao").style.color = "#D4AF37";
    document.getElementById("btnSalvar").innerText = "Salvar Produto";
    document.getElementById("btnCanc").style.display = "none";
};

// 9. EXCLUIR PRODUTO
window.deletarProduto = async (id) => {
    if (confirm("ATENÇÃO: Tem certeza que deseja excluir este produto do estoque?")) {
        try {
            await deleteDoc(doc(db, "produtos", id));
            alert("Produto excluído com sucesso!");
            carregarProdutosAdmin(); 
        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert("Erro ao excluir o produto.");
        }
    }
};

// 10. LOGOUT
window.fazerLogout = () => {
    localStorage.removeItem("admin_autenticado");
    window.location.href = "login.html";
};

// INICIALIZA A BUSCA NO BANCO
carregarProdutosAdmin();