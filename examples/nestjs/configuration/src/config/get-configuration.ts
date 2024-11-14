export enum Environments {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  // 'production' данная переменная не допустима, так как isProduction будет работать не корректно
  PRODUCTION = 'PRODUCTION',
  TEST = 'TEST',
}

// Экспортируем итоговые настройки

export const getConfigurationAsync = async () => {
  console.log('getConfiguration: PORT:' + process.env.PORT);
  console.log('getConfiguration: VALUE1:' + process.env.VALUE1);
  return {
    PORT: process.env.PORT,
    VALUE1: process.env.VALUE1,
    WHO_WIN: 'CODE',
  };
};
