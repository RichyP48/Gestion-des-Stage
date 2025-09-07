import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'applications',
    loadComponent: () => import('./pages/student-applications/student-applications.component').then(m => m.StudentApplicationsComponent)
  },
  {
    path: 'applications/:id',
    loadComponent: () => import('./pages/student-application-detail/student-application-detail.component').then(m => m.StudentApplicationDetailComponent)
  },
  {
    path: 'agreements',
    loadComponent: () => import('./pages/student-agreements/student-agreements.component').then(m => m.StudentAgreementsComponent)
  },
  {
    path: 'agreements/:id',
    loadComponent: () => import('./pages/student-agreement-detail/student-agreement-detail.component').then(m => m.StudentAgreementDetailComponent)
  }
];
