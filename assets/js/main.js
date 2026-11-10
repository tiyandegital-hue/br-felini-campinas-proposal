/* Salão Felini — interações (quiz, agendamento, sliders, filtros, FAQ) */
(function(){
"use strict";
var WA="5519997488228";
function waLink(msg){return "https://wa.me/"+WA+"?text="+encodeURIComponent(msg);}
function $(s,c){return (c||document).querySelector(s);}
function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));}

/* mobile nav */
var tog=$(".nav-toggle"), nav=$(".main-nav");
if(tog&&nav){tog.addEventListener("click",function(){var o=nav.classList.toggle("open");tog.setAttribute("aria-expanded",o?"true":"false");});}

/* FAQ accordions */
$$(".faq-item").forEach(function(item){
  var q=$(".faq-q",item), a=$(".faq-a",item);
  if(!q||!a) return;
  q.addEventListener("click",function(){
    var open=item.classList.contains("open");
    $$(".faq-item.open").forEach(function(o){o.classList.remove("open");var oa=$(".faq-a",o);if(oa)oa.style.maxHeight="0";var oq=$(".faq-q",o);if(oq)oq.setAttribute("aria-expanded","false");});
    if(!open){item.classList.add("open");a.style.maxHeight=a.scrollHeight+"px";q.setAttribute("aria-expanded","true");}
  });
});

/* Curl finder (home) */
var finderData={
 "2":{title:"Cabelos Ondulados (2A a 2C)",body:"O maior desafio das onduladas em Campinas é encontrar produtos e cortes que revelem a onda sem deixar o fio pesado.",tech:"Corte em camadas invisíveis para soltar o comprimento e criar movimento.",care:"Low Poo com aminoácidos leves e manteigas de alta absorção."},
 "3":{title:"Cabelos Cacheados (3A a 3C)",body:"Espirais de mola média a fechada que pedem definição sem pesar e reposição constante de hidratação nas pontas.",tech:"Corte a seco cacho a cacho, respeitando o encolhimento de cada mecha.",care:"Método LOC (Líquido, Óleo, Creme) e fitagem com creme modelador."},
 "4":{title:"Cabelos Crespos (4A a 4C)",body:"Zigue-zague compacto, coroa e potência: a prioridade é nutrição profunda, proteção mecânica e volume com intenção.",tech:"Corte em camadas que nivela o volume e preserva o comprimento.",care:"Manteigas puras de karité e murumuru, twists e pente garfo."}
};
$$(".finder-tab").forEach(function(btn){
  btn.addEventListener("click",function(){
    $$(".finder-tab").forEach(function(b){b.setAttribute("aria-pressed","false");});
    btn.setAttribute("aria-pressed","true");
    var d=finderData[btn.dataset.family]; if(!d) return;
    var p=$("#finder-panel"); if(!p) return;
    $("#finder-title",p).textContent=d.title;
    $("#finder-body",p).textContent=d.body;
    $("#finder-tech",p).textContent=d.tech;
    $("#finder-care",p).textContent=d.care;
  });
});

/* Before/after sliders */
$$(".ba").forEach(function(ba){
  var range=$("input[type=range]",ba);
  function set(v){ba.style.setProperty("--pos",v+"%"); if(range) range.value=v;}
  if(range){range.addEventListener("input",function(){set(range.value);});}
  var dragging=false;
  function fromEvent(e){var r=ba.getBoundingClientRect();var x=(e.touches?e.touches[0].clientX:e.clientX)-r.left;set(Math.max(2,Math.min(98,x/r.width*100)));}
  ba.addEventListener("pointerdown",function(e){dragging=true;fromEvent(e);});
  window.addEventListener("pointermove",function(e){if(dragging)fromEvent(e);});
  window.addEventListener("pointerup",function(){dragging=false;});
});

/* Category filters (serviços + galeria) */
$$("[data-filter-group]").forEach(function(group){
  var scope=group.dataset.filterGroup;
  $$(".filter-btn",group).forEach(function(btn){
    btn.addEventListener("click",function(){
      $$(".filter-btn",group).forEach(function(b){b.setAttribute("aria-pressed","false");});
      btn.setAttribute("aria-pressed","true");
      var f=btn.dataset.filter;
      $$("[data-cat-group='"+scope+"']").forEach(function(card){
        var cats=(card.dataset.cat||"").split(" ");
        card.classList.toggle("hidden-card", f!=="all" && cats.indexOf(f)===-1);
      });
    });
  });
});

