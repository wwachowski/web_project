import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetTournamentsResponse, Tournament, TournamentService } from '../../services/tournament.service';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../services/base/base-api.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tournament-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tournament-list-page.component.html',
  styleUrl: './tournament-list-page.component.scss',
})
export class TournamentListPageComponent {
  tournaments = signal<Tournament[]>([]);
  loading = signal(false);
  error = signal('');
  page = signal(1);
  totalPages = signal(1);
  search = signal('');
  searchDebounced = signal('');

  constructor(private tournamentService: TournamentService, private router: Router) {
    // Efekt uruchamia loadTournaments() przy każdej zmianie page lub searchDebounced
    effect(() => {
      this.loadTournaments(this.page(), this.searchDebounced());
    });
  }

  loadTournaments(page: number = 1, search: string = '') {
    this.loading.set(true);
    this.tournamentService.getAll(page, search).subscribe({
      next: (res) => {
        const response = res as unknown as ApiResponse<GetTournamentsResponse>;
        this.tournaments.set(response.data.tournaments);
        this.totalPages.set(response.data.pagination.totalPages);
        this.page.set(response.data.pagination.page);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Błąd ładowania turniejów');
        this.loading.set(false);
      },
    });
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.set(value);
    clearTimeout((this as any)._searchTimeout);
    (this as any)._searchTimeout = setTimeout(() => {
      this.page.set(1);
      this.searchDebounced.set(value);
    }, 400);
  }

  goToCreate() {
    this.router.navigate(['/tournaments/create']);
  }

  previousPage() {
    if (this.page() > 1) this.page.set(this.page() - 1);
  }

  nextPage() {
    if (this.page() < this.totalPages()) this.page.set(this.page() + 1);
  }
}
