import { PartialSettingsType } from './base.settings';

export const settings: Partial<PartialSettingsType> = {
  source3: 'development.local',
  payments: {
    availablePaymentSystems: ['paypal'],
  },
};
