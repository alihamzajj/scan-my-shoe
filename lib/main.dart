import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/routes/app_router.dart';
import 'core/theme/app_theme.dart';
import 'data/services/storage_service.dart';
import 'providers/theme_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize local Hive storage for scan history
  await StorageService.init();

  // Pre-seed demo authentic and replica scan reports on first launch
  await StorageService.seedInitialScansIfEmpty();

  runApp(
    const ProviderScope(
      child: AuthentiCheckApp(),
    ),
  );
}

class AuthentiCheckApp extends ConsumerWidget {
  const AuthentiCheckApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);

    return MaterialApp.router(
      title: 'AuthentiCheck',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
      routerConfig: appRouter,
    );
  }
}
