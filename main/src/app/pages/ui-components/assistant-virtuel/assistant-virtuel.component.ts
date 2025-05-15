import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AssistantStateService } from '../../extra/assistant-state.service';
import { Subscription, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChatService } from 'src/app/services/chat.service';
import { ConversationService } from 'src/app/services/conversation.service';
import { Conversation } from 'src/app/classes/conversation';
import { Message } from 'src/app/classes/message';
import { Employe } from 'src/app/classes/employe';

interface IMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface IConversation {
  id: number;
  date: Date;
  title: string;
  messages: IMessage[];
}
@Component({
  selector: 'app-assistant-virtuel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatIconModule],
  templateUrl: './assistant-virtuel.component.html',
  styleUrl: './assistant-virtuel.component.scss'
})
export class AssistantVirtuelComponent {
  botTyping = false;
  isOpen = false;
  hasNotification = true;
  showBubble = false;
  showHistory = false;
  newMessage = '';
  isSidebarVisible = false;
  currentConversation: IConversation;
  conversationcourante:Conversation;
  sidebarSubscription: Subscription;
  conversations2:Conversation[]=[];
  conversations: IConversation[] = [
    { 
      id: 1, 
      date: new Date(), 
      title: 'Conversation 1',
      messages: [
        {
          text: 'Bonjour, je suis votre assistant virtuel, comment puis-je vous aider?',
          sender: 'bot',
          timestamp: new Date()
        }
      ]
    },
    { 
      id: 2, 
      date: new Date(Date.now() - 86400000), 
      title: 'Conversation 2',
      messages: []
    },
    { 
      id: 3, 
      date: new Date(Date.now() - 172800000), 
      title: 'Conversation 3',
      messages: []
    }
  ];

// dans assistant-virtuel.component.ts
constructor(private assistantStateService: AssistantStateService, private http: HttpClient,private chatService: ChatService,private ConversationService:ConversationService) {
  this.currentConversation = this.conversations[0];
  this.conversationcourante=this.conversations2[0];
  
  
}

ngOnInit() {
  this.assistantStateService.sidebarOpen$.subscribe(open => {
    this.isSidebarVisible = open;
    // BONUS : refermer la petite fenêtre automatiquement si la grande est ouverte
    if (open) {
      this.isOpen = false;
    }
  });

  this.ConversationService.getAllConversations().pipe(
  tap(data => {
    this.conversations2 = data;
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
  scrollToBottom() {
  const chatMessages = document.querySelector('.chat-messages');
  if (chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  }


  ngOnDestroy() {
    this.sidebarSubscription.unsubscribe();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.hasNotification = false;
      this.showBubble = false;
      this.showHistory = false;
    }
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
  }

  createNewConversation() {
    const newId = Math.max(...this.conversations.map(c => c.id)) + 1;
    const newConversation: IConversation = {
      id: newId,
      date: new Date(),
      title: `Conversation ${newId}`,
      messages: [
        {
          text: 'Bonjour, je suis votre assistant virtuel, comment puis-je vous aider?',
          sender: 'bot',
          timestamp: new Date()
        }
      ]
    };
    
    this.conversations.unshift(newConversation);
    this.selectConversation(newConversation);
  }

  createNewConversation2() {
    const employe = new Employe(1, '', '', '', '', '');
    const newConversation = new Conversation(
    employe,
    new Date() // or new Date('2025-05-15T10:50:00Z') if specific
    );
    this.ConversationService.addConversation(newConversation).subscribe({
    next: (createdConversation) => {
    console.log("Conversation créée :", createdConversation);
    },
    error: (err) => {
    console.error("Erreur lors de la création :", err);
    }
    });
    this.conversations2.unshift(newConversation);
    this.selectConversation2(newConversation);
    
  }

  selectConversation(conversation: IConversation) {
    this.currentConversation = conversation;
    this.showHistory = false;
  }
  selectConversation2(conversation: Conversation) {
    this.conversationcourante = conversation;
    this.showHistory = false;
    this.ConversationService.getMessagesByConversation(conversation.id_conversation).subscribe(data => {
      console.log(data);
      this.conversationcourante.messages= data;
      console.log("les messages",this.conversationcourante.messages)
      });
  }


//   sendMessage() {
//   if (!this.newMessage.trim()) return;

//   const message = this.newMessage;
//   this.currentConversation.messages.push({
//     text: message,
//     sender: 'user',
//     timestamp: new Date()
//   });

//   this.newMessage = '';
//   this.botTyping = true;

//   this.chatService.sendMessage(message).subscribe({
//     next: (response) => {
//       this.botTyping = false;
//       this.currentConversation.messages.push({
//         text: response,
//         sender: 'bot',
//         timestamp: new Date()
//       });
//       this.scrollToBottom();
//     },
//     error: () => {
//       this.botTyping = false;
//       this.currentConversation.messages.push({
//         text: "Erreur lors de la communication avec le serveur.",
//         sender: 'bot',
//         timestamp: new Date()
//       });
//     }
//   });
// }

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

}
