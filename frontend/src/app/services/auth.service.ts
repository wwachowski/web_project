import { Injectable } from '@angular/core';
import { BaseApiService } from './base/base-api.service';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseApiService {
  constructor() {
    super('/auth');
  }

  login(email: string, password: string) {
    return this.post<{ token: string; user: any }>('/login', { email, password });
  }

  register(data: { first_name: string; last_name: string; email: string; password: string }) {
    return this.post('/register', data);
  }

  activateAccount(token: string) {
    return this.get(`/activate/${token}`);
  }

  logout() {
    this.localStorage.removeItem('token');
  }
}
