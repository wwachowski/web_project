import { Injectable } from '@angular/core';
import { ApiResponse, BaseApiService } from './base/base-api.service';

@Injectable({ providedIn: 'root' })
export class TournamentService extends BaseApiService {
  constructor() {
    super('/tournaments');
  }

  getAll(page: number, search: string = '') {
    const params = new URLSearchParams({ page: page.toString(), search });
    return this.get<ApiResponse<GetTournamentsResponse>>(`?${params.toString()}`);
  }

  getById(id: number) {
    return this.get<ApiResponse<{ tournament: TournamentDetails }>>(`/${id}`);
  }

  createOrUpdate(body: { id?: number; name: string; discipline: string; start_time: string; location: string; max_participants: number; application_deadline: string; sponsor_logos: string[] }) {
    return this.post<ApiResponse<{ tournament: TournamentDetails }>>('', body);
  }
}

export interface Tournament {
  id: number;
  name: string;
  discipline: string;
  start_time: string;
  application_deadline: string;
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GetTournamentsResponse {
  tournaments: Tournament[];
  pagination: Pagination;
}

// * DETALE

export interface TournamentDetails {
  id: number;
  name: string;
  discipline: string;
  organizer_id: number;
  start_time: string;
  location: string;
  max_participants: number;
  application_deadline: string;
  created_at: string;
  users: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  sponsor_logos: any[];
  tournament_participants: any[];
}
