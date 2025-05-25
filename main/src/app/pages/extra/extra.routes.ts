import { Routes } from '@angular/router';



import { AppAssistantVirtuelSideBar } from './AssistantVirtuelSideBar/assistantVirtuelSideBar.component';


export const ExtraRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'AssistantVirtuelSideBar',
        component: AppAssistantVirtuelSideBar,
      },
    ],
  },
];
