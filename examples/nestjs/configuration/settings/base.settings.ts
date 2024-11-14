import { DeepPartial } from './utils/deep-partial.type';

export const settings = {
  WHO_WIN: 'settingsfile',
  source1: 'base',
  source2: '',
  source3: '',
  photos: {
    /**
     * In megabytes
     */
    maxSize: 100,
  },
  payments: {
    /**
     * Тарифные планы
     */
    tariffPlans: [
      { type: 'basic', price: 20 },
      { type: 'premium', price: 50 },
      { type: 'vip', price: 100 },
    ],
    /**
     * Доступные для оплаты платёжные системы
     */
    availablePaymentSystems: ['stripe', 'paypal', 'tinkoff'],
  },
};

export type SettingsType = typeof settings;
export type PartialSettingsType = DeepPartial<SettingsType>;
