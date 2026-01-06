import { Rol } from './rol.model';

export interface UsuarioDTO {
    id: number;
    username: string;   // Se usa el DNI
    nombreCompleto: string;
    rol: Rol;
}