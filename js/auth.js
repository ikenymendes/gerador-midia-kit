/* Tela de acesso: login, primeiro cadastro, espera de liberação e saída. */
function carro(cor){ return '<path d="M0 548 L0 540 Q2 535 10 535 L20 528 Q24 526 34 526 L48 526 Q54 527 58 535 L68 536 Q72 538 72 548 Z" fill="'+cor+'"/><path d="M24 535 L28 529 L38 529 L38 535 Z M42 535 L42 529 L49 529 L53 535 Z" fill="#0a0a50"/><circle cx="16" cy="548" r="6" fill="#05052e" stroke="#9a9aff" stroke-width="2"/><circle cx="56" cy="548" r="6" fill="#05052e" stroke="#9a9aff" stroke-width="2"/><path d="M72 540 L150 530 L150 556 Z" fill="#fff" opacity=".16"/><rect x="69" y="538" width="4" height="4" rx="2" fill="#fff8c0"/>'; }
function onibus(){ return '<rect x="0" y="512" width="150" height="36" rx="7" fill="#1c1c9a"/><rect x="8" y="517" width="92" height="22" rx="3" fill="#05052e"/><rect class="bustxt" x="8" y="517" width="92" height="22" rx="3" fill="#ff0066" opacity=".85"/><text x="54" y="533" text-anchor="middle" class="bt" style="font-size:11px">MEGA OOH</text><rect x="106" y="517" width="14" height="14" rx="2" fill="#7a7aff" opacity=".5"/><rect x="124" y="517" width="20" height="14" rx="2" fill="#7a7aff" opacity=".5"/><circle cx="28" cy="548" r="7" fill="#05052e" stroke="#9a9aff" stroke-width="2"/><circle cx="122" cy="548" r="7" fill="#05052e" stroke="#9a9aff" stroke-width="2"/>'; }
function estrelas(){ var o=''; for(var i=0;i<26;i++){ o+='<circle class="st" style="animation-delay:'+((i*0.37)%4).toFixed(1)+'s" cx="'+((i*97)%900-60)+'" cy="'+(12+(i*41)%200)+'" r="'+(i%3?1.2:1.8)+'" fill="#fff"/>'; } return o; }
function cenaSvg(logo){
  var win=''; for(var i=0;i<46;i++){ var x=18+((i*53)%700), y=330+((i*37)%170); win+='<rect class="tw" style="animation-delay:'+((i*0.7)%6).toFixed(1)+'s" x="'+x+'" y="'+y+'" width="5" height="7" rx="1"/>'; }
  function banca(x,d,tit){ return '<g transform="translate('+x+',0)"><rect x="4" y="522" width="104" height="8" rx="3" fill="#06063a"/>'+
    '<rect x="14" y="372" width="5" height="150" fill="#3a3aa6"/><rect x="97" y="372" width="5" height="150" fill="#3a3aa6"/>'+
    '<path d="M0 372 L116 372 L108 356 L8 356 Z" fill="#14146e"/><rect x="0" y="372" width="116" height="5" fill="#ff0066"/>'+
    '<rect x="26" y="384" width="64" height="118" rx="4" fill="#05052e" stroke="#4a4ac8" stroke-width="2"/>'+
    '<clipPath id="cb'+d+'"><rect x="29" y="387" width="58" height="112" rx="2"/></clipPath><g clip-path="url(#cb'+d+')">'+
    '<g class="bnr" style="animation-delay:-'+d+'s"><rect x="29" y="387" width="58" height="72" fill="url(#gBan)"/><rect x="29" y="459" width="58" height="72" fill="#ff0066"/><rect x="29" y="531" width="58" height="72" fill="url(#gBan)"/><rect x="29" y="603" width="58" height="72" fill="#ff0066"/></g>'+
    '<text x="58" y="418" text-anchor="middle" class="bt">'+tit+'</text><text x="58" y="436" text-anchor="middle" class="bt s">OOH</text></g>'+
    '<rect x="29" y="387" width="58" height="112" fill="url(#gap)"/>'+
    '<rect x="22" y="506" width="72" height="5" rx="2" fill="#2c2c92"/></g>'; }
  return '<svg class="cena" viewBox="0 0 760 560" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Painel de LED e bancas de LED com horário e data">'+
  '<defs><pattern id="gap" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="none" stroke="#02021f" stroke-opacity=".55" stroke-width="1.3"/></pattern>'+
  '<linearGradient id="gBan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d2de0"/><stop offset="1" stop-color="#ff0066"/></linearGradient>'+
  '<linearGradient id="gScr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a62"/><stop offset="1" stop-color="#1a1ab0"/></linearGradient>'+
  '<linearGradient id="gTr" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".9"/></linearGradient>'+
  '<clipPath id="cScr"><rect x="150" y="64" width="460" height="222" rx="4"/></clipPath><clipPath id="cPol"><rect x="572" y="338" width="96" height="46" rx="3"/></clipPath></defs>'+
  estrelas()+'<g fill="#0b0b5e" opacity=".9"><rect x="0" y="330" width="70" height="200"/><rect x="82" y="290" width="54" height="240"/><rect x="146" y="350" width="40" height="180"/><rect x="580" y="300" width="60" height="230"/><rect x="650" y="340" width="52" height="190"/><rect x="712" y="310" width="48" height="220"/></g>'+win+
  '<rect x="-500" y="530" width="1760" height="30" fill="#04042b"/><rect x="-500" y="530" width="1760" height="3" fill="#ff0066" opacity=".8"/>'+
  '<line class="road" x1="-500" y1="548" x2="1260" y2="548" stroke="#6b6bd6" stroke-width="2" stroke-dasharray="26 22"/>'+
  '<g class="veh v1">'+carro('#ff0066')+'</g><g class="veh v2">'+carro('#7a7aff')+'</g><g class="veh v3">'+onibus()+'</g>'+
  '<rect x="372" y="286" width="16" height="246" fill="#2f2f9a"/><rect x="360" y="520" width="40" height="10" rx="3" fill="#1b1b78"/>'+
  '<rect x="138" y="52" width="484" height="246" rx="10" fill="#10106e" stroke="#4a4ac8" stroke-width="3"/>'+
  '<rect x="150" y="64" width="460" height="222" rx="4" fill="url(#gScr)"/>'+
  '<g clip-path="url(#cScr)">'+
    '<g class="sl s1"><text x="380" y="140" text-anchor="middle" class="big">Pense grande.</text><text x="380" y="196" text-anchor="middle" class="big pk">Pense MEGA.</text></g>'+
    '<g class="sl s2"><image href="'+logo+'" x="290" y="96" width="180" height="46" preserveAspectRatio="xMidYMid meet"/><text x="380" y="184" text-anchor="middle" class="mid">Painéis de LED · Bancas de LED</text><text x="380" y="212" text-anchor="middle" class="sm">Belo Horizonte · Região Metropolitana · Brasília</text></g>'+
    '<g class="sl s3"><text x="380" y="132" text-anchor="middle" class="sm">AGORA</text><text class="clk" x="380" y="196" text-anchor="middle"><tspan class="hh">00</tspan><tspan class="cl">:</tspan><tspan class="mm">00</tspan></text></g>'+
    '<rect x="150" y="250" width="460" height="36" fill="#05052e" opacity=".82"/><text class="dt" x="168" y="274"></text><text class="hr" x="592" y="275" text-anchor="end"><tspan class="hh">00</tspan><tspan class="cl">:</tspan><tspan class="mm">00</tspan></text>'+
    '<rect class="scan" x="150" y="64" width="90" height="222" fill="#fff" opacity=".13"/></g>'+
  '<rect x="150" y="64" width="460" height="222" rx="4" fill="url(#gap)"/>'+
  banca(40,3,'MEGA')+banca(440,9,'MEGA')+
  '<rect x="616" y="384" width="6" height="146" fill="#2f2f9a"/><rect x="568" y="334" width="104" height="54" rx="5" fill="#10106e" stroke="#4a4ac8" stroke-width="2"/>'+
  '<rect x="572" y="338" width="96" height="46" rx="3" fill="#05052e"/><g clip-path="url(#cPol)"><text class="mq" x="680" y="368">ANUNCIE AQUI  •  MEGA OOH  •  ANUNCIE AQUI  •  MEGA OOH</text></g><rect x="572" y="338" width="96" height="46" fill="url(#gap)"/>'+
  '</svg>';
}
function relogio(root){
  var dias=['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'], meses=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  function tick(){
    if(!document.body.contains(root)){ clearInterval(t); return; }
    var d=new Date(), hh=('0'+d.getHours()).slice(-2), mm=('0'+d.getMinutes()).slice(-2);
    root.querySelectorAll('.hh').forEach(function(e){ e.textContent=hh; }); root.querySelectorAll('.mm').forEach(function(e){ e.textContent=mm; });
    var dt=root.querySelector('.dt'); if(dt) dt.textContent=dias[d.getDay()].replace(/^./,function(c){return c.toUpperCase();})+', '+d.getDate()+' de '+meses[d.getMonth()];
  }
  var t=setInterval(tick,1000); tick();
}

