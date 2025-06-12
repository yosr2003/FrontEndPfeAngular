import { DossierDelegue } from "./dossier-delegue";
import { EtatDoss } from "./etat-doss";

export class DossierEmpreint extends DossierDelegue {
  montantEmpreint!: number;
//     constructor(
//     idDossier: string,
//     dateDebut: Date,
//     dateExpiration: Date,
//     etatDossier: EtatDoss,
//     dateCre: Date,
//     dateCloture: Date ,
//     motifcloture: string ,
//     montantEmpreint: number
//   ) {
//     super(idDossier, dateDebut, dateExpiration, etatDossier, dateCre, dateCloture, motifcloture);
//     this.montantEmpreint = montantEmpreint;
//   }
  constructor() {
      super();
  }
 
}