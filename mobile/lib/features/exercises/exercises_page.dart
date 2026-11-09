import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../api/generated/models/exercise_entity.dart';
import '../auth/account_menu.dart';
import '../../core/api.dart';
import '../../core/theme.dart';
import '../../widgets/async_states.dart';
import '../../widgets/responsive_grid.dart';
import 'exercise_card.dart';
import 'exercise_form.dart';
import 'exercise_utils.dart';
import 'exercises_providers.dart';

class ExercisesPage extends ConsumerWidget {
  const ExercisesPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final exercises = ref.watch(exercisesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Exercise Library'),
        actions: const [ThemeToggleButton(), AccountMenuButton()],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => showExerciseForm(context),
        icon: const Icon(Icons.add),
        label: const Text('Add exercise'),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const _CategoryFilter(),
          Expanded(
            // .when keeps showing the current list while it refreshes after a
            // create/edit/delete; changing the filter shows the spinner.
            child: exercises.when(
              data: (value) => value.isEmpty
                  ? const EmptyState(
                      'No exercises found. Try another category or add a new one.',
                    )
                  : RefreshIndicator(
                      onRefresh: () => ref.refresh(exercisesProvider.future),
                      child: _GroupedList(exercises: value),
                    ),
              error: (error, _) => ErrorState(
                message: errorMessage(error, 'Failed to load exercises'),
                onRetry: () => ref.invalidate(exercisesProvider),
              ),
              loading: () => const LoadingState(),
            ),
          ),
        ],
      ),
    );
  }
}

class _CategoryFilter extends ConsumerWidget {
  const _CategoryFilter();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selected = ref.watch(categoryFilterProvider);
    final filter = ref.read(categoryFilterProvider.notifier);

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 8),
      child: Row(
        spacing: 8,
        children: [
          ChoiceChip(
            label: const Text('All'),
            selected: selected == null,
            onSelected: (_) => filter.set(null),
          ),
          for (final c in categories)
            ChoiceChip(
              label: Text(capitalize(c)),
              selected: selected == c,
              onSelected: (_) => filter.set(c),
            ),
        ],
      ),
    );
  }
}

class _GroupedList extends ConsumerWidget {
  const _GroupedList({required this.exercises});

  final List<ExerciseEntity> exercises;

  Future<void> _delete(
    BuildContext context,
    WidgetRef ref,
    ExerciseEntity exercise,
  ) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete exercise?'),
        content: Text('"${exercise.name}" will be removed from the library.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    if (confirmed != true) return;

    try {
      await ref.read(exerciseActionsProvider).delete(exercise.id);
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(errorMessage(e, 'Failed to delete'))),
      );
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final groups = groupExercises(exercises);
    final text = Theme.of(context).textTheme;
    final primary = Theme.of(context).colorScheme.primary;

    return ListView(
      // Extra bottom padding so the FAB doesn't cover the last card.
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 96),
      children: [
        for (final (group, items) in groups) ...[
          Padding(
            padding: const EdgeInsets.only(top: 16, bottom: 12),
            child: Row(
              spacing: 8,
              children: [
                Container(width: 24, height: 3, color: primary),
                Text(capitalize(group), style: text.titleLarge),
                Text('(${items.length})', style: text.bodyMedium),
              ],
            ),
          ),
          ResponsiveGrid(
            children: [
              for (final exercise in items)
                ExerciseCard(
                  key: ValueKey(exercise.id),
                  exercise: exercise,
                  onEdit: () => showExerciseForm(context, exercise: exercise),
                  onDelete: () => _delete(context, ref, exercise),
                ),
            ],
          ),
        ],
      ],
    );
  }
}
