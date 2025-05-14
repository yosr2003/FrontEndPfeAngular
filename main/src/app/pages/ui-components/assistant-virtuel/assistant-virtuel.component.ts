import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AssistantStateService } from '../../extra/assistant-state.service';
import { Subscription } from 'rxjs';
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
  currentConversation: Conversation;
  sidebarSubscription: Subscription;
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

// dans assistant-virtuel.component.ts
constructor(private assistantStateService: AssistantStateService, private http: HttpClient,private chatService: ChatService) {
  this.currentConversation = this.conversations[0];
}

ngOnInit() {
  this.assistantStateService.sidebarOpen$.subscribe(open => {
    this.isSidebarVisible = open;

    // BONUS : refermer la petite fenêtre automatiquement si la grande est ouverte
    if (open) {
      this.isOpen = false;
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
    const newConversation: Conversation = {
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

  selectConversation(conversation: Conversation) {
    this.currentConversation = conversation;
    this.showHistory = false;
  }


  sendMessage() {
  if (!this.newMessage.trim()) return;

  const message = this.newMessage;
  this.currentConversation.messages.push({
    text: message,
    sender: 'user',
    timestamp: new Date()
  });

  this.newMessage = '';
  this.botTyping = true;

  this.chatService.sendMessage(message).subscribe({
    next: (response) => {
      this.botTyping = false;
      this.currentConversation.messages.push({
        text: response,
        sender: 'bot',
        timestamp: new Date()
      });
      this.scrollToBottom();
    },
    error: () => {
      this.botTyping = false;
      this.currentConversation.messages.push({
        text: "Erreur lors de la communication avec le serveur.",
        sender: 'bot',
        timestamp: new Date()
      });
    }
  });
}

}
