/**
 * SISTEMA DE GESTÃO DE ALMOXARIFADO - LGEX METALOMECÂNICA
 * Versão Web com Firebase - SEM PIN
 * Desenvolvedor: Ricardo Barros
 * 
 * PERMISSÕES:
 * - Funcionário: Apenas consulta (ver materiais e histórico)
 * - Administrador: Controle total (cadastrar, editar, excluir, registrar movimentações)
 */

// ========== CONFIGURAÇÃO FIREBASE ==========
// VOCÊ DEVE SUBSTITUIR ESTAS CONFIGURAÇÕES PELAS SUAS!
const firebaseConfig = {
  apiKey: "AIzaSyBr0TJkpDC_tucIRz4lmSc5TeU03sYyL2k",
  authDomain: "lgex-almoxarifado.firebaseapp.com",
  projectId: "lgex-almoxarifado",
  storageBucket: "lgex-almoxarifado.firebasestorage.app",
  messagingSenderId: "555548417766",
  appId: "1:555548417766:web:85dbe363620264bfa2a527"
};


// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Configurar provedor Google
const googleProvider = new firebase.auth.GoogleAuthProvider();

// ========== VARIÁVEIS GLOBAIS ==========
let currentUser = null;
let userRole = 'funcionario'; // 'admin' ou 'funcionario'
let materiaisCache = [];
let utilizadoresCache = [];

// ========== AUTENTICAÇÃO ==========

// Verificar estado de autenticação
auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    await carregarDadosUsuario(user);
    mostrarApp();
  } else {
    mostrarLogin();
  }
});

// Login com Google
document.getElementById('btnGoogleLogin').addEventListener('click', async () => {
  try {
    showLoading(true);
    const result = await auth.signInWithPopup(googleProvider);
    // Verificar se é primeiro acesso e criar registro
    await verificarPrimeiroAcesso(result.user);
  } catch (error) {
    console.error('Erro no login:', error);
    alert('Erro ao fazer login: ' + error.message);
    showLoading(false);
  }
});

// Logout
function logout() {
  if (confirm('Deseja realmente sair?')) {
    auth.signOut();
  }
}

// Verificar primeiro acesso (SEM PIN)
async function verificarPrimeiroAcesso(user) {
  const userDoc = await db.collection('utilizadores').doc(user.uid).get();
  
  if (!userDoc.exists) {
    // Primeiro usuário é admin automaticamente
    const snapshot = await db.collection('utilizadores').get();
    const isPrimeiroUsuario = snapshot.empty;
    
    // Criar registro do usuário
    await db.collection('utilizadores').doc(user.uid).set({
      nome: user.displayName,
      email: user.email,
      role: isPrimeiroUsuario ? 'admin' : 'funcionario',
      fotoPerfil: user.photoURL,
      criadoEm: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    if (isPrimeiroUsuario) {
      alert('Bem-vindo! Você é o primeiro usuário e foi definido como Administrador.');
    } else {
      alert('Cadastro realizado!\n\nVocê foi registrado como Funcionário (apenas consulta).\n\nSe precisar de acesso administrativo, solicite ao administrador do sistema.');
    }
  }
}

// Carregar dados do usuário
async function carregarDadosUsuario(user) {
  const userDoc = await db.collection('utilizadores').doc(user.uid).get();
  const userData = userDoc.data();
  
  userRole = userData.role || 'funcionario';
  
  // Atualizar interface
  document.getElementById('userName').textContent = userData.nome;
  document.getElementById('userAvatar').src = userData.fotoPerfil || 'https://via.placeholder.com/40';
  
  const roleBadge = document.getElementById('userRole');
  if (userRole === 'admin') {
    roleBadge.className = 'admin-badge';
    roleBadge.textContent = 'Administrador';
    document.getElementById('adminButtons').style.display = 'flex';
    // Mostrar botão de registro na navegação mobile
    const btnNavReg = document.getElementById('btnNavReg');
    if (btnNavReg) btnNavReg.style.display = 'block';
  } else {
    roleBadge.className = 'employee-badge';
    roleBadge.textContent = 'Funcionário';
    document.getElementById('adminButtons').style.display = 'none';
    // Esconder botão de registro na navegação mobile
    const btnNavReg = document.getElementById('btnNavReg');
    if (btnNavReg) btnNavReg.style.display = 'none';
  }
}

// ========== INTERFACE ==========

function mostrarLogin() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
  document.getElementById('bottomNav').classList.remove('active');
  showLoading(false);
}

function mostrarApp() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('bottomNav').classList.add('active');
  showLoading(false);
  carregarDashboard();
  carregarCaches();
}

