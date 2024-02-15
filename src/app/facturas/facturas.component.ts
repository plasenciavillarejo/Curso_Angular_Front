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

  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

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

      // Ahora obtenemos el cliente
      this.clienteService.getCliente(clienteId).subscribe(cliente => {
        
      });
    })
   
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
  
      return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }

  }

}
