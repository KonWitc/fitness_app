import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../api/generated/models/create_exercise_dto.dart';
import '../../api/generated/models/exercise_entity.dart';
import '../../api/generated/models/update_exercise_dto.dart';
import '../../core/api.dart';

/// Selected category chip; `null` means all.
final categoryFilterProvider = NotifierProvider<CategoryFilter, String?>(
  CategoryFilter.new,
);

class CategoryFilter extends Notifier<String?> {
  @override
  String? build() => null;

  void set(String? category) => state = category;
}

/// Exercise list for the current filter. Re-fetches when the filter changes.
final exercisesProvider = FutureProvider<List<ExerciseEntity>>((ref) {
  final category = ref.watch(categoryFilterProvider);
  return ref.watch(apiProvider).exercises.findAll(category: category);
});

/// Writes go through here so the list refreshes afterwards.
final exerciseActionsProvider = Provider(ExerciseActions.new);

class ExerciseActions {
  ExerciseActions(this._ref);

  final Ref _ref;

  Future<void> create(CreateExerciseDto dto) async {
    await _ref.read(apiProvider).exercises.create(body: dto);
    _ref.invalidate(exercisesProvider);
  }

  Future<void> update(String id, UpdateExerciseDto dto) async {
    await _ref.read(apiProvider).exercises.update(id: id, body: dto);
    _ref.invalidate(exercisesProvider);
  }

  Future<void> delete(String id) async {
    await _ref.read(apiProvider).exercises.remove(id: id);
    _ref.invalidate(exercisesProvider);
  }
}
