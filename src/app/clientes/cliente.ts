import { Factura } from "../facturas/models/factura";
import { Region } from "./region";

// Esto es una clase que representa a la entidad que existe en el BE
export class Cliente {
    id!: number; // Declaración (id!) con indicación de inicialización posterior
    nombre!: string;
    apellido!: string;
    createAt!: string;
    email!: string;
    precio!: number;
    puerto!: number;
    foto! : string;
    region!: Region;
    facturas: Array<Factura> = [];
}