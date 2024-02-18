import { Component } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, flatMap, map, mergeMap, startWith } from 'rxjs';
import { FacturasService } from './services/factura.service';
import { Cliente } from '../clientes/cliente';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent {

  titulo: string = 'Nueva Factura';
  factura:Factura = new Factura();

  // Propiedades para el autocomplete de angular
  autoCompleteControl = new FormControl('');
  productosFiltrados: Observable<Cliente[]>;

  // Inyectamos los componentes necesarios para trabjar con ellos
  constructor(private clienteService: ClienteService,
    private facturaService: FacturasService,
    private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    // Asignamos el cliente a la factura
    this.activatedRoute.paramMap.subscribe(params => {
      // Convertirmos el string a un nubmer con -> + param
      // Recibe el clienteId que hemos indicado dentro del app.module.ts dentro de las rutas definidas
      let clienteId = + params.get('clienteId');

      // Ahora obtenemos el cliente ( En este caso nosotros no trabajos con cliente si no con producto y no está asociado a ningúna factura.)
      this.clienteService.obtenerFacturasPorId(clienteId).subscribe(factura => {
        // this.factura = factura[0];
      });
    })
    
    // Clase para el autocomplete de angular
    this.productosFiltrados = this.autoCompleteControl.valueChanges
      .pipe(
        // Esté código me da error de que no encuentra el nombre dentro de cliente, la solución en la siguiente línea
        //map(value => typeof value === 'string' ? value : value.nombre),
        map((value:any) => typeof value ==='string'? value: value.nombre),        
        // Debemos aplanar este observable para poder pasarlos utlizando el flatMap -> Está deprecated, utilizar en su lugar mergeMap
        mergeMap(value => value ? this.filtradoProducto(value): []),
    );        
  }


  // Clase para el autocomplete de angular
  private filtradoProducto(value: string): Observable<Cliente[]> {
    const filterValue = value.toLowerCase();
    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Cliente): string | undefined {
    return producto ? producto.nombre : undefined;
  }

}
