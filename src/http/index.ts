import { fetch, ResponseType, FetchOptions, HttpVerb } from "@tauri-apps/api/http";

interface RequestConfig<D = unknown> extends Omit<FetchOptions, 'body'> {
  url: string;
  method: HttpVerb;
  body?: D;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

type InterceptorRequest = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
type InterceptorResponse = <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>;
type InterceptorError = (error: Error) => never;

interface InterceptorConfig {
  request: InterceptorRequest;
  response: InterceptorResponse;
  error: InterceptorError;
}

class HttpClient {
  private static instance: HttpClient;
  private baseURL: string = "https://api.example.com";
  private interceptors: InterceptorConfig = {
    request: async (config) => {
      console.log('Request:', config);
      const token = await this.getToken();
      return {
        ...config,
        headers: {
          ...config.headers,
          'Authorization': `Bearer ${token}`
        }
      };
    },
    response: (response) => {
      console.log('Response:', response);
      return response;
    },
    error: (error: Error) => {
      console.error('Error:', error);
      if ('status' in error && error.status === 401) {
        this.handleTokenExpiration();
      }
      throw error;
    }
  };

  private constructor() {}

  static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  private async getToken(): Promise<string> {
    // 实现获取token的逻辑
    return "your_token_here";
  }

  private handleTokenExpiration(): void {
    console.log("Handling token expiration...");
  }

  async request<T, D = unknown>(config: RequestConfig<D>): Promise<T> {
    try {
      const interceptedConfig = await this.interceptors.request(config);

      const url = this.baseURL + interceptedConfig.url;
      const options: FetchOptions = {
        ...interceptedConfig,
        body: interceptedConfig.body,
        method: interceptedConfig.method,
        responseType: ResponseType.JSON,
      };

      const response = await fetch<T>(url, options);
      const apiResponse: ApiResponse<T> = {
        data: response.data,
        status: response.status,
        headers: response.headers
      };

      const interceptedResponse = await this.interceptors.response(apiResponse);
      return interceptedResponse.data;
    } catch (error) {
      return this.interceptors.error(error instanceof Error ? error : new Error(String(error)));
    }
  }

  get<T>(url: string, config?: Omit<RequestConfig, "url" | "method">): Promise<T> {
    return this.request<T>({ ...config, url, method: "GET" });
  }

  post<T, D>(url: string, data?: D, config?: Omit<RequestConfig, "url" | "method" | "body">): Promise<T> {
    return this.request<T, D>({ ...config, url, method: "POST", body: data });
  }

  setBaseURL(url: string): void {
    this.baseURL = url;
  }

  setInterceptors(interceptors: Partial<InterceptorConfig>): void {
    this.interceptors = { ...this.interceptors, ...interceptors };
  }
}

export default HttpClient.getInstance();
