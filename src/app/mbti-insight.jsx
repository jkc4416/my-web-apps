import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/*
  ╔══════════════════════════════════════════════════════════════╗
  ║  MBTI 인사이트 — Redesigned                                   ║
  ║  Design: Aurora Immersion + Fullscreen Quiz Flow             ║
  ║  Palette: Each MBTI group has its own aurora gradient        ║
  ╚══════════════════════════════════════════════════════════════╝
*/

// ===== MBTI DATA =====
const TYPES={
  INTJ:{name:"전략가",emoji:"🧠",color:"#818cf8",trait:"독립적이고 전략적인 사고가",desc:"혼자만의 세계에서 완벽한 계획을 세우는 마스터마인드. 감정보다 논리를 우선하며, 비효율을 참지 못합니다."},
  INTP:{name:"논리술사",emoji:"🔬",color:"#6366f1",trait:"끝없이 분석하는 사색가",desc:"세상 모든 것에 '왜?'를 던지는 호기심 덩어리. 머릿속에 항상 여러 이론이 돌아갑니다."},
  ENTJ:{name:"통솔자",emoji:"👑",color:"#ef4444",trait:"타고난 리더이자 결단력의 아이콘",desc:"목표를 세우면 반드시 달성하는 추진력. 팀을 이끄는 데 천부적 재능을 가졌습니다."},
  ENTP:{name:"변론가",emoji:"⚡",color:"#f59e0b",trait:"아이디어 폭풍의 혁신가",desc:"토론을 즐기고 기존 질서에 도전합니다. 새로운 가능성을 발견하는 데 탁월합니다."},
  INFJ:{name:"옹호자",emoji:"🌙",color:"#0ea5e9",trait:"깊은 통찰력의 이상주의자",desc:"조용하지만 강한 신념을 품고 있습니다. 타인의 감정을 깊이 이해합니다."},
  INFP:{name:"중재자",emoji:"🦋",color:"#a855f7",trait:"감성적 몽상가",desc:"내면의 가치관이 확고하며, 창의적 표현에 뛰어납니다. 진정성을 가장 중요하게 여깁니다."},
  ENFJ:{name:"선도자",emoji:"🌟",color:"#10b981",trait:"카리스마 넘치는 공감의 달인",desc:"주변 사람들의 성장을 돕는 데 진심인 리더. 영향력이 큽니다."},
  ENFP:{name:"활동가",emoji:"🎭",color:"#f43f5e",trait:"에너지 넘치는 자유로운 영혼",desc:"열정적이고 창의적이며, 어디서든 분위기 메이커입니다."},
  ISTJ:{name:"현실주의자",emoji:"📊",color:"#475569",trait:"신뢰의 상징, 책임감 덩어리",desc:"규칙과 체계를 중시하며, 맡은 일은 끝까지 해냅니다."},
  ISFJ:{name:"수호자",emoji:"🛡️",color:"#0891b2",trait:"헌신적이고 따뜻한 배려왕",desc:"주변을 조용히 돌보는 수호천사. 세심한 관찰력이 있습니다."},
  ESTJ:{name:"경영자",emoji:"📋",color:"#b91c1c",trait:"체계적 추진력의 관리자",desc:"질서와 효율을 최우선으로 여기며 결정이 빠르고 명확합니다."},
  ESFJ:{name:"집정관",emoji:"🤗",color:"#16a34a",trait:"사교적이고 조화로운 사람",desc:"모임의 중심에서 모두를 챙기는 따뜻한 성격입니다."},
  ISTP:{name:"장인",emoji:"🔧",color:"#64748b",trait:"냉철한 해결사",desc:"논리적이면서 직접 해보는 것을 좋아합니다. 위기 상황에서 빛납니다."},
  ISFP:{name:"모험가",emoji:"🎨",color:"#ec4899",trait:"감성적 자유인",desc:"현재 순간을 즐기며 자신만의 미적 감각으로 세상을 바라봅니다."},
  ESTP:{name:"사업가",emoji:"🎯",color:"#ea580c",trait:"대담한 행동파",desc:"말보다 행동이 앞서며 위험을 감수하고 기회를 잡습니다."},
  ESFP:{name:"연예인",emoji:"🎪",color:"#d946ef",trait:"에너지 넘치는 엔터테이너",desc:"어디서든 주목받으며 주변을 즐겁게 만드는 재주가 있습니다."},
};

