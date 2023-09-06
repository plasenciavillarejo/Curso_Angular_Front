import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentesService {


  tituloBoton:string = 'Crear Cliente';
  tituloBotonDos:string = 'Editar Cliente';
  entradaObjeto:boolean = true;

  constructor() { }

  getButtonText(): string {
    return this.tituloBoton;
  }

  setButtonText(text: string): void {
    this.tituloBoton = text;
  }




}
