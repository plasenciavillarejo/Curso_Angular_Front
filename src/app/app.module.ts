import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';


/* En está parte debemos de incluir todos los componentes que vayamos creando para poder hacerla visible en nuestra página principal de otra forma nunca se podrán visualizar */
/* ########################################################################################################################################################################## */
import { AppComponent } from './app.component';
// Importamos la clase Header para poder visualizarla
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component';
import { PaginadorComponent } from './paginador/paginador.component';

// Importación del Route para poder utilizar la navegación entre páginas
import { RouterModule, Routes } from '@angular/router';

// Agregamos httpClient para poder conectar el front con el be
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// Agregamos modulo para los formularios
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturasComponent } from './facturas/facturas.component';

// import para trabajar con el autocomplete de angular material
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {MatFormFieldModule} from '@angular/material/form-field'; 

/* ########################################################################################################################################################################## */
/* ########################################################################################################################################################################## */


// Creamos constantes de rutas para la navegación entre las páginas.
  /* Entendimiento de como funciona
    path -> Puede ser el nombre que queramos nosotros para poder acceder a esa html que contiene la vista.
    component -> Se le indica el componente que estará asignado a ese path.
    redirectTo: Redirige a cualquier ruta que le indiquemos
    patMatch: full, indica que se le va hacer el match completo con la URL
  */
const routes: Routes = [
  // Página principal cuando se abre inicialmente nuestro proyecto
  {path: '', redirectTo: '/clientes', pathMatch: 'full'},
  {path: 'directivas', component: DirectivaComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'clientes/page/:page', component: ClientesComponent},
  // Agregamos nuestro wuard en la que recibe una arrays de wuards, se le incluye la data para indicar los roles que tiene los permios para visualizar dicho registro
  {path: 'crear/clientes', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_ADMIN'} },
  {path: 'editar/clientes/:id', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_ADMIN'} },
  {path: 'login', component: LoginComponent},
  {path: 'facturas/:id', component: DetalleFacturaComponent},
  {path: 'facturas/form/:clienteId', component: FacturasComponent}

];

@NgModule({
  declarations: [
    AppComponent,
    // Debemo de indicar el componente
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginadorComponent,
    DetalleComponent,
    DetalleComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent
  ],
  imports: [
    // Dispone de las directivos *ng:if, *ng:for, etc....
    BrowserModule,
    // Agregamos el modulo HttpClient
    HttpClientModule,
    // Agregamos el modulo para los formulario para trabajar con ellos
    FormsModule,
    // Debemos registrar el import de RouterModule pasandole las constantes
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    // Se importa librerías necesarias para trabajar con el datapicker de angular material
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule
  ],
  /**
   *  Se registra clase de Servicio con lógica de negocio dentro 'providers', en las versiones actualizadas ya no hace falta registrarlo.
    Versiones antiguar: providers: [ClienteService]
    
    **Importantes:** 
    Para el caso de HttpInterceptors debemos de agregar el objeto para poder inteceptar todas las peticiones y enviar el token de seguridad
  */
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ], 
  bootstrap: [AppComponent] // Component principal que se va a cargar en nuestra aplicación
})
export class AppModule { }
