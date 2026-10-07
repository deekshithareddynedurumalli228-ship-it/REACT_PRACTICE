import { useEffect, useMemo, useState } from "react";
import "./App.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DEFAULT_HABITS = [
  {
    id: 1,
    name: "Practice SQL",
    category: "Study",
    priority: "High",
    days: [true, true, false, true, false, false, false],
  },
  {
    id: 2,
    name: "Drink 2L Water",
    category: "Health",
    priority: "Medium",
    days: [true, true, true, false, false, false, false],
  },
  {
    id: 3,
    name: "Practice English",
    category: "Personal",
    priority: "Medium",
    days: [true, false, true, false, false, false, false],
  },
];

// ---------- Utility Functions ----------

function getCurrentStreak(days) {
  let streak = 0;

  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i]) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function getBestStreak(days) {
  let current = 0;
  let best = 0;

  days.forEach((day) => {
    if (day) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  });

  return best;
}

function getCompletedDays(habits) {
  return habits.reduce(
    (total, habit) =>
      total + habit.days.filter(Boolean).length,
    0
  );
}

// ---------- Header ----------

function Header({ darkMode, setDarkMode }) {
  return (
    <header className="header">
      <div className="brand">
        <div className="logo">🔥</div>

        <div>
          <h1>HabitHero</h1>
          <p>Build better habits. Become better.</p>
        </div>
      </div>

      <div className="header-right">
        <div className="week-info">
          <span>THIS WEEK</span>
          <strong>7 Days</strong>
        </div>

        <button
          className="theme-button"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}

// ---------- Welcome ----------

function WelcomeSection({ progress }) {
  return (
    <section className="welcome">
      <div>
        <span className="small-title">
          WELCOME BACK, HERO 👋
        </span>

        <h2>
          Build habits that
          <span> build you.</span>
        </h2>

        <p>
          Stay consistent, track your progress and
          become 1% better every day.
        </p>
      </div>

      <div className="welcome-progress">
        <div className="progress-ring">
          <div className="ring-center">
            <strong>{progress}%</strong>
            <small>Weekly</small>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Stats ----------

function Stats({ habits }) {
  const completed = getCompletedDays(habits);

  const total = habits.length * 7;

  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  const currentStreak =
    habits.length === 0
      ? 0
      : Math.max(
          ...habits.map((habit) =>
            getCurrentStreak(habit.days)
          )
        );

  const bestStreak =
    habits.length === 0
      ? 0
      : Math.max(
          ...habits.map((habit) =>
            getBestStreak(habit.days)
          )
        );

  return (
    <section className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon blue">📋</div>
        <div>
          <span>Total Habits</span>
          <strong>{habits.length}</strong>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon green">✅</div>
        <div>
          <span>Completed</span>
          <strong>{completed}</strong>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon orange">🔥</div>
        <div>
          <span>Current Streak</span>
          <strong>{currentStreak}</strong>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon purple">🏆</div>
        <div>
          <span>Best Streak</span>
          <strong>{bestStreak}</strong>
        </div>
      </div>
    </section>
  );
}

// ---------- Add Habit ----------

function AddHabit({ onAdd }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Study");
  const [priority, setPriority] = useState("Medium");

  const submitHabit = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    onAdd({
      name: name.trim(),
      category,
      priority,
    });

    setName("");
    setCategory("Study");
    setPriority("Medium");
  };

  return (
    <section className="card add-card">
      <div className="card-title">
        <div>
          <h2>➕ Create New Habit</h2>
          <p>Turn your goals into daily actions.</p>
        </div>
      </div>

      <form className="add-form" onSubmit={submitHabit}>
        <input
          type="text"
          placeholder="Enter habit name..."
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
        />

        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
        >
          <option>Study</option>
          <option>Health</option>
          <option>Fitness</option>
          <option>Personal</option>
          <option>Work</option>
        </select>

        <select
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value)
          }
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <button type="submit">
          + Add Habit
        </button>
      </form>
    </section>
  );
}

// ---------- Today's Focus ----------

