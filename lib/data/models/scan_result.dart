import 'dart:convert';
import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import 'checkpoint_score.dart';

enum VerdictType {
  authentic,
  counterfeit,
  inconclusive,
}

extension VerdictTypeExt on VerdictType {
  String get label {
    switch (this) {
      case VerdictType.authentic:
        return 'Likely Authentic';
      case VerdictType.counterfeit:
        return 'Likely Counterfeit';
      case VerdictType.inconclusive:
        return 'Inconclusive';
    }
  }

  Color get color {
    switch (this) {
      case VerdictType.authentic:
        return AppColors.authenticGreen;
      case VerdictType.counterfeit:
        return AppColors.counterfeitRed;
      case VerdictType.inconclusive:
        return AppColors.inconclusiveAmber;
    }
  }

  IconData get icon {
    switch (this) {
      case VerdictType.authentic:
        return Icons.verified_rounded;
      case VerdictType.counterfeit:
        return Icons.gpp_bad_rounded;
      case VerdictType.inconclusive:
        return Icons.help_outline_rounded;
    }
  }
}

class ScanResult {
  final String id;
  final DateTime timestamp;
  final List<String> images; // List of 9 angle paths
  final VerdictType verdict;
  final double confidencePercent;
  final Map<String, CheckpointScore> checkpointScores;
  final String brandGuess;
  final String modelGuess;
  final String colorway;
  final String notes;

  const ScanResult({
    required this.id,
    required this.timestamp,
    required this.images,
    required this.verdict,
    required this.confidencePercent,
    required this.checkpointScores,
    required this.brandGuess,
    this.modelGuess = 'Unknown Model',
    this.colorway = 'Original',
    this.notes = '',
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'timestamp': timestamp.toIso8601String(),
      'images': images,
      'verdict': verdict.name,
      'confidencePercent': confidencePercent,
      'checkpointScores': checkpointScores.map((k, v) => MapEntry(k, v.toMap())),
      'brandGuess': brandGuess,
      'modelGuess': modelGuess,
      'colorway': colorway,
      'notes': notes,
    };
  }

  factory ScanResult.fromMap(Map<String, dynamic> map) {
    final rawScores = map['checkpointScores'] as Map<dynamic, dynamic>? ?? {};
    final parsedScores = rawScores.map(
      (k, v) => MapEntry(
        k.toString(),
        CheckpointScore.fromMap(Map<String, dynamic>.from(v as Map)),
      ),
    );

    return ScanResult(
      id: map['id'] as String? ?? '',
      timestamp: DateTime.tryParse(map['timestamp'] as String? ?? '') ?? DateTime.now(),
      images: (map['images'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      verdict: VerdictType.values.firstWhere(
        (e) => e.name == map['verdict'],
        orElse: () => VerdictType.inconclusive,
      ),
      confidencePercent: (map['confidencePercent'] as num?)?.toDouble() ?? 0.0,
      checkpointScores: parsedScores,
      brandGuess: map['brandGuess'] as String? ?? 'Sneaker',
      modelGuess: map['modelGuess'] as String? ?? '',
      colorway: map['colorway'] as String? ?? '',
      notes: map['notes'] as String? ?? '',
    );
  }

  String toJson() => jsonEncode(toMap());
  factory ScanResult.fromJson(String source) =>
      ScanResult.fromMap(jsonDecode(source) as Map<String, dynamic>);
}
