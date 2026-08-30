(() => {
  const q = s => document.querySelector(s);
  const qa = s => [...document.querySelectorAll(s)];
  const rand = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
  const choose = a => a[rand(0,a.length-1)];
  const svgEl=(name,attrs={})=>{const e=document.createElementNS('http://www.w3.org/2000/svg',name);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));return e};

  const home=q('#homeView'), toolView=q('#toolView'), title=q('#toolTitle');
  const tools={quick:q('#quickTool'),addsub:q('#addsubTool'),multdiv:q('#multdivTool')};
  const names={quick:'Quick Images',addsub:'Addition & Subtraction',multdiv:'Multiplication & Division'};
  qa('[data-open]').forEach(btn=>btn.addEventListener('click',()=>{
    home.classList.add('hidden'); toolView.classList.remove('hidden');
    Object.values(tools).forEach(t=>t.classList.add('hidden'));
    tools[btn.dataset.open].classList.remove('hidden');
    title.textContent=names[btn.dataset.open];
    window.scrollTo({top:0,behavior:'smooth'});
  }));
  q('#backHome').addEventListener('click',()=>{toolView.classList.add('hidden');home.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});});

  // QUICK IMAGES
  let qs=null, qr=1, qn=1, qtimer=null;
  const qv=q('#quickVisual'), qmin=q('#quickMin'), qmax=q('#quickMax'), qtime=q('#quickTime'), qrounds=q('#quickRounds');
  const qstatus=q('#quickStatus'), qready=q('#quickReady'), qsvg=q('#quickSvg'), qthink=q('#quickThink'), qanswer=q('#quickAnswer'), qnum=q('#quickAnswerNum');
  const qflash=q('#quickFlash'), qhide=q('#quickHide'), qreveal=q('#quickReveal'), qnext=q('#quickNext');
  function qHideAll(){[qready,qsvg,qthink,qanswer].forEach(x=>x.classList.add('hidden'));[qflash,qhide,qreveal,qnext].forEach(x=>x.classList.add('hidden'))}
  function qStage(s){
    qHideAll(); qstatus.textContent=`Round ${qr} of ${qs.rounds} · ${s[0].toUpperCase()+s.slice(1)}`;
    if(s==='ready'){qready.classList.remove('hidden');qflash.classList.remove('hidden')}
    if(s==='flash'){qsvg.classList.remove('hidden');if(qs.time==='manual')qhide.classList.remove('hidden')}
    if(s==='think'){qthink.classList.remove('hidden');qreveal.classList.remove('hidden')}
    if(s==='reveal'){qanswer.classList.remove('hidden');qnext.classList.remove('hidden')}
  }
  function drawQuick(){
    qsvg.innerHTML='';
    const dot=(x,y,r=22)=>qsvg.appendChild(svgEl('circle',{cx:x,cy:y,r,fill:'#111827'}));
    if(qs.visual==='dots'){
      const patterns={
        1:[[260,160]],
        2:[[210,120],[310,200]],
        3:[[210,110],[260,160],[310,210]],
        4:[[210,110],[310,110],[210,210],[310,210]],
        5:[[200,100],[320,100],[260,160],[200,220],[320,220]],
        6:[[200,90],[320,90],[200,160],[320,160],[200,230],[320,230]],
        7:[[190,90],[260,90],[330,90],[190,160],[260,160],[330,160],[260,230]],
        8:[[190,90],[260,90],[330,90],[190,160],[330,160],[190,230],[260,230],[330,230]],
        9:[[190,90],[260,90],[330,90],[190,160],[260,160],[330,160],[190,230],[260,230],[330,230]],
        10:[[170,90],[230,90],[290,90],[350,90],[200,160],[320,160],[170,230],[230,230],[290,230],[350,230]]
      };
      (patterns[qn]||patterns[10]).forEach(p=>dot(p[0],p[1]));
      return;
    }
    const frames=qs.visual==='double'?2:1, cell=72, gap=18, sx=80, sy=frames===2?7:88;
    for(let f=0;f<frames;f++)for(let r=0;r<2;r++)for(let c=0;c<5;c++){
      qsvg.appendChild(svgEl('rect',{x:sx+c*cell,y:sy+f*(144+gap)+r*cell,width:cell,height:cell,fill:'white',stroke:'#111827','stroke-width':3}))
    }
    for(let i=0;i<qn;i++){
      const f=Math.floor(i/10), w=i%10, r=Math.floor(w/5), c=w%5;
      dot(sx+c*cell+36, sy+f*(144+gap)+r*cell+36, 24);
    }
  }
  function qPrep(){qn=rand(qs.min,qs.max);qnum.textContent=qn;drawQuick();qStage('ready')}
  qv.addEventListener('change',()=>{const m=qv.value==='double'?20:10;qmin.max=qmax.max=m;if(+qmax.value>m)qmax.value=m});
  q('#quickForm').addEventListener('submit',e=>{
    e.preventDefault();
    const maxAllowed=qv.value==='double'?20:10, min=Math.max(1,Math.min(maxAllowed,+qmin.value||1)), max=Math.max(1,Math.min(maxAllowed,+qmax.value||maxAllowed));
    if(min>max){q('#quickError').classList.remove('hidden');return}
    q('#quickError').classList.add('hidden'); qs={visual:qv.value,min,max,time:qtime.value,rounds:+qrounds.value}; qr=1; qPrep();
  });
  qflash.addEventListener('click',()=>{qStage('flash');if(qs.time!=='manual')qtimer=setTimeout(()=>qStage('think'),+qs.time)});
  qhide.addEventListener('click',()=>{clearTimeout(qtimer);qStage('think')});
  qreveal.addEventListener('click',()=>qStage('reveal'));
  qnext.addEventListener('click',()=>{if(qr>=qs.rounds){qHideAll();qstatus.textContent='Routine complete';qready.classList.remove('hidden');return}qr++;qPrep()});

  // ADD/SUB
  let as=null, ar=1, ac=null, atimer=null;
  const astatus=q('#addsubStatus'), aready=q('#addsubReady'), aproblem=q('#addsubProblem'), athink=q('#addsubThink'), aanswer=q('#addsubAnswer'), aeq=q('#addsubEquation');
  const aflash=q('#addsubFlash'), ahide=q('#addsubHide'), areveal=q('#addsubReveal'), anext=q('#addsubNext');
  function aHideAll(){[aready,aproblem,athink,aanswer].forEach(x=>x.classList.add('hidden'));[aflash,ahide,areveal,anext].forEach(x=>x.classList.add('hidden'))}
  function aStage(s){aHideAll();astatus.textContent=`Round ${ar} of ${as.rounds} · ${s[0].toUpperCase()+s.slice(1)}`;if(s==='ready'){aready.classList.remove('hidden');aflash.classList.remove('hidden')}if(s==='flash'){aproblem.classList.remove('hidden');if(as.time==='manual')ahide.classList.remove('hidden')}if(s==='think'){athink.classList.remove('hidden');areveal.classList.remove('hidden')}if(s==='reveal'){aanswer.classList.remove('hidden');anext.classList.remove('hidden')}}
  function makeA(){
    let op=as.op;if(op==='mixed')op=Math.random()<.5?'addition':'subtraction';
    let a,b;
    if(op==='addition'){
      if(as.strategy==='make10'){a=rand(1,9);b=10-a}
      else if(as.strategy==='doubles'){a=rand(1,Math.min(10,Math.floor(as.range/2)));b=a}
      else if(as.strategy==='near'){a=rand(1,Math.min(9,Math.floor((as.range-1)/2)));b=a+1}
      else if(as.strategy==='nine'){a=9;b=rand(1,Math.max(1,as.range-9))}
      else {a=rand(0,as.range);b=rand(0,as.range-a)}
      ac={a,b,sym:'+',ans:a+b}
    } else {
      if(as.strategy==='make10'){a=10;b=rand(1,9)}
      else if(as.strategy==='doubles'){b=rand(1,Math.min(10,Math.floor(as.range/2)));a=Math.min(as.range,b*2)}
      else if(as.strategy==='near'){b=rand(2,Math.min(10,as.range));a=Math.min(as.range,b+b-1)}
      else if(as.strategy==='nine'){b=9;a=rand(9,as.range)}
      else {a=rand(1,as.range);b=rand(0,a)}
      ac={a,b,sym:'−',ans:a-b}
    }
    aproblem.textContent=`${ac.a} ${ac.sym} ${ac.b}`; aeq.textContent=`${ac.a} ${ac.sym} ${ac.b} = ${ac.ans}`
  }
  q('#addsubForm').addEventListener('submit',e=>{e.preventDefault();as={op:q('#addsubOp').value,strategy:q('#addsubStrategy').value,range:+q('#addsubRange').value,time:q('#addsubTime').value,rounds:+q('#addsubRounds').value};ar=1;makeA();aStage('ready')});
  aflash.addEventListener('click',()=>{aStage('flash');if(as.time!=='manual')atimer=setTimeout(()=>aStage('think'),+as.time)});
  ahide.addEventListener('click',()=>{clearTimeout(atimer);aStage('think')});
  areveal.addEventListener('click',()=>aStage('reveal'));
  anext.addEventListener('click',()=>{if(ar>=as.rounds){aHideAll();astatus.textContent='Routine complete';aready.classList.remove('hidden');return}ar++;makeA();aStage('ready')});

  // MULT/DIV
  let ms=null, mr=1, mtimer=null;
  const mmode=q('#multdivMode'), mop=q('#multdivOp'), mstatus=q('#multdivStatus'), mready=q('#multdivReady'), meq=q('#multdivEquation'), marray=q('#multdivArray');
  const mthink=q('#multdivThink'), mthinktitle=q('#multdivThinkTitle'), mthinksub=q('#multdivThinkSub'), manswer=q('#multdivAnswer'), mansmain=q('#multdivAnswerMain'), manssub=q('#multdivAnswerSub');
  const mflash=q('#multdivFlash'), mhide=q('#multdivHide'), mreveal=q('#multdivReveal'), mnext=q('#multdivNext');
  const selectedFamilies=()=>qa('.family:checked').map(x=>+x.value);
  q('#selectAllFamilies').addEventListener('click',()=>qa('.family').forEach(x=>x.checked=true));
  q('#clearFamilies').addEventListener('click',()=>qa('.family').forEach(x=>x.checked=false));
  mmode.addEventListener('change',()=>q('#multdivOpWrap').classList.toggle('hidden',mmode.value==='arrays'));
  function mHideAll(){[mready,meq,marray,mthink,manswer].forEach(x=>x.classList.add('hidden'));[mflash,mhide,mreveal,mnext].forEach(x=>x.classList.add('hidden'))}
  function mStage(s){
    mHideAll();mstatus.textContent=`Round ${mr} of ${ms.rounds} · ${s[0].toUpperCase()+s.slice(1)}`;
    if(s==='ready'){mready.classList.remove('hidden');mflash.classList.remove('hidden')}
    if(s==='flash'){(ms.mode==='arrays'?marray:meq).classList.remove('hidden');if(ms.time==='manual')mhide.classList.remove('hidden')}
    if(s==='think'){mthinktitle.textContent=ms.mode==='arrays'?'How many do you see?':'Solve it.';mthinksub.textContent=ms.mode==='arrays'?'What multiplication equation matches the array?':'What strategy did you use?';mthink.classList.remove('hidden');mreveal.classList.remove('hidden')}
    if(s==='reveal'){manswer.classList.remove('hidden');mnext.classList.remove('hidden')}
  }
  function drawArray(rows,cols){
    marray.innerHTML='';
    const maxDim=Math.max(rows,cols), gap=Math.min(38,270/Math.max(1,maxDim-1)), rad=Math.max(7,Math.min(14,gap*.3));
    const w=(cols-1)*gap,h=(rows-1)*gap,sx=280-w/2,sy=180-h/2;
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)marray.appendChild(svgEl('circle',{cx:sx+x*gap,cy:sy+y*gap,r:rad,fill:'#111827'}))
  }
  function makeM(){
    const fam=choose(ms.families), other=rand(1,ms.max), prod=fam*other;
    let op=ms.op;if(op==='mixed')op=Math.random()<.5?'multiplication':'division';if(ms.mode==='arrays')op='multiplication';
    drawArray(fam,other);
    if(op==='multiplication'){meq.textContent=`${fam} × ${other}`;mansmain.textContent=`${fam} × ${other} = ${prod}`;manssub.textContent=ms.mode==='arrays'?`${fam} rows of ${other} = ${prod}`:'How did you know?'}
    else {const divisor=Math.random()<.5?fam:other,quot=prod/divisor;meq.textContent=`${prod} ÷ ${divisor}`;mansmain.textContent=`${prod} ÷ ${divisor} = ${quot}`;manssub.textContent=`Because ${divisor} × ${quot} = ${prod}`}
  }
  q('#multdivForm').addEventListener('submit',e=>{
    e.preventDefault();const fams=selectedFamilies();
    if(!fams.length){q('#multdivError').classList.remove('hidden');return}
    q('#multdivError').classList.add('hidden');
    ms={mode:mmode.value,op:mop.value,families:fams,max:+q('#multdivMax').value,time:q('#multdivTime').value,rounds:+q('#multdivRounds').value};mr=1;makeM();mStage('ready')
  });
  mflash.addEventListener('click',()=>{mStage('flash');if(ms.time!=='manual')mtimer=setTimeout(()=>mStage('think'),+ms.time)});
  mhide.addEventListener('click',()=>{clearTimeout(mtimer);mStage('think')});
  mreveal.addEventListener('click',()=>mStage('reveal'));
  mnext.addEventListener('click',()=>{if(mr>=ms.rounds){mHideAll();mstatus.textContent='Routine complete';mready.classList.remove('hidden');return}mr++;makeM();mStage('ready')});
})();
