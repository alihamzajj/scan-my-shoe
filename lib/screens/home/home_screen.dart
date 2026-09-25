import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../providers/history_provider.dart';
import '../../providers/scan_flow_provider.dart';
import '../../providers/theme_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/image_source_sheet.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);
    final historyState = ref.watch(historyProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppColors.primaryBlue.withOpacity(0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(
                Icons.verified_user_rounded,
                color: AppColors.primaryBlueLight,
                size: 20,
              ),
            ),
            const SizedBox(width: 10),
            const Text(
              'AuthentiCheck',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                letterSpacing: 0.4,
              ),
            ),
          ],
        ),
        actions: [
          // Dark/Light Theme toggle
          IconButton(
            tooltip: 'Toggle Theme',
            icon: Icon(
              themeMode == ThemeMode.dark ? Icons.light_mode_rounded : Icons.dark_mode_rounded,
              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
            ),
            onPressed: () {
              ref.read(themeModeProvider.notifier).toggle();
            },
          ),
          // History shortcut
          IconButton(
            tooltip: 'Scan History',
            icon: const Icon(Icons.history_rounded),
            onPressed: () => context.push('/history'),
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
              // 1. Hero Card Section
              _buildHeroCard(context, ref, isDark),

              const SizedBox(height: 20),

              // 2. Action CTAs
              CustomButton(
                label: 'Scan a Shoe',
                icon: Icons.camera_alt_rounded,
                variant: ButtonVariant.primary,
                height: 56,
                onPressed: () async {
                  final mode = await ImageSourceSheet.show(context);
                  if (mode != null) {
                    ref.read(scanFlowProvider.notifier).reset();
                    ref.read(scanFlowProvider.notifier).setInputMode(mode);
                    if (context.mounted) {
                      context.push('/capture');
                    }
                  }
                },
              ),

              const SizedBox(height: 12),

              CustomButton(
                label: 'View Scan History (${historyState.totalCount})',
                icon: Icons.receipt_long_rounded,
                variant: ButtonVariant.secondary,
                height: 52,
                onPressed: () => context.push('/history'),
              ),

              const SizedBox(height: 24),

              // 3. Quick Stats Bar
              _buildStatsRow(context, historyState, isDark),

              const SizedBox(height: 28),

              // 4. Verification Checkpoint Feature Highlights
              Text(
                '9-Angle Multi-Layer Inspection',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Our proprietary AI checks micro-details standard buyers miss:',
                style: TextStyle(
                  fontSize: 13,
                  color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                ),
              ),
              const SizedBox(height: 14),

              _buildFeatureGrid(isDark),

              const SizedBox(height: 28),

              // 5. Anti-Scam Educational Guides
              Text(
                'Reseller Anti-Scam Knowledge',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                ),
              ),
              const SizedBox(height: 12),
              _buildTipsCards(isDark),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeroCard(BuildContext context, WidgetRef ref, bool isDark) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isDark
              ? [
                  const Color(0xFF1E3A8A),
                  const Color(0xFF0F172A),
                  const Color(0xFF0B1220),
                ]
              : [
                  const Color(0xFFE0E7FF),
                  const Color(0xFFEEF2FF),
                  Colors.white,
                ],
        ),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: isDark ? AppColors.primaryBlueLight.withOpacity(0.3) : AppColors.primaryBlue.withOpacity(0.2),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryBlue.withOpacity(isDark ? 0.2 : 0.08),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.authenticGreen.withOpacity(0.18),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.authenticGreen.withOpacity(0.5)),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.shield_rounded, size: 14, color: AppColors.authenticGreen),
                    SizedBox(width: 5),
                    Text(
                      'AI VERIFICATION ENGINE v2.4',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: AppColors.authenticGreen,
                        letterSpacing: 0.6,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Text(
            'Never Get Scammed on Sneaker Resales',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              height: 1.2,
              color: isDark ? Colors.white : AppColors.textPrimaryLight,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Authenticate sneakers in seconds with multi-angle ghost silhouettes, neural stitching detection, and factory SKU verification.',
            style: TextStyle(
              fontSize: 13,
              height: 1.45,
              color: isDark ? const Color(0xFFCBD5E1) : AppColors.textSecondaryLight,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsRow(BuildContext context, HistoryState history, bool isDark) {
    return Row(
      children: [
        _buildStatBox(
          label: 'Total Scans',
          value: history.totalCount.toString(),
          icon: Icons.qr_code_scanner_rounded,
          color: AppColors.primaryBlueLight,
          isDark: isDark,
        ),
        const SizedBox(width: 10),
        _buildStatBox(
          label: 'Fakes Flagged',
          value: history.counterfeitCount.toString(),
          icon: Icons.gpp_bad_rounded,
          color: AppColors.counterfeitRed,
          isDark: isDark,
        ),
        const SizedBox(width: 10),
        _buildStatBox(
          label: 'Pass Rate',
          value: history.totalCount == 0
              ? '100%'
              : '${((history.authenticCount / history.totalCount) * 100).round()}%',
          icon: Icons.verified_rounded,
          color: AppColors.authenticGreen,
          isDark: isDark,
        ),
      ],
    );
  }

  Widget _buildStatBox({
    required String label,
    required String value,
    required IconData icon,
    required Color color,
    required bool isDark,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkCard : AppColors.lightCard,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          ),
        ),
        child: Column(
          children: [
            Icon(icon, size: 20, color: color),
            const SizedBox(height: 6),
            Text(
              value,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureGrid(bool isDark) {
    final features = [
      (Icons.texture_rounded, 'Stitching Density', 'Analyzes stitches-per-inch tension and needle punch holes.'),
      (Icons.verified_rounded, 'Logo Embossing', 'Evaluates wings logo kerning and embroidery depth.'),
      (Icons.grid_on_rounded, 'Outsole Tread', 'Scans pivot ring concentricity and mold texture.'),
      (Icons.view_column_rounded, 'Rear Hourglass', 'Verifies authentic hourglass taper contour.'),
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 10,
        crossAxisSpacing: 10,
        childAspectRatio: 1.35,
      ),
      itemCount: features.length,
      itemBuilder: (context, index) {
        final f = features[index];
        return Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkCard : AppColors.lightCard,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(f.$1, size: 20, color: AppColors.primaryBlueLight),
              const SizedBox(height: 6),
              Text(
                f.$2,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                ),
              ),
              const SizedBox(height: 3),
              Text(
                f.$3,
                style: TextStyle(
                  fontSize: 11,
                  color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                  height: 1.25,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildTipsCards(bool isDark) {
    final tips = [
      (
        'Red Flag: Corner Stitch Clearance',
        'On authentic pairs, corner stitching never cuts straight through the swoosh border.',
        Icons.warning_amber_rounded,
        AppColors.counterfeitRed,
      ),
      (
        'Blacklight UV Glue Bleed',
        'Factory authentic soles have clean glue lines; fakes often show excessive glow glue smear.',
        Icons.lightbulb_outline_rounded,
        AppColors.primaryCyan,
      ),
    ];

    return Column(
      children: tips.map((tip) {
        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkCard : AppColors.lightCard,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
            ),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: tip.$4.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(tip.$3, size: 18, color: tip.$4),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      tip.$1,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      tip.$2,
                      style: TextStyle(
                        fontSize: 12,
                        color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                        height: 1.3,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }
}