/* ---- Quiz (cachos.html) ---- */
var quizEl=$("#quiz");
if(quizEl){
  var steps=[
    {q:"Como seu cabelo se comporta logo após lavar, sem nenhum creme ou óleo?",sub:"Observe a silhueta natural das mechas secando ao ar livre.",opts:[
      {v:"2",t:"Ondula levemente em S",d:"A raiz é lisa ou escorrida; forma curvas longas e abertas no comprimento."},
      {v:"3",t:"Forma molinhas espirais",d:"Cachos bem definidos em tubinhos (como giz ou lápis) com balanço elástico."},
      {v:"4a",t:"Mola miúda e densa",d:"Molinhas bastante compactas, padrão visível desde a raiz, muito volume."},
      {v:"4c",t:"Padrão em Z ou nuvem fofa",d:"Fios angulados em zigue-zague ou textura aveludada sem espiral evidente."}]},
    {q:"Como seu fio reage à água e ao produto?",sub:"Pense no último wash day: o cabelo absorveu rápido ou repeliu a água?",opts:[
      {v:"baixa",t:"A água escorre e demora a molhar",d:"O fio repele a água e o produto fica na superfície — porosidade baixa."},
      {v:"media",t:"Absorve bem e segura a hidratação",d:"Molha com facilidade e mantém a maciez por alguns dias — porosidade média."},
      {v:"alta",t:"Absorve na hora, mas seca muito rápido",d:"Encharca fácil, perde a água rápido e vive com frizz — porosidade alta."},
      {v:"nsei",t:"Nunca reparei nisso",d:"Sem problema: medimos a porosidade no diagnóstico presencial."}]},
    {q:"Como é o volume e a densidade do seu cabelo?",sub:"Junte o cabelo em um rabo: qual é a grossura do feixe?",opts:[
      {v:"fina",t:"Fino e leve",d:"Fios finos, pouco volume, perdem a forma com produtos pesados."},
      {v:"media",t:"Médio",d:"Volume moderado, segura a definição com finalização leve."},
      {v:"densa",t:"Denso e volumoso",d:"Muito cabelo, volume expressivo, precisa de camadas para distribuir o peso."},
      {v:"muito",t:"Muito denso, coroa cheia",d:"Coroa imponente, fios abundantes, nutrição constante é prioridade."}]},
    {q:"Você faz ou já fez química — progressiva, relaxamento, coloração?",sub:"Inclui alisamentos antigos e luzes recentes.",opts:[
      {v:"nunca",t:"Nunca fiz química",d:"Cabelo virgem: o foco é manutenção, definição e saúde do fio."},
      {v:"color",t:"Coloração ou luzes",d:"Fios clareados pedem reposição de massa e selagem cuticular."},
      {v:"alis",t:"Progressiva ou relaxamento",d:"Química de alisamento: avaliamos a transição e o corte programado."},
      {v:"trans",t:"Estou em transição capilar",d:"Duas texturas convivendo: acolhimento gradual, no seu tempo."}]}
  ];
  var cur=0, answers={}, picked=null;
  var qTitle=$("#quiz-q"), qSub=$("#quiz-sub"), qOpts=$("#quiz-opts"), qStep=$("#quiz-step"),
      qBar=$("#quiz-bar"), qNext=$("#quiz-next"), qBack=$("#quiz-back"), qResult=$("#quiz-result");
  function renderStep(){
    var s=steps[cur];
    qTitle.textContent=s.q; qSub.textContent=s.sub;
    qStep.textContent="Passo "+(cur+1)+" de 4";
    qBar.style.width=((cur)/4*100)+"%";
    qBar.parentElement.setAttribute("aria-valuenow",String(cur*25));
    qOpts.innerHTML="";
    picked=answers[cur]||null;
    s.opts.forEach(function(o){
      var b=document.createElement("button");
      b.type="button"; b.className="opt"+(picked===o.v?" sel":"");
      b.innerHTML="<b></b><span></span>";
      b.querySelector("b").textContent=o.t; b.querySelector("span").textContent=o.d;
      b.addEventListener("click",function(){
        picked=o.v; answers[cur]=o.v;
        $$(".opt",qOpts).forEach(function(x){x.classList.remove("sel");});
        b.classList.add("sel"); qNext.disabled=false;
      });
      qOpts.appendChild(b);
    });
    qNext.disabled=!picked;
    qNext.textContent=cur===3?"Ver meu resultado":"Continuar";
    qBack.style.visibility=cur===0?"hidden":"visible";
  }
  qNext.addEventListener("click",function(){
    if(!picked) return;
    if(cur<3){cur++; renderStep();}
    else{showResult();}
  });
  qBack.addEventListener("click",function(){if(cur>0){cur--; renderStep();}});
  function showResult(){
    var map={"2":["2B","Ondulados (2A a 2C)","Corte em camadas invisíveis para soltar o comprimento e criar movimento.","Low Poo com aminoácidos leves e manteigas de alta absorção."],
             "3":["3B","Cacheados (3A a 3C)","Corte a seco cacho a cacho, com dedoliss nas mechas do topo e frontal.","Método LOC (Líquido, Óleo, Creme) e fitagem com creme modelador."],
             "4a":["4A","Crespos (4A a 4C)","Fitagem com pentes de dentes largos e óleo reparador, corte em camadas.","Manteigas puras de karité e murumuru; nutrição constante."],
             "4c":["4C","Crespos (4A a 4C)","Pente garfo para estilização e massagem capilar; volume com intenção.","Manteiga pura de karité e murumuru; sem definição forçada."]};
    var r=map[answers[0]]||map["3"];
    var por={baixa:"Porosidade baixa: foco em hidratação com calor suave.",media:"Porosidade média: foco em nutrição constante.",alta:"Porosidade alta: foco em reconstrução com aminoácidos e selagem lipídica.",nsei:"Porosidade a confirmar no diagnóstico presencial."}[answers[1]]||"";
    var hist={nunca:"",color:" Com coloração, inclua reposição de massa no cronograma.",alis:" Com histórico de alisamento, avaliamos a transição no diagnóstico.",trans:" Em transição, o acolhimento é gradual e no seu tempo."}[answers[3]]||"";
    $("#result-type").textContent=r[0];
    $("#result-family").textContent=r[1];
    $("#result-tech").textContent=r[2];
    $("#result-care").textContent=r[3]+" "+por+hist;
    qBar.style.width="100%";
    $("#quiz-steps").style.display="none";
    qResult.hidden=false;
    qResult.scrollIntoView({behavior:"smooth",block:"start"});
    var waBtn=$("#result-wa");
    if(waBtn) waBtn.href=waLink("Olá, Salão Felini! Fiz o quiz e minha provável curvatura é "+r[0]+" ("+r[1]+"). Quero agendar um diagnóstico presencial.");
  }
  var again=$("#quiz-again");
  if(again) again.addEventListener("click",function(){cur=0;answers={};qResult.hidden=true;$("#quiz-steps").style.display="";renderStep();});
  renderStep();
}

