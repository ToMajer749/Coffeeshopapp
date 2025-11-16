import '../models/cafe.dart';
import '../models/bean.dart';

/// Repository contract for cafes/beans/orders/favorites.
abstract class CoffeeRepository {
  Future<List<Cafe>> fetchCafes();
  Future<Cafe?> fetchCafeById(String id);
  Future<List<Bean>> fetchBeans();
  Future<Bean?> fetchBeanById(String id);

  Future<void> toggleFavoriteCafe(String cafeId);
  Future<void> toggleFavoriteBean(String beanId);

  Future<void> addOrder({required String cafeId, required String beanId, required String method, int? rating, String? notes});
}

// TODO: Implement Supabase-backed repository in lib/src/repositories/supabase_coffee_repository.dart
