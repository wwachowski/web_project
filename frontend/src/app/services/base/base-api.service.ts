import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  warning?: string;
  error?: string;
}

const BASE_URL = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export abstract class BaseApiService {
  protected readonly http = inject(HttpClient);
  protected readonly localStorage = window.localStorage;

  constructor(private readonly endpoint: string) {}

  protected get<T>(path: string = '', options?: any) {
    return this.http.get<T>(`${BASE_URL}${this.endpoint}${path}`, options);
  }

  protected post<T>(path: string = '', body?: any, options?: any) {
    return this.http.post<T>(`${BASE_URL}${this.endpoint}${path}`, body, options);
  }

  protected put<T>(path: string = '', body?: any, options?: any) {
    return this.http.put<T>(`${BASE_URL}${this.endpoint}${path}`, body, options);
  }

  protected delete<T>(path: string = '', options?: any) {
    return this.http.delete<T>(`${BASE_URL}${this.endpoint}${path}`, options);
  }
}
