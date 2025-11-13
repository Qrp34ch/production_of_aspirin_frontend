const target_tauri = true;

export const API_BASE_URL = target_tauri 
  ? 'http://192.168.0.102:8080/API'  // Для Tauri - прямой IP
  : '/API';                       // Для веб - proxy

export const IMAGE_BASE_URL = target_tauri
  ? 'http://192.168.0.102:9000'  // Для Tauri - прямой IP
  : '';                          // Для веб - относительные пути

export const BASE_PATH = target_tauri 
  ? '' 
  : '/RIP_frontend';