import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AssistantStateService } from '../../extra/assistant-state.service';
import { Observable, Subscription, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChatService } from 'src/app/services/chat.service';
import { ConversationService } from 'src/app/services/conversation.service';
import { Conversation } from 'src/app/classes/conversation';
import { Message } from 'src/app/classes/message';
import { Employe } from 'src/app/classes/employe';
import { ERole } from 'src/app/classes/role';
import { consumerAfterComputation } from '@angular/core/primitives/signals';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TokenStorageService } from 'src/app/services/token-storage-service.service';


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
  conversationcourante:Conversation;
  sidebarSubscription: Subscription;
  conversations:Conversation[]=[];
  pdfBlobUrls = new Map<string, SafeResourceUrl>();
  currentProlongationApiUrl: string | null = null;
  selectedFile: File | null = null;


// dans assistant-virtuel.component.ts
constructor(private assistantStateService: AssistantStateService, private http: HttpClient,private chatService: ChatService,private ConversationService:ConversationService,private cdr: ChangeDetectorRef,private sanitizer: DomSanitizer,private tokenStorage: TokenStorageService,) {
  this.conversationcourante=this.conversations[0];
  
  
}

ngOnInit() {
  this.assistantStateService.sidebarOpen$.subscribe(open => {
    this.isSidebarVisible = open;
    // BONUS : refermer la petite fenêtre automatiquement si la grande est ouverte
    if (open) {
      this.isOpen = false;
    }
  });
  const user = this.tokenStorage.getUser();
    const userId = user?.id;
    console.log("ID de l'utilisateur connecté :", userId);
  this.ConversationService.getConversationsByEmploye(userId).pipe(
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
  scrollToBottom() {
  const chatMessages = document.querySelector('.chat-messages');
  if (chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  }


  // ngOnDestroy() {
  //   this.sidebarSubscription.unsubscribe();
  // }

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


  createNewConversation(): Observable<Conversation>{
   const user = this.tokenStorage.getUser();
    const userId = user?.id;
    console.log("ID de l'utilisateur connecté :", userId);
    const newConversation = new Conversation(
    user,
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
  onNewConversationClicked() {
  this.createNewConversation().subscribe({
    next: (createdConversation) => {
      this.selectConversation(createdConversation);
    },
    error: (err) => {
      console.error("Erreur :", err);
    }
  });
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

  sendMessage() {
  if (!this.newMessage.trim()) return;

  const texteMessage = this.newMessage;
  const message = new Message({
  texteReponse: texteMessage,
  conversation: this.conversationcourante
  });
  //const message= new Message(new Date(),texteMessage,this.conversationcourante);
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

isProlongationLink(text: string): boolean {
  return text.includes('/scolarite/prolonger/');
  }
  onFileSelected(event: Event, messageReponse: Message): void {
  const input = event.target as HTMLInputElement;

  
  if (input.files && input.files.length > 0) {
    const selectedFile = input.files[0];
    const dateProlongation = messageReponse.entites?.['DATE'] ?? ""; // fallback vide si manquant
    const apiUrl = messageReponse.texteReponse; 
    const formData = new FormData();
    formData.append("dateProlongation", dateProlongation); // date bidon
    formData.append("fichier", selectedFile);
    const message = new Message({
      texteReponse: "✅ prolongation effectuée avce succées.",
      intention: "prolonger_expiration_dossier",
      conversation: this.conversationcourante
    });
    this.http.put(apiUrl, formData, {
      headers: {
        Authorization: `Bearer ${this.tokenStorage.getToken()}`
      }
    }).subscribe({
      next: () =>  {
        this.ConversationService.addMessage(message).subscribe({
          next: () => console.log("Réponse enregistrée avec succès."),
          error: (err) => console.error("Erreur d'enregistrement :", err)
        });
        this.conversationcourante.messages.push(message);
        this.scrollToBottom();},
      //alert("✅ Prolongation envoyée !"),
      error: err => alert("❌ Erreur : " + err.error)
    });
  }
}

  
  // isPdfLink(text: string): boolean {
  // return text.includes('http://localhost:8085') || text.includes('.pdf');
  // }
  isPdfLink(text: string): boolean {
  // PDF si :
  return (
    text.includes('http://localhost:8085') &&
    !text.includes('/scolarite/prolonger') &&  // <-- exclure lien de prolongation
    (
      text.includes('/transferts/') ||
      text.includes('/dossiersDelegues/DOSS') ||
      text.includes('/etatDeclaration/consulter') ||
      text.includes('/RapportMvmntsFinanciers/') ||
      text.endsWith('.pdf')
    )
  );
  }


  sanitizePdfUrl(url: string): void {
  if (this.pdfBlobUrls.has(url)) return;
  let fullUrl = url.startsWith('http') ? url : 'http://localhost:8085' + url;

  this.http.get(fullUrl, {
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${this.tokenStorage.getToken()}`  // remplace avec ton système d'auth
    }
  }).subscribe(blob => {
    const blobUrl = URL.createObjectURL(blob);
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
    this.pdfBlobUrls.set(url, safeUrl);
    this.cdr.detectChanges();
  });

  //return null; // temporairement, on n’a pas encore le blob
  } 

  checkAndLoadPdf(message: Message) {
  const url = message.texteReponse;
  if (this.isPdfLink(url) && !this.pdfBlobUrls.has(url)) {
    this.sanitizePdfUrl(url); // va lancer le chargement async
  }
  }

}
