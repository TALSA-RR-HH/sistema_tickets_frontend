// Importamos la configuración del archivo maestro
import { environment as common } from './environment';

// Exportamos lo mismo, forzando production: true
export const environment = {
    ...common, 
    production: true 
};