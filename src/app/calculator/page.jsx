"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";

/*
  ╔══════════════════════════════════════════════════════════════╗
  ║  만능 계산기 — Redesigned                                     ║
  ║  Design: Utilitarian Luxury + Teal Accent System             ║
  ║  Aesthetic: Dark glass, mint glow, precision typography      ║
  ╚══════════════════════════════════════════════════════════════╝
*/

// ===== CALCULATOR IMPLEMENTATIONS =====

function SalaryCalc(){
  const[sal,setSal]=useState("");
  const[dep,setDep]=useState(1);
  const[chi,setChi]=useState(0);
  const r=useMemo(()=>{
    const a=parseFloat(sal);if(!a||a<=0)return null;
    const m=a*10000/12,np=Math.min(m*.045,248850),hi=m*.03545,ltc=hi*.1281,ei=m*.009,ti_=np+hi+ltc+ei;
    let tax=0,prev=0;
    for(const[l,r]of[[14e6,.06],[5e7,.15],[88e6,.24],[15e7,.35],[3e8,.38],[5e8,.4],[1e9,.42],[Infinity,.45]]){
      if(a*1e4<=prev)break;tax+=(Math.min(a*1e4,l)-prev)*r;prev=l;}
    const mt=tax/12,ded=dep*15e4+chi*15e4,at=Math.max(0,mt-ded/12),lt=at*.1,td=ti_+at+lt;
    return{monthly:Math.round(m),np:Math.round(np),hi:Math.round(hi),ltc:Math.round(ltc),ei:Math.round(ei),tax:Math.round(at),lt:Math.round(lt),td:Math.round(td),net:Math.round(m-td),netY:Math.round((m-td)*12)};
  },[sal,dep,chi]);
  const f=n=>n?.toLocaleString()||"0";
  return(<div className="space-y-4">
    <In label="연봉" val={sal} set={setSal} ph="4000" suf="만원" />
    <div className="grid grid-cols-2 gap-3">
      <Sel label="부양가족 (본인포함)" val={dep} set={v=>setDep(+v)} opts={[1,2,3,4,5,6,7].map(n=>({v:n,l:`${n}명`}))} />
      <Sel label="20세 이하 자녀" val={chi} set={v=>setChi(+v)} opts={[0,1,2,3,4].map(n=>({v:n,l:`${n}명`}))} />
    </div>
    {r&&<RBox><Big label="월 실수령액" val={`${f(r.net)}원`} color="#2dd4bf"/><Big label="연 실수령액" val={`${f(r.netY)}원`} color="#2dd4bf" sub/>
      <Sep/><Row l="월 급여" v={`${f(r.monthly)}원`}/><Row l="국민연금" v={`-${f(r.np)}원`} neg/><Row l="건강보험" v={`-${f(r.hi)}원`} neg/><Row l="장기요양" v={`-${f(r.ltc)}원`} neg/><Row l="고용보험" v={`-${f(r.ei)}원`} neg/><Row l="소득세" v={`-${f(r.tax)}원`} neg/><Row l="지방소득세" v={`-${f(r.lt)}원`} neg/><Sep/><Row l="총 공제액" v={`-${f(r.td)}원`} neg bold/></RBox>}
    <Info text="2026년 기준 4대보험 요율 적용. 비과세 항목 미반영. 실제 금액과 차이가 있을 수 있습니다."/>
  </div>);
}

