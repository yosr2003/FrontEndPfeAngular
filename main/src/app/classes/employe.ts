import { ERole } from "./role";

export class Employe {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  MotDePasse: string;
  role: ERole;

  constructor(id: number, nom: string, prenom: string, email: string, motDePasse: string) {
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
    this.MotDePasse = motDePasse;

  }
}
