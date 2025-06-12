import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { DossierDelegueService } from 'src/app/services/dossier-delegue.service';
import { DossierDelegue } from 'src/app/classes/dossier-delegue';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './dossiersDelegues.component.html',
  styleUrls: ['./dossiersDelegues.component.scss'],
})
export class AppDossiersDeleguesComponent implements OnInit {
  displayedColumns: string[] = [
    'idDossier',
    'dateDebut',
    'dateExpiration',
    'etatDossier',
    'dateCre',
    'dateCloture',
    'motifcloture',

  ];

  DossiersDelegues: DossierDelegue[] = [];

  constructor(private DossierDelegueService: DossierDelegueService) {}

  ngOnInit() {
    this.DossierDelegueService.getAllDossiers().subscribe((dossiers) => {
      console.log('Dossiers reçus depuis le backend:', dossiers);
      this.DossiersDelegues = dossiers;
    });
  }
}
