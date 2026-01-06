import { inject, Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { ReporteDTO, SolicitudDTO, TipoServicio } from "../models";

@Injectable({
  providedIn: 'root'
})
export class TicketService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api';

    // Obtener todos los tipos de servicio
    getServicios(): Observable<TipoServicio[]> {
        return this.http.get<TipoServicio[]>(`${this.apiUrl}/servicios`);
    }

    // Crear una nueva solicitud de servicio
    crearSolicitud(username: string, servicioId: number): Observable<SolicitudDTO> {
        return this.http.post<SolicitudDTO>(
            `${this.apiUrl}/solicitudes?username=${username}&servicioId=${servicioId}`,
            {}
        );
    }
}