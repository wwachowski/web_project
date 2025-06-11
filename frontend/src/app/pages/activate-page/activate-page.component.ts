import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-activate-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './activate-page.component.html',
  styleUrl: './activate-page.component.scss',
})
export class ActivatePageComponent implements OnInit {
  message = '';
  error = '';
  loading = true;

  constructor(private route: ActivatedRoute, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');

    if (token) {
      this.auth.activateAccount(token).subscribe({
        next: (res) => {
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = err.error || err.message || 'Błąd aktywacji konta';
          this.loading = false;
        },
      });
    } else {
      this.error = 'Brak tokena aktywacyjnego';
      this.loading = false;
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
