import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/auth/auth_controller.dart';

/// App bar avatar with the signed-in account and "Sign out".
class AccountMenuButton extends ConsumerWidget {
  const AccountMenuButton({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authControllerProvider).value;
    if (user == null) return const SizedBox.shrink();

    final label = user.name ?? user.email;
    return PopupMenuButton<void>(
      tooltip: 'Account',
      icon: CircleAvatar(
        radius: 14,
        child: Text(label.characters.first.toUpperCase()),
      ),
      itemBuilder: (context) => [
        PopupMenuItem(
          enabled: false,
          child: ListTile(
            contentPadding: EdgeInsets.zero,
            title: Text(label),
            subtitle: user.name != null ? Text(user.email) : null,
          ),
        ),
        const PopupMenuDivider(),
        PopupMenuItem(
          onTap: () => ref.read(authControllerProvider.notifier).signOut(),
          child: const ListTile(
            contentPadding: EdgeInsets.zero,
            leading: Icon(Icons.logout),
            title: Text('Sign out'),
          ),
        ),
      ],
    );
  }
}