const COMPAT={
  INTJ:{best:["ENFP","ENTP"],good:["INFJ","INFP","ENTJ"],hard:["ESFP","ESFJ"]},
  INTP:{best:["ENTJ","ENFJ"],good:["INTJ","ENTP","INFJ"],hard:["ESFJ","ISFJ"]},
  ENTJ:{best:["INTP","INFP"],good:["INTJ","ENTP","ENFP"],hard:["ISFP","ISFJ"]},
  ENTP:{best:["INFJ","INTJ"],good:["ENFP","INTP","ENFJ"],hard:["ISFJ","ISTJ"]},
  INFJ:{best:["ENTP","ENFP"],good:["INFP","INTJ","INTP"],hard:["ESTP","ESFP"]},
  INFP:{best:["ENTJ","ENFJ"],good:["INFJ","ENFP","INTP"],hard:["ESTJ","ESTP"]},
  ENFJ:{best:["INFP","INTP"],good:["ENFP","INFJ","ISFP"],hard:["ISTP","ESTP"]},
  ENFP:{best:["INTJ","INFJ"],good:["ENFJ","ENTP","INTP"],hard:["ISTJ","ESTJ"]},
  ISTJ:{best:["ESFP","ESTP"],good:["ISFJ","ESTJ"],hard:["ENFP","ENTP"]},
  ISFJ:{best:["ESTP","ESFP"],good:["ISTJ","ESFJ"],hard:["ENTP","INTP"]},
  ESTJ:{best:["ISFP","ISTP"],good:["ISTJ","ESFJ","ENTJ"],hard:["INFP","ENFP"]},
  ESFJ:{best:["ISTP","ISFP"],good:["ISFJ","ENFJ"],hard:["INTP","INTJ"]},
  ISTP:{best:["ESFJ","ESTJ"],good:["ISTJ","ESTP"],hard:["ENFJ","INFJ"]},
  ISFP:{best:["ESTJ","ENTJ"],good:["ISFJ","ESFP","ENFJ"],hard:["INTJ"]},
  ESTP:{best:["ISFJ","ISTJ"],good:["ESFP","ISTP"],hard:["INFJ","INFP"]},
  ESFP:{best:["ISTJ","ISFJ"],good:["ESTP","ESFJ","ENFP"],hard:["INTJ","INFJ"]},
};

