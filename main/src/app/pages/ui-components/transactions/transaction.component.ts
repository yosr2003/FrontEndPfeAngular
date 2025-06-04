import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Transfert } from 'src/app/classes/transfert';
import { TransfertService } from 'src/app/services/transfert.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TokenStorageService } from 'src/app/services/token-storage-service.service';

@Component({
  selector: 'app-tables',
  imports: [
    MatTableModule,
    CommonModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class AppTransactionComponent {
  pdfUrl: SafeResourceUrl | null = null;
displayedColumns: string[] = [
   'refTransfert',
           'etat',
           'natureOperation',
           'montantTransfert',
           'natureTransfert',
           'montantFinal',
           'frais',
           'datecre',
           'dateEnvoie',
           'typeTransfert',
           'typeFrais',
           'compteSource',
           'compteCible'
  ];
  Transferts!: Transfert[];
  constructor(private TransfertService: TransfertService,private sanitizer: DomSanitizer,private http: HttpClient,private tokenStorage: TokenStorageService) {
}
  ngOnInit() {
  
    // this.TransfertService.getAllTransferts().subscribe(data => {
    //   console.log('transferts reçus depuis le backend:', data);
    //   this.Transferts = data;
    // });
    const transfertId = 'TSC792766'; // mets ici un ID existant
    let url=`http://localhost:8085/etatDeclaration/consulter?typeDeclaration=ACHAT_BIEN&trimestre=T2`;
    this.http.get(url, {
  headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` },
  responseType: 'blob',
  observe: 'response'
}).subscribe({
  next: (response) => {
    const contentType = response.headers.get('Content-Type');
    console.log("Content-Type reçu :", contentType);
    

    const blobUrl = URL.createObjectURL(response.body!);
    console.log("URL du blob PDF :", blobUrl);
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);

    
    console.log("URL sécurisée Angular :", this.pdfUrl);
  },
  error: (err) => {
    console.error("Erreur lors de la récupération du PDF", err);
  }
});

  
  
}
}
