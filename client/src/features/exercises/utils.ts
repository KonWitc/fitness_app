import { type Exercise } from '../../services/exercises';

export const CATEGORIES = ['all', 'strength', 'cardio', 'flexibility'];

export const CATEGORY_COLORS: Record<string, string> = {
  strength: 'badge badge-info',
  cardio: 'badge badge-success',
  flexibility: 'badge badge-warning',
};

const GROUP_ORDER = [
  'chest',
  'back',
  'legs',
  'shoulders',
  'arms',
  'core',
  'general',
];

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function groupExercises(exercises: Exercise[]): [string, Exercise[]][] {
  const map = new Map<string, Exercise[]>();

  for (const ex of exercises) {
    const key = ex.muscleGroup || 'general';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(ex);
  }

  return GROUP_ORDER.filter((g) => map.has(g)).map((g) => [g, map.get(g)!]);
}
