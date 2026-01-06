export interface SolicitudDTO {
    id: number;
    usuarioNombre: string;
    username: string;  // DNI del usuario que creó la solicitud
    nombreServicio: string;
    fechaHora: string;  // LocalDateTime llega como String ISO desde Java
}