function HourlyCalc(){
  const[tp,setTp]=useState("toM");
  const[hw,setHw]=useState("");
  const[hd,setHd]=useState("8");
  const[dw,setDw]=useState("5");
  const[wh,setWh]=useState(true);
  const[mw,setMw]=useState("");
  const r=useMemo(()=>{
    if(tp==="toM"){const w=parseFloat(hw),h=parseFloat(hd),d=parseFloat(dw);if(!w||!h||!d)return null;
      const wk=h*d,whh=wh&&d>=5?h:0,tw=wk+whh,mh=tw*(365/7/12);return{monthly:Math.round(w*mh),wk,whh:Math.round(whh),mh:Math.round(mh),hourly:w};}
    else{const m=parseFloat(mw),h=parseFloat(hd),d=parseFloat(dw);if(!m||!h||!d)return null;
      const wk=h*d,whh=wh&&d>=5?h:0,tw=wk+whh,mh=tw*(365/7/12);return{monthly:m*1e4,hourly:Math.round(m*1e4/mh),wk,mh:Math.round(mh)};}
  },[tp,hw,hd,dw,wh,mw]);
  const f=n=>n?.toLocaleString()||"0";
  return(<div className="space-y-4">
    <div className="flex gap-2"><Tb a={tp==="toM"} fn={()=>setTp("toM")}>시급 → 월급</Tb><Tb a={tp==="toH"} fn={()=>setTp("toH")}>월급 → 시급</Tb></div>
    {tp==="toM"?<In label="시급" val={hw} set={setHw} ph="10030" suf="원"/>:<In label="월급" val={mw} set={setMw} ph="250" suf="만원"/>}
    <div className="grid grid-cols-2 gap-3"><In label="일 근무시간" val={hd} set={setHd} suf="시간"/><In label="주 근무일수" val={dw} set={setDw} suf="일"/></div>
    <Tog label="주휴수당 포함" on={wh} set={setWh}/>
    {r&&<RBox>{tp==="toM"?<Big label="예상 월급" val={`${f(r.monthly)}원`} color="#2dd4bf"/>:<Big label="시급 환산" val={`${f(r.hourly)}원`} color="#2dd4bf"/>}
      <Row l="주간 근무시간" v={`${r.wk}시간`}/><Row l="월 환산 시간" v={`약 ${f(r.mh)}시간`}/></RBox>}
    <Info text="2026년 최저시급 확인 필요. 주 15시간 이상 근무 시 주휴수당 발생."/>
  </div>);
}

function SavingsCalc(){
  const[mo,setMo]=useState("");
  const[rt,setRt]=useState("");
  const[mn,setMn]=useState("12");
  const[tx,setTx]=useState("n");
  const r=useMemo(()=>{
    const m=parseFloat(mo),ra=parseFloat(rt),n=parseInt(mn);if(!m||!ra||!n)return null;
    const mr=ra/100/12;let ti=0;for(let i=1;i<=n;i++)ti+=m*1e4*mr*(n-i+1);
    const tp=m*1e4*n,tr=tx==="n"?.154:tx==="r"?.095:0,tax=Math.round(ti*tr);
    return{tp,ti:Math.round(ti),tax,ni:Math.round(ti-tax),total:tp+Math.round(ti-tax)};
  },[mo,rt,mn,tx]);
  const f=n=>n?.toLocaleString()||"0";
  return(<div className="space-y-4">
    <In label="월 납입금" val={mo} set={setMo} ph="50" suf="만원"/>
    <div className="grid grid-cols-2 gap-3"><In label="연 이율" val={rt} set={setRt} ph="3.5" suf="%"/><In label="기간" val={mn} set={setMn} suf="개월"/></div>
    <div className="flex gap-2">{[["n","일반과세"],["r","세금우대"],["f","비과세"]].map(([v,l])=><Tb key={v} a={tx===v} fn={()=>setTx(v)}>{l}</Tb>)}</div>
    {r&&<RBox><Big label="만기 수령액" val={`${f(r.total)}원`} color="#2dd4bf"/><Sep/><Row l="납입 원금" v={`${f(r.tp)}원`}/><Row l="세전 이자" v={`${f(r.ti)}원`}/><Row l="이자 과세" v={`-${f(r.tax)}원`} neg/><Row l="세후 이자" v={`${f(r.ni)}원`} hi/></RBox>}
  </div>);
}

function LoanCalc(){
  const[pr,setPr]=useState("");
  const[rt,setRt]=useState("");
  const[yr,setYr]=useState("20");
  const[mt,setMt]=useState("eq");
  const r=useMemo(()=>{
    const p=parseFloat(pr)*1e8,ra=parseFloat(rt)/100/12,n=parseInt(yr)*12;if(!p||!ra||!n)return null;
    if(mt==="eq"){const mp=p*ra*Math.pow(1+ra,n)/(Math.pow(1+ra,n)-1),tp=mp*n;return{mp:Math.round(mp),tp:Math.round(tp),ti:Math.round(tp-p),p};}
    else{const mpr=p/n,fi=p*ra,fp=mpr+fi,lp=mpr+mpr*ra,ti=(p*ra*(n+1))/2;return{mp:Math.round(fp),lp:Math.round(lp),tp:Math.round(p+ti),ti:Math.round(ti),p};}
  },[pr,rt,yr,mt]);
  const f=n=>n?.toLocaleString()||"0";
  return(<div className="space-y-4">
    <In label="대출 금액" val={pr} set={setPr} ph="3" suf="억원"/>
    <div className="grid grid-cols-2 gap-3"><In label="연 이자율" val={rt} set={setRt} ph="4.5" suf="%"/><In label="상환 기간" val={yr} set={setYr} suf="년"/></div>
    <div className="flex gap-2"><Tb a={mt==="eq"} fn={()=>setMt("eq")}>원리금균등</Tb><Tb a={mt==="pr"} fn={()=>setMt("pr")}>원금균등</Tb></div>
    {r&&<RBox><Big label={mt==="eq"?"월 상환금":"첫 달 상환금"} val={`${f(r.mp)}원`} color="#f87171"/>
      {mt==="pr"&&<Row l="마지막 달" v={`${f(r.lp)}원`}/>}<Sep/><Row l="대출 원금" v={`${f(r.p)}원`}/><Row l="총 이자" v={`${f(r.ti)}원`} neg/><Row l="총 상환금" v={`${f(r.tp)}원`} bold/></RBox>}
  </div>);
}