function showLoading(show) {
  if (show) {
    document.getElementById('loadingOverlay').classList.add('active');
  } else {
    document.getElementById('loadingOverlay').classList.remove('active');
  }
}

function abrir(secao) {
  // Esconder dashboard
  document.getElementById('viewDash').style.display = 'none';
  
  // Esconder todas as seções
  document.querySelectorAll('.section-container').forEach(s => {
    s.style.display = 'none';
  });
  
  // Mostrar seção selecionada
  document.getElementById(secao).style.display = 'block';
  
  // Carregar dados específicos se necessário
  if (secao === 'secEdit') {
    carregarEdicao('materiais');
    
    // Listener para alternar tipo de edição
    document.querySelectorAll('input[name="tEdit"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        carregarEdicao(e.target.value);
      });
    });
  }
}

// Abrir seção apenas se for admin
function abrirSeAdmin(secao) {
  if (userRole !== 'admin') {
    alert('Acesso negado!\n\nApenas administradores podem registrar movimentações.\n\nVocê tem permissão apenas para consultar materiais e histórico.');
    return;
  }
  abrir(secao);
}

function voltar() {
  document.querySelectorAll('.section-container').forEach(s => {
    s.style.display = 'none';
  });
  document.getElementById('viewDash').style.display = 'block';
  carregarDashboard();
}

// ========== DASHBOARD ==========

async function carregarDashboard() {
  try {
    // Carregar materiais
    const matSnapshot = await db.collection('materiais').get();
    const materiais = matSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    
    // Carregar registros
    const regSnapshot = await db.collection('registros').get();
    
    // Calcular estatísticas
    const total = materiais.length;
    const avariados = materiais.filter(m => m.estado === 'Avariado').length;
    
    // Manutenções pendentes
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const manutencao = materiais.filter(m => {
      if (!m.manutencao) return false;
      const dataManut = new Date(m.manutencao);
      return dataManut <= hoje;
    }).length;
    
    const registros = regSnapshot.size;
    
    // Atualizar cards
    document.getElementById('stTotal').textContent = total;
    document.getElementById('stAvarias').textContent = avariados;
    document.getElementById('stManut').textContent = manutencao;
    document.getElementById('stRegs').textContent = registros;
    
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    alert('Erro ao carregar dados do dashboard');
  }
}

// ========== CACHE DE LISTAS ==========

async function carregarCaches() {
  try {
    // Materiais
    const matSnapshot = await db.collection('materiais').orderBy('nome').get();
    materiaisCache = matSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Utilizadores
    const usrSnapshot = await db.collection('utilizadores').orderBy('nome').get();
    utilizadoresCache = usrSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Preencher selects
    preencherSelectMateriais();
    
  } catch (error) {
    console.error('Erro ao carregar caches:', error);
  }
}

function preencherSelectMateriais() {
  const selectReg = document.getElementById('rMaterial');
  const selectCons = document.getElementById('consMaterial');
  
  let optionsHTML = '<option value="">Selecione um material...</option>';
  
  materiaisCache.forEach(mat => {
    optionsHTML += `<option value="${mat.id}" data-estado="${mat.estado}">
      ${mat.codigo} - ${mat.nome} (${mat.categoria})
    </option>`;
  });
  
  selectReg.innerHTML = optionsHTML;
  selectCons.innerHTML = optionsHTML;
  
  // Listener para mostrar estado do material
  selectReg.addEventListener('change', (e) => {
    const option = e.target.selectedOptions[0];
    if (option) {
      const estado = option.dataset.estado || 'N/A';
      document.getElementById('rEstado').value = estado;
    }
  });
}

// ========== MOVIMENTAÇÃO (APENAS ADMIN - SEM PIN) ==========

