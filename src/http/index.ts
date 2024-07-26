import httpClient from './client';
import { FetchOptions, Response, ResponseType,Body } from "@tauri-apps/api/http";

httpClient.setBaseURL('http://jsonplaceholder.typicode.com');

httpClient.addRequestInterceptor({
  onRequest(config: FetchOptions): FetchOptions {
    config.headers = {
      ...config.headers,
    };
    return config;
  }
});

httpClient.addResponseInterceptor({
  onResponse<T>(response: Response<T>): Response<T> {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  },
  onError(error: Error): void {
    console.error('HTTP request error:', error);
    throw error;
  }
});

const get = async <T>(url: string) => {
  return httpClient.request<T>(url, { method: 'GET', responseType: ResponseType.JSON })
}
const post = async <T>(url: string,data:Record<string, unknown>) => {
  return httpClient.request<T>(url, { method: 'POST', body:Body.json(data), responseType: ResponseType.JSON })
}

export default {
  get,
  post
}