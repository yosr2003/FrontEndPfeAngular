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
  constructor(private TransfertService: TransfertService) {
}
  ngOnInit() {
  
    this.TransfertService.getAllTransferts().subscribe(data => {
      console.log('transferts reçus depuis le backend:', data);
      this.Transferts = data;
    });
  
}
}
