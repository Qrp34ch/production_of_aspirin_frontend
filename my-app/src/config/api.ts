export const getApiBaseUrl = (): string => {
  if (import.meta.env.PROD) {
    return 'http://192.168.0.102:8080/API';
  }
  return '/API';
};

export const getTauriApiBaseUrl = (): string => {
  return 'http://192.168.0.102:8080/API';
};