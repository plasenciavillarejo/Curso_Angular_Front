import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, pipe, throwError } from 'rxjs';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Factura } from '../models/factura';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FacturasService implements OnInit {

  private urlEndpointFacturas: string = 'http://localhost:8090/api/productos/listar/factura';
  private urlEndpointBorrarFacturas: string = 'http://localhost:8090/api/productos/facturas';
  // Cabeceras http
  private httpHeaders = new HttpHeaders({
    'Content-type': 'application/json'
  })

  constructor(private http: HttpClient,
    private router: Router,
    private authService: AuthService) { 

  }

  ngOnInit(): void {
    
  }

  getFactura(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.urlEndpointFacturas}/${id}`);
  }

  borrarFactura(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndpointBorrarFacturas}/${id}`).pipe(
      catchError(errorCapturadoDesdeBE => {
        console.log(errorCapturadoDesdeBE.error.mensaje)
        Swal.fire('Error al borrar una factura', errorCapturadoDesdeBE.error.mensaje, 'error');
        return throwError(
          () => errorCapturadoDesdeBE
        );
      })
    );

  }


}
