import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexPlotOptions,
  ApexResponsive,
  ApexNonAxisChartSeries,
  NgApexchartsModule,
  ChartComponent
} from 'ng-apexcharts';

import { MaterialModule } from 'src/app/material.module';
import { DossierDelegueService } from 'src/app/services/dossier-delegue.service';
import { DossierDelegue } from 'src/app/classes/dossier-delegue';
import { EtatDoss } from 'src/app/classes/etat-doss';

export interface yearlyChart {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  colors: string[];
  labels: string[];
}

@Component({
  selector: 'app-suivi-dossiers',
  templateUrl: './suivi-dossiers.component.html',
  standalone: true,
  imports: [MaterialModule, NgApexchartsModule, TablerIconsModule],
  encapsulation: ViewEncapsulation.None,
})
export class AppSuiviDossiersComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  public statusChart: yearlyChart | null = null;

  public totalDossiers2025 = 0;
  public pourcentageClotures = 0;
  public pourcentageEnCours = 0;
  public variationCloture = 0;

  constructor(private dossierService: DossierDelegueService) {}

  ngOnInit(): void {
    this.loadDossierStatus();
  }

  loadDossierStatus(): void {
    this.dossierService.getAllDossiers().subscribe((dossiers: DossierDelegue[]) => {
      const currentYear = new Date().getFullYear();

      const dossiers2025 = dossiers.filter(d => new Date(d.dateCre).getFullYear() === currentYear);
      const dossiers2024 = dossiers.filter(d => new Date(d.dateCre).getFullYear() === currentYear - 1);

      const clotures2025 = dossiers2025.filter(d => d.dateCloture != null).length;
      const clotures2024 = dossiers2024.filter(d => d.dateCloture != null).length;

      this.totalDossiers2025 = dossiers2025.length;

      this.pourcentageClotures = this.totalDossiers2025 > 0
        ? Math.round((clotures2025 / this.totalDossiers2025) * 100)
        : 0;

      this.pourcentageEnCours = 100 - this.pourcentageClotures;

      this.variationCloture = clotures2024 === 0
        ? 100
        : Math.round(((clotures2025 - clotures2024) / clotures2024) * 100);

      const etats = Object.values(EtatDoss);
      const counts: Record<string, number> = {};

      etats.forEach(etat => counts[etat] = 0);

      dossiers2025.forEach(d => {
        const etat = d.etatDossier as EtatDoss;
        if (etat in counts) {
          counts[etat]++;
        }
      });

      const labels = Object.keys(counts);
      const total = dossiers2025.length || 1;
      const series = labels.map(label => Math.round((counts[label] / total) * 100));

      this.statusChart = {
        series,
        labels,
        chart: {
          width: 125,
          type: 'donut',
          fontFamily: 'inherit',
          foreColor: '#adb0bb',
        },
        plotOptions: {
          pie: {
            donut: {
              size: '75%',
              labels: {
                show: true,
                total: {
                  show: true,
                  label: 'Total',
                  formatter: () => `${this.totalDossiers2025}`
                }
              }
            },
          },
        },
        stroke: {
          show: false,
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        colors: ['#13DEB9', '#FFAE1F', '#5D87FF', '#FF4C51', '#A461D8', '#00C292'],
        tooltip: {
          theme: 'dark',
          fillSeriesColor: false,
        },
        responsive: [
          {
            breakpoint: 991,
            options: {
              chart: {
                width: 120,
              },
            },
          },
        ],
      };
    });
  }
}
