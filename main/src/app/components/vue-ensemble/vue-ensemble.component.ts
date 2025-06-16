import { Component, ViewChild, OnInit } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexResponsive,
} from 'ng-apexcharts';

import { DossierDelegueService } from 'src/app/services/dossier-delegue.service';
import { DossierDelegue } from 'src/app/classes/dossier-delegue';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

interface Month {
  value: string; // format "MM-YYYY"
  viewValue: string; // format "Juin 2025"
}

export interface SalesOverviewChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  markers: ApexMarkers;
  responsive: ApexResponsive[];
  colors: string[];
}

@Component({
  selector: 'app-vue-ensemble',
  standalone: true,
  templateUrl: './vue-ensemble.component.html',
  imports: [
    NgApexchartsModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
  ],
})
export class AppVueEnsembleComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  public salesOverviewChart: SalesOverviewChart = {
    series: [],
    chart: {
      type: 'bar',
      height: 390,
      offsetX: 0,
      toolbar: { show: false },
      foreColor: '#adb0bb',
      fontFamily: 'inherit',
      sparkline: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '35%',
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: 'category',
      categories: [],
      labels: { style: { cssClass: '' } },
    },
    yaxis: {
      show: true,
      min: 0,
      tickAmount: 4,
      labels: { style: { cssClass: '' } },
    },
    fill: { type: 'solid' },
    tooltip: { theme: 'light' },
    stroke: {
      show: true,
      width: 3,
      lineCap: 'butt',
      colors: ['#5D87FF'],
    },
    legend: { show: false },
    grid: {
      borderColor: '#e0e0e0',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
    },
    markers: { size: 0 },
    responsive: [],
    colors: ['#5D87FF'],
  };

  months: Month[] = [];
  selectedMonth: string = '';

  constructor(private dossierService: DossierDelegueService) {}

  ngOnInit(): void {
    this.dossierService.getAllDossiers().subscribe((dossiers: DossierDelegue[]) => {
      this.generateAvailableMonths(dossiers);
      this.selectedMonth = this.months[this.months.length - 1]?.value || '';
      this.updateChart(dossiers);
    });
  }

  onMonthChange(newMonth: string): void {
    this.selectedMonth = newMonth;
    this.dossierService.getAllDossiers().subscribe((dossiers) => {
      this.updateChart(dossiers);
    });
  }

  private updateChart(dossiers: DossierDelegue[]): void {
    const filtered = dossiers.filter(d =>
      this.getMonthKey(new Date(d.dateCre)) === this.selectedMonth
    );

    const counts = this.countDossierTypes(filtered);
    const labels = Object.keys(counts);
    const values = Object.values(counts);

    this.salesOverviewChart = {
      ...this.salesOverviewChart,
      series: [{ name: 'Nombre de dossiers', data: values }],
      xaxis: {
        type: 'category',
        categories: labels,
        labels: {
          style: { cssClass: 'grey--text lighten-2--text fill-color' },
        },
      },
      yaxis: {
        show: true,
        min: 0,
        tickAmount: 4,
        labels: {
          style: { cssClass: 'grey--text lighten-2--text fill-color' },
        },
      },
    };
  }

  private generateAvailableMonths(dossiers: DossierDelegue[]): void {
    const monthMap = new Map<string, string>();
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
    ];

    dossiers.forEach(d => {
      const date = new Date(d.dateCre);
      const key = this.getMonthKey(date);
      const label = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthMap.set(key, label);
    });

    // Tri des mois (du plus ancien au plus récent)
    this.months = Array.from(monthMap.entries())
      .sort((a, b) => {
        const [ma, ya] = a[0].split('-').map(Number);
        const [mb, yb] = b[0].split('-').map(Number);
        return ya === yb ? ma - mb : ya - yb;
      })
      .map(([value, viewValue]) => ({ value, viewValue }));
  }

  private getMonthKey(date: Date): string {
    return `${date.getMonth()}-${date.getFullYear()}`; 
  }

  private countDossierTypes(dossiers: DossierDelegue[]): { [key: string]: number } {
    const counts: { [key: string]: number } = {};

    const typeMap: { [key: string]: string } = {
      DossierScolarite: 'Scolarité',
      DossierEmpreint: 'Emprunt extérieur',
      DossierEconomieSurSalaire: 'Économie sur salaire',
      DossierContratCommercial: 'Contrat commercial',
      DossierFormationProfessionnelle: 'Formation personnelle',
      DossierInvestissement: 'Investissement',
      DossierSoinMedical: 'Soin médical',
      DossierDelegue: 'Autre',
    };

    dossiers.forEach((dossier) => {
      const type = dossier.constructor.name;
      const readableType = typeMap[type] || type;
      counts[readableType] = (counts[readableType] || 0) + 1;
    });

    return counts;
  }
}
