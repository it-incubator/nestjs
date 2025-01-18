import { validateSync } from 'class-validator';

// просто утилита, даже не классом её сделали, чтобы не париться с DI и использовать её напрямую где надо нам.
export const configValidationUtility = {
  validateConfig: (configInstance: any) => {
    const errors = validateSync(configInstance);
    if (errors.length > 0) {
      const sortedMessages = errors
        .map((error) => {
          const currentValue = error.value;
          const constraints = Object.values(error.constraints || {}).join(', ');
          return `${constraints} (current value: ${currentValue})`;
        })
        .join('; ');
      throw new Error('Validation failed: ' + sortedMessages);
    }
  },
  convertToBoolean(value: string) {
    const trimmedValue = value?.trim();
    if (trimmedValue === 'true') return true;
    if (trimmedValue === '1') return true;
    if (trimmedValue === 'enabled') return true;
    if (trimmedValue === 'false') return false;
    if (trimmedValue === '0') return false;
    if (trimmedValue === 'disabled') return false;

    return null;
  },
  getEnumValues<T extends Record<string, string>>(enumObj: T): string[] {
    return Object.values(enumObj);
  },
};
