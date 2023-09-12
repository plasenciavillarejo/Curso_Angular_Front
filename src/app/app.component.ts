import { Component } from '@angular/core';



/* Nombre de inyección del componente app-root */
@Component({
  selector: 'app-root', 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'Bienvenido plasencia a tu página principal de angular';

  // Para hacerlo más robusto le indicamos el tipo de dato que es.
  curso: string = 'Curso de Spring Boot con Angular';
}
