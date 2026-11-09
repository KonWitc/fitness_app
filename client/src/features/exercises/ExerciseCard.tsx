import { type Exercise } from '../../services/exercises';
import { CATEGORY_COLORS, getYoutubeId } from './utils';

export default function ExerciseCard({
  exercise,
  onDelete,
}: {
  exercise: Exercise;
  onDelete: () => void;
}) {
  return (
    <div className="card fade-in">
      <div className="card-header">
        <h3 className="card-title">{exercise.name}</h3>
        <button
          onClick={onDelete}
          className="btn btn-ghost btn-sm"
          aria-label={`Delete ${exercise.name}`}
          style={{ color: 'var(--text-tertiary)' }}
        >
          &times;
        </button>
      </div>

      <div
        className="mb-2"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}
      >
        <span className={CATEGORY_COLORS[exercise.category] || 'badge'}>
          {exercise.category}
        </span>
      </div>

      {exercise.videoUrl &&
        (() => {
          const ytId = getYoutubeId(exercise.videoUrl!);
          return ytId ? (
            <div
              className="rounded-lg mb-2"
              style={{ aspectRatio: '16 / 9', overflow: 'hidden' }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                title={`${exercise.name} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          ) : (
            <a
              href={exercise.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm mb-2 block"
            >
              Watch video
            </a>
          );
        })()}

      {exercise.imageUrl && !exercise.videoUrl && (
        <img
          src={exercise.imageUrl}
          alt={exercise.name}
          className="rounded-lg mb-2"
          style={{ width: '100%', objectFit: 'cover', maxHeight: '10rem' }}
        />
      )}

      {exercise.description && (
        <p className="m-0 text-sm">{exercise.description}</p>
      )}
    </div>
  );
}
