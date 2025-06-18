import { ChangeDetectorRef, Component } from '@angular/core';
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
import { map, Observable, switchMap, tap, throwError } from 'rxjs';
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
  idAnalyse:number | undefined;
  pdfBlobUrls = new Map<string, SafeResourceUrl>();
  conversations:Conversation[]=[];
  conversationcourante:Conversation;
  currentProlongationApiUrl: string | null = null;
  selectedFile: File | null = null;
  validitemotif: boolean=false;
  
  constructor(private assistantStateService: AssistantStateService, private http: HttpClient,private chatService: ChatService,private ConversationService:ConversationService,private sanitizer: DomSanitizer,private tokenStorage: TokenStorageService,private cdr: ChangeDetectorRef) {
  this.conversationcourante = this.conversations[0];}

 ngOnInit() {
  this.assistantStateService.openSidebar(); 
  const user = this.tokenStorage.getUser();
  const userId = user?.id;

  if (!userId) {
    console.error("Utilisateur non authentifié");
    return;
  }

  this.ConversationService.getConversationsByEmploye(userId).pipe(
    switchMap(data => {
      if (data.length === 0) {
        // Si aucune conversation, créer une nouvelle
        return this.createNewConversation();
      } else {
        // Sinon, charger la première existante
        this.conversations = data;
        this.conversationcourante = data[0];

        return this.ConversationService.getConversationById(this.conversationcourante.id_conversation).pipe(
          tap(conversation => {
            this.conversationcourante.messages = conversation.messages;
            conversation.messages.forEach(msg => this.checkAndLoadPdf(msg));
          }),
          map(() => this.conversationcourante)
        );
      }
    })
  ).subscribe({
    next: (conv) => {
      console.log("Conversation courante :", conv);
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
  const message = new Message({
  texteMessage: texteMessage,
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
      this.ConversationService.addMessage(response,this.conversationcourante.id_conversation).subscribe({
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


createNewConversation(): Observable<Conversation> {
  const user = this.tokenStorage.getUser();
  const userId = user?.id;

  if (!userId) {
    console.error("Utilisateur non authentifié");
    return throwError(() => new Error("Utilisateur non authentifié"));
  }

  const nouvelleConversation = new Conversation(user, new Date());

  return this.ConversationService.addConversation(nouvelleConversation).pipe(
    switchMap((createdConversation: Conversation) =>
      this.ConversationService.getConversationById(createdConversation.id_conversation).pipe(
        map(loadedConv => {
          createdConversation.messages = loadedConv.messages || [];
          return createdConversation;
        }),
        tap(conv => {
          this.conversations.unshift(conv);
          this.conversationcourante = conv;
          this.showConversationsList = false;
          console.log("Nouvelle conversation courante :", conv);
        })
      )
    )
  );
}

addNewConversationFromUI() {
  this.createNewConversation().subscribe({
    next: (conv) => {
      console.log("Conversation créée via UI :", conv);
    },
    error: (err) => {
      console.error("Erreur lors de la création de la conversation :", err);
    }
  });
}



  selectConversation(conversation: Conversation) {
    this.conversationcourante = conversation;
    this.showHistory = false;
    this.ConversationService.getConversationById(conversation.id_conversation).subscribe(data => {
      console.log(data);
      this.conversationcourante.messages= data.messages;
      console.log("les messages",this.conversationcourante.messages)
      });
  }
  
  isProlongationLink(text: string): boolean {
  return text.includes('/scolarite/prolonger/');
  }
  onFileSelected(event: Event, messageReponse: Message): void {
  const input = event.target as HTMLInputElement;

  
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
    const dateProlongation = messageReponse.entites?.['DATE'] ?? ""; 
    

    const formData = new FormData();
    formData.append("file", this.selectedFile);
    this.botTyping = true;
    this.http.post<any>("http://127.0.0.1:8000/analyze-pdf/", formData).subscribe({
      next: (response: any) => {
        this.botTyping = false;
        console.log("Réponse de l'analyse :", response);
        // Supprimer les anciens messages d'analyse liés à ce message source (optionnel mais propre)
        this.conversationcourante.messages = this.conversationcourante.messages.filter(m =>
        !(m.intention === 'analyse_justificatif' && m.id_message === this.idAnalyse)
        );
        const analyseMessage = new Message({
          texteReponse: `📄 Justificatif analysé :\n📅 Date détectée : ${response.contient_date ? '✅ Oui' : '❌ Non'}\n🧠 Score grammaire : ${response.score_grammaire}%\n🏷️ Pertinence du motif : ${response.classification.label}\n✍️ Signature détectée : ${response.signature_detectee ? '✅ Oui' : '❌ Non'}`,
          intention: "analyse_justificatif",
          entites: {
            ...messageReponse.entites,
            urlProlongation: messageReponse.texteReponse,
            dateProlongation: dateProlongation,
          },
          conversation: this.conversationcourante
        });
        this.validitemotif=response.classification.label === "fort";
        this.idAnalyse=analyseMessage.id_message;
        console.log("msg", analyseMessage);
        
        

        this.conversationcourante.messages.push(analyseMessage);
         this.scrollToBottom();
        
      },
      error: (err) => {
        this.botTyping = false;
        const successMessage = new Message({
        texteReponse: "IL y'a eu une erreur d'analyse du justificatif",
        conversation: this.conversationcourante
      });
       
      this.ConversationService.addMessage(successMessage,this.conversationcourante.id_conversation).subscribe();
      this.conversationcourante.messages.push(successMessage);
      this.scrollToBottom();
      console.error("Erreur d'analyse du justificatif :", err);
      }
      });
    
   }
}

  

  isPdfLink(text: string): boolean {
  // PDF si :
  return (
    text.includes('http://localhost:8085') &&
    !text.includes('/scolarite/prolonger') &&  // <-- exclure lien de prolongation
    (
      text.includes('/transferts/') ||
      text.includes('/dossiersDelegues/DOS') ||
      text.includes('/etatDeclaration/consulter') ||
      text.includes('/RapportMvmntsFinanciers/') ||
      text.includes('/Swift/T') || 
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

  prolongerDepuisAnalyse(messageAnalyse: Message): void {
    const fichier = this.selectedFile;
    const apiUrl = messageAnalyse.entites?.['urlProlongation'];
    if(!fichier || !apiUrl){
      console.error("Aucun fichier trouvé dans le message pour la prolongation.");
      return;
    }
    const formData = new FormData();
    formData.append("dateProlongation", messageAnalyse.entites?.['DATE'] ?? "");
    formData.append("fichier", fichier);
    
    const successMessage = new Message({
    texteReponse: " Prolongation effectuée avec succès.",
    intention: "prolonger_expiration_dossier",
    conversation: this.conversationcourante
    });
    this.http.put(apiUrl, formData, {
    headers: {
      Authorization: `Bearer ${this.tokenStorage.getToken()}`
    }
    }).subscribe({
    next: () => {
      this.ConversationService.addMessage(successMessage,this.conversationcourante.id_conversation).subscribe();
      this.conversationcourante.messages.push(successMessage);
      this.scrollToBottom();
    },
    error: err => alert("❌ Erreur : " + err.error)
  });
}



showConversationsList = false;

toggleConversationsList() {
  this.showConversationsList = !this.showConversationsList;
}

deleteConversation(convToDelete: Conversation, event: MouseEvent) {
  event.stopPropagation(); // Empêche le clic de sélectionner la conversation

  const confirmDelete = confirm("❗ Voulez-vous vraiment supprimer cette conversation ?");
  if (!confirmDelete) return;

  this.ConversationService.deleteConversationById(convToDelete.id_conversation).subscribe({
    next: () => {
      this.conversations = this.conversations.filter(conv => conv.id_conversation !== convToDelete.id_conversation);

      // Si on supprime la conversation courante, on la remplace par la suivante ou précédente
      if (this.conversationcourante.id_conversation === convToDelete.id_conversation) {
        this.conversationcourante = this.conversations[0] || null;
      }

      console.log("Conversation supprimée avec succès");
    },
    error: err => {
      console.error("Erreur lors de la suppression :", err);
      alert("Une erreur est survenue lors de la suppression.");
    }
  });
}

 

  
}
