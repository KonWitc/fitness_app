import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../api/generated/models/create_exercise_dto.dart';
import '../../api/generated/models/exercise_entity.dart';
import '../../api/generated/models/update_exercise_dto.dart';
import '../../core/api.dart';
import 'exercise_utils.dart';
import 'exercises_providers.dart';

/// Opens the create form, or the edit form when [exercise] is given.
/// Resolves to `true` if something was saved.
Future<bool?> showExerciseForm(
  BuildContext context, {
  ExerciseEntity? exercise,
}) {
  return showModalBottomSheet<bool>(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    showDragHandle: true,
    builder: (_) => ExerciseForm(exercise: exercise),
  );
}

class ExerciseForm extends ConsumerStatefulWidget {
  const ExerciseForm({super.key, this.exercise});

  final ExerciseEntity? exercise;

  @override
  ConsumerState<ExerciseForm> createState() => _ExerciseFormState();
}

class _ExerciseFormState extends ConsumerState<ExerciseForm> {
  final _formKey = GlobalKey<FormState>();
  late final _name = TextEditingController(text: widget.exercise?.name);
  late final _description = TextEditingController(
    text: widget.exercise?.description,
  );
  late final _imageUrl = TextEditingController(text: widget.exercise?.imageUrl);
  late final _videoUrl = TextEditingController(text: widget.exercise?.videoUrl);
  late String _category = widget.exercise?.category ?? categories.first;
  late String? _muscleGroup = widget.exercise?.muscleGroup;

  bool _saving = false;
  String? _error;

  bool get _isEdit => widget.exercise != null;

  @override
  void dispose() {
    for (final c in [_name, _description, _imageUrl, _videoUrl]) {
      c.dispose();
    }
    super.dispose();
  }

  static String? _orNull(TextEditingController c) =>
      c.text.trim().isEmpty ? null : c.text.trim();

  static String? _validateUrl(String? value) {
    final v = value?.trim() ?? '';
    if (v.isEmpty) return null;
    final uri = Uri.tryParse(v);
    final ok = uri != null && uri.hasScheme && uri.host.isNotEmpty;
    return ok ? null : 'Enter a full URL (https://...)';
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _saving = true;
      _error = null;
    });

    final actions = ref.read(exerciseActionsProvider);
    try {
      if (_isEdit) {
        // Every field is sent, so cleared optional fields become null.
        await actions.update(
          widget.exercise!.id,
          UpdateExerciseDto(
            name: _name.text.trim(),
            category: _category,
            muscleGroup: _muscleGroup,
            description: _orNull(_description),
            imageUrl: _orNull(_imageUrl),
            videoUrl: _orNull(_videoUrl),
          ),
        );
      } else {
        await actions.create(
          CreateExerciseDto(
            name: _name.text.trim(),
            category: _category,
            muscleGroup: _muscleGroup,
            description: _orNull(_description),
            imageUrl: _orNull(_imageUrl),
            videoUrl: _orNull(_videoUrl),
          ),
        );
      }
      if (mounted) Navigator.of(context).pop(true);
    } catch (e) {
      setState(() {
        _saving = false;
        _error = errorMessage(
          e,
          _isEdit ? 'Failed to update' : 'Failed to create',
        );
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // Keep values the API returned even if they're not in our fixed lists.
    final categoryOptions = {...categories, _category};
    final groupOptions = {...muscleGroups, ?_muscleGroup};

    return Padding(
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        bottom: MediaQuery.viewInsetsOf(context).bottom + 24,
      ),
      child: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            spacing: 16,
            children: [
              Text(
                _isEdit ? 'Edit exercise' : 'New exercise',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              if (_error != null)
                Text(
                  _error!,
                  style: TextStyle(color: Theme.of(context).colorScheme.error),
                ),
              TextFormField(
                controller: _name,
                autofocus: !_isEdit,
                textCapitalization: TextCapitalization.words,
                decoration: const InputDecoration(
                  labelText: 'Name *',
                  hintText: 'e.g. Bench Press',
                ),
                validator: (v) =>
                    (v ?? '').trim().isEmpty ? 'Name is required' : null,
              ),
              DropdownButtonFormField<String>(
                initialValue: _category,
                decoration: const InputDecoration(labelText: 'Category *'),
                items: [
                  for (final c in categoryOptions)
                    DropdownMenuItem(value: c, child: Text(capitalize(c))),
                ],
                onChanged: (v) => setState(() => _category = v!),
              ),
              DropdownButtonFormField<String?>(
                initialValue: _muscleGroup,
                decoration: const InputDecoration(labelText: 'Muscle group'),
                items: [
                  const DropdownMenuItem(value: null, child: Text('None')),
                  for (final g in groupOptions)
                    DropdownMenuItem(value: g, child: Text(capitalize(g))),
                ],
                onChanged: (v) => setState(() => _muscleGroup = v),
              ),
              TextFormField(
                controller: _description,
                maxLines: 3,
                minLines: 1,
                decoration: const InputDecoration(labelText: 'Description'),
              ),
              TextFormField(
                controller: _imageUrl,
                keyboardType: TextInputType.url,
                decoration: const InputDecoration(
                  labelText: 'Image URL',
                  hintText: 'https://example.com/image.jpg',
                ),
                validator: _validateUrl,
              ),
              TextFormField(
                controller: _videoUrl,
                keyboardType: TextInputType.url,
                decoration: const InputDecoration(
                  labelText: 'Video URL',
                  hintText: 'https://youtube.com/watch?v=...',
                ),
                validator: _validateUrl,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                spacing: 8,
                children: [
                  TextButton(
                    onPressed: _saving
                        ? null
                        : () => Navigator.of(context).pop(false),
                    child: const Text('Cancel'),
                  ),
                  FilledButton(
                    onPressed: _saving ? null : _submit,
                    child: _saving
                        ? const SizedBox.square(
                            dimension: 18,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : Text(_isEdit ? 'Save' : 'Create'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
