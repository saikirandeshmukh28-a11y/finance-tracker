import { useState, useEffect, useCallback, useMemo } from "react";
import {
  LayoutDashboard, ArrowLeftRight, PieChart, Target, BarChart2,
  TrendingUp, TrendingDown, Wallet, CreditCard, Building2, LineChart,
  ShoppingBag, Utensils, Car, Home, Heart, Zap, Film, PiggyBank,
  MoreHorizontal, Plus, Search, ChevronRight, LogOut, Menu,
  Eye, EyeOff, Mail, Lock, User, Phone, Calendar,
  ArrowUpRight, ArrowDownLeft, Trash2, CheckCircle2, AlertCircle,
  Info, X, Sparkles, Shield, BadgeCheck, RefreshCw, Filter,
  DollarSign, BookOpen, Award
} from "lucide-react";
import { loginUser, registerUser, getTransactions, createTransaction,
  deleteTransaction, getBudgets, createBudget, updateBudget,
  getGoals, createGoal, updateGoal, deleteGoal, depositGoal,
  getAccounts, getWeekly, getCategories } from "./api";

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
    --shadow-xs:0 1px 2px rgba(0,0,0,0.05);
    --shadow-sm:0 1px 3px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04);
    --shadow:0 4px 6px -1px rgba(0,0,0,0.07),0 2px 4px -1px rgba(0,0,0,0.04);
    --shadow-md:0 10px 15px -3px rgba(0,0,0,0.07),0 4px 6px -2px rgba(0,0,0,0.04);
    --shadow-lg:0 20px 25px -5px rgba(0,0,0,0.09),0 10px 10px -5px rgba(0,0,0,0.03);
    --r:10px; --r-sm:7px;
  }
  body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased;}
  ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:99px}
  .card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);box-shadow:var(--shadow-sm);}
  .stat-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:18px 20px;box-shadow:var(--shadow-sm);transition:box-shadow .2s,transform .2s;cursor:default;}
  .stat-card:hover{box-shadow:var(--shadow-md);transform:translateY(-1px);}
  .nav-item{display:flex;align-items:center;gap:9px;padding:9px 12px;margin:1px 6px;border-radius:var(--r-sm);cursor:pointer;font-size:13.5px;font-weight:500;color:var(--muted);transition:background .15s,color .15s;user-select:none;border:1px solid transparent;}
  .nav-item:hover{background:var(--bg);color:var(--text2);}
  .nav-item.active{background:var(--blue-bg);color:var(--blue);font-weight:600;border-color:var(--blue-bdr);}
  .nav-icon{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;background:var(--bg);flex-shrink:0;}
  .nav-item.active .nav-icon{background:rgba(37,99,235,0.1);}
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
  .ft-input{background:var(--white);border:1px solid var(--border);border-radius:var(--r-sm);color:var(--text);padding:10px 12px;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;outline:none;width:100%;transition:border-color .15s,box-shadow .15s;box-shadow:var(--shadow-xs);}
  .ft-input:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,0.1);}
  .ft-input::placeholder{color:var(--muted2);}
  .ft-select{background:var(--white);border:1px solid var(--border);border-radius:var(--r-sm);color:var(--text);padding:10px 12px;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;outline:none;cursor:pointer;transition:border-color .15s;box-shadow:var(--shadow-xs);}
  .ft-select:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,0.1);}
  .txn-row{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border);transition:background .12s;cursor:default;}
  .txn-row:last-child{border-bottom:none;}
  .txn-row:hover{background:#fafbff;}
  .progress-track{background:var(--bg);border-radius:99px;height:6px;overflow:hidden;}
  .progress-fill{height:100%;border-radius:99px;transition:width .9s cubic-bezier(.4,0,.2,1);}
  .tbl-head{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:var(--bg);border-bottom:1px solid var(--border);font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;}
  .insight-card{border-radius:var(--r);padding:14px;border:1px solid;transition:box-shadow .18s,transform .18s;cursor:default;}
  .insight-card:hover{box-shadow:var(--shadow-md);transform:translateY(-2px);}
  .acct-row{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:var(--r-sm);border:1px solid var(--border);background:var(--white);transition:box-shadow .18s,transform .18s;cursor:default;}
  .acct-row:hover{box-shadow:var(--shadow);transform:translateY(-1px);}
  .modal-backdrop{animation:mfade .18s ease;}
  .modal-box{animation:mslide .22s cubic-bezier(.4,0,.2,1);}
  @keyframes mfade{from{opacity:0}to{opacity:1}}
  @keyframes mslide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  .page-fade{animation:pfade .2s ease;}
  @keyframes pfade{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
  @keyframes tslide{from{opacity:0;transform:translate(-50%,8px)}to{opacity:1;transform:translate(-50%,0)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
  .auth-input-wrap{position:relative;}
  .auth-input-wrap .auth-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--muted2);pointer-events:none;}
  .auth-input-wrap .ft-input{padding-left:40px;}
  .auth-input-wrap .eye-btn{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--muted2);padding:2px;display:flex;}
  .cat-pill{border-radius:99px;padding:2px 9px;font-size:11.5px;font-weight:600;display:inline-flex;align-items:center;gap:4px;}

  /* ── RESPONSIVE LAYOUTS ── */
  .grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
  .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
  .grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
  .grid-dash-r2{display:grid;grid-template-columns:1.4fr 1fr 1.1fr;gap:14px;}

  /* Mobile header — hidden on desktop */
  .mobile-header{display:none;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--white);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:90;box-shadow:var(--shadow-sm);}

  /* Bottom nav — hidden on desktop */
  .bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--white);border-top:1px solid var(--border);z-index:90;padding:4px 0 6px;}
  .bnav-item{display:flex;flex-direction:column;align-items:center;gap:2px;padding:5px 0;flex:1;cursor:pointer;color:var(--muted);font-size:9.5px;font-weight:500;transition:color .15s;border:none;background:none;font-family:'Plus Jakarta Sans',sans-serif;}
  .bnav-item.active{color:var(--blue);}

  /* Sidebar overlay */
  .sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:98;animation:mfade .2s ease;}

  /* ── TABLET ≤1024 ── */
  @media(max-width:1024px){
    .grid-4{grid-template-columns:repeat(2,1fr);}
    .grid-dash-r2{grid-template-columns:1fr 1fr;}
    .grid-3{grid-template-columns:repeat(2,1fr);}
    .auth-left-panel{display:none!important;}
    .auth-right-panel{max-width:100%!important;padding:28px 24px!important;}
  }

  /* ── MOBILE ≤768 ── */
  @media(max-width:768px){
    .sidebar{position:fixed!important;left:0;top:0;height:100vh;z-index:99;transform:translateX(-100%);transition:transform .25s ease;}
    .sidebar.open{transform:translateX(0);}
    .sidebar-overlay.open{display:block;}
    .mobile-header{display:flex!important;}
    .bottom-nav{display:flex!important;}
    .hide-mob{display:none!important;}
    .main-wrap{margin-left:0!important;}
    .page-wrap{padding:14px 14px 90px!important;}
    .grid-4{grid-template-columns:1fr 1fr;gap:10px;}
    .grid-dash-r2{grid-template-columns:1fr;}
    .grid-3{grid-template-columns:1fr;}
    .grid-2{grid-template-columns:1fr;}
    .stat-card{padding:14px 16px;}
    .auth-grid-2{grid-template-columns:1fr!important;}
    .modal-box{width:calc(100vw - 24px)!important;}
    .txn-row{padding:10px 14px;}
  }

  /* ── SMALL ≤480 ── */
  @media(max-width:480px){
    .grid-4{grid-template-columns:1fr 1fr;}
  }
