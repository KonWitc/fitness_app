import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api.dart';
import '../../core/auth/auth_controller.dart';
import '../../widgets/async_states.dart';

/// Shown while the saved session is checked at startup, or with a retry
/// button when the API couldn't be reached.
class SplashPage extends ConsumerWidget {
  const SplashPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authControllerProvider);
    return Scaffold(
      body: auth.hasError
          ? ErrorState(
              message: errorMessage(
                auth.error!,
                'Could not check your session',
              ),
              onRetry: () => ref.invalidate(authControllerProvider),
            )
          : const LoadingState(),
    );
  }
}
