import { Cliente } from "src/app/clientes/cliente";
import { Factura } from "./factura";

export class ItemFactura {
    // COmo no he creado la realciond e Cliente, en mi lógica cliente es producto
    cantidad: number = 1;
    producto: Cliente;
    importe: number;
}
