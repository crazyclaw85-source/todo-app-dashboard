import { NavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Todos',
    url: '/dashboard/todos',
    icon: 'kanban',
    isActive: false,
    shortcut: ['t', 't'],
    items: []
  }
];
