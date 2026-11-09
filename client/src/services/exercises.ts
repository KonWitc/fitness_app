const BASE_URL = '/api/exercises';

export interface Exercise {
  id: string;
  name: string;
  description: string | null;
  category: string;
  muscleGroup: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExerciseInput {
  name: string;
  description?: string;
  category: string;
  muscleGroup?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface UpdateExerciseInput {
  name?: string;
  description?: string;
  category?: string;
  muscleGroup?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export async function getExercises(filters?: {
  category?: string;
  muscleGroup?: string;
}): Promise<Exercise[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.muscleGroup) params.set('muscleGroup', filters.muscleGroup);

  const query = params.toString();
  const res = await fetch(`${BASE_URL}${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch exercises');
  return res.json();
}

export async function getExercise(id: string): Promise<Exercise> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch exercise');
  return res.json();
}

export async function createExercise(
  input: CreateExerciseInput
): Promise<Exercise> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to create exercise');
  }
  return res.json();
}

export async function updateExercise(
  id: string,
  input: UpdateExerciseInput
): Promise<Exercise> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to update exercise');
  }
  return res.json();
}

export async function deleteExercise(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete exercise');
}
