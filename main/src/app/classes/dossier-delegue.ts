import { EtatDoss } from "./etat-doss";


export class DossierDelegue {
    idDossier: string;
    dateDebut: Date;
    dateExpiration: Date;
    etatDoss: EtatDoss;
    dateCre:Date;
    dateClo:Date;
    motifClo:string;

    

    constructor(idDossier: string,
        dateDebut: Date,
        dateExpiration: Date,
        etatDoss: EtatDoss,
        dateCre:Date,
        dateClo:Date,
        motifClo:string,
   ) {
            this.idDossier=idDossier;
        this.dateDebut = dateDebut;
        this.dateExpiration = dateExpiration;
        this.etatDoss = etatDoss;
        this.dateCre = dateCre;
        this.dateClo = dateClo;
        this.motifClo = motifClo;

    }
}