function SeveranceCalc(){
  const[mo,setMo]=useState("");
  const[yr,setYr]=useState("");
  const[mn,setMn]=useState("0");
  const r=useMemo(()=>{
    const m=parseFloat(mo),y=parseInt(yr)||0,mo2=parseInt(mn)||0,td=y*365+mo2*30;
    if(!m||td<365)return null;return{sev:Math.round(m*1e4*(td/365)),td,ty:(td/365).toFixed(1)};
  },[mo,yr,mn]);
  const f=n=>n?.toLocaleString()||"0";
  return(<div className="space-y-4">
    <In label="월 평균임금 (세전)" val={mo} set={setMo} ph="350" suf="만원"/>
    <div className="grid grid-cols-2 gap-3"><In label="근속 연수" val={yr} set={setYr} ph="3" suf="년"/><In label="추가 개월" val={mn} set={setMn} ph="0" suf="개월"/></div>
    {r?<RBox><Big label="예상 퇴직금" val={`${f(r.sev)}원`} color="#2dd4bf"/><Row l="총 근속일수" v={`${f(r.td)}일 (약 ${r.ty}년)`}/></RBox>
    :mo&&<p className="text-center text-[11px]" style={{color:"rgba(251,191,36,.5)"}}>1년 이상 근무 시 퇴직금 발생</p>}
    <Info text="퇴직금 = 1일 평균임금 × 30일 × (총 근속일수/365). 상여금·연차수당 별도."/>
  </div>);
}

function BMICalc(){
  const[ht,setHt]=useState("");
  const[wt,setWt]=useState("");
  const r=useMemo(()=>{
    const h=parseFloat(ht)/100,w=parseFloat(wt);if(!h||!w)return null;
    const b=w/(h*h);let cat,col;
    if(b<18.5){cat="저체중";col="#60a5fa";}else if(b<23){cat="정상";col="#2dd4bf";}else if(b<25){cat="과체중";col="#fbbf24";}else if(b<30){cat="비만";col="#f87171";}else{cat="고도비만";col="#ef4444";}
    return{bmi:b.toFixed(1),cat,col,nMin:(18.5*h*h).toFixed(1),nMax:(23*h*h).toFixed(1)};
  },[ht,wt]);
  return(<div className="space-y-4">
    <div className="grid grid-cols-2 gap-3"><In label="키" val={ht} set={setHt} ph="170" suf="cm"/><In label="체중" val={wt} set={setWt} ph="70" suf="kg"/></div>
    {r&&<RBox><Big label="BMI" val={r.bmi} color={r.col}/><div className="text-center text-[13px] font-bold mt-1" style={{color:r.col}}>{r.cat}</div><Sep/>
      <div className="mt-3"><div className="h-[6px] rounded-full overflow-hidden flex" style={{background:"rgba(255,255,255,.03)"}}>
        {[["#60a5fa",18.5],["#2dd4bf",4.5],["#fbbf24",2],["#f87171",5],["#ef4444",10]].map(([c,w],i)=><div key={i} style={{background:c,flex:w}}/>)}
      </div><div className="flex justify-between mt-1" style={{fontSize:9,color:"rgba(255,255,255,.15)"}}>
        <span>저체중</span><span>정상</span><span>과체중</span><span>비만</span><span>고도비만</span>
      </div></div><Row l="정상 체중 범위" v={`${r.nMin}~${r.nMax} kg`}/></RBox>}
    <Info text="WHO 아시아-태평양 기준. 근육량 미반영 참고용."/>
  </div>);
}

