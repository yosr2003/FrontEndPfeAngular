import { DossierDelegue } from "./dossier-delegue";
import { EtatDoss } from "./etat-doss";

export class DossierContratCommercial extends DossierDelegue {
  montantContrat!: number;
//     constructor(
//     idDossier: string,
//     dateDebut: Date,
//     dateExpiration: Date,
//     etatDossier: EtatDoss,
//     dateCre: Date,
//     dateCloture: Date ,
//     motifcloture: string ,
//     montantContrat: number
//   ) {
//     super(idDossier, dateDebut, dateExpiration, etatDossier, dateCre, dateCloture, motifcloture);
//     this.montantContrat = montantContrat;
//   }
  constructor() {
      super();
  }
}