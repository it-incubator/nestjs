import { validateSync } from 'class-validator';

export function validateConfig(config: any) {
  const errors = validateSync(config, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
}

export function validateConfigWithMessage(config: any) {
  const errors = validateSync(config, { skipMissingProperties: false });
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
