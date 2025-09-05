import { CommonModule } from '@angular/common';
import { Component, OnInit, NgModule } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { OfferService } from '../../../services/offer.service';
import { InternshipOffer, InternshipOfferStatus } from '../../../models/offer.model';
import { UserRole } from '../../../models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'] 
})
export class HomePageComponent implements OnInit {
  offers: InternshipOffer[] = [];
  filteredOffers: InternshipOffer[] = [];
  page: number = 0;
  size: number = 6;
  loading: boolean = false;
  userRole: UserRole | null = null;
  searchText: string = '';

  get isLoggedIn(): boolean {
    try {
      return this.authService.isLoggedIn();
    } catch (error) {
      console.error('Erreur dans isLoggedIn:', error);
      return false;
    }
  }

  constructor(private authService: AuthService, private offerService: OfferService, private router: Router) {
    this.loadOffers();
    console.log('HomePageComponent initialisé');
    if (this.authService.isLoggedIn()) {
      this.userRole = this.authService.getCurrentUserRole();
      console.log('Rôle utilisateur:', this.userRole);
    }
  }

  redirectToOffers() {
    if (this.authService.isLoggedIn()) {
      if (this.userRole) {
        this.router.navigate([`/${this.userRole.toLowerCase()}/offers`], { queryParams: { role: this.userRole } });
      } else {
        console.error('Le rôle de l\'utilisateur est introuvable.');
        alert('Erreur: rôle utilisateur introuvable.');
      }
    } else {
      alert('Veuillez vous connecter pour accéder aux offres de stage.');
      this.router.navigate(['/auth/login']);
    }
  }

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.loading = true; 
    this.offerService.getOffers(this.page, this.size).subscribe({
      next: (data) => {
        console.log('Offres chargées avec succès:', data);
        this.offers = data.content; 
        this.filteredOffers = this.offers; 
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des offres:', error);
        this.loading = false;
      }
    });

   
    // setTimeout(() => {
    //   this.offers = [
    //     { 
    //       id: 1, 
    //       title: 'Développeur Frontend', 
    //       domain: 'Informatique', 
    //       companyName: 'Tech Co.', 
    //       location: 'Paris', 
    //       duration: '6 mois',
    //       description: 'Développement d\'applications web.', 
    //       status:  InternshipOfferStatus.OPEN, 
    //       createdAt: new Date().toISOString(), 
    //       updatedAt: new Date().toISOString(), 
    //       companyId: 1
    //     },
    //     { 
    //       id: 2, 
    //       title: 'Designer UI/UX', 
    //       domain: 'Design', 
    //       companyName: 'Creative Inc.', 
    //       location: 'Lyon', 
    //       duration: '3 mois',
    //       description: 'Conception d\'interfaces utilisateurs.', 
    //       status: InternshipOfferStatus.CLOSED, 
    //       createdAt: new Date().toISOString(), 
    //       updatedAt: new Date().toISOString(), 
    //       companyId: 2 
    //     },
    //     { 
    //       id: 3, 
    //       title: 'Analyste de données', 
    //       domain: 'Data Science', 
    //       companyName: 'Data Solutions', 
    //       location: 'Marseille', 
    //       duration: '12 mois',
    //       description: 'Analyse des données pour des décisions stratégiques.', 
    //       status: InternshipOfferStatus.FILLED, 
    //       createdAt: new Date().toISOString(), 
    //       updatedAt: new Date().toISOString(), 
    //       companyId: 3 
    //     },
    //     { 
    //       id: 4, 
    //       title: 'Marketing Digital', 
    //       domain: 'Marketing', 
    //       companyName: 'Market Experts', 
    //       location: 'Bordeaux', 
    //       duration: '6 mois',
    //       description: 'Gestion des campagnes de marketing digital.', 
    //       status: InternshipOfferStatus.FILLED, 
    //       createdAt: new Date().toISOString(), 
    //       updatedAt: new Date().toISOString(), 
    //       companyId: 4 
    //     },
    //     { 
    //       id: 5, 
    //       title: 'Gestion de projet', 
    //       domain: 'Management', 
    //       companyName: 'Business Corp.', 
    //       location: 'Toulouse', 
    //       duration: '9 mois',
    //       description: 'Coordination des projets d\'entreprise.', 
    //       status: InternshipOfferStatus.FILLED, 
    //       createdAt: new Date().toISOString(), 
    //       updatedAt: new Date().toISOString(), 
    //       companyId: 5 
    //     },
    //     { 
    //       id: 6, 
    //       title: 'Développeur Backend', 
    //       domain: 'Informatique', 
    //       companyName: 'Web Solutions', 
    //       location: 'Nantes', 
    //       duration: '6 mois',
    //       description: 'Développement de services backend.', 
    //       status: InternshipOfferStatus.FILLED, 
    //       createdAt: new Date().toISOString(), 
    //       updatedAt: new Date().toISOString(), 
    //       companyId: 6 
    //     }
    //   ];
    //   this.filteredOffers = this.offers; 
    //   this.loading = false;
    // }, 1000);
  }

  onSearchChange() {
    if (this.searchText) {
      this.filteredOffers = this.offers.filter(offer =>
        offer.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        offer.domain.toLowerCase().includes(this.searchText.toLowerCase()) ||
        offer.companyName.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredOffers = this.offers; 
    }
  }

  loadNextPage(): void {
    this.page++;
    this.loadOffers();
  }

  loadPreviousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadOffers();
    }
  }
}
