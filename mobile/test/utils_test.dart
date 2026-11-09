import 'package:fitness_app/api/generated/models/workout_exercise_entity.dart';
import 'package:fitness_app/features/exercises/exercise_utils.dart';
import 'package:fitness_app/features/workouts/workouts_page.dart';
import 'package:flutter_test/flutter_test.dart';

import 'helpers.dart';

void main() {
  group('groupExercises', () {
    test('orders by muscle group, general and unknown groups last', () {
      final groups = groupExercises([
        exercise('Running', category: 'cardio'),
        exercise('Squats', muscleGroup: 'legs'),
        exercise('Neck curl', muscleGroup: 'neck'),
        exercise('Bench Press', muscleGroup: 'chest'),
        exercise('Lunges', muscleGroup: 'legs'),
      ]);

      expect(groups.map((g) => g.$1), ['chest', 'legs', 'general', 'neck']);
      expect(groups[1].$2.map((e) => e.name), ['Squats', 'Lunges']);
    });
  });

  group('youtubeId', () {
    test('parses watch, short and shorts links', () {
      expect(
        youtubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
        'dQw4w9WgXcQ',
      );
      expect(youtubeId('https://youtu.be/dQw4w9WgXcQ?t=3'), 'dQw4w9WgXcQ');
      expect(
        youtubeId('https://youtube.com/shorts/dQw4w9WgXcQ'),
        'dQw4w9WgXcQ',
      );
    });

    test('returns null for other links', () {
      expect(youtubeId('https://vimeo.com/123'), isNull);
    });
  });

  group('describeSet', () {
    WorkoutExerciseEntity entry({
      int? sets,
      int? reps,
      num? weight,
      int? duration,
    }) {
      return WorkoutExerciseEntity(
        id: 'x',
        workoutId: 'w',
        exerciseId: 'e',
        exercise: exercise('Bench Press'),
        sets: sets,
        reps: reps,
        weight: weight,
        duration: duration,
        notes: null,
        order: 0,
        createdAt: DateTime.utc(2026),
      );
    }

    test('formats strength and cardio entries', () {
      expect(describeSet(entry(sets: 4, reps: 8, weight: 70)), '4 × 8 @ 70 kg');
      expect(describeSet(entry(sets: 3, reps: 12)), '3 × 12');
      expect(describeSet(entry(weight: 22.5, sets: 3)), '3 sets @ 22.5 kg');
      expect(describeSet(entry(duration: 1200)), '20 min');
      expect(describeSet(entry(duration: 90)), '1:30 min');
    });
  });
}