function TodayFocus({ habits, onToggle }) {
  const todayIndex = new Date().getDay();

  // Convert Sunday=0 to Monday=0
  const index =
    todayIndex === 0 ? 6 : todayIndex - 1;

  const todayName = DAYS[index];

  return (
    <section className="card today-card">
      <div className="card-title">
        <div>
          <h2>🎯 Today's Focus</h2>
          <p>
            Complete your habits for {todayName}
          </p>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="small-empty">
          Add a habit to start your day.
        </div>
      ) : (
        <div className="today-list">
          {habits.map((habit) => (
            <div className="today-item" key={habit.id}>
              <button
                className={`today-check ${
                  habit.days[index]
                    ? "checked"
                    : ""
                }`}
                onClick={() =>
                  onToggle(habit.id, index)
                }
              >
                {habit.days[index] ? "✓" : ""}
              </button>

              <div className="today-name">
                <strong>{habit.name}</strong>
                <span>{habit.category}</span>
              </div>

              <span
                className={`priority ${habit.priority.toLowerCase()}`}
              >
                {habit.priority}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ---------- Weekly Habit Grid ----------

function HabitGrid({
  habits,
  search,
  setSearch,
  onToggle,
  onDelete,
}) {
  const filteredHabits = habits.filter((habit) =>
    habit.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="card weekly-card">
      <div className="weekly-header">
        <div>
          <h2>📅 Weekly Habit Tracker</h2>
          <p>
            Click any day to mark your habit complete.
          </p>
        </div>

        <div className="search">
          🔍
          <input
            placeholder="Search habits..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>
      </div>

      <div className="grid-wrapper">
        <div className="grid-header">
          <div>HABIT</div>

          {DAYS.map((day) => (
            <div key={day}>{day}</div>
          ))}

          <div>STREAK</div>
          <div></div>
        </div>

        {filteredHabits.length === 0 ? (
          <div className="no-results">
            <span>🔍</span>
            <h3>No habits found</h3>
            <p>Try another search.</p>
          </div>
        ) : (
          filteredHabits.map((habit) => {
            const streak = getCurrentStreak(
              habit.days
            );

            return (
              <div className="habit-row" key={habit.id}>
                <div className="habit-details">
                  <strong>{habit.name}</strong>

                  <div>
                    <span className="category">
                      {habit.category}
                    </span>

                    <span
                      className={`priority-dot ${habit.priority.toLowerCase()}`}
                    >
                      {habit.priority}
                    </span>
                  </div>
                </div>

                {habit.days.map(
                  (completed, index) => (
                    <button
                      className={`day-box ${
                        completed ? "done" : ""
                      }`}
                      key={index}
                      onClick={() =>
                        onToggle(
                          habit.id,
                          index
                        )
                      }
                    >
                      {completed ? "✓" : ""}
                    </button>
                  )
                )}

                <div className="row-streak">
                  🔥 {streak}
                </div>

                <button
                  className="delete"
                  onClick={() =>
                    onDelete(habit.id)
                  }
                  title="Delete habit"
                >
                  🗑️
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

// ---------- Achievements ----------

function Achievements({ habits }) {
  const completed = getCompletedDays(habits);

  const achievements = [
    {
      icon: "🌱",
      title: "First Step",
      text: "Create your first habit",
      unlocked: habits.length >= 1,
    },
    {
      icon: "🔥",
      title: "Getting Hot",
      text: "Complete 5 habit days",
      unlocked: completed >= 5,
    },
    {
      icon: "⭐",
      title: "Consistency",
      text: "Complete 10 habit days",
      unlocked: completed >= 10,
    },
    {
      icon: "🏆",
      title: "Habit Hero",
      text: "Complete 20 habit days",
      unlocked: completed >= 20,
    },
  ];

  return (
    <section className="card">
      <div className="card-title">
        <div>
          <h2>🏆 Achievements</h2>
          <p>Keep going and unlock them all.</p>
        </div>
      </div>

      <div className="achievements">
        {achievements.map((item) => (
          <div
            className={`achievement ${
              item.unlocked ? "unlocked" : ""
            }`}
            key={item.title}
          >
            <div className="achievement-icon">
              {item.icon}
            </div>

            <div>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>

            <span>
              {item.unlocked ? "✓" : "🔒"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Main App ----------

function App() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem(
      "habitHeroHabitsV3"
    );

    if (saved) {
      return JSON.parse(saved);
    }

    return DEFAULT_HABITS;
  });

  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem(
        "habitHeroDarkMode"
      ) === "true"
    );
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "habitHeroHabitsV3",
      JSON.stringify(habits)
    );
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(
      "habitHeroDarkMode",
      darkMode
    );
  }, [darkMode]);

  const addHabit = (habitData) => {
    const newHabit = {
      id: Date.now(),
      name: habitData.name,
      category: habitData.category,
      priority: habitData.priority,
      days: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
    };

    setHabits((previous) => [
      ...previous,
      newHabit,
    ]);
  };

  const toggleDay = (habitId, dayIndex) => {
    setHabits((previous) =>
      previous.map((habit) => {
        if (habit.id !== habitId) {
          return habit;
        }

        const updatedDays = [...habit.days];

        updatedDays[dayIndex] =
          !updatedDays[dayIndex];

        return {
          ...habit,
          days: updatedDays,
        };
      })
    );
  };

  const deleteHabit = (habitId) => {
    const confirmDelete = window.confirm(
      "Delete this habit?"
    );

    if (!confirmDelete) {
      return;
    }

    setHabits((previous) =>
      previous.filter(
        (habit) => habit.id !== habitId
      )
    );
  };

  const completed = getCompletedDays(habits);

  const total = habits.length * 7;

  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  const productivityScore = useMemo(() => {
    if (habits.length === 0) {
      return 0;
    }

    const score = Math.min(
      100,
      Math.round(progress * 1.15)
    );

    return score;
  }, [progress, habits.length]);

  return (
    <div
      className={`app ${
        darkMode ? "dark" : ""
      }`}
    >
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="container">

        <WelcomeSection progress={progress} />

        <Stats habits={habits} />

        <div className="main-grid">

          <div className="left-column">

            <AddHabit onAdd={addHabit} />

            <TodayFocus
              habits={habits}
              onToggle={toggleDay}
            />

          </div>

          <aside className="side-column">

            <div className="score-card">
              <span>PRODUCTIVITY SCORE</span>

              <strong>
                {productivityScore}
              </strong>

              <small>
                {productivityScore >= 80
                  ? "Excellent work! 🔥"
                  : "Keep improving! 💪"}
              </small>

              <div className="score-bar">
                <div
                  style={{
                    width: `${productivityScore}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="motivation-card">
              <span>💡 DAILY MOTIVATION</span>

              <h3>
                “Success is the sum of small
                efforts repeated every day.”
              </h3>

              <p>
                — HabitHero
              </p>
            </div>

          </aside>
        </div>

        <HabitGrid
          habits={habits}
          search={search}
          setSearch={setSearch}
          onToggle={toggleDay}
          onDelete={deleteHabit}
        />

        <Achievements habits={habits} />

        <footer>
          <strong>HabitHero</strong>
          <span>
            Small steps. Big progress. 🚀
          </span>
        </footer>

      </main>
    </div>
  );
}

export default App;