import { useState, useMemo, useCallback, useRef } from "react";

/*
  ╔══════════════════════════════════════════════════════════════╗
  ║  ColorCraft — Redesigned                                     ║
  ║  Design: Creative Studio + Prismatic Accents                 ║
  ║  Palette: Deep studio black + rainbow tool accents           ║
  ╚══════════════════════════════════════════════════════════════╝
*/

// ===== COLOR UTILS =====
function hexToRgb(h){h=h.replace("#","");return{r:parseInt(h.substring(0,2),16),g:parseInt(h.substring(2,4),16),b:parseInt(h.substring(4,6),16)};}
function rgbToHex(r,g,b){return"#"+[r,g,b].map(x=>Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,"0")).join("");}
function rgbToHsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);switch(mx){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;case b:h=((r-g)/d+4)/6;break;}}return{h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)};}
function hslToRgb(h,s,l){h/=360;s/=100;l/=100;let r,g,b;if(s===0){r=g=b=l;}else{const f=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;r=f(p,q,h+1/3);g=f(p,q,h);b=f(p,q,h-1/3);}return{r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)};}
function randColor(){return"#"+Math.floor(Math.random()*16777215).toString(16).padStart(6,"0");}
function luminance(r,g,b){const[rs,gs,bs]=[r,g,b].map(c=>{c/=255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4);});return .2126*rs+.7152*gs+.0722*bs;}
function contrast(h1,h2){const c1=hexToRgb(h1),c2=hexToRgb(h2);const l1=luminance(c1.r,c1.g,c1.b),l2=luminance(c2.r,c2.g,c2.b);return(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);}
function txtCol(hex){const{r,g,b}=hexToRgb(hex);return luminance(r,g,b)>.179?"#000":"#fff";}

function useCopy(){
  const[copied,setCopied]=useState(false);
  const copy=useCallback((t)=>{navigator.clipboard.writeText(t);setCopied(true);setTimeout(()=>setCopied(false),1500);},[]);
  return{copied,copy};
}

// ===== TOOL 1: PALETTE =====
function Palette(){
  const[cols,setCols]=useState(()=>Array.from({length:5},randColor));
  const[locked,setLocked]=useState(Array(5).fill(false));
  const[harm,setHarm]=useState("random");
  const{copied,copy}=useCopy();
  const gen=()=>{
    if(harm==="random"){setCols(p=>p.map((c,i)=>locked[i]?c:randColor()));}
    else{const base=Math.random()*360;const off=harm==="complementary"?[0,180,30,210,60]:harm==="analogous"?[0,30,60,-30,-60]:harm==="triadic"?[0,120,240,60,180]:[0,150,210,30,330];
      setCols(p=>off.map((o,i)=>{if(locked[i])return p[i];const{r,g,b}=hslToRgb((base+o)%360,50+Math.random()*40,30+Math.random()*40);return rgbToHex(r,g,b);}));}
  };
  const css=`:root {\n${cols.map((c,i)=>`  --color-${i+1}: ${c};`).join("\n")}\n}`;
  return (
    <div>
      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
        {["random","analogous","complementary","triadic","split"].map(h=>(
          <button key={h} onClick={()=>setHarm(h)} className="flex-shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all"
            style={harm===h?{background:"rgba(168,85,247,.12)",color:"#c084fc",border:"1px solid rgba(168,85,247,.2)"}:{color:"rgba(255,255,255,.2)",border:"1px solid transparent"}}>
            {({random:"랜덤",analogous:"유사색",complementary:"보색",triadic:"삼원색",split:"분할보색"})[h]}
          </button>
        ))}
      </div>
      <div className="flex rounded-2xl overflow-hidden h-36 mb-3">
        {cols.map((c,i)=>(
          <div key={i} className="flex-1 relative group cursor-pointer flex flex-col items-center justify-end pb-2.5 transition-all duration-300 hover:flex-[1.4]" style={{background:c}} onClick={()=>copy(c)}>
            <button onClick={e=>{e.stopPropagation();setLocked(p=>{const n=[...p];n[i]=!n[i];return n;});}} className="absolute top-2 right-1.5 text-xs opacity-0 group-hover:opacity-80 transition-opacity" style={{color:txtCol(c)}}>{locked[i]?"🔒":"🔓"}</button>
            <span className="text-[10px] font-mono font-bold opacity-0 group-hover:opacity-80 transition-opacity" style={{color:txtCol(c)}}>{c.toUpperCase()}</span>
          </div>
        ))}
      </div>
      <button onClick={gen} className="w-full py-3 rounded-2xl font-bold text-[13px] transition-all active:scale-[0.97]" style={{background:"linear-gradient(135deg, #a855f7, #ec4899)",boxShadow:"0 8px 25px -6px rgba(168,85,247,.25)"}}>🎲 새 팔레트</button>
      <CodeBox code={css} copied={copied} onCopy={()=>copy(css)}/>
    </div>
  );
}

