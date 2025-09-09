import { Routes } from '@angular/router';

export const COMPANY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/company-dashboard/company-dashboard.component').then(m => m.CompanyDashboardComponent)
  },
  {
    path: 'offers',
    loadComponent: () => import('./pages/company-offers/company-offers.component').then(m => m.CompanyOffersComponent)
  },
  {
    path: 'offers/create',
    loadComponent: () => import('./pages/company-offer-create/company-offer-create.component').then(m => m.CompanyOfferCreateComponent)
  },
  {
    path: 'offers/:id/edit',
    loadComponent: () => import('./pages/company-offer-edit/company-offer-edit.component').then(m => m.CompanyOfferEditComponent)
  },
  {
    path: 'applications',
    loadComponent: () => import('./pages/company-applications/company-applications.component').then(m => m.CompanyApplicationsComponent)
  },
  {
    path: 'applications/:id',
    loadComponent: () => import('./pages/company-application-detail/company-application-detail.component').then(m => m.CompanyApplicationDetailComponent)
  },
  {
    path: 'agreements',
    loadComponent: () => import('./pages/company-agreements/company-agreements.component').then(m => m.CompanyAgreementsComponent)
  },
  {
    path: 'agreements/:id',
    loadComponent: () => import('./pages/company-agreement-detail/company-agreement-detail.component').then(m => m.CompanyAgreementDetailComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/company-reports/company-reports.component').then(m => m.CompanyReportsComponent)
  }
];
