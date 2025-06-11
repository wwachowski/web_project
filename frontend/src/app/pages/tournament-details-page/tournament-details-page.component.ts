import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Match, TournamentDetails, TournamentService } from '../../services/tournament.service';
import { ApiResponse } from '../../services/base/base-api.service';
import { TournamentParticipantService } from '../../services/participiant.service';
import { NotificationService } from '../../services/notification.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tournament-details-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tournament-details-page.component.html',
  styleUrls: ['./tournament-details-page.component.scss'],
})
export class TournamentDetailsPageComponent implements OnInit {
  tournament: TournamentDetails | null = null;
  matches: Match[] = [];
  loading = true;
  error = '';
  userId: number | null = null;

  // Pola do edycji zwycięzcy meczu
  editingMatchId: number | null = null;
  selectedWinnerId: number | null = null;
  savingWinner = false;

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
      return;
    }
    this.userId = +(localStorage.getItem('userId') || '0');

    this.tournamentService.getById(id).subscribe({
      next: (res) => {
        const response = res as unknown as ApiResponse<{ tournament: TournamentDetails; matches: Match[] }>;
        this.tournament = response.data.tournament;
        this.matches = response.data.matches;
        this.loading = false;
      },
      error: () => {
        this.error = 'Nie udało się załadować turnieju.';
        this.loading = false;
      },
    });
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

  getRounds(): number[] {
    return [...new Set(this.matches.map((m) => m.round))].sort((a, b) => a - b);
  }

  getMatchesForRound(round: number): Match[] {
    return this.matches.filter((m) => m.round === round);
  }

  canEditMatch(match: Match): boolean {
    return this.userId === match.player1_user_id || this.userId === match.player2_user_id;
  }

  // Obsługa edycji zwycięzcy meczu

  editMatch(match: Match) {
    this.editingMatchId = match.id;
    this.selectedWinnerId = match.winner_id ?? null;
  }

  cancelEdit() {
    this.editingMatchId = null;
    this.selectedWinnerId = null;
  }

  saveWinner(match: Match) {
    if (this.selectedWinnerId === null) {
      this.notification.show('Wybierz zwycięzcę!', 'warning');
      return;
    }

    this.savingWinner = true;
    this.tournamentService.pickWinner(match.id, this.selectedWinnerId).subscribe({
      error: (err) => {
        this.savingWinner = false;
      },
      complete: () => {
        this.reloadTournamentData();
      },
    });
  }

  private reloadTournamentData() {
    if (!this.tournament?.id) return;

    this.tournamentService.getById(this.tournament.id).subscribe({
      next: (res) => {
        const response = res as unknown as ApiResponse<{ tournament: TournamentDetails; matches: Match[] }>;
        this.tournament = response.data.tournament;
        this.matches = response.data.matches;
        this.editingMatchId = null;
        this.selectedWinnerId = null;
        this.savingWinner = false;
      },
      error: () => {
        this.notification.show('Nie udało się odświeżyć danych turnieju', 'error');
        this.savingWinner = false;
      },
    });
  }

  get editingMatch(): Match | undefined {
    return this.matches.find((m) => m.id === this.editingMatchId!);
  }
}
