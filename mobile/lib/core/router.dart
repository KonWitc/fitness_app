import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../features/exercises/exercises_page.dart';
import '../features/home/home_page.dart';
import '../features/workouts/workouts_page.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    // Each tab keeps its own navigation stack and scroll position.
    StatefulShellRoute.indexedStack(
      builder: (context, state, shell) => AppShell(shell: shell),
      branches: [
        StatefulShellBranch(
          routes: [GoRoute(path: '/', builder: (_, _) => const HomePage())],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/exercises',
              builder: (_, _) => const ExercisesPage(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(path: '/workouts', builder: (_, _) => const WorkoutsPage()),
          ],
        ),
      ],
    ),
  ],
);

const _destinations = [
  (icon: Icons.home_outlined, selected: Icons.home, label: 'Home'),
  (
    icon: Icons.menu_book_outlined,
    selected: Icons.menu_book,
    label: 'Exercises',
  ),
  (
    icon: Icons.fitness_center_outlined,
    selected: Icons.fitness_center,
    label: 'Workouts',
  ),
];

/// Bottom navigation on phones, a side rail on wide screens (web/tablet).
class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.shell});

  final StatefulNavigationShell shell;

  void _go(int index) =>
      shell.goBranch(index, initialLocation: index == shell.currentIndex);

  @override
  Widget build(BuildContext context) {
    final wide = MediaQuery.sizeOf(context).width >= 800;

    if (wide) {
      return Scaffold(
        body: Row(
          children: [
            NavigationRail(
              selectedIndex: shell.currentIndex,
              onDestinationSelected: _go,
              labelType: NavigationRailLabelType.all,
              destinations: [
                for (final d in _destinations)
                  NavigationRailDestination(
                    icon: Icon(d.icon),
                    selectedIcon: Icon(d.selected),
                    label: Text(d.label),
                  ),
              ],
            ),
            const VerticalDivider(width: 1),
            Expanded(child: shell),
          ],
        ),
      );
    }

    return Scaffold(
      body: shell,
      bottomNavigationBar: NavigationBar(
        selectedIndex: shell.currentIndex,
        onDestinationSelected: _go,
        destinations: [
          for (final d in _destinations)
            NavigationDestination(
              icon: Icon(d.icon),
              selectedIcon: Icon(d.selected),
              label: d.label,
            ),
        ],
      ),
    );
  }
}
