import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:authenticheck/core/constants/app_colors.dart';
import 'package:authenticheck/data/models/checkpoint_score.dart';
import 'package:authenticheck/data/models/scan_result.dart';
import 'package:authenticheck/widgets/custom_button.dart';
import 'package:authenticheck/widgets/progress_stepper.dart';
import 'package:authenticheck/widgets/result_badge.dart';
import 'package:authenticheck/widgets/score_card.dart';

void main() {
  group('AuthentiCheck Widget Tests', () {
    testWidgets('CustomButton renders label and responds to tap', (WidgetTester tester) async {
      bool tapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomButton(
              label: 'Scan a Shoe',
              onPressed: () {
                tapped = true;
              },
            ),
          ),
        ),
      );

      expect(find.text('Scan a Shoe'), findsOneWidget);
      await tester.tap(find.text('Scan a Shoe'));
      await tester.pump();

      expect(tapped, isTrue);
    });

    testWidgets('ResultBadge renders Authentic, Counterfeit, and Inconclusive correctly',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Column(
              children: [
                ResultBadge(
                  verdict: VerdictType.authentic,
                  confidence: 98.4,
                  size: ResultBadgeSize.large,
                ),
                ResultBadge(
                  verdict: VerdictType.counterfeit,
                  confidence: 94.2,
                  size: ResultBadgeSize.medium,
                ),
                ResultBadge(
                  verdict: VerdictType.inconclusive,
                  confidence: 65.0,
                  size: ResultBadgeSize.small,
                ),
              ],
            ),
          ),
        ),
      );

      expect(find.text('Likely Authentic'), findsOneWidget);
      expect(find.text('Likely Counterfeit'), findsOneWidget);
      expect(find.text('Inconclusive'), findsOneWidget);
    });

    testWidgets('ProgressStepper displays angle count and required/optional badges',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: ProgressStepper(
              currentIndex: 2,
              totalCount: 9,
              capturedPaths: {
                'side_left': '/dummy/path1.jpg',
                'side_right': '/dummy/path2.jpg',
              },
            ),
          ),
        ),
      );

      expect(find.text('3 of 9'), findsOneWidget);
      expect(find.text('REQUIRED'), findsOneWidget);
    });

    testWidgets('ScoreCard renders checkpoint title and expands details on tap',
        (WidgetTester tester) async {
      const checkpoint = CheckpointScore(
        title: 'Logo Match & Alignment',
        score: 0.98,
        status: CheckpointStatus.pass,
        description: 'Embossing is factory authentic and sharp.',
        angleId: 'logo_closeup',
      );

      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: ScoreCard(checkpoint: checkpoint),
          ),
        ),
      );

      expect(find.text('Logo Match & Alignment'), findsOneWidget);
      expect(find.text('PASS'), findsOneWidget);
      expect(find.text('98%'), findsOneWidget);

      // Tap to expand
      await tester.tap(find.text('Logo Match & Alignment'));
      await tester.pumpAndSettle();

      expect(find.text('Embossing is factory authentic and sharp.'), findsOneWidget);
    });
  });
}
