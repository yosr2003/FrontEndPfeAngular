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
  constructor(private TransfertService: TransfertService,private sanitizer: DomSanitizer,private http: HttpClient) {
}
  ngOnInit() {
  
    // this.TransfertService.getAllTransferts().subscribe(data => {
    //   console.log('transferts reçus depuis le backend:', data);
    //   this.Transferts = data;
    // });
    const transfertId = 'TSC792766'; // mets ici un ID existant

    this.http.get(`http://localhost:8084/Swift/${transfertId}`, {
      responseType: 'blob' // on attend un fichier binaire (PDF)
    }).subscribe({
      next: (pdfBlob) => {
        const blobUrl = URL.createObjectURL(pdfBlob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      },
      error: (err) => {
        console.error("Erreur lors de la récupération du PDF", err);
      }
    });
  
  
}
}
