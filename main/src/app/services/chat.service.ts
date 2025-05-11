import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = 'http://localhost:5004'; 
  constructor(private http: HttpClient) { }
  
  sendMessage(message: string): Observable<string> {
    return this.http.post<{ response: string }>(`${this.baseUrl}/chat`, { message }).pipe(
     map(res => res.response),
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
