import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Transfert } from '../classes/transfert';

@Injectable({
  providedIn: 'root'
})
export class TransfertService {

  private baseUrl = 'http://localhost:8084'; 

  constructor(private http: HttpClient) { }
  getAllTransferts(): Observable<Transfert[]> {

    const token = localStorage.getItem('token'); 


    const headers = new HttpHeaders({
      'Authorization': `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbGljZS5kdXBvbnRAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDUzMTAyNDYsImV4cCI6MTc0NTM5NjY0Nn0.t7upMAr71AD_7J6hNaRCaIc3Sd_koEcaAuQQ_exk1i3HjIDZXsHyTjtwzP8Bhv2xChqOxkGt_840fjP960P-4w`
    });

    return this.http.get<Transfert[]>(`${this.baseUrl}/transferts`)
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
