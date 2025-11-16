import 'package:freezed_annotation/freezed_annotation.dart';

part 'bean.freezed.dart';
part 'bean.g.dart';

@freezed
class Bean with _$Bean {
  const factory Bean({
    required String id,
    required String name,
    String? origin,
    String? roaster,
    List<String>? flavorNotes,
    String? description,
    String? imageUrl,
    String? cafeId,
  }) = _Bean;

  factory Bean.fromJson(Map<String, dynamic> json) => _$BeanFromJson(json);
}
