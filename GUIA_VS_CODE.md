# 🖥️ GUIA: Como Usar o VS Code com o Projeto

## 📥 1. INSTALAR O VS CODE

### Windows:
1. Acesse: https://code.visualstudio.com/
2. Clique em "Download for Windows"
3. Execute o instalador baixado
4. Siga o assistente de instalação (deixe todas as opções marcadas)
5. Ao finalizar, abra o VS Code

### Mac:
1. Acesse: https://code.visualstudio.com/
2. Clique em "Download for Mac"
3. Abra o arquivo `.zip` baixado
4. Arraste o ícone do VS Code para a pasta "Aplicativos"
5. Abra o VS Code pela pasta Aplicativos

---

## 📂 2. ABRIR O PROJETO NO VS CODE

### Método 1: Arrastar e Soltar
1. Abra o VS Code
2. Localize a pasta `lgex-almoxarifado` no seu computador
3. **Arraste a pasta inteira** para dentro da janela do VS Code

### Método 2: Menu Arquivo
1. Abra o VS Code
2. Clique em **File** > **Open Folder** (Windows/Linux)
   - ou **File** > **Open...** (Mac)
3. Navegue até a pasta `lgex-almoxarifado`
4. Clique em **Selecionar pasta** (ou **Open**)

Pronto! Você verá os arquivos na barra lateral esquerda.

---

## ✏️ 3. EDITAR OS ARQUIVOS

### Editar o app.js (Configurar Firebase):

1. Na barra lateral esquerda (Explorer), clique em `app.js`
2. O arquivo abrirá no editor central
3. Role até o topo e encontre:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

4. **Selecione** cada valor (ex: `"SUA_API_KEY_AQUI"`)
5. **Cole** o valor correto do Firebase
6. Pressione **Ctrl + S** (Windows/Linux) ou **Cmd + S** (Mac) para salvar

### Editar o index.html (Personalizar):

1. Clique em `index.html` na barra lateral
2. Use **Ctrl + F** (ou **Cmd + F**) para buscar texto
3. Exemplo: busque por "LGEX" e substitua pelo nome da sua empresa
4. Salve com **Ctrl + S** (ou **Cmd + S**)

---

## 🔍 4. USAR A BUSCA E SUBSTITUIÇÃO

### Buscar Texto:
- **Ctrl + F** (Windows/Linux) ou **Cmd + F** (Mac)
- Digite o texto que procura
- Use as setas para navegar entre os resultados

### Substituir Texto:
- **Ctrl + H** (Windows/Linux) ou **Cmd + H** (Mac)
- No campo superior: texto a procurar
- No campo inferior: texto para substituir
- Clique em **Replace** (substituir um) ou **Replace All** (substituir todos)

**Exemplo Prático:**
- Buscar: `LGEX Metalomecânica`
- Substituir por: `Minha Empresa Lda`
- Clique em "Replace All"

---

## 🎨 5. EXTENSÕES ÚTEIS PARA O PROJETO

### Instalar Extensões:

1. Clique no ícone de **Extensions** na barra lateral esquerda (ou **Ctrl + Shift + X**)
2. Busque o nome da extensão
3. Clique em **Install**

### Extensões Recomendadas:

#### 1. **Live Server** (ESSENCIAL!)
- **O que faz:** Cria um servidor local para testar o site
- **Como instalar:** Busque por "Live Server" e instale
- **Como usar:**
  1. Clique com botão direito em `index.html`
  2. Selecione **"Open with Live Server"**
  3. Seu navegador abrirá automaticamente
  4. Cada vez que salvar um arquivo, a página atualiza sozinha!

#### 2. **Prettier - Code formatter**
- **O que faz:** Formata seu código automaticamente
- **Como usar:** 
  - Abra um arquivo
  - Pressione **Shift + Alt + F** (Windows) ou **Shift + Option + F** (Mac)

