import { CompteBancaire } from "./compte-bancaire";
import { EtatTransfert } from "./etat-transfert";
import { NatureTransfert } from "./nature-transfert";
import { TransfertType } from "./transfert-type";
import { TypeFrais } from "./type-frais";

export class Transfert {
     refTransfert: string;
        etatTransfert: EtatTransfert;
        montantTransfert:number;
        montantFinal:number;
        montantFrais:number;
        datecre:Date;
        dateEnvoie:Date;
        typeTransfert:TransfertType;
        typeFrais:TypeFrais;
        compteSource: string;
        compteCible: string;
    
    
        constructor( refTransfert: string,
            etat: EtatTransfert,
            montantTransfert:number,
            montantFinal:number,
            frais:number,
            datecre:Date,
            dateEnvoie:Date,
            typeTransfert:TransfertType,
            typeFrais:TypeFrais,
            compteSource: string,
            compteCible: string) {
                this.refTransfert=refTransfert;
            this.etatTransfert = etat;
            this.montantTransfert = montantTransfert;
            this.montantFinal = montantFinal;
            this.typeFrais = frais;
            this.datecre = datecre;
            this.dateEnvoie = dateEnvoie;
            this.typeTransfert = typeTransfert;
            this.typeFrais=typeFrais;
            this.compteSource = compteSource;
            this.compteCible = compteCible;
        }
}
