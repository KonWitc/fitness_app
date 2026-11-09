import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../api/generated/models/user_entity.dart';
import '../features/auth/login_page.dart';
import '../features/auth/register_page.dart';
import '../features/auth/splash_page.dart';
import '../features/exercises/exercises_page.dart';
import '../features/home/home_page.dart';
import '../features/workouts/workouts_page.dart';
import 'auth/auth_controller.dart';

const _authPages = {'/login', '/register'};

/// Where the auth state sends a location, or `null` to stay.
@visibleForTesting
String? authRedirect(AsyncValue<UserEntity?> auth, String location) {
  return switch (auth) {
    // Checking the saved session, or it failed (API unreachable): splash
    // shows a spinner or a retry button.
    AsyncLoading(hasValue: false) ||
    AsyncError() => location == '/splash' ? null : '/splash',
    AsyncValue(value: null) => _authPages.contains(location) ? null : '/login',
    _ => location == '/splash' || _authPages.contains(location) ? '/' : null,
  };
}

final routerProvider = Provider<GoRouter>((ref) {
  // GoRouter re-runs `redirect` whenever this notifier changes.
  final auth = ValueNotifier<AsyncValue<UserEntity?>>(
    ref.read(authControllerProvider),
  );
  ref.listen(authControllerProvider, (_, next) => auth.value = next);

  final router = GoRouter(
    initialLocation: '/',
    refreshListenable: auth,
    redirect: (_, state) => authRedirect(auth.value, state.matchedLocation),
    routes: [
      GoRoute(path: '/splash', builder: (_, _) => const SplashPage()),
      GoRoute(path: '/login', builder: (_, _) => const LoginPage()),
      GoRoute(path: '/register', builder: (_, _) => const RegisterPage()),
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
              GoRoute(
                path: '/workouts',
                builder: (_, _) => const WorkoutsPage(),
              ),
            ],
          ),
        ],
      ),
    ],
  );
  ref.onDispose(() {
    router.dispose();
    auth.dispose();
  });
  return router;
});

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
