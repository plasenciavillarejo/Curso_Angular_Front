import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Se importa el objeto HttpClient
  constructor(private http: HttpClient) { 

  }

  // Retorna todos los datos que contiene el login. Token, Usuario, etc...
  login(usuario: Usuario):Observable<any> {
    const urlEndpoint = 'http://localhost:8090/api/security/oauth/token';
    // Las credenciales de el front, pero debemos encriptarlas en base64 con btoa()
    const credenciales = btoa('angularapp' + ':' + '12345');
   
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });
    
    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);

    console.log('Parametros generados: ' + params.toString());
    // params.toString() para convertir los parámetros en una cadena de string -> gran_type=password&username=jose&password=12345
    return this.http.post<any>(urlEndpoint, params.toString(), {headers: httpHeaders});
  }

}
