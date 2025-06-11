import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TournamentService, TournamentDetails } from '../../services/tournament.service';
import { ApiResponse } from '../../services/base/base-api.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  standalone: true,
  selector: 'app-tournament-form-page',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './tournament-form-page.component.html',
  styleUrls: ['./tournament-form-page.component.scss'],
})
export class TournamentFormPageComponent implements OnInit {
  form;

  editingId?: number;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private tournamentService: TournamentService, private route: ActivatedRoute, private router: Router, private notification: NotificationService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      discipline: ['', Validators.required],
      location: ['', Validators.required],
      max_participants: [0, [Validators.required, Validators.min(1)]],
      start_time: ['', Validators.required],
      application_deadline: ['', Validators.required],
      sponsor_logos: [''],
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.editingId = id;
      this.loading = true;
      this.tournamentService.getById(id).subscribe({
        next: (res) => {
          this.loading = false;
          const response = res as unknown as ApiResponse<{ tournament: TournamentDetails }>;
          const userId = localStorage.getItem('userId');
          if (!userId || response.data.tournament.organizer_id !== +userId) {
            this.notification.show('Brak dostępu', 'warning');
          }
          const tournament = response.data.tournament;

          this.form.patchValue({
            name: tournament.name,
            discipline: tournament.discipline,
            location: tournament.location,
            max_participants: tournament.max_participants,
            start_time: this.toDatetimeLocal(tournament.start_time),
            application_deadline: this.toDatetimeLocal(tournament.application_deadline),
            sponsor_logos: (tournament.sponsor_logos || []).map((s) => s.url).join('\n'),
          });
        },
        error: () => {
          this.error = 'Nie udało się załadować turnieju.';
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.notification.show('Niepoprawne dane formularza', 'warning');
      return;
    }

    this.loading = true;
    const body = {
      ...this.form.value,
      sponsor_logos: this.form.value.sponsor_logos || [],
      id: this.editingId,
    };

    const sponsorLogosRaw = this.form.value.sponsor_logos || '';
    const sponsorLogos = sponsorLogosRaw
      .split('\n')
      .map((url: string) => url.trim())
      .filter((url: string) => url !== '');

    this.tournamentService
      .createOrUpdate({
        id: this.editingId,
        name: this.form.value.name!,
        discipline: this.form.value.discipline!,
        start_time: this.form.value.start_time!,
        location: this.form.value.location!,
        max_participants: this.form.value.max_participants!,
        application_deadline: this.form.value.application_deadline!,
        sponsor_logos: (sponsorLogos as string[]) || [],
      })
      .subscribe({
        next: (res) => {
          const response = res as unknown as ApiResponse<{ tournament: TournamentDetails }>;
          this.router.navigate(['/tournaments', this.editingId ?? response.data.tournament.id]);
        },
        error: () => {
          this.error = 'Nie udało się zapisać turnieju.';
          this.loading = false;
        },
      });
  }

  private toDatetimeLocal(date: string): string {
    const dt = new Date(date);
    dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset()); // uwzględnij strefę czasową
    return dt.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
  }
}
