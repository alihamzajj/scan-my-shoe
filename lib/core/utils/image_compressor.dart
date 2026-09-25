import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:path_provider/path_provider.dart';

class ImageCompressor {
  /// Compresses an image file before upload to save bandwidth and speed up ML inference.
  /// Falls back to the original file path if unsupported on the current platform.
  static Future<String> compressImage(String originalPath) async {
    try {
      if (kIsWeb || (!Platform.isAndroid && !Platform.isIOS)) {
        return originalPath;
      }

      final file = File(originalPath);
      if (!await file.exists()) {
        return originalPath;
      }

      final tempDir = await getTemporaryDirectory();
      final targetPath = '${tempDir.path}/compressed_${DateTime.now().millisecondsSinceEpoch}.jpg';

      final XFile? compressed = await FlutterImageCompress.compressAndGetFile(
        file.absolute.path,
        targetPath,
        quality: 82,
        minWidth: 1400,
        minHeight: 1400,
        format: CompressFormat.jpeg,
      );

      if (compressed != null) {
        return compressed.path;
      }
    } catch (e) {
      debugPrint('Image compression fallback: $e');
    }
    return originalPath;
  }
}
