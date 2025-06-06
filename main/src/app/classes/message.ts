import { Conversation } from "./conversation";

// export class Message {
//     id_message: Number;
//     timestamp: Date;
//     texteMessage:string;
//     texteReponse:string;
//     intention:string;
//     entites: { [key: string]: string }; 
//     conversation:Conversation
//     constructor(timestamp: Date,texteMessage: string,texteReponse:string,conversation:Conversation) {
//         this.timestamp = timestamp;
//         this.texteMessage = texteMessage;
//         this.texteReponse = texteReponse;
//         this.conversation=conversation;
//         }
    
// }

export class Message {
  id_message?: number;
  timestamp: Date;
  texteMessage: string;
  texteReponse: string;
  intention?: string;
  entites?: { [key: string]: string};
  conversation: Conversation;

  constructor(data: Partial<Message>) {
    // Remplir les valeurs par défaut si non fournies
    this.timestamp = data.timestamp ?? new Date();
    this.texteMessage = data.texteMessage ?? "";
    this.texteReponse = data.texteReponse ?? "";
    this.intention = data.intention;
    this.entites = data.entites;
    this.conversation = data.conversation!;
  }
}

