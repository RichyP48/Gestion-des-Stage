import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-faculty-students',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
        <h1 class="text-2xl font-bold text-primary-900 mb-2">Liste des Étudiants</h1>
        <p class="text-primary-600">{{students.length}} étudiants trouvés</p>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="bg-white rounded-lg shadow-sm border border-primary-200 p-8 text-center">
        <p>🔄 Chargement des étudiants...</p>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <p class="text-red-800">❌ {{error}}</p>
        <button (click)="loadStudents()" class="mt-2 bg-red-600 text-white px-4 py-2 rounded">
          Réessayer
        </button>
      </div>

      <!-- Students List -->
      <div *ngIf="!loading && !error" class="bg-white rounded-lg shadow-sm border border-primary-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-primary-900">Étudiants ({{students.length}})</h2>
        </div>

        <div *ngIf="students.length === 0" class="p-8 text-center">
          <p class="text-gray-500">👥 Aucun étudiant trouvé</p>
        </div>

        <div *ngIf="students.length > 0" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let student of students" class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-sm">
                    {{(student.firstName?.charAt(0) || '') + (student.lastName?.charAt(0) || '')}}
                  </span>
                </div>
                <div class="ml-3">
                  <h3 class="font-semibold text-gray-900">{{student.firstName}} {{student.lastName}}</h3>
                  <p class="text-gray-600 text-sm">{{student.email}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class FacultyStudentsComponent implements OnInit {
  students: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    console.log('🎓 FacultyStudentsComponent initialized');
  }

  ngOnInit(): void {
    console.log('📚 Loading students...');
    this.loadStudents();
  }

  loadStudents(): void {
    console.log('📋 Starting loadStudents...');
    
    // Vérifier l'authentification
    const currentUser = this.authService.getCurrentUser();
    console.log('👤 Current user:', currentUser);
    
    if (!currentUser) {
      console.error('❌ No authenticated user found');
      this.error = 'Utilisateur non authentifié';
      return;
    }

    this.loading = true;
    this.error = null;
    console.log('🚀 Calling UserService.getStudentsForFaculty...');

    this.userService.getStudentsForFaculty(0, 20).pipe(
      catchError(error => {
        console.error('❌ API Error:', error);
        console.log('🔄 Using fallback data...');
        
        // Fallback data
        return of({
          content: [
            {
              id: 1,
              firstName: 'Jean',
              lastName: 'Dupont',
              email: 'jean.dupont@student.fr',
              role: 'STUDENT',
              enabled: true
            },
            {
              id: 2,
              firstName: 'Marie',
              lastName: 'Martin',
              email: 'marie.martin@student.fr',
              role: 'STUDENT',
              enabled: true
            }
          ],
          totalElements: 2
        });
      })
    ).subscribe({
      next: (data) => {
        console.log('📦 Raw API response:', data);
        
        const allUsers = data.content || data;
        console.log('📄 All users:', allUsers);
        
        if (Array.isArray(allUsers)) {
          this.students = allUsers.filter((user: any) => {
            console.log('🔍 Checking user:', user.email, 'Role:', user.role);
            return user.role === 'STUDENT';
          });
        } else {
          console.error('❌ allUsers is not an array:', typeof allUsers);
          this.students = [];
        }
        
        console.log('✅ Filtered students:', this.students);
        console.log('📊 Final count:', this.students.length);
        
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Subscribe error:', error);
        this.error = 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }


}