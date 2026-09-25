import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:share_plus/share_plus.dart';

import '../../core/constants/app_colors.dart';
import '../../core/constants/shoe_angles.dart';
import '../../data/models/scan_result.dart';
import '../../providers/history_provider.dart';
import '../../providers/scan_flow_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/full_image_viewer.dart';
import '../../widgets/result_badge.dart';
import '../../widgets/score_card.dart';

class ResultScreen extends ConsumerWidget {
  final ScanResult result;

  const ResultScreen({
    super.key,
    required this.result,
  });

  void _shareReport(BuildContext context) {
    final dateStr = DateFormat('yyyy-MM-dd HH:mm').format(result.timestamp);
    final text = '''
🛡️ AuthentiCheck Certificate: ${result.id}
Verdict: ${result.verdict.label.toUpperCase()} (${result.confidencePercent.toStringAsFixed(1)}% Confidence)
Shoe: ${result.brandGuess} - ${result.modelGuess}
Verified On: $dateStr

Key Checkpoints:
• Logo Alignment: ${(result.checkpointScores['logo']?.score ?? 0.9 * 100).round()}%
• Stitching Quality: ${(result.checkpointScores['stitching']?.score ?? 0.9 * 100).round()}%
• Sole Tread Pattern: ${(result.checkpointScores['sole']?.score ?? 0.9 * 100).round()}%
• Proportions & Shape: ${(result.checkpointScores['proportions']?.score ?? 0.9 * 100).round()}%
• Size Tag & SKU: ${(result.checkpointScores['size_tag']?.score ?? 0.9 * 100).round()}%

Inspected via AuthentiCheck AI Anti-Scam Scanner.
''';
    Share.share(text, subject: 'AuthentiCheck Report - ${result.id}');
  }

