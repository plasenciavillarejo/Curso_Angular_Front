import { Component } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent {

  titulo: string = 'Nueva Factura';
  factura:Factura = new Factura();

  // Propiedades para el autocomplete de angular
  autoCompleteControl = new FormControl('');
  productos: string[] = ['One', 'Two', 'Three'];
  productosFiltrados: Observable<string[]>;

  // Inyectamos los componentes necesarios para trabjar con ellos
  constructor(private clienteService: ClienteService,
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
        startWith(''),
        map(value => this.filtradoProducto(value || '')),
    );    
  }

  // Clase para el autocomplete de angular
  private filtradoProducto(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.productos.filter(option => option.toLowerCase().includes(filterValue));
  }

}
