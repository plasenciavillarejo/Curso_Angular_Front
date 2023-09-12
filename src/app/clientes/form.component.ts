import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ComponentesService } from '../componentes/componentes.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public titulo:string = 'Crear Clieten Aplicación Angular';
  public cliente:Cliente = new Cliente();

  constructor(private clienteService: ClienteService,
    private router:Router,
    private activatedRouter: ActivatedRoute){}
  
  
  ngOnInit(): void {
    // Cuando se inicializa el componente debemos de llamarlo.
    this.cargarProducto();
  }

  cargarProducto(): void {
    this.activatedRouter.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe(
          (clienteRecibido) => this.cliente = clienteRecibido
        )
      }
    })
  }

  // Método create() que se va a ejecutar cuando se pulsa aceptar desde el formulario form.component
  public create(): void {
    console.log(this.cliente);
    // Cuando recibimos la respuesta procedemos a redirigir al listado inicial
    this.clienteService.createClient(this.cliente)
    .subscribe(cliente => {
        this.router.navigate(['/clientes'])
        Swal.fire('Nuevo Cliente', `Cliente ${cliente.nombre} creado correctamente`, 'success');      
    })
  }

  // Actualiza un producto
  public update():void {
    this.clienteService.actualizarProducto(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        Swal.fire('ClienteActualizado', `Cliente ${cliente.nombre} ha sido actualizado correctamente`, 'success');
    })
  }



}
