import { Component } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html'  
})
export class DirectivaComponent {

  // Creamos un arreglo para poder iterar y entender como funciona la directiva *ngFor en la vista
  listaCurso: string[] = ['TypeScript', 'JavaScript','Java SE', 'Python'];

  habilitar: boolean = true;

  // Creamos una funcion para habilitar o deshabilitar el boton
  setHabilitar() : void {
    this.habilitar = this.habilitar = !this.habilitar;
  }

  constructor() {}
}
