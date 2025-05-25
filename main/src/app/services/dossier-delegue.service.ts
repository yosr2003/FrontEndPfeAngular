import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { DossierDelegue } from '../classes/dossier-delegue';


@Injectable({
  providedIn: 'root'
})
export class DossierDelegueService {

 private baseUrl = 'http://localhost:8086'; 

  constructor(private http: HttpClient) { }
  getAllDossiers(): Observable<{ body: DossierDelegue[] }> {

    const token = localStorage.getItem('token'); 

    // Création des en-têtes d'authentification
    const headers = new HttpHeaders({
      'Authorization': `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbGljZS5kdXBvbnRAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDUzMTAyNDYsImV4cCI6MTc0NTM5NjY0Nn0.t7upMAr71AD_7J6hNaRCaIc3Sd_koEcaAuQQ_exk1i3HjIDZXsHyTjtwzP8Bhv2xChqOxkGt_840fjP960P-4w`
    });

    return this.http.get<{ body: DossierDelegue[] }>(`${this.baseUrl}/dossiersDelegues`)
      //, { headers }
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
