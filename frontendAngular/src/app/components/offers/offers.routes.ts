import { Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

export const OFFERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/offer-list/offer-list.component').then(m => m.OfferListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/offer-detail/offer-detail.component').then(m => m.OfferDetailComponent)
  },
  {
    path: ':id/apply',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/offer-apply/offer-apply.component').then(m => m.OfferApplyComponent)
  }
];
