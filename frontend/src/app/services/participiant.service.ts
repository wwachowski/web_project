import { Injectable } from '@angular/core';
import { ApiResponse, BaseApiService } from './base/base-api.service';

@Injectable({ providedIn: 'root' })
export class TournamentParticipantService extends BaseApiService {
  constructor() {
    super('/participants');
  }

  add(tournamentId: number, license_number: string, ranking: number) {
    return this.post<ApiResponse<any>>(`/${tournamentId}`, { license_number, ranking });
  }
}
