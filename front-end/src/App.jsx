import { useState, useCallback, useMemo } from "react";
import {
  LayoutDashboard, ArrowLeftRight, PieChart, Target, BarChart2,
  TrendingUp, TrendingDown, Wallet, CreditCard, Building2, LineChart,
  ShoppingBag, Utensils, Car, Home, Heart, Zap, Film, PiggyBank,
  MoreHorizontal, Plus, Search, ChevronRight, Settings, LogOut,
  Bell, Eye, EyeOff, Mail, Lock, User, Phone, Calendar,
  ArrowUpRight, ArrowDownLeft, Trash2, CheckCircle2, AlertCircle,
  Info, X, Sparkles, Shield, BadgeCheck, RefreshCw, Filter,
  DollarSign, BookOpen, Award
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────────────────── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#f4f5f9; --white:#fff; --border:#e5e7ef; --border2:#d1d5db;
    --text:#0f172a; --text2:#374151; --muted:#6b7280; --muted2:#9ca3af;
    --blue:#2563eb; --blue-d:#1d4ed8; --blue-bg:#eff6ff; --blue-bdr:#bfdbfe;
    --green:#16a34a; --green-bg:#f0fdf4; --green-bdr:#bbf7d0;
    --red:#dc2626; --red-bg:#fef2f2; --red-bdr:#fecaca;
    --amber:#d97706; --amber-bg:#fffbeb; --amber-bdr:#fde68a;
    --purple:#7c3aed; --purple-bg:#f5f3ff; --purple-bdr:#ddd6fe;
    --teal:#0d9488; --teal-bg:#f0fdfa; --teal-bdr:#99f6e4;
    --pink:#db2777; --pink-bg:#fdf2f8; --pink-bdr:#fbcfe8;
    --shadow-xs:0 1px 2px rgba(0,0,0,0.05);
    --shadow-sm:0 1px 3px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04);
    --shadow:0 4px 6px -1px rgba(0,0,0,0.07),0 2px 4px -1px rgba(0,0,0,0.04);
    --shadow-md:0 10px 15px -3px rgba(0,0,0,0.07),0 4px 6px -2px rgba(0,0,0,0.04);
    --shadow-lg:0 20px 25px -5px rgba(0,0,0,0.09),0 10px 10px -5px rgba(0,0,0,0.03);
    --r:10px; --r-sm:7px; --r-lg:14px; --r-xl:20px;
  }
  body { font-family:'Plus Jakarta Sans',sans-serif; background:var(--bg); color:var(--text); font-size:14px; line-height:1.5; -webkit-font-smoothing:antialiased; }
  ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:99px}

  /* Card */
  .card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);box-shadow:var(--shadow-sm);}

  /* Stat card */
  .stat-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:20px 22px;box-shadow:var(--shadow-sm);transition:box-shadow .2s,transform .2s;cursor:default;}
  .stat-card:hover{box-shadow:var(--shadow-md);transform:translateY(-1px);}

  /* Nav */
  .nav-item{display:flex;align-items:center;gap:9px;padding:9px 12px;margin:1px 6px;border-radius:var(--r-sm);cursor:pointer;font-size:13.5px;font-weight:500;color:var(--muted);transition:background .15s,color .15s;user-select:none;border:1px solid transparent;}
  .nav-item:hover{background:var(--bg);color:var(--text2);}
  .nav-item.active{background:var(--blue-bg);color:var(--blue);font-weight:600;border-color:var(--blue-bdr);}
  .nav-icon{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;background:var(--bg);flex-shrink:0;transition:background .15s;}
  .nav-item.active .nav-icon{background:rgba(37,99,235,0.1);}

  /* Buttons */
  .btn-primary{background:var(--blue);color:#fff;border:none;border-radius:var(--r-sm);padding:9px 18px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:background .15s,box-shadow .15s,transform .1s;box-shadow:0 1px 3px rgba(37,99,235,0.35);}
  .btn-primary:hover{background:var(--blue-d);box-shadow:0 4px 14px rgba(37,99,235,0.4);transform:translateY(-1px);}
  .btn-primary:active{transform:translateY(0);}
  .btn-primary:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
  .btn-secondary{background:var(--white);color:var(--text2);border:1px solid var(--border);border-radius:var(--r-sm);padding:8px 16px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:background .15s,border-color .15s,transform .1s;box-shadow:var(--shadow-xs);}
  .btn-secondary:hover{background:var(--bg);border-color:var(--border2);transform:translateY(-1px);}
  .btn-ghost{background:transparent;color:var(--muted);border:none;border-radius:var(--r-sm);padding:6px 10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:background .15s,color .15s;}
  .btn-ghost:hover{background:var(--bg);color:var(--text2);}
  .btn-danger{background:transparent;color:var(--red);border:1px solid var(--red-bdr);border-radius:6px;padding:5px 10px;font-size:12px;font-weight:500;cursor:pointer;transition:background .15s;font-family:'Plus Jakarta Sans',sans-serif;display:inline-flex;align-items:center;gap:4px;}
  .btn-danger:hover{background:var(--red-bg);}

  /* Input */
  .ft-input{background:var(--white);border:1px solid var(--border);border-radius:var(--r-sm);color:var(--text);padding:10px 12px;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;outline:none;width:100%;transition:border-color .15s,box-shadow .15s;box-shadow:var(--shadow-xs);}
  .ft-input:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,0.1);}
  .ft-input::placeholder{color:var(--muted2);}
  .ft-select{background:var(--white);border:1px solid var(--border);border-radius:var(--r-sm);color:var(--text);padding:10px 12px;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;outline:none;cursor:pointer;transition:border-color .15s;box-shadow:var(--shadow-xs);}
  .ft-select:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,0.1);}

  /* Txn row */
  .txn-row{display:flex;align-items:center;justify-content:space-between;padding:13px 18px;border-bottom:1px solid var(--border);transition:background .12s;cursor:default;}
  .txn-row:last-child{border-bottom:none;}
  .txn-row:hover{background:#fafbff;}

  /* Progress */
  .progress-track{background:var(--bg);border-radius:99px;height:6px;overflow:hidden;}
  .progress-fill{height:100%;border-radius:99px;transition:width .9s cubic-bezier(.4,0,.2,1);}

  /* Table head */
  .tbl-head{display:flex;align-items:center;justify-content:space-between;padding:10px 18px;background:var(--bg);border-bottom:1px solid var(--border);font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;}

  /* Insight */
  .insight-card{border-radius:var(--r);padding:16px;border:1px solid;transition:box-shadow .18s,transform .18s;cursor:default;}
  .insight-card:hover{box-shadow:var(--shadow-md);transform:translateY(-2px);}

  /* Account card */
  .acct-row{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:var(--r-sm);border:1px solid var(--border);background:var(--white);transition:box-shadow .18s,transform .18s;cursor:default;}
  .acct-row:hover{box-shadow:var(--shadow);transform:translateY(-1px);}

  /* Modal */
  .modal-backdrop{animation:mfade .18s ease;}
  .modal-box{animation:mslide .22s cubic-bezier(.4,0,.2,1);}
  @keyframes mfade{from{opacity:0}to{opacity:1}}
  @keyframes mslide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

  /* Page */
  .page-fade{animation:pfade .2s ease;}
  @keyframes pfade{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}

  /* Toast */
  @keyframes tslide{from{opacity:0;transform:translate(-50%,8px)}to{opacity:1;transform:translate(-50%,0)}}

  /* Auth page */
  .auth-input-wrap{position:relative;}
  .auth-input-wrap .auth-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--muted2);pointer-events:none;}
  .auth-input-wrap .ft-input{padding-left:40px;}
  .auth-input-wrap .eye-btn{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--muted2);padding:2px;display:flex;}
  .auth-input-wrap .eye-btn:hover{color:var(--muted);}

  /* Tag pill */
  .cat-pill{border-radius:99px;padding:2px 9px;font-size:11.5px;font-weight:600;display:inline-flex;align-items:center;gap:4px;}