  void _saveReportFeedback(BuildContext context, WidgetRef ref) async {
    await ref.read(historyProvider.notifier).saveScan(result);
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.check_circle_rounded, color: AppColors.authenticGreen, size: 20),
              const SizedBox(width: 10),
              Expanded(child: Text('Report ${result.id} saved to your local scan history.')),
            ],
          ),
          backgroundColor: AppColors.darkCard,
          duration: const Duration(seconds: 2),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final dateStr = DateFormat('MMM dd, yyyy • h:mm a').format(result.timestamp);

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.lightBackground,
      appBar: AppBar(
        title: const Text('Authenticity Report'),
        actions: [
          IconButton(
            tooltip: 'Share Certificate',
            icon: const Icon(Icons.share_outlined),
            onPressed: () => _shareReport(context),
          ),
          IconButton(
            tooltip: 'Home',
            icon: const Icon(Icons.home_outlined),
            onPressed: () => context.go('/'),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Verdict & Certificate Hero Banner
              _buildVerdictHero(context, isDark, dateStr),

              const SizedBox(height: 24),

              // 2. AI Inspection Summary Box
              if (result.notes.isNotEmpty) ...[
                _buildNotesCard(isDark),
                const SizedBox(height: 24),
              ],

              // 3. Checkpoints Breakdown Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Checkpoint Breakdown',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w800,
                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                    ),
                  ),
                  Text(
                    '${result.checkpointScores.length} Inspections',
                    style: TextStyle(
                      fontSize: 12,
                      color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // 4. Score Cards List
              ...result.checkpointScores.values.map(
                (checkpoint) => ScoreCard(checkpoint: checkpoint),
              ),

              const SizedBox(height: 28),

              // 5. Multi-Angle Photo Evidence Grid (Tap-to-Zoom)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Captured Angle Evidence',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w800,
                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                    ),
                  ),
                  const Text(
                    'Tap to zoom',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.primaryBlueLight,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              _buildCapturedImagesGrid(context, isDark),

              const SizedBox(height: 32),

              // 6. Action CTAs
              CustomButton(
                label: 'Save Report to History',
                icon: Icons.bookmark_added_rounded,
                variant: ButtonVariant.primary,
                height: 52,
                onPressed: () => _saveReportFeedback(context, ref),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: CustomButton(
                      label: 'Share Result',
                      icon: Icons.share_rounded,
                      variant: ButtonVariant.secondary,
                      height: 50,
                      onPressed: () => _shareReport(context),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: CustomButton(
                      label: 'Scan Another',
                      icon: Icons.refresh_rounded,
                      variant: ButtonVariant.secondary,
                      height: 50,
                      onPressed: () {
                        ref.read(scanFlowProvider.notifier).reset();
                        context.go('/');
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildVerdictHero(BuildContext context, bool isDark, String dateStr) {
    final color = result.verdict.color;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.lightSurface,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: color.withOpacity(0.4),
          width: 1.8,
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.12),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          // Certificate ID & Date
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkSurface : AppColors.lightCard,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                  ),
                ),
                child: Text(
                  'CERT: ${result.id}',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.6,
                    color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                  ),
                ),
              ),
              Text(
                dateStr,
                style: TextStyle(
                  fontSize: 11,
                  color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),

          // Main Verdict Badge
          ResultBadge(
            verdict: result.verdict,
            confidence: result.confidencePercent,
            size: ResultBadgeSize.large,
          ),

          const SizedBox(height: 16),

          // Detected Brand and Model
          Text(
            result.modelGuess,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '${result.brandGuess} • ${result.colorway}',
            style: TextStyle(
              fontSize: 13,
              color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
            ),
          ),

          const SizedBox(height: 16),
          const Divider(height: 1),
          const SizedBox(height: 14),

          // Confidence Percentage Gauge Bar
          Row(
            children: [
              Text(
                'AI Confidence Match',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                ),
              ),
              const Spacer(),
              Text(
                '${result.confidencePercent.toStringAsFixed(1)}%',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: color,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: result.confidencePercent / 100,
              minHeight: 8,
              backgroundColor: isDark ? AppColors.darkBorder : AppColors.lightBorder,
              valueColor: AlwaysStoppedAnimation<Color>(color),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNotesCard(bool isDark) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.lightCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.analytics_outlined,
                size: 18,
                color: AppColors.primaryBlueLight,
              ),
              const SizedBox(width: 8),
              Text(
                'Authentication Summary',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            result.notes,
            style: TextStyle(
              fontSize: 13,
              height: 1.4,
              color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCapturedImagesGrid(BuildContext context, bool isDark) {
    if (result.images.isEmpty) {
      return Container(
        height: 120,
        alignment: Alignment.center,
        child: const Text('No photo captures attached.'),
      );
    }

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        mainAxisSpacing: 10,
        crossAxisSpacing: 10,
        childAspectRatio: 1.0,
      ),
      itemCount: result.images.length,
      itemBuilder: (context, index) {
        final path = result.images[index];
        final angleTitle = index < ShoeAngles.angles.length
            ? ShoeAngles.angles[index].title
            : 'Angle ${index + 1}';

        return GestureDetector(
          onTap: () {
            FullImageViewer.show(
              context,
              imagePath: path,
              title: angleTitle,
              subtitle: 'Inspection Capture ${index + 1} of ${result.images.length}',
            );
          },
          child: ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Container(
              color: isDark ? AppColors.darkCard : AppColors.lightCard,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  _buildThumbnail(path),
                  Positioned(
                    bottom: 0,
                    left: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 4),
                      color: Colors.black.withOpacity(0.65),
                      child: Text(
                        angleTitle,
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildThumbnail(String path) {
    if (path.startsWith('http')) {
      return Image.network(path, fit: BoxFit.cover);
    }
    final file = File(path);
    if (file.existsSync()) {
      return Image.file(file, fit: BoxFit.cover);
    }
    return Container(
      color: AppColors.darkBorder,
      child: const Center(
        child: Icon(Icons.broken_image_rounded, size: 24, color: Colors.white30),
      ),
    );
  }
}
