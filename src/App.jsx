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

  const completed = useMemo(
    () => Object.values(weights).filter((value) => value !== "").length,
    [weights]
  );

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <section className="w-full max-w-md rounded-3xl bg-white/10 border border-white/10 p-8 shadow-2xl">
          <p className="text-green-300 font-bold mb-3">Player Workout Portal</p>
          <h1 className="text-4xl font-black mb-3">TeamLift Tracker</h1>
          <p className="text-slate-300 mb-6">
            Log in to see your workouts and record the weight you used for each lift.
          </p>

          <label className="block text-sm font-bold mb-2">Player email</label>
          <input
            className="w-full rounded-xl bg-slate-900 border border-white/10 p-3 mb-4 text-white"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="player@email.com"
          />

          <button
            className="w-full rounded-xl bg-green-400 text-slate-950 font-black p-3"
            onClick={() => email && setLoggedIn(true)}
          >
            Log in
          </button>

          <p className="text-xs text-slate-400 mt-4">
            This first version uses a simple login screen. Supabase login can be connected next.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-green-300 font-bold">Welcome, {email}</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">Your Workouts</h1>
            <p className="text-slate-300 mt-2">Enter weights when needed and track your progress.</p>
          </div>
          <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
            <p className="text-3xl font-black">{completed}</p>
            <p className="text-slate-300">weights entered</p>
          </div>
        </header>

        <section className="grid md:grid-cols-3 gap-5">
          {workouts.map((workout) => (
            <article key={workout.day} className="rounded-3xl bg-white/10 border border-white/10 p-5 shadow-xl">
              <p className="inline-block rounded-full bg-green-400/20 text-green-200 px-3 py-1 text-sm font-bold mb-3">
                {workout.day}
              </p>
              <h2 className="text-2xl font-black">{workout.title}</h2>
              <p className="text-slate-300 mb-4">{workout.focus}</p>

              <div className="space-y-4">
                {workout.exercises.map((exercise) => {
                  const key = `${workout.day}-${exercise.name}`;
                  return (
                    <div key={key} className="border-t border-white/10 pt-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-black">{exercise.name}</h3>
                          <p className="text-slate-300 text-sm">
                            {exercise.sets} sets x {exercise.reps}
                          </p>
                        </div>
                        {!exercise.needsWeight && (
                          <span className="text-xs rounded-full bg-slate-800 px-2 py-1 text-slate-300">
                            No weight
                          </span>
                        )}
                      </div>

                      {exercise.needsWeight && (
                        <input
                          className="mt-3 w-full rounded-xl bg-slate-900 border border-white/10 p-3 text-white"
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

        <button
          className="mt-8 rounded-xl bg-white/10 border border-white/10 px-5 py-3 font-bold text-slate-200"
          onClick={() => setLoggedIn(false)}
        >
          Log out
        </button>
      </div>
    </main>
  );
}
