import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../api/generated/models/workout_entity.dart';
import '../../api/generated/models/workout_exercise_entity.dart';
import '../auth/account_menu.dart';
import '../../core/api.dart';
import '../../core/theme.dart';
import '../../widgets/async_states.dart';
import 'workouts_providers.dart';

class WorkoutsPage extends ConsumerWidget {
  const WorkoutsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final workouts = ref.watch(workoutsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Workouts'),
        actions: const [ThemeToggleButton(), AccountMenuButton()],
      ),
      body: workouts.when(
        data: (items) => items.isEmpty
            ? const EmptyState('No workouts logged yet.')
            : RefreshIndicator(
                onRefresh: () => ref.refresh(workoutsProvider.future),
                child: ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: items.length,
                  separatorBuilder: (_, _) => const SizedBox(height: 12),
                  itemBuilder: (_, i) => Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 720),
                      child: _WorkoutCard(items[i]),
                    ),
                  ),
                ),
              ),
        error: (error, _) => ErrorState(
          message: errorMessage(error, 'Failed to load workouts'),
          onRetry: () => ref.invalidate(workoutsProvider),
        ),
        loading: () => const LoadingState(),
      ),
    );
  }
}

class _WorkoutCard extends StatelessWidget {
  const _WorkoutCard(this.workout);

  final WorkoutEntity workout;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final date = MaterialLocalizations.of(
      context,
    ).formatMediumDate(workout.date.toLocal());

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 8,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    workout.name ?? 'Workout',
                    style: theme.textTheme.titleMedium,
                  ),
                ),
                Text(
                  [
                    date,
                    if (workout.duration case final d?) '$d min',
                  ].join(' · '),
                  style: theme.textTheme.bodySmall,
                ),
              ],
            ),
            for (final e in workout.exercises)
              Row(
                children: [
                  Expanded(child: Text(e.exercise.name)),
                  Text(
                    describeSet(e),
                    style: theme.textTheme.bodyMedium?.copyWith(
                      fontFeatures: const [FontFeature.tabularFigures()],
                    ),
                  ),
                ],
              ),
            if (workout.notes case final notes?)
              Text(
                notes,
                style: theme.textTheme.bodySmall?.copyWith(
                  fontStyle: FontStyle.italic,
                ),
              ),
          ],
        ),
      ),
    );
  }
}

/// "4 × 8 @ 70 kg", "3 × 12", "20 min" ...
String describeSet(WorkoutExerciseEntity e) {
  final parts = <String>[
    if (e.sets != null && e.reps != null)
      '${e.sets} × ${e.reps}'
    else if (e.sets != null)
      '${e.sets} sets'
    else if (e.reps != null)
      '${e.reps} reps',
    if (e.weight case final w?) '@ ${_trim(w)} kg',
    if (e.duration case final s?) _duration(s),
  ];
  return parts.join(' ');
}

String _trim(num n) => n == n.roundToDouble() ? n.toInt().toString() : '$n';

String _duration(int seconds) => seconds % 60 == 0
    ? '${seconds ~/ 60} min'
    : '${seconds ~/ 60}:${(seconds % 60).toString().padLeft(2, '0')} min';
