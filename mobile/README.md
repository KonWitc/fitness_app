# Fitness Tracker (Flutter)

Flutter client for the NestJS API in `../api`. Runs on Android, iOS, web and Windows.

Stack: Riverpod 3 (state), go_router (navigation), Dio + Retrofit client **generated from the API's OpenAPI spec**.

## Run

Start the API first (see `../api/README.md`), then:

```bash
flutter pub get
flutter run -d chrome                     # web
flutter run -d <android-emulator-id>      # uses http://10.0.2.2:3001 automatically
```

The API URL defaults to `http://localhost:3001` (`http://10.0.2.2:3001` on the Android emulator).
Override it for a phone on your Wi-Fi or a non-default port:

```bash
flutter run --dart-define=API_BASE_URL=http://192.168.1.20:3001
```

The home screen shows whether the API is reachable.

## Layout

```
lib/
  main.dart                 # ProviderScope + MaterialApp.router
  core/                     # config (API URL), api (Dio + client providers, errorMessage), theme, router/shell
  features/<feature>/       # *_page.dart, *_providers.dart, feature widgets + utils
  widgets/                  # shared UI (loading/empty/error states, responsive grid)
  api/generated/            # GENERATED, do not edit (committed so the app builds without the generator)
```

## Regenerating the API client

After changing API DTOs/entities:

```bash
cd ../api && npm run openapi      # writes ../mobile/openapi.json
cd ../mobile
dart run swagger_parser           # openapi.json -> lib/api/generated
dart run build_runner build -d    # json_serializable / retrofit code
```

## Checks

```bash
flutter analyze
flutter test
```
