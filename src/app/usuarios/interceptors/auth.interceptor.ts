import { Injectable } from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

/**
 * Interceptor encargado de validar el http 401 y 403
 * providiers: [ { Se agrega aquí el interceptor que se ha creado}]
 */

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
    private router: Router) {
  
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError( error => {
        // 401 - No autorizado 
        // 403 - Recurso prohibido (No tiene permisos para visualizarlo)
        if (error.status == 401) {   
          // Si el token Expira debemos de enviarlo a la página principal, para ello preguntamos si está o no autenticado
          if(this.authService.isAuthenticated()) {
            this.authService.logout();
          }
          this.router.navigate(['/login']);
        }
          // Cuando no tenga el rol adecuado para visualizar el registro lo redirigimos a la pantalla inicial y damos un mensaje personalizado
        if (error.status == 403) {
          Swal.fire('Acceso denegado', 'No contiene permisos para poder visualizar este recurso', 'warning');
          this.router.navigate(['/clientes']);
        }
        return throwError(() => error);
      })
    );
  }



}
