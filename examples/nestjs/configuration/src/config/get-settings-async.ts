import {
  settings as baseSettings,
  SettingsType,
} from '../../settings/base.settings';
import { Environments } from './get-configuration';
import { resolve } from 'path';
import { mergeDeep } from '../../settings/utils/merge-deep';

export const getSettingsAsync = async (): Promise<SettingsType> => {
  const settings = await loadEnvironmentSettings(
    process.env.NODE_ENV as Environments,
  );
  return settings;
};

async function loadEnvironmentSettings(
  node_env: Environments,
): Promise<SettingsType> {
  const env = node_env.toLowerCase();
  // Базовый импорт для текущего окружения
  const environmentSettingsModule = await import(
    `${__dirname}/../../settings/${env}.settings`
  );

  const environmentSettings = environmentSettingsModule.settings;

  // Если режим development, проверяем наличие settings.development.local.ts
  let localSettings = {};
  if (node_env === Environments.DEVELOPMENT) {
    const localSettingsPath = resolve(
      __dirname,
      '..',
      '..',
      'settings',
      'development.local.settings',
    );
    //if (existsSync(localSettingsPath)) {
    try {
      const localSettingsModule = await import(localSettingsPath);
      localSettings = localSettingsModule.settings;
    } catch {
      console.warn('No development.local.settings.ts');
    }
    //}
  }

  // Объединяем базовые настройки, окружение и, при наличии, локальные настройки
  return mergeDeep(baseSettings, mergeDeep(environmentSettings, localSettings));
}
