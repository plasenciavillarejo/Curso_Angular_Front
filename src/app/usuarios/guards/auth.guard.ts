import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';

/**
 * Este interceptor se deberá de indicar en todas las rutas donde queremos que esté escuchando cualquier petición -> app.module.ts
 */

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router = inject(Router);
  if(authService.isAuthenticated()) {
    // Validamos la fecha de la expiracion
    if(authService.isTokenExpirado()) {
      authService.logout();
      router.navigate(['/login']);
    }
    return true;
  }
  router.navigate(['/login']);
  return false;





};





