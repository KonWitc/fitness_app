import { NavLink, Outlet } from 'react-router-dom';
import { ThemeToggle } from '../App';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/exercises', label: 'Exercises', icon: '📚' },
  { to: '/workouts', label: 'Workouts', icon: '💪' },
];

export default function Layout() {
  return (
    <div className="app-container">
      <nav className="app-header">
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          Fitness Tracker
        </span>
        <div className="nav">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className="nav-item">
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
          <ThemeToggle />
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
