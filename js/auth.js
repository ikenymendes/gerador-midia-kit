/* Tela de acesso: login, primeiro cadastro, espera de liberação e saída. */
function gate(title,msg,actions){ var g=$('#gate'); g.hidden=false; g.innerHTML=''; var box=h('div',{class:'gbox'}); box.appendChild(h('img',{src:ASSETS.logoC,alt:'MEGA OOH',class:'glogo'})); box.appendChild(h('h2',{text:title})); (Array.isArray(msg)?msg:[msg]).forEach(function(m){ if(m) box.appendChild(h('p',{class:'hint',text:m})); }); (actions||[]).forEach(function(a){ box.appendChild(a); }); g.appendChild(box); return box; }

function msgAuth(e){
  var m=erroMsg(e), l=String(m).toLowerCase();
  if(l.indexOf('invalid login')>=0) return 'E-mail ou senha incorretos.';
  if(l.indexOf('email not confirmed')>=0) return 'Confirme o seu e-mail pelo link que enviamos e tente de novo.';
  if(l.indexOf('already registered')>=0||l.indexOf('already been registered')>=0) return 'Este e-mail já tem cadastro. Use "Entrar".';
  if(l.indexOf('apenas para e-mails da empresa')>=0||l.indexOf('database error saving new user')>=0) return 'Cadastro permitido apenas para e-mails da empresa.';
  if(l.indexOf('password')>=0&&l.indexOf('6')>=0) return 'A senha precisa ter pelo menos 6 caracteres.';
  if(l.indexOf('rate limit')>=0) return 'Muitas tentativas. Aguarde alguns minutos.';
  if(l.indexOf('failed to fetch')>=0||l.indexOf('network')>=0) return 'Sem conexão com o servidor. Verifique a internet.';
  return m;
}

function telaLogin(modo,aviso){
  modo=modo||'entrar';
  var nome=h('input',{type:'text',placeholder:'seu nome',autocomplete:'name'});
  var email=h('input',{type:'email',placeholder:'e-mail',autocomplete:'username'});
  var senha=h('input',{type:'password',placeholder:'senha',autocomplete:modo==='entrar'?'current-password':'new-password'});
  var st=h('p',{class:'status'+(aviso?' ok':''),text:aviso||''});
  async function ir(){
    var e=emailKey(email.value), s=senha.value;
    if(!e||!s){ st.textContent='Preencha e-mail e senha.'; st.className='status err'; return; }
    btn.disabled=true; st.textContent=modo==='entrar'?'Entrando…':'Criando cadastro…'; st.className='status';
    try{
      if(modo==='entrar'){ await Store.entrar(e,s); await iniciarSessao(); return; }
      if(!nome.value.trim()){ st.textContent='Informe o seu nome.'; st.className='status err'; btn.disabled=false; return; }
      var r=await Store.cadastrar(e,s,nome.value.trim());
      if(r.session){ await iniciarSessao(); return; }
      telaLogin('entrar','Cadastro criado. Se pediu confirmação, abra o link enviado ao seu e-mail e depois entre. O administrador precisa liberar o seu acesso.');
    }catch(x){ st.textContent=msgAuth(x); st.className='status err'; btn.disabled=false; }
  }
  var btn=h('button',{class:'btn pri big',type:'button',text:modo==='entrar'?'Entrar':'Solicitar cadastro',onclick:ir});
  var troca=h('button',{class:'linklike',type:'button',text:modo==='entrar'?'Primeiro acesso? Solicitar cadastro':'Já tenho cadastro · Entrar',onclick:function(){ telaLogin(modo==='entrar'?'cadastro':'entrar'); }});
  var campos=modo==='entrar'?[email,senha]:[nome,email,senha];
  var box=gate(modo==='entrar'?'Entrar no gerador':'Solicitar cadastro',modo==='entrar'?'Use o e-mail e a senha do seu cadastro.':'Use o e-mail da empresa. Depois do cadastro, o administrador libera o seu acesso.',campos.concat([btn,st,troca]));
  box.addEventListener('keydown',function(ev){ if(ev.key==='Enter') ir(); });
  setTimeout(function(){ (campos[0]).focus(); },50);
}

async function iniciarSessao(){
  gate('Verificando seu acesso…','Um instante.');
  var perfil; try{ perfil=await Store.meuPerfil(); }catch(e){ gate('Não foi possível verificar o acesso',erroMsg(e),[h('button',{class:'btn',text:'Tentar de novo',onclick:iniciarSessao}),h('button',{class:'btn',text:'Sair',onclick:sairDoGerador})]); return; }
  if(!perfil){ telaLogin('entrar'); return; }
  ME.uid=perfil.id; ME.email=perfil.email; ME.nome=perfil.nome||perfil.email; ME.papel=perfil.papel; ME.admin=perfil.papel==='admin';
  var l=lsGet(); if(l) L=Object.assign(L,l);
  if(perfil.papel==='admin'||perfil.papel==='comercial'){ entered=true; enterApp(); return; }
  entered=false; telaPendente(perfil.papel);
}
var unsubPerfil=null;
function telaPendente(papel){
  var sair=h('button',{class:'btn',type:'button',text:'Sair',onclick:sairDoGerador});
  var atual=h('button',{class:'btn pri',type:'button',text:'Já fui liberado · atualizar',onclick:iniciarSessao});
  if(papel==='bloqueado'){ gate('Acesso bloqueado','O administrador bloqueou o acesso de '+ME.email+'.',[sair]); return; }
  gate('Aguardando liberação',['Você entrou como '+ME.email+'.','O administrador precisa liberar o seu acesso (comercial ou administrador). Assim que liberar, toque em atualizar.'],[h('div',{class:'bar'},[atual,sair])]);
  if(unsubPerfil) unsubPerfil(); unsubPerfil=Store.assinar('profiles',function(ev){ if(ev.new&&ev.new.id===ME.uid&&ev.new.papel!==papel){ iniciarSessao(); } });
}
async function sairDoGerador(){
  try{ await Store.sair(); }catch(e){}
  try{ location.reload(); }catch(e){}
}

async function boot(){
  $('#hl').src=ASSETS.logoW;
  for(var k of ['logoW','logoC','mercN','mercW']){ var a=await loadAsset(ASSETS[k]); if(a){ try{ var cv=document.createElement('canvas'); cv.width=a.w; cv.height=a.h; cv.getContext('2d').drawImage(a.el,0,0); a.src=cv.toDataURL('image/png'); }catch(e){ console.warn('logo',k,e); } } BASE[k]=a; }
  if(!Store.configurado()){
    gate('Falta configurar o Supabase',['Abra o arquivo js/config.js e cole a "Project URL" e a "anon key" do seu projeto Supabase (Project Settings > API).','Veja o passo a passo no README.md.']); return;
  }
  if(!Store.init()){ gate('Não foi possível iniciar','A biblioteca do Supabase não carregou. Recarregue a página.'); return; }
  try{ var s=await Store.sessao(); if(s){ await iniciarSessao(); return; } }catch(e){ console.warn(e); }
  telaLogin('entrar');
}
