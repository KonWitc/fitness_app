# Fitness App

A full-stack fitness tracking application built with React, Node.js, and SQLite.

## Tech Stack

### Frontend
- **React** with Vite for fast development
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ESLint & Prettier** for code quality

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma ORM** for database operations
- **SQLite** for data persistence

## Features (Planned)

- [ ] Exercise library with categories and muscle groups
- [ ] Workout tracking and logging
- [ ] Goal setting and progress tracking
- [ ] Progress analytics and charts
- [ ] Meal/nutrition tracking
- [ ] User authentication

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fitness_app
   ```

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Set up the database**
   ```bash
   # In the server directory
   cp .env.example .env
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database (optional)**
   ```bash
   npx prisma db seed
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The API will be available at `http://localhost:3001`

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

## Project Structure

```
fitness_app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── ...
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Utility functions
│   └── prisma/
│       └── schema.prisma   # Database schema
└── ...
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if the server is running

### Exercises (Coming Soon)
- `GET /api/exercises` - Get all exercises
- `GET /api/exercises/:id` - Get exercise by ID
- `POST /api/exercises` - Create a new exercise
- `PUT /api/exercises/:id` - Update an exercise
- `DELETE /api/exercises/:id` - Delete an exercise

### Workouts (Coming Soon)
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/:id` - Get workout by ID
- `POST /api/workouts` - Create a new workout
- `PUT /api/workouts/:id` - Update a workout
- `DELETE /api/workouts/:id` - Delete a workout

## Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm run start` - Run compiled JavaScript
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## License

MIT
