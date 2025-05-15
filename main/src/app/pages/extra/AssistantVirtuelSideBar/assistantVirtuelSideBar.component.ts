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
interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Conversation {
  id: number;
  date: Date;
  title: string;
  messages: Message[];
}
@Component({
  selector: 'app-assistantVirtuelSideBar',
  imports: [MaterialModule, CommonModule, FormsModule, MatButtonModule, MatInputModule, MatIconModule],
  templateUrl: './assistantVirtuelSideBar.component.html',
  styleUrl: './assistantVirtuelSideBar.component.scss'
})
export class AppAssistantVirtuelSideBar { 
  newMessage = '';
  currentConversation: Conversation;
  botTyping = false;
  conversations: Conversation[] = [
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
  contacts = [
    { name: 'James Johnson', lastMessage: 'Hey, how are you?' },
    { name: 'Maria Hernandez', lastMessage: 'Lorem Ipsum done' },
    { name: 'David Smith', lastMessage: 'Thanks mate' },
    { name: 'Maria Rodriguez', lastMessage: 'This is my chat' }
  ];
  
  constructor(private assistantStateService: AssistantStateService, private http: HttpClient,private chatService: ChatService) {
  this.currentConversation = this.conversations[0];}

  ngOnInit() {
    this.assistantStateService.openSidebar(); 
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
  // if (!this.newMessage.trim()) return;

  // const message = this.newMessage;
  // this.currentConversation.messages.push({
  //   text: message,
  //   sender: 'user',
  //   timestamp: new Date()
  // });

  // this.newMessage = '';
  // this.botTyping = true;

  // this.chatService.sendMessage(message).subscribe({
  //   next: (response) => {
  //     this.botTyping = false;
  //     this.currentConversation.messages.push({
  //       text: response,
  //       sender: 'bot',
  //       timestamp: new Date()
  //     });
  //     this.scrollToBottom();
  //   },
  //   error: () => {
  //     this.botTyping = false;
  //     this.currentConversation.messages.push({
  //       text: "Erreur lors de la communication avec le serveur.",
  //       sender: 'bot',
  //       timestamp: new Date()
  //     });
  //   }
  // });
  }
  
}
