import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ComponentesService } from '../componentes/componentes.service';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public titulo:string = 'Crear Clieten Aplicación Angular';
  
  public cliente:Cliente = new Cliente();

  public regiones: Region[];

  public valorDevuelto:boolean = false;

  constructor(private clienteService: ClienteService,
    private router:Router,
    private activatedRouter: ActivatedRoute){}
  
  
  ngOnInit(): void {
    // Cuando se inicializa el componente debemos de llamarlo.
    this.cargarProducto();

    // Cada vez que se iniciliza el formulario, va a ir a buscar las regiones a nuestra api rest para mostrarlo en el select.
    this.clienteService.getRegiones().subscribe( listadoRegiones => {
      this.regiones = listadoRegiones;
    });

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
        Swal.fire('ClienteActualizado', `Cliente ${cliente.nombre} ha sido actualizado correctamente`, 'success');
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

  // Compara la región si la encuentra retorna true y lo devuelve
  public compararRegion(objeto1:Region, objeto2:Region):boolean {
    this.valorDevuelto = false;
    if(objeto1 === undefined && objeto2 === undefined) {
      return this.valorDevuelto = true;
    }
    
    if(objeto1 == null || objeto2 == null) {
      this.valorDevuelto = false;
    } else if(objeto1.id === objeto2.id) {
      this.valorDevuelto = true;
    }
    return this.valorDevuelto;
  }

}
