import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DatePipe } from '@angular/common';
import { TicketService } from "../../services/ticket.service";
import { AuthService } from "../../services/auth.service";
import { SolicitudDTO, TipoServicio } from "../../models";

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [FormsModule, DatePipe],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
    private ticketService = inject(TicketService);
    private authService = inject(AuthService);
    private cd = inject(ChangeDetectorRef);

    currentUser = this.authService.currentUser();
    stats: any[] = [];
    listaServicios: TipoServicio[] = [];

    // --- VARIABLES PARA LA TABLA MAESTRA ---
    todosLosRegistros: SolicitudDTO[] = [];
    registrosFiltrados: SolicitudDTO[] = [];
    registrosPaginados: SolicitudDTO[] = [];

    // Filtros
    filtroTexto: string = '';      // Busca por DNI o Nombre
    filtroServicio: string = '';   // Dropdown de servicio
    resumenDinamico: { nombre: string, cantidad: number }[] = [];

    // Paginación
    paginaActual: number = 1;
    itemsPorPagina: number = 10;
    totalItems: number = 0;
    totalPaginas: number = 0;
    opcionesPagina = [5, 10, 20, 50, 100];

    ngOnInit(): void {
        this.cargarEstadisticas();
        this.cargarListaServicios();
        this.cargarTodoElHistorial();
    }

    cargarTodoElHistorial() {
        this.ticketService.getTodasLasSolicitudes().subscribe({
            next: (data) => {
                this.todosLosRegistros = data;
                this.aplicarFiltros(); // Al cargar, aplicamos filtros (vacíos) para llenar la tabla
            },
            error: (err) => console.error(err)
        });
    }

    // Filtrado y paginación
    aplicarFiltros() {
        let temp = [...this.todosLosRegistros];

        // Filtro por texto (DNI o Nombre)
        if (this.filtroTexto) {
            const texto = this.filtroTexto.toLowerCase();
            temp = temp.filter(item =>
                item.usuarioNombre.toLowerCase().includes(texto) ||
                item.username.toLowerCase().includes(texto)
            );
        }

        // Filtro por servicio
        if (this.filtroServicio) {
            temp = temp.filter(item => item.nombreServicio === this.filtroServicio);
        }

        this.registrosFiltrados = temp;
        this.totalItems = this.registrosFiltrados.length;

        this.calcularResumenDeServicios();
    
        // Resetear a página 1 si cambiamos filtros
        this.paginaActual = 1; 
        this.actualizarPaginacion();
    }

    calcularResumenDeServicios() {
        const conteos: Record<string, number> = {};

        this.registrosFiltrados.forEach(item => {
            const servicio = item.nombreServicio;
            conteos[servicio] = (conteos[servicio] || 0) + 1;
        });

        this.resumenDinamico = Object.keys(conteos).map(key => ({
            nombre: key,
            cantidad: conteos[key]
        })).sort((a, b) => b.cantidad - a.cantidad);
    }

    actualizarPaginacion() {
        this.itemsPorPagina = Number(this.itemsPorPagina);

        this.totalPaginas = Math.ceil(this.totalItems / this.itemsPorPagina);
    
        const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
        const fin = inicio + this.itemsPorPagina;
        
        this.registrosPaginados = this.registrosFiltrados.slice(inicio, fin);
        this.cd.detectChanges();
    }

    cambiarPagina(delta: number) {
        this.paginaActual += delta;
        this.actualizarPaginacion();
    }

    // Exportar a CSV
    exportarCSV() {
        // 1. Definir cabeceras
        let csvContent = "ID,DNI,EMPLEADO,SERVICIO,FECHA\n";

        // 2. Recorrer los datos filtrados (NO solo los de la página actual, sino todos los del filtro)
        this.registrosFiltrados.forEach(row => {
            // Formatear fecha simple
            const fecha = new Date(row.fechaHora).toLocaleString().replace(',', '');
            csvContent += `${row.id},${row.username},${row.usuarioNombre},${row.nombreServicio},"${fecha}"\n`;
        });

        // 3. Crear enlace de descarga
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "reporte_rrhh.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    cargarEstadisticas() {
        this.ticketService.getReporteGlobal().subscribe(data => {
            this.stats = data.map(item => ({ nombre: item[0], cantidad: item[1] }));
            this.cd.detectChanges();
        });
    }

    cargarListaServicios() {
        this.ticketService.getServicios().subscribe(data => this.listaServicios = data);
    }

    logout() {
        this.authService.logout();
    }
}