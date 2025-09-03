import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-faculty-students',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
        <h1 class="text-2xl font-bold text-primary-900">Gestion des étudiants</h1>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
        <h2 class="text-lg font-semibold text-primary-900 mb-4">Liste des étudiants</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-primary-50">
              <tr>
                <th class="px-4 py-3 text-left text-primary-900">Nom</th>
                <th class="px-4 py-3 text-left text-primary-900">Email</th>
                <th class="px-4 py-3 text-left text-primary-900">Téléphone</th>
                <th class="px-4 py-3 text-left text-primary-900">Statut</th>
                <th class="px-4 py-3 text-left text-primary-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let student of students" class="border-b border-primary-100">
                <td class="px-4 py-3">{{student.prenom}} {{student.nom}}</td>
                <td class="px-4 py-3">{{student.email}}</td>
                <td class="px-4 py-3">{{student.telephone}}</td>
                <td class="px-4 py-3">
                  <span [ngClass]="student.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                        class="px-2 py-1 rounded-full text-sm">
                    {{student.actif ? 'Actif' : 'Inactif'}}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <button class="text-primary-600 hover:text-primary-800 mr-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button class="text-blue-600 hover:text-blue-800">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class FacultyStudentsComponent implements OnInit {
  students: User[] = [];

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.userService.getAllUsers().subscribe({
      next: (users: any) => this.students = users.filter((u: any) => u.role === 'STUDENT'),
      error: (error) => {
        console.error('Erreur lors du chargement des étudiants:', error);
        this.notificationService.error('Erreur lors du chargement des étudiants');
      }
    });
  }
}