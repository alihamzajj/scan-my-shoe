import 'dart:io';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/shoe_angles.dart';
import 'shutter_flash_overlay.dart';

class AngleOverlayCamera extends StatefulWidget {
  final ShoeAngleInfo angle;
  final String? capturedImagePath;
  final bool isTorchOn;
  final bool isGridVisible;
  final bool isFlashing;
  final VoidCallback? onFlashComplete;
  final VoidCallback? onRetake;
  final Function(CameraController? controller)? onCameraReady;

  const AngleOverlayCamera({
    super.key,
    required this.angle,
    this.capturedImagePath,
    this.isTorchOn = false,
    this.isGridVisible = true,
    this.isFlashing = false,
    this.onFlashComplete,
    this.onRetake,
    this.onCameraReady,
  });

  @override
  State<AngleOverlayCamera> createState() => _AngleOverlayCameraState();
}

class _AngleOverlayCameraState extends State<AngleOverlayCamera> with WidgetsBindingObserver {
  CameraController? _cameraController;
  List<CameraDescription> _cameras = [];
  bool _isCameraInitialized = false;
  bool _hasCameraError = false;
  final int _selectedCameraIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initCamera();
  }

  @override
  void didUpdateWidget(covariant AngleOverlayCamera oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isTorchOn != oldWidget.isTorchOn && _cameraController != null && _cameraController!.value.isInitialized) {
      try {
        _cameraController!.setFlashMode(widget.isTorchOn ? FlashMode.torch : FlashMode.off);
      } catch (e) {
        debugPrint('Flash toggle error: $e');
      }
    }
  }

  Future<void> _initCamera() async {
    try {
      _cameras = await availableCameras();
      if (_cameras.isEmpty) {
        setState(() {
          _hasCameraError = true;
          _isCameraInitialized = false;
        });
        return;
      }

      final camera = _cameras[_selectedCameraIndex];
      _cameraController = CameraController(
        camera,
        ResolutionPreset.high,
        enableAudio: false,
        imageFormatGroup: ImageFormatGroup.jpeg,
      );

      await _cameraController!.initialize();

      if (mounted) {
        setState(() {
          _isCameraInitialized = true;
          _hasCameraError = false;
        });
        widget.onCameraReady?.call(_cameraController);
      }
    } catch (e) {
      debugPrint('Camera init error: $e');
      if (mounted) {
        setState(() {
          _hasCameraError = true;
          _isCameraInitialized = false;
        });
      }
    }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (_cameraController == null || !_cameraController!.value.isInitialized) {
      return;
    }
    if (state == AppLifecycleState.inactive) {
      _cameraController?.dispose();
    } else if (state == AppLifecycleState.resumed) {
      _initCamera();
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _cameraController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final hasCaptured = widget.capturedImagePath != null;

    return ClipRRect(
      borderRadius: BorderRadius.circular(24),
      child: Container(
        color: Colors.black,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // 1. Live Camera or Simulated Viewfinder or Captured Photo
            if (hasCaptured)
              _buildCapturedPreview(widget.capturedImagePath!)
            else if (_isCameraInitialized && _cameraController != null)
              CameraPreview(_cameraController!)
            else
              _buildSimulatedViewfinder(),

            // 2. Alignment Grid (Toggleable)
            if (widget.isGridVisible && !hasCaptured)
              _buildRuleOfThirdsGrid(),

            // 3. Semi-Transparent Silhouette Overlay (Stack + Opacity 35%)
            if (!hasCaptured)
              Positioned.fill(
                child: Center(
                  child: Opacity(
                    opacity: 0.38,
                    child: Padding(
                      padding: const EdgeInsets.all(28.0),
                      child: SvgPicture.asset(
                        widget.angle.overlayAsset,
                        fit: BoxFit.contain,
                      ),
                    ),
                  ),
                ),
              ),

            // 4. Viewfinder Reticle Corners
            _buildCornerBrackets(),

            // 5. Instruction Banner at Bottom of Viewfinder
            if (!hasCaptured)
              Positioned(
                bottom: 16,
                left: 16,
                right: 16,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.6),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white12),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.center_focus_strong_rounded, color: AppColors.primaryBlueLight, size: 16),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          widget.angle.instruction,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

            // 6. Captured state banner & retake button
            if (hasCaptured)
              Positioned(
                bottom: 16,
                left: 16,
                right: 16,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    color: AppColors.darkSurface.withOpacity(0.92),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.authenticGreen.withOpacity(0.6)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.check_circle_rounded, color: AppColors.authenticGreen, size: 20),
                      const SizedBox(width: 10),
                      const Expanded(
                        child: Text(
                          'Angle Captured',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      if (widget.onRetake != null)
                        TextButton.icon(
                          onPressed: widget.onRetake,
                          style: TextButton.styleFrom(
                            foregroundColor: AppColors.counterfeitRedLight,
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          ),
                          icon: const Icon(Icons.refresh_rounded, size: 16),
                          label: const Text('Retake', style: TextStyle(fontWeight: FontWeight.w700)),
                        ),
                    ],
                  ),
                ),
              ),

            // 7. Shutter Flash Overlay
            ShutterFlashOverlay(
              isFlashing: widget.isFlashing,
              onFlashComplete: widget.onFlashComplete,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCapturedPreview(String path) {
    if (path.startsWith('http')) {
      return Image.network(path, fit: BoxFit.cover);
    }
    final file = File(path);
    if (file.existsSync()) {
      return Image.file(file, fit: BoxFit.cover);
    }
    return Container(
      color: AppColors.darkCard,
      child: const Center(
        child: Icon(Icons.photo_size_select_actual_rounded, size: 64, color: Colors.white30),
      ),
    );
  }

  Widget _buildSimulatedViewfinder() {
    return Container(
      decoration: const BoxDecoration(
        gradient: RadialGradient(
          center: Alignment.center,
          radius: 0.9,
          colors: [
            Color(0xFF1E293B),
            Color(0xFF0B1220),
          ],
        ),
      ),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.primaryBlue.withOpacity(0.1),
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.primaryBlueLight.withOpacity(0.3)),
              ),
              child: const Icon(
                Icons.camera_alt_outlined,
                size: 36,
                color: AppColors.primaryBlueLight,
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'Align shoe with ghost silhouette',
              style: TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w600,
                letterSpacing: 0.2,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              _hasCameraError
                  ? 'Tap shutter or gallery icon to add this angle'
                  : 'Starting camera viewfinder...',
              style: TextStyle(
                color: Colors.white.withOpacity(0.6),
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRuleOfThirdsGrid() {
    return IgnorePointer(
      child: CustomPaint(
        painter: _GridPainter(),
        size: Size.infinite,
      ),
    );
  }

  Widget _buildCornerBrackets() {
    return IgnorePointer(
      child: Padding(
        padding: const EdgeInsets.all(18.0),
        child: Stack(
          children: [
            // Top-Left
            Align(
              alignment: Alignment.topLeft,
              child: Container(
                width: 24,
                height: 24,
                decoration: const BoxDecoration(
                  border: Border(
                    top: BorderSide(color: AppColors.primaryBlueLight, width: 2.5),
                    left: BorderSide(color: AppColors.primaryBlueLight, width: 2.5),
                  ),
                ),
              ),
            ),
            // Top-Right
            Align(
              alignment: Alignment.topRight,
              child: Container(
                width: 24,
                height: 24,
                decoration: const BoxDecoration(
                  border: Border(
                    top: BorderSide(color: AppColors.primaryBlueLight, width: 2.5),
                    right: BorderSide(color: AppColors.primaryBlueLight, width: 2.5),
                  ),
                ),
              ),
            ),
            // Bottom-Left
            Align(
              alignment: Alignment.bottomLeft,
              child: Container(
                width: 24,
                height: 24,
                decoration: const BoxDecoration(
                  border: Border(
                    bottom: BorderSide(color: AppColors.primaryBlueLight, width: 2.5),
                    left: BorderSide(color: AppColors.primaryBlueLight, width: 2.5),
                  ),
                ),
              ),
            ),
            // Bottom-Right
            Align(
              alignment: Alignment.bottomRight,
              child: Container(
                width: 24,
                height: 24,
                decoration: const BoxDecoration(
                  border: Border(
                    bottom: BorderSide(color: AppColors.primaryBlueLight, width: 2.5),
                    right: BorderSide(color: AppColors.primaryBlueLight, width: 2.5),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.12)
      ..strokeWidth = 1.0;

    // Horizontal lines
    canvas.drawLine(Offset(0, size.height / 3), Offset(size.width, size.height / 3), paint);
    canvas.drawLine(Offset(0, size.height * 2 / 3), Offset(size.width, size.height * 2 / 3), paint);

    // Vertical lines
    canvas.drawLine(Offset(size.width / 3, 0), Offset(size.width / 3, size.height), paint);
    canvas.drawLine(Offset(size.width * 2 / 3, 0), Offset(size.width * 2 / 3, size.height), paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
