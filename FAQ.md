# ❓ FAQ - Perguntas Frequentes

## 📚 ÍNDICE
- [Geral](#geral)
- [Instalação e Configuração](#instalação-e-configuração)
- [Uso do Sistema](#uso-do-sistema)
- [Segurança](#segurança)
- [Técnico](#técnico)
- [Custos](#custos)

---

## GERAL

### ❓ O que é este sistema?
É uma aplicação web para gerenciar ferramentas e materiais de um almoxarifado. Permite controlar retiradas, devoluções, estado dos itens e gerar relatórios.

### ❓ Preciso saber programar para usar?
**NÃO!** O sistema está pronto para usar. Você só precisa:
1. Configurar o Firebase (seguindo o guia passo a passo)
2. Publicar os arquivos
3. Fazer login e usar

### ❓ Funciona em celular?
**SIM!** O sistema foi desenvolvido pensando primeiro em celular. Funciona perfeitamente em iPhone, Android e tablets.

### ❓ Posso usar offline (sem internet)?
Atualmente, **NÃO**. O sistema precisa de internet para funcionar. 
*Nota: Há planos de adicionar modo offline em versões futuras.*

### ❓ Quantas pessoas podem usar ao mesmo tempo?
O plano gratuito do Firebase suporta facilmente **50-100 usuários simultâneos**. Para mais usuários, você pode fazer upgrade do plano.

---

## INSTALAÇÃO E CONFIGURAÇÃO

### ❓ Quanto tempo leva para configurar?
Entre **30-45 minutos** se você seguir o guia passo a passo. A maior parte do tempo é criar a conta no Firebase e configurar.

### ❓ Preciso pagar por alguma coisa?
**NÃO!** Tudo é gratuito:
- Firebase (plano gratuito)
- Hospedagem (GitHub Pages, Netlify ou Vercel)
- Domínio (você recebe um grátis tipo `.github.io`)

### ❓ O que é Firebase?
É um serviço do Google que fornece:
- Banco de dados em nuvem (Firestore)
- Autenticação de usuários (login com Google)
- Hospedagem (opcional)
Tudo com plano gratuito generoso.

### ❓ Onde coloco meus arquivos?
Você tem 3 opções gratuitas:
1. **GitHub Pages** (recomendado - mais fácil)
2. **Netlify** (simples)
3. **Vercel** (rápido)

Todas fornecem hospedagem gratuita e ilimitada.

### ❓ Como faço para o site ficar no ar?
1. Crie conta no GitHub
2. Crie um repositório
3. Faça upload dos arquivos `index.html` e `app.js`
4. Ative o GitHub Pages nas configurações
5. Pronto! Seu link estará disponível

### ❓ Posso usar meu próprio domínio (ex: sistema.minhaempresa.com)?
**SIM!** Depois de publicar no GitHub Pages, Netlify ou Vercel, você pode configurar um domínio personalizado gratuitamente.

### ❓ O que devo fazer se erro ao configurar o Firebase?
1. Verifique se copiou TODAS as configurações corretamente
2. Certifique-se de ativar a Autenticação Google
3. Verifique as Regras do Firestore
4. Consulte o guia passo a passo novamente

---

## USO DO SISTEMA

### ❓ Como faço o primeiro login?
1. Acesse o link do seu site
2. Clique em "Entrar com Google"
3. Escolha sua conta Google
4. Defina um PIN de 4 dígitos
5. Pronto! Você é automaticamente o administrador

### ❓ Como adiciono outros usuários?
Como administrador:
1. Clique em "+ NOVO UTILIZADOR"
2. Preencha nome, e-mail e defina um PIN
3. Escolha se será Admin ou Funcionário
4. Salve
5. Avise a pessoa para fazer login com a conta Google dela

### ❓ Qual a diferença entre Admin e Funcionário?

**Administrador pode:**
- Tudo que o funcionário pode, MAIS:
- Cadastrar materiais
- Cadastrar utilizadores
- Editar/excluir registros
- Gerenciar permissões

**Funcionário pode:**
- Registrar retiradas
- Registrar devoluções
- Consultar histórico
- Ver estatísticas

### ❓ O que é o PIN?
É um código de 4 dígitos que cada usuário define. Serve para validar operações importantes, como retiradas e devoluções. É uma camada extra de segurança.

### ❓ Esqueci meu PIN, o que faço?
Se você é funcionário: peça ao administrador para redefinir.
Se você é administrador: outro admin pode redefinir, ou você precisa editar diretamente no Firestore (Firebase Console).

### ❓ Como cadastro um material?
1. Clique em "+ NOVO MATERIAL" (apenas admin)
2. Preencha:
   - Nome do material
   - Categoria
   - Estado (Bom, Regular, Avariado)
   - Quantidade
   - Data da próxima manutenção (opcional)
3. Clique em "SALVAR MATERIAL"
4. Um código é gerado automaticamente (ex: MAT-001)

### ❓ Como registro uma retirada?
1. Clique em "RETIRADA / DEVOLUÇÃO"
2. Selecione "RETIRADA"
3. Escolha o material na lista
4. Adicione observações (opcional)
5. Digite seu PIN
6. Clique em "CONFIRMAR REGISTRO"

### ❓ Como faço uma devolução?
Igual à retirada, mas seleciona "DEVOLUÇÃO" no passo 2.

### ❓ Como vejo o histórico de um item?
1. Clique em "CONSULTAR ITEM"
2. Selecione o material
3. Clique em "BUSCAR"
4. Você verá todas as movimentações daquele item

### ❓ Como gero um relatório?
1. Clique em "RELATÓRIO PDF"
2. Confirme
3. Um arquivo HTML será baixado
4. Abra o arquivo
5. Pressione Ctrl+P (ou Cmd+P no Mac)
6. Escolha "Salvar como PDF"
7. Pronto!

### ❓ Posso editar um material depois de cadastrado?
**SIM**, apenas se você for administrador:
1. Clique em "EDITAR/EXCLUIR"
2. Escolha "Materiais"
3. Clique no ícone de lápis ao lado do material
4. Faça as alterações
5. Confirme

### ❓ Posso excluir um material?
**SIM**, apenas administradores:
1. Clique em "EDITAR/EXCLUIR"
2. Escolha "Materiais"
3. Clique no ícone de lixeira
4. Confirme (ação irreversível!)

---

## SEGURANÇA

### ❓ O sistema é seguro?
**SIM!** Implementa várias camadas de segurança:
1. Login obrigatório com conta Google (OAuth)
2. Validação por PIN em operações críticas
3. Níveis de permissão (Admin vs Funcionário)
4. Regras de segurança no servidor (Firestore Rules)
5. Todos os registros incluem quem fez e quando

### ❓ Alguém pode acessar sem login?
**NÃO.** É obrigatório fazer login com uma conta Google. Além disso, apenas usuários cadastrados no sistema conseguem usar.

### ❓ Os dados ficam seguros?
**SIM.** Os dados ficam armazenados no Firebase (Google), que tem:
- Criptografia de dados
- Backup automático
- Redundância de servidores
- Conformidade com GDPR

### ❓ Posso perder meus dados?
É muito improvável. O Firebase faz backup automático. Mas como boa prática:
1. Gere relatórios periodicamente
2. Faça backup manual (exportar dados) mensalmente
3. Mantenha um administrador backup

### ❓ Alguém pode ver meu PIN?
**NÃO.** O PIN fica armazenado no banco de dados e apenas o próprio usuário e administradores podem acessá-lo (via Firebase Console, não pela interface).

---

## TÉCNICO

### ❓ Quais tecnologias são usadas?
- **Frontend:** HTML5, CSS3, JavaScript
- **UI Framework:** Bootstrap 5
- **Backend:** Firebase (Firestore Database)
- **Autenticação:** Firebase Authentication (Google)
- **Hospedagem:** GitHub Pages / Netlify / Vercel

### ❓ O código é open source?
**SIM!** O código está disponível para você usar, modificar e distribuir livremente.

### ❓ Posso personalizar o visual?
**SIM!** Você pode editar:
- Cores (arquivo `index.html` - busque por `:root`)
- Textos (substitua "LGEX" pelo nome da sua empresa)
- Logo (adicione sua logo no lugar do ícone)
- Layout (se tiver conhecimento de CSS)

### ❓ Como faço para mudar as cores?
1. Abra o arquivo `index.html`
2. Procure por:
```css
:root { 
  --lgex-blue: #1e3c72;
  --lgex-accent: #3498db;
}
```
3. Substitua pelos códigos de cor que quiser
4. Salve e recarregue

### ❓ Posso adicionar mais categorias de materiais?
**SIM!** No arquivo `index.html`, procure por:
```html
<select id="mCat" class="form-select p-3">
  <option>Ferramenta</option>
  <option>Máquina</option>
  <option>Insumo</option>
  <option>EPI</option>
  <option>Equipamento</option>
</select>
```
Adicione mais `<option>` com as categorias que quiser.

### ❓ Posso integrar com outros sistemas?
**SIM!** O Firebase fornece API REST. Você pode:
- Integrar com sistemas ERP
- Criar aplicativos mobile nativos
- Conectar com sensores IoT
- Automatizar com scripts

### ❓ Qual limite de dados no plano gratuito?
Firebase Free Tier:
- **50.000 leituras/dia** (suficiente para ~100 usuários ativos)
- **20.000 escritas/dia**
- **1 GB de armazenamento**
- **10 GB de transferência/mês**

Para um almoxarifado normal, isso é mais que suficiente.

### ❓ E se eu ultrapassar o limite gratuito?
Você tem opções:
1. **Otimizar consultas** (cache, menos leituras)
2. **Upgrade para plano pago** (paga apenas pelo que usar a mais)
3. **Migrar para outro backend** (PostgreSQL, MySQL, etc.)

### ❓ Funciona com outros provedores de login além do Google?
O código atual usa apenas Google. Mas você pode adicionar:
- Facebook
- Microsoft
- E-mail/senha
- Telefone

Basta ativar no Firebase Authentication e adaptar o código.

---

## CUSTOS

### ❓ Quanto custa usar o sistema?
**R$ 0,00** se mantiver no plano gratuito:
- Firebase Free: suficiente para pequenas e médias empresas
- GitHub Pages: hospedagem ilimitada grátis
- Domínio `.github.io`: gratuito

### ❓ Quando preciso pagar?
Apenas se ultrapassar os limites do plano gratuito:
- Mais de 50.000 leituras/dia
- Mais de 1GB de dados armazenados
- Quiser domínio personalizado (.com, .pt, etc.) - ~R$ 50/ano

### ❓ Quanto custa o plano pago do Firebase?
Firebase usa modelo "pay as you go" (pague apenas o que usar).

**Exemplo prático:**
- 100.000 leituras = ~$0.06 (R$ 0,30)
- 100.000 escritas = ~$0.18 (R$ 0,90)
- 5GB armazenamento = ~$1.00 (R$ 5,00)

Ou seja, é **muito barato** mesmo saindo do gratuito.

### ❓ Vale a pena usar Firebase ou criar meu próprio servidor?
**Firebase vale muito a pena porque:**
1. Zero configuração de servidor
2. Escalabilidade automática
3. Backup automático
4. Segurança gerenciada
5. Custo inicial zero

Criar servidor próprio:
- Custo mínimo: ~R$ 50-100/mês
- Precisa configurar, manter, atualizar
- Responsabilidade por segurança e backups

---

## 🆘 PROBLEMAS COMUNS

### ❓ Site não carrega, mostra tela branca
**Soluções:**
1. Abra Console do navegador (F12) e veja erros
2. Verifique se configurou o `app.js` com dados do Firebase
3. Verifique se os arquivos estão na mesma pasta
4. Teste em outro navegador

### ❓ "Erro ao fazer login"
**Soluções:**
1. Verifique se ativou Google Authentication no Firebase
2. Vá em Firebase > Authentication > Settings > Authorized domains
3. Adicione seu domínio (ex: `seu-usuario.github.io`)
4. Aguarde 5 minutos e tente novamente

### ❓ "Não consigo salvar materiais"
**Soluções:**
1. Confirme que você é Administrador
2. Verifique as Regras do Firestore
3. Abra Console do navegador (F12) e veja erros
4. Tente fazer logout e login novamente

### ❓ "PIN incorreto" mas tenho certeza que está certo
**Soluções:**
1. PINs são case-sensitive? Não, são apenas números
2. Pode ter espaços? Verifique no Firebase Console
3. Peça a um admin para redefinir seu PIN

### ❓ Estatísticas não atualizam
**Soluções:**
1. Clique em "Voltar" (recarrega o dashboard)
2. Recarregue a página (F5)
3. Limpe o cache do navegador

### ❓ Histórico de item não aparece
**Soluções:**
1. Verifique se o código do material está correto
2. Confirme que há registros daquele material
3. Verifique se está logado corretamente

---

## 💡 DICAS E BOAS PRÁTICAS

### ❓ Como organizar melhor os materiais?
1. Use códigos sequenciais (automático)
2. Nomes descritivos (ex: "Furadeira Bosch 500W" ao invés de "Furadeira")
3. Categorias padronizadas
4. Atualize estado regularmente

### ❓ Como treinar minha equipe?
1. Mostre o guia básico de uso
2. Faça um material de teste para praticar
3. Acompanhe os primeiros registros
4. Defina um "PIN padrão temporário" para novos usuários

### ❓ Com que frequência devo gerar relatórios?
Recomendações:
- **Semanal:** Para acompanhamento
- **Mensal:** Para arquivo
- **Antes de eventos importantes:** Inventários, auditorias

### ❓ Devo fazer backup manual?
**SIM!** Apesar do Firebase ter backup automático, é bom:
- Gerar relatório PDF mensal
- Exportar dados trimestralmente
- Guardar em local seguro (Google Drive, Dropbox)

---

## 📞 AINDA TEM DÚVIDAS?

Se sua pergunta não foi respondida aqui:

1. **Releia o GUIA_COMPLETO.md** - Tem instruções detalhadas
2. **Consulte a documentação:**
   - Firebase: https://firebase.google.com/docs
   - GitHub Pages: https://pages.github.com/
3. **Abra uma Issue no GitHub** com sua dúvida
4. **Console do navegador (F12)** - Veja mensagens de erro específicas

---

**Sistema desenvolvido por Ricardo Barros**
**Versão 5.0 Web - 2024**