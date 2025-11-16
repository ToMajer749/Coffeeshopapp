import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/cafe.dart';
import '../models/bean.dart';
import '../services/supabase_client.dart';
import 'coffee_repository.dart';

class SupabaseCoffeeRepository implements CoffeeRepository {
  final SupabaseClient _client = SupabaseClientWrapper.client;

  @override
  Future<List<Cafe>> fetchCafes() async {
    try {
      final res = await _client.from('cafes').select().execute();
      if (res.error != null) throw res.error!;
      final rows = (res.data ?? []) as List<dynamic>;
      return rows.map((r) {
        final map = Map<String, dynamic>.from(r as Map);
        // coerce lat/lng to doubles when possible
        if (map.containsKey('lat')) {
          final v = map['lat'];
          map['lat'] = v == null ? null : (v is num ? v.toDouble() : double.tryParse(v.toString()));
        }
        if (map.containsKey('lng')) {
          final v = map['lng'];
          map['lng'] = v == null ? null : (v is num ? v.toDouble() : double.tryParse(v.toString()));
        }

        final normalized = <String, dynamic>{
          'id': map['id'],
          'name': map['name'],
          'lat': map['lat'],
          'lng': map['lng'],
          'imageUrl': map['image_url'] ?? map['imageUrl'],
          'address': map['address'],
          'rating': map['rating'],
          'reviews': map['reviews'],
          'isOpen': map['is_open'] ?? map['isOpen'],
        };

        return Cafe.fromJson(normalized);
      }).toList();
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<Cafe?> fetchCafeById(String id) async {
    try {
      final res = await _client.from('cafes').select().eq('id', id).maybeSingle().execute();
      if (res.error != null) throw res.error!;
      final row = res.data;
      if (row == null) return null;
      final map = Map<String, dynamic>.from(row as Map);
      if (map.containsKey('lat')) {
        final v = map['lat'];
        map['lat'] = v == null ? null : (v is num ? v.toDouble() : double.tryParse(v.toString()));
      }
      if (map.containsKey('lng')) {
        final v = map['lng'];
        map['lng'] = v == null ? null : (v is num ? v.toDouble() : double.tryParse(v.toString()));
      }
      final normalized = <String, dynamic>{
        'id': map['id'],
        'name': map['name'],
        'lat': map['lat'],
        'lng': map['lng'],
        'imageUrl': map['image_url'] ?? map['imageUrl'],
        'address': map['address'],
        'rating': map['rating'],
        'reviews': map['reviews'],
        'isOpen': map['is_open'] ?? map['isOpen'],
      };
      return Cafe.fromJson(normalized);
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<List<Bean>> fetchBeans() async {
    try {
      final res = await _client.from('beans').select().execute();
      if (res.error != null) throw res.error!;
      final rows = (res.data ?? []) as List<dynamic>;
      return rows.map((r) {
        final map = Map<String, dynamic>.from(r as Map);
        final normalized = <String, dynamic>{
          'id': map['id'],
          'name': map['name'],
          'origin': map['origin'],
          'roaster': map['roaster'],
          'flavorNotes': map['notes'] != null ? (map['notes'] as String).split(',').map((s) => s.trim()).toList() : <String>[],
          'description': map['description'] ?? map['notes'],
          'imageUrl': map['image_url'] ?? map['imageUrl'],
          'cafeId': map['cafe_id'] ?? map['cafeId'],
        };
        return Bean.fromJson(normalized);
      }).toList();
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<Bean?> fetchBeanById(String id) async {
    try {
      final res = await _client.from('beans').select().eq('id', id).maybeSingle().execute();
      if (res.error != null) throw res.error!;
      final row = res.data;
      if (row == null) return null;
      final map = Map<String, dynamic>.from(row as Map);
      final normalized = <String, dynamic>{
        'id': map['id'],
        'name': map['name'],
        'origin': map['origin'],
        'roaster': map['roaster'],
        'flavorNotes': map['notes'] != null ? (map['notes'] as String).split(',').map((s) => s.trim()).toList() : <String>[],
        'description': map['description'] ?? map['notes'],
        'imageUrl': map['image_url'] ?? map['imageUrl'],
        'cafeId': map['cafe_id'] ?? map['cafeId'],
      };
      return Bean.fromJson(normalized);
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<void> toggleFavoriteCafe(String cafeId) async {
    try {
      // Mirror web behavior: delete entries where cafe_id = cafeId or insert new
      final existing = await _client.from('favorites').select().eq('cafe_id', cafeId).maybeSingle().execute();
      if (existing.error != null) throw existing.error!;
      if (existing.data != null) {
        await _client.from('favorites').delete().eq('cafe_id', cafeId).execute();
        return;
      }
      await _client.from('favorites').insert({'cafe_id': cafeId}).execute();
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<void> toggleFavoriteBean(String beanId) async {
    try {
      final existing = await _client.from('favorites').select().eq('bean_id', beanId).maybeSingle().execute();
      if (existing.error != null) throw existing.error!;
      if (existing.data != null) {
        await _client.from('favorites').delete().eq('bean_id', beanId).execute();
        return;
      }
      await _client.from('favorites').insert({'bean_id': beanId}).execute();
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<void> addOrder({required String cafeId, required String beanId, required String method, int? rating, String? notes}) async {
    try {
      final payload = {
        'cafe_id': cafeId,
        'bean_id': beanId,
        'method': method,
        'notes': notes,
        'rating': rating,
      };
      final res = await _client.from('orders').insert(payload).execute();
      if (res.error != null) throw res.error!;
    } catch (e) {
      rethrow;
    }
  }
}