#### 3. **HTML CSS Support**
- **O que faz:** Autocomplete inteligente para HTML e CSS
- Instale e aproveite as sugestões automáticas

#### 4. **JavaScript (ES6) code snippets**
- **O que faz:** Atalhos para código JavaScript
- Muito útil se for fazer modificações

#### 5. **Portuguese Language Pack**
- **O que faz:** Traduz interface do VS Code para português
- Após instalar, reinicie o VS Code

---

## 🌐 6. TESTAR O SITE LOCALMENTE

### Com Live Server (Recomendado):

1. Instale a extensão "Live Server" (ver item 5)
2. Clique com botão direito em `index.html`
3. Selecione **"Open with Live Server"**
4. O navegador abrirá automaticamente em `http://127.0.0.1:5500`

**Vantagem:** Qualquer alteração que você fizer atualiza a página automaticamente!

### Sem Live Server:

1. Localize o arquivo `index.html` no seu computador
2. Clique com botão direito
3. Selecione **"Abrir com"** > **Chrome** (ou seu navegador)

**Desvantagem:** Você precisa dar F5 para ver as mudanças.

---

## 🔧 7. ATALHOS ÚTEIS DO VS CODE

### Navegação:
- **Ctrl + P** (Cmd + P): Buscar arquivo por nome
- **Ctrl + Shift + E**: Focar no Explorer (barra lateral)
- **Ctrl + `** (crase): Abrir/fechar terminal integrado

### Edição:
- **Ctrl + D**: Selecionar próxima ocorrência da palavra
- **Ctrl + Shift + L**: Selecionar todas ocorrências
- **Alt + Setas**: Mover linha para cima/baixo
- **Ctrl + /**: Comentar/descomentar linha
- **Ctrl + Space**: Sugestões de código

### Arquivo:
- **Ctrl + S**: Salvar arquivo
- **Ctrl + Shift + S**: Salvar todos os arquivos
- **Ctrl + W**: Fechar aba atual
- **Ctrl + K, Ctrl + W**: Fechar todas as abas

---

## 🐙 8. USAR GIT NO VS CODE (Para GitHub)

### Primeira Vez - Configurar Git:

1. Baixe e instale o Git: https://git-scm.com/
2. Abra o Terminal do VS Code (Ctrl + `)
3. Configure seu nome e email:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### Criar Repositório e Enviar para GitHub:

#### Passo 1: Inicializar Git na Pasta

