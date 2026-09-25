import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../data/models/scan_result.dart';
import '../../screens/capture/multi_angle_capture_screen.dart';
import '../../screens/history/history_screen.dart';
import '../../screens/home/home_screen.dart';
import '../../screens/processing/processing_screen.dart';
import '../../screens/result/result_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      name: 'home',
      pageBuilder: (context, state) => CustomTransitionPage(
        key: state.pageKey,
        child: const HomeScreen(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
      ),
    ),
    GoRoute(
      path: '/capture',
      name: 'capture',
      pageBuilder: (context, state) => CustomTransitionPage(
        key: state.pageKey,
        child: const MultiAngleCaptureScreen(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          const begin = Offset(0.0, 1.0);
          const end = Offset.zero;
          const curve = Curves.easeInOutCubic;
          var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
          return SlideTransition(position: animation.drive(tween), child: child);
        },
      ),
    ),
    GoRoute(
      path: '/processing',
      name: 'processing',
      pageBuilder: (context, state) {
        final imagePaths = (state.extra as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [];
        return CustomTransitionPage(
          key: state.pageKey,
          child: ProcessingScreen(imagePaths: imagePaths),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return FadeTransition(opacity: animation, child: child);
          },
        );
      },
    ),
    GoRoute(
      path: '/result',
      name: 'result',
      pageBuilder: (context, state) {
        final result = state.extra as ScanResult?;
        if (result == null) {
          return const MaterialPage(child: HomeScreen());
        }
        return CustomTransitionPage(
          key: state.pageKey,
          child: ResultScreen(result: result),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            const begin = Offset(0.0, 0.05);
            const end = Offset.zero;
            const curve = Curves.easeOutQuad;
            var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
            return SlideTransition(
              position: animation.drive(tween),
              child: FadeTransition(opacity: animation, child: child),
            );
          },
        );
      },
    ),
    GoRoute(
      path: '/history',
      name: 'history',
      pageBuilder: (context, state) => CustomTransitionPage(
        key: state.pageKey,
        child: const HistoryScreen(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          const begin = Offset(1.0, 0.0);
          const end = Offset.zero;
          const curve = Curves.easeInOutCubic;
          var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
          return SlideTransition(position: animation.drive(tween), child: child);
        },
      ),
    ),
  ],
);
