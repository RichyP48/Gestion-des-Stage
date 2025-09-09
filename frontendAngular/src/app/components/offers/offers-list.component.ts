import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InternshipService } from '../../services/internship.service';
import { NotificationService } from '../../services/notification.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-offers-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border  p-6">
        <h1 class="text-2xl font-bold text-primary-900">Offres de stage</h1>
        
        <!-- Filtres -->
        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input [(ngModel)]="searchTerm" (input)="filterOffers()" 
                 placeholder="Rechercher..." 
                 class="border border-gray-300 rounded-md px-3 py-2">
          <select [(ngModel)]="selectedLocation" (change)="filterOffers()" 
                  class="border border-gray-300 rounded-md px-3 py-2">
            <option value="">Toutes les villes</option>
            <option *ngFor="let location of locations" [value]="location">{{location}}</option>
          </select>
          <select [(ngModel)]="selectedDuration" (change)="filterOffers()" 
                  class="border border-gray-300 rounded-md px-3 py-2">
            <option value="">Toutes les durées</option>
            <option value="3">3 mois</option>
            <option value="6">6 mois</option>
            <option value="12">12 mois</option>
          </select>
        </div>
      </div>
      
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div *ngFor="let offer of filteredOffers" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex justify-between items-start mb-2">
      <span class="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{{ offer.domain }}</span>
      <button class="text-gray-400 hover:text-red-500">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      </button>
    </div>
    <h3 class="text-xl mb-1 font-bold text-primary-900">{{ offer.title }}</h3>
    <p class="text-gray-600">Entreprise: {{ offer.companyName }}</p>
    <div class="space-y-3 my-4">
         <p class="text-sm text-gray-700 mb-4 line-clamp-3">{{offer.description}}</p>
      <div class="flex items-center text-sm text-gray-600">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        {{ offer.location }}
      </div>
      <div class="flex items-center justify-between text-sm text-gray-600">
        <div class="flex items-center mr-4">
           <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Durée: {{ offer.duration }}
        </div>
       
         <span [ngClass]="getStatusClass(offer.statut)" class="px-2 py-1 rounded-full text-xs">
              {{offer.statut}}
            </span>
      </div>
      <div class="flex items-center justify-end text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
              {{offer.salaire}}FCFA/mois
            </div>
    </div>  
        
          
          <div class="flex space-x-2">
            <button (click)="viewDetails(offer)" 
                    class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm">
              Voir détails
            </button>
            <a [routerLink]="['/student/apply', offer.id]" 
               class="flex-1 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 text-sm text-center">
              Postuler
            </a>
          </div>
        </div>
      </div>
      
      <div *ngIf="filteredOffers.length === 0" class="text-center py-12">
        <p class="text-gray-500">Aucune offre trouvée</p>
      </div>
    </div>

    <!-- Modal détails offre -->
    <div *ngIf="selectedOffer" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-semibold">{{selectedOffer.titre}}</h3>
          <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <h4 class="font-medium text-gray-900">Entreprise</h4>
            <p class="text-gray-600">{{selectedOffer.companyName}}</p>
          </div>
           <!-- <div>
            <h4 class="font-medium text-gray-900">Domaine</h4>
            <p class="text-gray-600">{{selectedOffer.domain}}</p>
          </div> -->
          
          <div>
            <h4 class="font-medium text-gray-900">Description</h4>
            <p class="text-gray-600">{{selectedOffer.description}}</p>
          </div>
          
          <div>
            <h4 class="font-medium text-gray-900">Compétences requises</h4>
            <p class="text-gray-600">{{selectedOffer.competencesRequises}}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium text-gray-900">Lieu</h4>
              <p class="text-gray-600">{{selectedOffer.lieu}}</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">Durée</h4>
              <p class="text-gray-600">{{selectedOffer.duree}} mois</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">Salaire</h4>
              <p class="text-gray-600">{{selectedOffer.salaire}}€/mois</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">Date de début</h4>
              <p class="text-gray-600">{{selectedOffer.dateDebut | date:'dd/MM/yyyy'}}</p>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-2 mt-6">
          <button (click)="closeModal()" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
            Fermer
          </button>
          <button (click)="openApplicationModal(selectedOffer!)" class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
            Postuler
          </button>
        </div>
      </div>
    </div>

    <!-- Modal candidature -->
    <div *ngIf="showApplicationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 class="text-xl font-semibold mb-4">Postuler à l'offre</h3>
        <p class="text-gray-600 mb-4">{{selectedOffer?.titre}} - {{selectedOffer?.companyName}}</p>
        
        <form (ngSubmit)="submitApplication()">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Lettre de motivation</label>
            <textarea [(ngModel)]="applicationData.lettreMotivation" name="lettreMotivation" required
                      rows="6" placeholder="Expliquez pourquoi vous êtes intéressé par cette offre..."
                      class="w-full border border-gray-300 rounded-md px-3 py-2"></textarea>
          </div>
          
          <div class="flex justify-end space-x-2">
            <button type="button" (click)="closeApplicationModal()" 
                    class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" [disabled]="!applicationData.lettreMotivation.trim()"
                    class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50">
              Envoyer candidature
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    h1, h2, h3, h4{
    font-family: 'Merriweather', serif;
}
p, a, li, span, div, input, button{
    font-family: 'Poppins', sans-serif;
}
  `
})
export class OffersListComponent implements OnInit {
  offers: any[] = [];
  filteredOffers: any[] = [];
  selectedOffer: any = null;
  showApplicationModal = false;
  applicationData = {
    lettreMotivation: ''
  };
  
  searchTerm = '';
  selectedLocation = '';
  selectedDuration = '';
  locations: string[] = [];

  constructor(
    private internshipService: InternshipService,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {
    console.log('🚀 OffersListComponent constructor appelé');
  }

  ngOnInit() {
    console.log('🚀 OffersListComponent ngOnInit() appelé');
    // Test d'abord les endpoints publics
    this.testPublicEndpoints();
    this.loadOffers();
  }

  testPublicEndpoints() {
    console.log('=== TEST DES ENDPOINTS PUBLICS ===');
    
    // Test skills
    console.log('Appel vers /api/skills...');
    this.http.get('http://localhost:8080/api/skills').subscribe({
      next: (data) => console.log('✅ Skills reçues:', data),
      error: (error) => console.error('❌ Erreur skills:', error)
    });
    
    // Test domains
    console.log('Appel vers /api/domains...');
    this.http.get('http://localhost:8080/api/domains').subscribe({
      next: (data) => console.log('✅ Domains reçues:', data),
      error: (error) => console.error('❌ Erreur domains:', error)
    });
    
    // Test offers
    console.log('Appel vers /api/offers...');
    this.http.get('http://localhost:8080/api/offers').subscribe({
      next: (data) => console.log('✅ Offers reçues:', data),
      error: (error) => console.error('❌ Erreur offers:', error)
    });
  }

  loadOffers() {
    console.log('Tentative de chargement des offres...');
    this.internshipService.getAllOffers().subscribe({
      next: (data) => {
        console.log('Données reçues du backend:', data);
        // Spring Boot Page structure: {content: [], totalElements: x, ...}
        this.offers = data.content || data;
        this.filteredOffers = [...this.offers];
        this.locations = [...new Set(this.offers.map((o: any) => o.location || o.lieu))];
        console.log('Offres traitées:', this.offers);
      },
      error: (error) => {
        console.error('Erreur complète:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        this.notificationService.showError('Erreur lors du chargement des offres: ' + error.message);
      }
    });
  }

  filterOffers() {
    this.filteredOffers = this.offers.filter(offer => {
      const matchesSearch = !this.searchTerm || 
        offer.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        offer.companyName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesLocation = !this.selectedLocation || offer.lieu === this.selectedLocation;
      const matchesDuration = !this.selectedDuration || offer.duree.toString() === this.selectedDuration;
      
      return matchesSearch && matchesLocation && matchesDuration;
    });
  }

  viewDetails(offer: any) {
    this.selectedOffer = offer;
  }

  applyToOffer(offer: any) {
    this.openApplicationModal(offer);
  }

  closeModal() {
    this.selectedOffer = null;
  }

  openApplicationModal(offer: any) {
    this.selectedOffer = offer;
    this.showApplicationModal = true;
    this.applicationData.lettreMotivation = '';
    this.closeModal(); // Fermer le modal de détails
  }

  closeApplicationModal() {
    this.showApplicationModal = false;
    this.selectedOffer = null;
    this.applicationData.lettreMotivation = '';
  }

  submitApplication() {
    if (!this.selectedOffer || !this.applicationData.lettreMotivation.trim()) {
      return;
    }

    const dummyCv = new File(['CV content'], 'cv.pdf', { type: 'application/pdf' });

    this.internshipService.createApplication(
      this.selectedOffer.id,
      this.applicationData.lettreMotivation,
      dummyCv
    ).subscribe({
      next: () => {
        this.notificationService.showSuccess('Candidature envoyée avec succès');
        this.closeApplicationModal();
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.notificationService.showError('Erreur lors de l\'envoi de la candidature');
      }
    });
  }

  getStatusClass(status: string): string {
    const classes = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'INACTIVE': 'bg-gray-100 text-gray-800',
      'EXPIRED': 'bg-red-100 text-red-800'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }
}