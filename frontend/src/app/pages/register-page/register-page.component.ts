import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  imports: [CommonModule, FormsModule, RouterModule],
})
export class RegisterPageComponent {
  email = '';
  password = '';
  firstName = '';
  lastName = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit() {
    this.auth.register({ email: this.email, first_name: this.firstName, last_name: this.lastName, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (e) => {
        this.error = e.error || e.message || 'Błąd rejestracji';
      },
    });
  }
}
