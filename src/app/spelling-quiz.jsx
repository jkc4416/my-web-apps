import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/*
  ╔══════════════════════════════════════════════════════════════╗
  ║  맞춤법 왕 — Redesigned                                       ║
  ║  Design: Golden Energy + Game-like Quiz Flow                 ║
  ║  Palette: Deep warm black + amber/gold accents               ║
  ╚══════════════════════════════════════════════════════════════╝
*/

// ===== QUESTIONS =====
const QS=[
  {id:1,cat:"spell",q:"다음 중 맞춤법이 맞는 것은?",opts:["왠지 모르게","웬지 모르게","왠지 몰르게","웬지 몰르게"],ans:0,exp:"'왠지'가 맞습니다. '왜인지'의 줄임말입니다. '웬'은 '웬일이야'처럼 '어찌 된'이라는 뜻입니다."},
  {id:2,cat:"spell",q:"올바른 표기는?",opts:["어의없다","어이없다","어히없다","어위없다"],ans:1,exp:"'어이없다'가 맞습니다. '어이'는 '엄두'라는 뜻의 옛말에서 유래했습니다."},
  {id:3,cat:"spell",q:"맞춤법이 올바른 것은?",opts:["금새 도착했다","금세 도착했다","금시 도착했다","금쇄 도착했다"],ans:1,exp:"'금세'가 맞습니다. '금시에(今時에)'가 줄어든 말입니다. '금새'는 물건의 값을 뜻합니다."},
  {id:4,cat:"spell",q:"올바른 표현은?",opts:["안 되","않 되","안 돼","않 돼"],ans:2,exp:"'안 돼'가 맞습니다. '되어'의 줄임이 '돼'이며, '하'를 넣어 자연스러우면 '되', 아니면 '돼'입니다."},
  {id:5,cat:"spell",q:"맞는 표기는?",opts:["설겆이","설거지","설겅이","설거이"],ans:1,exp:"'설거지'가 표준어입니다."},
  {id:6,cat:"spell",q:"올바른 것은?",opts:["가르키다","가르치다","가리키다","가르히다"],ans:1,exp:"'가르치다'(teach)와 '가리키다'(point)는 다른 단어입니다."},
  {id:7,cat:"spell",q:"맞는 표현은?",opts:["깨끗히","깨끗이","깨끗하이","깨끗해"],ans:1,exp:"'깨끗이'가 맞습니다. 'ㅌ' 받침 뒤에는 '-이'가 붙습니다."},
  {id:8,cat:"spell",q:"맞춤법이 맞는 것은?",opts:["되물림","대물림","데물림","디물림"],ans:1,exp:"'대물림'이 맞습니다. '대(代)를 물려준다'는 뜻입니다."},
  {id:9,cat:"spell",q:"맞는 표기는?",opts:["몇 일","며칠","멫일","몇일"],ans:1,exp:"'며칠'이 맞습니다. '몇+일'이 합쳐진 하나의 단어입니다."},
  {id:10,cat:"spell",q:"맞는 표기는?",opts:["역활","역할","역할이","역활이"],ans:1,exp:"'역할(役割)'이 맞습니다. '할'은 '나눌 할(割)'자입니다."},
  {id:11,cat:"spell",q:"올바른 것은?",opts:["희안하다","희한하다","희안 하다","희한 하다"],ans:1,exp:"'희한(稀罕)하다'가 맞습니다. '드물고 이상하다'는 뜻입니다."},
  {id:12,cat:"spell",q:"올바른 표현은?",opts:["곰곰히","곰곰이","곰곰히이","곰곰"],ans:1,exp:"'곰곰이'가 맞습니다. 'ㅁ' 받침 뒤에는 '-이'가 붙습니다."},
  {id:13,cat:"spell",q:"맞는 것은?",opts:["베게","배게","배개","베개"],ans:3,exp:"'베개'가 맞습니다. '베다(눕다)'에서 나온 말입니다."},
  {id:14,cat:"spell",q:"올바른 표기는?",opts:["눈쌀을 찌푸리다","눈살을 찌푸리다","눈쌀을 찡그리다","눈살을 지푸리다"],ans:1,exp:"'눈살을 찌푸리다'가 맞습니다. '눈살'은 미간의 살입니다."},
  {id:15,cat:"spell",q:"맞는 표현은?",opts:["댓가를 치르다","대가를 치르다","대가를 치루다","댓가를 치루다"],ans:1,exp:"'대가를 치르다'가 맞습니다. '대가(代價)'에 사이시옷 안 붙으며 '치르다'가 맞는 활용형입니다."},
  {id:16,cat:"space",q:"올바른 띄어쓰기는?",opts:["그 만큼","그만큼","그 만 큼","그만 큼"],ans:1,exp:"'그만큼'은 하나의 부사로 붙여 씁니다."},
  {id:17,cat:"space",q:"맞는 띄어쓰기는?",opts:["할 수있다","할 수 있다","할수 있다","할수있다"],ans:1,exp:"'할 수 있다'가 맞습니다. '수'는 의존명사이므로 띄어 씁니다."},
  {id:18,cat:"space",q:"맞는 띄어쓰기는?",opts:["뿐만아니라","뿐만 아니라","뿐 만 아니라","뿐 만아니라"],ans:1,exp:"'뿐만 아니라'가 맞습니다. '뿐만'은 붙이고 '아니라'는 띄어 씁니다."},
  {id:19,cat:"space",q:"맞는 것은?",opts:["이 것","이것","이 겄","이 거것"],ans:1,exp:"'이것'은 지시대명사로 한 단어입니다."},
  {id:20,cat:"space",q:"올바른 띄어쓰기는?",opts:["어찌됐든","어찌 됐든","어찌됬든","어째됐든"],ans:1,exp:"'어찌 됐든'이 맞습니다. '어찌'와 '됐든'은 띄어 씁니다."},
  {id:21,cat:"foreign",q:"맞는 외래어 표기는?",opts:["카페","까페","카폐","까폐"],ans:0,exp:"'카페'가 맞습니다. 외래어 표기법에서 된소리는 쓰지 않습니다."},
  {id:22,cat:"foreign",q:"올바른 표기는?",opts:["악세사리","액세서리","악세서리","엑세사리"],ans:1,exp:"'액세서리(accessory)'가 맞습니다."},
  {id:23,cat:"foreign",q:"맞는 표기는?",opts:["컨텐츠","콘텐츠","컨텐쯔","콘텐쯔"],ans:1,exp:"'콘텐츠(contents)'가 표준입니다."},
  {id:24,cat:"foreign",q:"올바른 것은?",opts:["메세지","메시지","매세지","메씨지"],ans:1,exp:"'메시지(message)'가 맞습니다."},
  {id:25,cat:"vocab",q:"'고진감래'의 뜻은?",opts:["옛 것이 좋다","고생 끝에 낙이 온다","감나무 밑에서 기다리다","진심이 통한다"],ans:1,exp:"'고진감래(苦盡甘來)' — 쓴 것이 다하면 단 것이 온다."},
  {id:26,cat:"vocab",q:"'역지사지'의 뜻은?",opts:["역사를 기록하다","입장을 바꿔 생각하다","힘을 합치다","멀리 내다보다"],ans:1,exp:"'역지사지(易地思之)' — 처지를 바꾸어 생각하다."},
  {id:27,cat:"vocab",q:"'사면초가'의 뜻은?",opts:["사방에서 도움이 온다","적으로 둘러싸인 상태","네 번의 기회","산 넘어 산"],ans:1,exp:"'사면초가(四面楚歌)' — 사방이 적으로 고립된 상태."},
  {id:28,cat:"vocab",q:"'감개무량'의 뜻은?",opts:["감사할 게 없다","감동이 한이 없다","눈물이 나오다","계산이 안 되다"],ans:1,exp:"'감개무량(感慨無量)' — 마음에 느끼는 감동이 한이 없다."},
  {id:29,cat:"vocab",q:"'해박하다'의 뜻은?",opts:["피곤하다","지식이 넓고 많다","얇고 가볍다","순수하다"],ans:1,exp:"'해박(該博)하다' — 학식이나 지식이 넓고 많다."},
  {id:30,cat:"vocab",q:"'미증유'의 뜻은?",opts:["아직 없었던 일","미소를 짓다","증거가 없다","오래된 풍습"],ans:0,exp:"'미증유(未曾有)' — 아직까지 한 번도 있지 않았던."},
];