function AreaCalc(){
  const[val,setVal]=useState("");
  const[fr,setFr]=useState("p");
  const cv=useMemo(()=>{
    const v=parseFloat(val);if(!v)return null;
    const sqm=fr==="p"?v*3.305785:fr==="m"?v:v*0.09290304;
    return{p:(sqm/3.305785).toFixed(2),m:sqm.toFixed(2),f:(sqm/0.09290304).toFixed(2)};
  },[val,fr]);
  return(<div className="space-y-4">
    <In label="면적" val={val} set={setVal} ph="32"/>
    <div className="flex gap-2">{[["p","평"],["m","㎡"],["f","ft²"]].map(([v,l])=><Tb key={v} a={fr===v} fn={()=>setFr(v)}>{l}</Tb>)}</div>
    {cv&&<RBox><div className="grid grid-cols-3 gap-4">{[["평",cv.p,"#a78bfa"],["㎡",cv.m,"#2dd4bf"],["ft²",cv.f,"#fbbf24"]].map(([u,v,c])=>
      <div key={u} className="text-center"><div className="text-[10px]" style={{color:"rgba(255,255,255,.2)"}}>{u}</div><div className="text-xl font-black mt-1 tabular-nums" style={{color:c}}>{parseFloat(v).toLocaleString()}</div></div>
    )}</div></RBox>}
    <Info text="1평 = 3.305785㎡. 아파트 공급면적은 전용면적의 1.3~1.5배."/>
  </div>);
}

function AgeCalc(){
  const[by,setBy]=useState("");
  const[bm,setBm]=useState("");
  const[bd,setBd]=useState("");
  const r=useMemo(()=>{
    const y=parseInt(by),m=parseInt(bm),d=parseInt(bd);if(!y||!m||!d)return null;
    const now=new Date(),b=new Date(y,m-1,d);if(b>now)return null;
    let ma=now.getFullYear()-y;if(now.getMonth()<m-1||(now.getMonth()===m-1&&now.getDate()<d))ma--;
    const ka=now.getFullYear()-y+1,td=Math.floor((now-b)/(864e5));
    let nb=new Date(now.getFullYear(),m-1,d);if(nb<=now)nb=new Date(now.getFullYear()+1,m-1,d);
    const db=Math.ceil((nb-now)/864e5);
    const z=["원숭이","닭","개","돼지","쥐","소","호랑이","토끼","용","뱀","말","양"][y%12];
    return{ma,ka,td,db,z};
  },[by,bm,bd]);
  return(<div className="space-y-4">
    <div className="grid grid-cols-3 gap-2"><In label="연도" val={by} set={setBy} ph="1995"/><In label="월" val={bm} set={setBm} ph="6"/><In label="일" val={bd} set={setBd} ph="15"/></div>
    {r&&<RBox><div className="grid grid-cols-2 gap-4 mb-3">
      <div className="text-center"><div className="text-[10px]" style={{color:"rgba(255,255,255,.2)"}}>만 나이</div><div className="text-3xl font-black" style={{color:"#2dd4bf"}}>{r.ma}세</div></div>
      <div className="text-center"><div className="text-[10px]" style={{color:"rgba(255,255,255,.2)"}}>한국 나이</div><div className="text-3xl font-black" style={{color:"#fbbf24"}}>{r.ka}세</div></div>
    </div><Sep/><Row l="살아온 날" v={`${r.td.toLocaleString()}일`}/><Row l="다음 생일까지" v={`${r.db}일`} hi/><Row l="띠" v={`${r.z}띠`}/></RBox>}
  </div>);
}

function DiscountCalc(){
  const[og,setOg]=useState("");
  const[dc,setDc]=useState("");
  const[tp,setTp]=useState("p");
  const r=useMemo(()=>{
    const o=parseFloat(og);if(!o)return null;const d=parseFloat(dc)||0;
    if(tp==="p"){const da=o*(d/100);return{final:Math.round(o-da),saved:Math.round(da),pct:d};}
    else return{final:Math.round(o-d),saved:Math.round(d),pct:((d/o)*100).toFixed(1)};
  },[og,dc,tp]);
  const f=n=>n?.toLocaleString()||"0";
  return(<div className="space-y-4">
    <In label="원래 가격" val={og} set={setOg} ph="50000" suf="원"/>
    <div className="flex gap-2"><Tb a={tp==="p"} fn={()=>setTp("p")}>할인율 %</Tb><Tb a={tp==="a"} fn={()=>setTp("a")}>할인금액 원</Tb></div>
    <In label={tp==="p"?"할인율":"할인 금액"} val={dc} set={setDc} ph={tp==="p"?"30":"15000"} suf={tp==="p"?"%":"원"}/>
    {r&&<RBox><Big label="할인 적용가" val={`${f(r.final)}원`} color="#2dd4bf"/><Row l="절약 금액" v={`${f(r.saved)}원`} hi/><Row l="할인율" v={`${r.pct}%`}/></RBox>}
  </div>);
}

