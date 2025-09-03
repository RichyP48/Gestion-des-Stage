import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../services/application.service';
import { OfferService } from '../../services/offer.service';
import { AgreementService } from '../../services/agreement.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-white rounded-lg shadow">
      <h2 class="text-xl font-bold mb-4">🧪 Test des APIs Étudiant</h2>
      
      <div class="space-y-4">
        <button (click)="testApplications()" 
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Tester API Candidatures
        </button>
        
        <button (click)="testOffers()" 
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Tester API Offres
        </button>
        
        <button (click)="testAgreements()" 
                class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
          Tester API Conventions
        </button>
        
        <button (click)="testProfile()" 
                class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
          Tester API Profil
        </button>
      </div>
      
      <div *ngIf="results" class="mt-6 p-4 bg-gray-100 rounded">
        <h3 class="font-bold">Résultats:</h3>
        <pre>{{ results | json }}</pre>
      </div>
    </div>
  `
})
export class StudentTestComponent implements OnInit {
  results: any = null;

  constructor(
    private applicationService: ApplicationService,
    private offerService: OfferService,
    private agreementService: AgreementService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('🧪 StudentTestComponent initialized');
    console.log('👤 Current user:', this.authService.getCurrentUser());
  }

  testApplications(): void {
    console.log('🧪 Testing Applications API...');
    this.applicationService.getStudentApplications(0, 10).subscribe({
      next: (data) => {
        console.log('✅ Applications API success:', data);
        this.results = { type: 'applications', data };
      },
      error: (error) => {
        console.error('❌ Applications API error:', error);
        this.results = { type: 'applications', error: error.message };
      }
    });
  }

  testOffers(): void {
    console.log('🧪 Testing Offers API...');
    this.offerService.getOffers(0, 10).subscribe({
      next: (data) => {
        console.log('✅ Offers API success:', data);
        this.results = { type: 'offers', data };
      },
      error: (error) => {
        console.error('❌ Offers API error:', error);
        this.results = { type: 'offers', error: error.message };
      }
    });
  }

  testAgreements(): void {
    console.log('🧪 Testing Agreements API...');
    this.agreementService.getStudentAgreements(0, 10).subscribe({
      next: (data) => {
        console.log('✅ Agreements API success:', data);
        this.results = { type: 'agreements', data };
      },
      error: (error) => {
        console.error('❌ Agreements API error:', error);
        this.results = { type: 'agreements', error: error.message };
      }
    });
  }

  testProfile(): void {
    console.log('🧪 Testing Profile API...');
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        console.log('✅ Profile API success:', data);
        this.results = { type: 'profile', data };
      },
      error: (error) => {
        console.error('❌ Profile API error:', error);
        this.results = { type: 'profile', error: error.message };
      }
    });
  }
}