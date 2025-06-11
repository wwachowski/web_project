import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NotificationComponent } from './components/notification/notification.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';

  constructor(public router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') || !!localStorage.getItem('userId');
  }

  name(): string | null {
    return localStorage.getItem('firstName');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('firstName');
    this.router.navigate(['/login']);
  }

  login() {
    this.router.navigate(['/login']);
  }

  isLoginPage(): boolean {
    return this.router.isActive('/login', true) || this.router.isActive('/register', true);
  }
}
