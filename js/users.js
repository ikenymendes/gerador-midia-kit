/* Usuários (administrador): liberar cadastros e definir função. */
function viewUsuarios(v){
  v.appendChild(h('h2',{text:'Usuários e funções'}));
  v.appendChild(h('p',{class:'hint',text:'Quem se cadastra na tela de entrada aparece aqui como "Pendente". Comercial monta propostas, gera o mídia kit e sugere pontos. Administrador também edita pontos, textos e preços base, decide as sugestões e vê o dashboard. "Bloqueado" impede o acesso.'}));
  var pend=h('div'), tab=h('div',{class:'tw'}); v.appendChild(h('h3',{text:'Aguardando liberação'})); v.appendChild(pend); v.appendChild(h('h3',{text:'Usuários'})); v.appendChild(tab);
  var lista=[];
  async function mudar(u,papel){ try{ await Store.mudarPapel(u.id,papel); u.papel=papel; toast('Acesso de '+u.email+' atualizado.'); draw(); }catch(e){ toast('Não foi possível salvar: '+erroMsg(e),true); load(); } }
  function draw(){
    pend.innerHTML=''; var ps=lista.filter(function(u){ return u.papel==='pendente'; });
    if(!ps.length) pend.appendChild(h('p',{class:'hint',text:'Nenhuma solicitação pendente.'}));
    ps.forEach(function(u){ pend.appendChild(h('div',{class:'urow'},[h('span',{class:'t',text:u.email+(u.nome&&u.nome!==u.email.split('@')[0]?' · '+u.nome:'')}),h('button',{class:'btn',type:'button',text:'Liberar como comercial',onclick:function(){ mudar(u,'comercial'); }}),h('button',{class:'btn',type:'button',text:'Liberar como admin',onclick:function(){ mudar(u,'admin'); }}),h('button',{class:'mini del',type:'button',text:'bloquear',onclick:function(){ mudar(u,'bloqueado'); }})])); });
    tab.innerHTML=''; var t=h('table',{class:'ptab'}); t.appendChild(h('thead',{},[h('tr',{},['Nome','E-mail','Função','Cadastro'].map(function(x){ return h('th',{text:x}); }))])); var tb=h('tbody'); t.appendChild(tb);
    lista.forEach(function(u){
      var eu=u.id===ME.uid, sel=h('select',{},[['admin','Administrador'],['comercial','Comercial'],['pendente','Pendente'],['bloqueado','Bloqueado']].map(function(o){ var op=h('option',{value:o[0],text:o[1]}); if(u.papel===o[0]) op.selected=true; return op; }));
      if(eu){ sel.disabled=true; sel.title='Você não pode alterar a própria função.'; }
      sel.addEventListener('change',function(){ var novo=sel.value; if(u.papel==='admin'&&novo!=='admin'){ askPin('Remover acesso de administrador',u.email).then(function(ok){ if(ok) mudar(u,novo); else sel.value=u.papel; }); } else mudar(u,novo); });
      tb.appendChild(h('tr',{},[h('td',{text:(u.nome||'—')+(eu?'  (você)':'')}),h('td',{text:u.email}),h('td',{},[sel]),h('td',{text:dataBR(u.criado_em)})]));
    });
    tab.appendChild(t);
  }
  function load(){ Store.listarUsuarios().then(function(d){ lista=d; draw(); }).catch(function(e){ tab.innerHTML=''; tab.appendChild(h('p',{class:'status err pad',text:'Não foi possível carregar: '+erroMsg(e)})); }); }
  load();
}
