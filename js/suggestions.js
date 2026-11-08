/* Sugestões: o comercial sugere adicionar/alterar pontos; o administrador confere e aplica. */
var SUG_CAMPOS=[['secao','Seção'],['endereco','Endereço'],['bairro','Bairro'],['cidade','Cidade'],['lat','Latitude'],['lng','Longitude'],['zoom','Zoom do mapa'],['tamanho','Tamanho'],['pixels','Pixels'],['veic','Veic./dia'],['publico','Público'],['fluxo','Fluxo/dia'],['impacto','Impacto semanal'],['sentido','Sentido'],['foto','Foto'],['mapa','Imagem do mapa']];
function sugCopia(p){ var o=JSON.parse(JSON.stringify(p||{})); delete o.id; delete o.ord; delete o.sel; return o; }
function sugVal(k,v){
  if(v==null||v==='') return '—';
  if(k==='secao') return secLabel(v);
  if(k==='foto'||k==='mapa'){ var a=Array.isArray(v)?v:[v]; return a.length+' imagem(ns)'; }
  return String(v);
}
function sugIgual(a,b){ return stable(a==null?'':a)===stable(b==null?'':b); }
function sugDiff(antes,depois){ var d={}; SUG_CAMPOS.forEach(function(c){ var k=c[0]; if(!sugIgual(antes&&antes[k],depois[k])) d[k]=depois[k]==null?null:depois[k]; }); return d; }

/* campos do ponto (mesmos da ficha do administrador) */
function formPonto(obj,semFoto){
  var g=h('div',{class:'grid'});
  var sel=h('select',{},SEC_ORDER.map(function(k){ var o=h('option',{value:k,text:secLabel(k)}); if(obj.secao===k) o.selected=true; return o; }));
  sel.addEventListener('change',function(){ obj.secao=sel.value; if((obj.secao==='metro'||obj.secao==='df_painel')&&!obj.cidade){ obj.cidade='Brasília-DF'; cid.value=obj.cidade; } });
  g.appendChild(field('Seção / formato do ponto',sel));
  var ed=inp(obj,'endereco'), ba=inp(obj,'bairro'), cid=inp(obj,'cidade');
  g.appendChild(field('Endereço (título da ficha) *',ed)); g.appendChild(field('Bairro',ba)); g.appendChild(field('Cidade',cid));
  var lk=h('input',{type:'text',placeholder:'Cole o link completo do Google Maps ou "lat, long"'}), lat=inp(obj,'lat',{num:true}), lng=inp(obj,'lng',{num:true}), res=h('small',{text:''});
  lk.addEventListener('input',function(){ var r=parseMapsText(lk.value); if(r){ obj.lat=r.lat; obj.lng=r.lng; lat.value=r.lat; lng.value=r.lng; res.textContent='✓ Coordenadas encontradas: '+r.lat+' , '+r.lng; res.style.color='#2a9d6f'; } else { res.textContent=lk.value?'Não encontrei coordenadas neste link (use o link completo, não o curto).':''; res.style.color='#b0003a'; } });
  g.appendChild(field('Link do Google Maps (preenche lat/long)',h('div',{},[lk,res]),null,'wide'));
  g.appendChild(field('Latitude',lat)); g.appendChild(field('Longitude',lng));
  [['tamanho','Tamanho (ex.: 9,00 x 3,00 m)'],['pixels','Formato em pixels (ex.: 2308 x 577)'],['veic','Veiculações/dia (bancas)'],['publico','Público (ex.: A, B, C e D)'],['fluxo','Fluxo de carros/dia'],['impacto','Impacto semanal'],['sentido','Sentido (ex.: Centro / Bairro)']].forEach(function(f){ g.appendChild(field(f[1],inp(obj,f[0]))); });
  if(semFoto) g.appendChild(h('p',{class:'hint wide',text:'A foto e a imagem do mapa do ponto só o administrador altera.'})); else g.appendChild(photosField('Foto do ponto',obj,'foto'));
  return g;
}

