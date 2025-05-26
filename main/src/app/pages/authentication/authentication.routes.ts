import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './side-login/side-login.component';
import { AuthGuard } from 'src/app/Guards/auth-guards.guard';


export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',component: AppSideLoginComponent
      }
    ],
  },
];
