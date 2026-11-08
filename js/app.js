/* Navegação por abas, entrada no sistema e avisos em tempo real. */
var TABS_ADMIN=[['dash','Dashboard'],['kit','Kit'],['pontos','Pontos'],['sug','Sugestões'],['mercado','Mercado Central'],['guanabara','Parque Guanabara'],['brasilia','Brasília'],['precos','Preços'],['gerar','Gerar'],['hist','Propostas'],['usuarios','Usuários']];
var TABS_COM=[['sel','Pontos da proposta'],['precos','Preços'],['gerar','Gerar'],['minhas','Minhas sugestões'],['hist','Minhas propostas']];
var TABS=TABS_ADMIN, uSub=[], unsubs=[], pendentes=0, ignorarRt=0, pollTimer=null;

function showTab(t){
  curTab=t; uSub.forEach(function(f){ try{f();}catch(e){} }); uSub=[];
  document.querySelectorAll('.tab').forEach(function(b){ b.classList.toggle('on',b.dataset.t===t); });
  var v=$('#view'); v.innerHTML='';
  var fn=({dash:viewDashboard,kit:viewKit,pontos:viewPontos,sel:viewSelecao,sug:viewSugestoes,minhas:viewMinhasSugestoes,hist:viewHistorico,usuarios:viewUsuarios,
    mercado:function(v){viewSchema(v,'mercado',MERC)},guanabara:function(v){viewSchema(v,'guanabara',GUAN)},brasilia:function(v){viewSchema(v,'brasilia',BRAS)},
    precos:viewPrecos,gerar:viewGerar})[t];
  if(!fn) return; try{ fn(v); }catch(e){ console.error(e); v.appendChild(h('p',{class:'status err',text:'Erro ao abrir a aba: '+erroMsg(e)})); } window.scrollTo(0,0);
}

function montarCabecalho(){
  var who=$('#who'); who.innerHTML='';
  who.appendChild(h('span',{text:ME.nome+' · '+(ME.admin?'administrador':'comercial')}));
  who.appendChild(h('button',{class:'linkhead',type:'button',text:'Sair',onclick:sairDoGerador}));
  var bell=$('#bell'); bell.hidden=!ME.admin; bell.onclick=function(){ showTab('sug'); };
}
function montarAbas(){
  var nav=$('#tabs'); nav.innerHTML='';
  TABS.forEach(function(t){ var b=h('button',{class:'tab',text:t[1],onclick:function(){ showTab(t[0]); }}); b.dataset.t=t[0]; nav.appendChild(b); });
}

async function atualizarPendentes(){
  if(!ME.admin) return;
  try{ pendentes=await Store.contarPendentes(); }catch(e){ return; }
  var bn=$('#bellN'); if(bn){ bn.textContent=pendentes; $('#bell').classList.toggle('on',pendentes>0); }
  var tab=document.querySelector('.tab[data-t=sug]'); if(tab){ tab.textContent='Sugestões'+(pendentes?' ('+pendentes+')':''); tab.classList.toggle('alert',pendentes>0); }
  document.title=(pendentes?'('+pendentes+') ':'')+'Gerador de Mídia Kit · Mega Mídia OOH';
}

function iniciarTempoReal(){
  unsubs.forEach(function(f){ try{f();}catch(e){} }); unsubs=[]; clearInterval(pollTimer);
  unsubs.push(Store.assinar('pontos',agendarRefetch));
  unsubs.push(Store.assinar('config',agendarRefetch));
  unsubs.push(Store.assinar('sugestoes',function(ev){
    var n=ev.new||{};
    if(ME.admin){
      if(ev.eventType==='INSERT'&&n.status==='pendente') toast('🔔 Nova sugestão de '+(n.criado_por_nome||n.criado_por_email||'um usuário')+': '+(n.tipo==='adicionar'?'adicionar ponto':'alterar ponto'));
      atualizarPendentes(); if(curTab==='sug') showTab('sug');
    } else if(ev.eventType==='UPDATE'&&n.criado_por===ME.uid&&n.status&&n.status!=='pendente'){
      toast('Sua sugestão foi '+(n.status==='aprovada'?'aprovada ✅':'recusada')+(n.resposta?': '+n.resposta:''),n.status!=='aprovada'); if(curTab==='minhas') showTab('minhas');
    }
  }));
  unsubs.push(Store.assinar('profiles',function(ev){
    if(ev.new&&ev.new.id===ME.uid&&ev.new.papel!==ME.papel){ toast('O seu acesso foi alterado pelo administrador. Recarregando…'); setTimeout(function(){ location.reload(); },1500); }
    else if(ME.admin&&curTab==='usuarios') showTab('usuarios');
  }));
  if(ME.admin) pollTimer=setInterval(atualizarPendentes,60000);
}

async function enterApp(){
  TABS=ME.admin?TABS_ADMIN:TABS_COM; montarCabecalho(); montarAbas();
  if(!synced){
    gate('Carregando pontos…','Buscando os dados compartilhados.');
    try{ await carregarDados(); synced=true; }
    catch(e){ gate('Não foi possível carregar os dados',[erroMsg(e),'Verifique a conexão. Nada foi alterado.'],[h('div',{class:'bar'},[h('button',{class:'btn pri',text:'Tentar de novo',onclick:enterApp}),h('button',{class:'btn',text:'Sair',onclick:sairDoGerador})])]); return; }
  }
  $('#gate').hidden=true; $('#banner').hidden=true;
  iniciarTempoReal(); atualizarPendentes();
  setSaved(ME.admin?'conectado':'seleção guardada neste navegador');
  showTab(TABS[0][0]);
}

/* ---- janelas auxiliares ---- */
function abrirModal(titulo,corpo,botoes,largo){
  var ov=h('div',{class:'pinov modal'}), box=h('div',{class:'mbox'+(largo?' wide':'')});
  function fechar(){ document.removeEventListener('keydown',kd); ov.remove(); }
  function kd(e){ if(e.key==='Escape') fechar(); }
  box.appendChild(h('div',{class:'mhead'},[h('h3',{text:titulo}),h('button',{class:'mini',type:'button',text:'✕',onclick:fechar})]));
  var body=h('div',{class:'mbody'}); [].concat(corpo).forEach(function(c){ if(c) body.appendChild(c); }); box.appendChild(body);
  if(botoes&&botoes.length) box.appendChild(h('div',{class:'bar mfoot'},botoes.map(function(b){ return typeof b==='function'?b(fechar):b; })));
  ov.appendChild(box); document.body.appendChild(ov); document.addEventListener('keydown',kd);
  return {fechar:fechar,box:box};
}
function pedirTexto(titulo,dica,obrigatorio){
  return new Promise(function(res){
    var ta=h('textarea',{rows:3,placeholder:dica||''}), er=h('p',{class:'status err'});
    var m=abrirModal(titulo,[ta,er],[
      function(fechar){ return h('button',{class:'btn pri',type:'button',text:'Confirmar',onclick:function(){ if(obrigatorio&&!ta.value.trim()){ er.textContent='Escreva um texto.'; return; } fechar(); res(ta.value.trim()); }}); },
      function(fechar){ return h('button',{class:'btn',type:'button',text:'Cancelar',onclick:function(){ fechar(); res(null); }}); }
    ]);
    setTimeout(function(){ ta.focus(); },50);
  });
}
