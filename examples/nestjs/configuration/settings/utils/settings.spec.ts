import { mergeDeep } from './merge-deep';

describe('mergeDeep', () => {
  it('должна перезаписывать верхнеуровневые свойства', () => {
    const base = { photos: { maxSize: 100 } };
    const env = { photos: { maxSize: 50 } };

    const result = mergeDeep(base, env);
    expect(result).toEqual({ photos: { maxSize: 50 } });
  });

  it('должна рекурсивно мержить вложенные объекты', () => {
    const base = { settings: { theme: { color: 'blue', fontSize: 12 } } };
    const env = { settings: { theme: { fontSize: 14 } } };

    const result = mergeDeep(base, env);
    expect(result).toEqual({
      settings: { theme: { color: 'blue', fontSize: 14 } },
    });
  });

  it('должна полностью заменять массивы', () => {
    const base = {
      payments: { availablePaymentSystems: ['stripe', 'paypal'] },
    };
    const env = { payments: { availablePaymentSystems: ['tinkoff'] } };

    const result = mergeDeep(base, env);
    expect(result).toEqual({
      payments: { availablePaymentSystems: ['tinkoff'] },
    });
  });

  it('должна корректно работать с комбинацией объектов и массивов', () => {
    const base = {
      photos: { maxSize: 100 },
      payments: {
        tariffPlans: [
          { type: 'basic', price: 20 },
          { type: 'premium', price: 50 },
        ],
        availablePaymentSystems: ['stripe', 'paypal'],
      },
    };

    const env = {
      payments: {
        tariffPlans: [{ type: 'vip', price: 100 }],
        availablePaymentSystems: ['tinkoff'],
      },
    };

    const result = mergeDeep(base, env);
    expect(result).toEqual({
      photos: { maxSize: 100 },
      payments: {
        tariffPlans: [{ type: 'vip', price: 100 }],
        availablePaymentSystems: ['tinkoff'],
      },
    });
  });

  it('должна возвращать базовый объект, если source пустой', () => {
    const base = {
      photos: { maxSize: 100 },
      payments: { availablePaymentSystems: ['stripe'] },
    };
    const env = {};

    const result = mergeDeep(base, env);
    expect(result).toEqual(base);
  });
});
