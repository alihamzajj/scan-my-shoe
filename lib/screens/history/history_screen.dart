import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../core/constants/app_colors.dart';
import '../../data/models/scan_result.dart';
import '../../providers/history_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/result_badge.dart';

class HistoryScreen extends ConsumerWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final history = ref.watch(historyProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final scans = history.filteredScans;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.lightBackground,
      appBar: AppBar(
        title: const Text('Scan History'),
        actions: [
          if (history.scans.isNotEmpty)
            IconButton(
              tooltip: 'Clear History',
              icon: const Icon(Icons.delete_outline_rounded),
              onPressed: () => _confirmClearHistory(context, ref),
            ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // 1. Filter Chips Row
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _buildFilterChip(
                      label: 'All (${history.totalCount})',
                      filterKey: 'all',
                      activeFilter: history.activeFilter,
                      ref: ref,
                    ),
                    const SizedBox(width: 8),
                    _buildFilterChip(
                      label: 'Authentic (${history.authenticCount})',
                      filterKey: 'authentic',
                      activeFilter: history.activeFilter,
                      ref: ref,
                      activeColor: AppColors.authenticGreen,
                    ),
                    const SizedBox(width: 8),
                    _buildFilterChip(
                      label: 'Counterfeit (${history.counterfeitCount})',
                      filterKey: 'counterfeit',
                      activeFilter: history.activeFilter,
                      ref: ref,
                      activeColor: AppColors.counterfeitRed,
                    ),
                    const SizedBox(width: 8),
                    _buildFilterChip(
                      label: 'Inconclusive',
                      filterKey: 'inconclusive',
                      activeFilter: history.activeFilter,
                      ref: ref,
                      activeColor: AppColors.inconclusiveAmber,
                    ),
                  ],
                ),
              ),
            ),

            const Divider(height: 1),

            // 2. Scan Items List or Empty State
            Expanded(
              child: scans.isEmpty
                  ? _buildEmptyState(context, isDark, history.totalCount > 0)
                  : ListView.separated(
                      padding: const EdgeInsets.all(16),
                      itemCount: scans.length,
                      separatorBuilder: (context, index) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final scan = scans[index];
                        return _buildScanCard(context, ref, scan, isDark);
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip({
    required String label,
    required String filterKey,
    required String activeFilter,
    required WidgetRef ref,
    Color? activeColor,
  }) {
    final isSelected = activeFilter == filterKey;

    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) {
        ref.read(historyProvider.notifier).setFilter(filterKey);
      },
      selectedColor: (activeColor ?? AppColors.primaryBlueLight).withOpacity(0.2),
      checkmarkColor: activeColor ?? AppColors.primaryBlueLight,
      labelStyle: TextStyle(
        fontSize: 12,
        fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
        color: isSelected ? (activeColor ?? AppColors.primaryBlueLight) : null,
      ),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    );
  }

  Widget _buildScanCard(
    BuildContext context,
    WidgetRef ref,
    ScanResult scan,
    bool isDark,
  ) {
    final dateStr = DateFormat('MMM dd, yyyy • h:mm a').format(scan.timestamp);

    return Dismissible(
      key: Key(scan.id),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        decoration: BoxDecoration(
          color: AppColors.counterfeitRed,
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Icon(Icons.delete_sweep_rounded, color: Colors.white, size: 28),
      ),
      onDismissed: (_) {
        ref.read(historyProvider.notifier).deleteScan(scan.id);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Removed ${scan.id} from history'),
            duration: const Duration(seconds: 2),
          ),
        );
      },
      child: Card(
        margin: EdgeInsets.zero,
        child: InkWell(
          onTap: () {
            context.push('/result', extra: scan);
          },
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                // Thumbnail
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    width: 72,
                    height: 72,
                    color: isDark ? AppColors.darkBackground : AppColors.lightCard,
                    child: _buildThumbnail(scan.images.isNotEmpty ? scan.images.first : ''),
                  ),
                ),
                const SizedBox(width: 14),

                // Details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        scan.modelGuess.isNotEmpty ? scan.modelGuess : 'Sneaker Authentication',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${scan.brandGuess} • ${scan.id}',
                        style: TextStyle(
                          fontSize: 12,
                          color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        dateStr,
                        style: TextStyle(
                          fontSize: 11,
                          color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(width: 8),

                // Verdict Badge
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    ResultBadge(
                      verdict: scan.verdict,
                      size: ResultBadgeSize.small,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${scan.confidencePercent.toStringAsFixed(1)}%',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: scan.verdict.color,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildThumbnail(String path) {
    if (path.isEmpty) {
      return const Icon(Icons.image_outlined, size: 28, color: Colors.white24);
    }
    if (path.startsWith('http')) {
      return Image.network(path, fit: BoxFit.cover);
    }
    final file = File(path);
    if (file.existsSync()) {
      return Image.file(file, fit: BoxFit.cover);
    }
    return const Icon(Icons.broken_image_rounded, size: 28, color: Colors.white24);
  }

  Widget _buildEmptyState(BuildContext context, bool isDark, bool isFiltered) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.primaryBlue.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.inventory_2_outlined,
                size: 54,
                color: AppColors.primaryBlueLight,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              isFiltered ? 'No scans in this category' : 'No Scans Yet',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              isFiltered
                  ? 'Try selecting another filter above or run a new scan.'
                  : 'Start by scanning your first pair of sneakers using our 9-angle anti-scam inspection protocol.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 24),
            CustomButton(
              label: 'Scan a Shoe Now',
              icon: Icons.camera_alt_rounded,
              width: 200,
              onPressed: () => context.go('/'),
            ),
          ],
        ),
      ),
    );
  }

  void _confirmClearHistory(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear Scan History?'),
        content: const Text('All saved authentication certificates and checkpoint reports will be removed.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              ref.read(historyProvider.notifier).clearHistory();
            },
            child: const Text('Clear All', style: TextStyle(color: AppColors.counterfeitRed)),
          ),
        ],
      ),
    );
  }
}
