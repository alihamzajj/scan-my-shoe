import 'package:flutter/foundation.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../models/scan_result.dart';
import 'api_service.dart';

class StorageService {
  static const String boxName = 'authenticheck_history';
  static Box? _box;

  static Future<void> init() async {
    try {
      await Hive.initFlutter();
      _box = await Hive.openBox(boxName);
    } catch (e) {
      debugPrint('Hive initialization error: $e');
    }
  }

  static Future<void> saveScan(ScanResult result) async {
    try {
      final box = _box ?? await Hive.openBox(boxName);
      await box.put(result.id, result.toMap());
    } catch (e) {
      debugPrint('Error saving scan to Hive: $e');
    }
  }

  static Future<List<ScanResult>> getAllScans() async {
    try {
      final box = _box ?? await Hive.openBox(boxName);
      final List<ScanResult> list = [];
      for (final key in box.keys) {
        final data = box.get(key);
        if (data != null) {
          list.add(ScanResult.fromMap(Map<String, dynamic>.from(data as Map)));
        }
      }
      // Sort most recent first
      list.sort((a, b) => b.timestamp.compareTo(a.timestamp));
      return list;
    } catch (e) {
      debugPrint('Error getting scans from Hive: $e');
      return [];
    }
  }

  static Future<void> deleteScan(String id) async {
    try {
      final box = _box ?? await Hive.openBox(boxName);
      await box.delete(id);
    } catch (e) {
      debugPrint('Error deleting scan: $e');
    }
  }

  static Future<void> clearHistory() async {
    try {
      final box = _box ?? await Hive.openBox(boxName);
      await box.clear();
    } catch (e) {
      debugPrint('Error clearing history: $e');
    }
  }

  static Future<void> seedInitialScansIfEmpty() async {
    try {
      final box = _box ?? await Hive.openBox(boxName);
      if (box.isEmpty) {
        final mockApi = ApiService();
        final authScan = mockApi.submitScan(
          images: [],
          scenario: MockScenario.authentic,
        );
        final fakeScan = mockApi.submitScan(
          images: [],
          scenario: MockScenario.counterfeit,
        );
        final results = await Future.wait([authScan, fakeScan]);
        for (final res in results) {
          await saveScan(res);
        }
      }
    } catch (e) {
      debugPrint('Error seeding sample scans: $e');
    }
  }
}
