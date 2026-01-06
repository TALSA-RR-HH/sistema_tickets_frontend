import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { Rol } from "../../models";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    // Variables para el formulario
    username = '';
    password = '';
    errorMessage = '';
    isLoading = false;

    onLogin() {
        this.isLoading = true;
        this.errorMessage = '';

        this.authService.login({username: this.username, password: this.password})
            .subscribe({
                next: (user) => {
                    this.isLoading = false;
                    if (user.rol === Rol.ADMIN) {
                        this.router.navigate(['/admin']);
                    } else {
                        this.router.navigate(['/dashboard']);
                    }
                },
                error: (err) => {
                    this.isLoading = false;
                    this.errorMessage = 'Credenciales incorrectas o usuario inactivo.';
                    console.error('Login error:', err);
                }
            });
    }
}