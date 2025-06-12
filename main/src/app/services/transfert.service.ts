import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Transfert } from '../classes/transfert';

@Injectable({
  providedIn: 'root'
})
export class TransfertService {

  private baseUrl = 'http://localhost:8085'; 

  constructor(private http: HttpClient) { }
  getAllTransferts(): Observable<Transfert[]> {

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