/* ---- comercial: abre o formulário de sugestão ---- */
function abrirFormSugestao(tipo,ponto){
  var alterar=tipo==='alterar';
  var antes=alterar?sugCopia(ponto):null;
  var obj=alterar?sugCopia(ponto):{secao:filtro||'led_bh',endereco:'',bairro:'',cidade:'Belo Horizonte',lat:null,lng:null,zoom:16,tamanho:'',pixels:'',veic:'',publico:'',fluxo:'',impacto:'',sentido:'',foto:null};
  var motivo=h('textarea',{rows:2,placeholder:alterar?'O que mudou e por quê? (ex.: tela trocada, endereço corrigido)':'De onde vem este ponto? (ex.: novo contrato, ponto do parceiro X)'});
  var st=h('p',{class:'status'});
  var corpo=[h('p',{class:'hint',text:alterar?'Altere só o que precisa. O administrador vai ver o antes e o depois e decidir.':'Preencha os dados do novo ponto. O administrador recebe o aviso, confere e cadastra.'}),formPonto(obj,alterar),field('Observação para o administrador',motivo,null,'wide'),st];
  abrirModal(alterar?'Sugerir alteração · '+(ponto.endereco||'ponto'):'Sugerir novo ponto',corpo,[
    function(fechar){ var b=h('button',{class:'btn pri',type:'button',text:'Enviar sugestão'}); b.addEventListener('click',async function(){
      var payload; if(alterar){ payload=sugDiff(antes,obj); delete payload.foto; delete payload.mapa; if(!Object.keys(payload).length){ st.textContent='Você não alterou nada.'; st.className='status err'; return; } }
      else { if(!String(obj.endereco||'').trim()){ st.textContent='Preencha o endereço.'; st.className='status err'; return; } payload=sugCopia(obj); }
      b.disabled=true; st.textContent='Enviando…'; st.className='status';
      try{ await Store.criarSugestao({tipo:alterar?'alterar':'adicionar',ponto_id:alterar?ponto.id:null,payload:payload,antes:alterar?antes:null,motivo:motivo.value.trim()}); fechar(); toast('Sugestão enviada. O administrador foi avisado.'); if(curTab==='minhas') showTab('minhas'); }
      catch(e){ st.textContent='Não foi possível enviar: '+erroMsg(e); st.className='status err'; b.disabled=false; } }); return b; },
    function(fechar){ return h('button',{class:'btn',type:'button',text:'Cancelar',onclick:fechar}); }
  ],true);
}

function badgeStatus(s){ return h('em',{class:'bst '+s,text:s==='pendente'?'Pendente':(s==='aprovada'?'Aprovada':'Recusada')}); }

/* tabela antes × depois */
function tabelaMudancas(s){
  var tb=h('table',{class:'ptab dif'}); var cab=s.tipo==='alterar'?['Campo','Antes','Sugerido']:['Campo','Sugerido']; tb.appendChild(h('thead',{},[h('tr',{},cab.map(function(x){ return h('th',{text:x}); }))])); var body=h('tbody'); tb.appendChild(body);
  SUG_CAMPOS.forEach(function(c){ var k=c[0], novo=s.payload[k]; if(s.tipo==='alterar'){ if(!(k in s.payload)) return; body.appendChild(h('tr',{},[h('td',{text:c[1]}),h('td',{class:'old',text:sugVal(k,s.antes&&s.antes[k])}),h('td',{class:'new',text:sugVal(k,novo)})])); }
    else { if(novo==null||novo==='') return; body.appendChild(h('tr',{},[h('td',{text:c[1]}),h('td',{class:'new',text:sugVal(k,novo)})])); } });
  return h('div',{class:'tw small'},[tb]);
}
function tituloSugestao(s){ var nome=(s.antes&&s.antes.endereco)||s.payload.endereco||'(sem endereço)'; return (s.tipo==='adicionar'?'➕ Adicionar ponto: ':'✏️ Alterar ponto: ')+nome; }

async function recarregarPontos(){
  ignorarRt=Date.now()+3000;
  clearTimeout(saveT); await syncOut();
  applyPontos(await Store.lerPontos());
}

