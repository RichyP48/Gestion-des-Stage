import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { DashboardLayoutComponent } from './core/layout/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
  {
    path: 'home',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomePageComponent }
    ]
  },
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) }
    ]
  },
  {
    path: 'student',
    component: DashboardLayoutComponent,
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/student/pages/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent) },
      { path: 'applications', loadComponent: () => import('./components/student/pages/student-applications/student-applications.component').then(m => m.StudentApplicationsComponent) },
      { path: 'agreements', loadComponent: () => import('./components/student/pages/student-agreements/student-agreements.component').then(m => m.StudentAgreementsComponent) },
      { path: 'apply/:id', loadComponent: () => import('./components/student/submit-application/submit-application.component').then(m => m.SubmitApplicationComponent) }
    ]
  },
  {
    path: 'company',
    component: DashboardLayoutComponent,
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/company/pages/company-dashboard/company-dashboard.component').then(m => m.CompanyDashboardComponent) },
      { path: 'offers', loadComponent: () => import('./components/company/company-offers/company-offers.component').then(m => m.CompanyOffersComponent) },
      { path: 'applications', loadComponent: () => import('./components/company/pages/company-dashboard/company-dashboard.component').then(m => m.CompanyDashboardComponent) },
      { path: 'agreements', loadComponent: () => import('./components/company/pages/company-dashboard/company-dashboard.component').then(m => m.CompanyDashboardComponent) }
    ]
  },
  {
    path: 'faculty',
    component: DashboardLayoutComponent,
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/faculty/pages/faculty-dashboard/faculty-dashboard.component').then(m => m.FacultyDashboardComponent) },
      { path: 'students', loadComponent: () => import('./components/faculty/faculty-students/faculty-students.component').then(m => m.FacultyStudentsComponent) },
      { path: 'companies', loadComponent: () => import('./components/faculty/pages/faculty-dashboard/faculty-dashboard.component').then(m => m.FacultyDashboardComponent) },
      { path: 'agreements', loadComponent: () => import('./components/faculty/pages/faculty-dashboard/faculty-dashboard.component').then(m => m.FacultyDashboardComponent) },
      { path: 'reports', loadComponent: () => import('./components/faculty/pages/faculty-dashboard/faculty-dashboard.component').then(m => m.FacultyDashboardComponent) }
    ]
  },
  {
    path: 'admin',
    component: DashboardLayoutComponent,
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'users', loadComponent: () => import('./components/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'companies', loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'settings', loadComponent: () => import('./components/admin/admin-setting/admin-setting.component').then(m => m.AdminSettingComponent) },
      { path: 'reports', loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) }
    ]
  },
  {
    path: 'test',
    loadComponent: () => import('./test.component').then(m => m.TestComponent)
  },
  {
    path: 'offers',
    component: DashboardLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./components/offers/offers-list.component').then(m => m.OffersListComponent) }
    ]
  },
  {
    path: 'profile', 
    component: DashboardLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./components/student/pages/student-profile/student-profile.component').then(m => m.StudentProfileComponent) }
    ]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];