function CharCountCalc(){
  const[txt,setTxt]=useState("");
  const s=useMemo(()=>{
    const t=txt.length,ns=txt.replace(/\s/g,"").length,w=txt.trim()?txt.trim().split(/\s+/).length:0;
    const l=txt?txt.split("\n").length:0,b=new Blob([txt]).size;
    return{t,ns,w,l,b,k:(txt.match(/[가-힣]/g)||[]).length,e:(txt.match(/[a-zA-Z]/g)||[]).length,n:(txt.match(/[0-9]/g)||[]).length};
  },[txt]);
  return(<div className="space-y-4">
    <div><label className="block text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{color:"rgba(255,255,255,.2)"}}>텍스트 입력</label>
      <textarea value={txt} onChange={e=>setTxt(e.target.value)} rows={5} placeholder="글자수를 세고 싶은 텍스트..."
        className="w-full rounded-2xl px-5 py-4 text-[13px] resize-none transition-all" style={{background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.06)",color:"#e2e8f0",outline:"none"}}
        onFocus={e=>e.target.style.borderColor="rgba(45,212,191,.3)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.06)"}/>
    </div>
    <RBox><div className="grid grid-cols-2 gap-x-6 gap-y-2">
      {[["전체",s.t,"#2dd4bf"],["공백제외",s.ns,"#a78bfa"],["단어",s.w,"#60a5fa"],["줄",s.l,"#fbbf24"],["바이트",s.b,"#f87171"],["한글",s.k,"#ec4899"],["영문",s.e,"#38bdf8"],["숫자",s.n,"#84cc16"]].map(([l,v,c])=>
        <div key={l} className="flex justify-between items-center py-0.5">
          <span className="text-[11px]" style={{color:"rgba(255,255,255,.25)"}}>{l}</span>
          <span className="text-[13px] font-black tabular-nums" style={{color:c}}>{v.toLocaleString()}</span>
        </div>
      )}
    </div></RBox>
  </div>);
}

// ===== REGISTRY =====
const CALCS=[
  {id:"salary",name:"연봉 실수령액",emoji:"💸",cat:"finance",desc:"4대보험·세금 공제 후",C:SalaryCalc},
  {id:"hourly",name:"시급 계산기",emoji:"⏰",cat:"finance",desc:"시급↔월급, 주휴수당",C:HourlyCalc},
  {id:"savings",name:"적금 이자",emoji:"🏦",cat:"finance",desc:"만기 수령액 계산",C:SavingsCalc},
  {id:"loan",name:"대출 이자",emoji:"🏠",cat:"finance",desc:"원리금균등·원금균등",C:LoanCalc},
  {id:"severance",name:"퇴직금",emoji:"📋",cat:"finance",desc:"근속연수 기반 퇴직금",C:SeveranceCalc},
  {id:"bmi",name:"BMI",emoji:"⚖️",cat:"health",desc:"체질량지수·정상 범위",C:BMICalc},
  {id:"area",name:"평수 변환",emoji:"📐",cat:"unit",desc:"평 ↔ ㎡ ↔ ft²",C:AreaCalc},
  {id:"age",name:"나이 계산",emoji:"🎂",cat:"date",desc:"만나이·한국나이·생일",C:AgeCalc},
  {id:"discount",name:"할인율",emoji:"🏷️",cat:"study",desc:"할인가·절약 금액",C:DiscountCalc},
  {id:"charcount",name:"글자수 세기",emoji:"✍️",cat:"study",desc:"글자·단어·바이트",C:CharCountCalc},
];
const CATS=[
  {id:"all",name:"전체",emoji:"📋",color:"#64748b"},
  {id:"finance",name:"금융",emoji:"💰",color:"#2dd4bf"},
  {id:"health",name:"건강",emoji:"💪",color:"#f87171"},
  {id:"unit",name:"단위",emoji:"📐",color:"#a78bfa"},
  {id:"date",name:"날짜",emoji:"📅",color:"#fbbf24"},
  {id:"study",name:"학업",emoji:"📝",color:"#60a5fa"},
];
const SEO={salary:"국민연금(4.5%), 건강보험(3.545%), 장기요양(12.81%), 고용보험(0.9%), 소득세, 지방소득세를 공제하여 실수령액을 계산합니다.",loan:"원리금균등은 매달 동일 금액, 원금균등은 원금을 균등 분할합니다. 원금균등이 총 이자가 적지만 초기 부담이 큽니다.",bmi:"BMI = 체중(kg) / 키(m)². WHO 아시아-태평양 기준 18.5 미만 저체중, 18.5~23 정상, 23~25 과체중, 25 이상 비만.",area:"1평 = 3.3058㎡. 아파트 전용면적과 공급면적은 다릅니다. 전용면적은 실제 거주 공간만 포함합니다.",savings:"적금 이자는 단리 계산됩니다. 일반과세 15.4%, 세금우대 9.5%, 비과세 조건부 적용."};

// ===== SHARED UI COMPONENTS =====
function In({label,val,set,ph,suf}){
  return(<div><label className="block text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{color:"rgba(255,255,255,.2)"}}>{label}</label>
    <div className="relative"><input type="number" inputMode="decimal" value={val} onChange={e=>set(e.target.value)} placeholder={ph||""}
      className="w-full rounded-2xl px-5 py-3.5 text-[13px] font-medium transition-all duration-300 tabular-nums" style={{background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.06)",color:"#e2e8f0",outline:"none"}}
      onFocus={e=>e.target.style.borderColor="rgba(45,212,191,.3)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.06)"}/>
      {suf&&<span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px]" style={{color:"rgba(255,255,255,.15)"}}>{suf}</span>}
    </div></div>);
}
function Sel({label,val,set,opts}){
  return(<div><label className="block text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{color:"rgba(255,255,255,.2)"}}>{label}</label>
    <select value={val} onChange={e=>set(e.target.value)} className="w-full rounded-2xl px-5 py-3.5 text-[13px] appearance-none transition-all" style={{background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.06)",color:"#e2e8f0",outline:"none"}}>
      {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>);
}
function Tb({a,fn,children}){
  return(<button onClick={fn} className={`flex-1 py-2.5 rounded-xl text-[11px] font-semibold tracking-[0.03em] transition-all duration-300 ${a?"text-white":"hover:bg-white/[0.03]"}`}
    style={a?{background:"rgba(45,212,191,.12)",color:"#2dd4bf",border:"1px solid rgba(45,212,191,.2)"}:{color:"rgba(255,255,255,.25)",border:"1px solid rgba(255,255,255,.04)"}}>{children}</button>);
}
function Tog({label,on,set}){
  return(<label className="flex items-center justify-between cursor-pointer py-1">
    <span className="text-[11px]" style={{color:"rgba(255,255,255,.3)"}}>{label}</span>
    <div className="w-10 h-5 rounded-full relative transition-all" style={{background:on?"rgba(45,212,191,.2)":"rgba(255,255,255,.04)"}} onClick={()=>set(!on)}>
      <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all" style={{left:on?"22px":"2px",background:on?"#2dd4bf":"rgba(255,255,255,.15)"}}/>
    </div></label>);
}
function RBox({children}){return (<div className="rounded-2xl p-5 space-y-2" style={{background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.05)"}}>{children}</div>);}
function Big({label,val,color,sub}){return (<div className={`text-center ${sub?"mt-1":""}`}><div className="text-[10px]" style={{color:"rgba(255,255,255,.2)"}}>{label}</div><div className={`${sub?"text-lg":"text-[26px]"} font-black tabular-nums mt-0.5`} style={{color}}>{val}</div></div>);}
function Row({l,v,neg,hi,bold}){return (<div className="flex justify-between items-center py-0.5"><span className="text-[11px]" style={{color:"rgba(255,255,255,.2)"}}>{l}</span><span className={`text-[12px] tabular-nums ${bold?"font-bold":"font-medium"}`} style={{color:neg?"#f87171":hi?"#2dd4bf":"rgba(255,255,255,.5)"}}>{v}</span></div>);}
function Sep(){return (<div style={{borderTop:"1px solid rgba(255,255,255,.04)",margin:"8px 0"}}/>);}
function Info({text}){return (<div className="flex gap-2.5 p-4 rounded-2xl" style={{background:"rgba(251,191,36,.03)",border:"1px solid rgba(251,191,36,.06)"}}>
  <span className="text-[11px] mt-0.5 flex-shrink-0" style={{color:"rgba(251,191,36,.4)"}}>ℹ</span>
  <p className="text-[10px] leading-relaxed" style={{color:"rgba(251,191,36,.35)"}}>{text}</p></div>);}

// ===== MAIN APP =====
export default function CalculatorHub(){
  const[cat,setCat]=useState("all");
  const[act,setAct]=useState(null);
  const[q,setQ]=useState("");
  const filtered=useMemo(()=>{
    let l=CALCS;if(cat!=="all")l=l.filter(c=>c.cat===cat);
    if(q.trim()){const s=q.toLowerCase();l=l.filter(c=>c.name.includes(s)||c.desc.includes(s));}return l;
  },[cat,q]);
  const AC=act?CALCS.find(c=>c.id===act)?.C:null;
  const ai=act?CALCS.find(c=>c.id===act):null;

  return(
    <div className="min-h-screen text-white relative" style={{background:"radial-gradient(ellipse at 50% 0%, #0a1628 0%, #060d18 40%, #030810 100%)",fontFamily:"'Pretendard Variable','Pretendard',-apple-system,sans-serif"}}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        @keyframes fadeIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes orbDrift{0%,100%{transform:translate(0,0)}33%{transform:translate(12px,-18px)}66%{transform:translate(-8px,12px)}}
        .fi{animation:fadeIn .4s cubic-bezier(.16,1,.3,1) forwards}
        .od{animation:orbDrift 15s ease-in-out infinite}
        .gl{background:rgba(255,255,255,.03);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.05)}
        input:focus,select:focus,textarea:focus{outline:none}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
        ::-webkit-scrollbar{display:none}
      `}</style>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full od" style={{background:"radial-gradient(circle,rgba(45,212,191,.05),transparent 70%)",top:"-15%",right:"-20%"}}/>
        <div className="absolute w-[350px] h-[350px] rounded-full od" style={{background:"radial-gradient(circle,rgba(96,165,250,.04),transparent 70%)",bottom:"10%",left:"-12%",animationDelay:"-5s"}}/>
      </div>

      {/* Home */}<Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{color:"rgba(255,255,255,.4)",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",backdropFilter:"blur(12px)"}}>← 홈</Link>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b" style={{background:"rgba(6,13,24,.85)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderColor:"rgba(255,255,255,.04)"}}>
        <div className="max-w-lg mx-auto px-5 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            {act?<button onClick={()=>setAct(null)} className="flex items-center gap-1.5 text-[13px] transition-colors hover:text-white" style={{color:"rgba(255,255,255,.35)"}}>
              <span>←</span><span>목록</span></button>
            :<div className="flex items-center gap-2.5">
              <span className="text-xl">🧮</span>
              <span className="text-[17px] font-black tracking-tight" style={{background:"linear-gradient(135deg, #2dd4bf, #60a5fa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>만능 계산기</span>
            </div>}
            {act&&ai&&<span className="text-[12px] font-semibold" style={{color:"rgba(255,255,255,.4)"}}>{ai.emoji} {ai.name}</span>}
          </div>

          {!act&&<>
            {/* Search */}
            <div className="relative mb-3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px]" style={{color:"rgba(255,255,255,.12)"}}>⌕</span>
              <input type="text" value={q} onChange={e=>setQ(e.target.value)} placeholder="계산기 검색..."
                className="w-full rounded-2xl pl-10 pr-4 py-2.5 text-[12px] transition-all" style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.05)",color:"#e2e8f0",outline:"none"}}
                onFocus={e=>e.target.style.borderColor="rgba(45,212,191,.25)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.05)"}/>
            </div>
            {/* Cats */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {CATS.map(c=>(
                <button key={c.id} onClick={()=>setCat(c.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-semibold tracking-[0.03em] transition-all duration-300`}
                  style={cat===c.id?{background:`${c.color}15`,color:c.color,border:`1px solid ${c.color}25`}:{color:"rgba(255,255,255,.2)",border:"1px solid transparent"}}>
                  {c.emoji} {c.name}
                </button>
              ))}
            </div>
          </>}
        </div>
      </header>

      {/* Ad top */}
      <div className="w-full flex justify-center my-3 relative z-10"><div className="w-full max-w-[728px] h-[65px] rounded-2xl flex items-center justify-center" style={{border:"1px dashed rgba(255,255,255,.03)",color:"rgba(255,255,255,.06)",fontSize:9,letterSpacing:"0.15em"}}>AD BANNER</div></div>

      <main className="max-w-lg mx-auto px-5 pb-28 relative z-10">
        {/* Grid */}
        {!act&&<div className="grid grid-cols-2 gap-2.5 mt-2">
          {filtered.map((c,i)=>{const ct=CATS.find(x=>x.id===c.cat);return(
            <button key={c.id} onClick={()=>setAct(c.id)}
              className="text-left p-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] fi"
              style={{background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.04)",animationDelay:`${i*45}ms`,animationFillMode:"backwards"}}>
              <div className="text-2xl mb-2.5">{c.emoji}</div>
              <div className="text-[13px] font-bold" style={{color:"rgba(255,255,255,.8)"}}>{c.name}</div>
              <div className="text-[10px] mt-0.5" style={{color:"rgba(255,255,255,.2)"}}>{c.desc}</div>
              <div className="mt-2.5"><span className="text-[9px] px-2 py-0.5 rounded-md" style={{background:`${ct.color}10`,color:`${ct.color}80`}}>{ct.name}</span></div>
            </button>
          );})}
          {filtered.length===0&&<div className="col-span-2 text-center py-16" style={{color:"rgba(255,255,255,.15)",fontSize:13}}>검색 결과가 없습니다</div>}
        </div>}

        {/* Active Calc */}
        {act&&AC&&<div className="mt-4 fi">
          <AC/>
          {/* Ad */}
          <div className="w-full flex justify-center my-5"><div className="rounded-2xl flex items-center justify-center" style={{width:300,height:250,border:"1px dashed rgba(255,255,255,.03)",color:"rgba(255,255,255,.06)",fontSize:9,letterSpacing:"0.15em"}}>AD 300×250</div></div>
          {/* Related */}
          <div className="mt-5 pt-4" style={{borderTop:"1px solid rgba(255,255,255,.03)"}}>
            <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{color:"rgba(255,255,255,.12)"}}>Related</h3>
            <div className="grid grid-cols-2 gap-2">
              {CALCS.filter(c=>c.id!==act&&c.cat===ai?.cat).slice(0,4).map(c=>(
                <button key={c.id} onClick={()=>{setAct(c.id);window.scrollTo(0,0);}}
                  className="flex items-center gap-2.5 p-3 rounded-xl transition-all active:scale-95 hover:bg-white/[0.03]" style={{border:"1px solid rgba(255,255,255,.04)"}}>
                  <span className="text-lg">{c.emoji}</span>
                  <div><div className="text-[11px] font-bold" style={{color:"rgba(255,255,255,.6)"}}>{c.name}</div>
                  <div className="text-[9px]" style={{color:"rgba(255,255,255,.15)"}}>{c.desc}</div></div>
                </button>
              ))}
            </div>
          </div>
          {/* SEO */}
          {SEO[act]&&<div className="mt-6 pt-4 space-y-2" style={{borderTop:"1px solid rgba(255,255,255,.03)"}}>
            <h2 className="text-[11px] font-bold" style={{color:"rgba(255,255,255,.15)"}}>📖 {ai?.name}</h2>
            <p className="text-[10px] leading-relaxed" style={{color:"rgba(255,255,255,.1)"}}>{SEO[act]}</p>
          </div>}
        </div>}

        {/* Hub SEO */}
        {!act&&<div className="mt-10 space-y-2" style={{color:"rgba(255,255,255,.1)",fontSize:10.5,lineHeight:1.9}}>
          <h2 className="text-[11px] font-bold" style={{color:"rgba(255,255,255,.15)"}}>만능 계산기</h2>
          <p>연봉 실수령액, 시급, 적금, 대출, BMI, 평수, 나이 계산기를 한곳에 모았습니다. 2026년 기준 4대보험 요율 반영. 모바일에서도 편리하게 이용 가능합니다.</p>
        </div>}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-20" style={{background:"linear-gradient(to top, rgba(3,8,16,.97), rgba(3,8,16,.5), transparent)"}}>
        <div className="text-center py-2.5"><div className="inline-block rounded-xl px-8 py-1.5" style={{border:"1px dashed rgba(255,255,255,.03)",color:"rgba(255,255,255,.05)",fontSize:8,letterSpacing:"0.2em"}}>ANCHOR AD</div></div>
      </footer>
    </div>
  );
}
