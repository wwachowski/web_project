import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  imports: [CommonModule, FormsModule, RouterModule],
})
export class LoginPageComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        const response = res as unknown as any;
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('firstName', response.data.user.first_name);
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.error = e.error || e.message || 'Błąd logowania';
        // this.router.navigate(['/']);
      },
    });
  }
}
