import { Injectable } from '@angular/core';
//import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable, catchError, of, pipe, throwError, map} from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


// Importamos la clase HttpClient para poder conectar con el BE
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';

/* Representa la lógica de negocio para recoger los datos de el BE y tratalos en la parte FRONT.
  En versiones actualizadas la inyección de los servicios dentro de app.module.ts ya no hace falta ya que se hace automatico mediante 
    providedIn: 'root'.
  Versiones antiguar hay que registrar el servicio dentro de el fichero app.module.ts
  
    import { ClienteService } from './clientes/cliente.service';  
    providers = [ClienteService];
*/
@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // Nota: el puerto es dinámico por lo que cada vez que levante el BE contiene un puerto diferente
  private urlEndPoint: string = "http://localhost:62815/listar";
  private urlCrearEndPoint: string = "http://localhost:62815/crear";
  private urlBuscarIdProductoEndPoint: string = "http://localhost:62815/ver";
  private urlActualizarProductoEndPoint: string = "http://localhost:62815/editar";
  private urlBorrarProductoEndPoint: string = "http://localhost:62815/eliminar";
  private urlListadoPaginadoEndPoint: string = "http://localhost:62815/listar/page/";
  private urlSubirImagenEndPoint: string = "http://localhost:62815/upload";
  
  urlverImagenEndPoint: string = "http://localhost:62815/verImagen/";
  urlProductoSinImagen: string = "http://localhost:62815/images/user.svg";

  // Cabeceras http
  private httpHeaders = new HttpHeaders({
    'Content-type': 'application/json'
  })

  constructor(private http: HttpClient,
    private router: Router) { }
  
  /* Obtenemos los clientes completa recibido de el BE. Ahora mismo es un método sincrono, lo mejor sería hacerlo Asincrono utilizando los Observables de RxJs.
    Síncrono: Cliente[] {
    Asíncrono: Observable<Cliente[]>
  */
  getClientes(): Observable<Cliente[]> {
    // Convertimos nuestro listado clientes en un Observable
    //return of(CLIENTES);
    
    // Retornamos la petición hacia nuetra BE envuelto en un Observable
    return this.http.get<Cliente[]>(this.urlEndPoint);
  }

  /* Lista Paginada 
      1.- Debemos cambiar el observalbe por 'any' ya que vamos a recibir un json que contiene un atributo content con el producto y más atributos 
        Observable<any>
      2.- 
  */
  getClientesPaginados(page:number): Observable<any> { // Indicar que el Observable devuelve un array de Cliente
    return this.http.get(this.urlListadoPaginadoEndPoint + page).pipe(
      map((response: any) => {
        return response; // Transformar la respuesta al tipo deseado content as Cliente[]
      })
    );
  }     
  createClient(cliente:Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.urlCrearEndPoint, cliente, {
      headers: this.httpHeaders
    }).pipe(
      catchError (errorCapturadoDesdeBE => {
        this.router.navigate(['/crear/clientes']);
        // Se pasa el errors[0] ya que desde el BE se está pasando un map y el error se encuentra en la posición 0 de el array.
        console.log(errorCapturadoDesdeBE.error.errors[0])
          Swal.fire('Error al crear', errorCapturadoDesdeBE.error.errors[0], 'error' );
          return throwError(
            () => errorCapturadoDesdeBE
            );
        })
    );
  }

  // Busca el producto por su id
  // Para capturar el error se utiliza pipe
  getCliente(id:number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlBuscarIdProductoEndPoint}/${id}`).pipe(
      // Obtiene el error que se recibe por argumento a traves de la repuesta de estado de el BE
      catchError (errorCapturadoDesdeBE => {
        this.router.navigate(['/clientes']);
        console.log(errorCapturadoDesdeBE.error.errors)
          Swal.fire('Error al editar', errorCapturadoDesdeBE.error.mensaje, 'error' );
          return throwError(
            () => errorCapturadoDesdeBE
            );
        })
    );
  }

  // Actualiza el Producto
  actualizarProducto(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlActualizarProductoEndPoint}/${cliente.id}`, cliente,{
      headers: this.httpHeaders
    }).pipe(
      catchError (errorCapturadoDesdeBE => {
        this.router.navigate(['/crear/clientes']);
        console.log(errorCapturadoDesdeBE.error.mensaje)
          Swal.fire('Error al editar', errorCapturadoDesdeBE.error.mensaje, 'error' );
          return throwError(
            () => errorCapturadoDesdeBE
            );
        })
    );
  }

  // Borrar un producto
  borrarProducto(id:number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlBorrarProductoEndPoint}/${id}`,{
      headers: this.httpHeaders
    });
  }


  // Método para subir imágen
  subirFoto(archivo:File,id): Observable<HttpEvent<{}>> {
    // Tenemos que utilizar la clase nativa FormData de javascritp que ya viene integrada
    let formData = new FormData();
    formData.append("file", archivo);
    formData.append("id",id);

    const req = new HttpRequest('POST',`${this.urlSubirImagenEndPoint}`,formData, {
      reportProgress: true
    });

    return this.http.request(req);
    /*
.pipe(
      map((response: any) => 
        response.cliente as Cliente
      ),
      catchError (errorCapturadoDesdeBE => {
        this.router.navigate(['/clientes']);
        console.log(errorCapturadoDesdeBE.error.errors)
          Swal.fire('Error subir la imágen', errorCapturadoDesdeBE.error.mensaje, 'error' );
          return throwError(() => errorCapturadoDesdeBE);
        })
    );
  }

    */
  }

}


