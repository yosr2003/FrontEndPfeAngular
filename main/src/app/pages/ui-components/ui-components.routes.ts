import { Routes } from '@angular/router';

import { AppDossiersDeleguesComponent, } from './dossiersDelegues/dossiersDelegues.component';
import { AppTransactionComponent } from './transactions/transaction.component';
import { AuthGuard } from 'src/app/Guards/auth-guards.guard';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dossiersDelegues',
        component: AppDossiersDeleguesComponent, canActivate: [AuthGuard]
      },
      {
        path: 'transactions',
        component: AppTransactionComponent, canActivate: [AuthGuard]
      },
      
      
    ],
  },
];
