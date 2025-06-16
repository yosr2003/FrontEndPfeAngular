import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AppVueEnsembleComponent } from 'src/app/components/vue-ensemble/vue-ensemble.component';



import { ApptransactionsParMoisComponent } from 'src/app/components/transactionsParMois/transactionsParMois.component';
import { AppSuiviDossiersComponent } from 'src/app/components/suivi-dossiers/suivi-dossiers.component';




@Component({
  selector: 'app-starter',
  imports: [
    MaterialModule,
    AppVueEnsembleComponent,
  AppSuiviDossiersComponent,
    ApptransactionsParMoisComponent,



  ],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent { }