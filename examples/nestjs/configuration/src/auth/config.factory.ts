export const configFactory = () => {
  console.log('process.env.AUTH_ENABLED_ENV: ' + process.env.AUTH_ENABLED_ENV);
  return {
    AUTH_ENABLED: process.env.AUTH_ENABLED_ENV === 'true',
  };
};
