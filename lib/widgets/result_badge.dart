import 'package:flutter/material.dart';
import '../data/models/scan_result.dart';

enum ResultBadgeSize { small, medium, large }

class ResultBadge extends StatelessWidget {
  final VerdictType verdict;
  final double? confidence;
  final ResultBadgeSize size;

  const ResultBadge({
    super.key,
    required this.verdict,
    this.confidence,
    this.size = ResultBadgeSize.medium,
  });

  @override
  Widget build(BuildContext context) {
    final color = verdict.color;
    final icon = verdict.icon;
    final label = verdict.label;

    double iconSize;
    double fontSize;
    EdgeInsets padding;
    double borderRadius;

    switch (size) {
      case ResultBadgeSize.small:
        iconSize = 14;
        fontSize = 12;
        padding = const EdgeInsets.symmetric(horizontal: 8, vertical: 4);
        borderRadius = 8;
        break;
      case ResultBadgeSize.medium:
        iconSize = 18;
        fontSize = 14;
        padding = const EdgeInsets.symmetric(horizontal: 14, vertical: 8);
        borderRadius = 10;
        break;
      case ResultBadgeSize.large:
        iconSize = 24;
        fontSize = 18;
        padding = const EdgeInsets.symmetric(horizontal: 20, vertical: 12);
        borderRadius = 14;
        break;
    }

    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(
          color: color.withOpacity(0.4),
          width: size == ResultBadgeSize.large ? 1.8 : 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.15),
            blurRadius: size == ResultBadgeSize.large ? 16 : 8,
            spreadRadius: 0,
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: iconSize, color: color),
          const SizedBox(width: 8),
          Text(
            label,
            style: TextStyle(
              color: color,
              fontSize: fontSize,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.3,
            ),
          ),
          if (confidence != null && size != ResultBadgeSize.small) ...[
            const SizedBox(width: 6),
            Text(
              '(${confidence!.toStringAsFixed(1)}%)',
              style: TextStyle(
                color: color.withOpacity(0.85),
                fontSize: fontSize - 2,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
