import { Routes } from '@angular/router';



import { AppAssistantVirtuelSideBar } from './AssistantVirtuelSideBar/assistantVirtuelSideBar.component';
import { AuthGuard } from 'src/app/Guards/auth-guards.guard';


export const ExtraRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'AssistantVirtuelSideBar',
        component: AppAssistantVirtuelSideBar, 
        // canActivate: [AuthGuard]
      },
    ],
  },
];
