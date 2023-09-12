import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginador-nav',
  templateUrl: './paginador.component.html'
})
export class PaginadorComponent implements OnInit, OnChanges {

  @Input() paginador: any;

  paginas: number[];

  // Variables límites de páginas a mostrar
  MAX_PAGINAS:number=6
  desde: number;
  hasta: number;

  constructor(){}
 
  
  ngOnInit(): void {
    // Inicialmente calculamos el primer rango para la primera página posteriormente se encarga de calcularlo ngOnChanges
    this.intPaginator();
  }

  /* Se implementa el OnChanges para se actualice el rango de las páginas. 
    SimpleChanges -> No permite obtener los cambios dentro objeto paginador que nos inyecta el componente padre
  */
  ngOnChanges(changes: SimpleChanges): void {
   let paginadorActulizado = changes['paginador'];
  // Si contiene un estado anterior, que haya cambiado inicialmente, entonces llamamos al intPaginador();
   if(paginadorActulizado.previousValue) {
    this.paginador();
   }
  }


  private intPaginator():void {
    if (this.paginador.totalPages > this.MAX_PAGINAS) {
      this.desde = Math.min( Math.max(0,this.paginador.number-(Math.trunc(this.MAX_PAGINAS/2))),this.paginador.totalPages-this.MAX_PAGINAS);
      this.hasta = Math.max( Math.min(this.paginador.number+(Math.trunc((this.MAX_PAGINAS+1)/2)),(this.paginador.totalPages)),this.MAX_PAGINAS);
      this.paginas = new Array(this.hasta-this.desde).fill(0).map((valor, indice) => indice + 1 + this.desde);
    } else {
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((valor, indice) => indice + 1);
    }
  }
}

