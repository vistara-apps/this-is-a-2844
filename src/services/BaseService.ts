// Base Service Class with Common Functionality

import { ApiResponse, ApiError, RequestConfig } from '../types/api';

export class BaseService {
  protected baseURL: string;
  protected apiKey?: string;
  protected defaultConfig: RequestConfig;

  constructor(baseURL: string, apiKey?: string, config?: RequestConfig) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.defaultConfig = {
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      ...config
    };
  }

  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const requestConfig = { ...this.defaultConfig, ...config };
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.apiKey) {
      (headers as any)['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
    };

    return this.executeWithRetry(url, requestOptions, requestConfig);
  }

  private async executeWithRetry<T>(
    url: string,
    options: RequestInit,
    config: RequestConfig
  ): Promise<ApiResponse<T>> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= (config.retries || 0); attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return {
          data,
          success: true,
        };
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < (config.retries || 0)) {
          await this.delay(config.retryDelay || 1000);
          continue;
        }
      }
    }

    return {
      data: null as any,
      success: false,
      error: lastError?.message || 'Unknown error occurred',
    };
  }

  protected async makeGraphQLRequest<T>(
    query: string,
    variables?: Record<string, any>,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      '',
      {
        method: 'POST',
        body: JSON.stringify({
          query,
          variables,
        }),
      },
      config
    );
  }

  protected handleError(error: any): ApiError {
    if (error.response) {
      return {
        code: error.response.status.toString(),
        message: error.response.data?.message || error.message,
        details: error.response.data,
      };
    }

    if (error.request) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network request failed',
        details: error.request,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      details: error,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logData = data ? JSON.stringify(data) : '';
    
    console[level](`[${timestamp}] ${this.constructor.name}: ${message}`, logData);
  }
}
