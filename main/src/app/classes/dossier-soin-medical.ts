import { DossierDelegue } from "./dossier-delegue";
import { EtatDoss } from "./etat-doss";

export class DossierSoinMedical extends DossierDelegue {
  typeTraitement!: string;
  //   constructor(
  //   idDossier: string,
  //   dateDebut: Date,
  //   dateExpiration: Date,
  //   etatDossier: EtatDoss,
  //   dateCre: Date,
  //   dateCloture: Date ,
  //   motifcloture: string ,
  //   typeTraitement: string
  // ) {
  //   super(idDossier, dateDebut, dateExpiration, etatDossier, dateCre, dateCloture, motifcloture);
  //   this.typeTraitement = typeTraitement;
  // }
    constructor() {
      super();
    }
}