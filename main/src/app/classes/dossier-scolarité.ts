import { DossierDelegue } from "./dossier-delegue";
import { EtatDoss } from "./etat-doss";
import { PieceJustificative } from "./piece-justificative";

export class DossierScolarite extends DossierDelegue {
  niveauEtude!: string;
  dateProlongation!: string;
  piecesJustificatives: PieceJustificative[] = [];

// 
 constructor() {
    super(); 
  }


}