import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'services/supabase_client.dart';
import 'repositories/coffee_repository.dart';

final supabaseClientProvider = Provider((ref) => SupabaseClientWrapper.client);

// Example: repository provider - implementation to be added
final coffeeRepositoryProvider = Provider<CoffeeRepository>((ref) {
  throw UnimplementedError('Provide a CoffeeRepository implementation (Supabase-based)');
});
