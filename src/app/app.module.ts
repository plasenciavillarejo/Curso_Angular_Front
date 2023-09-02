import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';



/* En está parte debemos de incluir todos los componentes que vayamos creando para poder hacerla visible en nuestra página principal de otra forma nunca se podrán visualizar */
/* ########################################################################################################################################################################## */
import { AppComponent } from './app.component';
// Importamos la clase Header para poder visualizarla
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component';

// Importación del Route para poder utilizar la navegación entre páginas
import { RouterModule, Routes } from '@angular/router';

// Agregamos httpClient para poder conectar el front con el be
import { HttpClientModule } from '@angular/common/http';

// Agregamos modulo para los formularios
import { FormsModule } from '@angular/forms';


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
  {path: 'crear/clientes', component: FormComponent},
  {path: 'crear/clientes/:id', component: FormComponent}
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
  ],
  imports: [
    // Dispone de las directivos *ng:if, *ng:for, etc....
    BrowserModule,
    // Agregamos el modulo HttpClient
    HttpClientModule,
    // Agregamos el modulo para los formulario para trabajar con ellos
    FormsModule,
    // Debemos registrar el import de RouterModule pasandole las constantes
    RouterModule.forRoot(routes)
  ],
  /* Se registra clase de Servicio con lógica de negocio dentro 'providers', en las versiones actualizadas ya no hace falta registrarlo.
    Versiones antiguar: providers: [ClienteService]
  */
  providers: [], 
  bootstrap: [AppComponent] // Component principal que se va a cargar en nuestra aplicación
})
export class AppModule { }
