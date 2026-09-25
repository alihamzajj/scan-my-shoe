import 'dart:io';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path_provider/path_provider.dart';

import '../../core/constants/app_colors.dart';
import '../../core/constants/shoe_angles.dart';
import '../../core/utils/image_compressor.dart';
import '../../providers/scan_flow_provider.dart';
import '../../widgets/angle_overlay_camera.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/progress_stepper.dart';

class MultiAngleCaptureScreen extends ConsumerStatefulWidget {
  const MultiAngleCaptureScreen({super.key});

  @override
  ConsumerState<MultiAngleCaptureScreen> createState() => _MultiAngleCaptureScreenState();
}

class _MultiAngleCaptureScreenState extends ConsumerState<MultiAngleCaptureScreen> {
  CameraController? _activeCameraController;
  final ImagePicker _picker = ImagePicker();
  bool _isTakingPicture = false;

  void _onCameraReady(CameraController? controller) {
    _activeCameraController = controller;
  }

  Future<void> _handleCapture() async {
    if (_isTakingPicture) return;
    setState(() => _isTakingPicture = true);

    // Trigger visual shutter flash
    ref.read(scanFlowProvider.notifier).triggerShutterFlash();

    try {
      String imagePath;
      if (_activeCameraController != null && _activeCameraController!.value.isInitialized) {
        final XFile photo = await _activeCameraController!.takePicture();
        final compressed = await ImageCompressor.compressImage(photo.path);
        imagePath = compressed;
      } else {
        // Fallback for desktop / emulator without physical camera
        imagePath = await _generateSampleAngleCapture(
          ref.read(scanFlowProvider).currentAngle.id,
        );
      }

      ref.read(scanFlowProvider.notifier).saveCaptureForCurrentAngle(imagePath);

      // Auto-advance after brief delay to appreciate capture checkmark
      await Future.delayed(const Duration(milliseconds: 400));
      if (mounted) {
        final hasNext = ref.read(scanFlowProvider.notifier).nextAngle();
        if (!hasNext) {
          _checkAndPromptCompletion();
        }
      }
    } catch (e) {
      debugPrint('Error taking photo: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Capture error: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isTakingPicture = false);
    }
  }

  Future<void> _handlePickFromGallery() async {
    try {
      final XFile? picked = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1600,
        maxHeight: 1600,
        imageQuality: 85,
      );

      if (picked != null) {
        final compressed = await ImageCompressor.compressImage(picked.path);
        ref.read(scanFlowProvider.notifier).saveCaptureForCurrentAngle(compressed);

        // Auto-advance to next
        final hasNext = ref.read(scanFlowProvider.notifier).nextAngle();
        if (!hasNext && mounted) {
          _checkAndPromptCompletion();
        }
      }
    } catch (e) {
      debugPrint('Error picking from gallery: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gallery pick error: $e')),
        );
      }
    }
  }

  Future<String> _generateSampleAngleCapture(String angleId) async {
    final tempDir = await getTemporaryDirectory();
    final file = File('${tempDir.path}/sample_$angleId.jpg');
    if (!file.existsSync()) {
      // Create a solid placeholder file if none exists
      await file.writeAsBytes(List.generate(1024, (i) => i % 256));
    }
    return file.path;
  }

  void _checkAndPromptCompletion() {
    final scanState = ref.read(scanFlowProvider);
    if (scanState.areAllRequiredCaptured) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('All required angles captured! Ready for authentication.'),
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  void _showAngleGuideDialog(ShoeAngleInfo angle) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: isDark ? AppColors.darkSurface : AppColors.lightSurface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            Icon(angle.icon, color: AppColors.primaryBlueLight),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                angle.title,
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Large silhouette preview
            Container(
              height: 140,
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? AppColors.darkCard : AppColors.lightCard,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                ),
              ),
              child: SvgPicture.asset(
                angle.overlayAsset,
                fit: BoxFit.contain,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'How to Align:',
              style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
            ),
            const SizedBox(height: 4),
            Text(
              angle.instruction,
              style: TextStyle(
                color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                fontSize: 13,
                height: 1.35,
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'Why We Check This Angle:',
              style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
            ),
            const SizedBox(height: 4),
            Text(
              angle.inspectionTip,
              style: TextStyle(
                color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                fontSize: 13,
                height: 1.35,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Got It', style: TextStyle(fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final scanState = ref.watch(scanFlowProvider);
    final currentAngle = scanState.currentAngle;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.lightBackground,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.close_rounded),
          onPressed: () => _confirmExit(context),
        ),
        title: Text(
          'Capture Protocol (${scanState.capturedCount}/${scanState.totalAngles})',
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
        ),
        actions: [
          // Switch between camera and gallery mode
          IconButton(
            tooltip: scanState.inputMode == ScanInputMode.camera
                ? 'Switch to Gallery Mode'
                : 'Switch to Camera Mode',
            icon: Icon(
              scanState.inputMode == ScanInputMode.camera
                  ? Icons.photo_library_outlined
                  : Icons.camera_alt_outlined,
              color: AppColors.primaryBlueLight,
            ),
            onPressed: () {
              final newMode = scanState.inputMode == ScanInputMode.camera
                  ? ScanInputMode.gallery
                  : ScanInputMode.camera;
              ref.read(scanFlowProvider.notifier).setInputMode(newMode);
            },
          ),
          // Angle tips dialog
          IconButton(
            tooltip: 'Inspection Tips',
            icon: const Icon(Icons.info_outline_rounded),
            onPressed: () => _showAngleGuideDialog(currentAngle),
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // 1. Top Stepper Indicator
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              child: ProgressStepper(
                currentIndex: scanState.currentAngleIndex,
                totalCount: scanState.totalAngles,
                capturedPaths: scanState.capturedPaths,
                onStepTapped: (index) {
                  ref.read(scanFlowProvider.notifier).jumpToAngle(index);
                },
              ),
            ),

            const SizedBox(height: 8),

            // 2. Main Central Viewport (Camera or Gallery Guided Picker)
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: scanState.inputMode == ScanInputMode.camera
                    ? _buildCameraView(scanState, currentAngle)
                    : _buildGalleryGuidedView(scanState, currentAngle, isDark),
              ),
            ),

            const SizedBox(height: 12),

            // 3. Bottom Controls Bar
            _buildBottomControls(scanState, currentAngle, isDark),
          ],
        ),
      ),
    );
  }

  Widget _buildCameraView(ScanFlowState state, ShoeAngleInfo angle) {
    return AngleOverlayCamera(
      angle: angle,
      capturedImagePath: state.currentCapturedPath,
      isTorchOn: state.isTorchOn,
      isGridVisible: state.isGridVisible,
      isFlashing: state.isShutterAnimating,
      onFlashComplete: () {
        ref.read(scanFlowProvider.notifier).resetShutterFlash();
      },
      onRetake: () {
        ref.read(scanFlowProvider.notifier).retakeCurrentAngle();
      },
      onCameraReady: _onCameraReady,
    );
  }

  Widget _buildGalleryGuidedView(ScanFlowState state, ShoeAngleInfo angle, bool isDark) {
    final capturedPath = state.currentCapturedPath;

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          width: 1,
        ),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Reference Angle Box
          Row(
            children: [
              const Icon(Icons.style_rounded, size: 16, color: AppColors.primaryBlueLight),
              const SizedBox(width: 8),
              Text(
                'Required Reference Angle',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Expanded(
            flex: 4,
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: isDark ? AppColors.darkCard : AppColors.lightCard,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                ),
              ),
              padding: const EdgeInsets.all(20),
              child: Center(
                child: Opacity(
                  opacity: 0.65,
                  child: SvgPicture.asset(
                    angle.overlayAsset,
                    fit: BoxFit.contain,
                  ),
                ),
              ),
            ),
          ),

          const SizedBox(height: 14),

          // User Selection Card
          Expanded(
            flex: 5,
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: isDark ? AppColors.darkCard : AppColors.lightCard,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: capturedPath != null
                      ? AppColors.authenticGreen
                      : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
                  width: capturedPath != null ? 2 : 1,
                ),
              ),
              child: capturedPath != null
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(15),
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          Image.file(File(capturedPath), fit: BoxFit.cover),
                          Positioned(
                            top: 10,
                            right: 10,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.black.withOpacity(0.7),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.check_circle_rounded, color: AppColors.authenticGreen, size: 14),
                                  SizedBox(width: 4),
                                  Text(
                                    'Selected',
                                    style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    )
                  : InkWell(
                      onTap: _handlePickFromGallery,
                      borderRadius: BorderRadius.circular(16),
                      child: Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: AppColors.primaryBlue.withOpacity(0.12),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.add_photo_alternate_rounded,
                                size: 36,
                                color: AppColors.primaryBlueLight,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              'Choose photo for ${angle.title}',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Tap to browse gallery',
                              style: TextStyle(
                                fontSize: 12,
                                color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomControls(ScanFlowState state, ShoeAngleInfo angle, bool isDark) {
    final isCaptured = state.isCurrentAngleCaptured;
    final canAuthenticate = state.areAllRequiredCaptured;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
        border: Border(
          top: BorderSide(
            color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
            width: 1,
          ),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // If all required angles are captured, show the Authenticate Primary Button!
          if (canAuthenticate) ...[
            CustomButton(
              label: 'Proceed to Authentication (${state.capturedCount}/${state.totalAngles})',
              icon: Icons.shield_rounded,
              variant: ButtonVariant.primary,
              height: 52,
              onPressed: () {
                final paths = state.capturedPaths.values.toList();
                context.push('/processing', extra: paths);
              },
            ),
            const SizedBox(height: 10),
          ],

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Previous Angle Button
              IconButton(
                tooltip: 'Previous Angle',
                icon: const Icon(Icons.arrow_back_ios_new_rounded),
                onPressed: state.currentAngleIndex > 0
                    ? () => ref.read(scanFlowProvider.notifier).previousAngle()
                    : null,
              ),

              // Shutter / Capture Button (in Camera Mode) or Gallery Pick Button
              if (state.inputMode == ScanInputMode.camera) ...[
                if (!isCaptured)
                  _buildShutterButton()
                else
                  _buildRetakeAndNextRow(state),
              ] else ...[
                // Gallery Mode Actions
                if (!isCaptured)
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: CustomButton(
                        label: 'Pick from Gallery',
                        icon: Icons.photo_library_rounded,
                        onPressed: _handlePickFromGallery,
                        height: 50,
                      ),
                    ),
                  )
                else
                  _buildRetakeAndNextRow(state),
              ],

              // Next Angle Button or Skip Optional Button
              if (!angle.isRequired && !isCaptured)
                TextButton(
                  onPressed: () {
                    ref.read(scanFlowProvider.notifier).nextAngle();
                  },
                  child: const Text('Skip', style: TextStyle(fontWeight: FontWeight.w700)),
                )
              else
                IconButton(
                  tooltip: 'Next Angle',
                  icon: const Icon(Icons.arrow_forward_ios_rounded),
                  onPressed: state.currentAngleIndex < state.totalAngles - 1
                      ? () => ref.read(scanFlowProvider.notifier).nextAngle()
                      : null,
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildShutterButton() {
    return GestureDetector(
      onTap: _isTakingPicture ? null : _handleCapture,
      child: Container(
        width: 72,
        height: 72,
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: Colors.white, width: 4),
        ),
        child: Container(
          decoration: const BoxDecoration(
            color: AppColors.primaryBlueLight,
            shape: BoxShape.circle,
          ),
          child: _isTakingPicture
              ? const Center(
                  child: SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 3),
                  ),
                )
              : const Center(
                  child: Icon(Icons.camera_alt_rounded, color: Colors.white, size: 28),
                ),
        ),
      ),
    );
  }

  Widget _buildRetakeAndNextRow(ScanFlowState state) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        OutlinedButton.icon(
          onPressed: () {
            ref.read(scanFlowProvider.notifier).retakeCurrentAngle();
          },
          style: OutlinedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            minimumSize: Size.zero,
          ),
          icon: const Icon(Icons.refresh_rounded, size: 16),
          label: const Text('Retake'),
        ),
        const SizedBox(width: 10),
        ElevatedButton.icon(
          onPressed: () {
            final hasNext = ref.read(scanFlowProvider.notifier).nextAngle();
            if (!hasNext) {
              final paths = state.capturedPaths.values.toList();
              context.push('/processing', extra: paths);
            }
          },
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            minimumSize: Size.zero,
          ),
          icon: const Icon(Icons.arrow_forward_rounded, size: 16),
          label: Text(state.currentAngleIndex == state.totalAngles - 1 ? 'Finish' : 'Next'),
        ),
      ],
    );
  }

  void _confirmExit(BuildContext context) {
    final capturedCount = ref.read(scanFlowProvider).capturedCount;
    if (capturedCount == 0) {
      context.pop();
      return;
    }

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Discard Scan?'),
        content: Text(
          'You have captured $capturedCount of 9 angles. Leaving will discard the current session.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Continue Scanning'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              ref.read(scanFlowProvider.notifier).reset();
              context.pop();
            },
            child: const Text('Discard', style: TextStyle(color: AppColors.counterfeitRed)),
          ),
        ],
      ),
    );
  }
}
