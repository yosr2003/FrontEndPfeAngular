import { Conversation } from "./conversation";

export class Message {
    id_message: Number;
    timestamp: Date;
    texteMessage:String;
    texteReponse:String;
    intention:String;
    entites: { [key: string]: string }; 
    conversation:Conversation
    constructor(timestamp: Date,texteMessage: string,conversation:Conversation) {
        this.timestamp = timestamp;
        this.texteMessage = texteMessage;
        this.conversation=conversation;
        }
    
}
