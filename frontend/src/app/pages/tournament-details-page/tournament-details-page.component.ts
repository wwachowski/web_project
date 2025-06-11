import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TournamentDetails, TournamentService } from '../../services/tournament.service';
import { ApiResponse } from '../../services/base/base-api.service';
import { TournamentParticipantService } from '../../services/participiant.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-tournament-details-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tournament-details-page.component.html',
  styleUrls: ['./tournament-details-page.component.scss'],
})
export class TournamentDetailsPageComponent implements OnInit {
  tournament: TournamentDetails | null = null;
  loading = true;
  error = '';

  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService,
    private router: Router,
    private participantService: TournamentParticipantService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.router.navigate(['/']);
    }
    const userIdStr = localStorage.getItem('userId');
    this.userId = userIdStr ? +userIdStr : null;

    if (id) {
      this.tournamentService.getById(id).subscribe({
        next: (res) => {
          const response = res as unknown as ApiResponse<{ tournament: TournamentDetails }>;
          this.tournament = response.data.tournament;
          this.loading = false;
        },
        error: () => {
          this.error = 'Nie udało się załadować turnieju.';
          this.loading = false;
        },
      });
    }
  }

  isOrganizer(): boolean {
    return this.userId !== null && this.tournament?.organizer_id === this.userId;
  }

  onEdit() {
    this.router.navigate(['/tournaments', this.tournament?.id, 'edit']);
  }

  registerForTournament() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    const license_number = prompt('Podaj numer licencji:');
    const ranking = prompt('Podaj ranking:');

    if (!license_number || !ranking || isNaN(+ranking)) {
      this.notification.show('Nieprawidłowe dane', 'warning');
      return;
    }

    this.participantService.add(this.tournament!.id, license_number, +ranking).subscribe({
      next: () => this.notification.show('Zapisano na turniej', 'message'),
      error: (err) => {
        if (err.status === 409) {
          this.notification.show('Użytkownik, numer licencji lub ranking już istnieje', 'warning');
        } else {
          this.notification.show('Błąd podczas rejestracji', 'error');
        }
      },
    });
  }
}
