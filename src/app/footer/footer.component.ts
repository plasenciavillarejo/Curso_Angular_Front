import { Component } from '@angular/core';


@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['footer.component.css']
})
export class FooterComponent {
    // any es tipo genérico (No está asociado a ninguna clase), por defecto si no definimos el objeto es public
    public autor: any = { nombre: 'José', apellido: 'Plasencia'};

}
