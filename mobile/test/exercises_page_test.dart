import 'package:fitness_app/api/generated/models/exercise_entity.dart';
import 'package:fitness_app/core/auth/token_store.dart';
import 'package:fitness_app/features/exercises/exercises_page.dart';
import 'package:fitness_app/features/exercises/exercises_providers.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'helpers.dart';

Widget _app(Future<List<ExerciseEntity>> Function(String? category) fetch) {
  return ProviderScope(
    retry: (_, _) => null,
    overrides: [
      // The app bar's account menu reads the (empty) saved session.
      secureStoreProvider.overrideWithValue(MemorySecureStore()),
      exercisesProvider.overrideWith(
        (ref) => fetch(ref.watch(categoryFilterProvider)),
      ),
    ],
    child: const MaterialApp(home: ExercisesPage()),
  );
}

void main() {
  final all = [
    exercise('Bench Press', muscleGroup: 'chest', description: 'Press it.'),
    exercise('Squats', muscleGroup: 'legs'),
    exercise('Running', category: 'cardio'),
  ];

  testWidgets('shows exercises grouped by muscle group', (tester) async {
    await tester.pumpWidget(_app((_) async => all));
    await tester.pumpAndSettle();

    expect(find.text('Chest'), findsOneWidget);
    expect(find.text('Legs'), findsOneWidget);
    expect(find.text('General'), findsOneWidget);
    expect(find.text('Bench Press'), findsOneWidget);
    expect(find.text('Press it.'), findsOneWidget);
  });

  testWidgets('category chip re-fetches with that category', (tester) async {
    final requested = <String?>[];
    await tester.pumpWidget(
      _app((category) async {
        requested.add(category);
        return all
            .where((e) => category == null || e.category == category)
            .toList();
      }),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.widgetWithText(ChoiceChip, 'Cardio'));
    await tester.pumpAndSettle();

    expect(requested, [null, 'cardio']);
    expect(find.text('Running'), findsOneWidget);
    expect(find.text('Bench Press'), findsNothing);
  });

  testWidgets('shows the empty state', (tester) async {
    await tester.pumpWidget(_app((_) async => []));
    await tester.pumpAndSettle();
    expect(find.textContaining('No exercises found'), findsOneWidget);
  });

  testWidgets('shows the error state with retry', (tester) async {
    var calls = 0;
    await tester.pumpWidget(
      _app((_) async {
        calls++;
        throw Exception('boom');
      }),
    );
    await tester.pumpAndSettle();
    expect(find.text('Failed to load exercises'), findsOneWidget);

    await tester.tap(find.text('Retry'));
    await tester.pumpAndSettle();
    expect(calls, 2);
  });

  testWidgets('add button opens the form with validation', (tester) async {
    await tester.pumpWidget(_app((_) async => all));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Add exercise'));
    await tester.pumpAndSettle();
    expect(find.text('New exercise'), findsOneWidget);

    await tester.tap(find.text('Create'));
    await tester.pumpAndSettle();
    expect(find.text('Name is required'), findsOneWidget);
  });
}
