import { Transform } from 'class-transformer';

// Input normalization for DTOs. Transforms run before validation, so
// `@IsNotEmpty()` sees the trimmed value. Non-strings pass through untouched
// and are rejected by `@IsString()`.

/** Trim whitespace. */
export const Trim = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value
  );

/** Trim and lowercase (used for category / muscleGroup). */
export const TrimLower = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value
  );

/** Trim; an empty string becomes `null` (optional fields). */
export const TrimOrNull = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() || null : value
  );

/** Trim and lowercase; an empty string becomes `null`. */
export const TrimLowerOrNull = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() || null : value
  );
