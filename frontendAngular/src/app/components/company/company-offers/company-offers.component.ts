import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InternshipService } from '../../../services/internship.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-company-offers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
        <h1 class="text-2xl font-bold text-primary-900">Mes offres de stage</h1>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-primary-900">Liste des offres</h2>
          <button (click)="openAddOfferModal()" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Créer une offre
          </button>
        </div>
        
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div *ngFor="let offer of offers" class="border border-gray-200 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-primary-900">{{offer.titre}}</h3>
              <span [ngClass]="getStatusClass(offer.statut)" class="px-2 py-1 rounded-full text-xs">
                {{offer.statut}}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-2">{{offer.lieu}} • {{offer.duree}} mois</p>
            <p class="text-sm text-gray-700 mb-4 line-clamp-2">{{offer.description}}</p>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-primary-600">{{offer.salaire}}€/mois</span>
              <button class="text-primary-600 hover:text-primary-800 text-sm">
                Voir candidatures
              </button>
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
              <input [(ngModel)]="currentOffer.titre" name="titre" required 
                     class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea [(ngModel)]="currentOffer.description" name="description" required rows="3"
                        class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Lieu</label>
              <input [(ngModel)]="currentOffer.lieu" name="lieu" required 
                     class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Durée (mois)</label>
              <input [(ngModel)]="currentOffer.duree" name="duree" type="number" required 
                     class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Date de début</label>
              <input [(ngModel)]="currentOffer.dateDebut" name="dateDebut" type="date" required 
                     class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Salaire (€/mois)</label>
              <input [(ngModel)]="currentOffer.salaire" name="salaire" type="number" 
                     class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Compétences requises</label>
              <input [(ngModel)]="currentOffer.competencesRequises" name="competencesRequises" required 
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
  styles: `
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `
})
export class CompanyOffersComponent implements OnInit {
  offers: any[] = [];
  showModal = false;
  currentOffer: any = this.getEmptyOffer();

  constructor(
    private internshipService: InternshipService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadOffers();
  }

  loadOffers() {
    this.internshipService.getAllOffers().subscribe({
      next: (offers: any) => this.offers = offers.filter((o: any) => o.companyId === 1),
      error: (error: any) => {
        console.error('Erreur lors du chargement des offres:', error);
        this.notificationService.error('Erreur lors du chargement des offres');
      }
    });
  }

  openAddOfferModal() {
    this.currentOffer = this.getEmptyOffer();
    this.showModal = true;
  }

  saveOffer() {
    this.currentOffer.companyId = 1;
    this.currentOffer.companyName = 'TechCorp';
    
    const startDate = new Date(this.currentOffer.dateDebut);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + this.currentOffer.duree);
    this.currentOffer.dateFin = endDate;

    this.internshipService.createOffer(this.currentOffer).subscribe({
      next: () => {
        this.loadOffers();
        this.closeModal();
        this.notificationService.success('Offre créée avec succès');
      },
      error: (error: any) => {
        console.error('Erreur lors de la création:', error);
        this.notificationService.error('Erreur lors de la création de l\'offre');
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.currentOffer = this.getEmptyOffer();
  }

  getStatusClass(status: string): string {
    const classes = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'INACTIVE': 'bg-gray-100 text-gray-800',
      'EXPIRED': 'bg-red-100 text-red-800'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  private getEmptyOffer(): any {
    return {
      titre: '',
      description: '',
      competencesRequises: '',
      duree: 6,
      dateDebut: new Date(),
      dateFin: new Date(),
      salaire: 0,
      lieu: '',
      companyId: 0,
      statut: 'ACTIVE'
    };
  }
}