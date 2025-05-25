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

 
  
 
  
];
