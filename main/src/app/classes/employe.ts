export class Employe {
    id: Number;
    nom: String;
    prenom:String;
    email:String;
    MotDePasse:String;
    Role:String;
    constructor(id: Number,
            nom: String,
            prenom: String,
            email: String,
            MotDePasse:String,
            Role:String) {
            this.id=id;
            this.nom = nom;
            this.prenom = prenom;
            this.email = email;
            this.MotDePasse = MotDePasse;
            this.Role = Role;
        }
}
