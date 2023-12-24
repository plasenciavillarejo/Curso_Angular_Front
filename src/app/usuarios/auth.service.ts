import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Empiza por "guíon bajo" ya que va a tener un metodo accesor, un getter para obtener al usuario y el token
  private _usuario: Usuario;
  private _token: string;

  // Se importa el objeto HttpClient
  constructor(private http: HttpClient) { 

  }

  // Método GET para el _usuario y el _token
  public get usuario(): Usuario {
    // Si es != null devolvemos el usuario
    if(this._usuario != null) {
      return this._usuario;
      // Si no existe lo buscamo dentro del sesionStorage con el nombre que le hemos dado
    } else if(this._usuario == null && sessionStorage.getItem('usuario') != null) {
      console.log('Obtenemos el usuario de la sesión');
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    // Si no existe nada se devuelve una nueva instancia de usuario
    return new Usuario();
  }

  /**
   * Método GET encargado de devuelve el token
   */
  public get token(): string {
    // Si es != null devolvemos el oken
    if(this._token != null) {
      return this._token;
      // Si no existe lo buscamo dentro del sesionStorage con el nombre que le hemos dado
    } else if(this._token == null && sessionStorage.getItem('token') != null) {
      console.log('Obtenemos el usuario de la sesión');
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    // Si no existe devolvemos un null;
    return null;
  }


  /**
   * Retorna todos los datos que contiene el login. Token, Usuario, etc...
   * @param usuario 
   * @returns 
   */
  login(usuario: Usuario):Observable<any> {
    const urlEndpoint = 'http://localhost:8090/api/security/oauth/token';
    
    // Las credenciales de el front, pero debemos encriptarlas en base64 con btoa()
    //const credenciales = btoa('frontendapp' + ':' + '12345');
    const credenciales = btoa('frontendapp' + ':' + '12345');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });
    
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);

    console.log('Parametros generados: ' + params.toString());
    // params.toString() para convertir los parámetros en una cadena de string -> gran_type=password&username=jose&password=12345
    return this.http.post<any>(urlEndpoint, params.toString(), {headers: 
      httpHeaders
    });
  }

  /**
   * Méodo encargado de agregar al usuario dentro de la SesionStorage
   * @param accessToken 
   */
  guardarUsuario(accessToken: string):void {
    let payload = this.obtenerDatosToken(accessToken);
    
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;

    console.log("Procedemos a guardar los datos en el sessionStorage en el navegador"),
    // NO se puede guarar un objeto Usuario() ya que espera un String, deberemos de convertirlo a un STRING mediante -> JSON.stringify() que convierte un OBJETO en un STRING
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));

  }
  /**
   * Encargado de agregar el TOKEN dentro de la SessionStorge
   * @param accessToken 
   */
  guardarToken(accessToken: string):void {
    this._token = accessToken;
    console.log('Almacenando el TOKEN en la sesión');
    sessionStorage.setItem('token', accessToken);
  }

  obtenerDatosToken(accesstoken: String):any {
    if(accesstoken != null) {
      return JSON.parse(atob(accesstoken.split(".")[1]));
    }
    return null;
  }


  /**
   * Objeto encargado de validar si el usuario está autenticado, se realiza la comprobración al método que hemos creado get token()
   */
  isAuthenticated():boolean {
    console.log('Procedemos a obtener el token de el usuario');  
    let payload = this.obtenerDatosToken(this.token);

    if(payload != null && payload.user_name && payload.user_name.length > 0) {
      console.log('Usuario autenticado');
      return true;
    }
    return false;

  }
  /**
   * Método encargado de cerrar la sesión del Usuario autenticado
   */
  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
  }


}
