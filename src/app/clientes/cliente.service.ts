import { Injectable } from '@angular/core';
//import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable, catchError, of, pipe, throwError, map } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


// Importamos la clase HttpClient para poder conectar con el BE
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service';

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
  /* URLS cuando se ataca directamente a la aplicacion Productos.    /
    private urlEndPoint: string = "http://localhost:54652/listar";
    private urlCrearEndPoint: string = "http://localhost:54652/crear";
    private urlBuscarIdProductoEndPoint: string = "http://localhost:54652/ver";
    private urlActualizarProductoEndPoint: string = "http://localhost:54652/editar";
    private urlBorrarProductoEndPoint: string = "http://localhost:54652/eliminar";
    private urlListadoPaginadoEndPoint: string = "http://localhost:54652/listar/page/";
    private urlSubirImagenEndPoint: string = "http://localhost:54652/upload";
    private urlListadoRegiones: string = "http://localhost:54652/listar/regiones"; 
    urlverImagenEndPoint: string = "http://localhost:54652/verImagen/";
    urlProductoSinImagen: string = "http://localhost:54652/images/user.svg";
 *
  // Urls cuando se accedes desde el gateway con seguridad
  /**/
  private urlEndPoint: string = "http://localhost:8090/api/productos/listar";
  private urlCrearEndPoint: string = "http://localhost:8090/api/productos/crear";
  private urlBuscarIdProductoEndPoint: string = "http://localhost:8090/api/productos/ver";
  private urlActualizarProductoEndPoint: string = "http://localhost:8090/api/productos/editar";
  private urlBorrarProductoEndPoint: string = "http://localhost:8090/api/productos/eliminar";
  private urlListadoPaginadoEndPoint: string = "http://localhost:8090/api/productos/listar/page/";
  private urlSubirImagenEndPoint: string = "http://localhost:8090/api/productos/upload";
  private urlListadoRegiones: string = "http://localhost:8090/api/productos/listar/regiones";
  urlverImagenEndPoint: string = "http://localhost:8090/api/productos/verImagen/";
  urlProductoSinImagen: string = "http://localhost:8090/api/productos/images/user.svg"; 
  

  // Cabeceras http
  private httpHeaders = new HttpHeaders({
    'Content-type': 'application/json'
  })

  /**
   * Método encargado de obtener la cabecera para enviarla en cada petición
   */
  private agregarCabeceraSeguridad() {
    // Obtenemos el token
    let token = this.authService.token;
    if(token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  constructor(private http: HttpClient,
    private router: Router,
    private authService: AuthService) { }

  /* Obtenemos los clientes completa recibido de el BE. Ahora mismo es un método sincrono, lo mejor sería hacerlo Asincrono utilizando los Observables de RxJs.
    Síncrono: Cliente[] {
    Asíncrono: Observable<Cliente[]>
  */

  // Método encargado de validar si está o no logueado/autorizado
  private isNoAutorizado(error): boolean {
    // 401 - No autorizado 
    // 403 - Recurso prohibido (No tiene permisos para visualizarlo)
    if (error.status == 401) {
      this.router.navigate(['/login']);
      return true;
    }
    // Cuando no tenga el rol adecuado para visualizar el registro lo redirigimos a la pantalla inicial y damos un mensaje personalizado
    if (error.status == 403) {
      Swal.fire('Acceso denegado', 'No contiene permisos para poder visualizar este recurso', 'warning');
      this.router.navigate(['/clientes']);
      return true;
    }

    return false;
  }


  getClientes(): Observable<Cliente[]> {
    // Convertimos nuestro listado clientes en un Observable
    //return of(CLIENTES);

    // Retornamos la petición hacia nuetra BE envuelto en un Observable
    return this.http.get<Cliente[]>(this.urlEndPoint, {headers: this.agregarCabeceraSeguridad()}).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(() => e);
      })
    );
  }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlListadoRegiones, {headers: this.agregarCabeceraSeguridad()}).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(() => e);
      })
    );
  }

  /* Lista Paginada 
      1.- Debemos cambiar el observalbe por 'any' ya que vamos a recibir un json que contiene un atributo content con el producto y más atributos 
        Observable<any>
      2.- 
  */
  getClientesPaginados(page: number): Observable<any> { // Indicar que el Observable devuelve un array de Cliente
    return this.http.get(this.urlListadoPaginadoEndPoint + page).pipe(
      map((response: any) => {
        return response; // Transformar la respuesta al tipo deseado content as Cliente[]
      })
    );
  }
  createClient(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlCrearEndPoint, cliente, {
      headers: this.agregarCabeceraSeguridad()
    }).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(errorCapturadoDesdeBE => {
        this.router.navigate(['/crear/clientes']);
        // Se pasa el errors[0] ya que desde el BE se está pasando un map y el error se encuentra en la posición 0 de el array.
        if (this.isNoAutorizado(errorCapturadoDesdeBE)) {
          return throwError(() => errorCapturadoDesdeBE);
        }

        if (errorCapturadoDesdeBE.status == 400) {
          return throwError(() => errorCapturadoDesdeBE);
        }

        console.log(errorCapturadoDesdeBE.error.errors[0])
        Swal.fire('Error al crear', errorCapturadoDesdeBE.error.errors[0], 'error');
        return throwError(() => errorCapturadoDesdeBE);
      })
    );
  }

  // Busca el producto por su id
  // Para capturar el error se utiliza pipe
  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlBuscarIdProductoEndPoint}/${id}`, {headers: this.agregarCabeceraSeguridad()}).pipe(
      // Obtiene el error que se recibe por argumento a traves de la repuesta de estado de el BE
      catchError(errorCapturadoDesdeBE => {

        if (this.isNoAutorizado(errorCapturadoDesdeBE)) {
          return throwError(() => errorCapturadoDesdeBE);
        }

        this.router.navigate(['/clientes']);
        console.log(errorCapturadoDesdeBE.error.errors)
        Swal.fire('Error al editar', errorCapturadoDesdeBE.error.mensaje, 'error');
        return throwError(() => errorCapturadoDesdeBE);
      })
    );
  }

  // Actualiza el Producto
  actualizarProducto(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlActualizarProductoEndPoint}/${cliente.id}`, cliente, {
      headers: this.agregarCabeceraSeguridad()
    }).pipe(
      catchError(errorCapturadoDesdeBE => {
        
        if (this.isNoAutorizado(errorCapturadoDesdeBE)) {
          return throwError(() => errorCapturadoDesdeBE);
        }

        this.router.navigate(['/crear/clientes']);
        console.log(errorCapturadoDesdeBE.error.mensaje)
        Swal.fire('Error al editar', errorCapturadoDesdeBE.error.mensaje, 'error');
        return throwError(
          () => errorCapturadoDesdeBE
        );
      })
    );
  }

  // Borrar un producto
  borrarProducto(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlBorrarProductoEndPoint}/${id}`, {
      headers: this.agregarCabeceraSeguridad()
    }).pipe(
      catchError(errorCapturadoDesdeBE => {
        if (this.isNoAutorizado(errorCapturadoDesdeBE)) {
          return throwError(() => errorCapturadoDesdeBE);
        }

        this.router.navigate(['/crear/clientes']);
        console.log(errorCapturadoDesdeBE.error.mensaje)
        Swal.fire('Error al editar', errorCapturadoDesdeBE.error.mensaje, 'error');
        return throwError(
          () => errorCapturadoDesdeBE
        );
      })
    );
  }


  // Método para subir imágen
  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    // Tenemos que utilizar la clase nativa FormData de javascritp que ya viene integrada
    let formData = new FormData();
    formData.append("file", archivo);
    formData.append("id", id);

    // Enviamos la cabecera de segurida
    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if(token != null) {
      // Como httpHeaders devuelve una nueva instancia, este como es inmutable, debemos de asignale la instancia
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    const req = new HttpRequest('POST', `${this.urlSubirImagenEndPoint}`, formData, {
      reportProgress: true,
      headers: httpHeaders
    });

    return this.http.request(req).pipe(
      catchError (errorCapturadoDesdeBE => {
        this.isNoAutorizado(errorCapturadoDesdeBE);
        return throwError(() => errorCapturadoDesdeBE);
      })
    );
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