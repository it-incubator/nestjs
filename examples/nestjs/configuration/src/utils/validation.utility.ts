import { validateSync } from 'class-validator';

export function validateConfig(obj: any) {
  const errors = validateSync(obj, { skipMissingProperties: false });
  if (errors.length > 0) {
    const formattedErrors = errors
      .map((error) => {
        const constraints = error.constraints
          ? Object.values(error.constraints).join(', ')
          : '';
        return `Property ${error.property} failed: ${constraints}`;
      })
      .join('; ');
    throw new Error(`Configuration validation error: ${formattedErrors}`);
  }
}
