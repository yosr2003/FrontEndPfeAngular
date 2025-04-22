import { EtatDoss } from "./etat-doss";
import { TypeDossier } from "./type-dossier";

export class DossierDelegue {
    idDossier: string;
    dateDebut: Date;
    dateExpiration: Date;
    etatDoss: EtatDoss;
    dateCre:Date;
    dateClo:Date;
    motifClo:Date;
    motifProlong:string;
    typeDoss:TypeDossier;
    rapportMouvement:string;
    

    constructor(idDossier: string,
        dateDebut: Date,
        dateExpiration: Date,
        etatDoss: EtatDoss,
        dateCre:Date,
        dateClo:Date,
        motifClo:Date,
        motifProlong:string,
        typeDoss:TypeDossier,
        rapportMouvement:string) {
            this.idDossier=idDossier;
        this.dateDebut = dateDebut;
        this.dateExpiration = dateExpiration;
        this.etatDoss = etatDoss;
        this.dateCre = dateCre;
        this.dateClo = dateClo;
        this.motifClo = motifClo;
        this.motifProlong = motifProlong;
        this.typeDoss = typeDoss;
        this.rapportMouvement = rapportMouvement;
    }
}