`;

/* ─────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────── */
const CATEGORIES = {
  income:    { label:"Income",        color:"#16a34a", bg:"#f0fdf4", bdr:"#bbf7d0", Icon:TrendingUp   },
  food:      { label:"Food & Dining", color:"#ea580c", bg:"#fff7ed", bdr:"#fed7aa", Icon:Utensils     },
  transport: { label:"Transport",     color:"#d97706", bg:"#fffbeb", bdr:"#fde68a", Icon:Car          },
  housing:   { label:"Housing",       color:"#2563eb", bg:"#eff6ff", bdr:"#bfdbfe", Icon:Home         },
  health:    { label:"Health",        color:"#0891b2", bg:"#f0fdfa", bdr:"#99f6e4", Icon:Heart        },
  shopping:  { label:"Shopping",      color:"#db2777", bg:"#fdf2f8", bdr:"#fbcfe8", Icon:ShoppingBag  },
  entertain: { label:"Entertainment", color:"#7c3aed", bg:"#f5f3ff", bdr:"#ddd6fe", Icon:Film         },
  savings:   { label:"Savings",       color:"#16a34a", bg:"#f0fdf4", bdr:"#bbf7d0", Icon:PiggyBank    },
  utilities: { label:"Utilities",     color:"#6d28d9", bg:"#f5f3ff", bdr:"#ddd6fe", Icon:Zap          },
  other:     { label:"Other",         color:"#6b7280", bg:"#f9fafb", bdr:"#e5e7eb", Icon:MoreHorizontal},
};

function generateTransactions() {
  const now = new Date(); const data = [];
  const payees = {
    food:      ["Zomato","Swiggy","Café Coffee Day","McDonald's","Dosa Corner","Pizza Hut","Barbeque Nation"],
    transport: ["Uber","Ola","HMRL Metro","Indian Oil","Rapido","IndiGo Airlines","Indian Railways"],
    housing:   ["Rent – Landlord","Society Maintenance","Home Loan EMI – SBI","Gas Cylinder – HP"],
    health:    ["Apollo Pharmacy","Practo Consult","Cult.fit Membership","MedPlus","Star Health Insurance"],
    shopping:  ["Amazon India","Flipkart","Myntra","DMart","Reliance Trends","Nykaa","Croma"],
    entertain: ["Netflix","Spotify Premium","BookMyShow","Steam","Disney+ Hotstar","YouTube Premium"],
    savings:   ["SIP – Mirae Asset","RD – SBI","PPF – Post Office","NPS Contribution"],
    utilities: ["TSSPDCL Electricity","Airtel Broadband","Hyderabad Water Board","Jio Recharge"],
    income:    ["Salary – TCS","Freelance – Upwork","Dividend – HDFC Bank","FD Interest – SBI","Consulting Fee"],
    other:     ["ATM Withdrawal","Miscellaneous","Bank Charges – HDFC"],
  };
  for (let i=0;i<90;i++) {
    const d=new Date(now); d.setDate(d.getDate()-i);
    const isIncome=Math.random()<0.07;
    const cat=isIncome?"income":Object.keys(CATEGORIES).filter(c=>c!=="income")[Math.floor(Math.random()*8)];
    const list=payees[cat];
    const payee=list[Math.floor(Math.random()*list.length)];
    const amt=isIncome?Math.round((Math.random()*40000+5000)*100)/100:Math.round((Math.random()*3000+50)*100)/100;
    data.push({id:`txn-${i}`,date:d.toISOString().slice(0,10),payee,category:cat,amount:amt,type:isIncome?"credit":"debit",note:""});
  }
  for (let m=0;m<3;m++) {
    const d=new Date(now.getFullYear(),now.getMonth()-m,1);
    data.push({id:`sal-${m}`,date:d.toISOString().slice(0,10),payee:"Salary – TCS",category:"income",amount:85000,type:"credit",note:"Monthly salary"});
  }
  return data.sort((a,b)=>new Date(b.date)-new Date(a.date));
}

const ACCOUNTS = [
  {id:"a1",name:"HDFC Savings Account",  type:"Savings",    balance:142350,  last4:"4821",color:"#2563eb",bg:"#eff6ff",Icon:Building2},
  {id:"a2",name:"SBI Salary Account",    type:"Salary",     balance:68200,   last4:"3309",color:"#16a34a",bg:"#f0fdf4",Icon:Wallet   },
  {id:"a3",name:"ICICI Credit Card",     type:"Credit Card",balance:-23450,  last4:"9977",color:"#dc2626",bg:"#fef2f2",Icon:CreditCard},
  {id:"a4",name:"Zerodha Portfolio",     type:"Investment", balance:315000,  last4:"—",   color:"#7c3aed",bg:"#f5f3ff",Icon:LineChart },
];

const BUDGETS_INIT = [
  {category:"food",      limit:8000,  spent:6200},
  {category:"transport", limit:3000,  spent:2100},
  {category:"shopping",  limit:5000,  spent:4800},
  {category:"entertain", limit:2000,  spent:900 },
  {category:"utilities", limit:4000,  spent:3100},
  {category:"health",    limit:3000,  spent:1400},
];
const GOALS_INIT = [
  {id:"g1",name:"Emergency Fund",    target:300000, saved:142000,Icon:Shield,     deadline:"2025-12-31",color:"#2563eb"},
  {id:"g2",name:"Europe Vacation",   target:150000, saved:42000, Icon:Award,      deadline:"2026-06-30",color:"#16a34a"},
  {id:"g3",name:"MacBook Pro",       target:180000, saved:90000, Icon:BookOpen,   deadline:"2025-09-30",color:"#7c3aed"},
  {id:"g4",name:"Home Down Payment", target:1000000,saved:310000,Icon:Home,       deadline:"2028-01-01",color:"#d97706"},
];

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
const fmt     = (n,dec=0) => "₹"+Math.abs(n).toLocaleString("en-IN",{minimumFractionDigits:dec,maximumFractionDigits:dec});
const fmtDate = d => new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
const clamp   = (v,lo,hi) => Math.max(lo,Math.min(hi,v));

function useLocalStorage(key,init) {
  const iv=typeof init==="function"?init():init;
  const [val,setVal]=useState(()=>{
    try{const s=localStorage.getItem(key);if(!s)return iv;const p=JSON.parse(s);if(Array.isArray(iv)&&!Array.isArray(p))return iv;return p;}catch{return iv;}
  });
  const save=useCallback(v=>{setVal(v);try{localStorage.setItem(key,JSON.stringify(v));}catch{}},[key]);
  return [val,save];
}

/* SVG donut */
function DonutChart({data,size=164}) {
  const total=data.reduce((s,d)=>s+d[1],0)||1;
  let angle=-90;const r=60;const cx=size/2;const cy=size/2;
  const slices=data.slice(0,6).map(([cat,val])=>{
    const pct=val/total;const a1=(angle*Math.PI)/180;angle+=pct*360;const a2=(angle*Math.PI)/180;
    const x1=cx+r*Math.cos(a1);const y1=cy+r*Math.sin(a1);const x2=cx+r*Math.cos(a2);const y2=cy+r*Math.sin(a2);
    return{cat,val,pct,d:`M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${pct>0.5?1:0} 1 ${x2} ${y2}Z`,color:CATEGORIES[cat]?.color};
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map(s=><path key={s.cat} d={s.d} fill={s.color} opacity={0.85}/>)}
      <circle cx={cx} cy={cy} r={40} fill="white"/>
    </svg>
  );
}

/* Bar chart */
function BarChart({data}) {
  const max=Math.max(...data.map(d=>d.total),1);
  return (
    <svg width={288} height={118}>
      <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity="0.9"/><stop offset="100%" stopColor="#2563eb" stopOpacity="0.3"/></linearGradient></defs>
      {data.map((d,i)=>{
        const h=clamp((d.total/max)*90,4,90);const x=i*72;
        return (
          <g key={i}>
            <rect x={x} y={90-h} width={54} height={h} rx={5} fill="url(#bg)"/>
            <text x={x+27} y={108} textAnchor="middle" fontSize={11} fill="#6b7280" fontFamily="Plus Jakarta Sans">{d.label}</text>
            <text x={x+27} y={90-h-5} textAnchor="middle" fontSize={10} fill="#2563eb" fontFamily="Plus Jakarta Sans" fontWeight="600">₹{(d.total/1000).toFixed(1)}k</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   AUTH PAGES
═══════════════════════════════════════════════════════════ */
function AuthPage({onLogin}) {
  const [tab, setTab]           = useState("login"); // "login" | "register"
  const [showPass, setShowPass] = useState(false);
  const [showPass2,setShowPass2]= useState(false);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState("");
  const [success, setSuccess]   = useState("");

  const [loginForm,  setLoginForm]  = useState({email:"arjun@example.com", password:"password123"});
  const [regForm,    setRegForm]    = useState({name:"",email:"",phone:"",password:"",confirm:""});

  const handleLogin = () => {
    setError("");
    if (!loginForm.email || !loginForm.password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin({name:"Arjun Kumar", email:loginForm.email}); }, 1200);
  };

  const handleRegister = () => {
    setError("");
    if (!regForm.name||!regForm.email||!regForm.password) { setError("Please fill all required fields."); return; }
    if (regForm.password !== regForm.confirm) { setError("Passwords do not match."); return; }
    if (regForm.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess("Account created! You can now sign in."); setTab("login"); }, 1400);
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",background:"var(--bg)"}}>
      {/* Left panel */}
      <div style={{flex:"0 0 48%",background:"linear-gradient(145deg,#1e40af 0%,#2563eb 45%,#1d4ed8 100%)",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"48px 56px",position:"relative",overflow:"hidden"}}>
        {/* Background decoration */}
        <div style={{position:"absolute",top:-80,right:-80,width:320,height:320,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <div style={{position:"absolute",bottom:-60,left:-60,width:260,height:260,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <div style={{position:"absolute",top:"40%",right:"15%",width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>

        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:12,position:"relative"}}>
          <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,0.15)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(255,255,255,0.2)"}}>
            <Wallet size={22} color="white"/>
          </div>
          <div>
            <div style={{fontSize:20,fontWeight:800,color:"white",letterSpacing:"-0.3px"}}>FinVault</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",letterSpacing:"0.5px",fontWeight:500}}>Personal Finance</div>
          </div>
        </div>

        {/* Hero text */}
        <div style={{position:"relative"}}>
          <div style={{fontSize:36,fontWeight:800,color:"white",lineHeight:1.25,letterSpacing:"-0.8px",marginBottom:16}}>
            Take control of your finances
          </div>
          <div style={{fontSize:15,color:"rgba(255,255,255,0.75)",lineHeight:1.7,marginBottom:36}}>
            Track expenses, manage budgets, and reach your financial goals — all in one place.
          </div>

          {/* Feature pills */}
          {[
            {Icon:BarChart2,  text:"Smart spending analytics"},
            {Icon:Target,     text:"Goal-based savings tracker"},
            {Icon:Shield,     text:"Bank-level data security"},
            {Icon:Sparkles,   text:"AI-powered insights"},
          ].map(({Icon:Ic,text},i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{width:34,height:34,borderRadius:9,background:"rgba(255,255,255,0.13)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"1px solid rgba(255,255,255,0.15)"}}>
                <Ic size={16} color="white"/>
              </div>
              <span style={{fontSize:13.5,color:"rgba(255,255,255,0.85)",fontWeight:500}}>{text}</span>
            </div>
          ))}
        </div>

        {/* Bottom badge */}
        <div style={{display:"flex",alignItems:"center",gap:10,position:"relative"}}>
          <div style={{display:"flex"}}>
            {["AK","SM","RV","PK"].map((init,i)=>(
              <div key={i} style={{width:30,height:30,borderRadius:99,background:`hsl(${i*60+200},60%,55%)`,border:"2px solid white",marginLeft:i?-8:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"white"}}>{init}</div>
            ))}
          </div>
          <div>
            <div style={{fontSize:13,color:"white",fontWeight:600}}>Trusted by 50,000+ users</div>
            <div style={{fontSize:11.5,color:"rgba(255,255,255,0.6)"}}>Across India</div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 48px"}}>
        <div style={{width:"100%",maxWidth:420}}>

          {/* Tab switcher */}
          <div style={{display:"flex",background:"var(--bg)",borderRadius:10,padding:4,marginBottom:30,border:"1px solid var(--border)"}}>
            {["login","register"].map(t=>(
              <button key={t} onClick={()=>{setTab(t);setError("");setSuccess("");}}
                style={{flex:1,padding:"9px",borderRadius:7,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:600,transition:"all .15s",background:tab===t?"white":"transparent",color:tab===t?"var(--text)":"var(--muted)",border:"none",boxShadow:tab===t?"var(--shadow-sm)":"none"}}>
                {t==="login"?"Sign In":"Create Account"}
              </button>
            ))}
          </div>

          {tab==="login" ? (
            <>
              <div style={{marginBottom:26}}>
                <div style={{fontSize:24,fontWeight:800,color:"var(--text)",letterSpacing:"-0.4px"}}>Welcome back</div>
                <div style={{fontSize:13.5,color:"var(--muted)",marginTop:5}}>Sign in to your FinVault account</div>
              </div>

              {error&&<div style={{display:"flex",alignItems:"center",gap:9,padding:"11px 14px",background:"var(--red-bg)",border:"1px solid var(--red-bdr)",borderRadius:9,marginBottom:18,fontSize:13,color:"var(--red)"}}><AlertCircle size={15}/>{error}</div>}
              {success&&<div style={{display:"flex",alignItems:"center",gap:9,padding:"11px 14px",background:"var(--green-bg)",border:"1px solid var(--green-bdr)",borderRadius:9,marginBottom:18,fontSize:13,color:"var(--green)"}}><CheckCircle2 size={15}/>{success}</div>}

              <div style={{marginBottom:15}}>
                <label style={{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text2)",marginBottom:6}}>Email address</label>
                <div className="auth-input-wrap">
                  <Mail size={15} className="auth-icon"/>
                  <input className="ft-input" type="email" placeholder="you@example.com" value={loginForm.email} onChange={e=>setLoginForm({...loginForm,email:e.target.value})} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
                </div>
              </div>

              <div style={{marginBottom:8}}>
                <label style={{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text2)",marginBottom:6}}>Password</label>
                <div className="auth-input-wrap">
                  <Lock size={15} className="auth-icon"/>
                  <input className="ft-input" type={showPass?"text":"password"} placeholder="Enter your password" value={loginForm.password} onChange={e=>setLoginForm({...loginForm,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
                  <button className="eye-btn" onClick={()=>setShowPass(!showPass)}>{showPass?<EyeOff size={15}/>:<Eye size={15}/>}</button>
                </div>
              </div>

              <div style={{display:"flex",justifyContent:"flex-end",marginBottom:22}}>
                <span style={{fontSize:12.5,color:"var(--blue)",fontWeight:600,cursor:"pointer"}}>Forgot password?</span>
              </div>

              <button className="btn-primary" style={{width:"100%",justifyContent:"center",padding:"12px",fontSize:14}} onClick={handleLogin} disabled={loading}>
                {loading?<><RefreshCw size={15} style={{animation:"spin 1s linear infinite"}}/> Signing in…</>:<>Sign In <ChevronRight size={15}/></>}
              </button>

              <div style={{margin:"20px 0",display:"flex",alignItems:"center",gap:12}}>
                <div style={{flex:1,height:1,background:"var(--border)"}}/>
                <span style={{fontSize:12,color:"var(--muted2)"}}>or continue with</span>
                <div style={{flex:1,height:1,background:"var(--border)"}}/>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[
                  {label:"Google",  bg:"#fff", border:"var(--border)", img:"https://www.google.com/favicon.ico"},
                  {label:"Apple",   bg:"#000", border:"#000",          textColor:"white"},
                ].map(o=>(
                  <button key={o.label} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px",background:o.bg,border:`1px solid ${o.border}`,borderRadius:9,cursor:"pointer",fontSize:13,fontWeight:600,color:o.textColor||"var(--text)",transition:"box-shadow .15s",boxShadow:"var(--shadow-xs)"}}
                    onMouseEnter={e=>e.currentTarget.style.boxShadow="var(--shadow-sm)"}
                    onMouseLeave={e=>e.currentTarget.style.boxShadow="var(--shadow-xs)"}>
                    {o.img?<img src={o.img} width={16} height={16} style={{borderRadius:2}} alt=""/>:null}
                    {o.label}
                  </button>
                ))}
              </div>

              <div style={{textAlign:"center",marginTop:24,fontSize:13,color:"var(--muted)"}}>
                Don't have an account?{" "}
                <span style={{color:"var(--blue)",fontWeight:600,cursor:"pointer"}} onClick={()=>setTab("register")}>Create one free</span>
              </div>
            </>
          ) : (
            <>
              <div style={{marginBottom:24}}>
                <div style={{fontSize:24,fontWeight:800,color:"var(--text)",letterSpacing:"-0.4px"}}>Create your account</div>
                <div style={{fontSize:13.5,color:"var(--muted)",marginTop:5}}>Free forever · No credit card required</div>
              </div>

              {error&&<div style={{display:"flex",alignItems:"center",gap:9,padding:"11px 14px",background:"var(--red-bg)",border:"1px solid var(--red-bdr)",borderRadius:9,marginBottom:18,fontSize:13,color:"var(--red)"}}><AlertCircle size={15}/>{error}</div>}

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                <div>
                  <label style={{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text2)",marginBottom:6}}>Full Name *</label>
                  <div className="auth-input-wrap">
                    <User size={14} className="auth-icon"/>
                    <input className="ft-input" placeholder="Arjun Kumar" value={regForm.name} onChange={e=>setRegForm({...regForm,name:e.target.value})}/>
                  </div>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text2)",marginBottom:6}}>Phone</label>
                  <div className="auth-input-wrap">
                    <Phone size={14} className="auth-icon"/>
                    <input className="ft-input" placeholder="+91 9876543210" value={regForm.phone} onChange={e=>setRegForm({...regForm,phone:e.target.value})}/>
                  </div>
                </div>
              </div>

              <div style={{marginBottom:14}}>
                <label style={{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text2)",marginBottom:6}}>Email address *</label>
                <div className="auth-input-wrap">
                  <Mail size={14} className="auth-icon"/>
                  <input className="ft-input" type="email" placeholder="you@example.com" value={regForm.email} onChange={e=>setRegForm({...regForm,email:e.target.value})}/>
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
                <div>
                  <label style={{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text2)",marginBottom:6}}>Password *</label>
                  <div className="auth-input-wrap">
                    <Lock size={14} className="auth-icon"/>
                    <input className="ft-input" type={showPass?"text":"password"} placeholder="Min. 8 characters" value={regForm.password} onChange={e=>setRegForm({...regForm,password:e.target.value})}/>
                    <button className="eye-btn" onClick={()=>setShowPass(!showPass)}>{showPass?<EyeOff size={14}/>:<Eye size={14}/>}</button>
                  </div>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text2)",marginBottom:6}}>Confirm *</label>
                  <div className="auth-input-wrap">
                    <Lock size={14} className="auth-icon"/>
                    <input className="ft-input" type={showPass2?"text":"password"} placeholder="Repeat password" value={regForm.confirm} onChange={e=>setRegForm({...regForm,confirm:e.target.value})}/>
                    <button className="eye-btn" onClick={()=>setShowPass2(!showPass2)}>{showPass2?<EyeOff size={14}/>:<Eye size={14}/>}</button>
                  </div>
                </div>
              </div>

              {/* Password strength */}
              {regForm.password&&(
                <div style={{marginBottom:18}}>
                  <div style={{display:"flex",gap:4,marginBottom:5}}>
                    {[1,2,3,4].map(lvl=>{
                      const strength=regForm.password.length>=12&&/[A-Z]/.test(regForm.password)&&/[0-9]/.test(regForm.password)&&/[^A-Za-z0-9]/.test(regForm.password)?4:regForm.password.length>=10?3:regForm.password.length>=8?2:1;
                      return <div key={lvl} style={{flex:1,height:4,borderRadius:99,background:lvl<=strength?(strength>=4?"var(--green)":strength>=3?"var(--amber)":"var(--red)"):"var(--border)",transition:"background .3s"}}/>;
                    })}
                  </div>
                  <div style={{fontSize:11.5,color:"var(--muted)"}}>Password strength: {regForm.password.length<8?"Weak":regForm.password.length<10?"Fair":regForm.password.length<12?"Good":"Strong"}</div>
                </div>
              )}

              <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:20}}>
                <input type="checkbox" id="terms" style={{marginTop:2,accentColor:"var(--blue)",cursor:"pointer"}}/>
                <label htmlFor="terms" style={{fontSize:12.5,color:"var(--muted)",cursor:"pointer",lineHeight:1.5}}>
                  I agree to the <span style={{color:"var(--blue)",fontWeight:600}}>Terms of Service</span> and <span style={{color:"var(--blue)",fontWeight:600}}>Privacy Policy</span>
                </label>
              </div>

              <button className="btn-primary" style={{width:"100%",justifyContent:"center",padding:"12px",fontSize:14}} onClick={handleRegister} disabled={loading}>
                {loading?<><RefreshCw size={15} style={{animation:"spin 1s linear infinite"}}/> Creating account…</>:<>Create Account <ChevronRight size={15}/></>}
              </button>

              <div style={{textAlign:"center",marginTop:20,fontSize:13,color:"var(--muted)"}}>
                Already have an account?{" "}
                <span style={{color:"var(--blue)",fontWeight:600,cursor:"pointer"}} onClick={()=>setTab("login")}>Sign in</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function FinanceTracker() {
  const [user, setUser] = useState(null);

  if (!user) return (
    <>
      <style dangerouslySetInnerHTML={{__html:G}}/>
      <AuthPage onLogin={setUser}/>
    </>
  );

  return <Dashboard user={user} onLogout={()=>setUser(null)}/>;
}

/* ─────────────────────────────────────────────────────────
   DASHBOARD SHELL
───────────────────────────────────────────────────────── */
function Dashboard({user,onLogout}) {
  const [txnsRaw,    setTxns]    = useLocalStorage("fv4_txns",    generateTransactions);
  const [budgetsRaw, setBudgets] = useLocalStorage("fv4_budgets", BUDGETS_INIT);
  const [goalsRaw,   setGoals]   = useLocalStorage("fv4_goals",   GOALS_INIT);
  const txns    = Array.isArray(txnsRaw)    ? txnsRaw    : generateTransactions();
  const budgets = Array.isArray(budgetsRaw) ? budgetsRaw : BUDGETS_INIT;
  const goals   = Array.isArray(goalsRaw)   ? goalsRaw   : GOALS_INIT;

  const [page,       setPage]    = useState("dashboard");
  const [modal,      setModal]   = useState(null);
  const [search,     setSearch]  = useState("");
  const [catFilter,  setCatFilter]=useState("all");
  const [sortBy,     setSortBy]  = useState("date");
  const [aiQuery,    setAiQuery] = useState("");
  const [aiAnswer,   setAiAnswer]= useState("");
  const [aiLoading,  setAiLoading]=useState(false);
  const [toast,      setToast]   = useState(null);

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3200);};

  const now=new Date();
  const thisMonth=now.toISOString().slice(0,7);
  const lastMonth=new Date(now.getFullYear(),now.getMonth()-1,1).toISOString().slice(0,7);
  const mtTxns   =useMemo(()=>txns.filter(t=>t.date.startsWith(thisMonth)),[txns,thisMonth]);
  const lmTxns   =useMemo(()=>txns.filter(t=>t.date.startsWith(lastMonth)),[txns,lastMonth]);
  const mtIncome =mtTxns.filter(t=>t.type==="credit").reduce((s,t)=>s+t.amount,0);
  const mtExpense=mtTxns.filter(t=>t.type==="debit" ).reduce((s,t)=>s+t.amount,0);
  const lmExpense=lmTxns.filter(t=>t.type==="debit" ).reduce((s,t)=>s+t.amount,0);
  const netWorth =ACCOUNTS.reduce((s,a)=>s+a.balance,0);
  const savings  =mtIncome-mtExpense;

  const catBreakdown=useMemo(()=>{
    const map={};
    mtTxns.filter(t=>t.type==="debit").forEach(t=>{map[t.category]=(map[t.category]||0)+t.amount;});
    return Object.entries(map).sort((a,b)=>b[1]-a[1]);
  },[mtTxns]);

  const weeklyData=useMemo(()=>Array.from({length:4},(_,i)=>{
    const end=new Date();end.setDate(end.getDate()-i*7);
    const start=new Date(end);start.setDate(start.getDate()-6);
    const total=txns.filter(t=>{const td=new Date(t.date);return t.type==="debit"&&td>=start&&td<=end;}).reduce((s,t)=>s+t.amount,0);
    return{label:`Wk ${4-i}`,total};
  }).reverse(),[txns]);

  const filteredTxns=useMemo(()=>{
    let t=[...txns];
    if(search) t=t.filter(tx=>tx.payee.toLowerCase().includes(search.toLowerCase()));
    if(catFilter!=="all") t=t.filter(tx=>tx.category===catFilter);
    if(sortBy==="date")   t.sort((a,b)=>new Date(b.date)-new Date(a.date));
    if(sortBy==="amount") t.sort((a,b)=>b.amount-a.amount);
    if(sortBy==="payee")  t.sort((a,b)=>a.payee.localeCompare(b.payee));
    return t;
  },[txns,search,catFilter,sortBy]);

  const askAI=()=>{
    if(!aiQuery.trim())return;
    setAiLoading(true);setAiAnswer("");
    setTimeout(()=>{
      const q=aiQuery.toLowerCase();let ans="";
      if(q.includes("food")||q.includes("dining"))
        ans=`You've spent ${fmt(catBreakdown.find(c=>c[0]==="food")?.[1]||0)} on Food & Dining this month — ${Math.round((catBreakdown.find(c=>c[0]==="food")?.[1]||0)/mtIncome*100)}% of income. Your food budget is ₹8,000 and you're at 78% utilisation. Consider meal prepping to cut 15–20%.`;
      else if(q.includes("save")||q.includes("saving"))
        ans=`Net savings: ${fmt(savings)} — ${Math.round(savings/mtIncome*100)}% rate. ${savings/mtIncome>0.2?"You're above the 20% target. ":"Below 20% target. Trim Shopping. "}Best goal: ${goals[0]?.name} at ${Math.round((goals[0]?.saved/goals[0]?.target||0)*100)}%.`;
      else if(q.includes("budget"))
        ans=`3 budgets need attention: Shopping 96% (₹200 left), Food 78%, Utilities 78%. Recommend pausing discretionary shopping.`;
      else if(q.includes("net worth"))
        ans=`Net worth: ${fmt(netWorth)} — Bank savings ₹2,10,550 + Investments ₹3,15,000 − Credit ₹23,450.`;
      else
        ans=`Income: ${fmt(mtIncome)} · Expenses: ${fmt(mtExpense)} · Savings: ${fmt(savings)} (${Math.round(savings/mtIncome*100)}%). Spending ${mtExpense>lmExpense?"↑ up":"↓ down"} ${fmt(Math.abs(mtExpense-lmExpense))} vs last month. Top: ${CATEGORIES[catBreakdown[0]?.[0]]?.label||"N/A"}.`;
      setAiAnswer(ans);setAiLoading(false);
    },900);
  };

  const addTxn=form=>{
    const t={id:`txn-${Date.now()}`,date:form.date,payee:form.payee,category:form.category,amount:parseFloat(form.amount),type:form.type,note:form.note||""};
    setTxns([t,...txns]);setModal(null);showToast("Transaction added.");
  };
  const delTxn=id=>{setTxns(txns.filter(t=>t.id!==id));showToast("Transaction deleted.","info");};

  /* ── Shared: Transaction row ── */
  const TxnRow=({t,showDelete=false})=>{
    const Cat=CATEGORIES[t.category];
    return (
      <div className="txn-row">
        <div style={{display:"flex",alignItems:"center",gap:13}}>
          <div style={{width:40,height:40,borderRadius:10,background:Cat?.bg,border:`1px solid ${Cat?.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            {Cat?.Icon && <Cat.Icon size={17} color={Cat.color}/>}
          </div>
          <div>
            <div style={{fontSize:13.5,fontWeight:600,color:"var(--text)"}}>{t.payee}</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:2,display:"flex",alignItems:"center",gap:6}}>
              <Calendar size={11}/>{fmtDate(t.date)}
              <span style={{width:3,height:3,borderRadius:99,background:"var(--muted2)",display:"inline-block"}}/>
              <span className="cat-pill" style={{background:Cat?.bg,color:Cat?.color,borderColor:Cat?.bdr,border:`1px solid ${Cat?.bdr}`}}>
                {Cat?.label}
              </span>
            </div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:14,fontWeight:700,color:t.type==="credit"?"var(--green)":"var(--text)",fontFamily:"'Manrope',sans-serif",display:"flex",alignItems:"center",gap:4}}>
              {t.type==="credit"
                ?<ArrowDownLeft size={14} color="var(--green)"/>
                :<ArrowUpRight size={14} color="var(--red)"/>}
              {t.type==="credit"?"+":"-"}{fmt(t.amount,2)}
            </div>
          </div>
          {showDelete&&<button className="btn-danger" onClick={()=>delTxn(t.id)} style={{padding:"5px 8px"}}><Trash2 size={12}/></button>}
        </div>
      </div>
    );
  };

  /* ══════════════ DASHBOARD ══════════════ */
  const PageDashboard=()=>(
    <div className="page-fade">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,color:"var(--text)",letterSpacing:"-0.3px"}}>Good morning, {user.name.split(" ")[0]} 👋</div>
          <div style={{fontSize:13,color:"var(--muted)",marginTop:3}}>{now.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
        </div>
        <button className="btn-primary" onClick={()=>setModal({type:"addTxn"})}><Plus size={15}/>Add Transaction</button>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:22}}>
        {[
          {label:"Net Worth",      value:fmt(netWorth),  sub:"All accounts combined",Icon:Wallet,     color:"var(--blue)",   bg:"var(--blue-bg)"},
          {label:"Monthly Income", value:fmt(mtIncome),  sub:"Credited this month",  Icon:TrendingUp,  color:"var(--green)",  bg:"var(--green-bg)"},
          {label:"Monthly Spent",  value:fmt(mtExpense), sub:`${mtExpense>lmExpense?"↑":"↓"} ${fmt(Math.abs(mtExpense-lmExpense))} vs last month`,Icon:TrendingDown,color:"var(--red)",bg:"var(--red-bg)"},
          {label:"Net Savings",    value:fmt(savings),   sub:`${Math.round(savings/mtIncome*100)}% savings rate`,Icon:PiggyBank,  color:"var(--purple)",bg:"var(--purple-bg)"},
        ].map((c,i)=>(
          <div key={i} className="stat-card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:600,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.5px"}}>{c.label}</div>
              <div style={{width:34,height:34,borderRadius:9,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <c.Icon size={16} color={c.color}/>
              </div>
            </div>
            <div style={{fontSize:24,fontWeight:800,color:"var(--text)",fontFamily:"'Manrope',sans-serif",letterSpacing:"-0.5px",marginBottom:5}}>{c.value}</div>
            <div style={{fontSize:12,color:"var(--muted)"}}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1.1fr",gap:16,marginBottom:18}}>

        {/* Spending donut */}
        <div className="card" style={{padding:22}}>
          <div style={{fontSize:15,fontWeight:700,marginBottom:18,display:"flex",alignItems:"center",gap:8}}><PieChart size={16} color="var(--blue)"/>Spending Breakdown</div>
          <div style={{display:"flex",alignItems:"center",gap:18}}>
            <DonutChart data={catBreakdown}/>
            <div style={{flex:1}}>
              {catBreakdown.slice(0,6).map(([cat,val])=>{
                const C=CATEGORIES[cat];
                return (
                  <div key={cat} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <div style={{width:7,height:7,borderRadius:99,background:C?.color,flexShrink:0}}/>
                      <span style={{fontSize:12.5,color:"var(--text2)"}}>{C?.label}</span>
                    </div>
                    <span style={{fontSize:12.5,fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>{fmt(val)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Weekly bar */}
        <div className="card" style={{padding:22}}>
          <div style={{fontSize:15,fontWeight:700,marginBottom:16,display:"flex",alignItems:"center",gap:8}}><BarChart2 size={16} color="var(--blue)"/>Weekly Spend</div>
          <BarChart data={weeklyData}/>
          <div style={{marginTop:14,padding:"10px 14px",background:"var(--blue-bg)",borderRadius:9,border:"1px solid var(--blue-bdr)",display:"flex",alignItems:"center",gap:10}}>
            <BarChart2 size={14} color="var(--blue)"/>
            <div>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:1}}>4-week average</div>
              <div style={{fontSize:16,fontWeight:800,fontFamily:"'Manrope',sans-serif",color:"var(--text)"}}>{fmt(weeklyData.reduce((s,w)=>s+w.total,0)/4)}</div>
            </div>
          </div>
        </div>

        {/* Accounts */}
        <div className="card" style={{padding:22}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontSize:15,fontWeight:700,display:"flex",alignItems:"center",gap:8}}><CreditCard size={16} color="var(--blue)"/>Accounts</div>
            <button className="btn-ghost" style={{fontSize:12}} onClick={()=>setPage("transactions")}>Manage <ChevronRight size={12}/></button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {ACCOUNTS.map(a=>(
              <div key={a.id} className="acct-row">
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:36,height:36,borderRadius:9,background:a.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${a.color}20`}}>
                    <a.Icon size={16} color={a.color}/>
                  </div>
                  <div>
                    <div style={{fontSize:12.5,fontWeight:600,color:"var(--text)"}}>{a.name}</div>
                    <div style={{fontSize:11,color:"var(--muted)",display:"flex",alignItems:"center",gap:4}}><CreditCard size={9}/> •••• {a.last4} · {a.type}</div>
                  </div>
                </div>
                <div style={{fontSize:14,fontWeight:800,fontFamily:"'Manrope',sans-serif",color:a.balance<0?"var(--red)":"var(--text)"}}>{a.balance<0?"-":""}{fmt(Math.abs(a.balance))}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:18}}>
        {/* Budgets */}
        <div className="card" style={{padding:22}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <div style={{fontSize:15,fontWeight:700,display:"flex",alignItems:"center",gap:8}}><Filter size={15} color="var(--blue)"/>Monthly Budgets</div>
            <button className="btn-secondary" style={{fontSize:12,padding:"5px 12px"}} onClick={()=>setPage("budgets")}>Manage</button>
          </div>
          {budgets.map(b=>{
            const pct=clamp(b.spent/b.limit*100,0,100);
            const barColor=pct>90?"var(--red)":pct>70?"var(--amber)":"var(--blue)";
            const C=CATEGORIES[b.category];
            return (
              <div key={b.category} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,alignItems:"center"}}>
                  <span style={{fontSize:13,fontWeight:500,color:"var(--text2)",display:"flex",alignItems:"center",gap:6}}>
                    {C?.Icon && <C.Icon size={13} color={C.color}/>}{C?.label}
                  </span>
                  <span style={{fontSize:12,color:"var(--muted)",fontFamily:"'Manrope',sans-serif"}}>{fmt(b.spent)} <span style={{color:"var(--muted2)"}}>/ {fmt(b.limit)}</span></span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:9}}>
                  <div className="progress-track" style={{flex:1}}>
                    <div className="progress-fill" style={{width:`${pct}%`,background:barColor}}/>
                  </div>
                  <span style={{fontSize:11.5,fontWeight:700,color:barColor,minWidth:32,textAlign:"right"}}>{Math.round(pct)}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Goals */}
        <div className="card" style={{padding:22}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <div style={{fontSize:15,fontWeight:700,display:"flex",alignItems:"center",gap:8}}><Target size={15} color="var(--blue)"/>Financial Goals</div>
            <button className="btn-secondary" style={{fontSize:12,padding:"5px 12px"}} onClick={()=>setPage("goals")}>View all</button>
          </div>
          {goals.map(g=>{
            const pct=clamp(g.saved/g.target*100,0,100);
            return (
              <div key={g.id} style={{marginBottom:15,paddingBottom:15,borderBottom:"1px solid var(--border)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:7,alignItems:"center"}}>
                  <span style={{fontSize:13.5,fontWeight:600,display:"flex",alignItems:"center",gap:7}}>
                    <div style={{width:26,height:26,borderRadius:7,background:`${g.color}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <g.Icon size={13} color={g.color}/>
                    </div>
                    {g.name}
                  </span>
                  <span style={{fontSize:12.5,fontWeight:700,color:g.color,fontFamily:"'Manrope',sans-serif"}}>{Math.round(pct)}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{width:`${pct}%`,background:g.color}}/>
                </div>
                <div style={{fontSize:11.5,color:"var(--muted)",marginTop:5,display:"flex",justifyContent:"space-between"}}>
                  <span>{fmt(g.saved)} saved</span><span>Target: {fmt(g.target)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI */}
      <div className="card" style={{padding:22,marginBottom:18,background:"linear-gradient(135deg,#f0f7ff,#f5f3ff)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <div style={{width:42,height:42,borderRadius:10,background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Sparkles size={19} color="white"/>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700}}>AI Finance Assistant</div>
            <div style={{fontSize:12.5,color:"var(--muted)"}}>Ask anything about your money in plain English</div>
          </div>
          {aiLoading&&<div style={{marginLeft:"auto",display:"flex",gap:3}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:99,background:"var(--blue)",animation:`pulse 1.2s ${i*0.2}s ease infinite`}}/>)}</div>}
        </div>
        <div style={{display:"flex",gap:10,marginBottom:12}}>
          <div style={{position:"relative",flex:1}}>
            <Search size={14} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--muted2)"}}/>
            <input className="ft-input" style={{paddingLeft:34,background:"white"}} placeholder='Try "How much did I spend on food?" or "What is my savings rate?"'
              value={aiQuery} onChange={e=>setAiQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&askAI()}/>
          </div>
          <button className="btn-primary" onClick={askAI} disabled={aiLoading}><Sparkles size={14}/>Ask AI</button>
        </div>
        {aiAnswer&&(
          <div style={{padding:"14px 18px",background:"white",borderRadius:9,border:"1px solid var(--blue-bdr)",fontSize:13.5,lineHeight:1.7,color:"var(--text2)"}}>
            <span style={{color:"var(--blue)",fontWeight:700,marginRight:6,display:"inline-flex",alignItems:"center",gap:4}}><BadgeCheck size={14}/>AI Answer:</span>{aiAnswer}
          </div>
        )}
        <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
          {["What's my net worth?","Show budget status","Biggest expense this month","How can I save more?"].map(q=>(
            <button key={q} className="btn-secondary" style={{fontSize:12,padding:"5px 12px",borderRadius:99}} onClick={()=>{setAiQuery(q);setTimeout(askAI,50);}}>{q}</button>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card" style={{overflow:"hidden"}}>
        <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid var(--border)"}}>
          <div style={{fontSize:15,fontWeight:700,display:"flex",alignItems:"center",gap:8}}><ArrowLeftRight size={15} color="var(--blue)"/>Recent Transactions</div>
          <button className="btn-secondary" style={{fontSize:12,padding:"5px 12px"}} onClick={()=>setPage("transactions")}>View all <ChevronRight size={13}/></button>
        </div>
        <div className="tbl-head"><span>Transaction</span><span>Amount</span></div>
        {txns.slice(0,8).map(t=><TxnRow key={t.id} t={t}/>)}
      </div>
    </div>
  );

  /* ══════════════ TRANSACTIONS ══════════════ */
  const PageTransactions=()=>(
    <div className="page-fade">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.3px"}}>Transactions</div>
          <div style={{fontSize:13,color:"var(--muted)",marginTop:3}}>{filteredTxns.length} records</div>
        </div>
        <button className="btn-primary" onClick={()=>setModal({type:"addTxn"})}><Plus size={15}/>Add Transaction</button>
      </div>
      <div className="card" style={{padding:16,marginBottom:16}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <div style={{position:"relative",flex:1,minWidth:200}}>
            <Search size={14} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--muted2)"}}/>
            <input className="ft-input" style={{paddingLeft:34}} placeholder="Search payee…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select className="ft-select" value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {Object.entries(CATEGORIES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
          </select>
          <select className="ft-select" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
            <option value="date">Newest first</option>
            <option value="amount">Highest amount</option>
            <option value="payee">Payee A–Z</option>
          </select>
        </div>
      </div>
      <div className="card" style={{overflow:"hidden"}}>
        <div className="tbl-head"><span>Transaction Details</span><span>Amount</span></div>
        {filteredTxns.slice(0,60).map(t=><TxnRow key={t.id} t={t} showDelete/>)}
        {filteredTxns.length===0&&(
          <div style={{padding:"48px 20px",textAlign:"center"}}>
            <Search size={36} color="var(--border2)" style={{margin:"0 auto 12px"}}/>
            <div style={{fontSize:15,fontWeight:600,color:"var(--text2)"}}>No transactions found</div>
            <div style={{fontSize:13,color:"var(--muted)",marginTop:4}}>Try adjusting your search or filters</div>
          </div>
        )}
      </div>
    </div>
  );

  /* ══════════════ BUDGETS ══════════════ */
  const PageBudgets=()=>{
    const [lb,setLb]=useState(budgets);
    return (
      <div className="page-fade">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <div>
            <div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.3px"}}>Budget Manager</div>
            <div style={{fontSize:13,color:"var(--muted)",marginTop:3}}>Set and track your monthly spending limits</div>
          </div>
          <button className="btn-primary" onClick={()=>{setBudgets(lb);showToast("Budgets saved.");}}>
            <CheckCircle2 size={15}/>Save Changes
          </button>
        </div>
        {/* Summary */}
        <div className="card" style={{padding:18,marginBottom:20,background:"var(--blue-bg)",border:"1px solid var(--blue-bdr)"}}>
          <div style={{display:"flex",gap:0,flexWrap:"wrap"}}>
            {[
              {label:"Total Budget",   val:fmt(lb.reduce((s,b)=>s+b.limit,0)), Icon:DollarSign},
              {label:"Total Spent",    val:fmt(lb.reduce((s,b)=>s+b.spent,0)), Icon:TrendingDown},
              {label:"Remaining",      val:fmt(lb.reduce((s,b)=>s+Math.max(0,b.limit-b.spent),0)), Icon:PiggyBank},
              {label:"Over Budget",    val:`${lb.filter(b=>b.spent>b.limit).length} categories`, Icon:AlertCircle},
            ].map((s,i)=>(
              <div key={s.label} style={{flex:1,minWidth:120,padding:"4px 20px",borderRight:i<3?"1px solid var(--blue-bdr)":"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--muted)",fontWeight:500,marginBottom:4}}>
                  <s.Icon size={12} color="var(--blue)"/>{s.label}
                </div>
                <div style={{fontSize:18,fontWeight:800,fontFamily:"'Manrope',sans-serif",color:"var(--text)"}}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
          {lb.map((b,i)=>{
            const pct=clamp(b.spent/b.limit*100,0,100);
            const barColor=pct>90?"var(--red)":pct>70?"var(--amber)":"var(--blue)";
            const statusLabel=pct>90?"Over budget":pct>70?"Nearing limit":"On track";
            const statusBg=pct>90?"var(--red-bg)":pct>70?"var(--amber-bg)":"var(--green-bg)";
            const statusColor=pct>90?"var(--red)":pct>70?"var(--amber)":"var(--green)";
            const C=CATEGORIES[b.category];
            return (
              <div key={b.category} className="card" style={{padding:22}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:11}}>
                    <div style={{width:42,height:42,borderRadius:10,background:C?.bg,border:`1px solid ${C?.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {C?.Icon && <C.Icon size={18} color={C.color}/>}
                    </div>
                    <div>
                      <div style={{fontSize:14.5,fontWeight:700}}>{C?.label}</div>
                      <span style={{background:statusBg,color:statusColor,borderRadius:99,padding:"2px 9px",fontSize:11,fontWeight:600}}>{statusLabel}</span>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:20,fontWeight:800,fontFamily:"'Manrope',sans-serif",color:barColor}}>{Math.round(pct)}%</div>
                    <div style={{fontSize:11,color:"var(--muted)"}}>utilised</div>
                  </div>
                </div>
                <div className="progress-track" style={{height:8,marginBottom:12}}>
                  <div className="progress-fill" style={{width:`${pct}%`,background:barColor,height:"100%"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:14}}>
                  <span>Spent: <strong style={{fontFamily:"'Manrope',sans-serif"}}>{fmt(b.spent)}</strong></span>
                  <span style={{color:"var(--muted)"}}>Left: <strong style={{color:barColor,fontFamily:"'Manrope',sans-serif"}}>{fmt(Math.max(0,b.limit-b.spent))}</strong></span>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12,color:"var(--muted)",marginBottom:6,fontWeight:500}}>Monthly Limit (₹)</label>
                  <input className="ft-input" type="number" value={b.limit} onChange={e=>{const u=[...lb];u[i]={...b,limit:parseFloat(e.target.value)||0};setLb(u);}}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ══════════════ GOALS ══════════════ */
  const PageGoals=()=>{
    const [lg,setLg]=useState(goals);
    return (
      <div className="page-fade">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <div>
            <div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.3px"}}>Financial Goals</div>
            <div style={{fontSize:13,color:"var(--muted)",marginTop:3}}>Track progress towards your savings targets</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn-secondary" onClick={()=>setModal({type:"addGoal"})}><Plus size={15}/>New Goal</button>
            <button className="btn-primary" onClick={()=>{setGoals(lg);showToast("Goals saved.");}}>
              <CheckCircle2 size={15}/>Save
            </button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
          {lg.map((g,i)=>{
            const pct=clamp(g.saved/g.target*100,0,100);
            const daysLeft=Math.ceil((new Date(g.deadline)-new Date())/86400000);
            const monthly=g.target-g.saved>0&&daysLeft>0?(g.target-g.saved)/(daysLeft/30):0;
            return (
              <div key={g.id} className="card" style={{padding:24,borderTop:`3px solid ${g.color}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:48,height:48,borderRadius:12,background:`${g.color}12`,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${g.color}25`}}>
                      <g.Icon size={22} color={g.color}/>
                    </div>
                    <div>
                      <div style={{fontSize:16,fontWeight:700}}>{g.name}</div>
                      <div style={{fontSize:12,color:"var(--muted)",marginTop:2,display:"flex",alignItems:"center",gap:5}}>
                        <Calendar size={11}/>{daysLeft>0?`${daysLeft} days left`:"Past deadline"} · {fmtDate(g.deadline)}
                      </div>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:26,fontWeight:900,color:g.color,fontFamily:"'Manrope',sans-serif",lineHeight:1}}>{Math.round(pct)}%</div>
                    <div style={{fontSize:11,color:"var(--muted)"}}>complete</div>
                  </div>
                </div>
                <div className="progress-track" style={{height:10,marginBottom:10}}>
                  <div className="progress-fill" style={{width:`${pct}%`,background:g.color,height:"100%"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:14}}>
                  <span>Saved: <strong style={{color:g.color,fontFamily:"'Manrope',sans-serif"}}>{fmt(g.saved)}</strong></span>
                  <span style={{color:"var(--muted)"}}>Target: <strong style={{fontFamily:"'Manrope',sans-serif"}}>{fmt(g.target)}</strong></span>
                </div>
                {monthly>0&&(
                  <div style={{padding:"10px 14px",borderRadius:9,background:`${g.color}10`,border:`1px solid ${g.color}20`,fontSize:13,marginBottom:14,color:"var(--text2)",display:"flex",alignItems:"center",gap:8}}>
                    <Info size={14} color={g.color}/> Save <strong style={{color:g.color,fontFamily:"'Manrope',sans-serif",margin:"0 2px"}}>{fmt(monthly)}/month</strong> to reach this goal on time
                  </div>
                )}
                <div style={{display:"flex",gap:8}}>
                  <input className="ft-input" type="number" placeholder="Add amount (press Enter)…" style={{flex:1}}
                    onKeyDown={e=>{
                      if(e.key==="Enter"){const amt=parseFloat(e.target.value);if(!amt)return;
                        const u=[...lg];u[i]={...g,saved:Math.min(g.saved+amt,g.target)};setLg(u);e.target.value="";
                        showToast(`Added ${fmt(amt)} to "${g.name}".`);
                      }
                    }}/>
                  <button className="btn-danger" onClick={()=>{const u=lg.filter(x=>x.id!==g.id);setLg(u);setGoals(u);showToast("Goal removed.","info");}}>
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>
            );
          })}
          {/* Add card */}
          <div className="card" style={{padding:24,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:180,border:"2px dashed var(--border2)",boxShadow:"none",cursor:"pointer",background:"var(--bg)",transition:"border-color .2s,background .2s"}}
            onClick={()=>setModal({type:"addGoal"})}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--blue)";e.currentTarget.style.background="var(--blue-bg)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.background="var(--bg)";}}>
            <div style={{width:46,height:46,borderRadius:12,background:"var(--blue-bg)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
              <Plus size={22} color="var(--blue)"/>
            </div>
            <div style={{fontSize:14,fontWeight:600,color:"var(--text2)"}}>Add a new goal</div>
            <div style={{fontSize:12.5,color:"var(--muted)",marginTop:4}}>Track a new savings target</div>
          </div>
        </div>
      </div>
    );
  };

  /* ══════════════ ANALYTICS ══════════════ */
  const PageAnalytics=()=>{
    const monthlyData=useMemo(()=>{
      const map={};
      txns.forEach(t=>{const mo=t.date.slice(0,7);if(!map[mo])map[mo]={income:0,expense:0};if(t.type==="credit")map[mo].income+=t.amount;else map[mo].expense+=t.amount;});
      return Object.entries(map).sort().slice(-3).map(([mo,v])=>({mo,...v,savings:v.income-v.expense}));
    },[]);
    const topPayees=useMemo(()=>{
      const map={};txns.filter(t=>t.type==="debit").forEach(t=>{map[t.payee]=(map[t.payee]||0)+t.amount;});
      return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,8);
    },[]);
    return (
      <div className="page-fade">
        <div style={{marginBottom:22}}>
          <div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.3px"}}>Analytics</div>
          <div style={{fontSize:13,color:"var(--muted)",marginTop:3}}>Understand your spending patterns and trends</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:18}}>
          {monthlyData.map((d,i)=>(
            <div key={d.mo} className="card" style={{padding:22}}>
              <div style={{fontSize:12.5,fontWeight:600,color:"var(--muted)",marginBottom:16,textTransform:"uppercase",letterSpacing:"0.4px"}}>
                {new Date(d.mo+"-01").toLocaleDateString("en-IN",{month:"long",year:"numeric"})}
              </div>
              {[{l:"Income",v:d.income,c:"var(--green)",Icon:TrendingUp},{l:"Expenses",v:d.expense,c:"var(--red)",Icon:TrendingDown},{l:"Saved",v:d.savings,c:d.savings>0?"var(--blue)":"var(--red)",Icon:PiggyBank}].map(r=>(
                <div key={r.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                  <span style={{fontSize:13,color:"var(--muted)",display:"flex",alignItems:"center",gap:6}}><r.Icon size={13} color={r.c}/>{r.l}</span>
                  <span style={{fontSize:13.5,fontWeight:700,color:r.c,fontFamily:"'Manrope',sans-serif"}}>{fmt(r.v)}</span>
                </div>
              ))}
              <div style={{marginTop:14}}>
                <div style={{fontSize:11.5,color:"var(--muted)",marginBottom:5}}>Savings rate</div>
                <div className="progress-track">
                  <div className="progress-fill" style={{width:`${clamp(d.savings/d.income*100,0,100)}%`,background:d.savings>0?"var(--blue)":"var(--red)"}}/>
                </div>
                <div style={{fontSize:12,fontWeight:700,color:"var(--blue)",marginTop:4}}>{Math.round(d.savings/d.income*100)}%</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:18}}>
          <div className="card" style={{padding:22}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:16,display:"flex",alignItems:"center",gap:8}}><BarChart2 size={15} color="var(--blue)"/>Top Merchants</div>
            {topPayees.map(([p,v],i)=>(
              <div key={p} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:24,height:24,borderRadius:7,background:"var(--bg2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"var(--muted)",flexShrink:0}}>#{i+1}</div>
                  <span style={{fontSize:13,color:"var(--text2)"}}>{p}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div className="progress-track" style={{width:80}}><div className="progress-fill" style={{width:`${(v/topPayees[0][1])*100}%`,background:"var(--blue)"}}/></div>
                  <span style={{fontSize:12.5,fontWeight:700,minWidth:80,textAlign:"right",fontFamily:"'Manrope',sans-serif"}}>{fmt(v)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{padding:22}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:16,display:"flex",alignItems:"center",gap:8}}><PieChart size={15} color="var(--blue)"/>Category Split</div>
            {catBreakdown.map(([cat,val])=>{
              const C=CATEGORIES[cat];
              return (
                <div key={cat} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    {C?.Icon && <C.Icon size={14} color={C.color}/>}
                    <span style={{fontSize:13,color:"var(--text2)"}}>{C?.label}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div className="progress-track" style={{width:80}}><div className="progress-fill" style={{width:`${(val/catBreakdown[0][1])*100}%`,background:C?.color}}/></div>
                    <span style={{fontSize:12.5,fontWeight:700,minWidth:80,textAlign:"right",fontFamily:"'Manrope',sans-serif"}}>{fmt(val)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card" style={{padding:22}}>
          <div style={{fontSize:15,fontWeight:700,marginBottom:18,display:"flex",alignItems:"center",gap:8}}><Sparkles size={15} color="var(--blue)"/>Smart Insights</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {[
              {Icon:TrendingDown, title:"Highest spend category",desc:`${CATEGORIES[catBreakdown[0]?.[0]]?.label||"N/A"} — ${fmt(catBreakdown[0]?.[1]||0)}`,bg:"#fff7ed",bdr:"#fed7aa",color:"#ea580c"},
              {Icon:PiggyBank,    title:"Savings rate this month",desc:`${Math.round(savings/mtIncome*100)}% — ${savings/mtIncome>0.2?"Above 20% target ✓":"Below 20% target"}`,bg:"#f0fdf4",bdr:"#bbf7d0",color:"#16a34a"},
              {Icon:AlertCircle,  title:"Budgets near limit",desc:`${budgets.filter(b=>b.spent/b.limit>0.9).length} categories above 90%`,bg:"#fffbeb",bdr:"#fde68a",color:"#d97706"},
              {Icon:BarChart2,    title:"Weekend spending",desc:"35–42% higher than weekdays",bg:"#f5f3ff",bdr:"#ddd6fe",color:"#7c3aed"},
              {Icon:CreditCard,   title:"Average transaction",desc:`${fmt(mtExpense/(mtTxns.filter(t=>t.type==="debit").length||1),0)} per transaction`,bg:"#eff6ff",bdr:"#bfdbfe",color:"#2563eb"},
              {Icon:Target,       title:"Best-progressed goal",desc:goals.length?`${goals.reduce((a,b)=>b.saved/b.target>a.saved/a.target?b:a,goals[0])?.name} (${Math.round(goals.reduce((a,b)=>b.saved/b.target>a.saved/a.target?b:a,goals[0])?.saved/goals.reduce((a,b)=>b.saved/b.target>a.saved/a.target?b:a,goals[0])?.target*100)}%)`:"No goals",bg:"#f0fdf4",bdr:"#bbf7d0",color:"#16a34a"},
            ].map((item,i)=>(
              <div key={i} className="insight-card" style={{background:item.bg,borderColor:item.bdr}}>
                <div style={{width:34,height:34,borderRadius:9,background:"white",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10,boxShadow:"var(--shadow-xs)"}}>
                  <item.Icon size={16} color={item.color}/>
                </div>
                <div style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.6px",fontWeight:600,marginBottom:5}}>{item.title}</div>
                <div style={{fontSize:13.5,fontWeight:700,color:item.color,lineHeight:1.4}}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ══════════════ MODAL ══════════════ */
  const Modal=()=>{
    const [form,setForm]=useState({type:"debit",date:new Date().toISOString().slice(0,10),payee:"",category:"food",amount:"",note:""});
    const [gf,setGf]=useState({name:"",target:"",saved:"",deadline:""});
    if(!modal)return null;
    return (
      <div className="modal-backdrop" style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.45)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:20}}
        onClick={e=>e.target===e.currentTarget&&setModal(null)}>
        <div className="modal-box card" style={{width:480,maxHeight:"90vh",overflowY:"auto",padding:0,boxShadow:"var(--shadow-lg)"}}>
          <div style={{padding:"18px 22px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:16,fontWeight:700,display:"flex",alignItems:"center",gap:8}}>
              {modal.type==="addTxn"?<><ArrowLeftRight size={16} color="var(--blue)"/>Add Transaction</>:<><Target size={16} color="var(--blue)"/>New Financial Goal</>}
            </div>
            <button onClick={()=>setModal(null)} style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:7,cursor:"pointer",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--muted)"}}>
              <X size={15}/>
            </button>
          </div>
          <div style={{padding:22}}>
            {modal.type==="addTxn"&&(
              <>
                <div style={{display:"flex",gap:8,marginBottom:20,background:"var(--bg)",borderRadius:9,padding:4}}>
                  {["debit","credit"].map(t=>(
                    <button key={t} onClick={()=>setForm({...form,type:t})}
                      style={{flex:1,padding:"9px",borderRadius:7,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:600,transition:"all .15s",
                        background:form.type===t?"white":"transparent",
                        color:form.type===t?(t==="debit"?"var(--red)":"var(--green)"):"var(--muted)",
                        border:"none",boxShadow:form.type===t?"var(--shadow-sm)":"none",
                        display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                      {t==="debit"?<><ArrowUpRight size={14}/>Expense</>:<><ArrowDownLeft size={14}/>Income</>}
                    </button>
                  ))}
                </div>
                {[["Date","date","date",""],["Payee / Description","payee","text","e.g. Zomato, Rent, Salary"],["Amount (₹)","amount","number","0.00"],["Note (optional)","note","text","Add a note…"]].map(([l,f,t,p])=>(
                  <div key={f} style={{marginBottom:14}}>
                    <label style={{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text2)",marginBottom:6}}>{l}</label>
                    <input className="ft-input" type={t} placeholder={p} value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})}/>
                  </div>
                ))}
                <div style={{marginBottom:20}}>
                  <label style={{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text2)",marginBottom:6}}>Category</label>
                  <select className="ft-select" style={{width:"100%"}} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                    {Object.entries(CATEGORIES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <button className="btn-primary" style={{width:"100%",justifyContent:"center",padding:"11px",fontSize:14}}
                  onClick={()=>{if(!form.payee||!form.amount||!form.date)return showToast("Please fill all required fields.","error");addTxn(form);}}>
                  <Plus size={15}/>Add Transaction
                </button>
              </>
            )}
            {modal.type==="addGoal"&&(
              <>
                {[["Goal Name","name","text","e.g. Emergency Fund, Vacation"],["Target Amount (₹)","target","number","e.g. 100000"],["Already Saved (₹)","saved","number","0"],["Target Deadline","deadline","date",""]].map(([l,f,t,p])=>(
                  <div key={f} style={{marginBottom:14}}>
                    <label style={{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text2)",marginBottom:6}}>{l}</label>
                    <input className="ft-input" type={t} placeholder={p} value={gf[f]} onChange={e=>setGf({...gf,[f]:e.target.value})}/>
                  </div>
                ))}
                <button className="btn-primary" style={{width:"100%",justifyContent:"center",padding:"11px",fontSize:14}}
                  onClick={()=>{if(!gf.name||!gf.target)return showToast("Goal name and target are required.","error");
                    const ng={id:`g-${Date.now()}`,name:gf.name,target:parseFloat(gf.target),saved:parseFloat(gf.saved)||0,Icon:Target,deadline:gf.deadline||"2026-12-31",color:["#2563eb","#16a34a","#7c3aed","#d97706"][goals.length%4]};
                    setGoals([...goals,ng]);setModal(null);showToast("New goal created.");}}>
                  <Target size={15}/>Create Goal
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ── Sidebar nav ── */
  const navItems=[
    {id:"dashboard",   label:"Dashboard",   Icon:LayoutDashboard},
    {id:"transactions",label:"Transactions",Icon:ArrowLeftRight  },
    {id:"budgets",     label:"Budgets",     Icon:PieChart        },
    {id:"goals",       label:"Goals",       Icon:Target          },
    {id:"analytics",   label:"Analytics",   Icon:BarChart2       },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:G}}/>
      <div style={{display:"flex",minHeight:"100vh",background:"var(--bg)"}}>

        {/* SIDEBAR */}
        <aside style={{width:236,flexShrink:0,height:"100vh",position:"sticky",top:0,background:"var(--white)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",boxShadow:"var(--shadow-sm)"}}>
          {/* Logo */}
          <div style={{padding:"18px 20px 14px",borderBottom:"1px solid var(--border)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:9,background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Wallet size={18} color="white"/>
              </div>
              <div>
                <div style={{fontSize:16,fontWeight:800,color:"var(--text)",letterSpacing:"-0.3px"}}>FinVault</div>
                <div style={{fontSize:10.5,color:"var(--muted)",fontWeight:500,letterSpacing:"0.4px"}}>Personal Finance</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div style={{padding:"10px 8px",flex:1}}>
            <div style={{fontSize:10,fontWeight:700,color:"var(--muted2)",textTransform:"uppercase",letterSpacing:"0.9px",padding:"4px 10px 8px"}}>Main Menu</div>
            {navItems.map(n=>(
              <div key={n.id} className={`nav-item${page===n.id?" active":""}`} onClick={()=>setPage(n.id)}>
                <div className="nav-icon"><n.Icon size={15}/></div>
                {n.label}
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div style={{padding:"12px 16px",borderTop:"1px solid var(--border)"}}>
            <button className="btn-primary" style={{width:"100%",justifyContent:"center",marginBottom:12}} onClick={()=>setModal({type:"addTxn"})}>
              <Plus size={15}/>Add Transaction
            </button>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:9,background:"var(--bg)",border:"1px solid var(--border)"}}>
              <div style={{width:32,height:32,borderRadius:99,background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"white",flexShrink:0}}>
                {user.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12.5,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>Premium Plan</div>
              </div>
              <button style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)",display:"flex",padding:2}} title="Sign out" onClick={onLogout}>
                <LogOut size={14}/>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{flex:1,padding:"28px 32px",overflowY:"auto"}}>
          {page==="dashboard"    && <PageDashboard/>}
          {page==="transactions" && <PageTransactions/>}
          {page==="budgets"      && <PageBudgets/>}
          {page==="goals"        && <PageGoals/>}
          {page==="analytics"    && <PageAnalytics/>}
        </main>
      </div>

      <Modal/>

      {toast&&(
        <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",
          background:toast.type==="error"?"var(--red)":toast.type==="info"?"#1f2937":"var(--green)",
          color:"white",padding:"11px 20px",borderRadius:10,fontWeight:600,fontSize:13,
          zIndex:9999,boxShadow:"var(--shadow-lg)",animation:"tslide .3s ease",
          display:"flex",alignItems:"center",gap:8,whiteSpace:"nowrap"}}>
          {toast.type==="error"?<AlertCircle size={15}/>:toast.type==="info"?<Info size={15}/>:<CheckCircle2 size={15}/>}
          {toast.msg}
        </div>
      )}
    </>
  );
}