import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';

import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { TransfertService } from 'src/app/services/transfert.service';
import { Transfert } from 'src/app/classes/transfert';

export interface monthlyChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
}

@Component({
  selector: 'app-monthly-earnings',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule],
  templateUrl: './monthly-earnings.component.html',
})
export class AppMonthlyEarningsComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public monthlyChart!: Partial<monthlyChart> | any;

  public nbTransfertsCeMois: number = 0;
  public evolutionPourcent: number = 0;

  constructor(private transfertService: TransfertService) {}

  ngOnInit(): void {
    this.loadData();
  
  }

  loadData(): void {
  const now = new Date();
  const anneeActuelle = now.getFullYear();
  const moisActuel = now.getMonth();

  const nbJoursDansMois = new Date(anneeActuelle, moisActuel + 1, 0).getDate();
  const transfertsParJour = new Array(nbJoursDansMois).fill(0);

  this.transfertService.getAllTransferts().subscribe((transferts: Transfert[]) => {
    transferts.forEach((t) => {
      const date = new Date(t.datecre);
      const jour = date.getDate();
      const mois = date.getMonth();
      const annee = date.getFullYear();

      if (mois === moisActuel && annee === anneeActuelle) {
        transfertsParJour[jour - 1]++;
      }
    });

    this.nbTransfertsCeMois = transfertsParJour.reduce((a, b) => a + b, 0);

    this.updateChartSeriesParJour(transfertsParJour, nbJoursDansMois);
  });
}


updateChartSeriesParJour(data: number[], nbJours: number): void {
  const jours = Array.from({ length: nbJours }, (_, i) => `${i + 1}`);

  this.monthlyChart = {
    series: [
      {
        name: 'Transferts / jour',
        color: '#49BEFF',
        data: data,
      },
    ],
    chart: {
      type: 'line', // ou 'area' ou 'bar'
      height: 250,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: jours,
      title: {
        text: 'Jour du mois',
      },
    },
    yaxis: {
      title: {
        text: 'Nombre de transferts',
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + " transferts";
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 200,
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };
}
}