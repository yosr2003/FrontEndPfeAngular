import { Routes } from '@angular/router';


// pages

import { AppSamplePageComponent } from './sample-page/sample-page.component';
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
