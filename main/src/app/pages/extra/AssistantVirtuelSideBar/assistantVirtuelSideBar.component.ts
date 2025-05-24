import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AssistantStateService } from '../assistant-state.service';
import { HttpClient } from '@angular/common/http';
import { ChatService } from 'src/app/services/chat.service';
import { Conversation } from 'src/app/classes/conversation';
import { ConversationService } from 'src/app/services/conversation.service';
import { switchMap, tap } from 'rxjs';
import { Message } from 'src/app/classes/message';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-assistantVirtuelSideBar',
  imports: [MaterialModule, CommonModule, FormsModule, MatButtonModule, MatInputModule, MatIconModule],
  templateUrl: './assistantVirtuelSideBar.component.html',
  styleUrl: './assistantVirtuelSideBar.component.scss'
})
export class AppAssistantVirtuelSideBar { 
  newMessage = '';
  botTyping = false;
  conversations:Conversation[]=[];
  conversationcourante:Conversation;
  
  constructor(private assistantStateService: AssistantStateService, private http: HttpClient,private chatService: ChatService,private ConversationService:ConversationService,private sanitizer: DomSanitizer) {
  this.conversationcourante = this.conversations[0];}

  ngOnInit() {
    this.assistantStateService.openSidebar(); 
    this.ConversationService.getAllConversations().pipe(
      tap(data => {
        this.conversations = data;
        if (data.length === 0) {
          throw new Error("No conversations found");
        }
        this.conversationcourante = data[0];
      }),
      switchMap(() => this.ConversationService.getMessagesByConversation(this.conversationcourante.id_conversation))
      ).subscribe({
      next: messages => {
        this.conversationcourante.messages = messages;
        console.log("les messages", this.conversationcourante.messages);
      },
      error: err => {
        console.error("An error occurred:", err);
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

  isPdfLink(text: string): boolean {
  return text.includes('/Swift') || text.includes('.pdf');
  //return true;
  }

  sanitizePdfUrl(url: string): SafeResourceUrl {
  // si ce n’est pas un lien complet, on le complète
  if (!url.startsWith('http')) {
    url = 'http://localhost:8084' + url;
  }
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  } 
  
}