// ===== TESTS =====
const TESTS=[
  {id:"love",name:"연애 스타일",emoji:"💑",color:"#f43f5e",grad:"from-rose-600 via-pink-600 to-fuchsia-600",
    qs:[
      {q:"좋아하는 사람이 생기면?",a:[["먼저 고백한다","E",2],["상대가 다가오길 기다린다","I",2]]},
      {q:"데이트 코스를 정할 때?",a:[["즉흥적으로!","P",2],["미리 계획","J",2]]},
      {q:"연인이 고민을 이야기하면?",a:[["해결책을 제시","T",2],["먼저 공감하고 위로","F",2]]},
      {q:"이상형에서 더 중요한 것은?",a:[["지적 대화가 통하는 사람","N",2],["현실적이고 안정적인 사람","S",2]]},
      {q:"연인과 갈등이 생기면?",a:[["논리적으로 해결","T",2],["감정을 먼저 풀기","F",2]]},
      {q:"서프라이즈를 받으면?",a:[["기쁘지만 미리 알려줬으면","J",1],["이런 게 좋아!","P",1]]},
      {q:"연인과의 주말은?",a:[["활동적 바깥 데이트","E",1],["집에서 영화 보기","I",1]]},
      {q:"고백 스타일은?",a:[["감성적 편지나 분위기","F",1],["솔직하고 직접적","T",1]]},
      {q:"장거리 연애는?",a:[["현실적으로 힘들다","S",1],["마음이면 거리는 OK","N",1]]},
      {q:"싸운 후 화해 방식은?",a:[["혼자 정리 시간","I",1],["바로 대화로 풀기","E",1]]},
      {q:"기념일에 대해?",a:[["꼭 챙겨야 해","J",1],["매일이 기념일~","P",1]]},
      {q:"가장 듣고 싶은 말?",a:[["넌 정말 특별해","N",1],["네 옆에 있으면 편해","S",1]]},
    ]},
  {id:"work",name:"직장 생존법",emoji:"💼",color:"#3b82f6",grad:"from-blue-600 via-indigo-600 to-violet-600",
    qs:[
      {q:"회의에서 당신은?",a:[["적극적으로 의견","E",2],["경청 후 핵심만","I",2]]},
      {q:"업무 스타일은?",a:[["체계적 계획 후 실행","J",2],["유연하게 상황 맞춤","P",2]]},
      {q:"동료와 의견 다를 때?",a:[["논리적 근거로 설득","T",2],["분위기 보며 조율","F",2]]},
      {q:"새 프로젝트를 맡으면?",a:[["큰 그림부터","N",2],["구체적 실행부터","S",2]]},
      {q:"점심시간에?",a:[["동료와 함께","E",1],["혼자 시간","I",1]]},
      {q:"마감이 다가올 때?",a:[["이미 끝내놓은 상태","J",2],["마감 직전 폭발","P",2]]},
      {q:"상사의 비합리적 지시에?",a:[["왜 그런지 질문","T",1],["일단 따르고 나중에","F",1]]},
      {q:"팀 리더 역할이면?",a:[["방향 제시+위임","N",1],["실무에 같이 투입","S",1]]},
      {q:"퇴근 후 회사 연락?",a:[["바로 확인 답변","J",1],["내일 출근해서","P",1]]},
      {q:"이직 고민할 때?",a:[["성장 가능성과 비전","N",1],["연봉과 복지 먼저","S",1]]},
    ]},
  {id:"food",name:"음식 성향",emoji:"🍽️",color:"#f59e0b",grad:"from-amber-500 via-orange-500 to-red-500",
    qs:[
      {q:"메뉴 고를 때?",a:[["새로운 도전!","N",2],["검증된 단골 메뉴","S",2]]},
      {q:"맛집 찾는 방법?",a:[["리뷰 꼼꼼히 검색","J",2],["느낌 오는 곳","P",2]]},
      {q:"같이 먹는 사람이 못 고르면?",a:[["내가 정해줄게!","E",1],["먹고 싶은 거 먹자","F",1]]},
      {q:"음식이 기대 이하면?",a:[["솔직하게 리뷰","T",2],["분위기가 좋았으니까","F",2]]},
      {q:"뷔페에 가면?",a:[["계획적으로 한 바퀴","J",1],["눈에 보이는 대로","P",1]]},
      {q:"요리할 때?",a:[["레시피대로 정확히","S",1],["감으로 이것저것","N",1]]},
      {q:"혼밥에 대해?",a:[["편하고 좋다","I",2],["누군가와 함께가 좋다","E",2]]},
      {q:"디저트는?",a:[["꼭 먹어야 한다","F",1],["배부르면 패스","T",1]]},
    ]},
  {id:"soul",name:"소울메이트",emoji:"✨",color:"#a855f7",grad:"from-violet-600 via-purple-600 to-fuchsia-600",
    qs:[
      {q:"친구와 시간 보낼 때 가장 좋은 것?",a:[["깊은 대화","I",2],["새로운 활동 함께","E",2]]},
      {q:"친구 고민 상담할 때?",a:[["객관적 조언","T",2],["무조건 편","F",2]]},
      {q:"여행 갈 때 이런 친구가 좋다",a:[["계획 꼼꼼히","J",2],["유연하게 같이","P",2]]},
      {q:"대화할 때 끌리는 사람?",a:[["상상력 풍부","N",2],["현실적 실용적","S",2]]},
      {q:"힘들 때 필요한 사람?",a:[["조용히 옆에","I",1],["에너지 불어넣기","E",1]]},
      {q:"약속 잡을 때?",a:[["미리 확정!","J",1],["그날 분위기 보고","P",1]]},
      {q:"선물 고를 때?",a:[["실용적","S",1],["의미 있는","N",1]]},
      {q:"갈등 생겼을 때?",a:[["솔직하게 말해주는","T",1],["감정 헤아려주는","F",1]]},
      {q:"함께 성장하는 관계란?",a:[["서로 다름 존중","N",1],["가치관 비슷","S",1]]},
      {q:"우정의 가장 중요한 조건?",a:[["신뢰와 일관성","J",1],["자유롭고 편안함","P",1]]},
    ]},
];

