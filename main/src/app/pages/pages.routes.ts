import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';
import { AuthGuard } from '../Guards/auth-guards.guard';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent, canActivate: [AuthGuard],
    data: {
      title: 'Starter Page',
      urls: [
        { title: 'Dashboard', url: '/dashboards/dashboard1' },
        { title: 'Starter Page' },
      ],
    },
  },
];
