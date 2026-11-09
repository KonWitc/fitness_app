import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getExercises,
  createExercise,
  deleteExercise,
  type Exercise,
  type CreateExerciseInput,
} from '../../services/exercises';
import { CATEGORIES, capitalize, groupExercises } from './utils';
import ExerciseCard from './ExerciseCard';
import ExerciseForm from './ExerciseForm';

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filters: Record<string, string> = {};
      if (categoryFilter !== 'all') filters.category = categoryFilter;
      const data = await getExercises(filters);
      setExercises(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const grouped = useMemo(() => groupExercises(exercises), [exercises]);

  const handleCreate = async (input: CreateExerciseInput) => {
    try {
      await createExercise({
        ...input,
        description: input.description || undefined,
        muscleGroup: input.muscleGroup || undefined,
        imageUrl: input.imageUrl || undefined,
        videoUrl: input.videoUrl || undefined,
      });
      setShowForm(false);
      fetchExercises();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this exercise?')) return;
    try {
      await deleteExercise(id);
      fetchExercises();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return (
    <div className="app-content">
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ margin: 0 }}>Exercise Library</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary btn-sm"
        >
          + Add Exercise
        </button>
      </div>

      {error && (
        <div
          className="rounded-lg mb-3 p-3"
          style={{
            background: 'rgba(255, 82, 82, 0.1)',
            color: 'var(--danger)',
          }}
        >
          {error}
        </div>
      )}

      {showForm && (
        <ExerciseForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Category Filter */}
      <div className="mb-4">
        <span className="text-sm font-semibold text-secondary block mb-1">
          Category
        </span>
        <div className="nav" style={{ flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`nav-item ${categoryFilter === cat ? 'active' : ''}`}
            >
              {capitalize(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Exercise List */}
      {loading ? (
        <div
          className="flex justify-center"
          style={{ paddingTop: 'var(--spacing-3xl)' }}
        >
          <div className="spinner" />
        </div>
      ) : grouped.length === 0 ? (
        <div
          className="text-center text-secondary"
          style={{ padding: 'var(--spacing-3xl) var(--spacing-xl)' }}
        >
          No exercises found. Try adjusting filters or add a new one.
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-2xl)',
          }}
        >
          {grouped.map(([group, items]) => (
            <div key={group}>
              <h3 className="flex items-center gap-1">
                <span
                  style={{
                    width: '2rem',
                    height: '3px',
                    background: 'var(--primary)',
                    borderRadius: 'var(--radius-full)',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                {capitalize(group)}
                <span className="text-sm font-normal text-tertiary">
                  ({items.length})
                </span>
              </h3>
              <div className="grid grid-cols-3">
                {items.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onDelete={() => handleDelete(exercise.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
