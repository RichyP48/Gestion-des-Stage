import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./admin-users/admin-users.component').then(m => m.AdminUsersComponent)
  },
  {
    path: 'users/:id',
    loadComponent: () => import('./admin-user-detail/admin-user-detail.component').then(m => m.AdminUserDetailComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./admin-setting/admin-setting.component').then(m => m.AdminSettingComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./admin-reports/admin-reports.component').then(m => m.AdminReportsComponent)
  },
  {
    path: 'agreements',
    loadComponent: () => import('./admin-agreements/admin-agreements.component').then(m => m.AdminAgreementsComponent)
  }
];
