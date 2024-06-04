declare global {
  interface Window {
    __TAURI__: Record<string, unknown>;
  }
}

export {};