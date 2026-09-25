import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/constants/shoe_angles.dart';

enum ScanInputMode { camera, gallery }

class ScanFlowState {
  final ScanInputMode inputMode;
  final int currentAngleIndex;
  final Map<String, String> capturedPaths; // angleId -> imageFilePath
  final bool isShutterAnimating;
  final bool isTorchOn;
  final bool isGridVisible;

  const ScanFlowState({
    this.inputMode = ScanInputMode.camera,
    this.currentAngleIndex = 0,
    this.capturedPaths = const {},
    this.isShutterAnimating = false,
    this.isTorchOn = false,
    this.isGridVisible = true,
  });

  ShoeAngleInfo get currentAngle => ShoeAngles.angles[currentAngleIndex];
  int get totalAngles => ShoeAngles.angles.length;
  int get capturedCount => capturedPaths.length;
  bool get isCurrentAngleCaptured => capturedPaths.containsKey(currentAngle.id);
  String? get currentCapturedPath => capturedPaths[currentAngle.id];

  bool get areAllRequiredCaptured {
    for (final angle in ShoeAngles.angles) {
      if (angle.isRequired && !capturedPaths.containsKey(angle.id)) {
        return false;
      }
    }
    return true;
  }

  ScanFlowState copyWith({
    ScanInputMode? inputMode,
    int? currentAngleIndex,
    Map<String, String>? capturedPaths,
    bool? isShutterAnimating,
    bool? isTorchOn,
    bool? isGridVisible,
  }) {
    return ScanFlowState(
      inputMode: inputMode ?? this.inputMode,
      currentAngleIndex: currentAngleIndex ?? this.currentAngleIndex,
      capturedPaths: capturedPaths ?? this.capturedPaths,
      isShutterAnimating: isShutterAnimating ?? this.isShutterAnimating,
      isTorchOn: isTorchOn ?? this.isTorchOn,
      isGridVisible: isGridVisible ?? this.isGridVisible,
    );
  }
}

class ScanFlowNotifier extends Notifier<ScanFlowState> {
  @override
  ScanFlowState build() => const ScanFlowState();

  void setInputMode(ScanInputMode mode) {
    state = state.copyWith(inputMode: mode);
  }

  void saveCaptureForCurrentAngle(String filePath) {
    final updated = Map<String, String>.from(state.capturedPaths);
    updated[state.currentAngle.id] = filePath;
    state = state.copyWith(
      capturedPaths: updated,
      isShutterAnimating: false,
    );
  }

  void triggerShutterFlash() {
    state = state.copyWith(isShutterAnimating: true);
  }

  void resetShutterFlash() {
    state = state.copyWith(isShutterAnimating: false);
  }

  void toggleTorch() {
    state = state.copyWith(isTorchOn: !state.isTorchOn);
  }

  void toggleGrid() {
    state = state.copyWith(isGridVisible: !state.isGridVisible);
  }

  void retakeCurrentAngle() {
    final updated = Map<String, String>.from(state.capturedPaths);
    updated.remove(state.currentAngle.id);
    state = state.copyWith(capturedPaths: updated);
  }

  bool nextAngle() {
    if (state.currentAngleIndex < state.totalAngles - 1) {
      state = state.copyWith(currentAngleIndex: state.currentAngleIndex + 1);
      return true;
    }
    return false;
  }

  bool previousAngle() {
    if (state.currentAngleIndex > 0) {
      state = state.copyWith(currentAngleIndex: state.currentAngleIndex - 1);
      return true;
    }
    return false;
  }

  void jumpToAngle(int index) {
    if (index >= 0 && index < state.totalAngles) {
      state = state.copyWith(currentAngleIndex: index);
    }
  }

  void reset() {
    state = const ScanFlowState();
  }
}

final scanFlowProvider = NotifierProvider<ScanFlowNotifier, ScanFlowState>(ScanFlowNotifier.new);