1. Abra o Terminal do VS Code (Ctrl + `)
2. Digite:

```bash
git init
git add .
git commit -m "Primeiro commit - Sistema LGEX"
```

#### Passo 2: Criar Repositório no GitHub

1. Acesse https://github.com/
2. Clique no **+** > **New repository**
3. Nome: `lgex-almoxarifado`
4. Deixe **Public**
5. **NÃO** marque "Initialize with README"
6. Clique em **Create repository**

#### Passo 3: Conectar e Enviar

1. No GitHub, copie o link que aparece (ex: `https://github.com/SEU-USUARIO/lgex-almoxarifado.git`)
2. No Terminal do VS Code, digite (substituindo pela sua URL):

```bash
git remote add origin https://github.com/SEU-USUARIO/lgex-almoxarifado.git
git branch -M main
git push -u origin main
```

3. Digite seu usuário e senha do GitHub quando solicitado

**Pronto! Código enviado para o GitHub!**

### Fazer Alterações e Atualizar:

Depois de editar arquivos:

1. Clique no ícone de **Source Control** na barra lateral (ou Ctrl + Shift + G)
2. Você verá os arquivos modificados
3. Digite uma mensagem descrevendo o que mudou (ex: "Corrigir cor do botão")
4. Clique no **✓** (check) para fazer commit
5. Clique nos **...** (três pontos) > **Push** para enviar ao GitHub

**Ou via Terminal:**

```bash
git add .
git commit -m "Descrição da mudança"
git push
```

---

## 📱 9. TESTAR EM DISPOSITIVOS MÓVEIS (Mesma Rede)

### Com Live Server:

1. Inicie o Live Server (botão direito em index.html > Open with Live Server)
2. No Terminal do VS Code, veja o IP local (algo como `127.0.0.1:5500`)
3. No Windows, abra o Prompt de Comando e digite: `ipconfig`
4. No Mac/Linux, abra o Terminal e digite: `ifconfig`
5. Procure por algo como `192.168.x.x` (seu IP local)
6. No celular (conectado na **mesma WiFi**), acesse: `http://192.168.x.x:5500`

Agora você pode testar no celular em tempo real!

---

## 🎨 10. PERSONALIZAR O VS CODE

### Tema de Cores:

1. **Ctrl + K, Ctrl + T** (ou Cmd + K, Cmd + T)
2. Escolha um tema da lista
3. Recomendações:
   - **Dark+ (padrão)** - Escuro e suave
   - **Light+ (padrão)** - Claro
   - **Monokai** - Colorido e popular

### Tamanho da Fonte:

1. **Ctrl + ,** (ou Cmd + ,) para abrir Settings
2. Busque por "font size"
3. Altere "Editor: Font Size" (padrão é 14)

### Zoom:

- **Ctrl + +** (ou Cmd + +): Aumentar zoom
- **Ctrl + -** (ou Cmd + -): Diminuir zoom
- **Ctrl + 0** (ou Cmd + 0): Resetar zoom

---

## ✅ CHECKLIST: PROJETO PRONTO NO VS CODE

- [ ] VS Code instalado
- [ ] Pasta do projeto aberta no VS Code
- [ ] Extensão "Live Server" instalada
- [ ] Arquivo `app.js` configurado com dados do Firebase
- [ ] Testado localmente com Live Server
- [ ] Funcionando corretamente no navegador
- [ ] Git configurado (se for usar GitHub)
- [ ] Código enviado para GitHub (se aplicável)

---

## 🆘 PROBLEMAS COMUNS

### "Live Server não funciona"

**Solução:**
1. Verifique se instalou a extensão correta (desenvolvedor: Ritwick Dey)
2. Clique com botão direito especificamente no `index.html`
3. Reinicie o VS Code

### "Não consigo salvar o arquivo"

**Solução:**
1. Verifique se o arquivo não está aberto em outro programa
2. Execute o VS Code como Administrador (Windows)
3. Verifique permissões da pasta

### "Git não reconhecido"

**Solução:**
1. Instale o Git: https://git-scm.com/
2. Reinicie o VS Code após instalar
3. Reinicie o computador se necessário

### "Mudanças não aparecem no navegador"

**Solução:**
1. Salve o arquivo (Ctrl + S)
2. Recarregue a página (F5 ou Ctrl + R)
3. Limpe o cache (Ctrl + Shift + R)
4. Se usando Live Server, verifique se está ativo (barra inferior deve mostrar "Port: 5500")

---

## 🎓 RECURSOS PARA APRENDER MAIS

### VS Code:
- Documentação oficial: https://code.visualstudio.com/docs
- Atalhos: https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf

### HTML/CSS/JavaScript:
- MDN Web Docs: https://developer.mozilla.org/pt-BR/
- W3Schools: https://www.w3schools.com/

### Git/GitHub:
- Git Tutorial: https://git-scm.com/book/pt-br/v2
- GitHub Guides: https://guides.github.com/

---

## 💡 DICAS FINAIS

1. **Salve sempre:** Acostume-se com Ctrl + S (ou Cmd + S)
2. **Use o terminal integrado:** Ctrl + ` abre o terminal sem sair do VS Code
3. **Explore extensões:** Há milhares de extensões úteis
4. **Aprenda atalhos:** Economize tempo aprendendo os atalhos mais usados
5. **Use Live Server:** Facilita muito o desenvolvimento web

---

**Agora você está pronto para desenvolver no VS Code! 🚀**