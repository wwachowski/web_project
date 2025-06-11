import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { TournamentListPageComponent } from './pages/tournament-list-page/tournament-list-page.component';
import { TournamentDetailsPageComponent } from './pages/tournament-details-page/tournament-details-page.component';
import { AuthGuard } from './guards/auth.guard';
import { TournamentFormPageComponent } from './pages/tournament-form-page/tournament-form-page.component';
import { GuestGuard } from './guards/guest.guard';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ActivatePageComponent } from './pages/activate-page/activate-page.component';

export const routes: Routes = [
  { path: 'tournaments', component: TournamentListPageComponent },
  {
    path: 'tournaments/create',
    component: TournamentFormPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tournaments/:id',
    component: TournamentDetailsPageComponent,
  },
  { path: 'login', component: LoginPageComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterPageComponent, canActivate: [GuestGuard] },
  {
    path: 'activate/:token',
    component: ActivatePageComponent,
    canActivate: [GuestGuard],
  },

  {
    path: 'tournaments/:id/edit',
    component: TournamentFormPageComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'tournaments', pathMatch: 'full' },
];
