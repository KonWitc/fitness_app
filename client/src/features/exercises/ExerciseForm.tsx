import { useState } from 'react';
import { type CreateExerciseInput } from '../../services/exercises';

export default function ExerciseForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: CreateExerciseInput) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('strength');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, description, category, muscleGroup, imageUrl, videoUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="card mb-4">
      <h3 style={{ margin: '0 0 var(--spacing-lg)' }}>New Exercise</h3>
      <div className="grid grid-cols-2">
        <div className="form-group">
          <label className="form-label">Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="e.g. Bench Press"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
          >
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Muscle Group</label>
          <select
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            className="form-select"
          >
            <option value="">— None —</option>
            <option value="chest">Chest</option>
            <option value="back">Back</option>
            <option value="legs">Legs</option>
            <option value="shoulders">Shoulders</option>
            <option value="arms">Arms</option>
            <option value="core">Core</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
            placeholder="Optional description"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="form-input"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Video URL</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="form-input"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button type="submit" className="btn btn-primary">
          Create
        </button>
        <button type="button" onClick={onCancel} className="btn btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}
