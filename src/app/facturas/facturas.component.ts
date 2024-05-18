import { Component } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, flatMap, map, mergeMap, startWith } from 'rxjs';
import { FacturasService } from './services/factura.service';
import { Cliente } from '../clientes/cliente';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';
import Swal from 'sweetalert2';

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
    private activatedRoute: ActivatedRoute,
    private router: Router) {

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

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    // Convertirmos el objeto Cliente (que para mi es un producto) en un objeto con el as
    let producto = event.option.value as Cliente;
    console.log('Producto seleccionado: ' + producto);

    // Antes de crear un nuevo item se valid que exista ya o no para no duplicar la línea
    if(this.existeItem(producto.id)){
      this.incrementarCantidad(producto.id);
    } else {
    let nuevoItem = new ItemFactura();
    nuevoItem.producto = producto;
    // Añadiamos el item dentro de factura
    this.factura.items.push(nuevoItem);
    }
    // Para poder volver buscar otro producto y añadir otra línea a la factura tenemos que limpiar el autocomplete
    this.autoCompleteControl.setValue('');
    // Quitarmos el focus y lo resetamos
    event.option.focus();
    // Deseleccionamos el producto que teníamos.
    event.option.deselect();
  }

  actualizarCantidad(id:number, event: any):void {
    // Obtenemos la cantidad de elementos
    let cantidad: number = event.target.value as number;

    // Si la cantidad del item == 0, entonces debemos de elminarlo par no mantener ningún registro.
    if(cantidad == 0) {
      return this.eliminarItemFactura(id);
    }

    // Utilizamos el map para cambiar los valores 
    this.factura.items = this.factura.items.map((item:ItemFactura) => {
      // Verificamos si existe algún id que ya esté dentro de la tabla que contenga el mismo id que estamos agregando, si existe lo actualiza y lo devuelve.
      if(id === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  // Validamos si el id que agregamos existe
  existeItem(id:number):boolean {
    let existe = false;
    this.factura.items.forEach((item:ItemFactura) => {
      if(id === item.producto.id){
        existe = true;
      }
    });
    return existe;
  }

  incrementarCantidad(id:number):void {
    this.factura.items = this.factura.items.map((item:ItemFactura) => {
      // Verificamos si existe algún id que ya esté dentro de la tabla que contenga el mismo id que estamos agregando, si existe lo actualiza y lo devuelve.
      if(id === item.producto.id){
        ++ item.cantidad;
      }
      return item;
    });
  }

  // Eliminar una línea de item
  eliminarItemFactura(id:number):void {
    /*
    Lógica de inclusón o exclusión de la línea de items, 
      1.- Si la condición id !== item.producto.id es true, el item se incluirá en el nuevo array resultante.
      2.- Si la condición id !== item.producto.id es false, el item será filtrado y no se incluirá en el nuevo array resultante.
      Si id e item.producto.id son iguales para algún item, la condición id !== item.producto.id será false, y ese item no será incluido en el nuevo array this.factura.items.
      Por lo tanto, ese item será "eliminado" de this.factura.items.
    */
    this.factura.items = this.factura.items.filter((item:ItemFactura) => {
      console.log("Id Recibido: " + id + " Id del producto: " + item.producto.id);
      return id !== item.producto.id;
    });
    console.log('Nuevo array contiene: ' + this.factura.items.length + ' elementos');
  }

  crearFactura():void {
    this.facturaService.crearFactura(this.factura).subscribe(factura => {
      Swal.fire(this.titulo, `Facutura ${factura.descripcion} creada con éxito!`,`success`);
      this.router.navigate(['/clientes']);
    });
  }

}
