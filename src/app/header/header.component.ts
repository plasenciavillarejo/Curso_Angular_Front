import { Component, OnInit } from '@angular/core';

import * as $ from 'jquery';
import { Cliente } from '../clientes/cliente';
import { ComponentesService } from '../componentes/componentes.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['header.component.css']
})
export class HeaderComponent implements OnInit {
    
    public cliente:Cliente = new Cliente();
    
    constructor(private componenteService: ComponentesService) {

    }

    obtenerValorButton():string {
         return this.componenteService.getButtonText();
    }

    ngOnInit(): void {
        this.componenteService.setButtonText(this.componenteService.tituloBoton);
    }

}