async function salvarMovimentacao() {
  try {
    // VERIFICAR SE É ADMIN
    if (userRole !== 'admin') {
      alert('Acesso negado!\n\nApenas administradores podem registrar movimentações.');
      return;
    }
    
    const tipo = document.querySelector('input[name="tMov"]:checked').value;
    const materialId = document.getElementById('rMaterial').value;
    const obs = document.getElementById('rObs').value;
    
    // Validações
    if (!materialId) {
      alert('Selecione um material!');
      return;
    }
    
    showLoading(true);
    
    // Buscar dados do material
    const materialDoc = await db.collection('materiais').doc(materialId).get();
    const materialData = materialDoc.data();
    
    // Buscar dados do usuário
    const userDoc = await db.collection('utilizadores').doc(currentUser.uid).get();
    const userData = userDoc.data();
    
    // Registrar movimentação (SEM VALIDAÇÃO DE PIN)
    await db.collection('registros').add({
      tipo: tipo,
      materialId: materialId,
      materialCodigo: materialData.codigo,
      materialNome: materialData.nome,
      usuarioId: currentUser.uid,
      usuarioNome: userData.nome,
      usuarioEmail: userData.email,
      observacoes: obs,
      dataHora: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    showLoading(false);
    alert(`✅ ${tipo} registrada com sucesso!\n\nMaterial: ${materialData.nome}\nResponsável: ${userData.nome}`);
    
    // Limpar formulário
    document.getElementById('rMaterial').value = '';
    document.getElementById('rEstado').value = '';
    document.getElementById('rObs').value = '';
    
    voltar();
    
  } catch (error) {
    showLoading(false);
    console.error('Erro ao salvar movimentação:', error);
    alert('Erro ao salvar movimentação: ' + error.message);
  }
}

// ========== CONSULTA DE HISTÓRICO (TODOS) ==========

async function buscarHistorico() {
  try {
    const materialId = document.getElementById('consMaterial').value;
    
    if (!materialId) {
      alert('Selecione um material!');
      return;
    }
    
    showLoading(true);
    
    const snapshot = await db.collection('registros')
      .where('materialId', '==', materialId)
      .orderBy('dataHora', 'desc')
      .get();
    
    const divRes = document.getElementById('resConsulta');
    
    if (snapshot.empty) {
      divRes.innerHTML = `
        <div class="alert alert-warning">
          <span class="material-icons align-middle">info</span>
          Nenhum registro encontrado para este material.
        </div>
      `;
      showLoading(false);
      return;
    }
    
    let html = `
      <div class="alert alert-info mb-3">
        <strong>Total de registros:</strong> ${snapshot.size}
      </div>
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th>Data/Hora</th>
              <th>Tipo</th>
              <th>Responsável</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    snapshot.forEach(doc => {
      const reg = doc.data();
      const data = reg.dataHora ? reg.dataHora.toDate() : new Date();
      const dataFormatada = data.toLocaleString('pt-PT');
      
      const tipoClass = reg.tipo === 'Retirada' ? 'text-danger' : 'text-success';
      const tipoIcon = reg.tipo === 'Retirada' ? 'output' : 'input';
      
      html += `
        <tr>
          <td><small>${dataFormatada}</small></td>
          <td>
            <span class="${tipoClass} fw-bold">
              <span class="material-icons align-middle" style="font-size: 16px;">${tipoIcon}</span>
              ${reg.tipo}
            </span>
          </td>
          <td>${reg.usuarioNome}</td>
          <td>${reg.observacoes || '-'}</td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
    `;
    
    divRes.innerHTML = html;
    showLoading(false);
    
  } catch (error) {
    showLoading(false);
    console.error('Erro ao buscar histórico:', error);
    alert('Erro ao buscar histórico: ' + error.message);
  }
}

// ========== TABELAS/LISTAS (TODOS) ==========

async function exibirTabela(tipo) {
  try {
    showLoading(true);
    abrir('secList');
    
    let titulo = '';
    let dados = [];
    
    if (tipo === 'Materiais') {
      titulo = '📦 Lista de Materiais';
      const snapshot = await db.collection('materiais').orderBy('codigo').get();
      dados = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      
      montarTabelaMateriais(dados, titulo);
      
    } else if (tipo === 'Avariados') {
      titulo = '⚠️ Itens Avariados';
      const snapshot = await db.collection('materiais')
        .where('estado', '==', 'Avariado')
        .orderBy('codigo')
        .get();
      dados = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      
      if (dados.length === 0) {
        document.getElementById('tabContent').innerHTML = `
          <div class="alert alert-success text-center">
            <span class="material-icons" style="font-size: 50px;">check_circle</span>
            <p class="mt-2 mb-0"><strong>Excelente!</strong> Nenhum item avariado.</p>
          </div>
        `;
      } else {
        montarTabelaMateriais(dados, titulo);
      }
      
    } else if (tipo === 'Manutencao') {
      titulo = '🔧 Manutenções Pendentes';
      const snapshot = await db.collection('materiais').get();
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      dados = snapshot.docs
        .map(doc => ({id: doc.id, ...doc.data()}))
        .filter(m => {
          if (!m.manutencao) return false;
          const dataManut = new Date(m.manutencao);
          return dataManut <= hoje;
        });
      
      if (dados.length === 0) {
        document.getElementById('tabContent').innerHTML = `
          <div class="alert alert-success text-center">
            <span class="material-icons" style="font-size: 50px;">check_circle</span>
            <p class="mt-2 mb-0"><strong>Tudo em dia!</strong> Nenhuma manutenção pendente.</p>
          </div>
        `;
      } else {
        montarTabelaMateriais(dados, titulo);
      }
      
    } else if (tipo === 'Registros') {
      titulo = '📋 Histórico de Movimentações';
      const snapshot = await db.collection('registros')
        .orderBy('dataHora', 'desc')
        .limit(100)
        .get();
      dados = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      
      montarTabelaRegistros(dados);
    }
    
    document.getElementById('listTitle').innerHTML = titulo;
    showLoading(false);
    
  } catch (error) {
    showLoading(false);
    console.error('Erro ao exibir tabela:', error);
    alert('Erro ao carregar dados: ' + error.message);
  }
}

function montarTabelaMateriais(dados, titulo) {
  let html = `
    <div class="table-responsive">
      <table class="table table-hover" id="mainTab">
        <thead class="table-dark">
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Estado</th>
            <th>Quantidade</th>
            <th>Manutenção</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  dados.forEach(mat => {
    const estadoClass = mat.estado === 'Bom' ? 'success' : 
                       mat.estado === 'Regular' ? 'warning' : 'danger';
    
    const manutFormatada = mat.manutencao ? 
      new Date(mat.manutencao).toLocaleDateString('pt-PT') : '-';
    
    html += `
      <tr>
        <td><strong>${mat.codigo}</strong></td>
        <td>${mat.nome}</td>
        <td><span class="badge bg-secondary">${mat.categoria}</span></td>
        <td><span class="badge bg-${estadoClass}">${mat.estado}</span></td>
        <td>${mat.quantidade}</td>
        <td>${manutFormatada}</td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
  `;
  
  document.getElementById('tabContent').innerHTML = html;
}

function montarTabelaRegistros(dados) {
  let html = `
    <div class="alert alert-info">
      <strong>Mostrando últimos 100 registros</strong>
    </div>
    <div class="table-responsive">
      <table class="table table-hover table-sm" id="mainTab">
        <thead class="table-dark">
          <tr>
            <th>Data/Hora</th>
            <th>Tipo</th>
            <th>Material</th>
            <th>Responsável</th>
            <th>Observações</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  dados.forEach(reg => {
    const data = reg.dataHora ? reg.dataHora.toDate() : new Date();
    const dataFormatada = data.toLocaleString('pt-PT');
    
    const tipoClass = reg.tipo === 'Retirada' ? 'danger' : 'success';
    
    html += `
      <tr>
        <td><small>${dataFormatada}</small></td>
        <td><span class="badge bg-${tipoClass}">${reg.tipo}</span></td>
        <td>${reg.materialCodigo} - ${reg.materialNome}</td>
        <td>${reg.usuarioNome}</td>
        <td>${reg.observacoes || '-'}</td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
  `;
  
  document.getElementById('tabContent').innerHTML = html;
}

function filtrarTabela() {
  const filtro = document.getElementById('tableFilter').value.toUpperCase();
  const linhas = document.querySelectorAll('#mainTab tbody tr');
  
  linhas.forEach(linha => {
    const texto = linha.textContent || linha.innerText;
    if (texto.toUpperCase().indexOf(filtro) > -1) {
      linha.style.display = '';
    } else {
      linha.style.display = 'none';
    }
  });
}

// ========== CADASTRO DE MATERIAL (APENAS ADMIN) ==========

async function salvarMaterial() {
  try {
    if (userRole !== 'admin') {
      alert('Acesso negado!\n\nApenas administradores podem cadastrar materiais!');
      return;
    }
    
    const nome = document.getElementById('mNome').value.trim();
    const categoria = document.getElementById('mCat').value;
    const estado = document.getElementById('mEst').value;
    const qtd = parseInt(document.getElementById('mQtd').value) || 1;
    const manutencao = document.getElementById('mMan').value;
    
    if (!nome) {
      alert('Preencha o nome do material!');
      return;
    }
    
    showLoading(true);
    
    // Gerar código automático
    const snapshot = await db.collection('materiais').orderBy('codigo', 'desc').limit(1).get();
    let novoCodigo = 'MAT-001';
    
    if (!snapshot.empty) {
      const ultimoCodigo = snapshot.docs[0].data().codigo;
      const numero = parseInt(ultimoCodigo.split('-')[1]) + 1;
      novoCodigo = `MAT-${numero.toString().padStart(3, '0')}`;
    }
    
    // Salvar material
    await db.collection('materiais').add({
      codigo: novoCodigo,
      nome: nome,
      categoria: categoria,
      estado: estado,
      quantidade: qtd,
      manutencao: manutencao || null,
      criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
      criadoPor: currentUser.uid
    });
    
    showLoading(false);
    alert(`✅ Material cadastrado com sucesso!\n\nCódigo: ${novoCodigo}\nNome: ${nome}`);
    
    // Limpar formulário
    document.getElementById('mNome').value = '';
    document.getElementById('mQtd').value = '1';
    document.getElementById('mMan').value = '';
    
    // Atualizar cache
    await carregarCaches();
    
    voltar();
    
  } catch (error) {
    showLoading(false);
    console.error('Erro ao salvar material:', error);
    alert('Erro ao salvar material: ' + error.message);
  }
}

// ========== CADASTRO DE UTILIZADOR (APENAS ADMIN - SEM PIN) ==========

async function salvarUtilizador() {
  try {
    if (userRole !== 'admin') {
      alert('Acesso negado!\n\nApenas administradores podem cadastrar utilizadores!');
      return;
    }
    
    const nome = document.getElementById('uNome').value.trim();
    const email = document.getElementById('uEmail').value.trim();
    const role = document.getElementById('uRole').value;
    
    if (!nome || !email) {
      alert('Preencha todos os campos!');
      return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Digite um e-mail válido!');
      return;
    }
    
    showLoading(true);
    
    // Verificar se já existe utilizador com este email
    const existente = await db.collection('utilizadores')
      .where('email', '==', email)
      .get();
    
    if (!existente.empty) {
      showLoading(false);
      alert('Já existe um utilizador com este e-mail!');
      return;
    }
    
    // Criar utilizador (SEM PIN)
    await db.collection('utilizadores').add({
      nome: nome,
      email: email,
      role: role,
      fotoPerfil: null,
      ativo: true,
      criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
      criadoPor: currentUser.uid
    });
    
    showLoading(false);
    
    const nivelTexto = role === 'admin' ? 'Administrador (controle total)' : 'Funcionário (apenas consulta)';
    
    alert(`✅ Utilizador cadastrado com sucesso!\n\nNome: ${nome}\nE-mail: ${email}\nNível: ${nivelTexto}\n\nOriente o usuário a fazer login com a conta Google associada ao e-mail: ${email}`);
    
    // Limpar formulário
    document.getElementById('uNome').value = '';
    document.getElementById('uEmail').value = '';
    
    // Atualizar cache
    await carregarCaches();
    
    voltar();
    
  } catch (error) {
    showLoading(false);
    console.error('Erro ao salvar utilizador:', error);
    alert('Erro ao salvar utilizador: ' + error.message);
  }
}

// ========== EDIÇÃO E EXCLUSÃO (APENAS ADMIN) ==========

async function carregarEdicao(tipo) {
  if (userRole !== 'admin') {
    document.getElementById('editContent').innerHTML = `
      <div class="alert alert-danger">
        <span class="material-icons align-middle">block</span>
        Apenas administradores podem editar registros.
      </div>
    `;
    return;
  }
  
  showLoading(true);
  
  try {
    const divContent = document.getElementById('editContent');
    
    if (tipo === 'materiais') {
      const snapshot = await db.collection('materiais').orderBy('codigo').get();
      const materiais = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      
      let html = `
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Estado</th>
                <th>Qtd</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      materiais.forEach(mat => {
        html += `
          <tr>
            <td><strong>${mat.codigo}</strong></td>
            <td>${mat.nome}</td>
            <td><span class="badge bg-secondary">${mat.estado}</span></td>
            <td>${mat.quantidade}</td>
            <td>
              <button class="btn btn-sm btn-primary" onclick="editarMaterial('${mat.id}')">
                <span class="material-icons" style="font-size: 16px;">edit</span>
              </button>
              <button class="btn btn-sm btn-danger" onclick="excluirMaterial('${mat.id}', '${mat.codigo}')">
                <span class="material-icons" style="font-size: 16px;">delete</span>
              </button>
            </td>
          </tr>
        `;
      });
      
      html += `
            </tbody>
          </table>
        </div>
      `;
      
      divContent.innerHTML = html;
      
    } else if (tipo === 'utilizadores') {
      const snapshot = await db.collection('utilizadores').orderBy('nome').get();
      const utilizadores = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      
      let html = `
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Nível</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      utilizadores.forEach(usr => {
        const isCurrentUser = usr.id === currentUser.uid;
        const roleBadge = usr.role === 'admin' ? 
          '<span class="badge bg-danger">Admin</span>' : 
          '<span class="badge bg-success">Funcionário</span>';
        
        html += `
          <tr>
            <td>${usr.nome}</td>
            <td>${usr.email}</td>
            <td>${roleBadge}</td>
            <td>
              ${!isCurrentUser ? `
                <button class="btn btn-sm btn-primary" onclick="editarUtilizador('${usr.id}')">
                  <span class="material-icons" style="font-size: 16px;">edit</span>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirUtilizador('${usr.id}', '${usr.nome}')">
                  <span class="material-icons" style="font-size: 16px;">delete</span>
                </button>
              ` : '<small class="text-muted">Você mesmo</small>'}
            </td>
          </tr>
        `;
      });
      
      html += `
            </tbody>
          </table>
        </div>
      `;
      
      divContent.innerHTML = html;
    }
    
    showLoading(false);
    
  } catch (error) {
    showLoading(false);
    console.error('Erro ao carregar edição:', error);
    alert('Erro ao carregar dados: ' + error.message);
  }
}

async function editarMaterial(id) {
  try {
    const doc = await db.collection('materiais').doc(id).get();
    const mat = doc.data();
    
    const novoNome = prompt('Nome do Material:', mat.nome);
    if (!novoNome) return;
    
    const novoEstado = prompt('Estado (Bom, Regular, Avariado):', mat.estado);
    if (!novoEstado) return;
    
    const novaQtd = prompt('Quantidade:', mat.quantidade);
    if (!novaQtd) return;
    
    showLoading(true);
    
    await db.collection('materiais').doc(id).update({
      nome: novoNome,
      estado: novoEstado,
      quantidade: parseInt(novaQtd)
    });
    
    showLoading(false);
    alert('✅ Material atualizado com sucesso!');
    
    carregarEdicao('materiais');
    await carregarCaches();
    
  } catch (error) {
    showLoading(false);
    console.error('Erro ao editar material:', error);
    alert('Erro ao editar: ' + error.message);
  }
}

async function excluirMaterial(id, codigo) {
  if (!confirm(`Deseja realmente excluir o material ${codigo}?\n\nEsta ação não pode ser desfeita!`)) {
    return;
  }
  
  try {
    showLoading(true);
    
    await db.collection('materiais').doc(id).delete();
    
    showLoading(false);
    alert('✅ Material excluído com sucesso!');
    
    carregarEdicao('materiais');
    await carregarCaches();
    
  } catch (error) {
    showLoading(false);
    console.error('Erro ao excluir material:', error);
    alert('Erro ao excluir: ' + error.message);
  }
}

async function editarUtilizador(id) {
  try {
    const doc = await db.collection('utilizadores').doc(id).get();
    const usr = doc.data();
    
    const novoNome = prompt('Nome:', usr.nome);
    if (!novoNome) return;
    
    const novoRole = prompt('Nível (admin ou funcionario):', usr.role);
    if (!novoRole || (novoRole !== 'admin' && novoRole !== 'funcionario')) {
      alert('Nível inválido! Use: admin ou funcionario');
      return;
    }
    
    showLoading(true);
    
    await db.collection('utilizadores').doc(id).update({
      nome: novoNome,
      role: novoRole
    });
    
    showLoading(false);
    alert('✅ Utilizador atualizado com sucesso!');
    
    carregarEdicao('utilizadores');
    await carregarCaches();
    
  } catch (error) {
    showLoading(false);
    console.error('Erro ao editar utilizador:', error);
    alert('Erro ao editar: ' + error.message);
  }
}

async function excluirUtilizador(id, nome) {
  if (!confirm(`Deseja realmente excluir o utilizador ${nome}?\n\nEsta ação não pode ser desfeita!`)) {
    return;
  }
  
  try {
    showLoading(true);
    
    await db.collection('utilizadores').doc(id).delete();
    
    showLoading(false);
    alert('✅ Utilizador excluído com sucesso!');
    
    carregarEdicao('utilizadores');
    await carregarCaches();
    
  } catch (error) {
    showLoading(false);
    console.error('Erro ao excluir utilizador:', error);
    alert('Erro ao excluir: ' + error.message);
  }
}

// ========== RELATÓRIO PDF ==========

async function gerarRelatorio() {
  if (!confirm('Deseja gerar um relatório PDF completo?\n\nO arquivo será baixado automaticamente.')) {
    return;
  }
  
  try {
    showLoading(true);
    
    // Buscar todos os dados
    const matSnapshot = await db.collection('materiais').orderBy('codigo').get();
    const materiais = matSnapshot.docs.map(doc => doc.data());
    
    const regSnapshot = await db.collection('registros')
      .orderBy('dataHora', 'desc')
      .limit(50)
      .get();
    const registros = regSnapshot.docs.map(doc => doc.data());
    
    // Criar HTML para PDF
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #1e3c72; text-align: center; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
          h2 { color: #1e3c72; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background: #1e3c72; color: white; padding: 10px; text-align: left; }
          td { border: 1px solid #ddd; padding: 8px; }
          tr:nth-child(even) { background: #f2f2f2; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>LGEX Metalomecânica Unipessoal Lda</h1>
        <p style="text-align: center;"><strong>Relatório de Almoxarifado</strong></p>
        <p style="text-align: center;">Gerado em: ${new Date().toLocaleString('pt-PT')}</p>
        <p style="text-align: center;">Por: ${currentUser.displayName}</p>
        
        <h2>📦 Lista de Materiais</h2>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Estado</th>
              <th>Quantidade</th>
              <th>Manutenção</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    materiais.forEach(mat => {
      const manutFormatada = mat.manutencao ? 
        new Date(mat.manutencao).toLocaleDateString('pt-PT') : '-';
      
      html += `
        <tr>
          <td>${mat.codigo}</td>
          <td>${mat.nome}</td>
          <td>${mat.categoria}</td>
          <td>${mat.estado}</td>
          <td>${mat.quantidade}</td>
          <td>${manutFormatada}</td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
        
        <h2>📋 Últimas Movimentações (50)</h2>
        <table>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Tipo</th>
              <th>Material</th>
              <th>Responsável</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    registros.forEach(reg => {
      const data = reg.dataHora ? reg.dataHora.toDate() : new Date();
      const dataFormatada = data.toLocaleString('pt-PT');
      
      html += `
        <tr>
          <td>${dataFormatada}</td>
          <td>${reg.tipo}</td>
          <td>${reg.materialCodigo} - ${reg.materialNome}</td>
          <td>${reg.usuarioNome}</td>
          <td>${reg.observacoes || '-'}</td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
        
        <div class="footer">
          <p><strong>LGEX Metalomecânica Unipessoal Lda</strong></p>
          <p>Sistema desenvolvido por Ricardo Barros</p>
          <p>SEM PIN - Controle apenas por nível de acesso</p>
        </div>
      </body>
      </html>
    `;
    
    // Converter HTML para PDF e baixar
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio_LGEX_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showLoading(false);
    alert('✅ Relatório gerado!\n\nAbra o arquivo HTML baixado e use Ctrl+P (ou Cmd+P) para imprimir como PDF.');
    
  } catch (error) {
    showLoading(false);
    console.error('Erro ao gerar relatório:', error);
    alert('Erro ao gerar relatório: ' + error.message);
  }
}

// ========== INICIALIZAÇÃO ==========

console.log('Sistema LGEX carregado - Versão 5.0 Web (SEM PIN)');
console.log('Permissões: Admin = Controle Total | Funcionário = Apenas Consulta');
