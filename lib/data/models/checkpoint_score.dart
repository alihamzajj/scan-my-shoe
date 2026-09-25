enum CheckpointStatus { pass, flagged, warning }

class CheckpointScore {
  final String title;
  final double score; // 0.0 to 1.0
  final CheckpointStatus status;
  final String description;
  final String angleId;

  const CheckpointScore({
    required this.title,
    required this.score,
    required this.status,
    required this.description,
    required this.angleId,
  });

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'score': score,
      'status': status.name,
      'description': description,
      'angleId': angleId,
    };
  }

  factory CheckpointScore.fromMap(Map<String, dynamic> map) {
    return CheckpointScore(
      title: map['title'] as String? ?? '',
      score: (map['score'] as num?)?.toDouble() ?? 0.0,
      status: CheckpointStatus.values.firstWhere(
        (e) => e.name == map['status'],
        orElse: () => CheckpointStatus.pass,
      ),
      description: map['description'] as String? ?? '',
      angleId: map['angleId'] as String? ?? '',
    );
  }
}
