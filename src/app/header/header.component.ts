import { Component, OnInit } from '@angular/core';

import * as $ from 'jquery';
import { Cliente } from '../clientes/cliente';
import { ComponentesService } from '../componentes/componentes.service';
import { AuthService } from '../usuarios/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['header.component.css']
})
export class HeaderComponent implements OnInit {
    
    public cliente:Cliente = new Cliente();
    
    constructor(private componenteService: ComponentesService,
        public authService: AuthService,
        private router: Router) {

    }

    obtenerValorButton():string {
         return this.componenteService.getButtonText();
    }

    ngOnInit(): void {
        this.componenteService.setButtonText(this.componenteService.tituloBoton);
    }

    logout(): void {
        Swal.fire('Logout', `El usuario ${this.authService.usuario.username} ha cerrado sesión correctamente`);
        console.log('Procedemos a redirigir a el lógin');
        this.authService.logout();
        this.router.navigate(['/login']);
    }

}