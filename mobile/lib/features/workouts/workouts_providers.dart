import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../api/generated/models/workout_entity.dart';
import '../../core/api.dart';

/// All workouts, newest first. Scoped to the signed-in user once auth exists.
final workoutsProvider = FutureProvider<List<WorkoutEntity>>(
  (ref) => ref.watch(apiProvider).workouts.findAll(),
);
