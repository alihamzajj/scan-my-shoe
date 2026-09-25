import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/models/scan_result.dart';
import '../data/services/storage_service.dart';

class HistoryState {
  final List<ScanResult> scans;
  final bool isLoading;
  final String activeFilter; // 'all', 'authentic', 'counterfeit', 'inconclusive'

  const HistoryState({
    this.scans = const [],
    this.isLoading = false,
    this.activeFilter = 'all',
  });

  List<ScanResult> get filteredScans {
    if (activeFilter == 'all') return scans;
    return scans.where((s) => s.verdict.name == activeFilter).toList();
  }

  int get totalCount => scans.length;
  int get authenticCount => scans.where((s) => s.verdict == VerdictType.authentic).length;
  int get counterfeitCount => scans.where((s) => s.verdict == VerdictType.counterfeit).length;

  HistoryState copyWith({
    List<ScanResult>? scans,
    bool? isLoading,
    String? activeFilter,
  }) {
    return HistoryState(
      scans: scans ?? this.scans,
      isLoading: isLoading ?? this.isLoading,
      activeFilter: activeFilter ?? this.activeFilter,
    );
  }
}

class HistoryNotifier extends Notifier<HistoryState> {
  @override
  HistoryState build() {
    // Schedule asynchronous loading
    Future.microtask(() => loadHistory());
    return const HistoryState(isLoading: true);
  }

  Future<void> loadHistory() async {
    state = state.copyWith(isLoading: true);
    final results = await StorageService.getAllScans();
    state = state.copyWith(scans: results, isLoading: false);
  }

  Future<void> saveScan(ScanResult result) async {
    await StorageService.saveScan(result);
    await loadHistory();
  }

  Future<void> deleteScan(String id) async {
    await StorageService.deleteScan(id);
    await loadHistory();
  }

  Future<void> clearHistory() async {
    await StorageService.clearHistory();
    await loadHistory();
  }

  void setFilter(String filter) {
    state = state.copyWith(activeFilter: filter);
  }
}

final historyProvider = NotifierProvider<HistoryNotifier, HistoryState>(HistoryNotifier.new);