const CATS=[
  {id:"all",name:"전체",emoji:"📚",color:"#fbbf24"},
  {id:"spell",name:"맞춤법",emoji:"✏️",color:"#f87171"},
  {id:"space",name:"띄어쓰기",emoji:"⌨️",color:"#60a5fa"},
  {id:"foreign",name:"외래어",emoji:"🌍",color:"#2dd4bf"},
  {id:"vocab",name:"어휘",emoji:"📖",color:"#fbbf24"},
];

const GRADES=[
  {min:95,label:"맞춤법 왕",emoji:"👑",color:"#fbbf24",glow:"rgba(251,191,36,.2)"},
  {min:85,label:"맞춤법 달인",emoji:"🏆",color:"#f59e0b",glow:"rgba(245,158,11,.15)"},
  {min:70,label:"맞춤법 고수",emoji:"⭐",color:"#2dd4bf",glow:"rgba(45,212,191,.12)"},
  {min:50,label:"맞춤법 중수",emoji:"📝",color:"#60a5fa",glow:"rgba(96,165,250,.12)"},
  {min:30,label:"맞춤법 초보",emoji:"📚",color:"#a78bfa",glow:"rgba(167,139,250,.1)"},
  {min:0,label:"맞춤법 입문",emoji:"🌱",color:"#64748b",glow:"rgba(100,116,139,.08)"},
];
function gg(p){return GRADES.find(g=>p>=g.min);}
function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[b[i],b[j]]=[b[j],b[i]];}return b;}