// ===== TOOL 2: GRADIENT =====
function Gradient(){
  const[c1,setC1]=useState("#6366f1");
  const[c2,setC2]=useState("#ec4899");
  const[c3,setC3]=useState("");
  const[ang,setAng]=useState(135);
  const[tp,setTp]=useState("linear");
  const{copied,copy}=useCopy();
  const grad=useMemo(()=>{const s=[c1,c2,c3].filter(Boolean).join(", ");return tp==="linear"?`linear-gradient(${ang}deg, ${s})`:`radial-gradient(circle, ${s})`;},[c1,c2,c3,ang,tp]);
  const css=`background: ${grad};`;
  return (
    <div>
      <div className="h-36 rounded-2xl mb-4" style={{background:grad,border:"1px solid rgba(255,255,255,.06)"}}/>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[["색상 1",c1,setC1],["색상 2",c2,setC2],["색상 3",c3,setC3]].map(([l,v,set])=>(
          <div key={l}><label className="text-[9px] uppercase tracking-[0.15em] block mb-1" style={{color:"rgba(255,255,255,.15)"}}>{l}</label>
            <div className="flex items-center gap-1"><input type="color" value={v||"#000"} onChange={e=>set(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent" style={{WebkitAppearance:"none"}}/>
              <input type="text" value={v} onChange={e=>set(e.target.value)} placeholder="#000" maxLength={7} className="flex-1 rounded-lg px-2 py-1.5 text-[10px] font-mono" style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",color:"#e2e8f0",outline:"none"}}/></div></div>
        ))}
      </div>
      <div className="flex gap-2 items-end mb-3">
        <div className="flex gap-1.5">{["linear","radial"].map(t=>(<button key={t} onClick={()=>setTp(t)} className="px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all" style={tp===t?{background:"rgba(168,85,247,.12)",color:"#c084fc",border:"1px solid rgba(168,85,247,.2)"}:{color:"rgba(255,255,255,.2)",border:"1px solid transparent"}}>{t==="linear"?"선형":"원형"}</button>))}</div>
        {tp==="linear"&&<div className="flex-1"><label className="text-[9px] block mb-1" style={{color:"rgba(255,255,255,.12)"}}>{ang}°</label><input type="range" min="0" max="360" value={ang} onChange={e=>setAng(+e.target.value)} className="w-full h-1 rounded-full appearance-none cursor-pointer" style={{background:"linear-gradient(90deg, #6366f1, #ec4899)",accentColor:"#a855f7"}}/></div>}
      </div>
      <button onClick={()=>{setC1(randColor());setC2(randColor());setAng(Math.random()*360|0);}} className="w-full py-2.5 rounded-xl text-[11px] font-medium gl transition-all active:scale-95" style={{color:"rgba(255,255,255,.35)"}}>🎲 랜덤</button>
      <CodeBox code={css} copied={copied} onCopy={()=>copy(css)}/>
    </div>
  );
}

// ===== TOOL 3: BOX SHADOW =====
function Shadow(){
  const[x,setX]=useState(4);const[y,setY]=useState(4);const[bl,setBl]=useState(20);const[sp,setSp]=useState(0);
  const[col,setCol]=useState("#000000");const[op,setOp]=useState(25);const[ins,setIns]=useState(false);
  const{copied,copy}=useCopy();
  const shadow=`${ins?"inset ":""}${x}px ${y}px ${bl}px ${sp}px ${col}${Math.round(op*2.55).toString(16).padStart(2,"0")}`;
  const css=`box-shadow: ${shadow};`;
  return (
    <div>
      <div className="flex justify-center my-8"><div className="w-36 h-36 rounded-2xl transition-all" style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.06)",boxShadow:shadow}}/></div>
      {[["X",x,setX,-50,50],["Y",y,setY,-50,50],["블러",bl,setBl,0,100],["스프레드",sp,setSp,-50,50],["불투명도",op,setOp,0,100]].map(([l,v,set,mn,mx])=>(
        <div key={l} className="flex items-center gap-3 mb-2"><span className="text-[10px] w-14" style={{color:"rgba(255,255,255,.2)"}}>{l}</span>
          <input type="range" min={mn} max={mx} value={v} onChange={e=>set(+e.target.value)} className="flex-1 h-1 rounded-full appearance-none cursor-pointer" style={{background:"rgba(255,255,255,.04)",accentColor:"#a855f7"}}/>
          <span className="text-[10px] w-7 text-right tabular-nums" style={{color:"rgba(255,255,255,.2)"}}>{v}</span></div>
      ))}
      <div className="flex gap-3 items-center mt-2 mb-3">
        <div className="flex items-center gap-1.5"><input type="color" value={col} onChange={e=>setCol(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"/><span className="text-[10px] font-mono" style={{color:"rgba(255,255,255,.2)"}}>{col}</span></div>
        <label className="flex items-center gap-1.5 cursor-pointer" onClick={()=>setIns(!ins)}>
          <div className="w-8 h-4 rounded-full relative transition-all" style={{background:ins?"rgba(168,85,247,.2)":"rgba(255,255,255,.06)"}}>
            <div className="w-3.5 h-3.5 rounded-full absolute top-0.5 transition-all" style={{left:ins?"18px":"2px",background:ins?"#c084fc":"rgba(255,255,255,.15)"}}/></div>
          <span className="text-[10px]" style={{color:"rgba(255,255,255,.2)"}}>Inset</span></label>
      </div>
      <CodeBox code={css} copied={copied} onCopy={()=>copy(css)}/>
    </div>
  );
}

// ===== TOOL 4: CONVERTER =====
function Converter(){
  const[hex,setHex]=useState("#6366f1");
  const{copied,copy}=useCopy();
  const rgb=useMemo(()=>hexToRgb(hex),[hex]);
  const hsl=useMemo(()=>rgbToHsl(rgb.r,rgb.g,rgb.b),[rgb]);
  const formats=[["HEX",hex.toUpperCase()],["RGB",`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],["HSL",`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`],["RGBA",`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`]];
  return (
    <div>
      <div className="h-20 rounded-2xl mb-4 flex items-center justify-center" style={{background:hex,border:"1px solid rgba(255,255,255,.06)"}}>
        <span className="font-mono font-bold text-lg" style={{color:txtCol(hex)}}>{hex.toUpperCase()}</span></div>
      <div className="flex items-center gap-2 mb-4">
        <input type="color" value={hex} onChange={e=>setHex(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"/>
        <input type="text" value={hex} onChange={e=>{if(/^#[0-9a-fA-F]{0,6}$/.test(e.target.value))setHex(e.target.value);}} maxLength={7}
          className="flex-1 rounded-2xl px-4 py-2.5 text-[13px] font-mono" style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",color:"#e2e8f0",outline:"none"}}/></div>
      <div className="space-y-2">
        {formats.map(([l,v])=>(
          <div key={l} className="flex items-center justify-between p-3 rounded-xl gl">
            <div><div className="text-[9px] uppercase tracking-[0.15em]" style={{color:"rgba(255,255,255,.12)"}}>{l}</div><div className="text-[12px] font-mono mt-0.5" style={{color:"rgba(255,255,255,.5)"}}>{v}</div></div>
            <button onClick={()=>copy(v)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all active:scale-95" style={{background:"rgba(255,255,255,.04)",color:copied?"#2dd4bf":"rgba(255,255,255,.3)"}}>{copied?"✓":"복사"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== TOOL 5: CONTRAST =====
function ContrastCheck(){
  const[fg,setFg]=useState("#ffffff");const[bg,setBg]=useState("#1a1a2e");
  const ratio=useMemo(()=>contrast(fg,bg),[fg,bg]);
  const aa=ratio>=4.5,aaa=ratio>=7,aaL=ratio>=3;
  return (
    <div>
      <div className="h-28 rounded-2xl mb-4 flex items-center justify-center px-6" style={{background:bg,border:"1px solid rgba(255,255,255,.06)"}}>
        <p className="text-center font-bold" style={{color:fg}}><span className="text-2xl block">가나다라 ABC</span><span className="text-[12px] opacity-70">텍스트 가독성을 확인하세요</span></p></div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[["텍스트",fg,setFg],["배경",bg,setBg]].map(([l,v,set])=>(
          <div key={l}><label className="text-[9px] uppercase tracking-[0.15em] block mb-1" style={{color:"rgba(255,255,255,.12)"}}>{l}</label>
            <div className="flex items-center gap-1"><input type="color" value={v} onChange={e=>set(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"/>
              <input type="text" value={v} onChange={e=>set(e.target.value)} maxLength={7} className="flex-1 rounded-lg px-2 py-1.5 text-[10px] font-mono" style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",color:"#e2e8f0",outline:"none"}}/></div></div>
        ))}
      </div>
      <button onClick={()=>{const t=fg;setFg(bg);setBg(t);}} className="w-full py-2 rounded-xl text-[11px] gl mb-4 active:scale-[0.98] transition-all" style={{color:"rgba(255,255,255,.25)"}}>🔄 색상 반전</button>
      <div className="text-center p-4 rounded-2xl gl2 mb-3"><div className="text-3xl font-black tabular-nums">{ratio.toFixed(2)} : 1</div><div className="text-[10px] mt-1" style={{color:"rgba(255,255,255,.15)"}}>대비율</div></div>
      <div className="grid grid-cols-3 gap-2">
        {[["AA 일반",aa,4.5],["AAA 일반",aaa,7],["AA 큰글씨",aaL,3]].map(([l,pass,mn])=>(
          <div key={l} className="text-center p-3 rounded-xl" style={{background:pass?"rgba(45,212,191,.06)":"rgba(248,113,113,.06)",border:`1px solid ${pass?"rgba(45,212,191,.15)":"rgba(248,113,113,.15)"}`}}>
            <div className="text-lg font-bold" style={{color:pass?"#2dd4bf":"#f87171"}}>{pass?"✓":"✗"}</div>
            <div className="text-[9px]" style={{color:"rgba(255,255,255,.2)"}}>{l}</div>
            <div className="text-[9px]" style={{color:"rgba(255,255,255,.1)"}}>≥{mn}:1</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== TOOL 6: BUTTON GEN =====
function BtnGen(){
  const[bgC,setBgC]=useState("#6366f1");const[txC,setTxC]=useState("#ffffff");const[rad,setRad]=useState(12);
  const[px,setPx]=useState(24);const[py,setPy]=useState(12);const[fs,setFs]=useState(14);
  const[bdr,setBdr]=useState(false);const[bdrC,setBdrC]=useState("#6366f1");const[shd,setShd]=useState(true);
  const[txt,setTxt]=useState("Button");
  const{copied,copy}=useCopy();
  const style={background:bgC,color:txC,borderRadius:rad,padding:`${py}px ${px}px`,fontSize:fs,fontWeight:600,border:bdr?`2px solid ${bdrC}`:"none",boxShadow:shd?`0 4px 14px ${bgC}44`:"none",cursor:"pointer"};
  const css=`background: ${bgC};\ncolor: ${txC};\nborder-radius: ${rad}px;\npadding: ${py}px ${px}px;\nfont-size: ${fs}px;\nfont-weight: 600;${bdr?`\nborder: 2px solid ${bdrC};`:""}${shd?`\nbox-shadow: 0 4px 14px ${bgC}44;`:""}`;
  return (
    <div>
      <div className="flex justify-center py-8"><button style={style}>{txt}</button></div>
      <input type="text" value={txt} onChange={e=>setTxt(e.target.value)} placeholder="버튼 텍스트" className="w-full rounded-2xl px-4 py-2.5 text-[12px] text-center mb-3" style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",color:"#e2e8f0",outline:"none"}}/>
      <div className="grid grid-cols-2 gap-2 mb-3">{[["배경",bgC,setBgC],["글자",txC,setTxC]].map(([l,v,set])=>(<div key={l} className="flex items-center gap-1.5"><input type="color" value={v} onChange={e=>set(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"/><span className="text-[10px]" style={{color:"rgba(255,255,255,.2)"}}>{l}</span></div>))}</div>
      {[["둥글기",rad,setRad,0,50],["가로",px,setPx,4,60],["세로",py,setPy,4,30],["크기",fs,setFs,10,32]].map(([l,v,set,mn,mx])=>(
        <div key={l} className="flex items-center gap-2 mb-1.5"><span className="text-[9px] w-10" style={{color:"rgba(255,255,255,.15)"}}>{l}</span>
          <input type="range" min={mn} max={mx} value={v} onChange={e=>set(+e.target.value)} className="flex-1 h-1 rounded appearance-none cursor-pointer" style={{background:"rgba(255,255,255,.04)",accentColor:"#a855f7"}}/>
          <span className="text-[9px] w-5 text-right tabular-nums" style={{color:"rgba(255,255,255,.15)"}}>{v}</span></div>
      ))}
      <CodeBox code={css} copied={copied} onCopy={()=>copy(css)}/>
    </div>
  );
}

// ===== TOOL 7: FONT PAIRING =====
const PAIRS=[
  {d:"Playfair Display",b:"Source Sans Pro",s:"클래식 에디토리얼"},
  {d:"Montserrat",b:"Merriweather",s:"모던 클린"},
  {d:"Oswald",b:"Quattrocento",s:"볼드 매거진"},
  {d:"Poppins",b:"Lora",s:"프렌들리 미니멀"},
  {d:"Raleway",b:"Roboto Slab",s:"우아한 모던"},
  {d:"DM Serif Display",b:"DM Sans",s:"DM 패밀리"},
  {d:"Abril Fatface",b:"Poppins",s:"하이 콘트라스트"},
  {d:"Cormorant Garamond",b:"Fira Sans",s:"엘레강스 서체"},
];
function FontPair(){
  const[idx,setIdx]=useState(0);
  const{copied,copy}=useCopy();
  const p=PAIRS[idx];
  const css=`@import url('https://fonts.googleapis.com/css2?family=${p.d.replace(/ /g,"+")}:wght@700&family=${p.b.replace(/ /g,"+")}:wght@400&display=swap');\n\nh1 { font-family: '${p.d}', serif; }\np { font-family: '${p.b}', sans-serif; }`;
  return (
    <div>
      <link href={`https://fonts.googleapis.com/css2?family=${p.d.replace(/ /g,"+")}:wght@700&family=${p.b.replace(/ /g,"+")}:wght@400&display=swap`} rel="stylesheet"/>
      <div className="p-6 rounded-2xl gl2 mb-4">
        <h3 style={{fontFamily:`'${p.d}',serif`,fontSize:26,fontWeight:700,lineHeight:1.3}} className="text-white mb-3">The Quick Brown Fox Jumps Over The Lazy Dog</h3>
        <p style={{fontFamily:`'${p.b}',sans-serif`,fontSize:13,lineHeight:1.8,color:"rgba(255,255,255,.35)"}}>디자인에서 폰트 조합은 시각적 계층과 가독성을 결정하는 핵심 요소입니다. 헤딩과 본문의 대비가 명확할수록 구조가 잘 드러납니다.</p>
      </div>
      <div className="text-center mb-3">
        <div className="text-[10px]" style={{color:"rgba(255,255,255,.15)"}}>{p.s}</div>
        <div className="text-[13px] mt-1"><span className="font-bold" style={{color:"#c084fc"}}>{p.d}</span><span style={{color:"rgba(255,255,255,.15)"}}> + </span><span style={{color:"#2dd4bf"}}>{p.b}</span></div>
      </div>
      <div className="flex gap-2 mb-3">
        <button onClick={()=>setIdx(i=>(i-1+PAIRS.length)%PAIRS.length)} className="flex-1 py-2.5 rounded-xl gl text-[11px] active:scale-95 transition-all" style={{color:"rgba(255,255,255,.3)"}}>← 이전</button>
        <button onClick={()=>setIdx(i=>(i+1)%PAIRS.length)} className="flex-1 py-2.5 rounded-xl gl text-[11px] active:scale-95 transition-all" style={{color:"rgba(255,255,255,.3)"}}>다음 →</button>
      </div>
      <CodeBox code={css} copied={copied} onCopy={()=>copy(css)}/>
      <div className="flex justify-center gap-1 mt-3">{PAIRS.map((_,i)=>(<div key={i} className="w-1.5 h-1.5 rounded-full" style={{background:i===idx?"#c084fc":"rgba(255,255,255,.08)"}}/>))}</div>
    </div>
  );
}

// ===== TOOL 8: IMAGE EXTRACTOR =====
function ImgExtract(){
  const[cols,setCols]=useState([]);const[url,setUrl]=useState("");
  const{copied,copy}=useCopy();
  const cvs=useRef(null);
  const handle=useCallback((e)=>{
    const f=e.target.files[0];if(!f)return;
    const rd=new FileReader();
    rd.onload=(ev)=>{setUrl(ev.target.result);const img=new Image();img.onload=()=>{
      const c=cvs.current,x=c.getContext("2d");c.width=100;c.height=100;x.drawImage(img,0,0,100,100);
      const d=x.getImageData(0,0,100,100).data;const bk={};
      for(let i=0;i<d.length;i+=16){const r=Math.round(d[i]/32)*32,g=Math.round(d[i+1]/32)*32,b=Math.round(d[i+2]/32)*32;const k=`${r},${g},${b}`;bk[k]=(bk[k]||0)+1;}
      const sorted=Object.entries(bk).sort((a,b)=>b[1]-a[1]).slice(0,6);
      setCols(sorted.map(([k])=>{const[r,g,b]=k.split(",").map(Number);return rgbToHex(r,g,b);}));
    };img.src=ev.target.result;};rd.readAsDataURL(f);
  },[]);
  const css=cols.length?`:root {\n${cols.map((c,i)=>`  --extracted-${i+1}: ${c};`).join("\n")}\n}`:"";
  return (
    <div>
      <canvas ref={cvs} className="hidden"/>
      <label className="block w-full p-6 rounded-2xl cursor-pointer text-center mb-4 transition-all hover:bg-white/[0.03]" style={{border:"2px dashed rgba(255,255,255,.06)"}}>
        <input type="file" accept="image/*" onChange={handle} className="hidden"/>
        {url?(<img src={url} alt="" className="max-h-36 mx-auto rounded-xl object-cover"/>):(<div><div className="text-3xl mb-2">🖼️</div><div className="text-[11px]" style={{color:"rgba(255,255,255,.2)"}}>이미지 업로드</div></div>)}
      </label>
      {cols.length>0&&(<>
        <div className="flex rounded-xl overflow-hidden h-14 mb-3">{cols.map((c,i)=>(<div key={i} className="flex-1 flex items-end justify-center pb-1 cursor-pointer group" style={{background:c}} onClick={()=>copy(c)}>
          <span className="text-[8px] font-mono font-bold opacity-0 group-hover:opacity-80 transition-opacity" style={{color:txtCol(c)}}>{c}</span></div>))}</div>
        <CodeBox code={css} copied={copied} onCopy={()=>copy(css)}/>
      </>)}
    </div>
  );
}

// ===== SHARED: CODE BOX =====
function CodeBox({code,copied,onCopy}){
  return (
    <div className="mt-3 rounded-2xl p-3.5" style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.04)"}}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[9px] uppercase tracking-[0.15em]" style={{color:"rgba(255,255,255,.1)"}}>CSS</span>
        <button onClick={onCopy} className="px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all active:scale-95" style={{background:"rgba(255,255,255,.04)",color:copied?"#2dd4bf":"rgba(255,255,255,.3)"}}>{copied?"✓ 복사됨":"복사"}</button>
      </div>
      <pre className="text-[11px] font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed" style={{color:"#2dd4bf"}}>{code}</pre>
    </div>
  );
}

// ===== REGISTRY =====
const TOOLS=[
  {id:"palette",name:"팔레트",emoji:"🎨",desc:"조화로운 5색 팔레트",C:Palette},
  {id:"gradient",name:"그라데이션",emoji:"🌈",desc:"선형/원형 + CSS",C:Gradient},
  {id:"shadow",name:"박스 그림자",emoji:"🔲",desc:"시각 프리뷰 + CSS",C:Shadow},
  {id:"converter",name:"색상 변환",emoji:"🔄",desc:"HEX ↔ RGB ↔ HSL",C:Converter},
  {id:"contrast",name:"대비율 체커",emoji:"👁️",desc:"WCAG AA/AAA",C:ContrastCheck},
  {id:"button",name:"버튼 생성기",emoji:"🔘",desc:"커스텀 CSS 버튼",C:BtnGen},
  {id:"font",name:"폰트 조합",emoji:"🔤",desc:"Google Fonts 페어링",C:FontPair},
  {id:"extract",name:"색상 추출",emoji:"🖼️",desc:"이미지에서 팔레트",C:ImgExtract},
];

// ===== MAIN =====
export default function ColorCraft(){
  const[act,setAct]=useState(null);
  const AC=act?TOOLS.find(t=>t.id===act)?.C:null;
  const ai=act?TOOLS.find(t=>t.id===act):null;

  return (
    <div className="min-h-screen text-white" style={{background:"radial-gradient(ellipse at 50% 0%, #16082a 0%, #0c0618 40%, #06030c 100%)",fontFamily:"'Pretendard Variable','Pretendard',-apple-system,sans-serif"}}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        @keyframes si{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes orbF{0%,100%{transform:translate(0,0)}33%{transform:translate(14px,-20px)}66%{transform:translate(-10px,14px)}}
        .si{animation:si .4s cubic-bezier(.16,1,.3,1) forwards}
        .od{animation:orbF 16s ease-in-out infinite}
        .gl{background:rgba(255,255,255,.03);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.06)}
        .gl2{background:rgba(255,255,255,.06);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border:1px solid rgba(255,255,255,.08)}
        input[type=range]{-webkit-appearance:none;height:4px;border-radius:2px}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:white;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.4)}
        input[type=color]{-webkit-appearance:none;border:none;padding:0}input[type=color]::-webkit-color-swatch-wrapper{padding:0}input[type=color]::-webkit-color-swatch{border:2px solid rgba(255,255,255,.15);border-radius:6px}
        ::-webkit-scrollbar{display:none}input:focus{outline:none}
      `}</style>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full od" style={{background:"radial-gradient(circle,rgba(168,85,247,.05),transparent 70%)",top:"-18%",right:"-20%"}}/>
        <div className="absolute w-[350px] h-[350px] rounded-full od" style={{background:"radial-gradient(circle,rgba(236,72,153,.04),transparent 70%)",bottom:"8%",left:"-12%",animationDelay:"-6s"}}/>
      </div>

      <header className="sticky top-0 z-30" style={{background:"rgba(12,6,24,.88)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          {act?(<button onClick={()=>setAct(null)} className="text-[13px] hover:text-white transition-colors" style={{color:"rgba(255,255,255,.3)"}}>← Tools</button>)
          :(<div className="flex items-center gap-2"><span className="text-lg">🎨</span><span className="text-[16px] font-black" style={{background:"linear-gradient(135deg, #a855f7, #ec4899, #f59e0b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>ColorCraft</span></div>)}
          {ai&&<span className="text-[11px] font-medium" style={{color:"rgba(255,255,255,.3)"}}>{ai.emoji} {ai.name}</span>}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pb-28 relative z-10">
        {!act?(
          <div className="si">
            <div className="text-center py-6">
              <h2 className="text-[20px] font-black">디자이너를 위한<br/><span style={{background:"linear-gradient(135deg, #a855f7, #ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>도구 모음</span></h2>
              <p className="text-[11px] mt-2" style={{color:"rgba(255,255,255,.2)"}}>색상, CSS, 폰트를 빠르게 만들고 복사하세요</p>
            </div>
            <div className="w-full flex justify-center my-3"><div className="w-full h-[60px] rounded-2xl flex items-center justify-center" style={{border:"1px dashed rgba(255,255,255,.03)",color:"rgba(255,255,255,.05)",fontSize:9}}>AD</div></div>
            <div className="grid grid-cols-2 gap-2.5">
              {TOOLS.map((t,i)=>(
                <button key={t.id} onClick={()=>setAct(t.id)}
                  className="text-left p-4 rounded-2xl gl hover:bg-white/[0.04] active:scale-[0.98] transition-all si"
                  style={{animationDelay:`${i*45}ms`,animationFillMode:"backwards"}}>
                  <div className="text-2xl mb-2">{t.emoji}</div>
                  <div className="text-[13px] font-bold" style={{color:"rgba(255,255,255,.8)"}}>{t.name}</div>
                  <div className="text-[10px] mt-0.5" style={{color:"rgba(255,255,255,.2)"}}>{t.desc}</div>
                </button>
              ))}
            </div>
            <div className="mt-8 space-y-2" style={{color:"rgba(255,255,255,.08)",fontSize:10.5,lineHeight:1.9,borderTop:"1px solid rgba(255,255,255,.03)",paddingTop:16}}>
              <h2 style={{color:"rgba(255,255,255,.12)",fontSize:11,fontWeight:700}}>ColorCraft</h2>
              <p>Generate palettes, gradients, check WCAG contrast, explore font pairings, and extract colors from images — all with instant CSS output.</p>
            </div>
          </div>
        ):(
          <div className="mt-4 si">
            <AC/>
            <div className="w-full flex justify-center my-5"><div className="rounded-2xl flex items-center justify-center" style={{width:300,height:250,border:"1px dashed rgba(255,255,255,.03)",color:"rgba(255,255,255,.05)",fontSize:9}}>AD 300×250</div></div>
            <div className="pt-4" style={{borderTop:"1px solid rgba(255,255,255,.03)"}}>
              <h3 className="text-[9px] uppercase tracking-[0.2em] mb-2" style={{color:"rgba(255,255,255,.1)"}}>Other Tools</h3>
              <div className="flex gap-2 overflow-x-auto">
                {TOOLS.filter(t=>t.id!==act).map(t=>(
                  <button key={t.id} onClick={()=>{setAct(t.id);window.scrollTo(0,0);}}
                    className="flex-shrink-0 px-3 py-2.5 rounded-xl gl text-center transition-all active:scale-95 hover:bg-white/[0.04]">
                    <div className="text-lg">{t.emoji}</div>
                    <div className="text-[10px] mt-0.5" style={{color:"rgba(255,255,255,.25)"}}>{t.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-20" style={{background:"linear-gradient(to top, rgba(6,3,12,.97), rgba(6,3,12,.5), transparent)"}}>
        <div className="text-center py-2.5"><div className="inline-block rounded-xl px-8 py-1.5" style={{border:"1px dashed rgba(255,255,255,.03)",color:"rgba(255,255,255,.05)",fontSize:8,letterSpacing:"0.2em"}}>ANCHOR AD</div></div>
      </footer>
    </div>
  );
}
