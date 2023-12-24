import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
 
  titulo:String = 'Por favor inicie sesión!';

  usuario:Usuario;

  constructor(private authService: AuthService,
    private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    // Validamos si el usuario está autenticado, en caso de que esté se redirige a la página por defecto.
    if(this.authService.isAuthenticated()) {
      Swal.fire('Login', `Hola ${this.authService.usuario.username} ya estás autenticado!`, 'info');
      this.router.navigate(['/clientes']);
    }
  }

  /**
   * Método encargado de validar el login principal de la aplicación, si todo es corercto almacena el usuari y el token dentro de la sesionStorage y da visibilidad a los recurso
   * @returns Se encarga de agregar al usuario dentro de la sessionStorage.
   */
  login() : void {
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null) {
      Swal.fire('Error Login', 'Username o password vacías!', 'error');
      return;
    }

     // Servicio login
    this.authService.login(this.usuario).subscribe(response => {
      
      // Mostramos el primer dato que contiene el token encriptado [1] de los 3 que en total se envía.
      console.log('Parametros recibidos encriptados: ' + response.access_token.split(".")[1]);
      // Función de JavaScript para desencriptar los datos -> atob(), luego utilizamos el método JSON.parse para parsear los datos en un obeto json
      let payload = JSON.parse(atob(response.access_token.split(".")[1]));
      console.log(payload);

      // Guardamos el Token y el Usuario
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);

      // Recuperamos el usuario a traves del public get usuario();
      let usuario = this.authService.usuario;

      // Redirigirmos a la página principal despues de iniciar la sesión con éxito
      this.router.navigate(['/clientes']);
      Swal.fire('Login', `Hola ${usuario.nombre}, has iniciado sesión con éxito.`, 'success');
    }, err => {
      if(err.status == 400) {
        Swal.fire('Error Lgin', `Usuario o clave incorrecta!`, 'error');
      }
    }
    );
  }



}
