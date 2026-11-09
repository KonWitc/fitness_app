import 'package:fitness_app/api/generated/models/user_entity.dart';
import 'package:fitness_app/core/auth/auth_controller.dart';
import 'package:fitness_app/core/auth/token_store.dart';
import 'package:fitness_app/core/router.dart';
import 'package:fitness_app/core/theme.dart';
import 'package:fitness_app/features/exercises/exercises_providers.dart';
import 'package:fitness_app/features/workouts/workouts_providers.dart';
import 'package:fitness_app/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

const _user = UserEntity(id: 'u1', email: 'demo@fitness.local', name: 'Demo');

/// Signed out at start; accepts one password, like the real API.
class FakeAuthController extends AuthController {
  @override
  Future<UserEntity?> build() async => null;

  @override
  Future<void> signIn({required String email, required String password}) async {
    if (password != 'demo-password') throw Exception('wrong password');
    state = const AsyncData(_user);
  }

  @override
  Future<void> signOut() async => state = const AsyncData(null);
}

void main() {
  group('authRedirect', () {
    test('checking the session -> splash', () {
      expect(authRedirect(const AsyncLoading(), '/'), '/splash');
      expect(authRedirect(const AsyncLoading(), '/splash'), isNull);
    });

    test('API unreachable at startup -> splash (with retry)', () {
      expect(authRedirect(AsyncError('x', StackTrace.empty), '/'), '/splash');
    });

    test('signed out -> login, but sign-up stays reachable', () {
      expect(authRedirect(const AsyncData(null), '/workouts'), '/login');
      expect(authRedirect(const AsyncData(null), '/splash'), '/login');
      expect(authRedirect(const AsyncData(null), '/register'), isNull);
    });

    test('signed in -> away from auth pages, otherwise stay', () {
      expect(authRedirect(const AsyncData(_user), '/login'), '/');
      expect(authRedirect(const AsyncData(_user), '/splash'), '/');
      expect(authRedirect(const AsyncData(_user), '/workouts'), isNull);
    });
  });

  testWidgets('sign in, land on home, sign out', (tester) async {
    SharedPreferences.setMockInitialValues({});
    final prefs = await SharedPreferences.getInstance();

    await tester.pumpWidget(
      ProviderScope(
        retry: (_, _) => null,
        overrides: [
          sharedPreferencesProvider.overrideWithValue(prefs),
          secureStoreProvider.overrideWithValue(MemorySecureStore()),
          authControllerProvider.overrideWith(FakeAuthController.new),
          exercisesProvider.overrideWith((ref) async => []),
          workoutsProvider.overrideWith((ref) async => []),
        ],
        child: const FitnessApp(),
      ),
    );
    await tester.pumpAndSettle();

    // Signed out: the router shows the login screen.
    expect(find.text('Welcome back'), findsOneWidget);

    await tester.enterText(
      find.widgetWithText(TextFormField, 'Email'),
      'demo@fitness.local',
    );
    await tester.enterText(
      find.widgetWithText(TextFormField, 'Password'),
      'wrong',
    );
    await tester.tap(find.widgetWithText(FilledButton, 'Sign in'));
    await tester.pumpAndSettle();
    expect(find.text('Sign in failed'), findsOneWidget);

    await tester.enterText(
      find.widgetWithText(TextFormField, 'Password'),
      'demo-password',
    );
    await tester.tap(find.widgetWithText(FilledButton, 'Sign in'));
    await tester.pumpAndSettle();

    // Signed in: redirected home.
    expect(find.text('Welcome back'), findsNothing);
    expect(
      find.text('Track your workouts, set goals, and achieve results'),
      findsOneWidget,
    );

    await tester.tap(find.byTooltip('Account'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Sign out'));
    await tester.pumpAndSettle();
    expect(find.text('Welcome back'), findsOneWidget);
  });
}
