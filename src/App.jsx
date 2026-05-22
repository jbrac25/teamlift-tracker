import { useMemo, useState } from "react";

const workouts = [
  {
    day: "Monday",
    title: "Strength Foundation",
    focus: "Lower body + push strength",
    exercises: [
      { name: "Back Squat", sets: "4", reps: "5", needsWeight: true },
      { name: "Bench Press", sets: "4", reps: "6", needsWeight: true },
      { name: "Walking Lunges", sets: "3", reps: "10 each leg", needsWeight: true },
      { name: "Plank", sets: "3", reps: "45 seconds", needsWeight: false }
    ]
  },
  {
    day: "Wednesday",
    title: "Speed + Pull",
    focus: "Explosive movement + upper back",
    exercises: [
      { name: "Power Clean", sets: "5", reps: "3", needsWeight: true },
      { name: "Barbell Row", sets: "4", reps: "8", needsWeight: true },
      { name: "Romanian Deadlift", sets: "3", reps: "8", needsWeight: true },
      { name: "Sprint Starts", sets: "6", reps: "10 yards", needsWeight: false }
    ]
  },
  {
    day: "Friday",
    title: "Total Body",
    focus: "Full body strength + conditioning",
    exercises: [
      { name: "Deadlift", sets: "4", reps: "4", needsWeight: true },
      { name: "Overhead Press", sets: "3", reps: "6", needsWeight: true },
      { name: "Goblet Squat", sets: "3", reps: "12", needsWeight: true },
      { name: "Farmer Carry", sets: "4", reps: "30 yards", needsWeight: true }
    ]
  }
];

