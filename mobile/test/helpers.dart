import 'package:fitness_app/api/generated/models/exercise_entity.dart';

final _now = DateTime.utc(2026, 1, 1);

ExerciseEntity exercise(
  String name, {
  String category = 'strength',
  String? muscleGroup,
  String? description,
  String? videoUrl,
}) {
  return ExerciseEntity(
    id: name.toLowerCase().replaceAll(' ', '-'),
    name: name,
    description: description,
    category: category,
    muscleGroup: muscleGroup,
    imageUrl: null,
    videoUrl: videoUrl,
    createdAt: _now,
    updatedAt: _now,
  );
}
