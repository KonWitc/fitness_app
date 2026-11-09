import 'package:flutter/material.dart';

import '../../api/generated/models/exercise_entity.dart';

const categories = ['strength', 'cardio', 'flexibility'];
const muscleGroups = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'];

/// Exercises without a muscle group are listed under this heading.
const generalGroup = 'general';
const _groupOrder = [...muscleGroups, generalGroup];

String capitalize(String s) =>
    s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);

/// Groups exercises by muscle group in a fixed order; unknown groups go last
/// (alphabetically) instead of being dropped.
List<(String group, List<ExerciseEntity> items)> groupExercises(
  List<ExerciseEntity> exercises,
) {
  final map = <String, List<ExerciseEntity>>{};
  for (final e in exercises) {
    (map[e.muscleGroup ?? generalGroup] ??= []).add(e);
  }
  int rank(String g) {
    final i = _groupOrder.indexOf(g);
    return i == -1 ? _groupOrder.length : i;
  }

  final keys = map.keys.toList()
    ..sort((a, b) {
      final byRank = rank(a).compareTo(rank(b));
      return byRank != 0 ? byRank : a.compareTo(b);
    });
  return [for (final k in keys) (k, map[k]!)];
}

final _youtubeId = RegExp(
  r'(?:youtube\.com/(?:watch\?v=|embed/|v/|shorts/)|youtu\.be/)([A-Za-z0-9_-]{11})',
);

String? youtubeId(String url) => _youtubeId.firstMatch(url)?.group(1);

/// Badge colors per category, readable in light and dark mode.
Color categoryColor(String category) => switch (category) {
  'strength' => Colors.blue,
  'cardio' => Colors.green,
  'flexibility' => Colors.amber.shade700,
  _ => Colors.grey,
};
