import { DeepPartial } from './deep-partial.type';

export function mergeDeep<T>(target: T, source: DeepPartial<T>): T {
  const output = { ...target };

  for (const key in source) {
    if (source[key] instanceof Array) {
      // Полностью заменяем массивы
      output[key] = source[key] as T[typeof key];
    } else if (source[key] instanceof Object) {
      // Если объект, рекурсивно мержим
      output[key] = mergeDeep(
        target[key],
        source[key] as Partial<T[typeof key]>,
      );
    } else {
      // Для других типов (строки, числа и т.д.) просто заменяем значение
      output[key] = source[key] as T[typeof key];
    }
  }

  return output;
}
