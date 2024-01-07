import { ItemFactura } from "./item-factura";

export class Factura {
    id: number;
    descripcion: string;
    observacion: string;
    items: Array<ItemFactura> = [];
    total: number;
    createAt: string;
}
