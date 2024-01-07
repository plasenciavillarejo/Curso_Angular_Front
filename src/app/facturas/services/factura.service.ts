import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Factura } from '../models/factura';

@Injectable({
  providedIn: 'root'
})
export class FacturasService implements OnInit {

  private urlEndpointFacturas: string = 'http://localhost:8090/api/productos/listar/factura';
  
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

  
}
