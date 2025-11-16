Coffee Mobile (Flutter)

This folder contains a starter scaffold for rewriting the CoffeeShopapp in Flutter.

Quick start (after installing Flutter SDK):

1. Change to the mobile folder

```bash
cd mobile
```

2. Install packages

```bash
flutter pub get
```

3. Run codegen (freezed + drift)

```bash
# Use `dart run` to run build_runner (flutter pub run is deprecated for this command)
dart run build_runner build --delete-conflicting-outputs
```

4. Run on an emulator

```bash
flutter run
```

Notes:
- Supabase keys are expected to be provided via build-time environment variables or a secure method; see `lib/src/services/supabase_client.dart`.
- Models use `freezed` + `json_serializable`. Run the build_runner step above to generate `.g.dart` / `.freezed.dart` files.
