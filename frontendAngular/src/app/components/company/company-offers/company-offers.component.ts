import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OfferService } from '../../../services/offer.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-company-offers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border  p-6">
        <h1 class="text-2xl font-bold text-primary-900">Mes offres de stage</h1>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border  p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-primary-900">Liste des offres</h2>
          <button (click)="openAddOfferModal()" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Créer une offre
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let offer of offers" class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <!-- Card Header -->
            <div class="p-4 border-b">
              <div class="flex justify-between items-start">
                <h3 class="text-lg font-semibold text-gray-900 truncate">{{ offer.title }}</h3>
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  [ngClass]="{
                    'bg-green-100 text-green-800': offer.status === 'ACTIVE',
                    'bg-red-100 text-red-800': offer.status === 'INACTIVE',
                    'bg-yellow-100 text-yellow-800': offer.status === 'EXPIRED'
                  }"
                >
                  {{ getStatusLabel(offer.status) }}
                </span>
              </div>
            </div>
            
            <!-- Card Body -->
            <div class="p-4 flex-grow">
              <div class="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ offer.location }}
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ offer.duration }} mois
                </div>
                <div class="flex items-center col-span-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  {{ offer.domain }}
                </div>
              </div>
              
              <p class="text-sm text-gray-600 mb-4 line-clamp-3">{{ offer.description }}</p>
              
              <div *ngIf="offer.requiredSkills" class="mb-4">
                <p class="text-xs text-gray-500 mb-1">Compétences requises:</p>
                <div class="flex flex-wrap gap-1">
                  <span *ngFor="let skill of getSkillsArray(offer.requiredSkills)" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Card Footer -->
            <div class="p-4 border-t bg-gray-50">
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500">
                  Créée: {{ formatDate(offer.createdAt) }}
                </span>
                <div class="flex space-x-2">
                  <button (click)="viewApplications(offer)" class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                    Candidatures
                  </button>
                  <button (click)="deleteOffer(offer)" class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

    <!-- Modal Créer Offre -->
    <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">Créer une nouvelle offre</h3>
        
        <form (ngSubmit)="saveOffer()" #offerForm="ngForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Titre</label>
              <input [(ngModel)]="currentOffer.title" name="titre" required 
                     class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
             <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Domaine</label>
              <input [(ngModel)]="currentOffer.domain" name="titre" required 
                     class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea [(ngModel)]="currentOffer.description" name="description" required rows="3"
                        class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Lieu</label>
              <input [(ngModel)]="currentOffer.location" name="lieu" required 
                     class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
        </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Durée (mois)</label>
              <input [(ngModel)]="currentOffer.duration" name="duree"  required 
                     class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Date de début</label>
              <input [(ngModel)]="currentOffer.startDate" name="dateDebut" type="date" required 
                     class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Salaire (€/mois)</label>
              <input [(ngModel)]="currentOffer.salaire" name="salaire" type="number" 
                     class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Compétences requises</label>
              <input [(ngModel)]="currentOffer.requiredSkills" name="competencesRequises" required 
                     class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
          </div>
          
          <div class="flex justify-end space-x-2 mt-6">
            <button type="button" (click)="closeModal()" 
                    class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" [disabled]="!offerForm.form.valid" 
                    class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50">
              Créer l'offre
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class CompanyOffersComponent implements OnInit {
  offers: any[] = [];
  showModal = false;
  currentOffer: any = this.getEmptyOffer();

  constructor(
    private offerService: OfferService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  getSkillsArray(skills: string): string[] {
    if (!skills) return [];
    return skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  }

  ngOnInit() {
    this.loadOffers();
  }

  loadOffers() {
    this.offerService.getCompanyOffers().subscribe({
      next: (response: any) => {
        console.log('Company offers response:', response);
        this.offers = response.content || response || [];
        console.log('Loaded offers:', this.offers);
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des offres:', error);
        this.notificationService.showError('Erreur lors du chargement des offres');
      }
    });
  }

  openAddOfferModal() {
    this.currentOffer = this.getEmptyOffer();
    this.showModal = true;
  }

  saveOffer() {
    // Les données sont déjà dans le bon format

    this.offerService.createOffer(this.currentOffer).subscribe({
      next: () => {
        this.loadOffers();
        this.closeModal();
        this.notificationService.showSuccess('Offre créée avec succès');
      },
      error: (error: any) => {
        console.error('Erreur lors de la création:', error);
        this.notificationService.showError('Erreur lors de la création de l\'offre');
      }
    });
    }

  closeModal() {
    this.showModal = false;
    this.currentOffer = this.getEmptyOffer();
  }

  getStatusLabel(status: string): string {
    const labels = {
      'ACTIVE': 'Actif',
      'INACTIVE': 'Inactif',
      'EXPIRED': 'Expiré'
    };
    return labels[status as keyof typeof labels] || status;
  }

  viewApplications(offer: any): void {
    this.router.navigate(['/company/applications'], { queryParams: { offerId: offer.id } });
  }

  deleteOffer(offer: any): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'offre "${offer.title}" ?`)) {
      this.offerService.deleteOffer(offer.id).subscribe({
        next: () => {
          this.offers = this.offers.filter(o => o.id !== offer.id);
          this.notificationService.showSuccess('Offre supprimée avec succès');
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression:', error);
          this.notificationService.showError('Erreur lors de la suppression de l\'offre');
        }
      });
    }
  }

  private getEmptyOffer(): any {
    return {
      title: '',
      description: '',
      requiredSkills: '',
      duration: '',
      startDate: new Date(),
      dateFin: new Date(),
      salaire: 0,
      location: '',
      domain: '',
      companyId: 0,
      statut: 'ACTIVE'
    };
  }
}