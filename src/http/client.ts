import { fetch, FetchOptions, Response } from "@tauri-apps/api/http";


interface RequestInterceptor {
  onRequest(config: FetchOptions): FetchOptions | Promise<FetchOptions>;
}

interface ResponseInterceptor {
  onResponse<T>(response: Response<T>): Response<T> | Promise<Response<T>>;
  onError(error: Error): void | Promise<void>;
}

class HttpClient {
  private baseURL: string = '';
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  private constructor() {}

  private static instance: HttpClient;

  static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  private async executeRequestInterceptors(config: FetchOptions): Promise<FetchOptions> {
    for (const interceptor of this.requestInterceptors) {
      config = await interceptor.onRequest(config);
    }
    return config;
  }

  private async executeResponseInterceptors<T>(response: Response<T>): Promise<Response<T>> {
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor.onResponse(response);
    }
    return response;
  }

  private async executeErrorInterceptors(error: Error): Promise<void> {
    for (const interceptor of this.responseInterceptors) {
      await interceptor.onError(error);
    }
  }

  async request<T>(url: string, options: FetchOptions): Promise<T> {
    const config = await this.executeRequestInterceptors(options);

    try {
      const response = await fetch<T>(this.baseURL + url, config);
      const processedResponse = await this.executeResponseInterceptors(response);
      return processedResponse.data;
    } catch (error) {
      await this.executeErrorInterceptors(error as Error);
      throw error;
    }
  }
}

const httpClient = HttpClient.getInstance();
export default httpClient;
