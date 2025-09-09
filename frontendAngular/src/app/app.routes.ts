import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { DashboardLayoutComponent } from './core/layout/dashboard-layout/dashboard-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { UserRole } from './models/user.model';

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
    canActivate: [AuthGuard],
    data: { roles: [UserRole.STUDENT] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/student/pages/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent) },
      { path: 'applications', loadComponent: () => import('./components/student/pages/student-applications/student-applications.component').then(m => m.StudentApplicationsComponent) },
      { path: 'agreements', loadComponent: () => import('./components/student/pages/student-agreements/student-agreements.component').then(m => m.StudentAgreementsComponent) },
      { path: 'apply/:id', loadComponent: () => import('./components/student/submit-application/submit-application.component').then(m => m.SubmitApplicationComponent) },
      { path: 'test', loadComponent: () => import('./components/student/student-test.component').then(m => m.StudentTestComponent) }
    ]
  },
  {
    path: 'company',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: [UserRole.COMPANY] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/company/pages/company-dashboard/company-dashboard.component').then(m => m.CompanyDashboardComponent) },
      { path: 'offers', loadComponent: () => import('./components/company/company-offers/company-offers.component').then(m => m.CompanyOffersComponent) },
      { path: 'applications', loadComponent: () => import('./components/company/pages/company-applications/company-applications.component').then(m => m.CompanyApplicationsComponent) }, 
      { path: 'agreements', loadComponent: () => import('./components/company//pages/company-agreements/company-agreements.component').then(m => m.CompanyAgreementsComponent)},
      { path: 'reports', loadComponent: () => import('./components/company/pages/company-reports/company-reports.component').then(m => m.CompanyReportsComponent)},
    ]
  },
  {
    path: 'faculty',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: [UserRole.FACULTY] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/faculty/pages/faculty-dashboard/faculty-dashboard.component').then(m => m.FacultyDashboardComponent) },
      { path: 'students', loadComponent: () => import('./components/faculty/faculty-students/faculty-students.component').then(m => m.FacultyStudentsComponent) },
      { path: 'companies', loadComponent: () => import('./components/faculty/pages/faculty-companies/faculty-companies.component').then(m => m.FacultyCompaniesComponent) },
      { path: 'agreements', loadComponent: () => import('./components/faculty/pages/faculty-agreements/faculty-agreements.component').then(m => m.FacultyAgreementsComponent) },
      { path: 'reports', loadComponent: () => import('./components/faculty/faculty-reports/faculty-reports.component').then(m => m.FacultyReportsComponent) }
    ]
  },
  {
    path: 'admin',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: [UserRole.ADMIN] },
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'users', loadComponent: () => import('./components/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'companies', loadComponent: () => import('./components/admin/admin-company/admin-company.component').then(m => m.AdminCompanyComponent) },
      { path: 'settings', loadComponent: () => import('./components/admin/admin-setting/admin-setting.component').then(m => m.AdminSettingComponent) },
      { path: 'reports', loadComponent: () => import('./components/admin/admin-reports/admin-reports.component').then(m => m.AdminReportsComponent) }
    ]
  },

  {
    path: 'offers',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', loadComponent: () => import('./components/offers/offers-list.component').then(m => m.OffersListComponent) }
    ]
  },
  {
    path: 'profile', 
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', loadComponent: () => import('./components/student/pages/student-profile/student-profile.component').then(m => m.StudentProfileComponent) }
    ]
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./core/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
