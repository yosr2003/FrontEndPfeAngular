import { DossierDelegue } from "./dossier-delegue";
import { EtatDoss } from "./etat-doss";

export class DossierEconomieSurSalaire extends DossierDelegue {
  montantMensuel!: number;
//    constructor(
//     idDossier: string,
//     dateDebut: Date,
//     dateExpiration: Date,
//     etatDossier: EtatDoss,
//     dateCre: Date,
//     dateCloture: Date ,
//     motifcloture: string ,
//     montantMensuel: number
//   ) {
//     super(idDossier, dateDebut, dateExpiration, etatDossier, dateCre, dateCloture, motifcloture);
//     this.montantMensuel = montantMensuel;
//   }
  constructor() {
      super();
  }
}
