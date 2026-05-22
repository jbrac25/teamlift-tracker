import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import { Dumbbell, Users, CalendarDays, BarChart3, ClipboardCheck, Search, LogOut, UserRound } from "lucide-react";
import "./style.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://fenxaiogxqlzvrupqjuj.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_rGGN2qQiwFx0SBM_bcPr4A_R-ttuY0q";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const demoPlayers = [
  { id: "demo-1", name: "Marcus Reed", group_name: "Varsity", position: "RB" },
  { id: "demo-2", name: "Jalen Brooks", group_name: "Varsity", position: "LB" },
  { id: "demo-3", name: "Eli Carter", group_name: "JV", position: "QB" },
  { id: "demo-4", name: "Noah Smith", group_name: "JV", position: "OL" },
  { id: "demo-5", name: "Andre Miles", group_name: "Freshman", position: "WR" }
];

const todayWorkout = {
  id: "demo-workout-1",
  date: "Today",
  title: "Lower Body Strength",
  focus: "Squat strength, posterior chain, and core stability",
  assigned_to: "All Football Groups",
  exercises: [
    { id: "squat", name: "Back Squat", prescription: "5 x 5", target: "RPE 7-8" },
    { id: "rdl", name: "Romanian Deadlift", prescription: "4 x 8", target: "Controlled tempo" },
    { id: "lunges", name: "Walking Lunges", prescription: "3 x 10 each leg", target: "Bodyweight or light DB" },
    { id: "plank", name: "Front Plank", prescription: "3 x 45 sec", target: "Perfect position" }
  ]
};

const demoLogs = [
  { player_id: "demo-1", exercise_id: "squat", weight: 225, reps: 5, sets: 5, completed: true, note: "Moved well" },
  { player_id: "demo-2", exercise_id: "squat", weight: 245, reps: 5, sets: 5, completed: true, note: "Hard last set" },
  { player_id: "demo-3", exercise_id: "squat", weight: 155, reps: 5, sets: 5, completed: true, note: "Good depth" },
  { player_id: "demo-4", exercise_id: "squat", weight: 185, reps: 5, sets: 4, completed: false, note: "Missed final set" }
];

function Button({ children, onClick, secondary=false }) { return <button onClick={onClick} className={secondary ? "btn secondary" : "btn"}>{children}</button>; }
function Card({ children }) { return <div className="card">{children}</div>; }
function StatCard({ icon: Icon, label, value, detail }) { return <Card><div className="stat"><div className="icon"><Icon size={24}/></div><div><p className="muted">{label}</p><h2>{value}</h2><small>{detail}</small></div></div></Card>; }

function LoginPanel({ onDemo }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const signIn = async () => { const { error } = await supabase.auth.signInWithPassword({ email, password }); setMessage(error ? error.message : "Signed in."); };
  const signUp = async () => { const { error } = await supabase.auth.signUp({ email, password }); setMessage(error ? error.message : "Account created. Check email if confirmation is enabled."); };
  return <main className="login"><Card><div className="brand"><div className="brandIcon"><Dumbbell/></div><div><h1>TeamLift Tracker</h1><p>Player login and coach dashboard</p></div></div><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/><div className="two"><Button onClick={signIn}>Log In</Button><Button secondary onClick={signUp}>Create Account</Button></div><button className="ghost" onClick={onDemo}><UserRound size={16}/> Use Demo Mode</button>{message && <p className="message">{message}</p>}</Card></main>;
}

function Header({ view, setView, user, onSignOut }) {
  return <header><div className="headerInner"><div className="brand"><div className="brandIcon"><Dumbbell/></div><div><h1>TeamLift Tracker</h1><p>{user?.email || "Demo mode"}</p></div></div><nav><Button secondary={view!=="player"} onClick={()=>setView("player")}>Player View</Button><Button secondary={view!=="coach"} onClick={()=>setView("coach")}>Coach View</Button><button className="ghost" onClick={onSignOut}><LogOut size={16}/> Log Out</button></nav></div></header>;
}

