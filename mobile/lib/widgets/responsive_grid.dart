import 'package:flutter/material.dart';

/// Lays children out in as many equal-width columns as fit (1 on phones, up to
/// [maxColumns] on wide screens). Unlike GridView, rows may differ in height,
/// so cards with and without images both fit.
class ResponsiveGrid extends StatelessWidget {
  const ResponsiveGrid({
    super.key,
    required this.children,
    this.minItemWidth = 320,
    this.maxColumns = 3,
    this.spacing = 12,
  });

  final List<Widget> children;
  final double minItemWidth;
  final int maxColumns;
  final double spacing;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final width = constraints.maxWidth;
        final columns = ((width + spacing) / (minItemWidth + spacing))
            .floor()
            .clamp(1, maxColumns);
        final itemWidth = (width - spacing * (columns - 1)) / columns;

        return Wrap(
          spacing: spacing,
          runSpacing: spacing,
          children: [
            for (final child in children)
              SizedBox(width: itemWidth, child: child),
          ],
        );
      },
    );
  }
}