export default function SpellingQuiz(){
  const[pg,setPg]=useState("home");
  const[mode,setMode]=useState(null);
  const[cat,setCat]=useState("all");
  const[qs,setQs]=useState([]);
  const[ci,setCi]=useState(0);
  const[sel,setSel]=useState(null);
  const[show,setShow]=useState(false);
  const[score,setScore]=useState(0);
  const[ans,setAns]=useState([]);
  const[tl,setTl]=useState(0);
  const[ta,setTa]=useState(false);
  const[streak,setStreak]=useState(0);
  const[bestS,setBestS]=useState(0);
  const[eover,setEover]=useState(false);
  const[stats,setStats]=useState({p:0,c:0,q:0,b:0});
  const tmr=useRef(null);
  const cvs=useRef(null);

  useEffect(()=>{
    if(ta&&tl>0&&!show){tmr.current=setTimeout(()=>setTl(t=>t-1),1000);return()=>clearTimeout(tmr.current);}
    if(ta&&tl===0&&!show){
      setShow(true);setTa(false);
      setAns(p=>[...p,{qi:ci,sel:-1,ok:false}]);
      if(mode==="endless")setEover(true);else setStreak(0);
    }
  },[ta,tl,show,ci,mode]);

  const start=(m,c)=>{
    setMode(m);setCat(c);let pool=c==="all"?QS:QS.filter(q=>q.cat===c);pool=shuffle(pool);
    if(pool.length===0){pool=shuffle([...QS]);}
    const cnt=Math.min(m==="basic"?20:m==="challenge"?30:pool.length, pool.length);
    setQs(pool.slice(0,cnt));setCi(0);setScore(0);setAns([]);setSel(null);setShow(false);
    setStreak(0);setBestS(0);setEover(false);setTl(m==="challenge"?10:m==="basic"?15:0);setTa(m!=="endless");setPg("quiz");
  };

  const pick=(idx)=>{
    if(show)return;setSel(idx);setShow(true);setTa(false);clearTimeout(tmr.current);
    const ok=idx===qs[ci].ans;
    if(ok){setScore(s=>s+1);setStreak(s=>{const n=s+1;if(n>bestS)setBestS(n);return n;});}
    else{if(mode==="endless")setEover(true);setStreak(0);}
    setAns(p=>[...p,{qi:ci,sel:idx,ok}]);
  };

  const next=()=>{
    if((mode==="endless"&&eover)||ci+1>=qs.length){finish();return;}
    setCi(q=>q+1);setSel(null);setShow(false);setTl(mode==="challenge"?10:mode==="basic"?15:0);setTa(mode!=="endless");
  };

  const finish=()=>{
    const tot=mode==="endless"?ans.length:qs.length;
    const pct=tot>0?Math.round(score/tot*100):0;
    setStats(p=>({p:p.p+1,c:p.c+score,q:p.q+tot,b:Math.max(p.b,pct)}));setPg("result");
  };

  const tot=mode==="endless"?ans.length:qs.length;
  const pct=tot>0?Math.round(score/tot*100):0;
  const grade=gg(pct);
  const wrongs=ans.filter(a=>!a.ok);

  const saveImg=useCallback(()=>{
    const c=cvs.current;if(!c)return;const x=c.getContext("2d");
    c.width=600;c.height=340;
    const g=x.createRadialGradient(300,150,0,300,170,350);
    g.addColorStop(0,"#1a1008");g.addColorStop(1,"#08060a");x.fillStyle=g;x.fillRect(0,0,600,340);
    x.textAlign="center";x.fillStyle="#555";x.font="12px sans-serif";x.fillText("맞춤법 왕 테스트",300,30);
    x.fillStyle=grade.color;x.font="bold 44px sans-serif";x.fillText(`${grade.emoji} ${grade.label}`,300,100);
    x.fillStyle="#fff";x.font="bold 68px sans-serif";x.fillText(`${pct}점`,300,185);
    x.fillStyle="#888";x.font="15px sans-serif";x.fillText(`${score}/${tot} 정답`,300,220);
    x.fillStyle="#444";x.font="11px sans-serif";x.fillText("나도 도전 →",300,310);
    const l=document.createElement("a");l.download=`맞춤법왕_${pct}.png`;l.href=c.toDataURL();l.click();
  },[pct,score,tot,grade]);

  return(
    <div className="min-h-screen text-white overflow-x-hidden" style={{background:"radial-gradient(ellipse at 50% 0%, #1a1008 0%, #0c0908 40%, #06050a 100%)",fontFamily:"'Pretendard Variable','Pretendard',-apple-system,sans-serif"}}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        @keyframes si{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pop{0%{transform:scale(.82);opacity:0}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
        @keyframes correctPulse{0%{box-shadow:0 0 0 0 rgba(45,212,191,.3)}100%{box-shadow:0 0 0 14px rgba(45,212,191,0)}}
        @keyframes orbF{0%,100%{transform:translate(0,0)}33%{transform:translate(14px,-20px)}66%{transform:translate(-10px,14px)}}
        .si{animation:si .45s cubic-bezier(.16,1,.3,1) forwards}
        .pop{animation:pop .5s ease-out forwards}
        .sk{animation:shake .4s ease-out}
        .cp{animation:correctPulse .6s ease-out}
        .of{animation:orbF 14s ease-in-out infinite}
        .gl{background:rgba(255,255,255,.03);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.06)}
        .gl2{background:rgba(255,255,255,.06);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border:1px solid rgba(255,255,255,.08)}
        ::-webkit-scrollbar{display:none}input:focus{outline:none}
      `}</style>
      <canvas ref={cvs} className="hidden"/>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full of" style={{background:"radial-gradient(circle,rgba(251,191,36,.05),transparent 70%)",top:"-18%",right:"-18%"}}/>
        <div className="absolute w-[350px] h-[350px] rounded-full of" style={{background:"radial-gradient(circle,rgba(245,158,11,.04),transparent 70%)",bottom:"8%",left:"-12%",animationDelay:"-5s"}}/>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30" style={{background:"rgba(12,9,8,.88)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          {pg!=="home"?<button onClick={()=>setPg("home")} className="text-[13px] hover:text-white transition-colors" style={{color:"rgba(255,255,255,.3)"}}>← 홈</button>
          :<div className="flex items-center gap-2"><span className="text-xl">✍️</span>
            <span className="text-[17px] font-black" style={{background:"linear-gradient(135deg, #fbbf24, #f59e0b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>맞춤법 왕</span></div>}
          {pg==="quiz"&&<div className="flex items-center gap-3 text-[13px]">
            <span className="font-black tabular-nums" style={{color:"#2dd4bf"}}>{score}<span style={{color:"rgba(255,255,255,.15)"}}> / {ci+(show?1:0)}</span></span>
            {mode!=="endless"&&tl>0&&<span className={`font-mono font-bold tabular-nums ${tl<=3?"sk":""}`} style={{color:tl<=3?"#f87171":"rgba(255,255,255,.3)"}}>{tl}s</span>}
            {streak>=3&&<span className="text-[11px]" style={{color:"#fbbf24"}}>🔥{streak}</span>}
          </div>}
        </div>
      </header>

      {/* Ad top */}
      <div className="w-full flex justify-center my-3 relative z-10"><div className="w-full max-w-[728px] h-[60px] rounded-2xl flex items-center justify-center" style={{border:"1px dashed rgba(255,255,255,.03)",color:"rgba(255,255,255,.05)",fontSize:9,letterSpacing:"0.15em"}}>AD</div></div>

      <main className="max-w-lg mx-auto px-5 pb-28 relative z-10">
        {/* ===== HOME ===== */}
        {pg==="home"&&<div className="si">
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✍️</div>
            <h2 className="text-[24px] font-black tracking-tight">맞춤법 왕</h2>
            <p className="text-[12px] mt-2" style={{color:"rgba(255,255,255,.2)"}}>당신의 맞춤법 실력은 상위 몇 %?</p>
          </div>

          {/* Stats */}
          {stats.p>0&&<div className="grid grid-cols-3 gap-2 mb-6">
            {[["플레이",stats.p,"#fbbf24"],["정답률",`${stats.q>0?Math.round(stats.c/stats.q*100):0}%`,"#2dd4bf"],["최고점",`${stats.b}`,"#f59e0b"]].map(([l,v,c])=>
              <div key={l} className="text-center p-3 rounded-2xl gl">
                <div className="text-[9px] uppercase tracking-[0.15em]" style={{color:"rgba(255,255,255,.15)"}}>{l}</div>
                <div className="text-xl font-black mt-1 tabular-nums" style={{color:c}}>{v}</div>
              </div>
            )}
          </div>}

          {/* Modes */}
          <div className="space-y-2.5 mb-6">
            {[
              {m:"basic",name:"기본 모드",emoji:"📝",desc:"20문제 · 15초",grad:"from-amber-500 to-yellow-600"},
              {m:"challenge",name:"도전 모드",emoji:"⚡",desc:"30문제 · 10초 · 어려움",grad:"from-rose-500 to-red-600"},
              {m:"endless",name:"무한 모드",emoji:"♾️",desc:"틀릴 때까지 · 시간 없음",grad:"from-violet-500 to-purple-600"},
            ].map(({m,name,emoji,desc,grad},i)=>(
              <button key={m} onClick={()=>start(m,cat)}
                className="w-full text-left p-5 rounded-2xl gl hover:bg-white/[0.04] active:scale-[0.98] transition-all si"
                style={{animationDelay:`${i*80}ms`,animationFillMode:"backwards"}}>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-xl shadow-lg`}>{emoji}</div>
                  <div>
                    <div className="text-[14px] font-bold">{name}</div>
                    <div className="text-[11px] mt-0.5" style={{color:"rgba(255,255,255,.2)"}}>{desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Category */}
          <div>
            <h3 className="text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{color:"rgba(255,255,255,.12)"}}>Category</h3>
            <div className="flex gap-1.5 flex-wrap">
              {CATS.map(c=>(
                <button key={c.id} onClick={()=>setCat(c.id)}
                  className="px-3 py-2 rounded-xl text-[10px] font-semibold transition-all"
                  style={cat===c.id?{background:`${c.color}12`,color:c.color,border:`1px solid ${c.color}22`}:{color:"rgba(255,255,255,.2)",border:"1px solid transparent"}}>
                  {c.emoji} {c.name} <span style={{opacity:.4}}>({c.id==="all"?QS.length:QS.filter(q=>q.cat===c.id).length})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 space-y-2" style={{color:"rgba(255,255,255,.1)",fontSize:10.5,lineHeight:1.9}}>
            <h2 style={{color:"rgba(255,255,255,.15)",fontSize:11,fontWeight:700}}>맞춤법 왕 테스트</h2>
            <p>맞춤법, 띄어쓰기, 외래어, 어휘력을 테스트합니다. 오답 해설로 올바른 표기법을 학습하세요.</p>
          </div>
        </div>}

        {/* ===== QUIZ ===== */}
        {pg==="quiz"&&qs.length>0&&ci<qs.length&&!eover&&<div className="py-4 si" key={ci}>
          {/* Progress */}
          {mode!=="endless"&&<div className="mb-4">
            <div className="flex justify-between text-[11px] mb-1.5" style={{color:"rgba(255,255,255,.15)"}}>
              <span>Q{ci+1} / {qs.length}</span><span>{Math.round(((ci+1)/qs.length)*100)}%</span>
            </div>
            <div className="h-[4px] rounded-full overflow-hidden" style={{background:"rgba(255,255,255,.04)"}}>
              <div className="h-full rounded-full transition-all duration-500" style={{width:`${((ci+1)/qs.length)*100}%`,background:"linear-gradient(90deg, #fbbf2488, #fbbf24)"}}/>
            </div>
          </div>}

          {/* Timer bar */}
          {mode!=="endless"&&<div className="h-[3px] rounded-full overflow-hidden mb-5" style={{background:"rgba(255,255,255,.03)"}}>
            <div className={`h-full rounded-full transition-all duration-1000`} style={{width:`${tl/(mode==="challenge"?10:15)*100}%`,background:tl<=3?"#f87171":"#2dd4bf"}}/>
          </div>}

          {/* Streak */}
          {streak>=3&&<div className="flex justify-center mb-3">
            <span className="text-[11px] px-3 py-1 rounded-full" style={{background:"rgba(251,191,36,.08)",border:"1px solid rgba(251,191,36,.15)",color:"#fbbf24"}}>🔥 {streak}연속 정답!</span>
          </div>}

          {/* Category badge */}
          <div className="flex justify-center mb-3">{(()=>{const c=CATS.find(x=>x.id===qs[ci].cat);return (<span className="text-[9px] px-2 py-0.5 rounded-full" style={{background:`${c.color}10`,color:`${c.color}80`}}>{c.emoji} {c.name}</span>);})()}</div>

          {/* Question */}
          <div className="text-center mb-8 px-2">
            <h3 className="text-[18px] font-bold leading-relaxed">{qs[ci].q}</h3>
          </div>

          {/* Interstitial ad */}
          {show&&(ci+1)%10===0&&ci+1<qs.length&&<div className="w-full flex justify-center mb-4"><div className="w-full h-[70px] rounded-2xl flex items-center justify-center" style={{border:"1px dashed rgba(255,255,255,.03)",color:"rgba(255,255,255,.04)",fontSize:9}}>AD</div></div>}

          {/* Options */}
          <div className="space-y-2.5">
            {qs[ci].opts.map((opt,i)=>{
              const isC=i===qs[ci].ans,isS=sel===i;
              let border="rgba(255,255,255,.06)",bg="rgba(255,255,255,.02)",tc="rgba(255,255,255,.55)";
              if(show){
                if(isC){border="rgba(45,212,191,.4)";bg="rgba(45,212,191,.08)";tc="#2dd4bf";}
                else if(isS&&!isC){border="rgba(248,113,113,.4)";bg="rgba(248,113,113,.08)";tc="#f87171";}
                else{tc="rgba(255,255,255,.15)";}
              }
              return(
                <button key={i} onClick={()=>pick(i)} disabled={show}
                  className={`w-full text-left rounded-2xl transition-all ${show?"":"hover:bg-white/[0.04] active:scale-[0.98]"} ${isC&&show?"cp":""} ${isS&&!isC&&show?"sk":""}`}
                  style={{background:bg,border:`1px solid ${border}`,padding:"18px 20px"}}>
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                      style={{border:`1px solid ${show&&isC?"rgba(45,212,191,.5)":show&&isS&&!isC?"rgba(248,113,113,.5)":"rgba(255,255,255,.08)"}`,color:show&&isC?"#2dd4bf":show&&isS&&!isC?"#f87171":"rgba(255,255,255,.2)"}}>
                      {show&&isC?"✓":show&&isS&&!isC?"✗":["①","②","③","④"][i]}
                    </span>
                    <span className="text-[13px] font-medium" style={{color:tc}}>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {show&&<div className="mt-5 gl2 rounded-2xl p-5 si">
            <div className="flex items-start gap-2.5">
              <span className="text-[13px] mt-0.5">💡</span>
              <p className="text-[12px] leading-relaxed" style={{color:"rgba(255,255,255,.4)"}}>{qs[ci].exp}</p>
            </div>
            <button onClick={next}
              className="w-full mt-4 rounded-2xl font-bold text-[14px] bg-gradient-to-r from-amber-400 to-yellow-500 text-black active:scale-[0.97] transition-all"
              style={{padding:"16px 0",boxShadow:"0 8px 25px -6px rgba(251,191,36,.25)"}}>
              {ci+1>=qs.length||eover?"결과 보기 →":"다음 문제 →"}
            </button>
          </div>}
        </div>}

        {/* Endless game over */}
        {pg==="quiz"&&eover&&show&&<div className="py-4 si">
          <div className="gl2 rounded-2xl p-5 mb-4"><div className="flex items-start gap-2.5"><span className="text-[13px] mt-0.5">💡</span><p className="text-[12px] leading-relaxed" style={{color:"rgba(255,255,255,.4)"}}>{qs[ci].exp}</p></div></div>
          <div className="text-center mb-4"><div className="text-4xl mb-2">💥</div><div className="text-lg font-bold" style={{color:"#f87171"}}>게임 오버!</div><div className="text-[13px] mt-1" style={{color:"rgba(255,255,255,.25)"}}>{score}문제 연속 정답</div></div>
          <button onClick={finish} className="w-full rounded-2xl font-bold text-[14px] bg-gradient-to-r from-amber-400 to-yellow-500 text-black active:scale-[0.97]" style={{padding:"16px 0",boxShadow:"0 8px 25px -6px rgba(251,191,36,.25)"}}>결과 보기 →</button>
        </div>}

        {/* ===== RESULT ===== */}
        {pg==="result"&&grade&&<div className="py-6 si">
          {/* Grade */}
          <div className="text-center pop">
            <div className="text-6xl mb-3">{grade.emoji}</div>
            <div className="text-[28px] font-black" style={{color:grade.color}}>{grade.label}</div>
          </div>

          {/* Score ring */}
          <div className="flex justify-center my-6">
            <div className="relative">
              <svg width="150" height="150" style={{filter:`drop-shadow(0 0 20px ${grade.glow})`}}>
                <circle cx="75" cy="75" r="60" fill="none" stroke="rgba(255,255,255,.03)" strokeWidth="5"/>
                <circle cx="75" cy="75" r="60" fill="none" stroke={grade.color} strokeWidth="5"
                  strokeDasharray={2*Math.PI*60} strokeDashoffset={2*Math.PI*60*(1-pct/100)}
                  strokeLinecap="round" transform="rotate(-90 75 75)" className="transition-all duration-[2s]"/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[40px] font-black tabular-nums" style={{color:grade.color}}>{pct}</span>
                <span className="text-[10px] -mt-1" style={{color:"rgba(255,255,255,.15)"}}>점</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[["정답",`${score}/${tot}`,"#2dd4bf"],["정답률",`${pct}%`,grade.color],[mode==="endless"?"연속":"최고연속",`${bestS}`,"#fbbf24"]].map(([l,v,c])=>
              <div key={l} className="text-center p-3 rounded-2xl gl">
                <div className="text-[9px] uppercase tracking-[0.15em]" style={{color:"rgba(255,255,255,.12)"}}>{l}</div>
                <div className="text-xl font-black tabular-nums mt-1" style={{color:c}}>{v}</div>
              </div>
            )}
          </div>

          {/* Category breakdown */}
          <div className="gl rounded-2xl p-5 mb-5">
            <h3 className="text-[9px] uppercase tracking-[0.2em] mb-4" style={{color:"rgba(255,255,255,.12)"}}>Category Score</h3>
            {CATS.filter(c=>c.id!=="all").map(ct=>{
              const ca=ans.filter((a,i)=>qs[i]?.cat===ct.id);const cc=ca.filter(a=>a.ok).length;const ctot=ca.length;const cp=ctot>0?Math.round(cc/ctot*100):0;
              if(ctot===0)return null;
              return(<div key={ct.id} className="mb-3 last:mb-0">
                <div className="flex justify-between mb-1.5"><span className="text-[11px]" style={{color:"rgba(255,255,255,.25)"}}>{ct.emoji} {ct.name}</span><span className="text-[11px] font-bold tabular-nums" style={{color:ct.color}}>{cc}/{ctot}</span></div>
                <div className="h-[5px] rounded-full overflow-hidden" style={{background:"rgba(255,255,255,.03)"}}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{width:`${cp}%`,background:`linear-gradient(90deg, ${ct.color}66, ${ct.color})`}}/>
                </div>
              </div>);
            })}
          </div>

          {/* Ad */}
          <div className="w-full flex justify-center my-5"><div className="rounded-2xl flex items-center justify-center" style={{width:300,height:250,border:"1px dashed rgba(255,255,255,.03)",color:"rgba(255,255,255,.05)",fontSize:9}}>AD 300×250</div></div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {[["🏠 홈",()=>setPg("home")],["📸 저장",saveImg],["🔗 공유",()=>{const t=`맞춤법 왕: ${pct}점 (${grade.label})`;if(navigator.share)navigator.share({title:"맞춤법 왕",text:t,url:location.href});else{navigator.clipboard.writeText(t);alert("복사됨!");}}]].map(([l,fn],i)=>
              <button key={i} onClick={fn} className={`py-3.5 rounded-2xl text-[11px] font-semibold tracking-[0.05em] transition-all active:scale-95 ${i===1?"bg-gradient-to-r from-amber-400 to-yellow-500 text-black":"gl hover:bg-white/[0.05]"}`}
                style={i!==1?{color:"rgba(255,255,255,.35)"}:{boxShadow:"0 8px 20px -5px rgba(251,191,36,.2)"}}>{l}</button>
            )}
          </div>

          {/* Wrong answers */}
          {wrongs.length>0&&<div className="gl rounded-2xl p-5 mb-5">
            <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{color:"rgba(255,255,255,.12)"}}>오답 노트 ({wrongs.length})</h3>
            {wrongs.slice(0,5).map((a,i)=>{const q=qs[a.qi];return(
              <div key={i} className="p-3.5 rounded-xl mb-2 last:mb-0" style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.03)"}}>
                <div className="text-[12px] font-medium mb-1.5" style={{color:"rgba(255,255,255,.5)"}}>{q.q}</div>
                <div className="text-[10px] mb-0.5" style={{color:"rgba(248,113,113,.6)"}}>내 답: {a.sel>=0?q.opts[a.sel]:"시간 초과"}</div>
                <div className="text-[10px] mb-2" style={{color:"rgba(45,212,191,.6)"}}>정답: {q.opts[q.ans]}</div>
                <div className="flex items-start gap-2 p-2.5 rounded-lg" style={{background:"rgba(255,255,255,.02)"}}>
                  <span className="text-[10px]">💡</span><p className="text-[10px] leading-relaxed" style={{color:"rgba(255,255,255,.25)"}}>{q.exp}</p>
                </div>
              </div>
            );})}
            {wrongs.length>5&&<p className="text-center text-[10px] mt-2" style={{color:"rgba(255,255,255,.12)"}}>+{wrongs.length-5}개 더</p>}
          </div>}

          {/* Retry */}
          <button onClick={()=>start(mode,cat)}
            className="w-full py-3.5 rounded-2xl text-[13px] font-bold transition-all active:scale-[0.98]"
            style={{border:"1px solid rgba(251,191,36,.2)",color:"#fbbf24",background:"rgba(251,191,36,.05)"}}>
            🔄 같은 모드 다시 도전
          </button>
        </div>}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-20" style={{background:"linear-gradient(to top, rgba(6,5,10,.97), rgba(6,5,10,.5), transparent)"}}>
        <div className="text-center py-2.5"><div className="inline-block rounded-xl px-8 py-1.5" style={{border:"1px dashed rgba(255,255,255,.03)",color:"rgba(255,255,255,.05)",fontSize:8,letterSpacing:"0.2em"}}>ANCHOR AD</div></div>
      </footer>
    </div>
  );
}
