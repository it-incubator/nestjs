import { PartialSettingsType } from './base.settings';

export const settings: Partial<PartialSettingsType> = {
  source2: 'staging',
  payments: {
    availablePaymentSystems: ['paypal'],
  },
};
