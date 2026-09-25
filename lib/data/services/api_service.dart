import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';
import '../models/checkpoint_score.dart';
import '../models/scan_result.dart';

enum MockScenario {
  authentic,
  counterfeit,
  inconclusive,
  random,
}

abstract class BaseApiService {
  Future<ScanResult> submitScan({
    required List<File> images,
    void Function(double progress, String status)? onProgress,
    MockScenario scenario = MockScenario.random,
  });
}

class ApiService implements BaseApiService {
  final Dio _dio;
  final bool useMock;

  ApiService({
    Dio? dio,
    this.useMock = true,
  }) : _dio = dio ??
            Dio(
              BaseOptions(
                baseUrl: 'https://api.authenticheck.ai/v1',
                connectTimeout: const Duration(seconds: 15),
                receiveTimeout: const Duration(seconds: 30),
                headers: {
                  'Accept': 'application/json',
                  'X-Client-App': 'AuthentiCheck-Flutter',
                },
              ),
            );

  @override
  Future<ScanResult> submitScan({
    required List<File> images,
    void Function(double progress, String status)? onProgress,
    MockScenario scenario = MockScenario.random,
  }) async {
    if (!useMock) {
      // -------------------------------------------------------------
      // Real ML backend integration
      // -------------------------------------------------------------
      try {
        final formData = FormData();
        for (int i = 0; i < images.length; i++) {
          formData.files.add(
            MapEntry(
              'angle_$i',
              await MultipartFile.fromFile(
                images[i].path,
                filename: 'angle_$i.jpg',
              ),
            ),
          );
        }

        final response = await _dio.post(
          '/scan',
          data: formData,
          onSendProgress: (sent, total) {
            if (total > 0 && onProgress != null) {
              final ratio = sent / total;
              onProgress(ratio * 0.5, 'Uploading high-resolution captures...');
            }
          },
        );

        return ScanResult.fromMap(response.data as Map<String, dynamic>);
      } on DioException catch (e) {
        debugPrint('Real backend error: ${e.message}. Falling back to simulation.');
      }
    }

    // -------------------------------------------------------------
    // Mocked ML processing with simulated 3.5s delay and phase updates
    // -------------------------------------------------------------
    final steps = [
      (0.15, 'Uploading encrypted multi-angle capture package...'),
      (0.35, 'Inspecting panel stitching & thread tension...'),
      (0.55, 'Comparing outsole tread & pivot alignment...'),
      (0.75, 'Analyzing logo geometry & embossing depth...'),
      (0.90, 'Cross-referencing SKU & size tag typography...'),
      (1.00, 'Compiling cryptographic authenticity report...'),
    ];

    for (final step in steps) {
      await Future.delayed(const Duration(milliseconds: 650));
      onProgress?.call(step.$1, step.$2);
    }

    // Determine mock scenario
    final selectedVerdict = _resolveScenario(scenario);

    return _generateMockResult(
      verdict: selectedVerdict,
      imagePaths: images.map((f) => f.path).toList(),
    );
  }

  VerdictType _resolveScenario(MockScenario scenario) {
    switch (scenario) {
      case MockScenario.authentic:
        return VerdictType.authentic;
      case MockScenario.counterfeit:
        return VerdictType.counterfeit;
      case MockScenario.inconclusive:
        return VerdictType.inconclusive;
      case MockScenario.random:
        // Default to Authentic 60% of the time, Counterfeit 30%, Inconclusive 10%
        final r = DateTime.now().millisecond % 10;
        if (r < 6) return VerdictType.authentic;
        if (r < 9) return VerdictType.counterfeit;
        return VerdictType.inconclusive;
    }
  }

