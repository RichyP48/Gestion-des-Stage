import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User, UserRole } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { NotificationService } from '../../../services/notification.service';


@Component({
  selector: 'app-admin-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
    template: `
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border  p-6">
        <h1 class="text-2xl font-bold text-primary-900">Gestion des utilisateurs</h1>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border  p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-primary-900">Liste des utilisateurs</h2>
          <button (click)="openAddUserModal()" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Ajouter utilisateur
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-primary-50">
              <tr>
                <th class="px-4 py-3 text-left text-primary-900">Nom</th>
                <th class="px-4 py-3 text-left text-primary-900">Email</th>
                <th class="px-4 py-3 text-left text-primary-900">Rôle</th>
                <th class="px-4 py-3 text-left text-primary-900">Statut</th>
                <th class="px-4 py-3 text-left text-primary-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users" class="border-b border-primary-100">
                <td class="px-4 py-3">{{user.firstName}} {{user.lastName}}</td>
                <td class="px-4 py-3">{{user.email}}</td>
                <td class="px-4 py-3">
                  <span [ngClass]="getRoleClass(user.role)" class="px-2 py-1 rounded-full text-sm">
                    {{user.role}}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span [ngClass]="user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                        class="px-2 py-1 rounded-full text-sm">
                    {{user.enabled ? 'Actif' : 'Inactif'}}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <button (click)="editUser(user)" class="text-primary-600 hover:text-primary-800 mr-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button (click)="toggleUserStatus(user)" class="text-orange-600 hover:text-orange-800 mr-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                    </svg>
                  </button>
                  <button (click)="deleteUser(user)" class="text-red-600 hover:text-red-800">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Ajouter/Modifier Utilisateur -->
    <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">{{isEditing ? 'Modifier' : 'Ajouter'}} utilisateur</h3>
        
        <form (ngSubmit)="saveUser()" #userForm="ngForm">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">PrélastName</label>
              <input [(ngModel)]="currentUser.firstName" name="firstName" required 
                     class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">lastName</label>
              <input [(ngModel)]="currentUser.lastName" name="lastName" required 
                     class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input [(ngModel)]="currentUser.email" name="email" type="email" required 
                     class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Rôle</label>
              <select [(ngModel)]="currentUser.role" name="role" required 
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="STUDENT">Étudiant</option>
                <option value="COMPANY">Entreprise</option>
                <option value="FACULTY">Faculté</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Téléphone</label>
              <input [(ngModel)]="currentUser.phoneNumber" name="telephone" 
                     class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
          </div>
          
          <div class="flex justify-end space-x-2 mt-6">
            <button type="button" (click)="closeModal()" 
                    class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" [disabled]="!userForm.form.valid" 
                    class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50">
              {{isEditing ? 'Modifier' : 'Ajouter'}}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrl: './admin-user-detail.component.css'
})
export class AdminUserDetailComponent implements OnInit {
  userId: string | null = null;
  users: User[] = [];
  showModal = false;
  isEditing = false;
  currentUser: User = this.getEmptyUser();
  
  constructor(private route: ActivatedRoute,
     private userService: UserService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
     this.loadUsers();
    this.userId = this.route.snapshot.paramMap.get('id');
  }
    loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => this.users = users,
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        this.notificationService.error('Erreur lors du chargement des utilisateurs');
      }
    });
  }

  openAddUserModal() {
    this.isEditing = false;
    this.currentUser = this.getEmptyUser();
    this.showModal = true;
  }

  editUser(user: User) {
    this.isEditing = true;
    this.currentUser = { ...user };
    this.showModal = true;
  }

  saveUser() {
    if (this.isEditing && this.currentUser.id) {
      this.userService.updateUser(this.currentUser.id, this.currentUser).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
          this.notificationService.success('Utilisateur modifié avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          this.notificationService.error('Erreur lors de la modification de l\'utilisateur');
        }
      });
    } else {
      this.userService.createUser(this.currentUser).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
          this.notificationService.success('Utilisateur créé avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.notificationService.error('Erreur lors de la création de l\'utilisateur');
        }
      });
    }
  }

  deleteUser(user: User) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${user.firstName} ${user.lastName} ?`)) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => this.loadUsers(),
        error: (error) => console.error('Erreur lors de la suppression:', error)
      });
    }
  }

  toggleUserStatus(user: User) {
    // Temporairement désactivé - méthode non implémentée dans le service
    console.log('Toggle status pour:', user);
    // this.userService.toggleUserStatus(user.id!).subscribe({
    //   next: () => this.loadUsers(),
    //   error: (error: any) => console.error('Erreur lors du changement de statut:', error)
    // });
  }

  closeModal() {
    this.showModal = false;
    this.currentUser = this.getEmptyUser();
  }

  getRoleClass(role: string): string {
    const classes = {
      'STUDENT': 'bg-blue-100 text-blue-800',
      'COMPANY': 'bg-green-100 text-green-800',
      'FACULTY': 'bg-purple-100 text-purple-800',
      'ADMIN': 'bg-red-100 text-red-800'
    };
    return classes[role as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  private getEmptyUser(): User {
    return {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      role: UserRole.STUDENT,
      enabled: true,
      createdAt: '',
      updatedAt: '',
      phoneNumber: '',
      // Aliases
     
    };
  }
}

