function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
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
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

export default App;