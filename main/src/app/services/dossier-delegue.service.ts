import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { DossierDelegue } from '../classes/dossier-delegue';


@Injectable({
  providedIn: 'root'
})
export class DossierDelegueService {

 private baseUrl = 'http://localhost:8084'; 

  constructor(private http: HttpClient) { }
  getAllDossiers(): Observable<DossierDelegue[]> {

    const token = localStorage.getItem('token'); 

    // Création des en-têtes d'authentification
    const headers = new HttpHeaders({
      'Authorization': `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbGljZS5kdXBvbnRAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDUyODAzOTksImV4cCI6MTc0NTM2Njc5OX0.NNvQQkBx9WPaoxmwkIN96vHb3k1uDdlb9kdFn7zS-9XEs3HRczuVUqTo4akOweJQpziC6pfQmLc-fnsl0Wp4dw`
    });

    return this.http.get<DossierDelegue[]>(`${this.baseUrl}/dossiersDelegues`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur : ${error.status}\nMessage : ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
