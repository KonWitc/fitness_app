import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Key-value storage for secrets. Keychain / Keystore on mobile; tests use
/// [MemorySecureStore].
abstract interface class SecureStore {
  Future<String?> read(String key);
  Future<void> write(String key, String value);
  Future<void> delete(String key);
}

class FlutterSecureStore implements SecureStore {
  const FlutterSecureStore([this._storage = const FlutterSecureStorage()]);

  final FlutterSecureStorage _storage;

  @override
  Future<String?> read(String key) => _storage.read(key: key);

  @override
  Future<void> write(String key, String value) =>
      _storage.write(key: key, value: value);

  @override
  Future<void> delete(String key) => _storage.delete(key: key);
}

class MemorySecureStore implements SecureStore {
  final values = <String, String>{};

  @override
  Future<String?> read(String key) async => values[key];

  @override
  Future<void> write(String key, String value) async => values[key] = value;

  @override
  Future<void> delete(String key) async => values.remove(key);
}

final secureStoreProvider = Provider<SecureStore>(
  (ref) => const FlutterSecureStore(),
);

final tokenStoreProvider = Provider<TokenStore>(
  (ref) => TokenStore(ref.watch(secureStoreProvider)),
);

/// The current tokens, kept in memory for every request and persisted so the
/// app stays signed in across restarts.
class TokenStore {
  TokenStore(this._store);

  static const _accessKey = 'auth.accessToken';
  static const _refreshKey = 'auth.refreshToken';

  final SecureStore _store;

  String? accessToken;
  String? refreshToken;

  /// Unreadable storage (e.g. Android Keystore data invalidated by a backup
  /// restore) counts as signed out rather than locking the app up.
  Future<void> load() async {
    try {
      accessToken = await _store.read(_accessKey);
      refreshToken = await _store.read(_refreshKey);
    } catch (e) {
      debugPrint('Saved session unreadable, signing out: $e');
      accessToken = null;
      refreshToken = null;
      try {
        await _store.delete(_accessKey);
        await _store.delete(_refreshKey);
      } catch (_) {}
    }
  }

  Future<void> save({required String access, required String refresh}) async {
    accessToken = access;
    refreshToken = refresh;
    await _store.write(_accessKey, access);
    await _store.write(_refreshKey, refresh);
  }

  Future<void> clear() async {
    accessToken = null;
    refreshToken = null;
    await _store.delete(_accessKey);
    await _store.delete(_refreshKey);
  }
}