function calcMBTI(sc){
  const dims=[[sc.E||0,sc.I||0,"E","I"],[sc.S||0,sc.N||0,"S","N"],[sc.T||0,sc.F||0,"T","F"],[sc.J||0,sc.P||0,"J","P"]];
  let r="";const pct={};
  dims.forEach(([a,b,la,lb])=>{const t=a+b||1;const pa=Math.round(a/t*100);if(a>=b){r+=la;pct[la]=pa;pct[lb]=100-pa;}else{r+=lb;pct[lb]=Math.round(b/t*100);pct[la]=100-pct[lb];}});
  return{type:r,pct};
}

function getTypeDetails(type,testId){
  const t=TYPES[type];
  const map={
    love:{INTJ:["연애도 전략적 접근","지적 수준이 중요","표현 서툴지만 깊은 애정","쓸데없는 드라마 싫어함","독립적 시간 필수"]},
    work:{},food:{},soul:{},
  };
  return map[testId]?.[type]||[`${t.trait}로 관계합니다`,`${t.name} 특유의 매력 발산`,`깊이 있는 관계 추구`,`자신만의 철학 보유`,`성장하는 관계 지향`];
}

// ===== DIMENSION BAR =====
function DimBar({left,right,lLabel,rLabel,pct,color}){
  return(<div className="mb-4">
    <div className="flex justify-between mb-1.5">
      <span className={`text-[11px] tracking-wide ${pct>=50?"font-bold":""}`} style={{color:pct>=50?color:"rgba(255,255,255,.2)"}}>{lLabel} {pct}%</span>
      <span className={`text-[11px] tracking-wide ${pct<50?"font-bold":""}`} style={{color:pct<50?color:"rgba(255,255,255,.2)"}}>{100-pct}% {rLabel}</span>
    </div>
    <div className="h-[6px] rounded-full overflow-hidden" style={{background:"rgba(255,255,255,.04)"}}>
      <div className="h-full rounded-full transition-all duration-[1.5s] ease-out" style={{width:`${pct}%`,background:`linear-gradient(90deg, ${color}88, ${color})`}}/>
    </div>
  </div>);
}

