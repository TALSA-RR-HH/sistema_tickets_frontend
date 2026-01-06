import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ChangeDetectorRef } from "@angular/core";

import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { TipoServicio } from '../../models';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    private ticketService = inject(TicketService);
    private authService = inject(AuthService)
    private router = inject(Router);
    private cd = inject(ChangeDetectorRef);

    servicios: TipoServicio[] = [];
    currentUser = this.authService.currentUser();
    isLoading = false;

    ngOnInit(): void {
        this.cargarBotones();
    }

    cargarBotones() {
        this.ticketService.getServicios().subscribe({
            next: (data) => {
                this.servicios = data.sort((a, b) => a.id - b.id);
                this.cd.detectChanges();
            },
            error: (err) => console.error('Error al cargar los servicios', err)
        });
    }

    registrarClic(servicio: TipoServicio) {
        if (!this.currentUser) return;

        // Evitar múltiples clics mientras se procesa la solicitud
        this.isLoading = true;

        this.ticketService.crearSolicitud(this.currentUser.username, servicio.id)
            .subscribe({
                next: (solicitud) => {
                    alert(`Se registró tu solicitud para: ${servicio.nombreServicio}`);

                    this.authService.logout();
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error('No se pudo registrar la solicitud.', err);
                }
            });

    }

    logout(): void {
        this.authService.logout();
    }
}