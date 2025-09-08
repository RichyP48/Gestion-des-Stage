import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User, UserRole } from '../../../models/user.model';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],

})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  showModal = false;
  isEditing = false;
  currentUser: User = this.getEmptyUser();

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  // loadUsers() {
  //   this.userService.getAllUsers().subscribe({
  //     next: (users) => this.users = users,
  //     error: (error) => {
  //       console.error('Erreur lors du chargement des utilisateurs:', error);
  //       this.notificationService.error('Erreur lors du chargement des utilisateurs');
  //     }
  //   });
  // }
loadUsers() {
  this.userService.getAllUsers().subscribe({
    next: (res) => {
      console.log('✅ Type de res.content:', typeof res.content);
      console.log('✅ instanceof Array:', res.content instanceof Array);
      console.log('✅ Array.isArray:', Array.isArray(res.content));
      console.log('✅ Données:', res.content);
      this.users = Array.isArray(res.content) ? res.content : [];
    },
    error: (error) => {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      this.notificationService.showError('Erreur lors du chargement des utilisateurs');
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
          this.notificationService.showSuccess('Utilisateur modifié avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          this.notificationService.showError('Erreur lors de la modification de l\'utilisateur');
        }
      });
    } else {
      this.userService.createUser(this.currentUser).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
          this.notificationService.showSuccess('Utilisateur créé avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.notificationService.showError('Erreur lors de la création de l\'utilisateur');
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
      
    };
  }
}