/* ---- Booking (agendar.html) ---- */
var bookEl=$("#booking");
if(bookEl){
  var state={service:null,serviceLabel:"",serviceDur:"",curl:null,curlLabel:"",date:null,dateLabel:"",time:null,name:"",phone:""};
  var services=[
    {id:"corte",label:"Corte Especializado em Cachos",dur:"~ 1h30",tag:"Mais pedido",desc:"Corte a seco respeitando a geometria natural, volume, definição e encolhimento do seu cacho."},
    {id:"hidra",label:"Hidratação / Nutrição Profunda",dur:"~ 1h15",tag:"Brilho & Maciez",desc:"Tratamento intensivo de reposição lipídica e hídrica profunda para curvaturas ressecadas."},
    {id:"luzes",label:"Iluminação / Mechas para Cachos",dur:"~ 3h30",tag:"Exige Teste de Mecha",desc:"Clareamento desenhado cacho por cacho com teste de mecha rigoroso e proteção estrutural."},
    {id:"transicao",label:"Transição Capilar & Big Chop",dur:"~ 2h00",tag:"Acolhimento Total",desc:"Acolhimento emocional, consultoria de texturas, transição gradual ou o grande corte da liberdade."},
    {id:"finalizacao",label:"Finalização & Fitagem / Penteado",dur:"~ 50min",tag:"",desc:"Fitagem estruturada, secagem com difusor e técnicas para máxima definição e day after prolongado."}
  ];
  var curls=[
    {id:"2",label:"Ondulados 2A–2C"},{id:"3",label:"Cacheados 3A–3C"},{id:"4",label:"Crespos 4A–4C"},
    {id:"trans",label:"Em transição capilar"},{id:"nsei",label:"Não sei — avaliaremos juntas"}
  ];
  var bStep=0;
  var panels=[$("#bk-step1"),$("#bk-step2"),$("#bk-step3"),$("#bk-step4")];
  var dots=$$(".step-dot",bookEl);
  function showStep(n){
    bStep=n;
    panels.forEach(function(p,i){p.hidden=i!==n;});
    dots.forEach(function(d,i){d.classList.toggle("on",i<=n);});
    $("#bk-progress").style.width=((n)/4*100)+"%";
    $("#bk-step-label").textContent="Etapa "+(n+1)+"/4";
    updateSummary();
    bookEl.scrollIntoView({behavior:"smooth",block:"start"});
  }
  function updateSummary(){
    $("#sum-service").textContent=state.serviceLabel||"Nenhum selecionado";
    $("#sum-curl").textContent=state.curlLabel||"Não informada";
    $("#sum-date").textContent=(state.dateLabel&&state.time)?state.dateLabel+" • "+state.time:"Selecione no passo 3";
    $("#sum-client").textContent=state.name?(state.name+(state.phone?" — "+state.phone:"")):"Aguardando dados";
    var ok=state.service&&state.curl&&state.date&&state.time&&state.name&&state.phone;
    var waBtn=$("#bk-wa");
    if(ok){
      var msg="Olá, Salão Felini! Quero confirmar meu horário:\n• Serviço: "+state.serviceLabel+" ("+state.serviceDur+")\n• Curvatura: "+state.curlLabel+"\n• Data: "+state.dateLabel+"\n• Horário: "+state.time+"\n• Nome: "+state.name+"\n• WhatsApp: "+state.phone;
      waBtn.href=waLink(msg);
    }
  }
  /* step 1 */
  var svcWrap=$("#bk-services");
  services.forEach(function(s){
    var b=document.createElement("button");
    b.type="button"; b.className="opt"; b.dataset.id=s.id;
    b.innerHTML="<b></b><span></span>";
    b.querySelector("b").textContent=s.label+(s.tag?" — "+s.tag:"");
    b.querySelector("span").textContent=s.desc+" Duração: "+s.dur+".";
    b.addEventListener("click",function(){
      state.service=s.id; state.serviceLabel=s.label; state.serviceDur=s.dur;
      $$(".opt",svcWrap).forEach(function(x){x.classList.remove("sel");});
      b.classList.add("sel"); $("#bk-next1").disabled=false; updateSummary();
    });
    svcWrap.appendChild(b);
  });
  $("#bk-next1").addEventListener("click",function(){if(state.service)showStep(1);});
  /* step 2 */
  var curlWrap=$("#bk-curls");
  curls.forEach(function(c){
    var b=document.createElement("button");
    b.type="button"; b.className="opt"; b.dataset.id=c.id;
    b.innerHTML="<b></b>";
    b.querySelector("b").textContent=c.label;
    b.addEventListener("click",function(){
      state.curl=c.id; state.curlLabel=c.label;
      $$(".opt",curlWrap).forEach(function(x){x.classList.remove("sel");});
      b.classList.add("sel"); $("#bk-next2").disabled=false; updateSummary();
    });
    curlWrap.appendChild(b);
  });
  $("#bk-back2").addEventListener("click",function(){showStep(0);});
  $("#bk-next2").addEventListener("click",function(){if(state.curl)showStep(2);});
  /* step 3: dates — only Thu/Fri/Sat, next 21 days */
  var dateWrap=$("#bk-dates"), slotWrap=$("#bk-slots");
  var days=["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
  var months=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  var today=new Date(); today.setHours(0,0,0,0);
  var avail=[];
  for(var i=0;i<21;i++){
    var d=new Date(today); d.setDate(today.getDate()+i);
    var dow=d.getDay();
    if(dow===4||dow===5||dow===6) avail.push(d);
  }
  avail.forEach(function(d){
    var b=document.createElement("button");
    b.type="button"; b.className="date-btn";
    b.innerHTML="<b></b><span></span>";
    b.querySelector("b").textContent=days[d.getDay()];
    b.querySelector("span").textContent=d.getDate()+" de "+months[d.getMonth()];
    b.addEventListener("click",function(){
      state.date=d; state.dateLabel=days[d.getDay()]+", "+d.getDate()+" de "+months[d.getMonth()];
      $$(".date-btn",dateWrap).forEach(function(x){x.classList.remove("sel");});
      b.classList.add("sel"); renderSlots(d.getDay()); updateSummary();
    });
    dateWrap.appendChild(b);
  });
  function renderSlots(dow){
    slotWrap.innerHTML=""; state.time=null; $("#bk-next3").disabled=true;
    var start=dow===6?8:9, end=18;
    var times=[];
    // Thu/Fri: 09:30–17:30 (hours 09:30–18:00); Sat: 08:00–17:30 (hours 08:00–18:00)
    for(var h=start;h<end;h++){
      times.push(String(h).padStart(2,"0")+":00");
      times.push(String(h).padStart(2,"0")+":30");
    }
    if(dow!==6){times=times.filter(function(t){return t!=="09:00";});}
    times=times.filter(function(t){return t!=="18:00"&&t!=="18:30";}).sort();
    times.forEach(function(t){
      var b=document.createElement("button");
      b.type="button"; b.className="slot"; b.textContent=t;
      b.addEventListener("click",function(){
        state.time=t;
        $$(".slot",slotWrap).forEach(function(x){x.classList.remove("sel");});
        b.classList.add("sel"); $("#bk-next3").disabled=false; updateSummary();
      });
      slotWrap.appendChild(b);
    });
  }
  $("#bk-back3").addEventListener("click",function(){showStep(1);});
  $("#bk-next3").addEventListener("click",function(){if(state.date&&state.time)showStep(3);});
  /* step 4 */
  var nm=$("#bk-name"), ph=$("#bk-phone");
  function checkStep4(){
    state.name=nm.value.trim(); state.phone=ph.value.trim();
    $("#bk-wa").classList.toggle("disabled",!(state.name&&state.phone));
    updateSummary();
  }
  [nm,ph].forEach(function(el){el.addEventListener("input",checkStep4);});
  $("#bk-back4").addEventListener("click",function(){showStep(2);});
  $("#bk-wa").addEventListener("click",function(e){
    checkStep4();
    if(!state.name||!state.phone){e.preventDefault();alert("Preencha nome e WhatsApp para confirmar.");nm.focus();}
  });
  updateSummary();
}

/* Contact pre-assessment form → WhatsApp */
var cForm=$("#contact-form");
if(cForm){
  cForm.addEventListener("submit",function(e){
    e.preventDefault();
    var ok=true;
    ["cf-name","cf-phone"].forEach(function(id){
      var f=document.getElementById(id), wrap=f.closest(".field");
      if(!f.value.trim()){wrap.classList.add("invalid"); ok=false;} else wrap.classList.remove("invalid");
    });
    if(!ok) return;
    var curl=(cForm.querySelector("input[name='curvatura']:checked")||{}).value||"Não informada";
    var proc=document.getElementById("cf-proc").value;
    var msg=document.getElementById("cf-msg").value.trim();
    var text="Olá, Salão Felini! Pré-avaliação:\n• Nome: "+document.getElementById("cf-name").value.trim()+"\n• WhatsApp: "+document.getElementById("cf-phone").value.trim()+"\n• Curvatura: "+curl+"\n• Procedimento: "+proc+(msg?"\n• Observações: "+msg:"");
    window.open(waLink(text),"_blank");
  });
}

/* smooth anchor offset for sticky header is handled by CSS scroll-margin */
$$("section[id], [id]").forEach(function(el){el.style.scrollMarginTop="90px";});
})();
