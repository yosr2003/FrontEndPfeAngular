import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AssistantStateService } from '../assistant-state.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatService } from 'src/app/services/chat.service';
import { Conversation } from 'src/app/classes/conversation';
import { ConversationService } from 'src/app/services/conversation.service';
import { Observable, switchMap, tap } from 'rxjs';
import { Message } from 'src/app/classes/message';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Employe } from 'src/app/classes/employe';
import { TokenStorageService } from 'src/app/services/token-storage-service.service';

@Component({
  selector: 'app-assistantVirtuelSideBar',
  imports: [MaterialModule, CommonModule, FormsModule, MatButtonModule, MatInputModule, MatIconModule],
  templateUrl: './assistantVirtuelSideBar.component.html',
  styleUrl: './assistantVirtuelSideBar.component.scss'
})
export class AppAssistantVirtuelSideBar { 
  newMessage = '';
  botTyping = false;
  showHistory = false;
  pdfBlobUrls = new Map<string, SafeResourceUrl>();
  conversations:Conversation[]=[];
  conversationcourante:Conversation;
  
  
  constructor(private assistantStateService: AssistantStateService, private http: HttpClient,private chatService: ChatService,private ConversationService:ConversationService,private sanitizer: DomSanitizer,private tokenStorage: TokenStorageService) {
  this.conversationcourante = this.conversations[0];}

  ngOnInit() {
    this.assistantStateService.openSidebar(); 
    this.ConversationService.getAllConversations().pipe(
    switchMap(data => {
      if (data.length === 0) {
        // Appel ta nouvelle version de createNewConversation()
        return this.createNewConversation().pipe(
          switchMap(created =>
            this.ConversationService.getMessagesByConversation(created.id_conversation).pipe(
              tap(messages => {
                created.messages = messages;
                this.conversationcourante = created;
              })
            )
          )
        );
      } else {
        this.conversations = data;
        this.conversationcourante = data[0];
        return this.ConversationService.getMessagesByConversation(this.conversationcourante.id_conversation).pipe(
          tap(messages => {this.conversationcourante.messages = messages;messages.forEach(msg => this.checkAndLoadPdf(msg))})
        );
      }
    })
  ).subscribe({
    next: () => {
      console.log("Conversation courante :", this.conversationcourante);
    },
    error: err => {
      console.error("Erreur :", err);
    }
  });
  }

  ngOnDestroy() {
    this.assistantStateService.closeSidebar();
  }

  scrollToBottom() {
  const chatMessages = document.querySelector('.chat-messages');
  if (chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  }

  sendMessage() {
  if (!this.newMessage.trim()) return;

  const texteMessage = this.newMessage;
  const message= new Message(new Date(),texteMessage,this.conversationcourante);
  this.conversationcourante.messages.push(message);

  this.newMessage = '';
  this.botTyping = true;
  
  this.chatService.sendMessage(this.conversationcourante.messages).subscribe({
    next: (response) => {
      this.botTyping = false;
      console.log(response);
      message.texteReponse = response.texteReponse;
      message.intention=response.intention;
      message.entites=response.entites;
      this.checkAndLoadPdf(message);
      this.scrollToBottom();
      response.conversation=this.conversationcourante;
      response.timestamp=new Date();
      this.ConversationService.addMessage(response).subscribe({
        next: (resultat) => console.log('Message enregistré avec succès',resultat),
        error: (err) => console.error('Erreur enregistrement message :', err)
      });
    },
    error: () => {
      this.botTyping = false;
      message.texteReponse = "Erreur lors de la communication avec le serveur.";
    }
  });
  }
  createNewConversation(): Observable<Conversation>{
      const employe = new Employe(1, '', '', '', ''); 
      const newConversation = new Conversation(
      employe,
      new Date() 
      );
      return this.ConversationService.addConversation(newConversation).pipe(
      tap(createdConversation => {
        console.log("Conversation créée :", createdConversation);
        this.conversations.unshift(createdConversation);
        this.selectConversation(createdConversation); // Optionnel : sélectionne direct
      })
    );
    }
  selectConversation(conversation: Conversation) {
    this.conversationcourante = conversation;
    this.showHistory = false;
    this.ConversationService.getMessagesByConversation(conversation.id_conversation).subscribe(data => {
      console.log(data);
      this.conversationcourante.messages= data;
      console.log("les messages",this.conversationcourante.messages)
      });
  }

  isPdfLink(text: string): boolean {
  return text.includes('/Swift') || text.includes('.pdf');
  //return true;
  }

  // sanitizePdfUrl(url: string): SafeResourceUrl {
  // // si ce n’est pas un lien complet, on le complète
  // if (!url.startsWith('http')) {
  //   url = 'http://localhost:8084' + url;
  // }
  // return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  // }
  sanitizePdfUrl(url: string): SafeResourceUrl | null {
  if (this.pdfBlobUrls.has(url)) {
    return this.pdfBlobUrls.get(url)!;
  }

  let fullUrl = url.startsWith('http') ? url : 'http://localhost:8084' + url;

  this.http.get(fullUrl, {
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${this.tokenStorage.getToken()}`  // remplace avec ton système d'auth
    }
  }).subscribe(blob => {
    const blobUrl = URL.createObjectURL(blob);
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
    this.pdfBlobUrls.set(url, safeUrl);
  });

  return null; // temporairement, on n’a pas encore le blob
  } 

  checkAndLoadPdf(message: Message) {
  const url = message.texteReponse;
  if (this.isPdfLink(url) && !this.pdfBlobUrls.has(url)) {
    this.sanitizePdfUrl(url); // va lancer le chargement async
  }
  }


 


 
 
  //  toggleChat() {
  //   this.isOpen = !this.isOpen;
  //   if (this.isOpen) {
  //     this.hasNotification = false;
  //     this.showBubble = false;
  //     this.showHistory = false;
  //   }
  // }

  // toggleHistory() {
  //   this.showHistory = !this.showHistory;
  // }
  
}
