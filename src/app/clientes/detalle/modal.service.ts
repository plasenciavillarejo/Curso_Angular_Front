import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal:boolean = false;

  // Atributo para notificar cuando se suba/actualiza una imagen para hacerlo de forma directa en la vista.
  // Para diferencias del objeto al get se le debe indicar una '_' y de está forma no tendremos problemas.
  private _notificarUpload = new EventEmitter<any>();

  constructor() { }

  get notificarUpload(): EventEmitter<any> {
    return this._notificarUpload;
  }


  abrirModal() {
    this.modal = true;
  }

  cerrarModal() {
    this.modal = false;
  }

}
