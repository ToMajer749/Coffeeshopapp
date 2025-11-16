import 'package:freezed_annotation/freezed_annotation.dart';

part 'cafe.freezed.dart';
part 'cafe.g.dart';

@freezed
class Cafe with _$Cafe {
  const factory Cafe({
    required String id,
    required String name,
    double? lat,
    double? lng,
    String? imageUrl,
    String? address,
    double? rating,
    int? reviews,
    bool? isOpen,
    List<String>? beans,
  }) = _Cafe;

  factory Cafe.fromJson(Map<String, dynamic> json) => _$CafeFromJson(json);
}
