import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginador-nav',
  templateUrl: './paginador.component.html'
})
export class PaginadorComponent implements OnInit, OnChanges {

  @Input() paginador: any;

  paginas: number[];

  // Variables límites de páginas a mostrar
  desde: number;
  hasta: number;

  constructor(){}
 
  
  ngOnInit(): void {

  }

  // Se implementa el OnChanges para se actualice el rango de las páginas. 
  /*
  ngOnChanges(changes: SimpleChanges): void {
   // Calculamos el límite de páginas a mostrar
   this.desde = Math.min(Math.max(1, this.paginador.number - 4),this.paginador.totalPages - 5);
   this.hasta = Math.max(Math.min(this.paginador.totalPages,this.paginador.number + 4),6);
   if(this.paginador.totalPages>5) {
     this.paginas = new Array(this.hasta - this.desde + 1).fill(0).map((valor, indice) => indice + this.desde);
   }else {
     this.paginas = new Array(this.paginador.totalPages).fill(0).map((valor, indice) => indice +1);
     console.log('Total de paginas', this.paginas);
   }
  }
  */
  

  MAX_PAGINAS:number=6
  ngOnChanges(changes: SimpleChanges): void {
    if (this.paginador.totalPages > this.MAX_PAGINAS) {
      this.desde = Math.min( Math.max(0,this.paginador.number-(Math.trunc(this.MAX_PAGINAS/2))),this.paginador.totalPages-this.MAX_PAGINAS);
      this.hasta = Math.max( Math.min(this.paginador.number+(Math.trunc((this.MAX_PAGINAS+1)/2)),(this.paginador.totalPages)),this.MAX_PAGINAS);
      this.paginas = new Array(this.hasta-this.desde).fill(0).map((valor, indice) => indice + 1 + this.desde);
    } else {
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((valor, indice) => indice + 1);
    }
  }



}