export default function App() {
  const [email, setEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [weights, setWeights] = useState({});
  const [darkMode, setDarkMode] = useState(true);

  const totalWeightedExercises = workouts.reduce(
    (total, workout) => total + workout.exercises.filter((exercise) => exercise.needsWeight).length,
    0
  );

  const completed = useMemo(
    () => Object.values(weights).filter((value) => value !== "").length,
    [weights]
  );

  const completionPercent = Math.round((completed / totalWeightedExercises) * 100);

  const shellClass = darkMode
    ? "min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white"
    : "min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 text-slate-950";

  const panelClass = darkMode
    ? "bg-white/10 border-white/10 text-white shadow-blue-950/30"
    : "bg-white border-blue-100 text-slate-950 shadow-blue-200/50";

  const cardClass = darkMode
    ? "bg-white/10 border-white/10 text-white"
    : "bg-white border-blue-100 text-slate-950";

  const inputClass = darkMode
    ? "bg-slate-950/70 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-400 focus:ring-blue-400/20"
    : "bg-white border-slate-200 text-slate-950 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-100";

  if (!loggedIn) {
    return (
      <main className={`${shellClass} flex items-center justify-center p-6`}>
        <section className={`w-full max-w-md rounded-[2rem] border p-8 shadow-2xl ${panelClass}`}>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-black text-white shadow-lg shadow-blue-700/30">
            TL
          </div>

          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-blue-400">
              Player Workout Portal
            </p>
            <h1 className="mb-3 text-4xl font-black tracking-tight">TeamLift Tracker</h1>
            <p className={darkMode ? "text-blue-100/80" : "text-slate-600"}>
              A clean training dashboard for logging workouts, tracking weights, and building consistency.
            </p>
          </div>

          <label className="mb-2 block text-sm font-black">Player email</label>
          <input
            className={`mb-4 w-full rounded-2xl border p-3.5 outline-none transition focus:ring-4 ${inputClass}`}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="player@email.com"
          />

          <button
            className="w-full rounded-2xl bg-blue-700 p-3.5 font-black text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800 active:scale-[0.99]"
            onClick={() => email && setLoggedIn(true)}
          >
            Enter Dashboard
          </button>

          <button
            className={darkMode ? "mt-4 w-full text-sm font-bold text-blue-200" : "mt-4 w-full text-sm font-bold text-blue-700"}
            onClick={() => setDarkMode(!darkMode)}
          >
            Switch to {darkMode ? "Light" : "Dark"} Mode
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={`${shellClass} p-4 md:p-6`}>
      <div className="mx-auto max-w-7xl">
        <header className={`mb-6 rounded-[2rem] border p-6 shadow-2xl backdrop-blur md:p-8 ${panelClass}`}>
          <nav className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 font-black text-white shadow-lg shadow-blue-700/30">
                TL
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-400">TeamLift</p>
                <p className={darkMode ? "text-sm text-blue-100/70" : "text-sm text-slate-500"}>Performance Dashboard</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="rounded-2xl border border-blue-400/30 px-4 py-2 text-sm font-black transition hover:bg-blue-600 hover:text-white"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? "Light" : "Dark"} Mode
              </button>
              <button
                className="rounded-2xl bg-blue-700 px-4 py-2 text-sm font-black text-white transition hover:bg-blue-800"
                onClick={() => setLoggedIn(false)}
              >
                Log out
              </button>
            </div>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-blue-400">Welcome, {email}</p>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">Your Workouts</h1>
              <p className={darkMode ? "mt-3 max-w-2xl text-lg text-blue-100/80" : "mt-3 max-w-2xl text-lg text-slate-600"}>
                Enter weights when needed, monitor weekly progress, and stay locked in on every training day.
              </p>
            </div>

            <div className="rounded-3xl bg-blue-600 p-5 text-white shadow-xl shadow-blue-700/30">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-black">Weekly Completion</p>
                <p className="text-2xl font-black">{completionPercent}%</p>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-blue-50">
                {completed} of {totalWeightedExercises} weighted lifts recorded
              </p>
            </div>
          </div>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <StatCard label="Training Days" value={workouts.length} darkMode={darkMode} />
          <StatCard label="Weights Entered" value={completed} darkMode={darkMode} />
          <StatCard label="Remaining Lifts" value={totalWeightedExercises - completed} darkMode={darkMode} />
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {workouts.map((workout) => (
            <article
              key={workout.day}
              className={`rounded-[2rem] border p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${cardClass}`}
            >
              <p className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-black text-blue-800">
                {workout.day}
              </p>
              <h2 className="text-2xl font-black tracking-tight">{workout.title}</h2>
              <p className={darkMode ? "mb-5 text-blue-100/70" : "mb-5 text-slate-600"}>{workout.focus}</p>

              <div className="space-y-4">
                {workout.exercises.map((exercise) => {
                  const key = `${workout.day}-${exercise.name}`;
                  const hasWeight = weights[key] !== undefined && weights[key] !== "";

                  return (
                    <div
                      key={key}
                      className={
                        darkMode
                          ? "rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                          : "rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      }
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-black">{exercise.name}</h3>
                          <p className={darkMode ? "text-sm font-medium text-blue-100/60" : "text-sm font-medium text-slate-500"}>
                            {exercise.sets} sets x {exercise.reps}
                          </p>
                        </div>
                        {!exercise.needsWeight ? (
                          <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-black text-slate-600">
                            No weight
                          </span>
                        ) : hasWeight ? (
                          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-black text-blue-800">
                            Logged
                          </span>
                        ) : null}
                      </div>

                      {exercise.needsWeight && (
                        <input
                          className={`mt-3 w-full rounded-xl border p-3 outline-none transition focus:ring-4 ${inputClass}`}
                          type="number"
                          min="0"
                          placeholder="Weight used, lbs"
                          value={weights[key] || ""}
                          onChange={(event) => setWeights({ ...weights, [key]: event.target.value })}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, darkMode }) {
  return (
    <div
      className={
        darkMode
          ? "rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-blue-950/20"
          : "rounded-3xl border border-blue-100 bg-white p-5 shadow-xl shadow-blue-200/40"
      }
    >
      <p className="text-3xl font-black">{value}</p>
      <p className={darkMode ? "font-bold text-blue-100/70" : "font-bold text-slate-600"}>{label}</p>
    </div>
  );
}
