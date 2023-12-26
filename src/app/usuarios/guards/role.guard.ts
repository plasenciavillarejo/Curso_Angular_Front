import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export const RoleGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Obtenemos un arreglo de roles de el usuario
  let role = route.data['role'] as string;
  console.log('Roles recibidos: ', role);

  if(authService.verificarRol(role)) {
    return true;
  }
  Swal.fire('Acceso denegado', 'No contiene permisos para poder visualizar este recurso', 'warning');
  router.navigate(['/clientes']);
  return false;
};
