import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { ComponentesService } from '../componentes/componentes.service';
import { ActivatedRoute } from '@angular/router';
import { pipe, tap } from 'rxjs';
import { ModalService } from './detalle/modal.service';
import { Region } from './region';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes!: Cliente[];
  
  // Varible para el paginador
  paginador: any;
  
  clienteSeleccionado: Cliente;

  public regiones: Region[];

  @ViewChild('modalImg') modalImg: ElementRef;
  urlImagenEndPoint:string = this.clienteService.urlverImagenEndPoint;
  urlImagenEstatica:string = this.clienteService.urlProductoSinImagen;


  // Cuando se realiza inyección de dependencias se debe pasar mediante el constructor para poder utilizarlo dentro de el componente
  constructor(private clienteService: ClienteService,
    private componenteServicio: ComponentesService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService){

  }

  ngOnInit(): void {
    /* Asignamos nuestra clase inyectada en el constructor para devolver los clientes, al utilzar Observable esté método se cambia
    this.clientes = this.clienteService.getClientes(); -> this.clienteService.getClientes().subs;
    
    Nota: Entendimiento de Página Inicial con listado:
      - 1.- Por defecto le hemos indicado que nos cargue la primera página el modulo de clientes.components.ts. Nosotros en la carga inicial 'ngOnInit()' le hemos indicado que nos haga 
      una consulta al BE utilizando inicialmente el -> 1.- Lista Completa. 
      - 2.- Ahora hemos integrado la paginación desde el BE por tanto la indicamos. Inicialmente cargara nuestra lista paginada.
      - 3.- Se comenta el listado inicial
    
    */

    /* 1.- Lista Completa
    this.clienteService.getClientes().subscribe(
      clientesRecibidosBE => this.clientes = clientesRecibidosBE
       );
    */
    
    /* 1.- Lista Paginada - Debemos agregar el page desde el app.module.ts -> :page
       Agregamos el ActivatedRoute que se encarga de Observa el cambio de el parámetro para realizar la paginación, cuando cambia el parámetro debe cambiar en el paginador para poder navegar
    */    
    this.activatedRoute.paramMap.subscribe( params => {
      // Debemos convertir el String a Number para indicar la página, con el operador + lo convierte directamente a un int
      // Con el param.get('') -> Podemos obtener el page que se está enviado desde la url
      let page:number = +params.get('page');
      // Lá primera página es siempre 0
      if(!page){
        page = 0;
      }
     this.clienteService.getClientesPaginados(page)
     .pipe(
        tap(response => {
          console.log('ClientesComponent: tap 3');
          (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
        })).subscribe(response => {
            this.clientes = response.content as Cliente[];
            this.paginador = response;
          });
      });
        

    // Nos subcribimos el emiter para saber cuanado se inserta / borra / actualiza una imágen en el listado.
    this.modalService.notificarUpload.subscribe(clienteActualizado => {
      // recorremos cada cliente y preguntamos si el cliente.id actualizado es el mismo cliente.id que ya existe, si es igual actualizamos el cliente
      this.clientes = this.clientes.map(clienteOriginal =>{
        if(clienteActualizado.id == clienteOriginal.id) {
          clienteOriginal.foto = clienteActualizado.foto;
        }
        return clienteOriginal;
      }) 
    })

        
    $(document).on('click', '#botonJqueryPrueba', function() {
      Swal.fire('Boton Pulsado mediante función Jquery', 'Congratulation!! Integracíon perfecta con Angular', 'success');
    });

    /*
    $(document).on('click', '#validarBoton', function() {        
      let nombreBoton = $('#validarBoton').text();
      if(nombreBoton == 'Editar Cliente') {
        $('.clientCrear').text('Editar Cliente');
      }
    });
    */
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

  onEditClick(): void {
    this.componenteServicio.setButtonText('Editar Cliente');
  }

  abrirModal(cliente:Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }



}