/* Tela de acesso: login, primeiro cadastro, espera de liberação e saída. */
function gate(title,msg,actions){
  var g=$('#gate'); g.hidden=false; g.innerHTML='';
  var split=h('div',{class:'gsplit'});
  split.appendChild(h('div',{class:'gslash'}));
  var cena=h('div',{class:'scene'}); cena.innerHTML=cenaSvg(ASSETS.logoW);
  var hero=h('div',{class:'ghero'},[h('div',{class:'dots'}),h('div',{class:'ghtxt'},[h('img',{src:ASSETS.logoW,alt:'MEGA OOH',class:'ghlogo'}),cena,h('div',{class:'ghfoot'},[h('h1',{text:'Propostas de mídia exterior, do ponto ao PDF.'}),h('p',{text:'Escolha os pontos, ajuste os valores e gere o PowerPoint ou o PDF.'})])])]);
  split.appendChild(hero);
  var box=h('div',{class:'gbox'}); box.appendChild(h('h2',{text:title})); (Array.isArray(msg)?msg:[msg]).forEach(function(m){ if(m) box.appendChild(h('p',{class:'hint',text:m})); }); (actions||[]).forEach(function(a){ box.appendChild(a); });
  split.appendChild(h('div',{class:'gform'},[box])); g.appendChild(split); relogio(cena); return box;
}

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
  if(!Store.configOk()){
    gate('O endereço do Supabase está errado',['A "Project URL" em js/config.js precisa ser exatamente assim: https://xxxxxxxx.supabase.co (começa com https://, termina em .supabase.co, sem espaços e sem nada depois).','Valor lido agora: '+JSON.stringify(String((window.MEGAKIT_CONFIG||{}).SUPABASE_URL||'').slice(0,80))]); return;
  }
  if(!Store.init()){ gate('Não foi possível iniciar','A biblioteca do Supabase não carregou. Recarregue a página.'); return; }
  try{ var s=await Store.sessao(); if(s){ await iniciarSessao(); return; } }catch(e){ console.warn(e); }
  telaLogin('entrar');
}
