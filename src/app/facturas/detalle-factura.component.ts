import { Component, OnInit } from '@angular/core';
import { FacturasService } from './services/factura.service';
import { Factura } from './models/factura';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html'
})
export class DetalleFacturaComponent implements OnInit {

  factura: Factura;
  titulo: string = 'Factura';

  ngOnInit(): void {
    
    // Nos vamos a subscribir para obtener el id
    this.activateRoute.paramMap.subscribe(params => {
      // Con el signo '+' -> Se convierte en unb number
      let id = +params.get('id');
      this.facturaServie.getFactura(id).subscribe( factura =>  {
        console.log("Factura Recibida: ", factura);
        this.factura = factura
      });
    });

  }

  // ActivatedRoute -> permite interactuar con la información de la ruta actual y obtener cualquier parámetro desde la URL
  constructor(private facturaServie: FacturasService,
    private activateRoute: ActivatedRoute) {

  }

}