function PlayerView({ selectedPlayer, setSelectedPlayer, players, logs, setLogs }) {
  const playerLogs = logs.filter(log => log.player_id === selectedPlayer.id);
  const saveLog = async (exerciseId, field, value) => {
    setLogs(current => {
      const exists = current.find(log => log.player_id === selectedPlayer.id && log.exercise_id === exerciseId);
      if (exists) return current.map(log => log.player_id === selectedPlayer.id && log.exercise_id === exerciseId ? { ...log, [field]: value, completed: true } : log);
      return [...current, { player_id: selectedPlayer.id, workout_id: todayWorkout.id, exercise_id: exerciseId, weight:"", reps:"", sets:"", note:"", [field]: value, completed:true }];
    });
    if (!String(selectedPlayer.id).startsWith("demo-")) await supabase.from("workout_logs").upsert({ player_id:selectedPlayer.id, workout_id:todayWorkout.id, exercise_id:exerciseId, [field]:value, completed:true }, { onConflict:"player_id,workout_id,exercise_id" });
  };
  const getLog = id => playerLogs.find(log => log.exercise_id === id) || {};
  return <main className="container grid"><section className="mainCol"><Card><p className="muted row"><CalendarDays size={16}/> {todayWorkout.date}</p><h1>{todayWorkout.title}</h1><p>{todayWorkout.focus}</p><select value={selectedPlayer.id} onChange={e=>setSelectedPlayer(players.find(p=>p.id===e.target.value))}>{players.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></Card>{todayWorkout.exercises.map(ex=>{const log=getLog(ex.id); return <Card key={ex.id}><div className="exercise"><div><h3>{ex.name}</h3><p className="muted">{ex.prescription} | {ex.target}</p></div><div className="inputs"><input placeholder="Weight" value={log.weight||""} onChange={e=>saveLog(ex.id,"weight",e.target.value)}/><input placeholder="Reps" value={log.reps||""} onChange={e=>saveLog(ex.id,"reps",e.target.value)}/><input placeholder="Sets" value={log.sets||""} onChange={e=>saveLog(ex.id,"sets",e.target.value)}/><input placeholder="Notes" value={log.note||""} onChange={e=>saveLog(ex.id,"note",e.target.value)}/></div></div></Card>})}</section><aside><Card><h3>Player Profile</h3><p>Name: {selectedPlayer.name}</p><p>Group: {selectedPlayer.group_name}</p><p>Position: {selectedPlayer.position}</p></Card><Card><h3>Today&apos;s Status</h3><h1>{playerLogs.length}/{todayWorkout.exercises.length}</h1><p className="muted">Exercises logged</p><Button><ClipboardCheck size={16}/> Submit Workout</Button></Card></aside></main>;
}

function CoachView({ players, logs }) {
  const [search,setSearch]=useState("");
  const filtered=players.filter(p=>`${p.name} ${p.group_name} ${p.position}`.toLowerCase().includes(search.toLowerCase()));
  const stats=useMemo(()=>{const active=new Set(logs.map(l=>l.player_id)).size; const total=players.length*todayWorkout.exercises.length; const completion=total?Math.round(logs.length/total*100):0; const squats=logs.filter(l=>l.exercise_id==="squat"&&Number(l.weight)); const avg=squats.length?Math.round(squats.reduce((s,l)=>s+Number(l.weight),0)/squats.length):0; return {active,completion,avg};},[players,logs]);
  const summary=id=>{const pl=logs.filter(l=>l.player_id===id); const squat=pl.find(l=>l.exercise_id==="squat"); return {logged:pl.length,squat:squat?.weight||"-",status:pl.length===todayWorkout.exercises.length?"Complete":pl.length>0?"In Progress":"Not Started"};};
  return <main className="container"><div className="stats"><StatCard icon={Users} label="Players" value={players.length} detail="Roster loaded"/><StatCard icon={ClipboardCheck} label="Active Today" value={stats.active} detail="Players with logs"/><StatCard icon={BarChart3} label="Completion" value={`${stats.completion}%`} detail="All assigned exercises"/><StatCard icon={Dumbbell} label="Avg Squat" value={`${stats.avg} lb`} detail="Submitted squat logs"/></div><Card><div className="topline"><div><h1>Coach Dashboard</h1><p className="muted">Track daily completion and performance.</p></div><div className="search"><Search size={16}/><input placeholder="Search players" value={search} onChange={e=>setSearch(e.target.value)}/></div></div><table><thead><tr><th>Player</th><th>Group</th><th>Position</th><th>Logged</th><th>Squat</th><th>Status</th></tr></thead><tbody>{filtered.map(p=>{const s=summary(p.id); return <tr key={p.id}><td>{p.name}</td><td>{p.group_name}</td><td>{p.position}</td><td>{s.logged}/{todayWorkout.exercises.length}</td><td>{s.squat}</td><td><span className="pill">{s.status}</span></td></tr>})}</tbody></table></Card></main>;
}

function App() {
  const [user,setUser]=useState(null); const [demoMode,setDemoMode]=useState(false); const [view,setView]=useState("player"); const [players,setPlayers]=useState(demoPlayers); const [selectedPlayer,setSelectedPlayer]=useState(demoPlayers[0]); const [logs,setLogs]=useState(demoLogs);
  useEffect(()=>{supabase.auth.getUser().then(({data})=>setUser(data.user)); const {data:listener}=supabase.auth.onAuthStateChange((_e,session)=>setUser(session?.user||null)); return ()=>listener.subscription.unsubscribe();},[]);
  useEffect(()=>{async function load(){ if(!user || demoMode) return; const {data:pd}=await supabase.from("players").select("*").order("name"); const {data:ld}=await supabase.from("workout_logs").select("*"); if(pd?.length){setPlayers(pd);setSelectedPlayer(pd[0]);} if(ld?.length) setLogs(ld);} load();},[user,demoMode]);
  const signOut=async()=>{await supabase.auth.signOut(); setUser(null); setDemoMode(false);};
  if(!user && !demoMode) return <LoginPanel onDemo={()=>setDemoMode(true)}/>;
  return <><Header view={view} setView={setView} user={user} onSignOut={signOut}/>{view==="player"?<PlayerView selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer} players={players} logs={logs} setLogs={setLogs}/>:<CoachView players={players} logs={logs}/>}</>;
}

createRoot(document.getElementById("root")).render(<App/>);
