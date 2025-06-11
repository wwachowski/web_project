import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const GuestGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if (token) {
    const router = inject(Router);
    router.navigate(['/tournaments']);
    return false;
  } else {
    return true;
  }
};