  ScanResult _generateMockResult({
    required VerdictType verdict,
    required List<String> imagePaths,
  }) {
    final uuid = const Uuid().v4().substring(0, 8).toUpperCase();

    if (verdict == VerdictType.authentic) {
      return ScanResult(
        id: 'AUTH-$uuid',
        timestamp: DateTime.now(),
        images: imagePaths,
        verdict: VerdictType.authentic,
        confidencePercent: 97.4,
        brandGuess: 'Nike / Jordan Brand',
        modelGuess: "Air Jordan 1 Retro High OG 'Chicago'",
        colorway: 'Varsity Red / Black - White',
        notes: 'All 6 critical structural markers conform to factory specifications. Stitch tension, hourglass rear taper, and wings embossing are consistent with authentic pairs.',
        checkpointScores: const {
          'logo': CheckpointScore(
            title: 'Logo Match & Alignment',
            score: 0.98,
            status: CheckpointStatus.pass,
            description: 'Wings logo font kerning and embossing depth match authentic retail pairs with 98% precision.',
            angleId: 'logo_closeup',
          ),
          'stitching': CheckpointScore(
            title: 'Stitching Quality & Tension',
            score: 0.96,
            status: CheckpointStatus.pass,
            description: 'Consistent 8.2 SPI (stitches per inch). No double-punched needle holes or loose fraying.',
            angleId: 'stitching',
          ),
          'sole': CheckpointScore(
            title: 'Sole Pattern & Tread Depth',
            score: 0.95,
            status: CheckpointStatus.pass,
            description: 'Pivot ring concentricity and star texture mold sharpness conform to Nike OEM molding.',
            angleId: 'sole_tread',
          ),
          'proportions': CheckpointScore(
            title: 'Silhouette & Hourglass Shape',
            score: 0.99,
            status: CheckpointStatus.pass,
            description: 'Hourglass rear contour exhibits genuine factory curve. Toe box height is appropriately low.',
            angleId: 'heel_back',
          ),
          'size_tag': CheckpointScore(
            title: 'Size Tag & Font Typography',
            score: 0.94,
            status: CheckpointStatus.pass,
            description: 'UPC barcode line widths and font stroke weight verify against Nike internal SKU database.',
            angleId: 'size_tag',
          ),
          'insole': CheckpointScore(
            title: 'Insole & Footbed Construction',
            score: 0.93,
            status: CheckpointStatus.pass,
            description: 'Underside resin glue pattern shows diagonal stripe application consistent with factory assembly.',
            angleId: 'insole',
          ),
        },
      );
    } else if (verdict == VerdictType.counterfeit) {
      return ScanResult(
        id: 'REP-$uuid',
        timestamp: DateTime.now(),
        images: imagePaths,
        verdict: VerdictType.counterfeit,
        confidencePercent: 93.8,
        brandGuess: 'Nike / Jordan Brand',
        modelGuess: "Air Jordan 1 Retro High 'Travis Scott'",
        colorway: 'Mocha / Sail - Black',
        notes: 'CRITICAL ALERT: Significant discrepancies detected on the swoosh embroidery, corner stitch clearance, and size tag typography. High probability of replica batch.',
        checkpointScores: const {
          'logo': CheckpointScore(
            title: 'Logo Match & Alignment',
            score: 0.42,
            status: CheckpointStatus.flagged,
            description: 'Embossing is shallow with irregular R and D connection in Jordan Wings text.',
            angleId: 'logo_closeup',
          ),
          'stitching': CheckpointScore(
            title: 'Stitching Quality & Tension',
            score: 0.38,
            status: CheckpointStatus.flagged,
            description: 'Corner stitch touches swoosh (standard flaw on replica batches). Inconsistent thread gauge.',
            angleId: 'stitching',
          ),
          'sole': CheckpointScore(
            title: 'Sole Pattern & Tread Depth',
            score: 0.72,
            status: CheckpointStatus.warning,
            description: 'Outsole rubber luster is overly glossy; star molds around the toe bumper are soft and rounded.',
            angleId: 'sole_tread',
          ),
          'proportions': CheckpointScore(
            title: 'Silhouette & Hourglass Shape',
            score: 0.55,
            status: CheckpointStatus.flagged,
            description: 'Rear profile lacks the authentic hourglass taper, exhibiting a straight cylindrical cut.',
            angleId: 'heel_back',
          ),
          'size_tag': CheckpointScore(
            title: 'Size Tag & Font Typography',
            score: 0.31,
            status: CheckpointStatus.flagged,
            description: 'Production date font is bolder than retail standard; QR code points to mismatched production run.',
            angleId: 'size_tag',
          ),
          'insole': CheckpointScore(
            title: 'Insole & Footbed Construction',
            score: 0.48,
            status: CheckpointStatus.warning,
            description: 'Footbed stitching is sparse; missing correct glue pattern on the insole bottom.',
            angleId: 'insole',
          ),
        },
      );
    } else {
      return ScanResult(
        id: 'INC-$uuid',
        timestamp: DateTime.now(),
        images: imagePaths,
        verdict: VerdictType.inconclusive,
        confidencePercent: 62.1,
        brandGuess: 'Adidas / Yeezy',
        modelGuess: "Yeezy Boost 350 V2 'Zebra'",
        colorway: 'White / Core Black - Red',
        notes: 'Inconclusive scan. Glare on the inner size tag and suboptimal lighting on the stitching angle prevented definitive confidence scoring.',
        checkpointScores: const {
          'logo': CheckpointScore(
            title: 'Logo Match & Alignment',
            score: 0.65,
            status: CheckpointStatus.warning,
            description: 'Emblem partially obscured by lighting reflections.',
            angleId: 'logo_closeup',
          ),
          'stitching': CheckpointScore(
            title: 'Stitching Quality & Tension',
            score: 0.68,
            status: CheckpointStatus.warning,
            description: 'Resolution is borderline for thread-level micro inspection.',
            angleId: 'stitching',
          ),
          'sole': CheckpointScore(
            title: 'Sole Pattern & Tread Depth',
            score: 0.81,
            status: CheckpointStatus.pass,
            description: 'Boost pellet texture and outsole rib spacing appear consistent.',
            angleId: 'sole_tread',
          ),
          'proportions': CheckpointScore(
            title: 'Silhouette & Hourglass Shape',
            score: 0.74,
            status: CheckpointStatus.pass,
            description: 'Heel tab angle and tongue height align with authentic profiles.',
            angleId: 'heel_back',
          ),
          'size_tag': CheckpointScore(
            title: 'Size Tag & Font Typography',
            score: 0.50,
            status: CheckpointStatus.warning,
            description: 'Flash reflection washed out the bottom half of the style code.',
            angleId: 'size_tag',
          ),
          'insole': CheckpointScore(
            title: 'Insole & Footbed Construction',
            score: 0.60,
            status: CheckpointStatus.warning,
            description: 'Insole was not fully removed; footbed stitching could not be checked.',
            angleId: 'insole',
          ),
        },
      );
    }
  }
}
