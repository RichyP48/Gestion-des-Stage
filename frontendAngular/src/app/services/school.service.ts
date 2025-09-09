import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface School {
  id: number;
  name: string;
  description?: string;
  address?: string;
  website?: string;
}

export interface Faculty {
  id: number;
  name: string;
  description?: string;
  school: School;
}

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  constructor(private apiService: ApiService) {}

  getAllSchools(): Observable<School[]> {
    return this.apiService.get<School[]>('/schools');
  }

  getFacultiesBySchool(schoolId: number): Observable<Faculty[]> {
    return this.apiService.get<Faculty[]>(`/schools/${schoolId}/faculties`);
  }
}