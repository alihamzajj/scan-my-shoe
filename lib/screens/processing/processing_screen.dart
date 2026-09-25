import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lottie/lottie.dart';

import '../../core/constants/app_colors.dart';
import '../../data/services/api_service.dart';
import '../../providers/api_scan_provider.dart';
import '../../providers/history_provider.dart';

class ProcessingScreen extends ConsumerStatefulWidget {
  final List<String> imagePaths;

  const ProcessingScreen({
    super.key,
    required this.imagePaths,
  });

  @override
  ConsumerState<ProcessingScreen> createState() => _ProcessingScreenState();
}

class _ProcessingScreenState extends ConsumerState<ProcessingScreen> {
  Timer? _statusTimer;
  int _statusIndex = 0;

  final List<String> _rotatingStatuses = const [
    'Inspecting stitching density & needle tension...',
    'Comparing outsole tread pattern & pivot ring...',
    'Checking logo alignment & embossing depth...',
    'Analyzing leather texture & grain structure...',
    'Verifying size tag typography & SKU barcode...',
    'Evaluating rear hourglass taper symmetry...',
    'Compiling cryptographic authenticity report...',
  ];

  @override
  void initState() {
    super.initState();
    _startStatusRotation();
    _startScanAnalysis();
  }

  void _startStatusRotation() {
    _statusTimer = Timer.periodic(const Duration(milliseconds: 1500), (timer) {
      if (mounted) {
        setState(() {
          _statusIndex = (_statusIndex + 1) % _rotatingStatuses.length;
        });
      }
    });
  }

  Future<void> _startScanAnalysis() async {
    // Give UI a moment to render before network/mock kick-off
    await Future.delayed(const Duration(milliseconds: 300));
    if (!mounted) return;

    final result = await ref.read(apiScanProvider.notifier).submitScan(widget.imagePaths);

    if (result != null && mounted) {
      // Auto save to local scan history via Hive
      await ref.read(historyProvider.notifier).saveScan(result);

      // Navigate to Result Screen
      if (mounted) {
        context.pushReplacement('/result', extra: result);
      }
    }
  }

  @override
  void dispose() {
    _statusTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final apiState = ref.watch(apiScanProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final currentStatus = apiState.statusPhrase.isNotEmpty
        ? apiState.statusPhrase
        : _rotatingStatuses[_statusIndex];

    return PopScope(
      canPop: false, // Prevent accidental back press during verification
      child: Scaffold(
        backgroundColor: isDark ? AppColors.darkBackground : AppColors.lightBackground,
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 28.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Spacer(flex: 2),

                // Lottie Mascot Animation (Detective with Magnifying Glass)
                // Note for developer: Swap 'assets/animations/detective_mascot.json'
                // with any custom Lottie JSON file whenever desired.
                SizedBox(
                  width: 220,
                  height: 220,
                  child: Lottie.asset(
                    'assets/animations/detective_mascot.json',
                    repeat: true,
                    fit: BoxFit.contain,
                    errorBuilder: (context, error, stackTrace) {
                      // Graceful fallback if Lottie asset fails
                      return Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: AppColors.primaryBlue.withOpacity(0.12),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.travel_explore_rounded,
                          size: 72,
                          color: AppColors.primaryBlueLight,
                        ),
                      );
                    },
                  ),
                ),

                const SizedBox(height: 28),

                // Verification Badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.primaryBlue.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.primaryBlueLight.withOpacity(0.4)),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.shield_outlined, size: 15, color: AppColors.primaryBlueLight),
                      SizedBox(width: 6),
                      Text(
                        'AI COMPUTER VISION IN PROGRESS',
                        style: TextStyle(
                          color: AppColors.primaryBlueLight,
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.6,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Rotating Status Text (changes every ~1.5s)
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 350),
                  child: Text(
                    currentStatus,
                    key: ValueKey<String>(currentStatus),
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                      height: 1.35,
                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                    ),
                  ),
                ),

                const SizedBox(height: 8),

                Text(
                  'Evaluating ${widget.imagePaths.length} multi-angle reference captures against neural retail model data.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 13,
                    color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                    height: 1.4,
                  ),
                ),

                const SizedBox(height: 32),

                // Progress Bar tied to upload/analysis state
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: LinearProgressIndicator(
                    value: apiState.progress,
                    minHeight: 8,
                    backgroundColor: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                    valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primaryBlueLight),
                  ),
                ),

                const SizedBox(height: 10),

                // Progress Percentage
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Analyzing checkpoints...',
                      style: TextStyle(
                        fontSize: 12,
                        color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                      ),
                    ),
                    Text(
                      '${(apiState.progress * 100).round()}%',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: AppColors.primaryBlueLight,
                      ),
                    ),
                  ],
                ),

                const Spacer(flex: 3),

                // Mock Scenario Selector (For testing / demonstration)
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkCard : AppColors.lightCard,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                    ),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.tune_rounded,
                            size: 14,
                            color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            'Simulate Mock Scenario:',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildScenarioChip(
                            label: 'Authentic',
                            scenario: MockScenario.authentic,
                            active: apiState.mockScenario == MockScenario.authentic,
                          ),
                          _buildScenarioChip(
                            label: 'Counterfeit',
                            scenario: MockScenario.counterfeit,
                            active: apiState.mockScenario == MockScenario.counterfeit,
                          ),
                          _buildScenarioChip(
                            label: 'Inconclusive',
                            scenario: MockScenario.inconclusive,
                            active: apiState.mockScenario == MockScenario.inconclusive,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildScenarioChip({
    required String label,
    required MockScenario scenario,
    required bool active,
  }) {
    return ChoiceChip(
      label: Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
      selected: active,
      onSelected: (val) {
        if (val) {
          ref.read(apiScanProvider.notifier).setMockScenario(scenario);
        }
      },
      visualDensity: VisualDensity.compact,
    );
  }
}
