import 'package:flutter/material.dart';

class ShoeAngleInfo {
  final String id;
  final String title;
  final String subtitle;
  final String instruction;
  final String overlayAsset;
  final bool isRequired;
  final IconData icon;
  final String inspectionTip;

  const ShoeAngleInfo({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.instruction,
    required this.overlayAsset,
    required this.isRequired,
    required this.icon,
    required this.inspectionTip,
  });
}

class ShoeAngles {
  static const List<ShoeAngleInfo> angles = [
    ShoeAngleInfo(
      id: 'side_left',
      title: 'Outer Lateral Profile',
      subtitle: 'Left outside view',
      instruction: 'Align outer silhouette flat against a clean, contrasting background.',
      overlayAsset: 'assets/silhouettes/side_left.svg',
      isRequired: true,
      icon: Icons.directions_walk_rounded,
      inspectionTip: 'Inspects overall shoe curve, midsole paint line consistency, and swoosh/logo height.',
    ),
    ShoeAngleInfo(
      id: 'side_right',
      title: 'Inner Medial Profile',
      subtitle: 'Right inside view',
      instruction: 'Capture the medial side showing arch curve and inner stitching lines.',
      overlayAsset: 'assets/silhouettes/side_right.svg',
      isRequired: true,
      icon: Icons.alt_route_rounded,
      inspectionTip: 'Checks arch curvature, medial text placement, and leather cut bevels.',
    ),
    ShoeAngleInfo(
      id: 'toe_box',
      title: 'Toe Box & Vamp',
      subtitle: 'Top-down front view',
      instruction: 'Hold camera directly above the front toe area and mudguard.',
      overlayAsset: 'assets/silhouettes/toe_box.svg',
      isRequired: true,
      icon: Icons.crop_square_rounded,
      inspectionTip: 'Scans perforation hole symmetry, mudguard width, and toe box slimness.',
    ),
    ShoeAngleInfo(
      id: 'heel_back',
      title: 'Heel & Rear Counter',
      subtitle: 'Direct back view',
      instruction: 'Hold shoe eye-level from behind to verify heel symmetry and hourglass shape.',
      overlayAsset: 'assets/silhouettes/heel_back.svg',
      isRequired: true,
      icon: Icons.view_column_rounded,
      inspectionTip: 'Verifies authentic hourglass pinch, heel tab stitching, and midsole thickness balance.',
    ),
    ShoeAngleInfo(
      id: 'sole_tread',
      title: 'Sole & Traction Tread',
      subtitle: 'Full bottom view',
      instruction: 'Flip shoe upside down and ensure the entire outsole tread is in frame.',
      overlayAsset: 'assets/silhouettes/sole_tread.svg',
      isRequired: true,
      icon: Icons.grid_on_rounded,
      inspectionTip: 'Examines pivot circle concentricity, mold stars/texture, and rubber finish sheen.',
    ),
    ShoeAngleInfo(
      id: 'logo_closeup',
      title: 'Logo Close-Up',
      subtitle: 'Macro brand badge / emblem',
      instruction: 'Get within 4-6 inches of the primary logo or emblem with sharp focus.',
      overlayAsset: 'assets/silhouettes/logo_closeup.svg',
      isRequired: true,
      icon: Icons.verified_rounded,
      inspectionTip: 'Analyzes font kerning, wings/emblem embossing depth, and trademark symbol clarity.',
    ),
    ShoeAngleInfo(
      id: 'stitching',
      title: 'Corner Stitching Macro',
      subtitle: 'Midsole / panel stitch detail',
      instruction: 'Take a clear macro shot of the stitching along the collar or midsole border.',
      overlayAsset: 'assets/silhouettes/stitching.svg',
      isRequired: true,
      icon: Icons.texture_rounded,
      inspectionTip: 'Calculates stitches-per-inch (SPI), corner stitch clearance, and thread tension.',
    ),
    ShoeAngleInfo(
      id: 'size_tag',
      title: 'Size Tag & Label',
      subtitle: 'Inside collar or tongue tag',
      instruction: 'Open tongue to photograph production dates, barcode, and factory SKU.',
      overlayAsset: 'assets/silhouettes/size_tag.svg',
      isRequired: false, // marked optional per prompt
      icon: Icons.qr_code_2_rounded,
      inspectionTip: 'Checks factory font thickness, barcode line density, and UPC mismatch against database.',
    ),
    ShoeAngleInfo(
      id: 'insole',
      title: 'Insole & Footbed',
      subtitle: 'Insole stamp or footbed glue',
      instruction: 'Remove or slide camera into collar to snap insole logo or footbed stitching.',
      overlayAsset: 'assets/silhouettes/insole.svg',
      isRequired: false, // marked optional per prompt
      icon: Icons.layers_rounded,
      inspectionTip: 'Inspects insole backside glue pattern, strobel board stitching density, and footbed stamp.',
    ),
  ];
}
