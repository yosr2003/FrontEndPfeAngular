import { DossierDelegue } from "./dossier-delegue";
import { EtatDoss } from "./etat-doss";

export class DossierFormationProfessionnelle extends DossierDelegue{
  nomFormation!: string;
  //  constructor(
  //   idDossier: string,
  //   dateDebut: Date,
  //   dateExpiration: Date,
  //   etatDossier: EtatDoss,
  //   dateCre: Date,
  //   dateCloture: Date ,
  //   motifcloture: string ,
  //   nomFormation: string
  // ) {
  //   super(idDossier, dateDebut, dateExpiration, etatDossier, dateCre, dateCloture, motifcloture);
  //   this.nomFormation = nomFormation;
  // }
    constructor() {
      super();
    }

}