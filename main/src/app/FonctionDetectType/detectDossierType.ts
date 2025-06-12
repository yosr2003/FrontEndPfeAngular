import { DossierContratCommercial } from "../classes/dossier-contrat-commercial";
import { DossierDelegue } from "../classes/dossier-delegue";
import { DossierEconomieSurSalaire } from "../classes/dossier-economie-sur-salaire";
import { DossierEmpreint } from "../classes/dossier-empreint";
import { DossierFormationProfessionnelle } from "../classes/dossier-formation-professionnelle";
import { DossierInvestissement } from "../classes/dossier-investissement";
import { DossierScolarite } from "../classes/dossier-scolarité";
import { DossierSoinMedical } from "../classes/dossier-soin-medical";


export function detectDossierType(obj: any): DossierDelegue {
  if ('niveauEtude' in obj) {
    return Object.assign(new DossierScolarite(), obj);
  }
  if ('montantEmpreint' in obj) {
    return Object.assign(new DossierEmpreint(), obj);
  }
  if ('montantMensuel' in obj) {
    return Object.assign(new DossierEconomieSurSalaire(), obj);
  }
  if ('montantContrat' in obj) {
    return Object.assign(new DossierContratCommercial(), obj);
  }
  if ('nomFormation' in obj) {
    return Object.assign(new DossierFormationProfessionnelle(), obj);
  }
  if ('secteurActivité' in obj) {
    return Object.assign(new DossierInvestissement(), obj);
  }
  if ('typeTraitement' in obj) {
    return Object.assign(new DossierSoinMedical(), obj);
  }
  return Object.assign(new DossierDelegue(), obj); 
}
