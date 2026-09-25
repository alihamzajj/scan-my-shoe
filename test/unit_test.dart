import 'package:flutter_test/flutter_test.dart';
import 'package:authenticheck/core/constants/shoe_angles.dart';
import 'package:authenticheck/data/models/checkpoint_score.dart';
import 'package:authenticheck/data/models/scan_result.dart';
import 'package:authenticheck/data/services/api_service.dart';

void main() {
  group('AuthentiCheck Core Unit Tests', () {
    test('ShoeAngles contains exactly 9 required and optional angles', () {
      expect(ShoeAngles.angles.length, equals(9));

      final requiredAngles = ShoeAngles.angles.where((a) => a.isRequired).toList();
      final optionalAngles = ShoeAngles.angles.where((a) => !a.isRequired).toList();

      expect(requiredAngles.length, equals(7));
      expect(optionalAngles.length, equals(2));

      // 8th and 9th should be size tag and insole as specified
      expect(optionalAngles.any((a) => a.id == 'size_tag'), isTrue);
      expect(optionalAngles.any((a) => a.id == 'insole'), isTrue);
    });

    test('ScanResult model serializes and deserializes correctly', () {
      final now = DateTime.now();
      final scan = ScanResult(
        id: 'AUTH-TEST01',
        timestamp: now,
        images: ['path/1.jpg', 'path/2.jpg'],
        verdict: VerdictType.authentic,
        confidencePercent: 98.5,
        brandGuess: 'Nike / Jordan Brand',
        modelGuess: 'Air Jordan 1 High',
        checkpointScores: const {
          'logo': CheckpointScore(
            title: 'Logo Match',
            score: 0.98,
            status: CheckpointStatus.pass,
            description: 'Precise match',
            angleId: 'logo_closeup',
          ),
        },
      );

      final map = scan.toMap();
      expect(map['id'], equals('AUTH-TEST01'));
      expect(map['verdict'], equals('authentic'));

      final restored = ScanResult.fromMap(map);
      expect(restored.id, equals('AUTH-TEST01'));
      expect(restored.verdict, equals(VerdictType.authentic));
      expect(restored.confidencePercent, equals(98.5));
      expect(restored.checkpointScores['logo']?.score, equals(0.98));
    });

    test('ApiService generates valid mock results for all scenarios', () async {
      final api = ApiService(useMock: true);

      final authResult = await api.submitScan(
        images: [],
        scenario: MockScenario.authentic,
      );
      expect(authResult.verdict, equals(VerdictType.authentic));
      expect(authResult.confidencePercent, greaterThan(90));
      expect(authResult.checkpointScores.length, equals(6));

      final fakeResult = await api.submitScan(
        images: [],
        scenario: MockScenario.counterfeit,
      );
      expect(fakeResult.verdict, equals(VerdictType.counterfeit));
      expect(fakeResult.confidencePercent, greaterThan(90));
    });
  });
}
