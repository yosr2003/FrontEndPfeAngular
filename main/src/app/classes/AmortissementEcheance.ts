

export class AmortissementEcheance {
  idAmortissementEch: number;
  principalEch: number;
  interet: number;
  dateEch: Date;
  autreCharge: number;
  flgTrait: boolean;
  flgValid: boolean;
  constructor(data?: Partial<AmortissementEcheance>) {
    this.idAmortissementEch = data?.idAmortissementEch ?? 0;
    this.principalEch = data?.principalEch ?? 0;
    this.interet = data?.interet ?? 0;
    this.dateEch = data?.dateEch ? new Date(data.dateEch) : new Date();
    this.autreCharge = data?.autreCharge ?? 0;
    this.flgTrait = data?.flgTrait ?? false;
    this.flgValid = data?.flgValid ?? false;

  }
}
