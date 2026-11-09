import React, {
  useState,
  useEffect,
  type ReactNode,
  type FormEvent,
} from 'react';
import { initTheme, toggleTheme, getTheme } from '../utils/themeUtils';

// Type Definitions
interface Workout {
  name: string;
  date: string;
  type: string;
  duration: number;
  calories: number;
}

interface DashboardLayoutProps {
  children: ReactNode;
}

interface WorkoutCardProps {
  workout: Workout;
}

// Theme Toggle Button Component
export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => getTheme() as 'light' | 'dark'
  );

  const handleToggle = (): void => {
    const newTheme = toggleTheme();
    setTheme(newTheme as 'light' | 'dark');
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

// Example Dashboard Layout
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  useEffect(() => {
    initTheme();
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '1.5rem' }}>💪</span>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>FitTracker</h1>
        </div>
        <nav className="nav">
          <a href="#dashboard" className="nav-item active">
            Dashboard
          </a>
          <a href="#workouts" className="nav-item">
            Workouts
          </a>
          <a href="#nutrition" className="nav-item">
            Nutrition
          </a>
          <a href="#progress" className="nav-item">
            Progress
          </a>
        </nav>
        <ThemeToggle />
      </header>

      <div className="app-main">
        {/* Sidebar */}
        <aside className="app-sidebar">
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Quick Stats</h3>
            <div className="list">
              <div className="list-item">
                <span>Today's Calories</span>
                <strong className="text-accent">1,850</strong>
              </div>
              <div className="list-item">
                <span>Workouts This Week</span>
                <strong className="text-accent">5</strong>
              </div>
              <div className="list-item">
                <span>Current Streak</span>
                <strong className="text-accent">12 days</strong>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
};

// Example Stats Grid Component
export const StatsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-4 fade-in">
      <div className="stat-card">
        <div className="stat-label">Calories Today</div>
        <div className="stat-value">1,850</div>
        <div className="stat-change positive">↑ 250 cal</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Active Minutes</div>
        <div className="stat-value">45</div>
        <div className="stat-change positive">↑ 12 min</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Protein (g)</div>
        <div className="stat-value">125</div>
        <div className="stat-change negative">↓ 15g</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Workouts</div>
        <div className="stat-value">3</div>
        <div className="stat-change positive">↑ 1</div>
      </div>
    </div>
  );
};

// Example Workout Card Component
export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">{workout.name}</h3>
          <small>{workout.date}</small>
        </div>
        <span className="badge badge-primary">{workout.type}</span>
      </div>
      <div className="card-body">
        <div className="flex justify-between mb-2">
          <span>Duration</span>
          <strong>{workout.duration} min</strong>
        </div>
        <div className="flex justify-between mb-2">
          <span>Calories Burned</span>
          <strong>{workout.calories} cal</strong>
        </div>
        <div className="progress">
          <div className="progress-bar" style={{ width: '75%' }}></div>
        </div>
      </div>
      <div className="card-footer">
        <button className="btn btn-sm btn-outline">View Details</button>
        <button className="btn btn-sm btn-ghost">Edit</button>
      </div>
    </div>
  );
};

// Example Form Component
export const AddWorkoutForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Cardio',
    duration: '',
    calories: '',
    notes: '',
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3 className="card-title">Add New Workout</h3>

      <div className="form-group">
        <label className="form-label">Workout Name</label>
        <input
          type="text"
          name="name"
          className="form-input"
          placeholder="e.g., Morning Run"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Type</label>
        <select
          name="type"
          className="form-select"
          value={formData.type}
          onChange={handleInputChange}
        >
          <option>Cardio</option>
          <option>Strength</option>
          <option>Flexibility</option>
          <option>Sports</option>
        </select>
      </div>

      <div className="grid grid-cols-2">
        <div className="form-group">
          <label className="form-label">Duration (min)</label>
          <input
            type="number"
            name="duration"
            className="form-input"
            placeholder="30"
            value={formData.duration}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Calories</label>
          <input
            type="number"
            name="calories"
            className="form-input"
            placeholder="250"
            value={formData.calories}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea
          name="notes"
          className="form-textarea"
          placeholder="How did it go?"
          value={formData.notes}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button type="button" className="btn btn-ghost">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Workout
        </button>
      </div>
    </form>
  );
};

export default DashboardLayout;
