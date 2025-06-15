import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Conversation } from '../classes/conversation';
import { Message } from '../classes/message';
import { TokenStorageService } from './token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {private baseUrl = 'http://localhost:8085'; 
  constructor(private http: HttpClient,private tokenStorage: TokenStorageService) { }
  getAllConversations():Observable<Conversation[]>{
    const token = this.tokenStorage.getToken(); 
    const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });
    return this.http.get<Conversation[]>(`${this.baseUrl}/conversations`,{ headers }).pipe(catchError(this.handleError));
  }
  getConversationsByEmploye(id:number):Observable<Conversation[]>{
    const token = this.tokenStorage.getToken(); 
    const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });
    return this.http.get<Conversation[]>(`${this.baseUrl}/conversations/Employe/${id}`,{ headers }).pipe(catchError(this.handleError));
  }
  getMessagesByConversation(id:Number):Observable<Message[]>{
    const token = this.tokenStorage.getToken(); 
    const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });
    return this.http.get<Message[]>(`${this.baseUrl}/messages/${id}`,{ headers }).pipe(catchError(this.handleError));
  }
  getConversationById(id:Number):Observable<Conversation>{
    const token = this.tokenStorage.getToken(); 
    const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });
    return this.http.get<Conversation>(`${this.baseUrl}/conversations/${id}`,{ headers }).pipe(catchError(this.handleError));
  }

  addConversation(conversation: Conversation): Observable<Conversation> {
    const token = this.tokenStorage.getToken(); 
    const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });
    return this.http.post<Conversation>(`${this.baseUrl}/conversations`, conversation,{ headers })
    .pipe(catchError(this.handleError));
  }

  addMessage(message: Message,id:Number): Observable<Message> {
    const messageAEnvoyer = {
    texteMessage: message.texteMessage,
    texteReponse:message.texteReponse,
    intention: message.intention|| null,
    entites: message.entites,
    timestamp: message.timestamp,
    conversation: {
      id_conversation: message.conversation.id_conversation
    }};
    const token = this.tokenStorage.getToken(); 
    const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });
    return this.http.post<Message>(`${this.baseUrl}/messages/${id}`, messageAEnvoyer,{ headers })
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

deleteConversationById(id: number): Observable<void> {
  const token = this.tokenStorage.getToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.delete<void>(`${this.baseUrl}/conversations/${id}`, { headers });
}

}
