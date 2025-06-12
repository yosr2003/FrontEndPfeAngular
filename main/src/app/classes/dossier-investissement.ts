import { DossierDelegue } from "./dossier-delegue";
import { EtatDoss } from "./etat-doss";

export class DossierInvestissement extends DossierDelegue {
  secteurActivité!: string;
  //   constructor(
  //   idDossier: string,
  //   dateDebut: Date,
  //   dateExpiration: Date,
  //   etatDossier: EtatDoss,
  //   dateCre: Date,
  //   dateCloture: Date,
  //   motifcloture: string ,
  //   secteurActivité: string
  // ) {
  //   super(idDossier, dateDebut, dateExpiration, etatDossier, dateCre, dateCloture, motifcloture);
  //   this.secteurActivité = secteurActivité;
  // }

    constructor() {
      super();
    }
}