export class CompteBancaire {
    NumeroCompte: string;
    Montant: number;
    Banque: string;
    BIC:string;
    Pays:string;
    codePays:number;
    constructor(NumeroCompte: string,
        Montant: number,
        Banque: string,
        BIC:string,
        Pays:string,
        codePays:number) {
            this.NumeroCompte=NumeroCompte;
            this.Montant = Montant;
            this.Banque = Banque;
            this.BIC = BIC;
            this.Pays = Pays;
            this.codePays = codePays;
        }

}
