import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/models/scan_result.dart';
import '../data/services/api_service.dart';

final apiServiceProvider = Provider<ApiService>((ref) => ApiService());

class ApiScanState {
  final bool isProcessing;
  final double progress;
  final String statusPhrase;
  final ScanResult? result;
  final String? errorMessage;
  final MockScenario mockScenario;

  const ApiScanState({
    this.isProcessing = false,
    this.progress = 0.0,
    this.statusPhrase = 'Initializing neural inspection...',
    this.result,
    this.errorMessage,
    this.mockScenario = MockScenario.authentic,
  });

  ApiScanState copyWith({
    bool? isProcessing,
    double? progress,
    String? statusPhrase,
    ScanResult? result,
    String? errorMessage,
    MockScenario? mockScenario,
  }) {
    return ApiScanState(
      isProcessing: isProcessing ?? this.isProcessing,
      progress: progress ?? this.progress,
      statusPhrase: statusPhrase ?? this.statusPhrase,
      result: result ?? this.result,
      errorMessage: errorMessage ?? this.errorMessage,
      mockScenario: mockScenario ?? this.mockScenario,
    );
  }
}

class ApiScanNotifier extends Notifier<ApiScanState> {
  @override
  ApiScanState build() => const ApiScanState();

  ApiService get _apiService => ref.read(apiServiceProvider);

  void setMockScenario(MockScenario scenario) {
    state = state.copyWith(mockScenario: scenario);
  }

  Future<ScanResult?> submitScan(List<String> imagePaths) async {
    state = state.copyWith(
      isProcessing: true,
      progress: 0.05,
      statusPhrase: 'Preparing multi-angle images...',
      errorMessage: null,
      result: null,
    );

    try {
      final files = imagePaths.map((p) => File(p)).toList();

      final res = await _apiService.submitScan(
        images: files,
        scenario: state.mockScenario,
        onProgress: (prog, status) {
          state = state.copyWith(
            progress: prog,
            statusPhrase: status,
          );
        },
      );

      state = state.copyWith(
        isProcessing: false,
        progress: 1.0,
        statusPhrase: 'Authentication Complete',
        result: res,
      );

      return res;
    } catch (e) {
      state = state.copyWith(
        isProcessing: false,
        errorMessage: 'Authentication analysis failed: $e',
      );
      return null;
    }
  }

  void reset() {
    state = const ApiScanState();
  }
}

final apiScanProvider = NotifierProvider<ApiScanNotifier, ApiScanState>(ApiScanNotifier.new);
