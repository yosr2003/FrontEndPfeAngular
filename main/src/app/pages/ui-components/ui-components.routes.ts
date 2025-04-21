import { Routes } from '@angular/router';

import { AppDossiersDeleguesComponent, } from './dossiersDelegues/dossiersDelegues.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dossiersDelegues',
        component: AppDossiersDeleguesComponent,
      },
      {
        path: 'transactions',
        component: AppDossiersDeleguesComponent,
      },
      
    ],
  },
];
