import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AssistantStateService } from '../assistant-state.service';
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
  contacts = [
    { name: 'James Johnson', lastMessage: 'Hey, how are you?' },
    { name: 'Maria Hernandez', lastMessage: 'Lorem Ipsum done' },
    { name: 'David Smith', lastMessage: 'Thanks mate' },
    { name: 'Maria Rodriguez', lastMessage: 'This is my chat' }
  ];
  constructor(private assistantStateService: AssistantStateService) {}

  ngOnInit() {
    this.assistantStateService.openSidebar(); 
  }

  ngOnDestroy() {
    this.assistantStateService.closeSidebar();
  }
  
}
