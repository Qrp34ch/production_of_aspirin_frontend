export {};

declare global {
  interface Window {
    __TAURI__?: {
      invoke: (command: string, payload?: any) => Promise<any>;
      event: {
        listen: (event: string, handler: (event: any) => void) => Promise<void>;
        emit: (event: string, payload?: any) => Promise<void>;
      };
    };
  }
}