/* ---- administrador: caixa de sugestões ---- */
function viewSugestoes(v){
  v.appendChild(h('h2',{text:'Sugestões do comercial'}));
  v.appendChild(h('p',{class:'hint',text:'O comercial não altera endereços direto: ele sugere e você decide. "Aprovar" aplica na hora no cadastro de pontos. "Editar e aprovar" deixa você ajustar antes. Quem sugeriu recebe o aviso da decisão.'}));
  var fs=h('select',{},[['pendente','Pendentes'],['aprovada','Aprovadas'],['recusada','Recusadas'],['','Todas']].map(function(o){ return h('option',{value:o[0],text:o[1]}); }));
  v.appendChild(h('div',{class:'bar'},[fs])); var box=h('div'); v.appendChild(box);
  async function carregar(){
    box.innerHTML=''; box.appendChild(h('p',{class:'hint',text:'Carregando…'})); var lista;
    try{ lista=await Store.listarSugestoes(fs.value||null); }catch(e){ box.innerHTML=''; box.appendChild(h('p',{class:'status err',text:'Não foi possível carregar: '+erroMsg(e)})); return; }
    box.innerHTML=''; if(!lista.length){ box.appendChild(h('p',{class:'hint',text:fs.value==='pendente'?'Nenhuma sugestão pendente. 🎉':'Nada por aqui.'})); return; }
    lista.forEach(function(s){ box.appendChild(cartaoSugestao(s,carregar)); });
  }
  fs.addEventListener('change',carregar); carregar();
}
function cartaoSugestao(s,recarregar){
  var c=h('div',{class:'sug'});
  c.appendChild(h('div',{class:'sughead'},[h('span',{class:'t',text:tituloSugestao(s)}),badgeStatus(s.status)]));
  c.appendChild(h('p',{class:'hint',text:'Por '+(s.criado_por_nome||s.criado_por_email||'—')+(s.criado_por_email?' ('+s.criado_por_email+')':'')+' · '+dataBR(s.criado_em)}));
  if(s.motivo) c.appendChild(h('p',{class:'motivo',text:'“'+s.motivo+'”'}));
  c.appendChild(tabelaMudancas(s));
  if(s.status!=='pendente'){ c.appendChild(h('p',{class:'hint',text:'Decidida em '+dataBR(s.resolvido_em)+(s.resposta?' · '+s.resposta:'')})); return c; }
  var st=h('p',{class:'status'}), bar=h('div',{class:'bar'});
  async function decidir(acao,payload,resposta){
    try{ ignorarRt=Date.now()+3000; await Store.resolverSugestao(s.id,acao,payload,resposta); if(acao==='aprovar') await recarregarPontos(); toast(acao==='aprovar'?'Sugestão aprovada e aplicada nos pontos.':'Sugestão recusada.'); atualizarPendentes(); recarregar(); }
    catch(e){ st.textContent='Não foi possível concluir: '+erroMsg(e); st.className='status err'; }
  }
  bar.appendChild(h('button',{class:'btn pri',type:'button',text:'✅ Aprovar e aplicar',onclick:function(){ decidir('aprovar',null,null); }}));
  bar.appendChild(h('button',{class:'btn',type:'button',text:'✏️ Editar e aprovar',onclick:function(){ editarEAprovar(s,decidir); }}));
  bar.appendChild(h('button',{class:'btn del',type:'button',text:'✖ Recusar',onclick:async function(){ var r=await pedirTexto('Recusar sugestão','Motivo (aparece para quem sugeriu)',false); if(r!==null) decidir('recusar',null,r||null); }}));
  c.appendChild(bar); c.appendChild(st); return c;
}
function editarEAprovar(s,decidir){
  var atual=s.tipo==='alterar'?D.pontos.filter(function(p){ return p.id===s.ponto_id; })[0]:null;
  var base=s.tipo==='alterar'?Object.assign(sugCopia(atual||s.antes),s.payload):Object.assign({},sugCopia(s.payload));
  var obj=JSON.parse(JSON.stringify(base)), st=h('p',{class:'status'});
  abrirModal('Editar antes de aprovar',[h('p',{class:'hint',text:'Ajuste o que for preciso. Ao aprovar, estes dados vão para o cadastro de pontos.'}),formPonto(obj),st],[
    function(fechar){ return h('button',{class:'btn pri',type:'button',text:'Aprovar com estas alterações',onclick:function(){ if(!String(obj.endereco||'').trim()){ st.textContent='Preencha o endereço.'; st.className='status err'; return; } fechar(); decidir('aprovar',sugCopia(obj),null); }}); },
    function(fechar){ return h('button',{class:'btn',type:'button',text:'Cancelar',onclick:fechar}); }
  ],true);
}

/* ---- comercial: minhas sugestões ---- */
function viewMinhasSugestoes(v){
  v.appendChild(h('h2',{text:'Minhas sugestões'}));
  v.appendChild(h('p',{class:'hint',text:'Acompanhe aqui o que você pediu ao administrador. Para sugerir, vá em "Pontos da proposta".'}));
  var box=h('div'); v.appendChild(box); box.appendChild(h('p',{class:'hint',text:'Carregando…'}));
  Store.listarSugestoes(null).then(function(lista){
    box.innerHTML=''; if(!lista.length){ box.appendChild(h('p',{class:'hint',text:'Você ainda não enviou sugestões.'})); return; }
    lista.forEach(function(s){ var c=h('div',{class:'sug'}); c.appendChild(h('div',{class:'sughead'},[h('span',{class:'t',text:tituloSugestao(s)}),badgeStatus(s.status)])); c.appendChild(h('p',{class:'hint',text:'Enviada em '+dataBR(s.criado_em)})); c.appendChild(tabelaMudancas(s)); if(s.status!=='pendente') c.appendChild(h('p',{class:'hint',text:'Resposta do administrador'+(s.resposta?': '+s.resposta:' (sem comentário)')})); box.appendChild(c); });
  }).catch(function(e){ box.innerHTML=''; box.appendChild(h('p',{class:'status err',text:'Não foi possível carregar: '+erroMsg(e)})); });
}
