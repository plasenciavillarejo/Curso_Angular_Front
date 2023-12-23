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
 
  }

  login() : void {
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null) {
      Swal.fire('Error Login', 'Username o password vacías!', 'error');
      return;
    }

     // Servicio login
    this.authService.login(this.usuario).subscribe(response => {
      console.log('Parametros recibidos: ' + response);
      // Redirigirmos a la página principal despues de iniciar la sesión con éxito
      this.router.navigate(['/clientes']);
      Swal.fire('Login', `Hola ${response.username}, has iniciado sesión con éxito.`, 'success');
    });
  }



}
