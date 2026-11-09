import { Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { toggleTheme, getTheme } from './utils/themeUtils';
import Layout from './components/Layout';
import ExerciseLibrary from './features/exercises';
import DashboardLayout from './components/Example';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState(getTheme);

  const handleToggle = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
  };

  return (
    <button
      className="btn btn-ghost"
      onClick={handleToggle}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <span>☀️ Light</span> : <span>🌙 Dark</span>}
    </button>
  );
};

function Home() {
  return (
    <div className="app-container">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Fitness Tracker
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Track your workouts, set goals, and achieve results
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <FeatureCard
          title="Exercise Library"
          description="Browse exercises by category and muscle group"
          icon="📚"
          to="/exercises"
        />
        <FeatureCard
          title="Workout Tracking"
          description="Log your workouts and track sets, reps, and weights"
          icon="💪"
        />
        <FeatureCard
          title="Goal Setting"
          description="Set fitness goals and monitor your progress"
          icon="🎯"
        />
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Coming soon: Progress analytics, meal tracking, and more!
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/exercises" element={<ExerciseLibrary />} />
        <Route
          path="/workouts"
          element={<DashboardLayout children={undefined} />}
        />
      </Route>
    </Routes>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  to,
}: {
  title: string;
  description: string;
  icon: string;
  to?: string;
}) {
  const content = (
    <>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer block"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      {content}
    </div>
  );
}

export default App;
