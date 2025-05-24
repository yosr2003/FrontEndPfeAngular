import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Message } from '../classes/message';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = 'http://localhost:5004'; 
  constructor(private http: HttpClient) { }
  
  sendMessage(messages: Message[]): Observable<Message> {
    const messagesToSend = messages.map(m => ({
    texteMessage: m.texteMessage,
    texteReponse: m.texteReponse|| null,
    intention: m.intention|| null,
    entites: m.entites|| null,
    }));
    console.log("les messages a envoyees",messagesToSend);
    return this.http.post<Message>(`${this.baseUrl}/chat`,messagesToSend).pipe(catchError(this.handleError));
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
