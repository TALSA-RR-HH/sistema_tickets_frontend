import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UsuarioDTO } from '../models';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Inyectar dependencias
    private http = inject(HttpClient);
    private router = inject(Router);

    private apiUrl = `${environment.apiUrl}/usuarios`;

    currentUser = signal<UsuarioDTO | null>(this.getUserFromStorage());

    // Metodos
    login(credentials: {username: string, password: string}): Observable<UsuarioDTO> {
        return this.http.post<UsuarioDTO>(`${this.apiUrl}/login`, credentials).pipe(
            tap(user => {
                this.currentUser.set(user);
                localStorage.setItem('currentUser', JSON.stringify(user));
            })
        )
    }

    logout() {
        this.currentUser.set(null);
        localStorage.removeItem('currentUser');

        this.router.navigate(['/login']);
    }

    private getUserFromStorage(): UsuarioDTO | null {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    isAuthenticated(): boolean {
        return this.currentUser() !== null;
    }
}