const providers = [];

export function getProviders() {
  return providers;
}

export const registrateProvider = (provider: any) => {
  console.log('registrateProvider:  ' + provider.name);
  providers.push(provider);
};
