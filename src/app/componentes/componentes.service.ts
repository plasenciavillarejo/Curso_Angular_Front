import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentesService {


  tituloBoton:string = 'Crear Cliente';
  tituloBotonDos:string = 'Editar Cliente';
  entradaObjeto:boolean = true;
  mostrarTituloBoton!:string;
  constructor() { }

  getButtonText(): string {
    //this.habilitar = this.habilitar = !this.habilitar;
    if(this.tituloBoton == 'Crear Cliente') {
      this.mostrarTituloBoton = 'Crear Cliente';
    } else if(this.tituloBoton == 'Editar Cliente') {
      this.mostrarTituloBoton = 'Editar Cliente'
    }
    return this.mostrarTituloBoton;
  }

  setButtonText(text: string): void {
    this.tituloBoton = text;
  }




}
