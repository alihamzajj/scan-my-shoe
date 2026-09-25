import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/shoe_angles.dart';

class ProgressStepper extends StatelessWidget {
  final int currentIndex;
  final int totalCount;
  final Map<String, String> capturedPaths;
  final ValueChanged<int>? onStepTapped;

  const ProgressStepper({
    super.key,
    required this.currentIndex,
    required this.totalCount,
    required this.capturedPaths,
    this.onStepTapped,
  });

  @override
  Widget build(BuildContext context) {
    final currentAngle = ShoeAngles.angles[currentIndex];
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface.withOpacity(0.9) : Colors.white.withOpacity(0.9),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          width: 1,
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header info
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primaryBlue.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      '${currentIndex + 1} of $totalCount',
                      style: const TextStyle(
                        color: AppColors.primaryBlueLight,
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    currentAngle.title,
                    style: TextStyle(
                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
              // Required or Optional Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: currentAngle.isRequired
                      ? (isDark ? AppColors.darkCard : AppColors.lightCard)
                      : AppColors.inconclusiveAmber.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(
                    color: currentAngle.isRequired
                        ? (isDark ? AppColors.darkBorder : AppColors.lightBorder)
                        : AppColors.inconclusiveAmber.withOpacity(0.5),
                  ),
                ),
                child: Text(
                  currentAngle.isRequired ? 'REQUIRED' : 'OPTIONAL',
                  style: TextStyle(
                    color: currentAngle.isRequired
                        ? (isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight)
                        : AppColors.inconclusiveAmber,
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Step indicators row
          Row(
            children: List.generate(totalCount, (index) {
              final angle = ShoeAngles.angles[index];
              final isCaptured = capturedPaths.containsKey(angle.id);
              final isCurrent = index == currentIndex;

              Color dotColor;
              if (isCaptured) {
                dotColor = AppColors.authenticGreen;
              } else if (isCurrent) {
                dotColor = AppColors.primaryBlueLight;
              } else {
                dotColor = isDark ? AppColors.darkBorder : AppColors.lightBorder;
              }

              return Expanded(
                child: GestureDetector(
                  onTap: () => onStepTapped?.call(index),
                  behavior: HitTestBehavior.opaque,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 2),
                    child: Column(
                      children: [
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 250),
                          height: 7,
                          decoration: BoxDecoration(
                            color: dotColor,
                            borderRadius: BorderRadius.circular(4),
                            boxShadow: isCurrent
                                ? [
                                    BoxShadow(
                                      color: AppColors.primaryBlueLight.withOpacity(0.5),
                                      blurRadius: 6,
                                      spreadRadius: 1,
                                    ),
                                  ]
                                : isCaptured
                                    ? [
                                        BoxShadow(
                                          color: AppColors.authenticGreen.withOpacity(0.4),
                                          blurRadius: 4,
                                        ),
                                      ]
                                    : null,
                          ),
                        ),
                        const SizedBox(height: 4),
                        if (isCaptured)
                          const Icon(
                            Icons.check_circle_rounded,
                            size: 11,
                            color: AppColors.authenticGreen,
                          )
                        else
                          SizedBox(
                            height: 11,
                            child: isCurrent
                                ? Container(
                                    width: 4,
                                    height: 4,
                                    decoration: const BoxDecoration(
                                      color: AppColors.primaryBlueLight,
                                      shape: BoxShape.circle,
                                    ),
                                  )
                                : null,
                          ),
                      ],
                    ),
                  ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}
