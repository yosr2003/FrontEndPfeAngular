import { Employe } from "./employe";

export class Conversation {
    id_conversation: Number;
    employe: Employe;
    dateCreation:Date;
    constructor(id_conversation: Number,
            employe: Employe,
            dateCreation: Date) {
            this.id_conversation=id_conversation;
            this.employe = employe;
            this.dateCreation = dateCreation;
        }
}
