import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../api/generated/models/exercise_entity.dart';
import 'exercise_utils.dart';

class ExerciseCard extends StatelessWidget {
  const ExerciseCard({
    super.key,
    required this.exercise,
    required this.onEdit,
    required this.onDelete,
  });

  final ExerciseEntity exercise;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;

    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onEdit,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 4, 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(child: Text(exercise.name, style: text.titleMedium)),
                  PopupMenuButton<VoidCallback>(
                    tooltip: 'Actions for ${exercise.name}',
                    onSelected: (action) => action(),
                    itemBuilder: (_) => [
                      PopupMenuItem(value: onEdit, child: const Text('Edit')),
                      PopupMenuItem(
                        value: onDelete,
                        child: const Text('Delete'),
                      ),
                    ],
                  ),
                ],
              ),
              Padding(
                padding: const EdgeInsets.only(right: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: 8,
                  children: [
                    _CategoryBadge(exercise.category),
                    if (exercise.videoUrl case final url?)
                      _Video(url: url)
                    else if (exercise.imageUrl case final url?)
                      _Thumbnail(url: url),
                    if (exercise.description case final d?)
                      Text(d, style: text.bodyMedium),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CategoryBadge extends StatelessWidget {
  const _CategoryBadge(this.category);

  final String category;

  @override
  Widget build(BuildContext context) {
    final color = categoryColor(category);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        category,
        style: Theme.of(context).textTheme.labelMedium?.copyWith(color: color),
      ),
    );
  }
}

/// YouTube links show the video thumbnail; other links a "Watch video" button.
/// Both open externally (an embedded player can come later).
class _Video extends StatelessWidget {
  const _Video({required this.url});

  final String url;

  @override
  Widget build(BuildContext context) {
    final id = youtubeId(url);
    if (id == null) {
      return TextButton.icon(
        onPressed: () => _open(url),
        icon: const Icon(Icons.play_circle_outline),
        label: const Text('Watch video'),
      );
    }
    return InkWell(
      onTap: () => _open(url),
      borderRadius: BorderRadius.circular(8),
      child: Stack(
        alignment: Alignment.center,
        children: [
          _Thumbnail(url: 'https://img.youtube.com/vi/$id/hqdefault.jpg'),
          const Icon(Icons.play_circle_fill, size: 56, color: Colors.white),
        ],
      ),
    );
  }

  static Future<void> _open(String url) async {
    final uri = Uri.tryParse(url);
    if (uri != null) await launchUrl(uri, mode: LaunchMode.externalApplication);
  }
}

class _Thumbnail extends StatelessWidget {
  const _Thumbnail({required this.url});

  final String url;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: AspectRatio(
        aspectRatio: 16 / 9,
        child: Image.network(
          url,
          fit: BoxFit.cover,
          errorBuilder: (context, _, _) => ColoredBox(
            color: Theme.of(context).colorScheme.surfaceContainerHighest,
            child: const Icon(Icons.broken_image_outlined),
          ),
        ),
      ),
    );
  }
}
