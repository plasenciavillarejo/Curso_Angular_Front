import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
 
  titulo:String = 'Por favor inicie sesión!';

  constructor() {

  }

  ngOnInit(): void {
 
  }

}