`;

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

const ACCOUNTS = [
  {id:"a1",name:"HDFC Savings",   type:"Savings",    balance:142350, last4:"4821",color:"#2563eb",bg:"#eff6ff",Icon:Building2},
  {id:"a2",name:"SBI Salary",     type:"Salary",     balance:68200,  last4:"3309",color:"#16a34a",bg:"#f0fdf4",Icon:Wallet   },
  {id:"a3",name:"ICICI Credit",   type:"Credit Card",balance:-23450, last4:"9977",color:"#dc2626",bg:"#fef2f2",Icon:CreditCard},
  {id:"a4",name:"Zerodha",        type:"Investment", balance:315000, last4:"—",   color:"#7c3aed",bg:"#f5f3ff",Icon:LineChart },
];

const BUDGETS_INIT=[
  {category:"food",      limit:8000, spent:6200},
  {category:"transport", limit:3000, spent:2100},
  {category:"shopping",  limit:5000, spent:4800},
  {category:"entertain", limit:2000, spent:900 },
  {category:"utilities", limit:4000, spent:3100},
  {category:"health",    limit:3000, spent:1400},
];
const GOALS_INIT=[
  {_id:"g1",name:"Emergency Fund",    target:300000, saved:142000,Icon:Shield,  deadline:"2025-12-31",color:"#2563eb"},
  {_id:"g2",name:"Europe Vacation",   target:150000, saved:42000, Icon:Award,   deadline:"2026-06-30",color:"#16a34a"},
  {_id:"g3",name:"MacBook Pro",       target:180000, saved:90000, Icon:BookOpen,deadline:"2025-09-30",color:"#7c3aed"},
  {_id:"g4",name:"Home Down Payment", target:1000000,saved:310000,Icon:Home,    deadline:"2028-01-01",color:"#d97706"},
];

const fmt     = (n,dec=0)=>"₹"+Math.abs(n).toLocaleString("en-IN",{minimumFractionDigits:dec,maximumFractionDigits:dec});
const fmtDate = d=>new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
const clamp   = (v,lo,hi)=>Math.max(lo,Math.min(hi,v));

function DonutChart({data,size=148}){
  const total=data.reduce((s,d)=>s+d[1],0)||1;
  let angle=-90;const r=54;const cx=size/2;const cy=size/2;
  const slices=data.slice(0,6).map(([cat,val])=>{
    const pct=val/total;const a1=(angle*Math.PI)/180;angle+=pct*360;const a2=(angle*Math.PI)/180;
    const x1=cx+r*Math.cos(a1);const y1=cy+r*Math.sin(a1);const x2=cx+r*Math.cos(a2);const y2=cy+r*Math.sin(a2);
    return{cat,d:`M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${pct>0.5?1:0} 1 ${x2} ${y2}Z`,color:CATEGORIES[cat]?.color};
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      {slices.map(s=><path key={s.cat} d={s.d} fill={s.color} opacity={0.85}/>)}
      <circle cx={cx} cy={cy} r={36} fill="white"/>
    </svg>
  );
}

function BarChart({data}){
  const max=Math.max(...data.map(d=>d.total),1);
  return (
    <svg width="100%" viewBox="0 0 288 118" preserveAspectRatio="xMidYMid meet">
      <defs><linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity="0.9"/><stop offset="100%" stopColor="#2563eb" stopOpacity="0.3"/></linearGradient></defs>
      {data.map((d,i)=>{
        const h=clamp((d.total/max)*90,4,90);const x=i*72;
        return (<g key={i}><rect x={x} y={90-h} width={54} height={h} rx={5} fill="url(#bg2)"/><text x={x+27} y={108} textAnchor="middle" fontSize={11} fill="#6b7280" fontFamily="Plus Jakarta Sans">{d.label}</text><text x={x+27} y={90-h-5} textAnchor="middle" fontSize={10} fill="#2563eb" fontFamily="Plus Jakarta Sans" fontWeight="600">₹{(d.total/1000).toFixed(1)}k</text></g>);
      })}
    </svg>
  );
}

/* ══ AUTH ══ */
function AuthPage({onLogin}){
  const [tab,setTab]=useState("login");
  const [showPass,setShowPass]=useState(false);
  const [showPass2,setShowPass2]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");
  const [lf,setLf]=useState({email:"arjun@example.com",password:"password123"});
  const [rf,setRf]=useState({name:"",email:"",phone:"",password:"",confirm:""});

  const handleLogin=async()=>{
    setError("");
    if(!lf.email||!lf.password){setError("Please enter email and password.");return;}
    setLoading(true);
    try{const res=await loginUser(lf);localStorage.setItem("fv_token",res.data.token);onLogin(res.data.user);}
    catch(err){setError(err.response?.data?.message||"Login failed. Check your credentials.");}
    finally{setLoading(false);}
  };

  const handleRegister=async()=>{
    setError("");
    if(!rf.name||!rf.email||!rf.password){setError("Please fill all required fields.");return;}
    if(rf.password!==rf.confirm){setError("Passwords do not match.");return;}
    if(rf.password.length<8){setError("Password must be at least 8 characters.");return;}
    setLoading(true);
    try{await registerUser({name:rf.name,email:rf.email,password:rf.password,phone:rf.phone});setSuccess("Account created! You can now sign in.");setTab("login");}
    catch(err){setError(err.response?.data?.message||"Registration failed.");}
    finally{setLoading(false);}
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",background:"var(--bg)"}}>
      {/* Left panel */}
      <div className="auth-left-panel" style={{flex:"0 0 46%",background:"linear-gradient(145deg,#1e40af 0%,#2563eb 45%,#1d4ed8 100%)",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"48px 52px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-80,right:-80,width:300,height:300,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <div style={{position:"absolute",bottom:-60,left:-60,width:240,height:240,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <div style={{display:"flex",alignItems:"center",gap:12,position:"relative"}}>
          <div style={{width:42,height:42,borderRadius:11,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(255,255,255,0.2)"}}><Wallet size={20} color="white"/></div>
          <div><div style={{fontSize:19,fontWeight:800,color:"white"}}>FinVault</div><div style={{fontSize:11,color:"rgba(255,255,255,0.65)",fontWeight:500}}>Personal Finance</div></div>
        </div>
        <div style={{position:"relative"}}>
          <div style={{fontSize:34,fontWeight:800,color:"white",lineHeight:1.25,letterSpacing:"-0.8px",marginBottom:14}}>Take control of your finances</div>
          <div style={{fontSize:14.5,color:"rgba(255,255,255,0.75)",lineHeight:1.7,marginBottom:32}}>Track expenses, manage budgets, and reach your goals.</div>
          {[{Icon:BarChart2,text:"Smart spending analytics"},{Icon:Target,text:"Goal-based savings tracker"},{Icon:Shield,text:"Bank-level data security"},{Icon:Sparkles,text:"AI-powered insights"}].map(({Icon:Ic,text},i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:11,marginBottom:13}}>
              <div style={{width:32,height:32,borderRadius:8,background:"rgba(255,255,255,0.13)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic size={15} color="white"/></div>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.85)",fontWeight:500}}>{text}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,position:"relative"}}>
          <div style={{display:"flex"}}>{["AK","SM","RV","PK"].map((init,i)=>(<div key={i} style={{width:28,height:28,borderRadius:99,background:`hsl(${i*60+200},60%,55%)`,border:"2px solid white",marginLeft:i?-8:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"white"}}>{init}</div>))}</div>
          <div><div style={{fontSize:12.5,color:"white",fontWeight:600}}>Trusted by 50,000+ users</div><div style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>Across India</div></div>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-right-panel" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 44px"}}>
        <div style={{width:"100%",maxWidth:400}}>
          {/* Mobile logo */}
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:24,justifyContent:"center"}}>
            <div style={{width:38,height:38,borderRadius:10,background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center"}}><Wallet size={18} color="white"/></div>
            <div style={{fontSize:20,fontWeight:800,color:"var(--text)"}}>FinVault</div>
          </div>
          <div style={{display:"flex",background:"var(--bg)",borderRadius:10,padding:4,marginBottom:26,border:"1px solid var(--border)"}}>
            {["login","register"].map(t=>(<button key={t} onClick={()=>{setTab(t);setError("");setSuccess("");}} style={{flex:1,padding:"9px",borderRadius:7,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:600,transition:"all .15s",background:tab===t?"white":"transparent",color:tab===t?"var(--text)":"var(--muted)",border:"none",boxShadow:tab===t?"var(--shadow-sm)":"none"}}>{t==="login"?"Sign In":"Create Account"}</button>))}
          </div>

          {tab==="login"?(
            <>
              <div style={{marginBottom:22}}><div style={{fontSize:22,fontWeight:800,color:"var(--text)",letterSpacing:"-0.4px"}}>Welcome back</div><div style={{fontSize:13,color:"var(--muted)",marginTop:4}}>Sign in to your FinVault account</div></div>
              {error&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 13px",background:"var(--red-bg)",border:"1px solid var(--red-bdr)",borderRadius:8,marginBottom:15,fontSize:13,color:"var(--red)"}}><AlertCircle size={14}/>{error}</div>}
              {success&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 13px",background:"var(--green-bg)",border:"1px solid var(--green-bdr)",borderRadius:8,marginBottom:15,fontSize:13,color:"var(--green)"}}><CheckCircle2 size={14}/>{success}</div>}
              <div style={{marginBottom:13}}><label style={{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text2)",marginBottom:5}}>Email address</label><div className="auth-input-wrap"><Mail size={14} className="auth-icon"/><input className="ft-input" type="email" placeholder="you@example.com" value={lf.email} onChange={e=>setLf({...lf,email:e.target.value})} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div></div>
              <div style={{marginBottom:8}}><label style={{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text2)",marginBottom:5}}>Password</label><div className="auth-input-wrap"><Lock size={14} className="auth-icon"/><input className="ft-input" type={showPass?"text":"password"} placeholder="Enter your password" value={lf.password} onChange={e=>setLf({...lf,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/><button className="eye-btn" onClick={()=>setShowPass(!showPass)}>{showPass?<EyeOff size={14}/>:<Eye size={14}/>}</button></div></div>
              <div style={{display:"flex",justifyContent:"flex-end",marginBottom:18}}><span style={{fontSize:12.5,color:"var(--blue)",fontWeight:600,cursor:"pointer"}}>Forgot password?</span></div>
              <button className="btn-primary" style={{width:"100%",justifyContent:"center",padding:"12px",fontSize:14}} onClick={handleLogin} disabled={loading}>
                {loading?<><RefreshCw size={14} style={{animation:"spin 1s linear infinite"}}/> Signing in…</>:<>Sign In <ChevronRight size={14}/></>}
              </button>
              <div style={{textAlign:"center",marginTop:18,fontSize:13,color:"var(--muted)"}}>Don't have an account?{" "}<span style={{color:"var(--blue)",fontWeight:600,cursor:"pointer"}} onClick={()=>setTab("register")}>Create one free</span></div>
            </>
          ):(
            <>
              <div style={{marginBottom:20}}><div style={{fontSize:22,fontWeight:800,color:"var(--text)",letterSpacing:"-0.4px"}}>Create your account</div><div style={{fontSize:13,color:"var(--muted)",marginTop:4}}>Free forever · No credit card required</div></div>
              {error&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 13px",background:"var(--red-bg)",border:"1px solid var(--red-bdr)",borderRadius:8,marginBottom:15,fontSize:13,color:"var(--red)"}}><AlertCircle size={14}/>{error}</div>}
              <div className="auth-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:13}}>
                <div><label style={{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text2)",marginBottom:5}}>Full Name *</label><div className="auth-input-wrap"><User size={13} className="auth-icon"/><input className="ft-input" placeholder="Arjun Kumar" value={rf.name} onChange={e=>setRf({...rf,name:e.target.value})}/></div></div>
                <div><label style={{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text2)",marginBottom:5}}>Phone</label><div className="auth-input-wrap"><Phone size={13} className="auth-icon"/><input className="ft-input" placeholder="+91 98765..." value={rf.phone} onChange={e=>setRf({...rf,phone:e.target.value})}/></div></div>
              </div>
              <div style={{marginBottom:13}}><label style={{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text2)",marginBottom:5}}>Email address *</label><div className="auth-input-wrap"><Mail size={13} className="auth-icon"/><input className="ft-input" type="email" placeholder="you@example.com" value={rf.email} onChange={e=>setRf({...rf,email:e.target.value})}/></div></div>
              <div className="auth-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:18}}>
                <div><label style={{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text2)",marginBottom:5}}>Password *</label><div className="auth-input-wrap"><Lock size={13} className="auth-icon"/><input className="ft-input" type={showPass?"text":"password"} placeholder="Min. 8 chars" value={rf.password} onChange={e=>setRf({...rf,password:e.target.value})}/><button className="eye-btn" onClick={()=>setShowPass(!showPass)}>{showPass?<EyeOff size={13}/>:<Eye size={13}/>}</button></div></div>
                <div><label style={{display:"block",fontSize:12.5,fontWeight:600,color:"var(--text2)",marginBottom:5}}>Confirm *</label><div className="auth-input-wrap"><Lock size={13} className="auth-icon"/><input className="ft-input" type={showPass2?"text":"password"} placeholder="Repeat" value={rf.confirm} onChange={e=>setRf({...rf,confirm:e.target.value})}/><button className="eye-btn" onClick={()=>setShowPass2(!showPass2)}>{showPass2?<EyeOff size={13}/>:<Eye size={13}/>}</button></div></div>
              </div>
              <button className="btn-primary" style={{width:"100%",justifyContent:"center",padding:"12px",fontSize:14}} onClick={handleRegister} disabled={loading}>
                {loading?<><RefreshCw size={14} style={{animation:"spin 1s linear infinite"}}/> Creating…</>:<>Create Account <ChevronRight size={14}/></>}
              </button>
              <div style={{textAlign:"center",marginTop:16,fontSize:13,color:"var(--muted)"}}>Already have an account?{" "}<span style={{color:"var(--blue)",fontWeight:600,cursor:"pointer"}} onClick={()=>setTab("login")}>Sign in</span></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══ MAIN APP ══ */
export default function FinanceTracker(){
  const [user,setUser]=useState(null);
  if(!user) return (<><style dangerouslySetInnerHTML={{__html:G}}/><AuthPage onLogin={setUser}/></>);
  return <Dashboard user={user} onLogout={()=>setUser(null)}/>;
}

/* ══ DASHBOARD ══ */
function Dashboard({user,onLogout}){
  const [txns,setTxns]=useState([]);
  const [budgets,setBudgets]=useState(BUDGETS_INIT);
  const [goals,setGoals]=useState(GOALS_INIT);
  const [dataLoading,setDataLoading]=useState(true);
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [page,setPage]=useState("dashboard");
  const [modal,setModal]=useState(null);
  const [search,setSearch]=useState("");
  const [catFilter,setCatFilter]=useState("all");
  const [sortBy,setSortBy]=useState("date");
  const [aiQuery,setAiQuery]=useState("");
  const [aiAnswer,setAiAnswer]=useState("");
  const [aiLoading,setAiLoading]=useState(false);
  const [toast,setToast]=useState(null);

  useEffect(()=>{
    const load=async()=>{
      try{
        const [txnRes,budgetRes,goalRes]=await Promise.all([getTransactions({limit:100}),getBudgets(),getGoals()]);
        setTxns(txnRes.data.data||[]);
        setBudgets(budgetRes.data.data?.length?budgetRes.data.data:BUDGETS_INIT);
        setGoals(goalRes.data.data?.length?goalRes.data.data:GOALS_INIT);
      }catch(err){console.error("Failed to load:",err);}
      finally{setDataLoading(false);}
    };
    load();
  },[]);

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3200);};
  const nav=(p)=>{setPage(p);setSidebarOpen(false);};

  const now=new Date();
  const thisMonth=now.toISOString().slice(0,7);
  const lastMonth=new Date(now.getFullYear(),now.getMonth()-1,1).toISOString().slice(0,7);
  const mtTxns=useMemo(()=>txns.filter(t=>t.date&&t.date.startsWith(thisMonth)),[txns,thisMonth]);
  const lmTxns=useMemo(()=>txns.filter(t=>t.date&&t.date.startsWith(lastMonth)),[txns,lastMonth]);
  const mtIncome=mtTxns.filter(t=>t.type==="credit").reduce((s,t)=>s+t.amount,0);
  const mtExpense=mtTxns.filter(t=>t.type==="debit").reduce((s,t)=>s+t.amount,0);
  const lmExpense=lmTxns.filter(t=>t.type==="debit").reduce((s,t)=>s+t.amount,0);
  const netWorth=ACCOUNTS.reduce((s,a)=>s+a.balance,0);
  const savings=mtIncome-mtExpense;

  const catBreakdown=useMemo(()=>{
    const map={};mtTxns.filter(t=>t.type==="debit").forEach(t=>{map[t.category]=(map[t.category]||0)+t.amount;});
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
    if(sortBy==="date") t.sort((a,b)=>new Date(b.date)-new Date(a.date));
    if(sortBy==="amount") t.sort((a,b)=>b.amount-a.amount);
    if(sortBy==="payee") t.sort((a,b)=>a.payee.localeCompare(b.payee));
    return t;
  },[txns,search,catFilter,sortBy]);

  const askAI=()=>{
    if(!aiQuery.trim())return;setAiLoading(true);setAiAnswer("");
    setTimeout(()=>{
      const q=aiQuery.toLowerCase();let ans="";
      if(q.includes("food")||q.includes("dining")) ans=`You've spent ${fmt(catBreakdown.find(c=>c[0]==="food")?.[1]||0)} on Food this month. Consider meal prepping to cut 15-20%.`;
      else if(q.includes("save")||q.includes("saving")) ans=`Net savings: ${fmt(savings)} — ${Math.round(savings/Math.max(mtIncome,1)*100)}% rate. ${savings/Math.max(mtIncome,1)>0.2?"Above 20% target!":"Below 20% — try reducing shopping."}`;
      else if(q.includes("budget")) ans=`${budgets.filter(b=>b.spent/b.limit>0.9).length} budgets need attention. Pause discretionary spending.`;
      else if(q.includes("net worth")) ans=`Net worth: ${fmt(netWorth)} — across all linked accounts.`;
      else ans=`Income: ${fmt(mtIncome)} · Expenses: ${fmt(mtExpense)} · Savings: ${fmt(savings)} (${Math.round(savings/Math.max(mtIncome,1)*100)}%). Spending ${mtExpense>lmExpense?"↑ up":"↓ down"} ${fmt(Math.abs(mtExpense-lmExpense))} vs last month.`;
      setAiAnswer(ans);setAiLoading(false);
    },900);
  };

  const addTxn=async(form)=>{
    try{const res=await createTransaction(form);setTxns([res.data.data,...txns]);setModal(null);showToast("Transaction added.");}
    catch{showToast("Failed to add transaction.","error");}
  };
  const delTxn=async(id)=>{
    try{await deleteTransaction(id);setTxns(txns.filter(t=>(t._id||t.id)!==id));showToast("Transaction deleted.","info");}
    catch{showToast("Failed to delete.","error");}
  };

  const TxnRow=({t,showDelete=false})=>{
    const Cat=CATEGORIES[t.category];const txnId=t._id||t.id;
    return (
      <div className="txn-row">
        <div style={{display:"flex",alignItems:"center",gap:11,minWidth:0}}>
          <div style={{width:36,height:36,borderRadius:9,background:Cat?.bg,border:`1px solid ${Cat?.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{Cat?.Icon&&<Cat.Icon size={15} color={Cat.color}/>}</div>
          <div style={{minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.payee}</div>
            <div style={{fontSize:11.5,color:"var(--muted)",marginTop:1,display:"flex",alignItems:"center",gap:5}}>
              <Calendar size={10}/>{fmtDate(t.date)}
              <span className="cat-pill hide-mob" style={{background:Cat?.bg,color:Cat?.color,border:`1px solid ${Cat?.bdr}`}}>{Cat?.label}</span>
            </div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <div style={{fontSize:13.5,fontWeight:700,color:t.type==="credit"?"var(--green)":"var(--text)",fontFamily:"'Manrope',sans-serif",display:"flex",alignItems:"center",gap:3}}>
            {t.type==="credit"?<ArrowDownLeft size={13} color="var(--green)"/>:<ArrowUpRight size={13} color="var(--red)"/>}
            {t.type==="credit"?"+":"-"}{fmt(t.amount,2)}
          </div>
          {showDelete&&<button className="btn-danger" onClick={()=>delTxn(txnId)} style={{padding:"4px 7px"}}><Trash2 size={11}/></button>}
        </div>
      </div>
    );
  };

  const navItems=[
    {id:"dashboard",label:"Dashboard",Icon:LayoutDashboard},
    {id:"transactions",label:"Transactions",Icon:ArrowLeftRight},
    {id:"budgets",label:"Budgets",Icon:PieChart},
    {id:"goals",label:"Goals",Icon:Target},
    {id:"analytics",label:"Analytics",Icon:BarChart2},
  ];

  /* ── SIDEBAR ── */
  const Sidebar=()=>(
    <aside className={`sidebar${sidebarOpen?" open":""}`} style={{width:236,flexShrink:0,height:"100vh",position:"sticky",top:0,background:"var(--white)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",boxShadow:"var(--shadow-sm)"}}>
      <div style={{padding:"16px 18px 13px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:34,height:34,borderRadius:8,background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center"}}><Wallet size={17} color="white"/></div>
          <div><div style={{fontSize:15,fontWeight:800,color:"var(--text)",letterSpacing:"-0.3px"}}>FinVault</div><div style={{fontSize:10,color:"var(--muted)",fontWeight:500}}>Personal Finance</div></div>
        </div>
        <button style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)",display:"flex",padding:2}} onClick={()=>setSidebarOpen(false)}><X size={18}/></button>
      </div>
      <div style={{padding:"8px 6px",flex:1,overflowY:"auto"}}>
        <div style={{fontSize:10,fontWeight:700,color:"var(--muted2)",textTransform:"uppercase",letterSpacing:"0.9px",padding:"4px 10px 8px"}}>Menu</div>
        {navItems.map(n=>(<div key={n.id} className={`nav-item${page===n.id?" active":""}`} onClick={()=>nav(n.id)}><div className="nav-icon"><n.Icon size={15}/></div>{n.label}</div>))}
      </div>
      <div style={{padding:"11px 14px",borderTop:"1px solid var(--border)"}}>
        <button className="btn-primary" style={{width:"100%",justifyContent:"center",marginBottom:10,fontSize:12}} onClick={()=>{setModal({type:"addTxn"});setSidebarOpen(false);}}><Plus size={14}/>Add Transaction</button>
        <div style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:9,background:"var(--bg)",border:"1px solid var(--border)"}}>
          <div style={{width:30,height:30,borderRadius:99,background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"white",flexShrink:0}}>{user.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div><div style={{fontSize:10.5,color:"var(--muted)"}}>{user.plan==="premium"?"Premium":"Free"} Plan</div></div>
          <button style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)",display:"flex",padding:2}} onClick={()=>{localStorage.removeItem("fv_token");onLogout();}}><LogOut size={13}/></button>
        </div>
      </div>
    </aside>
  );

  /* ── PAGE: DASHBOARD ── */
  const PageDashboard=()=>(
    <div className="page-fade">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:20,fontWeight:800,color:"var(--text)",letterSpacing:"-0.3px"}}>Good morning, {user.name.split(" ")[0]} 👋</div>
          <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{now.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
        </div>
        <button className="btn-primary hide-mob" onClick={()=>setModal({type:"addTxn"})}><Plus size={14}/>Add Transaction</button>
      </div>
      {dataLoading?(
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:180,gap:10,color:"var(--muted)"}}>
          <RefreshCw size={18} style={{animation:"spin 1s linear infinite"}} color="var(--blue)"/>
          <span style={{fontSize:13,fontWeight:500}}>Loading your data…</span>
        </div>
      ):(
        <>
          <div className="grid-4" style={{marginBottom:14}}>
            {[
              {label:"Net Worth",value:fmt(netWorth),sub:"All accounts",Icon:Wallet,color:"var(--blue)",bg:"var(--blue-bg)"},
              {label:"Income",value:fmt(mtIncome),sub:"This month",Icon:TrendingUp,color:"var(--green)",bg:"var(--green-bg)"},
              {label:"Spent",value:fmt(mtExpense),sub:`${mtExpense>lmExpense?"↑":"↓"} vs last mo`,Icon:TrendingDown,color:"var(--red)",bg:"var(--red-bg)"},
              {label:"Savings",value:fmt(savings),sub:`${Math.round(savings/Math.max(mtIncome,1)*100)}% rate`,Icon:PiggyBank,color:"var(--purple)",bg:"var(--purple-bg)"},
            ].map((c,i)=>(
              <div key={i} className="stat-card">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div style={{fontSize:10.5,fontWeight:600,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.5px"}}>{c.label}</div>
                  <div style={{width:30,height:30,borderRadius:8,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center"}}><c.Icon size={14} color={c.color}/></div>
                </div>
                <div style={{fontSize:19,fontWeight:800,color:"var(--text)",fontFamily:"'Manrope',sans-serif",letterSpacing:"-0.4px",marginBottom:3}}>{c.value}</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>{c.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid-dash-r2" style={{marginBottom:14}}>
            <div className="card" style={{padding:18}}>
              <div style={{fontSize:13.5,fontWeight:700,marginBottom:14,display:"flex",alignItems:"center",gap:7}}><PieChart size={14} color="var(--blue)"/>Spending Breakdown</div>
              <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                <DonutChart data={catBreakdown}/>
                <div style={{flex:1,minWidth:110}}>
                  {catBreakdown.slice(0,5).map(([cat,val])=>{
                    const C=CATEGORIES[cat];
                    return (<div key={cat} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:6,height:6,borderRadius:99,background:C?.color}}/><span style={{fontSize:12,color:"var(--text2)"}}>{C?.label}</span></div><span style={{fontSize:12,fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>{fmt(val)}</span></div>);
                  })}
                </div>
              </div>
            </div>
            <div className="card" style={{padding:18}}>
              <div style={{fontSize:13.5,fontWeight:700,marginBottom:13,display:"flex",alignItems:"center",gap:7}}><BarChart2 size={14} color="var(--blue)"/>Weekly Spend</div>
              <BarChart data={weeklyData}/>
              <div style={{marginTop:11,padding:"9px 12px",background:"var(--blue-bg)",borderRadius:8,border:"1px solid var(--blue-bdr)",display:"flex",alignItems:"center",gap:8}}>
                <BarChart2 size={13} color="var(--blue)"/>
                <div><div style={{fontSize:10.5,color:"var(--muted)"}}>4-week average</div><div style={{fontSize:15,fontWeight:800,fontFamily:"'Manrope',sans-serif",color:"var(--text)"}}>{fmt(weeklyData.reduce((s,w)=>s+w.total,0)/4)}</div></div>
              </div>
            </div>
            <div className="card" style={{padding:18}}>
              <div style={{fontSize:13.5,fontWeight:700,marginBottom:13,display:"flex",alignItems:"center",gap:7}}><CreditCard size={14} color="var(--blue)"/>Accounts</div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {ACCOUNTS.map(a=>(<div key={a.id} className="acct-row"><div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:32,height:32,borderRadius:8,background:a.bg,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${a.color}20`}}><a.Icon size={14} color={a.color}/></div><div><div style={{fontSize:12,fontWeight:600}}>{a.name}</div><div style={{fontSize:10.5,color:"var(--muted)"}}>•••• {a.last4}</div></div></div><div style={{fontSize:13,fontWeight:800,fontFamily:"'Manrope',sans-serif",color:a.balance<0?"var(--red)":"var(--text)"}}>{a.balance<0?"-":""}{fmt(Math.abs(a.balance))}</div></div>))}
              </div>
            </div>
          </div>

          <div className="grid-2" style={{marginBottom:14}}>
            <div className="card" style={{padding:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontSize:13.5,fontWeight:700,display:"flex",alignItems:"center",gap:7}}><Filter size={13} color="var(--blue)"/>Budgets</div><button className="btn-secondary" style={{fontSize:11,padding:"4px 10px"}} onClick={()=>setPage("budgets")}>Manage</button></div>
              {budgets.map(b=>{const pct=clamp(b.spent/b.limit*100,0,100);const barColor=pct>90?"var(--red)":pct>70?"var(--amber)":"var(--blue)";const C=CATEGORIES[b.category];return(<div key={b.category} style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}><div style={{display:"flex",alignItems:"center",gap:5}}>{C?.Icon&&<C.Icon size={11} color={C.color}/>}<span style={{fontSize:12,fontWeight:600}}>{C?.label}</span></div><span style={{fontSize:11,color:"var(--muted)",fontFamily:"'Manrope',sans-serif"}}>{fmt(b.spent)}/{fmt(b.limit)}</span></div><div className="progress-track"><div className="progress-fill" style={{width:`${pct}%`,background:barColor}}/></div></div>);})}
            </div>
            <div className="card" style={{padding:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontSize:13.5,fontWeight:700,display:"flex",alignItems:"center",gap:7}}><Target size={13} color="var(--blue)"/>Goals</div><button className="btn-secondary" style={{fontSize:11,padding:"4px 10px"}} onClick={()=>setPage("goals")}>Manage</button></div>
              {goals.slice(0,4).map(g=>{const pct=clamp((g.saved/g.target)*100,0,100);const GIcon=g.Icon||Target;return(<div key={g._id||g.id} style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}><div style={{display:"flex",alignItems:"center",gap:5}}><GIcon size={11} color={g.color}/><span style={{fontSize:12,fontWeight:600}}>{g.name}</span></div><span style={{fontSize:11,color:"var(--muted)"}}>{Math.round(pct)}%</span></div><div className="progress-track"><div className="progress-fill" style={{width:`${pct}%`,background:g.color}}/></div></div>);})}
            </div>
          </div>

          <div className="card" style={{padding:18,marginBottom:14,background:"linear-gradient(135deg,#f0f7ff,#f5f3ff)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:13}}>
              <div style={{width:36,height:36,borderRadius:9,background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Sparkles size={16} color="white"/></div>
              <div><div style={{fontSize:13.5,fontWeight:700}}>AI Finance Assistant</div><div style={{fontSize:11.5,color:"var(--muted)"}}>Ask anything about your money</div></div>
              {aiLoading&&<div style={{marginLeft:"auto",display:"flex",gap:3}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:99,background:"var(--blue)",animation:`pulse 1.2s ${i*0.2}s ease infinite`}}/>)}</div>}
            </div>
            <div style={{display:"flex",gap:8,marginBottom:9}}>
              <div style={{position:"relative",flex:1}}><Search size={12} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"var(--muted2)"}}/><input className="ft-input" style={{paddingLeft:30,background:"white",fontSize:12.5}} placeholder='e.g. "How much did I spend on food?"' value={aiQuery} onChange={e=>setAiQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&askAI()}/></div>
              <button className="btn-primary" style={{padding:"8px 13px",fontSize:12}} onClick={askAI} disabled={aiLoading}><Sparkles size={12}/>Ask</button>
            </div>
            {aiAnswer&&(<div style={{padding:"11px 14px",background:"white",borderRadius:8,border:"1px solid var(--blue-bdr)",fontSize:12.5,lineHeight:1.7,color:"var(--text2)"}}><span style={{color:"var(--blue)",fontWeight:700,marginRight:5,display:"inline-flex",alignItems:"center",gap:3}}><BadgeCheck size={12}/>AI:</span>{aiAnswer}</div>)}
            <div style={{display:"flex",gap:6,marginTop:9,flexWrap:"wrap"}}>
              {["Net worth?","Budget status","Save more?","Top expense?"].map(q=>(<button key={q} className="btn-secondary" style={{fontSize:11,padding:"4px 9px",borderRadius:99}} onClick={()=>{setAiQuery(q);setTimeout(askAI,50);}}>{q}</button>))}
            </div>
          </div>

          <div className="card" style={{overflow:"hidden"}}>
            <div style={{padding:"13px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid var(--border)"}}>
              <div style={{fontSize:13.5,fontWeight:700,display:"flex",alignItems:"center",gap:7}}><ArrowLeftRight size={14} color="var(--blue)"/>Recent Transactions</div>
              <button className="btn-secondary" style={{fontSize:11,padding:"4px 10px"}} onClick={()=>setPage("transactions")}>View all</button>
            </div>
            <div className="tbl-head"><span>Transaction</span><span>Amount</span></div>
            {txns.slice(0,6).map(t=><TxnRow key={t._id||t.id} t={t}/>)}
            {txns.length===0&&<div style={{padding:"28px",textAlign:"center",color:"var(--muted)",fontSize:13}}>No transactions yet. Add your first one!</div>}
          </div>
        </>
      )}
    </div>
  );

  /* ── PAGE: TRANSACTIONS ── */
  const PageTransactions=()=>(
    <div className="page-fade">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div><div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.3px"}}>Transactions</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{filteredTxns.length} records</div></div>
        <button className="btn-primary hide-mob" onClick={()=>setModal({type:"addTxn"})}><Plus size={14}/>Add</button>
      </div>
      <div className="card" style={{padding:13,marginBottom:13}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <div style={{position:"relative",flex:1,minWidth:140}}><Search size={12} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"var(--muted2)"}}/><input className="ft-input" style={{paddingLeft:30,fontSize:12.5}} placeholder="Search payee…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
          <select className="ft-select" style={{fontSize:12.5,minWidth:120}} value={catFilter} onChange={e=>setCatFilter(e.target.value)}><option value="all">All Categories</option>{Object.entries(CATEGORIES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select>
          <select className="ft-select" style={{fontSize:12.5,minWidth:110}} value={sortBy} onChange={e=>setSortBy(e.target.value)}><option value="date">Newest</option><option value="amount">Highest</option><option value="payee">A–Z</option></select>
        </div>
      </div>
      <div className="card" style={{overflow:"hidden"}}>
        <div className="tbl-head"><span>Transaction Details</span><span>Amount</span></div>
        {filteredTxns.slice(0,60).map(t=><TxnRow key={t._id||t.id} t={t} showDelete/>)}
        {filteredTxns.length===0&&(<div style={{padding:"40px 20px",textAlign:"center"}}><Search size={30} color="var(--border2)" style={{margin:"0 auto 10px"}}/><div style={{fontSize:14,fontWeight:600,color:"var(--text2)"}}>No transactions found</div><div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Try adjusting your filters</div></div>)}
      </div>
    </div>
  );

  /* ── PAGE: BUDGETS ── */
  const PageBudgets=()=>{
    const [lb,setLb]=useState(budgets);
    return (
      <div className="page-fade">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
          <div><div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.3px"}}>Budget Manager</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Monthly spending limits</div></div>
          <button className="btn-primary" style={{fontSize:12,padding:"8px 14px"}} onClick={()=>{setBudgets(lb);showToast("Budgets saved.");}}><CheckCircle2 size={13}/>Save</button>
        </div>
        <div className="card" style={{padding:15,marginBottom:16,background:"var(--blue-bg)",border:"1px solid var(--blue-bdr)"}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {[{label:"Budget",val:fmt(lb.reduce((s,b)=>s+b.limit,0)),Icon:DollarSign},{label:"Spent",val:fmt(lb.reduce((s,b)=>s+b.spent,0)),Icon:TrendingDown},{label:"Left",val:fmt(lb.reduce((s,b)=>s+Math.max(0,b.limit-b.spent),0)),Icon:PiggyBank},{label:"Over",val:`${lb.filter(b=>b.spent>b.limit).length}`,Icon:AlertCircle}].map((s,i)=>(
              <div key={s.label} style={{flex:"1 1 80px",padding:"3px 14px",borderRight:i<3?"1px solid var(--blue-bdr)":"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"var(--muted)",fontWeight:500,marginBottom:2}}><s.Icon size={10} color="var(--blue)"/>{s.label}</div>
                <div style={{fontSize:15,fontWeight:800,fontFamily:"'Manrope',sans-serif",color:"var(--text)"}}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid-2">
          {lb.map((b,i)=>{
            const pct=clamp(b.spent/b.limit*100,0,100);const barColor=pct>90?"var(--red)":pct>70?"var(--amber)":"var(--blue)";
            const sl=pct>90?"Over budget":pct>70?"Nearing limit":"On track";const sb=pct>90?"var(--red-bg)":pct>70?"var(--amber-bg)":"var(--green-bg)";const sc=pct>90?"var(--red)":pct>70?"var(--amber)":"var(--green)";
            const C=CATEGORIES[b.category];
            return (
              <div key={b.category||i} className="card" style={{padding:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:13}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:36,height:36,borderRadius:8,background:C?.bg,border:`1px solid ${C?.bdr}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{C?.Icon&&<C.Icon size={15} color={C.color}/>}</div>
                    <div><div style={{fontSize:13,fontWeight:700}}>{C?.label}</div><span style={{background:sb,color:sc,borderRadius:99,padding:"2px 7px",fontSize:10,fontWeight:600}}>{sl}</span></div>
                  </div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:17,fontWeight:800,fontFamily:"'Manrope',sans-serif",color:barColor}}>{Math.round(pct)}%</div><div style={{fontSize:10,color:"var(--muted)"}}>used</div></div>
                </div>
                <div className="progress-track" style={{height:7,marginBottom:9}}><div className="progress-fill" style={{width:`${pct}%`,background:barColor,height:"100%"}}/></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:11}}><span>Spent: <strong style={{fontFamily:"'Manrope',sans-serif"}}>{fmt(b.spent)}</strong></span><span style={{color:"var(--muted)"}}>Left: <strong style={{color:barColor,fontFamily:"'Manrope',sans-serif"}}>{fmt(Math.max(0,b.limit-b.spent))}</strong></span></div>
                <input className="ft-input" type="number" value={b.limit} style={{fontSize:12.5}} onChange={e=>{const u=[...lb];u[i]={...b,limit:parseFloat(e.target.value)||0};setLb(u);}}/>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ── PAGE: GOALS ── */
  const PageGoals=()=>{
    const [lg,setLg]=useState(goals);
    return (
      <div className="page-fade">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
          <div><div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.3px"}}>Financial Goals</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Track your savings targets</div></div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn-secondary" style={{fontSize:12,padding:"7px 12px"}} onClick={()=>setModal({type:"addGoal"})}><Plus size={13}/>New Goal</button>
            <button className="btn-primary" style={{fontSize:12,padding:"7px 12px"}} onClick={()=>{setGoals(lg);showToast("Goals saved.");}}><CheckCircle2 size={13}/>Save</button>
          </div>
        </div>
        <div className="grid-2">
          {lg.map((g,i)=>{
            const pct=clamp(g.saved/g.target*100,0,100);const daysLeft=Math.ceil((new Date(g.deadline)-new Date())/86400000);
            const monthly=g.target-g.saved>0&&daysLeft>0?(g.target-g.saved)/(daysLeft/30):0;
            const GIcon=g.Icon||Target;const gid=g._id||g.id;
            return (
              <div key={gid} className="card" style={{padding:18,borderTop:`3px solid ${g.color}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:13}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:40,height:40,borderRadius:10,background:`${g.color}12`,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${g.color}25`}}><GIcon size={19} color={g.color}/></div>
                    <div><div style={{fontSize:13.5,fontWeight:700}}>{g.name}</div><div style={{fontSize:11,color:"var(--muted)",marginTop:2,display:"flex",alignItems:"center",gap:4}}><Calendar size={10}/>{daysLeft>0?`${daysLeft} days left`:"Past deadline"}</div></div>
                  </div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:21,fontWeight:900,color:g.color,fontFamily:"'Manrope',sans-serif",lineHeight:1}}>{Math.round(pct)}%</div><div style={{fontSize:10,color:"var(--muted)"}}>done</div></div>
                </div>
                <div className="progress-track" style={{height:7,marginBottom:8}}><div className="progress-fill" style={{width:`${pct}%`,background:g.color,height:"100%"}}/></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:11}}><span>Saved: <strong style={{color:g.color,fontFamily:"'Manrope',sans-serif"}}>{fmt(g.saved)}</strong></span><span style={{color:"var(--muted)"}}>Target: <strong style={{fontFamily:"'Manrope',sans-serif"}}>{fmt(g.target)}</strong></span></div>
                {monthly>0&&(<div style={{padding:"8px 11px",borderRadius:7,background:`${g.color}10`,border:`1px solid ${g.color}20`,fontSize:11.5,marginBottom:11,color:"var(--text2)",display:"flex",alignItems:"center",gap:6}}><Info size={12} color={g.color}/>Save <strong style={{color:g.color,margin:"0 2px"}}>{fmt(monthly)}/mo</strong> on time</div>)}
                <div style={{display:"flex",gap:7}}>
                  <input className="ft-input" type="number" placeholder="Add amount (Enter)…" style={{flex:1,fontSize:12.5}} onKeyDown={e=>{if(e.key==="Enter"){const amt=parseFloat(e.target.value);if(!amt)return;const u=[...lg];u[i]={...g,saved:Math.min(g.saved+amt,g.target)};setLg(u);e.target.value="";showToast(`Added ${fmt(amt)} to "${g.name}".`);}}}/>
                  <button className="btn-danger" onClick={()=>{const u=lg.filter(x=>(x._id||x.id)!==gid);setLg(u);setGoals(u);showToast("Goal removed.","info");}}><Trash2 size={11}/></button>
                </div>
              </div>
            );
          })}
          <div className="card" style={{padding:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:150,border:"2px dashed var(--border2)",boxShadow:"none",cursor:"pointer",background:"var(--bg)",transition:"border-color .2s"}}
            onClick={()=>setModal({type:"addGoal"})}
            onMouseEnter={e=>e.currentTarget.style.borderColor="var(--blue)"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border2)"}>
            <div style={{width:38,height:38,borderRadius:10,background:"var(--blue-bg)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:9}}><Plus size={19} color="var(--blue)"/></div>
            <div style={{fontSize:13,fontWeight:600,color:"var(--text2)"}}>Add a new goal</div>
            <div style={{fontSize:11.5,color:"var(--muted)",marginTop:3}}>Track a savings target</div>
          </div>
        </div>
      </div>
    );
  };

  /* ── PAGE: ANALYTICS ── */
  const PageAnalytics=()=>{
    const monthlyData=useMemo(()=>{const map={};txns.forEach(t=>{const mo=t.date&&t.date.slice(0,7);if(!mo)return;if(!map[mo])map[mo]={income:0,expense:0};if(t.type==="credit")map[mo].income+=t.amount;else map[mo].expense+=t.amount;});return Object.entries(map).sort().slice(-3).map(([mo,v])=>({mo,...v,savings:v.income-v.expense}));},[]);
    const topPayees=useMemo(()=>{const map={};txns.filter(t=>t.type==="debit").forEach(t=>{map[t.payee]=(map[t.payee]||0)+t.amount;});return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,8);},[]);
    return (
      <div className="page-fade">
        <div style={{marginBottom:16}}><div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.3px"}}>Analytics</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Spending patterns and trends</div></div>
        <div className="grid-3" style={{marginBottom:14}}>
          {monthlyData.map(d=>(
            <div key={d.mo} className="card" style={{padding:16}}>
              <div style={{fontSize:11.5,fontWeight:600,color:"var(--muted)",marginBottom:13,textTransform:"uppercase",letterSpacing:"0.4px"}}>{new Date(d.mo+"-01").toLocaleDateString("en-IN",{month:"short",year:"numeric"})}</div>
              {[{l:"Income",v:d.income,c:"var(--green)",Icon:TrendingUp},{l:"Expenses",v:d.expense,c:"var(--red)",Icon:TrendingDown},{l:"Saved",v:d.savings,c:d.savings>0?"var(--blue)":"var(--red)",Icon:PiggyBank}].map(r=>(<div key={r.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid var(--border)"}}><span style={{fontSize:12,color:"var(--muted)",display:"flex",alignItems:"center",gap:5}}><r.Icon size={11} color={r.c}/>{r.l}</span><span style={{fontSize:12.5,fontWeight:700,color:r.c,fontFamily:"'Manrope',sans-serif"}}>{fmt(r.v)}</span></div>))}
              <div style={{marginTop:11}}><div style={{fontSize:11,color:"var(--muted)",marginBottom:4}}>Savings rate</div><div className="progress-track"><div className="progress-fill" style={{width:`${clamp(d.savings/Math.max(d.income,1)*100,0,100)}%`,background:d.savings>0?"var(--blue)":"var(--red)"}}/></div><div style={{fontSize:11,fontWeight:700,color:"var(--blue)",marginTop:4}}>{Math.round(d.savings/Math.max(d.income,1)*100)}%</div></div>
            </div>
          ))}
        </div>
        <div className="grid-2" style={{marginBottom:14}}>
          <div className="card" style={{padding:16}}>
            <div style={{fontSize:13.5,fontWeight:700,marginBottom:13,display:"flex",alignItems:"center",gap:7}}><BarChart2 size={14} color="var(--blue)"/>Top Merchants</div>
            {topPayees.map(([p,v],i)=>(<div key={p} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid var(--border)"}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:20,height:20,borderRadius:5,background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9.5,fontWeight:700,color:"var(--muted)"}}>#{i+1}</div><span style={{fontSize:12,color:"var(--text2)"}}>{p}</span></div><span style={{fontSize:12,fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>{fmt(v)}</span></div>))}
          </div>
          <div className="card" style={{padding:16}}>
            <div style={{fontSize:13.5,fontWeight:700,marginBottom:13,display:"flex",alignItems:"center",gap:7}}><PieChart size={14} color="var(--blue)"/>Category Split</div>
            {catBreakdown.map(([cat,val])=>{const C=CATEGORIES[cat];return(<div key={cat} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid var(--border)"}}><div style={{display:"flex",alignItems:"center",gap:7}}>{C?.Icon&&<C.Icon size={12} color={C.color}/>}<span style={{fontSize:12,color:"var(--text2)"}}>{C?.label}</span></div><div style={{display:"flex",alignItems:"center",gap:7}}><div className="progress-track hide-mob" style={{width:55}}><div className="progress-fill" style={{width:`${catBreakdown[0]&&catBreakdown[0][1]>0?(val/catBreakdown[0][1])*100:0}%`,background:C?.color}}/></div><span style={{fontSize:12,fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>{fmt(val)}</span></div></div>);})}
          </div>
        </div>
        <div className="card" style={{padding:16}}>
          <div style={{fontSize:13.5,fontWeight:700,marginBottom:14,display:"flex",alignItems:"center",gap:7}}><Sparkles size={14} color="var(--blue)"/>Smart Insights</div>
          <div className="grid-3">
            {[
              {Icon:TrendingDown,title:"Highest spend",desc:`${CATEGORIES[catBreakdown[0]?.[0]]?.label||"N/A"} — ${fmt(catBreakdown[0]?.[1]||0)}`,bg:"#fff7ed",bdr:"#fed7aa",color:"#ea580c"},
              {Icon:PiggyBank,title:"Savings rate",desc:`${Math.round(savings/Math.max(mtIncome,1)*100)}% ${savings/Math.max(mtIncome,1)>0.2?"✓ Above 20%":"↓ Below 20%"}`,bg:"#f0fdf4",bdr:"#bbf7d0",color:"#16a34a"},
              {Icon:AlertCircle,title:"Budget alerts",desc:`${budgets.filter(b=>b.spent/b.limit>0.9).length} categories above 90%`,bg:"#fffbeb",bdr:"#fde68a",color:"#d97706"},
              {Icon:BarChart2,title:"Weekend spend",desc:"35–42% higher than weekdays",bg:"#f5f3ff",bdr:"#ddd6fe",color:"#7c3aed"},
              {Icon:CreditCard,title:"Avg transaction",desc:`${fmt(mtExpense/Math.max(mtTxns.filter(t=>t.type==="debit").length,1),0)} per txn`,bg:"#eff6ff",bdr:"#bfdbfe",color:"#2563eb"},
              {Icon:Target,title:"Best goal",desc:goals.length?`${goals.reduce((a,b)=>b.saved/b.target>a.saved/a.target?b:a,goals[0])?.name}`:"No goals yet",bg:"#f0fdf4",bdr:"#bbf7d0",color:"#16a34a"},
            ].map((item,i)=>(<div key={i} className="insight-card" style={{background:item.bg,borderColor:item.bdr}}><div style={{width:30,height:30,borderRadius:8,background:"white",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8,boxShadow:"var(--shadow-xs)"}}><item.Icon size={14} color={item.color}/></div><div style={{fontSize:10.5,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.5px",fontWeight:600,marginBottom:4}}>{item.title}</div><div style={{fontSize:12.5,fontWeight:700,color:item.color,lineHeight:1.4}}>{item.desc}</div></div>))}
          </div>
        </div>
      </div>
    );
  };

  /* ── MODAL ── */
  const Modal=()=>{
    const [form,setForm]=useState({type:"debit",date:new Date().toISOString().slice(0,10),payee:"",category:"food",amount:"",note:""});
    const [gf,setGf]=useState({name:"",target:"",saved:"",deadline:""});
    if(!modal)return null;
    return (
      <div className="modal-backdrop" style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.45)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:12}} onClick={e=>e.target===e.currentTarget&&setModal(null)}>
        <div className="modal-box card" style={{width:"100%",maxWidth:450,maxHeight:"90vh",overflowY:"auto",padding:0,boxShadow:"var(--shadow-lg)"}}>
          <div style={{padding:"15px 18px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:14.5,fontWeight:700,display:"flex",alignItems:"center",gap:8}}>{modal.type==="addTxn"?<><ArrowLeftRight size={14} color="var(--blue)"/>Add Transaction</>:<><Target size={14} color="var(--blue)"/>New Goal</>}</div>
            <button onClick={()=>setModal(null)} style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:7,cursor:"pointer",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--muted)"}}><X size={13}/></button>
          </div>
          <div style={{padding:18}}>
            {modal.type==="addTxn"&&(
              <>
                <div style={{display:"flex",gap:8,marginBottom:16,background:"var(--bg)",borderRadius:9,padding:4}}>
                  {["debit","credit"].map(t=>(<button key={t} onClick={()=>setForm({...form,type:t})} style={{flex:1,padding:"8px",borderRadius:7,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12.5,fontWeight:600,transition:"all .15s",background:form.type===t?"white":"transparent",color:form.type===t?(t==="debit"?"var(--red)":"var(--green)"):"var(--muted)",border:"none",boxShadow:form.type===t?"var(--shadow-sm)":"none",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>{t==="debit"?<><ArrowUpRight size={13}/>Expense</>:<><ArrowDownLeft size={13}/>Income</>}</button>))}
                </div>
                {[["Date","date","date",""],["Payee","payee","text","e.g. Zomato, Salary"],["Amount (₹)","amount","number","0.00"],["Note (optional)","note","text","Add a note…"]].map(([l,f,t,p])=>(<div key={f} style={{marginBottom:12}}><label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--text2)",marginBottom:5}}>{l}</label><input className="ft-input" type={t} placeholder={p} value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})}/></div>))}
                <div style={{marginBottom:16}}><label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--text2)",marginBottom:5}}>Category</label><select className="ft-select" style={{width:"100%"}} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{Object.entries(CATEGORIES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
                <button className="btn-primary" style={{width:"100%",justifyContent:"center",padding:"10px",fontSize:13}} onClick={()=>{if(!form.payee||!form.amount||!form.date)return showToast("Fill all required fields.","error");addTxn(form);}}><Plus size={13}/>Add Transaction</button>
              </>
            )}
            {modal.type==="addGoal"&&(
              <>
                {[["Goal Name","name","text","e.g. Emergency Fund"],["Target (₹)","target","number","e.g. 100000"],["Already Saved (₹)","saved","number","0"],["Deadline","deadline","date",""]].map(([l,f,t,p])=>(<div key={f} style={{marginBottom:12}}><label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--text2)",marginBottom:5}}>{l}</label><input className="ft-input" type={t} placeholder={p} value={gf[f]} onChange={e=>setGf({...gf,[f]:e.target.value})}/></div>))}
                <button className="btn-primary" style={{width:"100%",justifyContent:"center",padding:"10px",fontSize:13}} onClick={()=>{if(!gf.name||!gf.target)return showToast("Name and target required.","error");const ng={_id:`g-${Date.now()}`,name:gf.name,target:parseFloat(gf.target),saved:parseFloat(gf.saved)||0,Icon:Target,deadline:gf.deadline||"2026-12-31",color:["#2563eb","#16a34a","#7c3aed","#d97706"][goals.length%4]};setGoals([...goals,ng]);setModal(null);showToast("New goal created.");}}><Target size={13}/>Create Goal</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:G}}/>
      <div style={{display:"flex",minHeight:"100vh",background:"var(--bg)"}}>

        {/* Sidebar overlay (mobile) */}
        <div className={`sidebar-overlay${sidebarOpen?" open":""}`} onClick={()=>setSidebarOpen(false)}/>

        {/* Sidebar */}
        <Sidebar/>

        {/* Main */}
        <div className="main-wrap" style={{flex:1,minWidth:0,display:"flex",flexDirection:"column"}}>

          {/* Mobile header */}
          <div className="mobile-header">
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <button style={{background:"none",border:"none",cursor:"pointer",padding:4,color:"var(--text)",display:"flex"}} onClick={()=>setSidebarOpen(true)}><Menu size={21}/></button>
              <div style={{fontSize:15,fontWeight:800,color:"var(--text)"}}>FinVault</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button className="btn-primary" style={{padding:"6px 11px",fontSize:12}} onClick={()=>setModal({type:"addTxn"})}><Plus size={12}/>Add</button>
              <div style={{width:28,height:28,borderRadius:99,background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"white"}}>{user.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
            </div>
          </div>

          {/* Page */}
          <main className="page-wrap" style={{flex:1,padding:"22px 26px",overflowY:"auto"}}>
            {page==="dashboard"&&<PageDashboard/>}
            {page==="transactions"&&<PageTransactions/>}
            {page==="budgets"&&<PageBudgets/>}
            {page==="goals"&&<PageGoals/>}
            {page==="analytics"&&<PageAnalytics/>}
          </main>
        </div>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="bottom-nav">
        {navItems.map(n=>(<button key={n.id} className={`bnav-item${page===n.id?" active":""}`} onClick={()=>nav(n.id)}><n.Icon size={19}/><span>{n.label}</span></button>))}
      </nav>

      <Modal/>

      {toast&&(
        <div style={{position:"fixed",bottom:72,left:"50%",transform:"translateX(-50%)",background:toast.type==="error"?"var(--red)":toast.type==="info"?"#1f2937":"var(--green)",color:"white",padding:"10px 16px",borderRadius:10,fontWeight:600,fontSize:13,zIndex:9999,boxShadow:"var(--shadow-lg)",animation:"tslide .3s ease",display:"flex",alignItems:"center",gap:8,whiteSpace:"nowrap"}}>
          {toast.type==="error"?<AlertCircle size={13}/>:toast.type==="info"?<Info size={13}/>:<CheckCircle2 size={13}/>}
          {toast.msg}
        </div>
      )}
    </>
  );
}