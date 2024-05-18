import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Cliente } from '../cliente'
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { Factura } from 'src/app/facturas/models/factura';
import { ClientesComponent } from '../clientes.component';
import { FacturasService } from 'src/app/facturas/services/factura.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['detalle.component.css']
})
export class DetalleComponent implements OnInit{
  
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('modalImg') modalImg: ElementRef;
  
  // Es necesario indicar el @Input() si queremos inyectar desde clientes.component.html el objeto cliente hacia detalles.componentes.ts
  @Input() cliente: Cliente;
  public titulo:string = 'Detalle Producto';

  imagenSeleccionada: File;

  urlImagenEndPoint:string = this.clienteService.urlverImagenEndPoint;
  progreso:number = 0;
  
  // Objeto para poblar la tabla dentro de detalle.component.html
  facturas: Factura[];

  constructor(private clienteService: ClienteService,
    private router:Router,
    public modalService: ModalService,
    private facturaService: FacturasService) {

  }

  ngOnInit(): void {
    
    // Se carga las facturas asociadas a un producto    
   this.clienteService.idClienteSeleccionado$.subscribe((idCliente) => {
      if (idCliente !== null) {
        this.listarFacturaAsociadaCliente(idCliente);
      }
    });
   /*     
    if(this.clienteService.idClienteSeleccionadoSource != null) {
      this.listarFacturaAsociadaCliente(this.clienteService.idClienteSeleccionadoSource);
    }
    */ 
  }

  seleccionarFoto(event){
    this.imagenSeleccionada = event.target.files[0];
    // Cada vez que subimos una imágen el progeso siempre es 0
    this.progreso = 0;
    console.log("Foto seleccionada: " + this.imagenSeleccionada);
    if(this.imagenSeleccionada.type.indexOf('image') < 0) {
      Swal.fire('Error al seleccionar la imagen','El documento adjuntando no es compatible','error');
      this.imagenSeleccionada = null;
      // Si contiene un error debemos de resetear el input
      this.fileInput.nativeElement.value = '';
    }
  }

  // Llama a nuestra clase de servicio para subir la foto
  subirFoto(){
    // Se valida la foto antes de subir nada
    if(!this.imagenSeleccionada) {
      Swal.fire('Error Upload','Error: debe seleccionar una foto','error');
    } else {
      this.clienteService.subirFoto(this.imagenSeleccionada, this.cliente.id).subscribe(event => {
        //clienteConImagen = this.cliente;
        if(event.type === HttpEventType.UploadProgress) {
          this.progreso = Math.round((event.loaded/event.total)*100);
        } else if(event.type === HttpEventType.Response) {
          let response:any = event.body;
          this.cliente=response.producto as Cliente;
          // Llamamos a nuestro servicio para que se actualice de forma asíncrona en el listado
          this.modalService.notificarUpload.emit(this.cliente);
          this.router.navigate(['/clientes']),
        Swal.fire('La foto se ha subido correctamente', response.mensaje , 'success');
        }
      });
    }
  }

    cerrarModal(){
      this.modalService.cerrarModal();
      this.imagenSeleccionada = null;
      this.progreso = 0;
      //this.modalImg.nativeElement.hidden = true;
    }

    /**
     * Función encargada de recibir el id del cliente/producto y obtener el listdo de Facturas 
     * @param id 
     */
    listarFacturaAsociadaCliente(id: number) {
      this.clienteService.obtenerFacturasPorId(id).subscribe({
        next: (facturasRecibidas) => {
          console.log("Recibiendo la factura con el", facturasRecibidas);
          this.facturas = facturasRecibidas;
        },
        error: (error) => {
          console.error('Error al obtener las facturas:', error);
        },
        complete: () => {
          // Código que se ejecuta cuando la operación está completa
        },
      });
    }

    // Borrar Factura
    public delete(factura:Factura):void {
      Swal.fire({
        title: 'Estás seguro?',
        text: `¿Seguro que desea eliminar la factura ${factura}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar!'
      }).then((result) => {
        if (result.value) {
          this.facturaService.borrarFactura(factura.id).subscribe(
            () => {
              /* filter() -> Vamos a quitar la factura que estamos eliminado del cliente*/
              this.cliente.facturas = this.cliente.facturas.filter(facturaRecibida => facturaRecibida != factura)
              Swal.fire(
                `Facutura eliminada!`,
                `Factura ${factura.descripcion} eliminada con éxito`,
                `success`
              )
            }
          )
        }
      })
    }
    

}
