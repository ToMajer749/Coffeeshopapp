import 'package:supabase_flutter/supabase_flutter.dart';

/// Simple wrapper around the Supabase client for DI.
class SupabaseClientWrapper {
  SupabaseClientWrapper._();

  static SupabaseClient get client => Supabase.instance.client;

  /// Helper to access the auth user id when auth added later.
  static String? get currentUserId => Supabase.instance.client.auth.currentUser?.id;
}
