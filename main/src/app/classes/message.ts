import { Conversation } from "./conversation";

export class Message {
    id_message: Number;
    timestamp: Date;
    texteMessage:String;
    texteReponse:String;
    intention:String;
    conversation:Conversation
    constructor(id_message: Number,timestamp: Date,texteMessage: string,texteReponse: string,intention: string,conversation:Conversation) {
        this.id_message=id_message;
        this.timestamp = timestamp;
        this.texteMessage = texteMessage;
        this.texteReponse = texteReponse;
        this.intention = intention;
        this.conversation=conversation;
        }
    
}
