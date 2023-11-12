import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
 
  titulo:String = 'Por favor inicie sesión!';
  usuario:Usuario;

  constructor() {
    // Inicializamos el usuario
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
 
  }

  login():void {
    console.log("El usuario que accede es: " + this.usuario.username + " " + this.usuario.password);
    if(this.usuario.username == null || this.usuario.password == null) {
      Swal.fire('Error login', 'Username o Password vacías!', 'error');
      return;
    }
  }


}
