import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../auth/account_menu.dart';
import '../../core/api.dart';
import '../../core/config.dart';
import '../../core/theme.dart';
import '../../widgets/responsive_grid.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Fitness Tracker'),
        actions: const [ThemeToggleButton(), AccountMenuButton()],
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 960),
              child: Column(
                spacing: 32,
                children: [
                  Column(
                    spacing: 8,
                    children: [
                      Text(
                        'Fitness Tracker',
                        style: text.displaySmall,
                        textAlign: TextAlign.center,
                      ),
                      Text(
                        'Track your workouts, set goals, and achieve results',
                        style: text.titleMedium,
                        textAlign: TextAlign.center,
                      ),
                      const _ApiStatus(),
                    ],
                  ),
                  ResponsiveGrid(
                    minItemWidth: 260,
                    children: [
                      _FeatureCard(
                        icon: Icons.menu_book,
                        title: 'Exercise Library',
                        description:
                            'Browse exercises by category and muscle group',
                        onTap: () => context.go('/exercises'),
                      ),
                      _FeatureCard(
                        icon: Icons.fitness_center,
                        title: 'Workout Tracking',
                        description:
                            'Log your workouts and track sets, reps, and weights',
                        onTap: () => context.go('/workouts'),
                      ),
                      const _FeatureCard(
                        icon: Icons.flag,
                        title: 'Goal Setting',
                        description:
                            'Set fitness goals and monitor your progress (coming soon)',
                      ),
                    ],
                  ),
                  Text(
                    'Coming soon: AI training assistant, progress analytics, and more!',
                    style: text.bodyMedium,
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Small indicator so a wrong API_BASE_URL is obvious during development.
class _ApiStatus extends ConsumerWidget {
  const _ApiStatus();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final (label, color) = switch (ref.watch(apiHealthProvider)) {
      AsyncData(value: true) => ('API connected', Colors.green),
      AsyncData() || AsyncError() => (
        'API unreachable at $apiBaseUrl',
        Theme.of(context).colorScheme.error,
      ),
      _ => ('Checking API...', Colors.grey),
    };
    return ActionChip(
      avatar: Icon(Icons.circle, size: 10, color: color),
      label: Text(label),
      tooltip: 'Check again',
      onPressed: () => ref.invalidate(apiHealthProvider),
    );
  }
}

class _FeatureCard extends StatelessWidget {
  const _FeatureCard({
    required this.icon,
    required this.title,
    required this.description,
    this.onTap,
  });

  final IconData icon;
  final String title;
  final String description;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: 8,
            children: [
              Icon(
                icon,
                size: 36,
                color: onTap != null
                    ? theme.colorScheme.primary
                    : theme.disabledColor,
              ),
              Text(title, style: theme.textTheme.titleLarge),
              Text(description, style: theme.textTheme.bodyMedium),
            ],
          ),
        ),
      ),
    );
  }
}
