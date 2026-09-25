import 'package:flutter/material.dart';

class ShutterFlashOverlay extends StatelessWidget {
  final bool isFlashing;
  final VoidCallback? onFlashComplete;

  const ShutterFlashOverlay({
    super.key,
    required this.isFlashing,
    this.onFlashComplete,
  });

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: AnimatedOpacity(
        opacity: isFlashing ? 0.85 : 0.0,
        duration: isFlashing ? const Duration(milliseconds: 50) : const Duration(milliseconds: 250),
        curve: Curves.easeOut,
        onEnd: () {
          if (isFlashing) {
            onFlashComplete?.call();
          }
        },
        child: Container(
          color: Colors.white,
        ),
      ),
    );
  }
}
