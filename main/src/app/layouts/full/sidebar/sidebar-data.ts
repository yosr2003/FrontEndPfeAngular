import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Maison',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid', 
    route: '/dashboard',
  },
  {
    navCap: 'Composants',
  },
  {
    displayName: 'Dossiers délégués',
    iconName: 'folder', 
    route: '/ui-components/dossiersDelegues',
  },
  {
    displayName: 'Transactions',
    iconName: 'file-dollar',
    route: '/ui-components/transactions',
  },
  {
    navCap: 'Support',
  },
  {
    displayName: 'Assistant virtuel',
    iconName: 'robot',
    route: '/extra/AssistantVirtuelSideBar',
  },



  {
    navCap: 'Auth',
  },
  {
    displayName: 'Login',
    iconName: 'login',
    route: '/authentication',
    children: [
      {
        displayName: 'Login',
        iconName: 'point',
        route: '/authentication/login',
      },
    
    ],
  },
  {
    displayName: 'Register',
    iconName: 'user-plus',
    route: '/authentication',
    children: [
      {
        displayName: 'Register',
        iconName: 'point',
        route: '/authentication/register',
      },
      
    ],
  },
 
  
];
