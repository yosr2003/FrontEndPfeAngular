import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AssistantStateService } from '../../extra/assistant-state.service';
import { Subscription } from 'rxjs';

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
constructor(private assistantStateService: AssistantStateService) {
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
    if (this.newMessage.trim()) {
      this.currentConversation.messages.push({
        text: this.newMessage,
        sender: 'user',
        timestamp: new Date()
      });
      
      // Simulate bot response
      setTimeout(() => {
        this.currentConversation.messages.push({
          text: 'Je vous remercie pour votre message. Comment puis-je vous aider davantage?',
          sender: 'bot',
          timestamp: new Date()
        });
      }, 1000);

      this.newMessage = '';
    }
  }
}
