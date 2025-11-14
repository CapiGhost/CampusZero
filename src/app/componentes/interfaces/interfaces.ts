export interface Personaje {
    id: string; 
    arma: string;
    avatar: string; 
    edad: number;
    descripcion: string;
    nombre: string;
    raza: string;
}

export interface RespuestaDetalle {
    data: Personaje;
}