// ===== MAIN =====
export default function MBTIInsight(){
  const[pg,setPg]=useState("home");
  const[test,setTest]=useState(null);
  const[cq,setCq]=useState(0);
  const[sc,setSc]=useState({E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0});
  const[resType,setResType]=useState(null);
  const[pcts,setPcts]=useState({});
  const[particles,setParticles]=useState(false);
  const[allRes,setAllRes]=useState({});
  const cvs=useRef(null);

  const startTest=(t)=>{setTest(t);setPg("select");setResType(null);};
  const goHome=()=>{setPg("home");setTest(null);setCq(0);};

  const selectMBTI=(type)=>{
    setResType(type);
    const b=70;setPcts({[type[0]]:b,[type[0]==="E"?"I":"E"]:30,[type[1]]:b,[type[1]==="S"?"N":"S"]:30,[type[2]]:b,[type[2]==="T"?"F":"T"]:30,[type[3]]:b,[type[3]==="J"?"P":"P"]:30});
    setParticles(true);setTimeout(()=>setParticles(false),2500);
    setAllRes(p=>({...p,[test.id]:type}));setPg("res");
  };

  const startQuiz=()=>{setCq(0);setSc({E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0});setPg("quiz");};

  const answer=(dim,pts)=>{
    const ns={...sc,[dim]:sc[dim]+pts};setSc(ns);
    if(cq+1>=test.qs.length){
      const{type,pct}=calcMBTI(ns);setResType(type);setPcts(pct);
      setParticles(true);setTimeout(()=>setParticles(false),2500);
      setAllRes(p=>({...p,[test.id]:type}));setPg("res");
    }else setCq(q=>q+1);
  };

  const save=useCallback(()=>{
    const c=cvs.current;if(!c||!resType)return;const x=c.getContext("2d");
    c.width=640;c.height=480;const t=TYPES[resType];
    const g=x.createRadialGradient(320,200,0,320,240,400);
    g.addColorStop(0,`${t.color}15`);g.addColorStop(1,"#04020a");
    x.fillStyle=g;x.fillRect(0,0,640,480);
    x.textAlign="center";x.fillStyle="#666";x.font="12px sans-serif";
    x.fillText(`${test.emoji} ${test.name}`,320,35);
    x.fillStyle="#fff";x.font="bold 52px sans-serif";x.fillText(resType,320,130);
    x.fillStyle=t.color;x.font="22px sans-serif";x.fillText(`${t.emoji} ${t.name}`,320,170);
    x.fillStyle="#888";x.font="14px sans-serif";x.fillText(t.trait,320,205);
    x.fillStyle="#444";x.font="11px sans-serif";x.fillText("MBTI 인사이트에서 테스트 →",320,450);
    const l=document.createElement("a");l.download=`MBTI_${resType}.png`;l.href=c.toDataURL();l.click();
  },[resType,test]);

  const ti=resType?TYPES[resType]:null;
  const compat=resType?COMPAT[resType]:null;
  const aurora=test?test.grad:"from-violet-950 via-indigo-950 to-slate-950";

  return(
    <div className="min-h-screen text-white overflow-x-hidden" style={{background:"radial-gradient(ellipse at 50% 0%, #120a24 0%, #08061a 40%, #04030c 100%)",fontFamily:"'Pretendard Variable','Pretendard',-apple-system,sans-serif"}}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        @keyframes si{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pop{0%{transform:scale(.82);opacity:0}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
        @keyframes sparkle{0%,100%{opacity:0;transform:scale(0) rotate(0)}50%{opacity:1;transform:scale(1) rotate(180deg)}}
        @keyframes orbFloat{0%,100%{transform:translate(0,0)}33%{transform:translate(18px,-25px)}66%{transform:translate(-12px,18px)}}
        @keyframes cardIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
        .si{animation:si .5s cubic-bezier(.16,1,.3,1) forwards}
        .pop{animation:pop .5s ease-out forwards}
        .ci{animation:cardIn .4s cubic-bezier(.16,1,.3,1) forwards}
        .of{animation:orbFloat 14s ease-in-out infinite}
        .gl{background:rgba(255,255,255,.03);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.06)}
        .gl2{background:rgba(255,255,255,.06);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border:1px solid rgba(255,255,255,.08)}
        ::-webkit-scrollbar{display:none}input:focus{outline:none}
      `}</style>
      <canvas ref={cvs} className="hidden"/>

      {/* Sparkles */}
      {particles&&<div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {Array.from({length:22}).map((_,i)=><span key={i} className="absolute text-lg" style={{left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,animation:`sparkle ${1+Math.random()*2}s ${Math.random()}s ease-out forwards`}}>
          {["✨","🌟","⭐","💫","🎉"][i%5]}</span>)}
      </div>}

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[550px] h-[550px] rounded-full of" style={{background:`radial-gradient(circle,${test?.color||"#8b5cf6"}08,transparent 70%)`,top:"-18%",right:"-20%"}}/>
        <div className="absolute w-[400px] h-[400px] rounded-full of" style={{background:"radial-gradient(circle,rgba(139,92,246,.05),transparent 70%)",bottom:"8%",left:"-15%",animationDelay:"-5s"}}/>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30" style={{background:"rgba(8,6,26,.85)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          {pg!=="home"?<button onClick={goHome} className="text-[13px] transition-colors hover:text-white" style={{color:"rgba(255,255,255,.3)"}}>← 홈</button>
          :<div className="flex items-center gap-2"><span className="text-xl">🧬</span>
            <span className="text-[17px] font-black" style={{background:"linear-gradient(135deg, #a78bfa, #ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>MBTI 인사이트</span></div>}
          {test&&pg!=="home"&&<span className="text-[11px] font-medium" style={{color:"rgba(255,255,255,.3)"}}>{test.emoji} {test.name}</span>}
        </div>
      </header>

      {/* Ad */}
      <div className="w-full flex justify-center my-3 relative z-10"><div className="w-full max-w-[728px] h-[65px] rounded-2xl flex items-center justify-center" style={{border:"1px dashed rgba(255,255,255,.03)",color:"rgba(255,255,255,.05)",fontSize:9,letterSpacing:"0.15em"}}>AD</div></div>

      <main className="max-w-lg mx-auto px-5 pb-28 relative z-10">
        {/* ===== HOME ===== */}
        {pg==="home"&&<div className="si">
          <div className="text-center py-8">
            <h2 className="text-[24px] font-black tracking-tight leading-tight">나의 MBTI,<br/><span style={{background:"linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>더 깊이 알아보기</span></h2>
            <p className="text-[12px] mt-2" style={{color:"rgba(255,255,255,.2)"}}>테스트를 선택하고 나만의 분석을 받아보세요</p>
          </div>

          <div className="space-y-3">
            {TESTS.map((t,i)=>{const done=allRes[t.id];return(
              <button key={t.id} onClick={()=>startTest(t)}
                className="w-full text-left p-5 rounded-2xl gl transition-all hover:bg-white/[0.04] active:scale-[0.98] si"
                style={{animationDelay:`${i*90}ms`,animationFillMode:"backwards"}}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.grad} flex items-center justify-center text-xl shadow-lg`} style={{boxShadow:`0 6px 20px -4px ${t.color}30`}}>{t.emoji}</div>
                    <div>
                      <div className="flex items-center gap-2"><span className="text-[14px] font-bold">{t.name}</span>
                        {done&&<span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{background:`${TYPES[done].color}15`,color:TYPES[done].color,border:`1px solid ${TYPES[done].color}25`}}>{done}</span>}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{color:"rgba(255,255,255,.2)"}}>{t.qs.length}문항 · 약 {Math.ceil(t.qs.length*.3)}분</div>
                    </div>
                  </div>
                  <span style={{color:"rgba(255,255,255,.1)"}}>→</span>
                </div>
              </button>
            );})}
          </div>

          {Object.keys(allRes).length>0&&<div className="mt-8 gl rounded-2xl p-5">
            <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{color:"rgba(255,255,255,.12)"}}>My Results</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(allRes).map(([tid,type])=>{const t=TESTS.find(x=>x.id===tid);const tp=TYPES[type];return(
                <div key={tid} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{background:`${tp.color}10`,border:`1px solid ${tp.color}18`}}>
                  <span className="text-[11px]">{t?.emoji}</span><span className="text-[11px] font-bold" style={{color:tp.color}}>{type}</span>
                </div>
              );})}
            </div>
          </div>}

          <div className="mt-10 space-y-2" style={{color:"rgba(255,255,255,.1)",fontSize:10.5,lineHeight:1.9}}>
            <h2 style={{color:"rgba(255,255,255,.15)",fontSize:11,fontWeight:700}}>MBTI 인사이트</h2>
            <p>MBTI 16가지 유형을 연애, 직장, 음식, 소울메이트 등 다양한 주제로 깊이 있게 분석합니다.</p>
          </div>
        </div>}

        {/* ===== SELECT ===== */}
        {pg==="select"&&test&&<div className="py-8 si">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">{test.emoji}</div>
            <h2 className="text-[22px] font-black">{test.name}</h2>
            <p className="text-[12px] mt-1" style={{color:"rgba(255,255,255,.25)"}}>{test.qs.length}문항</p>
          </div>

          <button onClick={startQuiz}
            className={`w-full rounded-2xl font-bold text-[15px] bg-gradient-to-r ${test.grad} shadow-xl active:scale-[0.97] transition-all`}
            style={{padding:"18px 0",boxShadow:`0 12px 35px -8px ${test.color}30`}}>
            🎯 질문에 답하며 진단받기
          </button>

          <div className="flex items-center my-6"><div className="flex-1 h-px" style={{background:"rgba(255,255,255,.04)"}}/><span className="mx-4 text-[11px]" style={{color:"rgba(255,255,255,.12)"}}>or</span><div className="flex-1 h-px" style={{background:"rgba(255,255,255,.04)"}}/></div>

          <p className="text-center text-[11px] mb-4" style={{color:"rgba(255,255,255,.2)"}}>내 MBTI를 알고 있다면</p>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(TYPES).map(([type,info])=>(
              <button key={type} onClick={()=>selectMBTI(type)}
                className="p-2.5 rounded-xl text-center transition-all active:scale-95 hover:bg-white/[0.04]" style={{border:"1px solid rgba(255,255,255,.04)"}}>
                <div className="text-lg">{info.emoji}</div>
                <div className="text-[10px] font-black mt-0.5" style={{color:info.color}}>{type}</div>
                <div className="text-[8px] mt-0.5" style={{color:"rgba(255,255,255,.15)"}}>{info.name}</div>
              </button>
            ))}
          </div>
        </div>}

        {/* ===== QUIZ ===== */}
        {pg==="quiz"&&test&&<div className="py-6 ci" key={cq}>
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-[11px] mb-2" style={{color:"rgba(255,255,255,.2)"}}>
              <span>Q{cq+1} / {test.qs.length}</span>
              <span>{Math.round(((cq+1)/test.qs.length)*100)}%</span>
            </div>
            <div className="h-[4px] rounded-full overflow-hidden" style={{background:"rgba(255,255,255,.04)"}}>
              <div className="h-full rounded-full transition-all duration-500" style={{width:`${((cq+1)/test.qs.length)*100}%`,background:`linear-gradient(90deg, ${test.color}88, ${test.color})`}}/>
            </div>
          </div>

          <div className="text-center mb-10">
            <div className="text-5xl mb-5">{test.emoji}</div>
            <h3 className="text-[18px] font-bold leading-relaxed px-2">{test.qs[cq].q}</h3>
          </div>

          {/* Interstitial ad every 5 questions */}
          {cq>0&&cq%5===0&&<div className="w-full flex justify-center mb-6"><div className="w-full h-[80px] rounded-2xl flex items-center justify-center" style={{border:"1px dashed rgba(255,255,255,.03)",color:"rgba(255,255,255,.05)",fontSize:9}}>AD</div></div>}

          <div className="space-y-3">
            {test.qs[cq].a.map(([text,dim,pts],i)=>(
              <button key={i} onClick={()=>answer(dim,pts)}
                className="w-full text-left p-5 rounded-2xl gl transition-all hover:bg-white/[0.05] active:scale-[0.97]">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold" style={{border:"1px solid rgba(255,255,255,.08)",color:"rgba(255,255,255,.3)"}}>{["A","B"][i]}</span>
                  <span className="text-[13px] font-medium" style={{color:"rgba(255,255,255,.65)"}}>{text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>}

        {/* ===== RESULT ===== */}
        {pg==="res"&&resType&&ti&&<div className="py-6 si">
          {/* Badge */}
          <div className="flex justify-center mb-3">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.1em] bg-gradient-to-r ${test.grad}`} style={{boxShadow:`0 4px 15px -3px ${test.color}25`}}>
              {test.emoji} {test.name}
            </span>
          </div>

          {/* Type Hero */}
          <div className="text-center pop">
            <div className="text-6xl mb-3">{ti.emoji}</div>
            <h2 className="text-[42px] font-black tracking-wider leading-none" style={{color:ti.color}}>{resType}</h2>
            <div className="text-[17px] font-bold mt-1" style={{color:"rgba(255,255,255,.7)"}}>{ti.name}</div>
            <p className="text-[12px] mt-2 italic" style={{color:"rgba(255,255,255,.2)"}}>&ldquo;{ti.trait}&rdquo;</p>
          </div>

          {/* Dimensions */}
          <div className="gl2 rounded-2xl p-5 mt-6 mb-5">
            <h3 className="text-[9px] uppercase tracking-[0.2em] mb-4" style={{color:"rgba(255,255,255,.12)"}}>Dimensions</h3>
            <DimBar lLabel="외향 E" rLabel="내향 I" pct={pcts.E||50} color="#f43f5e"/>
            <DimBar lLabel="감각 S" rLabel="직관 N" pct={pcts.S||50} color="#f59e0b"/>
            <DimBar lLabel="사고 T" rLabel="감정 F" pct={pcts.T||50} color="#2dd4bf"/>
            <DimBar lLabel="판단 J" rLabel="인식 P" pct={pcts.J||50} color="#a78bfa"/>
          </div>

          {/* Description */}
          <div className="gl rounded-2xl p-5 mb-5">
            <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{color:"rgba(255,255,255,.12)"}}>{test.name} Analysis</h3>
            <p className="text-[12px] leading-relaxed mb-4" style={{color:"rgba(255,255,255,.35)"}}>{ti.desc}</p>
            <div className="space-y-2">
              {getTypeDetails(resType,test.id).map((item,i)=>(
                <div key={i} className="flex items-start gap-2 text-[12px]">
                  <span style={{color:ti.color}}>✦</span>
                  <span style={{color:"rgba(255,255,255,.35)"}}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ad */}
          <div className="w-full flex justify-center my-5"><div className="rounded-2xl flex items-center justify-center" style={{width:300,height:250,border:"1px dashed rgba(255,255,255,.03)",color:"rgba(255,255,255,.05)",fontSize:9}}>AD 300×250</div></div>

          {/* Compatibility */}
          {compat&&<div className="gl rounded-2xl p-5 mb-5">
            <h3 className="text-[9px] uppercase tracking-[0.2em] mb-4" style={{color:"rgba(255,255,255,.12)"}}>Compatibility</h3>
            {[["최고의 궁합",compat.best,"#2dd4bf","rgba(45,212,191,.08)","rgba(45,212,191,.15)"],["좋은 궁합",compat.good,"#fbbf24","rgba(251,191,36,.06)","rgba(251,191,36,.12)"],["도전적 궁합",compat.hard||[],"rgba(255,255,255,.25)","rgba(255,255,255,.02)","rgba(255,255,255,.05)"]].map(([label,types,color,bg,border])=>(
              <div key={label} className="mb-3 last:mb-0">
                <div className="text-[10px] font-bold mb-2" style={{color}}>{label}</div>
                <div className="flex flex-wrap gap-1.5">{types.map(t=>(
                  <span key={t} className="px-3 py-1.5 rounded-xl text-[11px] font-bold" style={{background:bg,border:`1px solid ${border}`,color}}>{TYPES[t].emoji} {t}</span>
                ))}</div>
              </div>
            ))}
          </div>}

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {[["다시하기",()=>{setPg("select");setResType(null);}],["📸 저장",save],["공유",()=>{const t=`나의 ${test.name} MBTI: ${resType} (${ti.name})`;if(navigator.share)navigator.share({title:"MBTI 인사이트",text:t,url:location.href});else{navigator.clipboard.writeText(t);alert("복사됨!");}}]].map(([l,fn],i)=>(
              <button key={i} onClick={fn} className={`py-3.5 rounded-2xl text-[11px] font-semibold tracking-[0.05em] transition-all active:scale-95 ${i===1?`bg-gradient-to-r ${test.grad}`:"gl hover:bg-white/[0.05]"}`}
                style={i===1?{boxShadow:`0 8px 20px -5px ${test.color}20`}:{color:"rgba(255,255,255,.35)"}}>{l}</button>
            ))}
          </div>

          {/* Other tests */}
          <div className="gl rounded-2xl p-5 mb-5">
            <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{color:"rgba(255,255,255,.12)"}}>More Tests</h3>
            <div className="grid grid-cols-3 gap-2">
              {TESTS.filter(t=>t.id!==test.id).map(t=>(
                <button key={t.id} onClick={()=>startTest(t)}
                  className="py-3 rounded-xl gl text-center transition-all active:scale-95 hover:bg-white/[0.04]">
                  <div className="text-lg">{t.emoji}</div>
                  <div className="text-[10px] mt-1" style={{color:"rgba(255,255,255,.25)"}}>{t.name}</div>
                  {allRes[t.id]&&<div className="text-[9px] mt-0.5 font-bold" style={{color:TYPES[allRes[t.id]].color}}>{allRes[t.id]}</div>}
                </button>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-2 mt-6" style={{color:"rgba(255,255,255,.1)",fontSize:10.5,lineHeight:1.9}}>
            <h2 style={{color:"rgba(255,255,255,.15)",fontSize:11,fontWeight:700}}>{resType} ({ti.name})</h2>
            <p>{ti.desc} {resType}과 가장 잘 맞는 유형은 {compat?.best.join(", ")}입니다.</p>
          </div>

          <div className="w-full flex justify-center my-5"><div className="w-full h-[65px] rounded-2xl flex items-center justify-center" style={{border:"1px dashed rgba(255,255,255,.03)",color:"rgba(255,255,255,.05)",fontSize:9}}>AD</div></div>
        </div>}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-20" style={{background:"linear-gradient(to top, rgba(4,3,12,.97), rgba(4,3,12,.5), transparent)"}}>
        <div className="text-center py-2.5"><div className="inline-block rounded-xl px-8 py-1.5" style={{border:"1px dashed rgba(255,255,255,.03)",color:"rgba(255,255,255,.05)",fontSize:8,letterSpacing:"0.2em"}}>ANCHOR AD</div></div>
      </footer>
    </div>
  );
}
