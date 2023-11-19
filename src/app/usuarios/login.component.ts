import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
 
  titulo:String = 'Por favor inicie sesión!';
  usuario: Usuario;

  constructor() {
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

  }

}
