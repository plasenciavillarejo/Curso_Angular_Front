import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, pipe, throwError } from 'rxjs';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Factura } from '../models/factura';
import Swal from 'sweetalert2';
import { Cliente } from 'src/app/clientes/cliente';

@Injectable({
  providedIn: 'root'
})
export class FacturasService implements OnInit {

  private urlEndpointFacturas: string = 'http://localhost:8090/api/productos/listar/factura';
  private urlEndpointBorrarFacturas: string = 'http://localhost:8090/api/productos/facturas';
  private urlEndpointFiltrarProductos: string = 'http://localhost:8090/api/productos/factura/filtrar-productos/';
  

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
  // para mi el producto es el cliente para mentener la lógica que tengo creada con los microservicios
  filtrarProductos(nombre:string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.urlEndpointFiltrarProductos}/${nombre}`);
  }

}
