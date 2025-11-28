// const target_tauri = true;

// export const API_BASE_URL = target_tauri 
//   ? 'http://192.168.0.102:8080/API'  // Для Tauri - прямой IP
//   : '/API';                       // Для веб - proxy

// export const IMAGE_BASE_URL = target_tauri
//   ? 'http://192.168.0.102:9000'  // Для Tauri - прямой IP
//   : '';                          // Для веб - относительные пути

// export const BASE_PATH = target_tauri 
//   ? '' 
//   : '/RIP_frontend';

// https://24206b2a8fee94.lhr.life
export const API_BASE_URL = 'https://6af422b245e103.lhr.life/API'

export const IMAGE_BASE_URL = 'https://6af422b245e103.lhr.life/minio'
export const transformImageUrl = (originalUrl: string) => {
  return originalUrl.replace('http://localhost:9000', IMAGE_BASE_URL);
};

export const BASE_PATH = '/RIP_frontend'