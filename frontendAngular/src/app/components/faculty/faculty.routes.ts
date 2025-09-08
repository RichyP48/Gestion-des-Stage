import { Routes } from '@angular/router';

export const FACULTY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/faculty-dashboard/faculty-dashboard.component').then(m => m.FacultyDashboardComponent)
  },
  {
    path: 'students',
    loadComponent: () => import('./pages/faculty-students/faculty-students.component').then(m => m.FacultyStudentsComponent)
  },
  {
    path: 'companies',
    loadComponent: () => import('./pages/faculty-companies/faculty-companies.component').then(m => m.FacultyCompaniesComponent)
  },
  {
    path: 'agreements',
    loadComponent: () => import('./pages/faculty-agreements/faculty-agreements.component').then(m => m.FacultyAgreementsComponent)
  },
  {
    path: 'agreements/:id',
    loadComponent: () => import('./pages/faculty-agreement-detail/faculty-agreement-detail.component').then(m => m.FacultyAgreementDetailComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./faculty-reports/faculty-reports.component').then(m => m.FacultyReportsComponent)
  }
];
