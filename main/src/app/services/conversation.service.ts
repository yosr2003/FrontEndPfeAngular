import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Conversation } from '../classes/conversation';
import { Message } from '../classes/message';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {private baseUrl = 'http://localhost:8084'; 
  constructor(private http: HttpClient) { }
  getAllConversations():Observable<Conversation[]>{
    return this.http.get<Conversation[]>(`${this.baseUrl}/conversations`).pipe(catchError(this.handleError));
  }
  getMessagesByConversation(id:Number):Observable<Message[]>{
     return this.http.get<Message[]>(`${this.baseUrl}/messages/${id}`).pipe(catchError(this.handleError));
  }

  addConversation(conversation: Conversation): Observable<Conversation> {
  return this.http.post<Conversation>(`${this.baseUrl}/conversations`, conversation)
    .pipe(catchError(this.handleError));
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
