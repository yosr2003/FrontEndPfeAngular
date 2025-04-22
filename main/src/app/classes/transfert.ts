import { CompteBancaire } from "./compte-bancaire";
import { EtatTransfert } from "./etat-transfert";
import { NatureTransfert } from "./nature-transfert";
import { TransfertType } from "./transfert-type";
import { TypeFrais } from "./type-frais";

export class Transfert {
     refTransfert: string;
        etat: EtatTransfert;
        natureOperation: string;
        montantTransfert:number;
        natureTransfert:NatureTransfert;
        montantFinal:number;
        frais:number;
        datecre:Date;
        dateEnvoie:Date;
        typeTransfert:TransfertType;
        typeFrais:TypeFrais;
        compteSource: string;
        compteCible: string;
    
    
        constructor( refTransfert: string,
            etat: EtatTransfert,
            natureOperation: string,
            montantTransfert:number,
            natureTransfert:NatureTransfert,
            montantFinal:number,
            frais:number,
            datecre:Date,
            dateEnvoie:Date,
            typeTransfert:TransfertType,
            typeFrais:TypeFrais,
            compteSource: string,
            compteCible: string) {
                this.refTransfert=refTransfert;
            this.etat = etat;
            this.natureOperation = natureOperation;
            this.montantTransfert = montantTransfert;
            this.natureTransfert = natureTransfert;
            this.montantFinal = montantFinal;
            this.frais = frais;
            this.datecre = datecre;
            this.dateEnvoie = dateEnvoie;
            this.typeTransfert = typeTransfert;
            this.typeFrais=typeFrais;
            this.compteSource = compteSource;
            this.compteCible = compteCible;
        }
}
