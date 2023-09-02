import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes!: Cliente[];

  // Cuando se realiza inyección de dependencias se debe pasar mediante el constructor para poder utilizarlo dentro de el componente
  constructor(private clienteService: ClienteService){

  }

  ngOnInit(): void {
    /* Asignamos nuestra clase inyectada en el constructor para devolver los clientes, al utilzar Observable esté método se cambia
    this.clientes = this.clienteService.getClientes(); -> this.clienteService.getClientes().subs;
    */
    this.clienteService.getClientes().subscribe(
      clientesRecibidosBE => this.clientes = clientesRecibidosBE
    );
  }


// Borra Producto
public delete(cliente: Cliente):void {
  Swal.fire({
    title: 'Estás seguro?',
    text: "Si borrar el producto no se podrá recupera!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Aceptar!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.clienteService.borrarProducto(cliente.id).subscribe(
        response => {
          /* filter() -> Nos permite filtrar solo los elementos que deseamos y devolverlso en un nuevo array 
          Solo vamos a mostrar a los clientes que no se hayan eliminado*/
          this.clientes = this.clientes.filter(clienteRecibido => clienteRecibido != cliente)
          Swal.fire(
            'Borrado!',
            'Se ha borrado correctamente',
            'success'
          )
        }
      )
    }
  })
}

}
