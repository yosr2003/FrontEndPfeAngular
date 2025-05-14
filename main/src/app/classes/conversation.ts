import { Employe } from "./employe";
import { Message } from "./message";

export class Conversation {
    id_conversation: Number;
    employe: Employe;
    dateCreation:Date;
    messages: Message[];
    constructor(
            employe: Employe,
            dateCreation: Date) {
            this.employe = employe;
            this.dateCreation = dateCreation;
            this.messages=this.messages;
        }
}
