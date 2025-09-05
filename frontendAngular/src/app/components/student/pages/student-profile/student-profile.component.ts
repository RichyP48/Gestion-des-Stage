import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../models/user.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border  p-6">
        <h1 class="text-2xl font-bold text-primary-900">Mon profil</h1>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-sm border  p-6">
          <div class="text-center">
            <div class="w-32 h-32 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl font-bold text-white">{{userInitials}}</span>
            </div>
            <h3 class="text-lg font-semibold text-primary-900">{{profile.prenom}} {{profile.nom}}</h3>
            <p class="text-sm text-gray-600">{{profile.role}}</p>
          </div>
        </div>
        
        <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border  p-6">
          <h2 class="text-lg font-semibold text-primary-900 mb-4">Informations personnelles</h2>
          
          <form (ngSubmit)="saveProfile()" #profileForm="ngForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Prénom</label>
                <input [(ngModel)]="profile.prenom" name="prenom" required 
                       class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Nom</label>
                <input [(ngModel)]="profile.nom" name="nom" required 
                       class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input [(ngModel)]="profile.email" name="email" type="email" required 
                       class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Téléphone</label>
                <input [(ngModel)]="profile.telephone" name="telephone" 
                       class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
              </div>
            </div>
            
            <div class="flex justify-end mt-6">
              <button type="submit" [disabled]="!profileForm.form.valid" 
                      class="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50">
                Sauvegarder
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class StudentProfileComponent implements OnInit {
  profile: any = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: 'STUDENT'
  };

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    console.log('👤 StudentProfileComponent initialized');
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    console.log('📄 Loading user profile...');
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('❌ No authenticated user found');
      return;
    }

    console.log('👤 Current user from auth:', currentUser);

    this.userService.getCurrentUser().pipe(
      catchError(error => {
        console.error('❌ Error loading profile from API:', error);
        // Return current user data as fallback
        return of({
          id: currentUser.id,
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          email: currentUser.email || '',
          role: currentUser.role,
          telephone: '',
          enabled: true,
          createdAt: '',
          updatedAt: ''
        });
      })
    ).subscribe({
      next: (user) => {
        console.log('✅ Profile loaded successfully:', user);
        this.profile = {
          id: user.id,
          nom: user.lastName || '',
          prenom: user.firstName || '',
          email: user.email || '',
          telephone: user.telephone || '',
          role: user.role
        };
        console.log('📝 Profile data mapped:', this.profile);
      },
      error: (error) => {
        console.error('❌ Unexpected error loading profile:', error);
      }
    });
  }

  saveProfile() {
    console.log('💾 Saving profile...', this.profile);
    
    if (!this.profile.id) {
      console.error('❌ No profile ID found');
      alert('Erreur: ID utilisateur manquant');
      return;
    }

    const updateData = {
      firstName: this.profile.prenom,
      lastName: this.profile.nom,
      email: this.profile.email,
      telephone: this.profile.telephone
    };

    console.log('📤 Sending update data:', updateData);

    this.userService.updateProfile(updateData).pipe(
      catchError(error => {
        console.error('❌ Error saving profile via API:', error);
        alert('Erreur lors de la sauvegarde du profil. Veuillez réessayer.');
        return of(null);
      })
    ).subscribe({
      next: (updatedUser) => {
        if (updatedUser) {
          console.log('✅ Profile saved successfully:', updatedUser);
          alert('Profil mis à jour avec succès!');
          
          // Update local profile with response data
          this.profile = {
            id: updatedUser.id,
            nom: updatedUser.lastName || '',
            prenom: updatedUser.firstName || '',
            email: updatedUser.email || '',
            telephone: updatedUser.telephone || '',
            role: updatedUser.role
          };
          
          console.log('🔄 Profile updated locally:', this.profile);
        }
      },
      error: (error) => {
        console.error('❌ Unexpected error saving profile:', error);
      }
    });
  }

  get userInitials(): string {
    return `${this.profile.prenom?.[0] || ''}${this.profile.nom?.[0] || ''}`.toUpperCase();
  }
}