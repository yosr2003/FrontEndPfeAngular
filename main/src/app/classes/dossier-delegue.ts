import { EtatDoss } from "./etat-doss";


export class DossierDelegue {
    idDossier: string;
    dateDebut: Date;
    dateExpiration: Date;
    etatDossier: EtatDoss;
    dateCre:Date;
    dateCloture:Date;
    motifcloture:string;

       
  constructor() {
    
  }
}
