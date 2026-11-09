import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../api/generated/models/workout_entity.dart';
import '../../core/api.dart';
import '../../core/auth/auth_controller.dart';

/// The signed-in user's workouts, newest first (the API scopes them by token).
final workoutsProvider = FutureProvider<List<WorkoutEntity>>((ref) {
  ref.watch(currentUserIdProvider); // refetch when the account changes
  return ref.watch(apiProvider).workouts.findAll();
});
