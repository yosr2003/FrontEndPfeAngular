import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { DossierDelegue } from '../classes/dossier-delegue';
import { detectDossierType } from '../FonctionDetectType/detectDossierType';


@Injectable({
  providedIn: 'root'
})
export class DossierDelegueService {

 private baseUrl = 'http://localhost:8085'; 

  constructor(private http: HttpClient) { }
  // getAllDossiers(): Observable<{ body: DossierDelegue[] }> {

  //   return this.http.get<{ body: DossierDelegue[] }>(`${this.baseUrl}/dossiersDelegues`)
    
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }
  getAllDossiers(): Observable<DossierDelegue[]> {
  return this.http.get<{ body: Partial<DossierDelegue>[] }>(`${this.baseUrl}/dossiersDelegues`).pipe(
    map((response) => {
      return response.body.map((dossier: any) => detectDossierType(dossier));
    }),
    catchError(this.handleError)
  );}

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
